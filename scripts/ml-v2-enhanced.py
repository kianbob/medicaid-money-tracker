#!/usr/bin/env python3
"""
Enhanced ML Model v2:
- Better labels from LEIE with exclusion type severity
- Name matching for excluded providers without NPIs
- More features including billing network analysis
- Ensemble approach
"""
import csv, json, os, numpy as np

FEATURES_CSV = '/tmp/ml_features.csv'  # From ml-step1-features.py (already generated)
LEIE_CSV = '/tmp/leie_full.csv'
OUT = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")
NPI_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/npi_lookups_expanded.csv")
BILLING_NETWORKS = os.path.join(OUT, "billing-networks.json")

# Check if features exist, regenerate if needed
if not os.path.exists(FEATURES_CSV):
    print("Features CSV not found — run ml-step1-features.py first!")
    exit(1)

# Step 1: Build comprehensive exclusion labels
print("Step 1: Building enhanced exclusion labels...")

# LEIE exclusion types and their fraud-relevance weights
FRAUD_WEIGHTS = {
    '1128a1': 1.0,    # Healthcare fraud conviction (STRONGEST signal)
    '1128a3': 1.0,    # Healthcare fraud felony
    '1128b1': 0.9,    # Fraud, kickbacks, other prohibited acts
    '1128b7': 0.8,    # Fraud/abuse/misconduct
    '1128a2': 0.5,    # Patient abuse (different from billing fraud)
    '1128a4': 0.4,    # Controlled substance felony
    '1128b4': 0.3,    # License revocation (could be many reasons)
    '1128b5': 0.6,    # Default on loan
    '1128b8': 0.7,    # Entity controlled by sanctioned individual
    '1128b14': 0.5,   # Default on scholarship
    '1128b3': 0.7,    # Misdemeanor conviction
    '1128b6': 0.6,    # Entity owned by sanctioned family member
    '1128Aa': 0.9,    # Mandatory exclusion
}

# Load LEIE with NPI matching
excluded_by_npi = {}  # npi -> max_weight
excluded_by_name = {}  # normalized_name -> (weight, details)

