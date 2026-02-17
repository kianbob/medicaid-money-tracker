#!/usr/bin/env python3
"""Step 2 MICRO: Train on subsample, score all providers in batches."""
import csv, json, os, gc
import numpy as np

FEATURES_CSV = '/tmp/ml_features.csv'
OIG_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/oig-exclusions.csv")
OUT_DIR = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")

COLS = ['total_paid','total_claims','total_benes','code_count','active_months',
        'cpc','cpb','cpb_claims','paid_per_mo','claims_per_mo',
        'top_code_conc','self_bill_ratio','short_burst','low_code_high']

# Step 1: Load OIG exclusion NPIs
print("Loading OIG exclusions...")
oig_npis = set()
with open(OIG_CSV) as f:
    for row in csv.DictReader(f):
        npi = row.get('NPI', '').strip()
        if npi and len(npi) == 10 and npi.isdigit():
            oig_npis.add(npi)
print(f"  {len(oig_npis):,} OIG NPIs")

# Step 2: Single pass - collect all positives + subsample negatives
print("Loading features (subsampled)...")
np.random.seed(42)
positives = []  # (npi, features)
negatives = []  # subsampled
NEG_SAMPLE = 10000  # 10K negatives vs ~513 positives = manageable
neg_reservoir = []
neg_count = 0

