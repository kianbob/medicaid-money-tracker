#!/usr/bin/env python3
"""
ML Fraud Detection — Memory-safe version
Extracts features in separate small queries, then trains model.
"""
import duckdb
import json
import os
import csv
import numpy as np

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OIG_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/oig-exclusions.csv")
OUT_DIR = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")
FEATURES_CSV = '/tmp/provider_features.csv'

con = duckdb.connect()

# Query 1: Basic totals per provider
print("Query 1/4: Basic totals...")
con.execute(f"""
COPY (
    SELECT
        BILLING_PROVIDER_NPI_NUM as npi,
        SUM(TOTAL_PAID) as total_paid,
        SUM(TOTAL_CLAIMS) as total_claims,
        SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
        COUNT(DISTINCT HCPCS_CODE) as code_count,
        COUNT(DISTINCT CLAIM_FROM_MONTH) as active_months,
        SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as cost_per_claim,
        SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_UNIQUE_BENEFICIARIES), 0) as cost_per_bene,
        SUM(TOTAL_CLAIMS) / NULLIF(SUM(TOTAL_UNIQUE_BENEFICIARIES), 0) as claims_per_bene,
        SUM(TOTAL_PAID) / NULLIF(COUNT(DISTINCT CLAIM_FROM_MONTH), 0) as paid_per_month,
        SUM(TOTAL_CLAIMS) / NULLIF(COUNT(DISTINCT CLAIM_FROM_MONTH), 0) as claims_per_month
    FROM '{PARQUET}'
    GROUP BY npi
    HAVING SUM(TOTAL_PAID) > 0
) TO '{FEATURES_CSV}' (HEADER, DELIMITER ',')
""")
print("  Done")

# Load features
import pandas as pd
features = pd.read_csv(FEATURES_CSV)
print(f"  {len(features):,} providers")

# Query 2: Top code concentration
print("Query 2/4: Top code concentration...")
con.execute(f"""
COPY (
    WITH code_totals AS (
        SELECT BILLING_PROVIDER_NPI_NUM as npi, HCPCS_CODE,
               SUM(TOTAL_PAID) as code_paid,
               ROW_NUMBER() OVER (PARTITION BY BILLING_PROVIDER_NPI_NUM ORDER BY SUM(TOTAL_PAID) DESC) as rn
        FROM '{PARQUET}'
        GROUP BY npi, HCPCS_CODE
    ),
    provider_totals AS (
        SELECT BILLING_PROVIDER_NPI_NUM as npi, SUM(TOTAL_PAID) as total
        FROM '{PARQUET}' GROUP BY npi
    )
    SELECT ct.npi, ct.code_paid / NULLIF(pt.total, 0) as top_code_concentration
    FROM code_totals ct
    JOIN provider_totals pt ON ct.npi = pt.npi
    WHERE ct.rn = 1
) TO '/tmp/top_code_conc.csv' (HEADER, DELIMITER ',')
""")
conc = pd.read_csv('/tmp/top_code_conc.csv')
features = features.merge(conc, on='npi', how='left')
print("  Done")

# Query 3: Self-billing ratio (sample-based to save memory)
print("Query 3/4: Self-billing ratio...")
con.execute(f"""
COPY (
    SELECT BILLING_PROVIDER_NPI_NUM as npi,
           AVG(CASE WHEN BILLING_PROVIDER_NPI_NUM = SERVICING_PROVIDER_NPI_NUM THEN 1.0 ELSE 0.0 END) as self_billing_ratio
    FROM '{PARQUET}'
    GROUP BY npi
) TO '/tmp/self_bill.csv' (HEADER, DELIMITER ',')
""")
sb = pd.read_csv('/tmp/self_bill.csv')
features = features.merge(sb, on='npi', how='left')
print("  Done")

# Query 4: Year-over-year growth
print("Query 4/4: Growth ratio...")
con.execute(f"""
COPY (
    WITH yearly AS (
        SELECT BILLING_PROVIDER_NPI_NUM as npi,
               LEFT(CLAIM_FROM_MONTH, 4) as yr,
               SUM(TOTAL_PAID) as yr_paid
        FROM '{PARQUET}'
        GROUP BY npi, LEFT(CLAIM_FROM_MONTH, 4)
    )
    SELECT npi,
           MAX(yr_paid) / NULLIF(MIN(CASE WHEN yr_paid > 100 THEN yr_paid END), 0) as max_growth_ratio
    FROM yearly
    GROUP BY npi
) TO '/tmp/growth.csv' (HEADER, DELIMITER ',')
""")
growth = pd.read_csv('/tmp/growth.csv')
features = features.merge(growth, on='npi', how='left')
print("  Done")
con.close()

# Add computed flags
features['short_burst'] = ((features['active_months'] <= 12) & (features['total_paid'] > 1e6)).astype(int)
features['low_code_high_bill'] = ((features['code_count'] <= 2) & (features['total_paid'] > 500000)).astype(int)

print(f"\nFinal feature matrix: {features.shape}")

