#!/usr/bin/env python3
"""Look up missing provider names from CMS NPI Registry and update provider JSON files."""
import json, os, time, csv
import urllib.request, urllib.error

PROJ = os.path.expanduser("~/Projects/medicaid-tracker-app")
PROVIDERS_DIR = os.path.join(PROJ, "public/data/providers")
NPI_CSV = os.path.join(PROJ, "reference-data/npi_lookups_expanded.csv")

# Find providers without names
need_lookup = []
for f in os.listdir(PROVIDERS_DIR):
    if not f.endswith('.json'): continue
    p = json.load(open(os.path.join(PROVIDERS_DIR, f)))
    if not p.get('name'):
        need_lookup.append(p['npi'])

print(f"Need to look up {len(need_lookup)} NPIs")

# Look up via CMS API
results = []
for i, npi in enumerate(need_lookup):
    url = f"https://npiregistry.cms.hhs.gov/api/?number={npi}&version=2.1"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'MedicaidTracker/1.0'})
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        
        if data.get('result_count', 0) > 0:
            r = data['results'][0]
            basic = r.get('basic', {})
            
            # Get name
            if basic.get('organization_name'):
                name = basic['organization_name']
                entity = 'Organization'
            else:
                parts = [basic.get('first_name',''), basic.get('middle_name',''), basic.get('last_name','')]
                name = ' '.join(p for p in parts if p)
                entity = 'Individual'
            
            # Get location
            addrs = r.get('addresses', [])
            city = state = ''
            for a in addrs:
                if a.get('address_purpose') == 'LOCATION':
                    city = a.get('city', '')
                    state = a.get('state', '')
                    break
            if not city and addrs:
                city = addrs[0].get('city', '')
                state = addrs[0].get('state', '')
            
            # Get taxonomy
            tax_desc = ''
            for t in r.get('taxonomies', []):
                if t.get('primary'):
                    tax_desc = t.get('desc', '')
                    break
            
            # Title case
            name = ' '.join(w.capitalize() for w in name.lower().split()) if name else ''
            city = ' '.join(w.capitalize() for w in city.lower().split()) if city else ''
            
            # Update provider JSON
            ppath = os.path.join(PROVIDERS_DIR, f"{npi}.json")
            if os.path.exists(ppath):
                pdata = json.load(open(ppath))
                pdata['name'] = name
                pdata['city'] = city
                pdata['state'] = state
                pdata['specialty'] = tax_desc
                pdata['entityType'] = entity
                with open(ppath, 'w') as f:
                    json.dump(pdata, f, indent=2)
            
            results.append({'npi': npi, 'name': name, 'city': city, 'state': state, 'taxonomy_desc': tax_desc, 'entity_type': entity})
            
            if (i+1) % 50 == 0:
                print(f"  Looked up {i+1}/{len(need_lookup)}... ({name})")
        else:
            results.append({'npi': npi, 'name': '', 'city': '', 'state': '', 'taxonomy_desc': '', 'entity_type': ''})
    except Exception as e:
        print(f"  Error on {npi}: {e}")
        results.append({'npi': npi, 'name': '', 'city': '', 'state': '', 'taxonomy_desc': '', 'entity_type': ''})
    
    time.sleep(0.15)  # Rate limit

# Append to expanded CSV
found = sum(1 for r in results if r['name'])
print(f"\nFound {found}/{len(results)} names")

with open(NPI_CSV, 'a') as f:
    writer = csv.DictWriter(f, fieldnames=['npi','name','city','state','taxonomy_desc','entity_type'])
    for r in results:
        if r['name']:
            writer.writerow(r)

print("Updated provider JSONs and appended to NPI CSV")