with open(FEATURES_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row['npi']
        vals = []
        for c in COLS:
            v = row.get(c, '')
            try: vals.append(float(v) if v else 0.0)
            except: vals.append(0.0)
        
        if npi in oig_npis:
            positives.append((npi, vals))
        else:
            # Reservoir sampling
            neg_count += 1
            if len(neg_reservoir) < NEG_SAMPLE:
                neg_reservoir.append((npi, vals))
            else:
                j = np.random.randint(0, neg_count)
                if j < NEG_SAMPLE:
                    neg_reservoir[j] = (npi, vals)

print(f"  {len(positives)} positives, {neg_count:,} negatives ({len(neg_reservoir)} sampled)")

# Build training set
train_data = positives + neg_reservoir
train_npis = [t[0] for t in train_data]
X_train = np.array([t[1] for t in train_data], dtype=np.float32)
y_train = np.array([1]*len(positives) + [0]*len(neg_reservoir), dtype=np.int32)
del train_data, positives, neg_reservoir; gc.collect()

X_train = np.nan_to_num(X_train, nan=0.0, posinf=0.0, neginf=0.0)
print(f"  Training set: {X_train.shape}")

# Scale (fit on training set)
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
del X_train; gc.collect()

# Train
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

mdl = RandomForestClassifier(
    n_estimators=100, class_weight='balanced', random_state=42,
    n_jobs=1, max_depth=12, max_features='sqrt'
)
print("\nCross-validating...")
cv = cross_val_score(mdl, X_train_scaled, y_train, cv=5, scoring='roc_auc', n_jobs=1)
auc = cv.mean()
print(f"  AUC: {auc:.4f} (+/- {cv.std():.4f})")

print("Final fit...")
mdl.fit(X_train_scaled, y_train)
del X_train_scaled; gc.collect()

imp = sorted(zip(COLS, mdl.feature_importances_), key=lambda x: -x[1])
print("\nFeature importance:")
for f, i in imp: print(f"  {f}: {i:.4f}")

# Step 3: Score ALL providers in batches
print("\nScoring all providers in batches...")
BATCH = 50000
all_scored = []  # (npi, score, total_paid)

with open(FEATURES_CSV) as f:
    reader = csv.DictReader(f)
    batch_npis = []
    batch_X = []
    batch_paid = []
    
    for row in reader:
        npi = row['npi']
        vals = []
        for c in COLS:
            v = row.get(c, '')
            try: vals.append(float(v) if v else 0.0)
            except: vals.append(0.0)
        try: paid = float(row.get('total_paid', 0))
        except: paid = 0
        
        batch_npis.append(npi)
        batch_X.append(vals)
        batch_paid.append(paid)
        
        if len(batch_npis) >= BATCH:
            X_b = np.nan_to_num(np.array(batch_X, dtype=np.float32))
            X_b = scaler.transform(X_b)
            scores_b = mdl.predict_proba(X_b)[:, 1]
            for n, s, p in zip(batch_npis, scores_b, batch_paid):
                all_scored.append((n, float(s), p))
            batch_npis, batch_X, batch_paid = [], [], []
            del X_b, scores_b; gc.collect()
            print(f"  Scored {len(all_scored):,}...")
    
    # Last batch
    if batch_npis:
        X_b = np.nan_to_num(np.array(batch_X, dtype=np.float32))
        X_b = scaler.transform(X_b)
        scores_b = mdl.predict_proba(X_b)[:, 1]
        for n, s, p in zip(batch_npis, scores_b, batch_paid):
            all_scored.append((n, float(s), p))
        del X_b, scores_b; gc.collect()

print(f"  Total scored: {len(all_scored):,}")

# Sort and build output
all_scored.sort(key=lambda x: -x[1])

# Re-read full data only for top entries we need
top_npis_needed = set()
for npi, score, paid in all_scored[:500]:
    top_npis_needed.add(npi)
# Small providers: <$1M, score in top range
small_count = 0
for npi, score, paid in all_scored:
    if 10_000 < paid < 1_000_000:
        top_npis_needed.add(npi)
        small_count += 1
        if small_count >= 300: break

print(f"  Reading detail data for {len(top_npis_needed)} providers...")
npi_detail = {}
with open(FEATURES_CSV) as f:
    for row in csv.DictReader(f):
        if row['npi'] in top_npis_needed:
            npi_detail[row['npi']] = row

def make_entry(npi, score):
    row = npi_detail.get(npi, {})
    def g(k):
        v = row.get(k, '0')
        try: return float(v) if v else 0.0
        except: return 0.0
    return {
        'npi': npi, 'mlScore': round(score, 6),
        'totalPaid': g('total_paid'), 'totalClaims': int(g('total_claims')),
        'totalBeneficiaries': int(g('total_benes')), 'codeCount': int(g('code_count')),
        'activeMonths': int(g('active_months')), 'costPerClaim': round(g('cpc'), 2),
        'selfBillingRatio': round(g('self_bill_ratio'), 3),
        'topCodeConcentration': round(g('top_code_conc'), 3),
        'paidPerMonth': round(g('paid_per_mo'), 0),
    }

top_500 = [make_entry(n, s) for n, s, _ in all_scored[:500]]

small_flags = []
for npi, score, paid in all_scored:
    if 10_000 < paid < 1_000_000:
        small_flags.append(make_entry(npi, score))
        if len(small_flags) >= 200: break

scores_arr = np.array([s for _, s, _ in all_scored])
output = {
    'modelType': 'random_forest',
    'modelAuc': round(auc, 4),
    'totalProviders': len(all_scored),
    'featuresUsed': COLS,
    'topProviders': top_500,
    'smallProviderFlags': small_flags,
    'scoreDistribution': {
        'p50': round(float(np.median(scores_arr)), 6),
        'p90': round(float(np.percentile(scores_arr, 90)), 6),
        'p95': round(float(np.percentile(scores_arr, 95)), 6),
        'p99': round(float(np.percentile(scores_arr, 99)), 6),
        'p999': round(float(np.percentile(scores_arr, 99.9)), 6),
    }
}

out_path = os.path.join(OUT_DIR, 'ml-scores.json')
with open(out_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"\nSaved to {out_path}")
print(f"Model: random_forest, AUC: {auc:.4f}")
print(f"Scores: {output['scoreDistribution']}")
print(f"\nTop 10 overall:")
for p in top_500[:10]:
    print(f"  NPI {p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f}")
print(f"\nTop 10 small providers (<$1M):")
for p in small_flags[:10]:
    print(f"  NPI {p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f}")
print("\nDone!")
