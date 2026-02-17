#!/usr/bin/env python3
"""Generate detail JSON for top 1000 providers."""
import duckdb
import json
import csv
import os

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
REF = os.path.join(os.path.dirname(__file__), '..', 'reference-data')
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
DETAIL_DIR = os.path.join(OUT, 'providers')
os.makedirs(DETAIL_DIR, exist_ok=True)

# Load NPI lookups
npi_info = {}
with open(os.path.join(REF, 'npi_lookups_expanded.csv')) as f:
    for row in csv.DictReader(f):
        npi_info[row['npi']] = row

# Load expanded watchlist flags
watchlist_flags = {}
wl_path = os.path.join(OUT, 'expanded-watchlist.json')
if os.path.exists(wl_path):
    with open(wl_path) as f:
        for item in json.load(f):
            watchlist_flags[item['npi']] = item

# Also load original watchlist
orig_wl = {}
orig_path = os.path.join(OUT, 'watchlist.json')
if os.path.exists(orig_path):
    with open(orig_path) as f:
        for item in json.load(f):
            orig_wl[str(item.get('npi', ''))] = item

print(f"NPI lookups: {len(npi_info)}, Expanded flags: {len(watchlist_flags)}, Original flags: {len(orig_wl)}")

con = duckdb.connect()

# Get top 1000 NPIs
print("Getting top 1000 providers...")
top = con.execute(f"""
    SELECT 
        BILLING_PROVIDER_NPI_NUM as npi,
        SUM(TOTAL_PAID) as total_paid,
        SUM(TOTAL_CLAIMS) as total_claims,
        SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
        COUNT(DISTINCT HCPCS_CODE) as proc_count
    FROM read_parquet('{PARQUET}')
    GROUP BY 1 ORDER BY 2 DESC LIMIT 1000
""").fetchall()

npi_list = [str(r[0]) for r in top]
npi_summary = {str(r[0]): r for r in top}

# Process in batches of 100 for detail queries
for batch_start in range(0, len(npi_list), 100):
    batch = npi_list[batch_start:batch_start+100]
    npi_str = ",".join([f"'{n}'" for n in batch])
    print(f"  Batch {batch_start//100+1}/{(len(npi_list)+99)//100}...")
    
    # Monthly trends
    monthly = con.execute(f"""
        SELECT BILLING_PROVIDER_NPI_NUM as npi, CLAIM_FROM_MONTH as month,
            SUM(TOTAL_PAID) as payments, SUM(TOTAL_CLAIMS) as claims,
            SUM(TOTAL_UNIQUE_BENEFICIARIES) as benes
        FROM read_parquet('{PARQUET}')
        WHERE CAST(BILLING_PROVIDER_NPI_NUM AS VARCHAR) IN ({npi_str})
        GROUP BY 1, 2 ORDER BY 1, 2
    """).fetchall()
    
    monthly_by_npi = {}
    for r in monthly:
        npi = str(r[0])
        if npi not in monthly_by_npi:
            monthly_by_npi[npi] = []
        monthly_by_npi[npi].append({
            'month': str(r[1]), 'payments': round(float(r[2]),2),
            'claims': int(r[3]), 'benes': int(r[4]) if r[4] else 0
        })
    
    # Procedures
    procs = con.execute(f"""
        SELECT BILLING_PROVIDER_NPI_NUM as npi, HCPCS_CODE as code,
            SUM(TOTAL_PAID) as payments, SUM(TOTAL_CLAIMS) as claims
        FROM read_parquet('{PARQUET}')
        WHERE CAST(BILLING_PROVIDER_NPI_NUM AS VARCHAR) IN ({npi_str})
        GROUP BY 1, 2 ORDER BY 1, payments DESC
    """).fetchall()
    
    procs_by_npi = {}
    for r in procs:
        npi = str(r[0])
        if npi not in procs_by_npi:
            procs_by_npi[npi] = []
        procs_by_npi[npi].append({
            'code': r[1], 'payments': round(float(r[2]),2), 'claims': int(r[3])
        })
    
    for npi in batch:
        summary = npi_summary.get(npi)
        if not summary:
            continue
        info = npi_info.get(npi, {})
        
        total_paid = round(float(summary[1]), 2)
        total_claims = int(summary[2])
        total_benes = int(summary[3]) if summary[3] else 0
        
        # Compute growth from monthly data
        months = monthly_by_npi.get(npi, [])
        growth_rate = None
        if len(months) >= 2:
            # Compare first year to last year
            years = {}
            for m in months:
                yr = m['month'][:4]
                years[yr] = years.get(yr, 0) + m['payments']
            sorted_yrs = sorted(years.items())
            if len(sorted_yrs) >= 2 and sorted_yrs[0][1] > 0:
                growth_rate = round(((sorted_yrs[-1][1] - sorted_yrs[0][1]) / sorted_yrs[0][1]) * 100, 1)
        
        # Merge flags
        new_flags = watchlist_flags.get(npi, {}).get('flags', [])
        orig_flags_list = orig_wl.get(npi, {}).get('flags', [])
        if isinstance(orig_flags_list, str):
            orig_flags_list = orig_flags_list.split('|')
        all_flags = list(set(new_flags + orig_flags_list))
        
        detail = {
            'npi': npi,
            'name': info.get('provider_name', ''),
            'specialty': info.get('taxonomy_description', ''),
            'city': info.get('city', ''),
            'state': info.get('state', ''),
            'totalPaid': total_paid,
            'totalClaims': total_claims,
            'totalBenes': total_benes,
            'procCount': int(summary[4]),
            'costPerClaim': round(total_paid / max(total_claims, 1), 2),
            'costPerBene': round(total_paid / max(total_benes, 1), 2),
            'claimsPerBene': round(total_claims / max(total_benes, 1), 1),
            'growthRate': growth_rate,
            'flags': all_flags,
            'flagCount': len(all_flags),
            'monthly': months,
            'procedures': procs_by_npi.get(npi, [])[:30]
        }
        
        with open(os.path.join(DETAIL_DIR, f'{npi}.json'), 'w') as f:
            json.dump(detail, f)

# Update top-providers list (top 1000 instead of 50)
top_list = []
for r in top:
    npi = str(r[0])
    info = npi_info.get(npi, {})
    flags = watchlist_flags.get(npi, {}).get('flags', [])
    orig_fl = orig_wl.get(npi, {}).get('flags', [])
    if isinstance(orig_fl, str):
        orig_fl = orig_fl.split('|')
    all_fl = list(set(flags + orig_fl))
    
    top_list.append({
        'npi': npi,
        'name': info.get('provider_name', ''),
        'specialty': info.get('taxonomy_description', ''),
        'city': info.get('city', ''),
        'state': info.get('state', ''),
        'totalPaid': round(float(r[1]), 2),
        'totalClaims': int(r[2]),
        'totalBenes': int(r[3]) if r[3] else 0,
        'procCount': int(r[4]),
        'flags': all_fl,
        'flagCount': len(all_fl)
    })

with open(os.path.join(OUT, 'top-providers-1000.json'), 'w') as f:
    json.dump(top_list, f)

print(f"\nDone! {len(npi_list)} provider details + top-providers-1000.json")
con.close()
