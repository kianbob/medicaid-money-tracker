#!/usr/bin/env python3
"""ML v3 Step 2 ULTRA-LEAN: Train on subsample, score in batches.
Designed for <2GB RAM usage on memory-starved 16GB Mac."""
import csv, json, os, gc
import numpy as np

OUTDIR = '/tmp/ml_v3'
OIG_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/oig-exclusions.csv")
APP_OUT = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")

FRAUD_EXCL_TYPES = {'1128a1', '1128a3', '1128b1', '1128b7'}
FEAT_NAMES = ['total_paid','total_claims','total_benes','code_count','active_months',
              'cost_per_claim','cost_per_bene','claims_per_bene','paid_per_month','claims_per_month']
EXTRA_NAMES = ['top_code_conc','self_bill_ratio','max_growth_ratio',
               'paid_z_specialty','cpc_z_specialty','cpb_z_specialty','peer_count',
               'paid_z_state','cpc_z_state']
ALL_NAMES = FEAT_NAMES + EXTRA_NAMES + ['short_burst','low_code_high_bill']
N_FEAT = len(ALL_NAMES)

print("=" * 50)
print("ML v3 ULTRA-LEAN")
print("=" * 50)

# 1. OIG labels
print("\n1. OIG labels...")
oig_fraud = set()
oig_all = set()
with open(OIG_CSV) as f:
    for row in csv.DictReader(f):
        npi = row.get('NPI','').strip()
        et = row.get('EXCLTYPE','').strip().strip('"')
        if npi and len(npi)==10 and npi.isdigit() and npi!='0000000000':
            oig_all.add(npi)
            if et in FRAUD_EXCL_TYPES:
                oig_fraud.add(npi)
print(f"  Fraud: {len(oig_fraud)}, All: {len(oig_all)}")

# 2. Build lookup dicts for extra features
print("\n2. Loading extra features into lookups...")
extra_lookup = {}  # npi -> {col: val}
for fname, cols in [
    (f'{OUTDIR}/conc.csv', ['top_code_conc']),
    (f'{OUTDIR}/self.csv', ['self_bill_ratio']),
    (f'{OUTDIR}/growth.csv', ['max_growth_ratio']),
    (f'{OUTDIR}/specialty_z.csv', ['paid_z_specialty','cpc_z_specialty','cpb_z_specialty','peer_count']),
    (f'{OUTDIR}/state_z.csv', ['paid_z_state','cpc_z_state']),
]:
    try:
        with open(fname) as f:
            for row in csv.DictReader(f):
                npi = row['npi']
                if npi not in extra_lookup:
                    extra_lookup[npi] = {}
                for c in cols:
                    try: extra_lookup[npi][c] = float(row.get(c,'') or 0)
                    except: pass
    except: pass
print(f"  {len(extra_lookup):,} NPIs with extra features")

# 3. Single-pass: collect positives + reservoir-sample negatives
print("\n3. Loading training data (subsample)...")
np.random.seed(42)
NEG_SAMPLE = 10000

positives = []  # (npi, feature_vec)
neg_reservoir = []
neg_count = 0
total_count = 0

def make_vec(row, npi):
    vals = []
    for c in FEAT_NAMES:
        try: vals.append(float(row.get(c,'') or 0))
        except: vals.append(0.0)
    ex = extra_lookup.get(npi, {})
    for c in EXTRA_NAMES:
        vals.append(ex.get(c, 0.0))
    # computed
    active = vals[4]  # active_months
    paid = vals[0]    # total_paid
    codes = vals[3]   # code_count
    vals.append(1.0 if active <= 12 and paid > 1e6 else 0.0)  # short_burst
    vals.append(1.0 if codes <= 2 and paid > 500000 else 0.0)  # low_code
    return vals

