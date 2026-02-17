#!/usr/bin/env python3
"""Generate provider detail pages for ML top-200 flagged providers."""
import duckdb, json, os, csv, time, urllib.request

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
BASE = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")
NPI_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/npi_lookups_expanded.csv")
BENCHMARKS = os.path.join(BASE, "code-benchmarks.json")

# Load existing NPI names
npi_names = {}
with open(NPI_CSV) as f:
    for row in csv.DictReader(f):
        npi_names[row['npi']] = row

# Load ML scores
with open(os.path.join(BASE, "ml-scores.json")) as f:
    ml = json.load(f)

# Load benchmarks
with open(BENCHMARKS) as f:
    benchmarks = json.load(f)

# Find which need pages
need_pages = []
for p in ml['topProviders']:
    path = os.path.join(BASE, "providers", f"{p['npi']}.json")
    if not os.path.exists(path):
        need_pages.append(p['npi'])

print(f"Need to create {len(need_pages)} provider pages")

# Look up names for unknowns
unknown = [n for n in need_pages if n not in npi_names]
print(f"Looking up {len(unknown)} unknown NPIs...")

KEEP_UPPER = {'LLC','INC','LP','LLP','PC','PA','MD','DO','DDS','PLLC','USA','US'}
SMALL_WORDS = {'of','the','and','in','for','to','a','an','at','by','or','on'}
def title_case(s):
    if not s: return s
    words = s.split()
    result = []
    for i, w in enumerate(words):
        if w.upper() in KEEP_UPPER: result.append(w.upper())
        elif i > 0 and w.lower() in SMALL_WORDS: result.append(w.lower())
        else: result.append(w.capitalize())
    return ' '.join(result)

for i, npi in enumerate(unknown):
    if i % 20 == 0 and i > 0: print(f"  {i}/{len(unknown)}...")
    try:
        url = f"https://npiregistry.cms.hhs.gov/api/?number={npi}&version=2.1"
        req = urllib.request.Request(url, headers={'User-Agent': 'MedicaidTracker/1.0'})
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        if data.get('result_count', 0) > 0:
            r = data['results'][0]
            basic = r.get('basic', {})
            name = basic.get('organization_name') or f"{basic.get('first_name','')} {basic.get('last_name','')}".strip()
            addrs = r.get('addresses', [])
            addr = next((a for a in addrs if a.get('address_purpose') == 'LOCATION'), addrs[0] if addrs else {})
            taxs = r.get('taxonomies', [])
            npi_names[npi] = {
                'npi': npi, 'provider_name': name,
                'taxonomy_description': taxs[0].get('desc','') if taxs else '',
                'city': addr.get('city',''), 'state': addr.get('state','')
            }
        time.sleep(0.15)
    except:
        npi_names[npi] = {'npi': npi, 'provider_name': '', 'taxonomy_description': '', 'city': '', 'state': ''}

# Save updated NPI lookups
print("Saving updated NPI lookups...")
fieldnames = ['npi', 'provider_name', 'entity_type', 'taxonomy_description', 'city', 'state']
with open(NPI_CSV, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for row in npi_names.values():
        writer.writerow({k: row.get(k,'') for k in fieldnames})

# Query detailed data
con = duckdb.connect()
npi_list = ','.join(f"'{n}'" for n in need_pages)

print("Querying billing data...")
code_data = con.execute(f"""
SELECT BILLING_PROVIDER_NPI_NUM as npi, HCPCS_CODE as code,
       SUM(TOTAL_PAID) as paid, SUM(TOTAL_CLAIMS) as claims, SUM(TOTAL_UNIQUE_BENEFICIARIES) as benes
FROM '{PARQUET}' WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
GROUP BY npi, code ORDER BY npi, paid DESC
""").fetchall()

year_data = con.execute(f"""
SELECT BILLING_PROVIDER_NPI_NUM as npi, LEFT(CLAIM_FROM_MONTH, 4) as year,
       SUM(TOTAL_PAID) as paid, SUM(TOTAL_CLAIMS) as claims, SUM(TOTAL_UNIQUE_BENEFICIARIES) as benes
FROM '{PARQUET}' WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
GROUP BY npi, LEFT(CLAIM_FROM_MONTH, 4) ORDER BY npi, year
""").fetchall()

totals = {}
for r in con.execute(f"""
SELECT BILLING_PROVIDER_NPI_NUM as npi, SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS),
       SUM(TOTAL_UNIQUE_BENEFICIARIES), COUNT(DISTINCT HCPCS_CODE), MIN(CLAIM_FROM_MONTH), MAX(CLAIM_FROM_MONTH)
FROM '{PARQUET}' WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list}) GROUP BY npi
""").fetchall():
    totals[str(r[0])] = r
con.close()

# Organize
codes_by_npi = {}
for r in code_data:
    codes_by_npi.setdefault(str(r[0]), []).append({"code": r[1], "payments": float(r[2]), "claims": int(r[3]), "beneficiaries": int(r[4])})
years_by_npi = {}
for r in year_data:
    years_by_npi.setdefault(str(r[0]), []).append({"year": r[1], "payments": float(r[2]), "claims": int(r[3]), "beneficiaries": int(r[4])})

# ML scores lookup
ml_lookup = {p['npi']: p['mlScore'] for p in ml['topProviders']}

# Generate pages
created = 0
for npi in need_pages:
    t = totals.get(npi)
    if not t: continue
    info = npi_names.get(npi, {})
    codes = codes_by_npi.get(npi, [])
    years = years_by_npi.get(npi, [])
    
    # Enrich codes with benchmarks
    for c in codes:
        bm = benchmarks.get(c['code'])
        if bm and c['claims'] > 0:
            cpc = c['payments'] / c['claims']
            c['costPerClaim'] = round(cpc, 2)
            c['nationalMedianCpc'] = bm.get('medianCostPerClaim', 0)
            c['nationalAvgCpc'] = bm.get('avgCostPerClaim', 0)
            c['p90'] = bm.get('p90', 0)
            c['p99'] = bm.get('p99', 0)
            if bm.get('medianCostPerClaim', 0) > 0:
                c['cpcRatio'] = round(cpc / bm['medianCostPerClaim'], 1)
    
    tp = float(t[1]); tc = int(t[2]); tb = int(t[3])
    provider = {
        "npi": npi,
        "name": title_case(info.get('provider_name', '')),
        "city": title_case(info.get('city', '')),
        "state": info.get('state', ''),
        "specialty": info.get('taxonomy_description', ''),
        "totalPaid": tp, "totalClaims": tc, "totalBeneficiaries": tb,
        "codeCount": int(t[4]), "firstMonth": t[5], "lastMonth": t[6],
        "codes": codes, "yearlyTrend": years,
        "mlScore": ml_lookup.get(npi, 0),
        "source": "ml_model"
    }
    if tc > 0: provider["costPerClaim"] = round(tp / tc, 2)
    if tb > 0:
        provider["costPerBeneficiary"] = round(tp / tb, 2)
        provider["claimsPerBeneficiary"] = round(tc / tb, 1)
    
    with open(os.path.join(BASE, "providers", f"{npi}.json"), 'w') as f:
        json.dump(provider, f)
    created += 1

print(f"Created {created} provider detail pages")
print("Done!")
