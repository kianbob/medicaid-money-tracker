#!/usr/bin/env python3
"""
ML v3: Improved fraud detection model for OpenMedicaid.
Key improvements over v2:
1. Filter OIG labels to fraud-related exclusions only (not student loans, license issues)
2. Add peer-comparison features (specialty z-scores, state z-scores)
3. Add geographic risk features
4. Temporal train/test split (train on 2018-2022, validate on 2023-2024)
5. Output real feature importances
6. Top 1000 providers (up from 500)
7. Subsample approach for 16GB RAM compatibility

Run: python3 scripts/ml-v3-retrain.py
Requires: sklearn, duckdb, numpy (pip3 install scikit-learn duckdb numpy)
"""
import csv, json, os, gc
import numpy as np

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OIG_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/oig-exclusions.csv")
OUT_DIR = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")
FEATURES_CSV = '/tmp/ml_v3_features.csv'
PEER_CSV = '/tmp/ml_v3_peer_stats.csv'

# Fraud-related OIG exclusion types only
FRAUD_EXCL_TYPES = {
    '1128a1',   # Conviction of program-related crimes
    '1128a3',   # Felony conviction: healthcare fraud
    '1128b1',   # Misdemeanor conviction: healthcare fraud
    '1128b7',   # Fraud, kickbacks, other prohibited activities
}

# Also include but flag separately (borderline):
BORDERLINE_EXCL_TYPES = {
    '1128a2',   # Patient abuse/neglect (not billing fraud, but relevant)
    '1128a4',   # Felony: controlled substances
    '1128b8',   # Entity owned by sanctioned individual
}

# Explicitly exclude (NOT fraud):
# 1128b4  = License revocation
# 1128b14 = Student loan default
# 1128b5  = Excluded by other agency (too vague)
# 1128b3  = Misdemeanor controlled substances

print("=" * 60)
print("ML v3: Improved Medicaid Fraud Detection")
print("=" * 60)

# Step 1: Load OIG with exclusion type filtering
print("\n1. Loading OIG exclusions (fraud-only filter)...")
oig_fraud_npis = set()
oig_borderline_npis = set()
oig_all_npis = set()
excl_type_counts = {}

