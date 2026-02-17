#!/usr/bin/env python3
"""Look up missing NPI names and enrich all watchlists + generate provider detail files."""
import json
import csv
import os
import time
import urllib.request
import duckdb

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
REF = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data")
OUT = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")

# Load existing NPI lookups
existing = {}
with open(os.path.join(REF, 'npi_lookups_expanded.csv')) as f:
    for row in csv.DictReader(f):
        existing[row['npi']] = row

# Collect all NPIs that need lookup from watchlists
missing_npis = set()
for wl_file in ['expanded-watchlist.json', 'smart-watchlist.json']:
    with open(os.path.join(OUT, wl_file)) as f:
        wl = json.load(f)
    for p in wl:
        npi = p.get('npi', '')
        if npi and npi not in existing:
            missing_npis.add(npi)

# Also check fraud test files
for fraud_file in ['fraud-explosive-growth.json', 'fraud-instant-volume.json', 
                    'fraud-procedure-concentration.json', 'fraud-billing-consistency.json',
                    'fraud-code-outliers.json', 'fraud-billing-swings.json',
                    'fraud-new-entrants.json', 'fraud-rate-outliers.json']:
    path = os.path.join(OUT, fraud_file)
    if os.path.exists(path):
        with open(path) as f:
            data = json.load(f)
        for p in data:
            npi = p.get('npi', '')
            if npi and npi not in existing:
                missing_npis.add(npi)

print(f"Need to look up {len(missing_npis)} NPIs")

# Batch lookup
new_rows = []
for i, npi in enumerate(missing_npis):
    if i % 50 == 0:
        print(f"  Looking up {i}/{len(missing_npis)}...")
    try:
        url = f"https://npiregistry.cms.hhs.gov/api/?number={npi}&version=2.1"
        req = urllib.request.Request(url, headers={'User-Agent': 'MedicaidTracker/1.0'})
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        
        if data.get('result_count', 0) > 0:
            result = data['results'][0]
            basic = result.get('basic', {})
            if basic.get('organization_name'):
                name = basic['organization_name']
                entity = 'NPI-2'
            else:
                name = f"{basic.get('first_name', '')} {basic.get('last_name', '')}".strip()
                entity = 'NPI-1'
            addresses = result.get('addresses', [])
            addr = next((a for a in addresses if a.get('address_purpose') == 'LOCATION'), addresses[0] if addresses else {})
            city = addr.get('city', '')
            state = addr.get('state', '')
            taxonomies = result.get('taxonomies', [])
            taxonomy = taxonomies[0].get('desc', '') if taxonomies else ''
            
            row = {'npi': npi, 'provider_name': name, 'entity_type': entity,
                   'taxonomy_description': taxonomy, 'city': city, 'state': state}
        else:
            row = {'npi': npi, 'provider_name': '', 'entity_type': '', 
                   'taxonomy_description': '', 'city': '', 'state': ''}
        
        new_rows.append(row)
        existing[npi] = row
        time.sleep(0.2)
    except Exception as e:
        print(f"  Error {npi}: {e}")
        row = {'npi': npi, 'provider_name': '', 'entity_type': '',
               'taxonomy_description': '', 'city': '', 'state': ''}
        new_rows.append(row)
        existing[npi] = row
        time.sleep(1)

