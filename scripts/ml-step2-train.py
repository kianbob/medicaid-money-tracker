#!/usr/bin/env python3
"""Step 2: Train ML model on extracted features CSV"""
import csv, json, os, numpy as np

FEATURES_CSV = '/tmp/ml_features.csv'
OIG_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/oig-exclusions.csv")
OUT_DIR = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")

# Load features
print("Loading features...")
npis = []
data = []
with open(FEATURES_CSV) as f:
    reader = csv.DictReader(f)
    cols = ['total_paid','total_claims','total_benes','code_count','active_months',
            'cpc','cpb','cpb_claims','paid_per_mo','claims_per_mo',
            'top_code_conc','self_bill_ratio','short_burst','low_code_high']
    for row in reader:
        npis.append(row['npi'])
        vals = []
        for c in cols:
            v = row.get(c, '')
            try: vals.append(float(v) if v else 0.0)
            except: vals.append(0.0)
        data.append(vals)

X = np.array(data, dtype=np.float32)
# Replace inf/nan
X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
print(f"  {len(npis):,} providers, {X.shape[1]} features")

# Load OIG labels
print("Loading OIG exclusions...")
oig_npis = set()
with open(OIG_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row.get('NPI', '').strip()
        if npi and len(npi) == 10 and npi.isdigit():
            oig_npis.add(npi)

npi_set = set(npis)
y = np.array([1 if n in oig_npis else 0 for n in npis], dtype=np.int32)
excluded = y.sum()
print(f"  {len(oig_npis):,} OIG NPIs, {excluded} matched in data")

from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

if excluded >= 20:
    print(f"\nSUPERVISED: {excluded} positive labels")
    from sklearn.linear_model import LogisticRegression
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import cross_val_score
    
    best_name = ''
    best_auc = 0
    best_model = None
    
    for name, mdl in [
        ('logistic_regression', LogisticRegression(max_iter=2000, class_weight='balanced', random_state=42, solver='saga')),
        ('random_forest', RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42, n_jobs=2, max_depth=12)),
    ]:
        print(f"  Training {name}...")
        cv = cross_val_score(mdl, X_scaled, y, cv=5, scoring='roc_auc', n_jobs=2)
        auc = cv.mean()
        print(f"    AUC: {auc:.4f} (+/- {cv.std():.4f})")
        if auc > best_auc:
            best_auc = auc
            best_name = name
            best_model = mdl
    
    print(f"\nBest: {best_name} (AUC: {best_auc:.4f})")
    best_model.fit(X_scaled, y)
    scores = best_model.predict_proba(X_scaled)[:, 1]
    model_type = best_name
    model_auc = round(best_auc, 4)
    
    if hasattr(best_model, 'feature_importances_'):
        imp = sorted(zip(cols, best_model.feature_importances_), key=lambda x: -x[1])
        print("\nFeature importance:")
        for f, i in imp: print(f"  {f}: {i:.4f}")
    elif hasattr(best_model, 'coef_'):
        imp = sorted(zip(cols, np.abs(best_model.coef_[0])), key=lambda x: -x[1])
        print("\nFeature coefficients (abs):")
        for f, i in imp: print(f"  {f}: {i:.4f}")
else:
    print(f"\nUNSUPERVISED: Only {excluded} labels")
    from sklearn.ensemble import IsolationForest
    from sklearn.preprocessing import MinMaxScaler
    
    model = IsolationForest(n_estimators=200, contamination=0.01, random_state=42, n_jobs=2)
    model.fit(X_scaled)
    raw = model.decision_function(X_scaled)
    scores = 1 - MinMaxScaler().fit_transform(raw.reshape(-1, 1)).ravel()
    model_type = 'isolation_forest'
    model_auc = None

# Build output
print("\nGenerating output...")
scored = list(zip(npis, scores, data))
scored.sort(key=lambda x: -x[1])

top_200 = []
for npi, score, row in scored[:200]:
    top_200.append({
        'npi': npi,
        'mlScore': round(float(score), 6),
        'totalPaid': row[0],
        'totalClaims': int(row[1]),
        'totalBeneficiaries': int(row[2]),
        'codeCount': int(row[3]),
        'activeMonths': int(row[4]),
        'costPerClaim': round(row[5], 2),
        'selfBillingRatio': round(row[11], 3),
        'topCodeConcentration': round(row[10], 3),
        'paidPerMonth': round(row[8], 0),
    })

all_scores = np.array([s for _, s, _ in scored])
output = {
    'modelType': model_type,
    'modelAuc': model_auc,
    'totalProviders': len(npis),
    'featuresUsed': cols,
    'topProviders': top_200,
    'scoreDistribution': {
        'p50': round(float(np.median(all_scores)), 6),
        'p90': round(float(np.percentile(all_scores, 90)), 6),
        'p95': round(float(np.percentile(all_scores, 95)), 6),
        'p99': round(float(np.percentile(all_scores, 99)), 6),
        'p999': round(float(np.percentile(all_scores, 99.9)), 6),
    }
}

out_path = os.path.join(OUT_DIR, 'ml-scores.json')
with open(out_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"\nSaved to {out_path}")
print(f"Model: {model_type}, AUC: {model_auc}")
print(f"Scores: {output['scoreDistribution']}")
print(f"\nTop 10:")
for p in top_200[:10]:
    print(f"  NPI {p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f} self={p['selfBillingRatio']:.2f} codes={p['codeCount']}")
print("\nDone!")