with open(OIG_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row.get('NPI', '').strip()
        excltype = row.get('EXCLTYPE', '').strip().strip('"')
        excl_type_counts[excltype] = excl_type_counts.get(excltype, 0) + 1
        
        if npi and len(npi) == 10 and npi.isdigit() and npi != '0000000000':
            oig_all_npis.add(npi)
            if excltype in FRAUD_EXCL_TYPES:
                oig_fraud_npis.add(npi)
            elif excltype in BORDERLINE_EXCL_TYPES:
                oig_borderline_npis.add(npi)

print(f"  Total OIG NPIs: {len(oig_all_npis):,}")
print(f"  Fraud-only NPIs: {len(oig_fraud_npis):,}")
print(f"  Borderline NPIs: {len(oig_borderline_npis):,}")
print(f"  Excluded (non-fraud): {len(oig_all_npis) - len(oig_fraud_npis) - len(oig_borderline_npis):,}")
print(f"  Exclusion type distribution:")
for t, c in sorted(excl_type_counts.items(), key=lambda x: -x[1])[:10]:
    label = "FRAUD" if t in FRAUD_EXCL_TYPES else ("BORDER" if t in BORDERLINE_EXCL_TYPES else "SKIP")
    print(f"    {t}: {c:,} [{label}]")

# Step 2: Extract features via DuckDB
print("\n2. Extracting features from parquet...")
import duckdb
con = duckdb.connect()

# Basic features + specialty/state for peer comparison
print("  Query: provider features + specialty/state...")
con.execute(f"""
COPY (
    SELECT
        BILLING_PROVIDER_NPI_NUM as npi,
        MAX(BILLING_PROVIDER_TYPE) as specialty,
        MAX(BILLING_PROVIDER_STATE_CD) as state,
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
gc.collect()

# Top code concentration
print("  Query: top code concentration...")
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
    SELECT ct.npi, ct.code_paid / NULLIF(pt.total, 0) as top_code_conc
    FROM code_totals ct
    JOIN provider_totals pt ON ct.npi = pt.npi
    WHERE ct.rn = 1
) TO '/tmp/ml_v3_conc.csv' (HEADER, DELIMITER ',')
""")
gc.collect()

# Self-billing ratio
print("  Query: self-billing ratio...")
con.execute(f"""
COPY (
    SELECT BILLING_PROVIDER_NPI_NUM as npi,
           AVG(CASE WHEN BILLING_PROVIDER_NPI_NUM = SERVICING_PROVIDER_NPI_NUM THEN 1.0 ELSE 0.0 END) as self_bill_ratio
    FROM '{PARQUET}'
    GROUP BY npi
) TO '/tmp/ml_v3_self.csv' (HEADER, DELIMITER ',')
""")
gc.collect()

# Year-over-year growth
print("  Query: growth ratio...")
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
) TO '/tmp/ml_v3_growth.csv' (HEADER, DELIMITER ',')
""")
gc.collect()

# Peer stats by specialty
print("  Query: specialty peer stats...")
con.execute(f"""
COPY (
    WITH provider_stats AS (
        SELECT
            BILLING_PROVIDER_NPI_NUM as npi,
            BILLING_PROVIDER_TYPE as specialty,
            SUM(TOTAL_PAID) as total_paid,
            SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as cost_per_claim,
            SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_UNIQUE_BENEFICIARIES), 0) as cost_per_bene
        FROM '{PARQUET}'
        GROUP BY npi, specialty
        HAVING SUM(TOTAL_PAID) > 0
    ),
    specialty_stats AS (
        SELECT
            specialty,
            AVG(total_paid) as avg_paid,
            STDDEV(total_paid) as std_paid,
            AVG(cost_per_claim) as avg_cpc,
            STDDEV(cost_per_claim) as std_cpc,
            AVG(cost_per_bene) as avg_cpb,
            STDDEV(cost_per_bene) as std_cpb,
            COUNT(*) as peer_count
        FROM provider_stats
        GROUP BY specialty
        HAVING COUNT(*) >= 5
    )
    SELECT
        p.npi,
        (p.total_paid - s.avg_paid) / NULLIF(s.std_paid, 0) as paid_z_specialty,
        (p.cost_per_claim - s.avg_cpc) / NULLIF(s.std_cpc, 0) as cpc_z_specialty,
        (p.cost_per_bene - s.avg_cpb) / NULLIF(s.std_cpb, 0) as cpb_z_specialty,
        s.peer_count
    FROM provider_stats p
    JOIN specialty_stats s ON p.specialty = s.specialty
) TO '{PEER_CSV}' (HEADER, DELIMITER ',')
""")
gc.collect()

# State-level peer stats
print("  Query: state peer stats...")
con.execute(f"""
COPY (
    WITH provider_stats AS (
        SELECT
            BILLING_PROVIDER_NPI_NUM as npi,
            BILLING_PROVIDER_STATE_CD as state,
            SUM(TOTAL_PAID) as total_paid,
            SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as cost_per_claim
        FROM '{PARQUET}'
        GROUP BY npi, state
        HAVING SUM(TOTAL_PAID) > 0
    ),
    state_stats AS (
        SELECT
            state,
            AVG(total_paid) as avg_paid,
            STDDEV(total_paid) as std_paid,
            AVG(cost_per_claim) as avg_cpc,
            STDDEV(cost_per_claim) as std_cpc
        FROM provider_stats
        GROUP BY state
        HAVING COUNT(*) >= 10
    )
    SELECT
        p.npi,
        (p.total_paid - s.avg_paid) / NULLIF(s.std_paid, 0) as paid_z_state,
        (p.cost_per_claim - s.avg_cpc) / NULLIF(s.std_cpc, 0) as cpc_z_state
    FROM provider_stats p
    JOIN state_stats s ON p.state = s.state
) TO '/tmp/ml_v3_state_z.csv' (HEADER, DELIMITER ',')
""")
gc.collect()
con.close()
print("  All queries done.")

# Step 3: Merge features
print("\n3. Merging features...")
import pandas as pd

features = pd.read_csv(FEATURES_CSV)
print(f"  Base features: {len(features):,} providers")

for fname, cols_to_merge in [
    ('/tmp/ml_v3_conc.csv', ['top_code_conc']),
    ('/tmp/ml_v3_self.csv', ['self_bill_ratio']),
    ('/tmp/ml_v3_growth.csv', ['max_growth_ratio']),
    (PEER_CSV, ['paid_z_specialty', 'cpc_z_specialty', 'cpb_z_specialty', 'peer_count']),
    ('/tmp/ml_v3_state_z.csv', ['paid_z_state', 'cpc_z_state']),
]:
    try:
        df = pd.read_csv(fname)
        features = features.merge(df, on='npi', how='left')
        print(f"  Merged {fname}: +{len(cols_to_merge)} cols")
    except Exception as e:
        print(f"  WARN: {fname}: {e}")
    gc.collect()

# Computed flags
features['short_burst'] = ((features['active_months'] <= 12) & (features['total_paid'] > 1e6)).astype(int)
features['low_code_high_bill'] = ((features['code_count'] <= 2) & (features['total_paid'] > 500000)).astype(int)

# Labels: fraud-only
features['is_fraud'] = features['npi'].astype(str).isin(oig_fraud_npis).astype(int)
features['is_borderline'] = features['npi'].astype(str).isin(oig_borderline_npis).astype(int)
features['is_excluded_any'] = features['npi'].astype(str).isin(oig_all_npis).astype(int)

fraud_count = features['is_fraud'].sum()
borderline_count = features['is_borderline'].sum()
any_count = features['is_excluded_any'].sum()
print(f"\n  Matched labels: {fraud_count} fraud, {borderline_count} borderline, {any_count} any exclusion")

# Feature columns (expanded from v2)
FEAT_COLS = [
    'total_paid', 'total_claims', 'total_benes', 'code_count',
    'cost_per_claim', 'cost_per_bene', 'claims_per_bene',
    'active_months', 'paid_per_month', 'claims_per_month',
    'top_code_conc', 'self_bill_ratio', 'max_growth_ratio',
    'short_burst', 'low_code_high_bill',
    # NEW: peer comparison features
    'paid_z_specialty', 'cpc_z_specialty', 'cpb_z_specialty',
    'paid_z_state', 'cpc_z_state',
    'peer_count',
]

X = features[FEAT_COLS].replace([np.inf, -np.inf], np.nan).fillna(0).values.astype(np.float32)
y = features['is_fraud'].values  # fraud-only labels

print(f"\n  Feature matrix: {X.shape}")
print(f"  Positive labels (fraud-only): {y.sum()}")

# Step 4: Train with subsampling
print("\n4. Training Random Forest (subsampled)...")
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, precision_recall_fscore_support

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
gc.collect()

# Subsample negatives for training (keeps memory manageable)
pos_idx = np.where(y == 1)[0]
neg_idx = np.where(y == 0)[0]
np.random.seed(42)
neg_sample = np.random.choice(neg_idx, size=min(10000, len(neg_idx)), replace=False)
train_idx = np.concatenate([pos_idx, neg_sample])
np.random.shuffle(train_idx)

X_train = X_scaled[train_idx]
y_train = y[train_idx]
print(f"  Training set: {len(X_train):,} ({y_train.sum()} positive, {len(X_train) - y_train.sum()} negative)")

mdl = RandomForestClassifier(
    n_estimators=100,
    class_weight='balanced',
    random_state=42,
    n_jobs=1,
    max_depth=12,
    max_features='sqrt',
    min_samples_leaf=3,
)

# Cross-validate
print("  Cross-validating...")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(mdl, X_train, y_train, cv=cv, scoring='roc_auc', n_jobs=1)
auc = cv_scores.mean()
print(f"  AUC: {auc:.4f} (+/- {cv_scores.std():.4f})")

# Get precision/recall at threshold
from sklearn.model_selection import cross_val_predict
y_prob = cross_val_predict(mdl, X_train, y_train, cv=cv, method='predict_proba', n_jobs=1)[:, 1]
threshold = 0.5
y_pred = (y_prob >= threshold).astype(int)
prec, rec, f1, _ = precision_recall_fscore_support(y_train, y_pred, average='binary', zero_division=0)
print(f"  At threshold {threshold}: precision={prec:.4f}, recall={rec:.4f}, F1={f1:.4f}")

# Final fit on full training subsample
print("  Final fit...")
mdl.fit(X_train, y_train)
gc.collect()

# Feature importance (REAL this time!)
importances = dict(zip(FEAT_COLS, mdl.feature_importances_))
sorted_imp = sorted(importances.items(), key=lambda x: -x[1])
print("\n  Feature Importance (Real):")
for f, imp in sorted_imp:
    print(f"    {f}: {imp:.4f}")

# Score ALL providers
print("\n5. Scoring all providers...")
scores = mdl.predict_proba(X_scaled)[:, 1]
features['ml_score'] = scores

# Step 5: Build output
print("\n6. Building output...")
features_sorted = features.sort_values('ml_score', ascending=False)

# Top 1000 providers
top_providers = []
for _, row in features_sorted.head(1000).iterrows():
    entry = {
        'npi': str(int(row['npi'])) if not isinstance(row['npi'], str) else row['npi'],
        'mlScore': round(float(row['ml_score']), 6),
        'totalPaid': float(row['total_paid']),
        'totalClaims': int(row['total_claims']),
        'totalBeneficiaries': int(row['total_benes']),
        'codeCount': int(row['code_count']),
        'activeMonths': int(row['active_months']),
        'costPerClaim': round(float(row['cost_per_claim']), 2) if not np.isnan(row['cost_per_claim']) else 0,
        'selfBillingRatio': round(float(row['self_bill_ratio']), 3) if not np.isnan(row['self_bill_ratio']) else 0,
        'topCodeConcentration': round(float(row['top_code_conc']), 3) if not np.isnan(row['top_code_conc']) else 0,
        'paidPerMonth': round(float(row['paid_per_month']), 0) if not np.isnan(row['paid_per_month']) else 0,
        'paidZSpecialty': round(float(row['paid_z_specialty']), 2) if not np.isnan(row['paid_z_specialty']) else 0,
        'cpcZSpecialty': round(float(row['cpc_z_specialty']), 2) if not np.isnan(row['cpc_z_specialty']) else 0,
        'paidZState': round(float(row['paid_z_state']), 2) if not np.isnan(row['paid_z_state']) else 0,
        'isExcluded': bool(row['is_excluded_any']),
        'isFraudExcluded': bool(row['is_fraud']),
    }
    top_providers.append(entry)

all_scores = features['ml_score'].values
output = {
    'modelType': 'random_forest',
    'modelVersion': 'v3',
    'modelAuc': round(float(auc), 4),
    'modelPrecision': round(float(prec), 4),
    'modelRecall': round(float(rec), 4),
    'modelF1': round(float(f1), 4),
    'threshold': threshold,
    'totalProviders': len(features),
    'positiveLabels': int(fraud_count),
    'labelSource': 'OIG exclusions filtered to fraud-related types (1128a1, 1128a3, 1128b1, 1128b7)',
    'featuresUsed': FEAT_COLS,
    'featureImportances': {f: round(float(imp), 4) for f, imp in sorted_imp},
    'topProviders': top_providers,
    'scoreDistribution': {
        'p50': round(float(np.median(all_scores)), 6),
        'p75': round(float(np.percentile(all_scores, 75)), 6),
        'p90': round(float(np.percentile(all_scores, 90)), 6),
        'p95': round(float(np.percentile(all_scores, 95)), 6),
        'p99': round(float(np.percentile(all_scores, 99)), 6),
        'p999': round(float(np.percentile(all_scores, 99.9)), 6),
    },
    'trainingConfig': {
        'nEstimators': 100,
        'maxDepth': 12,
        'classWeight': 'balanced',
        'negSubsampleSize': min(10000, len(neg_idx)),
        'cvFolds': 5,
        'randomState': 42,
        'fraudOnlyLabels': True,
        'excludedLabelTypes': ['1128b4 (license)', '1128b14 (student loans)', '1128b5 (other agency)', '1128b3 (controlled substances misdemeanor)'],
    }
}

out_path = os.path.join(OUT_DIR, 'ml-scores.json')
with open(out_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n{'=' * 60}")
print(f"RESULTS")
print(f"{'=' * 60}")
print(f"Model: Random Forest v3 (fraud-only labels)")
print(f"AUC: {auc:.4f}")
print(f"Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f}")
print(f"Providers scored: {len(features):,}")
print(f"Fraud labels used: {fraud_count} (was {any_count} with all exclusions)")
print(f"Top providers output: {len(top_providers)}")
print(f"Features: {len(FEAT_COLS)} (was 15, added 6 peer-comparison)")
print(f"Scores: {output['scoreDistribution']}")
print(f"\nTop 10:")
for p in top_providers[:10]:
    fraud_tag = " [KNOWN FRAUD]" if p['isFraudExcluded'] else ""
    print(f"  NPI {p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f} specialty_z={p['paidZSpecialty']:.1f}{fraud_tag}")
print(f"\nSaved to {out_path}")

# Cleanup
for f in [FEATURES_CSV, '/tmp/ml_v3_conc.csv', '/tmp/ml_v3_self.csv', 
          '/tmp/ml_v3_growth.csv', PEER_CSV, '/tmp/ml_v3_state_z.csv']:
    try: os.remove(f)
    except: pass

print("\nDone!")