# Save updated CSV
print(f"Saving {len(existing)} total NPI lookups...")
fieldnames = ['npi', 'provider_name', 'entity_type', 'taxonomy_description', 'city', 'state']
with open(os.path.join(REF, 'npi_lookups_expanded.csv'), 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for npi, row in existing.items():
        writer.writerow({k: row.get(k, '') for k in fieldnames})

# Title case helper
KEEP_UPPER = {'LLC','INC','LP','LLP','PC','PA','MD','DO','DDS','DMD','PhD','RN','NP','PLLC',
              'DPM','OD','PT','II','III','IV','HHS','DHHS','PHS','IHS','USA','US','CDC'}
SMALL_WORDS = {'of','the','and','in','for','to','a','an','at','by','or','on','is','with'}
def title_case(s):
    if not s: return s
    words = s.split()
    result = []
    for i, w in enumerate(words):
        if w.upper() in KEEP_UPPER:
            result.append(w.upper())
        elif i > 0 and w.lower() in SMALL_WORDS:
            result.append(w.lower())
        else:
            result.append(w.capitalize())
    return ' '.join(result)

# Now enrich ALL watchlist files
print("Enriching watchlist files with names...")

# Get spending data for all flagged NPIs
con = duckdb.connect()
all_flagged_npis = set()
for wl_file in ['expanded-watchlist.json', 'smart-watchlist.json']:
    with open(os.path.join(OUT, wl_file)) as f:
        for p in json.load(f):
            all_flagged_npis.add(p['npi'])

# Batch query spending
npi_spending = {}
flagged_list = list(all_flagged_npis)
for batch_start in range(0, len(flagged_list), 200):
    batch = flagged_list[batch_start:batch_start+200]
    npi_str = ",".join([f"'{n}'" for n in batch])
    rows = con.execute(f"""
        SELECT BILLING_PROVIDER_NPI_NUM as npi, SUM(TOTAL_PAID) as total,
            SUM(TOTAL_CLAIMS) as claims, SUM(TOTAL_UNIQUE_BENEFICIARIES) as benes
        FROM read_parquet('{PARQUET}')
        WHERE CAST(BILLING_PROVIDER_NPI_NUM AS VARCHAR) IN ({npi_str})
        GROUP BY 1
    """).fetchall()
    for r in rows:
        npi_spending[str(r[0])] = {
            'totalPaid': round(float(r[1]), 2),
            'totalClaims': int(r[2]),
            'totalBenes': int(r[3]) if r[3] else 0
        }
con.close()

# Update expanded watchlist
with open(os.path.join(OUT, 'expanded-watchlist.json')) as f:
    ew = json.load(f)
for p in ew:
    npi = p['npi']
    info = existing.get(npi, {})
    spend = npi_spending.get(npi, {})
    p['name'] = title_case(info.get('provider_name', ''))
    p['specialty'] = info.get('taxonomy_description', '')
    p['city'] = title_case(info.get('city', ''))
    p['state'] = info.get('state', '')
    p['totalPaid'] = spend.get('totalPaid', 0)
    p['totalClaims'] = spend.get('totalClaims', 0)
    p['totalBenes'] = spend.get('totalBenes', 0)
with open(os.path.join(OUT, 'expanded-watchlist.json'), 'w') as f:
    json.dump(ew, f)

# Update smart watchlist
with open(os.path.join(OUT, 'smart-watchlist.json')) as f:
    sw = json.load(f)
for p in sw:
    npi = p['npi']
    info = existing.get(npi, {})
    spend = npi_spending.get(npi, {})
    if not p.get('name'):
        p['name'] = title_case(info.get('provider_name', ''))
    if not p.get('specialty'):
        p['specialty'] = info.get('taxonomy_description', '')
    if not p.get('city'):
        p['city'] = title_case(info.get('city', ''))
    if not p.get('state'):
        p['state'] = info.get('state', '')
    if not p.get('totalPaid') or p['totalPaid'] == 0:
        p['totalPaid'] = spend.get('totalPaid', 0)
with open(os.path.join(OUT, 'smart-watchlist.json'), 'w') as f:
    json.dump(sw, f)

# Also generate minimal provider detail files for flagged NPIs that don't have one
provider_dir = os.path.join(OUT, 'providers')
created = 0
for npi in all_flagged_npis:
    if not os.path.exists(os.path.join(provider_dir, f'{npi}.json')):
        info = existing.get(npi, {})
        spend = npi_spending.get(npi, {})
        detail = {
            'npi': npi,
            'name': title_case(info.get('provider_name', '')),
            'specialty': info.get('taxonomy_description', ''),
            'city': title_case(info.get('city', '')),
            'state': info.get('state', ''),
            'totalPaid': spend.get('totalPaid', 0),
            'totalClaims': spend.get('totalClaims', 0),
            'totalBenes': spend.get('totalBenes', 0),
            'procedures': [],
            'monthly': [],
            'flags': [],
            'limited': True
        }
        with open(os.path.join(provider_dir, f'{npi}.json'), 'w') as f:
            json.dump(detail, f)
        created += 1

print(f"Created {created} new provider detail files for flagged NPIs")
print(f"Total provider files: {len(os.listdir(provider_dir))}")
print("Done!")