# Load OIG labels
print("Loading OIG exclusion list...")
oig_npis = set()
with open(OIG_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row.get('NPI', '').strip()
        if npi and len(npi) == 10 and npi.isdigit():
            oig_npis.add(npi)
print(f"  {len(oig_npis):,} excluded NPIs")

features['is_excluded'] = features['npi'].astype(str).isin(oig_npis).astype(int)
excluded = features['is_excluded'].sum()
print(f"  {excluded} matched in our data")

# Define feature columns
feat_cols = ['total_paid', 'total_claims', 'total_benes', 'code_count',
    'cost_per_claim', 'cost_per_bene', 'claims_per_bene',
    'active_months', 'paid_per_month', 'claims_per_month',
    'top_code_concentration', 'self_billing_ratio',
    'max_growth_ratio', 'short_burst', 'low_code_high_bill']

X = features[feat_cols].replace([np.inf, -np.inf], np.nan).fillna(0)
y = features['is_excluded']

from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

if excluded >= 20:
    print(f"\nTraining SUPERVISED models ({excluded} positive labels)...")
    from sklearn.linear_model import LogisticRegression
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import cross_val_score
    
    for name, mdl in [
        ('logistic', LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)),
        ('random_forest', RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42, n_jobs=2, max_depth=10)),
    ]:
        print(f"  {name}...")
        try:
            cv = cross_val_score(mdl, X_scaled, y, cv=5, scoring='roc_auc')
            print(f"    AUC: {cv.mean():.4f} (+/- {cv.std():.4f})")
        except Exception as e:
            print(f"    Failed: {e}")
    
    # Use logistic regression (lighter weight)
    model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)
    model.fit(X_scaled, y)
    scores = model.predict_proba(X_scaled)[:, 1]
    
    cv_final = cross_val_score(model, X_scaled, y, cv=5, scoring='roc_auc')
    model_type = 'logistic_regression'
    model_auc = round(float(cv_final.mean()), 4)
    
    # Feature importance via coefficients
    importance = sorted(zip(feat_cols, np.abs(model.coef_[0])), key=lambda x: -x[1])
    print("\nTop features by |coefficient|:")
    for feat, imp in importance[:10]:
        print(f"  {feat}: {imp:.4f}")
else:
    print(f"\nOnly {excluded} labels — using UNSUPERVISED anomaly detection...")
    from sklearn.ensemble import IsolationForest
    
    model = IsolationForest(n_estimators=200, contamination=0.01, random_state=42, n_jobs=2)
    model.fit(X_scaled)
    raw = model.decision_function(X_scaled)
    from sklearn.preprocessing import MinMaxScaler
    scores = 1 - MinMaxScaler().fit_transform(raw.reshape(-1, 1)).ravel()
    
    model_type = 'isolation_forest'
    model_auc = None

features['ml_score'] = scores

# Output
features_sorted = features.sort_values('ml_score', ascending=False)
top_200 = []
for _, row in features_sorted.head(200).iterrows():
    entry = {
        'npi': str(row['npi']),
        'mlScore': round(float(row['ml_score']), 6),
        'totalPaid': float(row['total_paid']),
        'totalClaims': int(row['total_claims']),
        'totalBeneficiaries': int(row['total_benes']),
        'codeCount': int(row['code_count']),
        'costPerClaim': round(float(row['cost_per_claim']), 2) if not np.isnan(row['cost_per_claim']) else 0,
        'selfBillingRatio': round(float(row['self_billing_ratio']), 3) if not np.isnan(row['self_billing_ratio']) else 0,
        'topCodeConcentration': round(float(row['top_code_concentration']), 3) if not np.isnan(row['top_code_concentration']) else 0,
        'activeMonths': int(row['active_months']),
        'paidPerMonth': round(float(row['paid_per_month']), 0) if not np.isnan(row['paid_per_month']) else 0,
        'isExcluded': bool(row['is_excluded']),
    }
    top_200.append(entry)

output = {
    'modelType': model_type,
    'modelAuc': model_auc,
    'totalProviders': len(features),
    'featuresUsed': feat_cols,
    'topProviders': top_200,
    'scoreDistribution': {
        'p50': round(float(features['ml_score'].median()), 6),
        'p90': round(float(features['ml_score'].quantile(0.90)), 6),
        'p95': round(float(features['ml_score'].quantile(0.95)), 6),
        'p99': round(float(features['ml_score'].quantile(0.99)), 6),
        'p999': round(float(features['ml_score'].quantile(0.999)), 6),
    }
}

with open(os.path.join(OUT_DIR, 'ml-scores.json'), 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n=== RESULTS ===")
print(f"Model: {model_type}")
if model_auc: print(f"AUC: {model_auc}")
print(f"Providers scored: {len(features):,}")
print(f"Score distribution: {output['scoreDistribution']}")
print(f"\nTop 10:")
for p in top_200[:10]:
    print(f"  NPI {p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f} self_bill={p['selfBillingRatio']:.2f} codes={p['codeCount']} excluded={p['isExcluded']}")

# Cleanup
for f in [FEATURES_CSV, '/tmp/top_code_conc.csv', '/tmp/self_bill.csv', '/tmp/growth.csv']:
    try: os.remove(f)
    except: pass

print("\nDone!")
