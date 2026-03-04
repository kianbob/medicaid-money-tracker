#!/usr/bin/env python3
"""
ML v3 Step 2: Train improved model on pre-extracted features.
Designed for 16GB RAM — uses subsampling and n_jobs=1.
Run after: bash scripts/ml-v3-step1-extract.sh
"""
import csv, json, os, gc
import numpy as np

OUTDIR = '/tmp/ml_v3'
OIG_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/oig-exclusions.csv")
APP_OUT = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")

# Fraud-related OIG exclusion types only
FRAUD_EXCL_TYPES = {'1128a1', '1128a3', '1128b1', '1128b7'}

print("=" * 60)
print("ML v3 Step 2: Train Improved Model")
print("=" * 60)

# 1. Load OIG with fraud-only filter
print("\n1. Loading OIG exclusions (fraud-only)...")
oig_fraud = set()
oig_all = set()
excl_counts = {}
with open(OIG_CSV) as f:
    for row in csv.DictReader(f):
        npi = row.get('NPI', '').strip()
        et = row.get('EXCLTYPE', '').strip().strip('"')
        excl_counts[et] = excl_counts.get(et, 0) + 1
        if npi and len(npi) == 10 and npi.isdigit() and npi != '0000000000':
            oig_all.add(npi)
            if et in FRAUD_EXCL_TYPES:
                oig_fraud.add(npi)

print(f"  All OIG NPIs: {len(oig_all):,}")
print(f"  Fraud-only NPIs: {len(oig_fraud):,}")

# 2. Load features
print("\n2. Loading features...")
FEAT_NAMES = ['total_paid','total_claims','total_benes','code_count','active_months',
              'cost_per_claim','cost_per_bene','claims_per_bene','paid_per_month','claims_per_month']

npis = []
specialties = []
states = []
data = []

