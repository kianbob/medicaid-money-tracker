#!/usr/bin/env python3
"""
Generate top providers per procedure code.
For each of the ~10K procedure codes, produce a list of top 50 providers
with their cost/claim and percentile tier. Saved as individual JSON files
in public/data/code-providers/{CODE}.json
"""
import duckdb, json, os, csv

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT_DIR = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data/code-providers")
BENCHMARKS = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data/code-benchmarks.json")
NPI_CSV = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/npi_lookups_expanded.csv")

os.makedirs(OUT_DIR, exist_ok=True)

# Load NPI names
npi_names = {}
with open(NPI_CSV) as f:
    for row in csv.DictReader(f):
        npi_names[row['npi']] = {
            'name': row.get('provider_name', ''),
            'city': row.get('city', ''),
            'state': row.get('state', ''),
            'specialty': row.get('taxonomy_description', '')
        }

# Load benchmarks
with open(BENCHMARKS) as f:
    benchmarks = json.load(f)

con = duckdb.connect()

# Get list of codes with enough providers
print("Getting code list...")
codes = con.execute(f"""
    SELECT HCPCS_CODE, COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM) as providers
    FROM '{PARQUET}'
    GROUP BY HCPCS_CODE
    HAVING providers >= 5
    ORDER BY providers DESC
""").fetchall()
print(f"{len(codes)} codes with 5+ providers")

# Process codes in batches to avoid OOM
batch_size = 200
generated = 0

for batch_start in range(0, len(codes), batch_size):
    batch = codes[batch_start:batch_start + batch_size]
    code_list = ','.join(f"'{c[0]}'" for c in batch)
    
    print(f"Batch {batch_start//batch_size + 1}: codes {batch_start+1}-{batch_start+len(batch)}...")
    
    rows = con.execute(f"""
        SELECT 
            HCPCS_CODE as code,
            BILLING_PROVIDER_NPI_NUM as npi,
            SUM(TOTAL_PAID) as paid,
            SUM(TOTAL_CLAIMS) as claims,
            SUM(TOTAL_UNIQUE_BENEFICIARIES) as benes,
            SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as cpc
        FROM '{PARQUET}'
        WHERE HCPCS_CODE IN ({code_list})
        GROUP BY code, npi
        HAVING SUM(TOTAL_CLAIMS) > 0
        ORDER BY code, paid DESC
    """).fetchall()
    
    # Group by code
    by_code = {}
    for r in rows:
        code = r[0]
        if code not in by_code:
            by_code[code] = []
        by_code[code].append(r)
    
    for code, providers in by_code.items():
        bm = benchmarks.get(code, {})
        p90 = bm.get('p90', 0)
        p75 = bm.get('p75', 0)
        p99 = bm.get('p99', 0)
        median = bm.get('medianCostPerClaim', 0)
        
        # Take top 50 by total paid
        top = []
        for r in providers[:50]:
            npi = str(r[1])
            info = npi_names.get(npi, {})
            cpc = float(r[5]) if r[5] else 0
            
            # Determine percentile tier
            if p99 > 0 and cpc >= p99: tier = 'p99'
            elif p90 > 0 and cpc >= p90: tier = 'p90'
            elif p75 > 0 and cpc >= p75: tier = 'p75'
            elif median > 0 and cpc >= median: tier = 'above_median'
            else: tier = 'below_median'
            
            entry = {
                'npi': npi,
                'name': info.get('name', ''),
                'city': info.get('city', ''),
                'state': info.get('state', ''),
                'specialty': info.get('specialty', ''),
                'totalPaid': float(r[2]),
                'claims': int(r[3]),
                'beneficiaries': int(r[4]),
                'costPerClaim': round(cpc, 2),
                'tier': tier
            }
            if median > 0:
                entry['vsMedian'] = round(cpc / median, 1)
            top.append(entry)
        
        with open(os.path.join(OUT_DIR, f"{code}.json"), 'w') as f:
            json.dump({
                'code': code,
                'providerCount': len(providers),
                'topProviders': top
            }, f)
        generated += 1

con.close()
print(f"\nGenerated {generated} code-provider files in {OUT_DIR}")