with open(f'{OUTDIR}/features.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row['npi']
        total_count += 1
        vec = make_vec(row, npi)
        
        if npi in oig_fraud:
            positives.append((npi, vec))
        else:
            neg_count += 1
            if len(neg_reservoir) < NEG_SAMPLE:
                neg_reservoir.append((npi, vec))
            else:
                j = np.random.randint(0, neg_count)
                if j < NEG_SAMPLE:
                    neg_reservoir[j] = (npi, vec)

print(f"  Total: {total_count:,}, Positives: {len(positives)}, Neg sample: {len(neg_reservoir)}")
gc.collect()

# 4. Build training arrays
print("\n4. Building training arrays...")
train_data = positives + neg_reservoir
np.random.shuffle(train_data)
train_npis = [d[0] for d in train_data]
X_train = np.array([d[1] for d in train_data], dtype=np.float32)
y_train = np.array([1 if n in oig_fraud else 0 for n in train_npis], dtype=np.int32)
X_train = np.nan_to_num(X_train, nan=0.0, posinf=0.0, neginf=0.0)
del train_data, positives, neg_reservoir; gc.collect()

print(f"  X_train: {X_train.shape}, pos={y_train.sum()}, neg={len(y_train)-y_train.sum()}")

# 5. Scale & train
print("\n5. Training...")
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, cross_val_predict, StratifiedKFold
from sklearn.metrics import precision_recall_fscore_support

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

mdl = RandomForestClassifier(
    n_estimators=100, class_weight='balanced', random_state=42,
    n_jobs=1, max_depth=12, max_features='sqrt', min_samples_leaf=3,
)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(mdl, X_train_scaled, y_train, cv=cv, scoring='roc_auc', n_jobs=1)
auc = cv_scores.mean()
print(f"  AUC: {auc:.4f} (+/- {cv_scores.std():.4f})")

# Precision/recall at various thresholds
y_prob_cv = cross_val_predict(mdl, X_train_scaled, y_train, cv=cv, method='predict_proba', n_jobs=1)[:, 1]
print("  Threshold analysis:")
best_f1 = 0
best_thresh = 0.5
for t in [0.3, 0.4, 0.5, 0.6, 0.7]:
    yp = (y_prob_cv >= t).astype(int)
    p, r, f, _ = precision_recall_fscore_support(y_train, yp, average='binary', zero_division=0)
    print(f"    t={t}: P={p:.3f} R={r:.3f} F1={f:.3f}")
    if f > best_f1:
        best_f1 = f
        best_thresh = t

# Final fit
print(f"\n  Final fit (best threshold: {best_thresh})...")
mdl.fit(X_train_scaled, y_train)

# Feature importances
imp = dict(zip(ALL_NAMES, mdl.feature_importances_))
sorted_imp = sorted(imp.items(), key=lambda x: -x[1])
print("\n  Feature Importances:")
for f, i in sorted_imp:
    print(f"    {f:25s} {i:.4f} {'█'*int(i*200)}")

# Save scaler params for batch scoring
scaler_mean = scaler.mean_
scaler_scale = scaler.scale_
del X_train, X_train_scaled, y_train; gc.collect()

# 6. Score ALL providers in batches
print("\n6. Scoring all providers (batched)...")
BATCH = 50000
all_scored = []  # (npi, score, row_dict)
batch_X = []
batch_npis = []
batch_rows = []

def score_batch():
    if not batch_X:
        return
    X = np.array(batch_X, dtype=np.float32)
    X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
    X = (X - scaler_mean) / scaler_scale
    probs = mdl.predict_proba(X)[:, 1]
    for npi, score, row in zip(batch_npis, probs, batch_rows):
        all_scored.append((npi, float(score), row))
    batch_X.clear()
    batch_npis.clear()
    batch_rows.clear()

with open(f'{OUTDIR}/features.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row['npi']
        vec = make_vec(row, npi)
        batch_X.append(vec)
        batch_npis.append(npi)
        batch_rows.append(dict(row))
        if len(batch_X) >= BATCH:
            score_batch()
            gc.collect()
            print(f"    Scored {len(all_scored):,}...")

score_batch()
print(f"  Total scored: {len(all_scored):,}")

# Sort by score descending
all_scored.sort(key=lambda x: -x[1])

# 7. Build output
print("\n7. Building output...")
all_scores_arr = np.array([s for _, s, _ in all_scored])

# Use best threshold for precision/recall reporting
threshold = best_thresh
# Recalc on training predictions
y_pred_best = (y_prob_cv >= threshold).astype(int)
y_train_labels = np.array([1 if n in oig_fraud else 0 for n in train_npis])
prec, rec, f1, _ = precision_recall_fscore_support(y_train_labels, y_pred_best, average='binary', zero_division=0)

top_providers = []
for npi, score, row in all_scored[:1000]:
    def g(k, default=0):
        v = row.get(k, '')
        try: return float(v) if v else default
        except: return default
    
    ex = extra_lookup.get(npi, {})
    top_providers.append({
        'npi': npi,
        'mlScore': round(score, 6),
        'totalPaid': g('total_paid'),
        'totalClaims': int(g('total_claims')),
        'totalBeneficiaries': int(g('total_benes')),
        'codeCount': int(g('code_count')),
        'activeMonths': int(g('active_months')),
        'costPerClaim': round(g('cost_per_claim'), 2),
        'selfBillingRatio': round(ex.get('self_bill_ratio', 0), 3),
        'topCodeConcentration': round(ex.get('top_code_conc', 0), 3),
        'paidPerMonth': round(g('paid_per_month')),
        'specialty': row.get('specialty', ''),
        'state': row.get('state', ''),
        'isExcluded': npi in oig_all,
        'isFraudExcluded': npi in oig_fraud,
    })

output = {
    'modelType': 'random_forest',
    'modelVersion': 'v3',
    'modelAuc': round(float(auc), 4),
    'modelPrecision': round(float(prec), 4),
    'modelRecall': round(float(rec), 4),
    'modelF1': round(float(f1), 4),
    'threshold': threshold,
    'totalProviders': total_count,
    'positiveLabels': int(len([n for n in train_npis if n in oig_fraud])),
    'labelSource': 'OIG exclusions filtered to fraud-related types (1128a1, 1128a3, 1128b1, 1128b7)',
    'featuresUsed': ALL_NAMES,
    'featureImportances': {f: round(float(i), 4) for f, i in sorted_imp},
    'topProviders': top_providers,
    'scoreDistribution': {
        'p50': round(float(np.median(all_scores_arr)), 6),
        'p75': round(float(np.percentile(all_scores_arr, 75)), 6),
        'p90': round(float(np.percentile(all_scores_arr, 90)), 6),
        'p95': round(float(np.percentile(all_scores_arr, 95)), 6),
        'p99': round(float(np.percentile(all_scores_arr, 99)), 6),
        'p999': round(float(np.percentile(all_scores_arr, 99.9)), 6),
    },
    'trainingConfig': {
        'nEstimators': 100, 'maxDepth': 12, 'classWeight': 'balanced',
        'negSubsampleSize': NEG_SAMPLE, 'cvFolds': 5, 'randomState': 42,
        'fraudOnlyLabels': True,
        'newFeatures': ['paid_z_specialty','cpc_z_specialty','cpb_z_specialty','peer_count','paid_z_state','cpc_z_state'],
        'excludedLabelTypes': ['1128b4 (license)','1128b14 (student loans)','1128b5 (other agency)','1128b3 (controlled substances misdemeanor)'],
    }
}

out_path = os.path.join(APP_OUT, 'ml-scores.json')
with open(out_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n{'='*50}")
print(f"AUC: {auc:.4f} | P={prec:.3f} R={rec:.3f} F1={f1:.3f}")
print(f"Features: {N_FEAT} | Labels: {output['positiveLabels']} fraud-only")
print(f"Scored: {total_count:,} | Top: {len(top_providers)}")
print(f"\nTop 10:")
for p in top_providers[:10]:
    tag = " [FRAUD]" if p['isFraudExcluded'] else (" [EXCL]" if p['isExcluded'] else "")
    print(f"  {p['npi']}: {p['mlScore']:.4f} ${p['totalPaid']:,.0f}{tag}")
print(f"\nSaved: {out_path}")