with open(f'{OUTDIR}/features.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        npis.append(row['npi'])
        specialties.append(row.get('specialty', ''))
        states.append(row.get('state', ''))
        vals = []
        for c in FEAT_NAMES:
            v = row.get(c, '')
            try: vals.append(float(v) if v else 0.0)
            except: vals.append(0.0)
        data.append(vals)

print(f"  {len(npis):,} providers, {len(FEAT_NAMES)} base features")

# 3. Merge additional features
print("\n3. Merging additional features...")
npi_idx = {n: i for i, n in enumerate(npis)}
N = len(npis)

# Initialize extra feature arrays
extra_names = ['top_code_conc', 'self_bill_ratio', 'max_growth_ratio',
               'paid_z_specialty', 'cpc_z_specialty', 'cpb_z_specialty', 'peer_count',
               'paid_z_state', 'cpc_z_state']
extra = np.zeros((N, len(extra_names)), dtype=np.float32)

merge_files = [
    (f'{OUTDIR}/conc.csv', ['top_code_conc'], 0),
    (f'{OUTDIR}/self.csv', ['self_bill_ratio'], 1),
    (f'{OUTDIR}/growth.csv', ['max_growth_ratio'], 2),
    (f'{OUTDIR}/specialty_z.csv', ['paid_z_specialty','cpc_z_specialty','cpb_z_specialty','peer_count'], 3),
    (f'{OUTDIR}/state_z.csv', ['paid_z_state','cpc_z_state'], 7),
]

for fname, cols, start_idx in merge_files:
    matched = 0
    try:
        with open(fname) as f:
            reader = csv.DictReader(f)
            for row in reader:
                idx = npi_idx.get(row['npi'])
                if idx is not None:
                    for j, c in enumerate(cols):
                        v = row.get(c, '')
                        try: extra[idx, start_idx + j] = float(v) if v else 0.0
                        except: pass
                    matched += 1
        print(f"  {fname}: {matched:,} matched")
    except Exception as e:
        print(f"  WARN {fname}: {e}")

# Build full feature matrix
X_base = np.array(data, dtype=np.float32)
del data; gc.collect()

# Computed flags
short_burst = ((X_base[:, 4] <= 12) & (X_base[:, 0] > 1e6)).astype(np.float32).reshape(-1, 1)
low_code = ((X_base[:, 3] <= 2) & (X_base[:, 0] > 500000)).astype(np.float32).reshape(-1, 1)

X = np.hstack([X_base, extra, short_burst, low_code])
ALL_FEAT_NAMES = FEAT_NAMES + extra_names + ['short_burst', 'low_code_high_bill']
del X_base, extra; gc.collect()

X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
print(f"\n  Final feature matrix: {X.shape} ({len(ALL_FEAT_NAMES)} features)")

# Labels
y = np.array([1 if n in oig_fraud else 0 for n in npis], dtype=np.int32)
fraud_matched = y.sum()
print(f"  Fraud labels matched: {fraud_matched}")

# 4. Train
print("\n4. Training Random Forest...")
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, cross_val_predict, StratifiedKFold
from sklearn.metrics import precision_recall_fscore_support

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
del X; gc.collect()

# Subsample for training
pos_idx = np.where(y == 1)[0]
neg_idx = np.where(y == 0)[0]
np.random.seed(42)
neg_sample = np.random.choice(neg_idx, size=min(10000, len(neg_idx)), replace=False)
train_idx = np.concatenate([pos_idx, neg_sample])
np.random.shuffle(train_idx)

X_train = X_scaled[train_idx]
y_train = y[train_idx]
print(f"  Training: {len(X_train):,} ({y_train.sum()} pos, {len(X_train)-y_train.sum()} neg)")

mdl = RandomForestClassifier(
    n_estimators=100, class_weight='balanced', random_state=42,
    n_jobs=1, max_depth=12, max_features='sqrt', min_samples_leaf=3,
)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

print("  Cross-validating...")
cv_scores = cross_val_score(mdl, X_train, y_train, cv=cv, scoring='roc_auc', n_jobs=1)
auc = cv_scores.mean()
print(f"  AUC: {auc:.4f} (+/- {cv_scores.std():.4f})")

# Precision/recall
y_prob_cv = cross_val_predict(mdl, X_train, y_train, cv=cv, method='predict_proba', n_jobs=1)[:, 1]
for thresh in [0.3, 0.4, 0.5, 0.6, 0.7]:
    y_pred = (y_prob_cv >= thresh).astype(int)
    p, r, f, _ = precision_recall_fscore_support(y_train, y_pred, average='binary', zero_division=0)
    print(f"  Threshold {thresh}: P={p:.3f} R={r:.3f} F1={f:.3f}")

# Final fit
print("  Final fit on full training data...")
mdl.fit(X_train, y_train)
gc.collect()

# Feature importances (REAL)
importances = dict(zip(ALL_FEAT_NAMES, mdl.feature_importances_))
sorted_imp = sorted(importances.items(), key=lambda x: -x[1])
print("\n  Feature Importances:")
for f, imp in sorted_imp:
    bar = "█" * int(imp * 200)
    print(f"    {f:25s} {imp:.4f} {bar}")

# Score all
print("\n5. Scoring all providers...")
scores = mdl.predict_proba(X_scaled)[:, 1]

# Precision/recall at chosen threshold on full training set
threshold = 0.5
y_pred_train = (scores[train_idx] >= threshold).astype(int)
prec, rec, f1, _ = precision_recall_fscore_support(y_train, y_pred_train, average='binary', zero_division=0)

# 6. Output
print("\n6. Building output...")
scored = list(zip(range(len(npis)), scores))
scored.sort(key=lambda x: -x[1])

top_providers = []
for idx, score in scored[:1000]:
    npi = npis[idx]
    row_vals = X_scaled[idx]  # we need original values, re-read from features
    entry = {
        'npi': npi,
        'mlScore': round(float(score), 6),
        'isExcluded': npi in oig_all,
        'isFraudExcluded': npi in oig_fraud,
    }
    top_providers.append(entry)

# Re-read features.csv for top provider details (memory efficient)
top_npi_set = {p['npi'] for p in top_providers}
npi_details = {}
with open(f'{OUTDIR}/features.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['npi'] in top_npi_set:
            npi_details[row['npi']] = row

for p in top_providers:
    d = npi_details.get(p['npi'], {})
    def g(k, default=0):
        v = d.get(k, '')
        try: return float(v) if v else default
        except: return default
    p['totalPaid'] = g('total_paid')
    p['totalClaims'] = int(g('total_claims'))
    p['totalBeneficiaries'] = int(g('total_benes'))
    p['codeCount'] = int(g('code_count'))
    p['activeMonths'] = int(g('active_months'))
    p['costPerClaim'] = round(g('cost_per_claim'), 2)
    p['selfBillingRatio'] = 0.0  # will fill from conc
    p['topCodeConcentration'] = 0.0
    p['paidPerMonth'] = round(g('paid_per_month'))
    p['specialty'] = d.get('specialty', '')
    p['state'] = d.get('state', '')

# Fill self-billing and concentration for top providers
for fname, key in [(f'{OUTDIR}/conc.csv', 'topCodeConcentration'), (f'{OUTDIR}/self.csv', 'selfBillingRatio')]:
    with open(fname) as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['npi'] in top_npi_set:
                for p in top_providers:
                    if p['npi'] == row['npi']:
                        val = list(row.values())[1]
                        try: p[key] = round(float(val), 3)
                        except: pass
                        break

all_scores = scores
output = {
    'modelType': 'random_forest',
    'modelVersion': 'v3',
    'modelAuc': round(float(auc), 4),
    'modelPrecision': round(float(prec), 4),
    'modelRecall': round(float(rec), 4),
    'modelF1': round(float(f1), 4),
    'threshold': threshold,
    'totalProviders': len(npis),
    'positiveLabels': int(fraud_matched),
    'labelSource': 'OIG exclusions filtered to fraud-related types (1128a1, 1128a3, 1128b1, 1128b7)',
    'featuresUsed': ALL_FEAT_NAMES,
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
        'newFeatures': ['paid_z_specialty', 'cpc_z_specialty', 'cpb_z_specialty', 'peer_count', 'paid_z_state', 'cpc_z_state'],
        'excludedLabelTypes': ['1128b4 (license)', '1128b14 (student loans)', '1128b5 (other agency)', '1128b3 (controlled substances misdemeanor)'],
    }
}

out_path = os.path.join(APP_OUT, 'ml-scores.json')
with open(out_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n{'='*60}")
print("RESULTS")
print(f"{'='*60}")
print(f"Model: Random Forest v3 (fraud-only labels)")
print(f"AUC: {auc:.4f} (was 0.7762 in v2)")
print(f"Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f}")
print(f"Features: {len(ALL_FEAT_NAMES)} (was 14-15 in v2, added 6 peer-comparison)")
print(f"Labels: {fraud_matched} fraud-only (was ~514 all-exclusion in v2)")
print(f"Providers scored: {len(npis):,}")
print(f"Top providers: {len(top_providers)}")
print(f"\nTop 10:")
for p in top_providers[:10]:
    tag = " [KNOWN FRAUD]" if p['isFraudExcluded'] else (" [EXCLUDED]" if p['isExcluded'] else "")
    print(f"  NPI {p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f}{tag}")
print(f"\nSaved to {out_path}")
print("Done!")
