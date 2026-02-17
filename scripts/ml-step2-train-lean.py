#!/usr/bin/env python3
"""Step 2 LEAN: Train ML model with minimal RAM usage.
Key changes: n_jobs=1 everywhere, smaller RF, gc.collect between steps."""
import csv, json, os, gc
import numpy as np

FEATURES_CSV = '/tmp/ml_features.csv'
OIG_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/oig-exclusions.csv")
OUT_DIR = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")

COLS = ['total_paid','total_claims','total_benes','code_count','active_months',
        'cpc','cpb','cpb_claims','paid_per_mo','claims_per_mo',
        'top_code_conc','self_bill_ratio','short_burst','low_code_high']

# Load features
print("Loading features...")
npis = []
data = []
with open(FEATURES_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npis.append(row['npi'])
        vals = []
        for c in COLS:
            v = row.get(c, '')
            try: vals.append(float(v) if v else 0.0)
            except: vals.append(0.0)
        data.append(vals)

X = np.array(data, dtype=np.float32)
del data; gc.collect()
X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
print(f"  {len(npis):,} providers, {X.shape[1]} features")

# Load OIG labels
print("Loading OIG exclusions...")
oig_npis = set()
oig_names = {}
with open(OIG_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row.get('NPI', '').strip()
        if npi and len(npi) == 10 and npi.isdigit():
            oig_npis.add(npi)

y = np.array([1 if n in oig_npis else 0 for n in npis], dtype=np.int32)
excluded = y.sum()
print(f"  {len(oig_npis):,} OIG NPIs, {excluded} matched in data")

# Scale
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
del X; gc.collect()

print(f"\nSUPERVISED: {excluded} positive labels")
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# Lean RF: fewer trees, n_jobs=1 to avoid duplicating memory
mdl = RandomForestClassifier(
    n_estimators=50,  # was 100
    class_weight='balanced',
    random_state=42,
    n_jobs=1,  # KEY: no multiprocessing = no RAM doubling
    max_depth=10,  # was 12
    max_features='sqrt',
)

print("  Cross-validating (n_jobs=1 to save RAM)...")
cv = cross_val_score(mdl, X_scaled, y, cv=5, scoring='roc_auc', n_jobs=1)
auc = cv.mean()
print(f"  AUC: {auc:.4f} (+/- {cv.std():.4f})")

print("  Final fit...")
mdl.fit(X_scaled, y)
gc.collect()

scores = mdl.predict_proba(X_scaled)[:, 1]

imp = sorted(zip(COLS, mdl.feature_importances_), key=lambda x: -x[1])
print("\nFeature importance:")
for f, i in imp: print(f"  {f}: {i:.4f}")

# Build output - expanded: top 500 overall + top 200 "small providers" (< $1M total paid)
print("\nGenerating output...")

# Build scored list with original data
# Reconstruct raw data from X_scaled (we need original values for output)
# Actually let's re-read just the NPIs we need from CSV
npi_to_idx = {n: i for i, n in enumerate(npis)}
scored = list(zip(npis, scores.tolist()))
scored.sort(key=lambda x: -x[1])

# Re-read CSV for output fields (memory efficient - only keep what we need)
print("  Re-reading features for output...")
npi_data = {}
with open(FEATURES_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row['npi']
        npi_data[npi] = row

def make_entry(npi, score):
    row = npi_data.get(npi, {})
    def g(k): 
        v = row.get(k, '0')
        try: return float(v) if v else 0.0
        except: return 0.0
    return {
        'npi': npi,
        'mlScore': round(float(score), 6),
        'totalPaid': g('total_paid'),
        'totalClaims': int(g('total_claims')),
        'totalBeneficiaries': int(g('total_benes')),
        'codeCount': int(g('code_count')),
        'activeMonths': int(g('active_months')),
        'costPerClaim': round(g('cpc'), 2),
        'selfBillingRatio': round(g('self_bill_ratio'), 3),
        'topCodeConcentration': round(g('top_code_conc'), 3),
        'paidPerMonth': round(g('paid_per_mo'), 0),
    }

# Top 500 overall
top_500 = []
for npi, score in scored[:500]:
    top_500.append(make_entry(npi, score))

# Small provider fraud: providers with < $1M total but high ML score
small_provider_fraud = []
for npi, score in scored:
    if len(small_provider_fraud) >= 200:
        break
    row = npi_data.get(npi, {})
    try: paid = float(row.get('total_paid', 0))
    except: paid = 0
    if paid < 1_000_000 and paid > 10_000:  # between $10K-$1M
        small_provider_fraud.append(make_entry(npi, score))

print(f"  Top 500 overall, {len(small_provider_fraud)} small-provider flags")

all_scores = np.array([s for _, s in scored])
output = {
    'modelType': 'random_forest',
    'modelAuc': round(auc, 4),
    'totalProviders': len(npis),
    'featuresUsed': COLS,
    'topProviders': top_500,
    'smallProviderFlags': small_provider_fraud,
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
print(f"Model: random_forest, AUC: {auc:.4f}")
print(f"Scores: {output['scoreDistribution']}")
print(f"\nTop 10 overall:")
for p in top_500[:10]:
    print(f"  NPI {p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f}")
print(f"\nTop 10 small providers (<$1M):")
for p in small_provider_fraud[:10]:
    print(f"  NPI {p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f}")
print("\nDone!")
