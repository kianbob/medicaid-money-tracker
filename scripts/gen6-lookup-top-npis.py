#!/usr/bin/env python3
"""Look up top 1000 NPIs from CMS NPI Registry API and save to CSV."""
import duckdb
import json
import csv
import os
import time
import urllib.request

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
REF = os.path.join(os.path.dirname(__file__), '..', 'reference-data')
EXISTING = os.path.join(REF, 'npi_lookups.csv')
OUTPUT = os.path.join(REF, 'npi_lookups_expanded.csv')

# Load existing lookups
existing_npis = set()
existing_rows = []
if os.path.exists(EXISTING):
    with open(EXISTING) as f:
        reader = csv.DictReader(f)
        for row in reader:
            existing_npis.add(row['npi'])
            existing_rows.append(row)
print(f"Existing lookups: {len(existing_npis)}")

# Get top 1000 NPIs by total spending
con = duckdb.connect()
top_npis = con.execute(f"""
    SELECT BILLING_PROVIDER_NPI_NUM as npi, SUM(TOTAL_PAID) as total
    FROM read_parquet('{PARQUET}')
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT 1000
""").fetchall()
con.close()

# Filter out ones we already have
to_lookup = [(str(r[0]), r[1]) for r in top_npis if str(r[0]) not in existing_npis]
print(f"Need to look up: {len(to_lookup)} new NPIs")

# Look up via CMS NPI Registry API
new_rows = []
for i, (npi, total) in enumerate(to_lookup):
    if i % 50 == 0:
        print(f"  Looking up {i}/{len(to_lookup)}...")
    try:
        url = f"https://npiregistry.cms.hhs.gov/api/?number={npi}&version=2.1"
        req = urllib.request.Request(url, headers={'User-Agent': 'MedicaidTracker/1.0'})
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        
        if data.get('result_count', 0) > 0:
            result = data['results'][0]
            basic = result.get('basic', {})
            
            # Get name
            if basic.get('organization_name'):
                name = basic['organization_name']
                entity = 'NPI-2'
            else:
                name = f"{basic.get('first_name', '')} {basic.get('last_name', '')}".strip()
                entity = 'NPI-1'
            
            # Get address
            addresses = result.get('addresses', [])
            practice_addr = None
            for addr in addresses:
                if addr.get('address_purpose') == 'LOCATION':
                    practice_addr = addr
                    break
            if not practice_addr and addresses:
                practice_addr = addresses[0]
            
            city = practice_addr.get('city', '') if practice_addr else ''
            state = practice_addr.get('state', '') if practice_addr else ''
            
            # Get taxonomy
            taxonomies = result.get('taxonomies', [])
            taxonomy = taxonomies[0].get('desc', '') if taxonomies else ''
            
            new_rows.append({
                'npi': npi,
                'provider_name': name,
                'entity_type': entity,
                'taxonomy_description': taxonomy,
                'city': city,
                'state': state
            })
        else:
            new_rows.append({
                'npi': npi, 'provider_name': '', 'entity_type': '',
                'taxonomy_description': '', 'city': '', 'state': ''
            })
        
        # Rate limit: ~5 requests/sec
        time.sleep(0.2)
        
    except Exception as e:
        print(f"  Error looking up {npi}: {e}")
        new_rows.append({
            'npi': npi, 'provider_name': f'ERROR: {e}', 'entity_type': '',
            'taxonomy_description': '', 'city': '', 'state': ''
        })
        time.sleep(1)

# Combine and write
all_rows = existing_rows + new_rows
fieldnames = ['npi', 'provider_name', 'entity_type', 'taxonomy_description', 'city', 'state']
with open(OUTPUT, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(all_rows)

print(f"\nDone! Total lookups: {len(all_rows)} (wrote to {OUTPUT})")
print(f"  Existing: {len(existing_rows)}")
print(f"  New: {len(new_rows)}")