with open(LEIE_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi = row.get('NPI', '').strip()
        etype = row.get('EXCLTYPE', '').strip()
        weight = FRAUD_WEIGHTS.get(etype, 0.2)
        
        # NPI match
        if npi and npi != '0000000000' and len(npi) == 10 and npi.isdigit():
            if npi not in excluded_by_npi or weight > excluded_by_npi[npi]:
                excluded_by_npi[npi] = weight
        
        # Name match for organizations (no NPI)
        busname = row.get('BUSNAME', '').strip().upper()
        lastname = row.get('LASTNAME', '').strip().upper()
        firstname = row.get('FIRSTNAME', '').strip().upper()
        state = row.get('STATE', '').strip()
        
        if busname and len(busname) > 5:
            key = f"{busname}|{state}"
            if key not in excluded_by_name or weight > excluded_by_name[key][0]:
                excluded_by_name[key] = (weight, etype)
        elif lastname and firstname:
            key = f"{lastname}|{firstname}|{state}"
            if key not in excluded_by_name or weight > excluded_by_name[key][0]:
                excluded_by_name[key] = (weight, etype)

print(f"  LEIE NPI matches: {len(excluded_by_npi)}")
print(f"  LEIE name entries: {len(excluded_by_name)}")

# Load NPI registry for name matching
npi_info = {}
with open(NPI_CSV) as f:
    for row in csv.DictReader(f):
        npi_info[row['npi']] = row

# Step 2: Load features and create enhanced labels
print("\nStep 2: Loading features and matching labels...")
npis = []
data = []
feature_cols = ['total_paid','total_claims','total_benes','code_count','active_months',
    'cpc','cpb','cpb_claims','paid_per_mo','claims_per_mo',
    'top_code_conc','self_bill_ratio','short_burst','low_code_high']

with open(FEATURES_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npis.append(row['npi'])
        vals = []
        for c in feature_cols:
            v = row.get(c, '')
            try: vals.append(float(v) if v else 0.0)
            except: vals.append(0.0)
        data.append(vals)

X = np.array(data, dtype=np.float32)
X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)

# Create weighted labels
y_weight = np.zeros(len(npis), dtype=np.float32)
y_binary = np.zeros(len(npis), dtype=np.int32)
matched_npi = 0
matched_name = 0

for i, npi in enumerate(npis):
    # NPI match
    if npi in excluded_by_npi:
        y_weight[i] = excluded_by_npi[npi]
        y_binary[i] = 1
        matched_npi += 1
        continue
    
    # Name match
    info = npi_info.get(npi, {})
    name = info.get('provider_name', '').strip().upper()
    state = info.get('state', '').strip()
    
    if name and len(name) > 5:
        key = f"{name}|{state}"
        if key in excluded_by_name:
            y_weight[i] = excluded_by_name[key][0]
            y_binary[i] = 1
            matched_name += 1

total_pos = y_binary.sum()
print(f"  Total providers: {len(npis):,}")
print(f"  Matched by NPI: {matched_npi}")
print(f"  Matched by name: {matched_name}")
print(f"  Total positive labels: {total_pos}")

# Step 3: Add billing network features
print("\nStep 3: Adding billing network features...")
if os.path.exists(BILLING_NETWORKS):
    with open(BILLING_NETWORKS) as f:
        bn = json.load(f)
    network_npis = {n['billingNpi']: n['servicingProviderCount'] for n in bn['topNetworks']}
    
    # Add network size as a feature
    network_feature = np.array([network_npis.get(npi, 0) for npi in npis], dtype=np.float32).reshape(-1, 1)
    X = np.hstack([X, network_feature])
    feature_cols.append('network_size')
    print(f"  Added network_size feature ({sum(1 for n in npis if n in network_npis)} providers with networks)")

# Step 4: Train enhanced model
print("\nStep 4: Training enhanced model...")
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

results = {}
for name, mdl in [
    ('logistic_regression', LogisticRegression(max_iter=2000, class_weight='balanced', random_state=42, solver='saga')),
    ('random_forest', RandomForestClassifier(n_estimators=150, class_weight='balanced', random_state=42, n_jobs=2, max_depth=15)),
    # gradient_boosting removed — OOM killed on this machine
]:
    print(f"  Training {name}...")
    try:
        cv = cross_val_score(mdl, X_scaled, y_binary, cv=5, scoring='roc_auc', n_jobs=2)
        auc = cv.mean()
        print(f"    AUC: {auc:.4f} (+/- {cv.std():.4f})")
        results[name] = (auc, mdl)
    except Exception as e:
        print(f"    Failed: {e}")

best_name = max(results, key=lambda k: results[k][0])
best_auc = results[best_name][0]
best_model = results[best_name][1]
print(f"\nBest: {best_name} (AUC: {best_auc:.4f})")

# Fit on full data
best_model.fit(X_scaled, y_binary)
if hasattr(best_model, 'predict_proba'):
    scores = best_model.predict_proba(X_scaled)[:, 1]
else:
    scores = best_model.decision_function(X_scaled)

# Feature importance
if hasattr(best_model, 'feature_importances_'):
    imp = sorted(zip(feature_cols, best_model.feature_importances_), key=lambda x: -x[1])
    print("\nFeature importance:")
    for f, i in imp:
        print(f"  {f}: {i:.4f}")

# Step 5: Output
print("\nStep 5: Generating output...")
scored = sorted(zip(npis, scores, data), key=lambda x: -x[1])

top_500 = []
for npi, score, row in scored[:500]:
    is_excl = npi in excluded_by_npi
    info = npi_info.get(npi, {})
    top_500.append({
        'npi': npi,
        'name': info.get('provider_name', ''),
        'city': info.get('city', ''),
        'state': info.get('state', ''),
        'specialty': info.get('taxonomy_description', ''),
        'mlScore': round(float(score), 6),
        'totalPaid': row[0],
        'totalClaims': int(row[1]),
        'codeCount': int(row[3]),
        'activeMonths': int(row[4]),
        'costPerClaim': round(row[5], 2),
        'selfBillingRatio': round(row[11], 3),
        'topCodeConcentration': round(row[10], 3),
        'paidPerMonth': round(row[8], 0),
        'isExcluded': is_excl,
    })

all_scores = np.array([s for _, s, _ in scored])
output = {
    'modelType': best_name,
    'modelVersion': 2,
    'modelAuc': round(best_auc, 4),
    'totalProviders': len(npis),
    'positiveLabels': int(total_pos),
    'labelSources': {
        'npiMatch': matched_npi,
        'nameMatch': matched_name,
    },
    'exclusionTypeWeights': FRAUD_WEIGHTS,
    'featuresUsed': feature_cols,
    'topProviders': top_500,
    'scoreDistribution': {
        'p50': round(float(np.median(all_scores)), 6),
        'p90': round(float(np.percentile(all_scores, 90)), 6),
        'p95': round(float(np.percentile(all_scores, 95)), 6),
        'p99': round(float(np.percentile(all_scores, 99)), 6),
        'p999': round(float(np.percentile(all_scores, 99.9)), 6),
    }
}

with open(os.path.join(OUT, 'ml-scores.json'), 'w') as f:
    json.dump(output, f, indent=2)

print(f"\nModel: {best_name} v2, AUC: {best_auc:.4f}")
print(f"Labels: {total_pos} ({matched_npi} NPI + {matched_name} name)")
print(f"Scores: {output['scoreDistribution']}")
print(f"\nTop 10 (non-excluded):")
shown = 0
for p in top_500:
    if not p['isExcluded']:
        print(f"  {p['name'] or p['npi']}: score={p['mlScore']:.4f} paid=${p['totalPaid']:,.0f} codes={p['codeCount']} self={p['selfBillingRatio']:.2f}")
        shown += 1
        if shown >= 10:
            break

print("\nDone!")
