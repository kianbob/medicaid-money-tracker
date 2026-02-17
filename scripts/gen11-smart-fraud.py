#!/usr/bin/env python3
"""Smarter fraud detection: compare to code-specific benchmarks, find swings, new entrants."""
import duckdb
import json
import csv
import os
from collections import defaultdict

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")
REF = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/npi_lookups_expanded.csv")

con = duckdb.connect()

# Load NPI info
npi_info = {}
with open(REF) as f:
    for row in csv.DictReader(f):
        npi_info[row['npi']] = row

def get_info(npi):
    info = npi_info.get(str(npi), {})
    return info.get('provider_name',''), info.get('specialty',''), info.get('city',''), info.get('state','')

# Load code benchmarks
with open(os.path.join(OUT, 'code-benchmarks.json')) as f:
    code_bench = json.load(f)

# ============================================
# TEST 1: Code-specific outliers
# Providers billing at >3x the median for their specific code
# (addresses Kian's feedback about comparing to code-specific rates)
# ============================================
print("Test 1: Code-specific cost outliers...")
outliers = con.execute(f"""
    SELECT 
        BILLING_PROVIDER_NPI_NUM as npi,
        HCPCS_CODE as code,
        SUM(TOTAL_PAID) as total_paid,
        SUM(TOTAL_CLAIMS) as total_claims,
        SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as provider_cpc
    FROM read_parquet('{PARQUET}')
    GROUP BY 1, 2
    HAVING SUM(TOTAL_CLAIMS) >= 100 AND SUM(TOTAL_PAID) > 100000
""").fetchall()

code_outlier_flags = []
for r in outliers:
    npi, code, paid, claims, prov_cpc = str(r[0]), r[1], float(r[2]), int(r[3]), float(r[4]) if r[4] else 0
    bench = code_bench.get(code)
    if not bench or not bench.get('medianCostPerClaim') or bench['medianCostPerClaim'] <= 0:
        continue
    ratio = prov_cpc / bench['medianCostPerClaim']
    if ratio > 3 and paid > 500000:
        name, spec, city, state = get_info(npi)
        code_outlier_flags.append({
            'npi': npi, 'name': name, 'specialty': spec, 'city': city, 'state': state,
            'code': code, 'totalPaid': round(paid, 2), 'totalClaims': claims,
            'providerCpc': round(prov_cpc, 2),
            'nationalMedianCpc': bench['medianCostPerClaim'],
            'ratio': round(ratio, 1),
            'p90': bench.get('p90'),
            'p99': bench.get('p99'),
            'flag': 'code_specific_outlier'
        })
code_outlier_flags.sort(key=lambda x: x['totalPaid'], reverse=True)
code_outlier_flags = code_outlier_flags[:300]
print(f"  {len(code_outlier_flags)} code-specific outliers")

# ============================================
# TEST 2: Billing swings (year-over-year >200% change either direction)
# ============================================
print("Test 2: Billing swings...")
swings = con.execute(f"""
    WITH yearly AS (
        SELECT 
            BILLING_PROVIDER_NPI_NUM as npi,
            CAST(LEFT(CAST(CLAIM_FROM_MONTH AS VARCHAR), 4) AS INT) as year,
            SUM(TOTAL_PAID) as payments
        FROM read_parquet('{PARQUET}')
        GROUP BY 1, 2
    ),
    yoy AS (
        SELECT 
            a.npi, a.year as yr1, b.year as yr2,
            a.payments as pay1, b.payments as pay2,
            ((b.payments - a.payments) / NULLIF(a.payments, 0)) * 100 as pct_change,
            ABS(b.payments - a.payments) as abs_change
        FROM yearly a JOIN yearly b ON a.npi = b.npi AND b.year = a.year + 1
        WHERE a.payments > 50000
    )
    SELECT * FROM yoy
    WHERE ABS(pct_change) > 200 AND abs_change > 1000000
    ORDER BY abs_change DESC LIMIT 300
""").fetchall()

swing_flags = []
for r in swings:
    npi = str(r[0])
    name, spec, city, state = get_info(npi)
    swing_flags.append({
        'npi': npi, 'name': name, 'specialty': spec, 'city': city, 'state': state,
        'fromYear': int(r[1]), 'toYear': int(r[2]),
        'fromPay': round(float(r[3]), 2), 'toPay': round(float(r[4]), 2),
        'pctChange': round(float(r[5]), 1),
        'absChange': round(float(r[6]), 2),
        'flag': 'billing_swing'
    })
print(f"  {len(swing_flags)} billing swing flags")

# ============================================
# TEST 3: Massive new entrants (first appeared recently, billing big immediately)
# ============================================
print("Test 3: Massive new entrants...")
new_entrants = con.execute(f"""
    WITH first_seen AS (
        SELECT 
            BILLING_PROVIDER_NPI_NUM as npi,
            MIN(CLAIM_FROM_MONTH) as first_month,
            MIN(CAST(LEFT(CAST(CLAIM_FROM_MONTH AS VARCHAR), 4) AS INT)) as first_year
        FROM read_parquet('{PARQUET}')
        GROUP BY 1
        HAVING MIN(CAST(LEFT(CAST(CLAIM_FROM_MONTH AS VARCHAR), 4) AS INT)) >= 2022
    ),
    totals AS (
        SELECT 
            f.npi, f.first_month, f.first_year,
            SUM(d.TOTAL_PAID) as total_paid,
            SUM(d.TOTAL_CLAIMS) as total_claims,
            SUM(d.TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
            COUNT(DISTINCT d.CLAIM_FROM_MONTH) as months_active
        FROM first_seen f
        JOIN read_parquet('{PARQUET}') d ON f.npi = d.BILLING_PROVIDER_NPI_NUM
        GROUP BY f.npi, f.first_month, f.first_year
    )
    SELECT * FROM totals
    WHERE total_paid > 5000000
    ORDER BY total_paid DESC LIMIT 200
""").fetchall()

new_entrant_flags = []
for r in new_entrants:
    npi = str(r[0])
    name, spec, city, state = get_info(npi)
    total_paid = float(r[3])
    months = int(r[6])
    new_entrant_flags.append({
        'npi': npi, 'name': name, 'specialty': spec, 'city': city, 'state': state,
        'firstMonth': str(r[1]), 'firstYear': int(r[2]),
        'totalPaid': round(total_paid, 2),
        'totalClaims': int(r[4]),
        'totalBenes': int(r[5]) if r[5] else 0,
        'monthsActive': months,
        'avgMonthlyBilling': round(total_paid / max(months, 1), 2),
        'flag': 'massive_new_entrant'
    })
print(f"  {len(new_entrant_flags)} massive new entrant flags")

# ============================================
# TEST 4: Rate outliers vs national AND state benchmarks
# For top spending providers: are they billing above p90 for their codes?
# ============================================
print("Test 4: Multi-code rate analysis for top 500 providers...")
top500 = con.execute(f"""
    SELECT BILLING_PROVIDER_NPI_NUM as npi, SUM(TOTAL_PAID) as total
    FROM read_parquet('{PARQUET}')
    GROUP BY 1 ORDER BY 2 DESC LIMIT 500
""").fetchall()

rate_flags = []
for batch_start in range(0, len(top500), 50):
    batch_npis = [str(r[0]) for r in top500[batch_start:batch_start+50]]
    npi_str = ",".join([f"'{n}'" for n in batch_npis])
    
    prov_codes = con.execute(f"""
        SELECT BILLING_PROVIDER_NPI_NUM as npi, HCPCS_CODE as code,
            SUM(TOTAL_PAID) as paid, SUM(TOTAL_CLAIMS) as claims,
            SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as cpc
        FROM read_parquet('{PARQUET}')
        WHERE CAST(BILLING_PROVIDER_NPI_NUM AS VARCHAR) IN ({npi_str})
        GROUP BY 1, 2
        HAVING SUM(TOTAL_CLAIMS) >= 10
    """).fetchall()
    
    # For each provider, count how many of their codes are above p90
    npi_code_analysis = defaultdict(lambda: {'above_p90': 0, 'above_p99': 0, 'total_codes': 0, 'total_paid': 0, 'details': []})
    
    for r in prov_codes:
        npi, code = str(r[0]), r[1]
        paid, claims, cpc = float(r[2]), int(r[3]), float(r[4]) if r[4] else 0
        bench = code_bench.get(code)
        
        npi_code_analysis[npi]['total_codes'] += 1
        npi_code_analysis[npi]['total_paid'] += paid
        
        if bench and bench.get('p90') and cpc > bench['p90']:
            npi_code_analysis[npi]['above_p90'] += 1
            if bench.get('p99') and cpc > bench['p99']:
                npi_code_analysis[npi]['above_p99'] += 1
            npi_code_analysis[npi]['details'].append({
                'code': code, 'paid': round(paid, 2), 'claims': claims,
                'cpc': round(cpc, 2), 'medianCpc': bench['medianCostPerClaim'],
                'p90': bench['p90'], 'ratio': round(cpc / bench['medianCostPerClaim'], 1) if bench['medianCostPerClaim'] else None
            })
    
    for npi, analysis in npi_code_analysis.items():
        if analysis['above_p90'] >= 2 or (analysis['above_p99'] >= 1 and analysis['total_paid'] > 10000000):
            name, spec, city, state = get_info(npi)
            rate_flags.append({
                'npi': npi, 'name': name, 'specialty': spec, 'city': city, 'state': state,
                'totalPaid': round(analysis['total_paid'], 2),
                'totalCodes': analysis['total_codes'],
                'codesAboveP90': analysis['above_p90'],
                'codesAboveP99': analysis['above_p99'],
                'topOutlierCodes': sorted(analysis['details'], key=lambda x: x['paid'], reverse=True)[:5],
                'flag': 'rate_outlier_multi_code'
            })

rate_flags.sort(key=lambda x: x['totalPaid'], reverse=True)
print(f"  {len(rate_flags)} multi-code rate outlier flags")

# ============================================
# COMBINE ALL FLAGS into smart watchlist
# ============================================
all_flags = code_outlier_flags + swing_flags + new_entrant_flags + rate_flags

flag_by_npi = defaultdict(lambda: {'flags': [], 'flag_details': {}, 'total_paid': 0})
for f in all_flags:
    npi = f['npi']
    ft = f['flag']
    if ft not in flag_by_npi[npi]['flags']:
        flag_by_npi[npi]['flags'].append(ft)
    flag_by_npi[npi]['flag_details'][ft] = f
    flag_by_npi[npi]['total_paid'] = max(flag_by_npi[npi]['total_paid'], f.get('totalPaid', 0))

smart_watchlist = []
for npi, data in flag_by_npi.items():
    name, spec, city, state = get_info(npi)
    smart_watchlist.append({
        'npi': npi,
        'name': name, 'specialty': spec, 'city': city, 'state': state,
        'totalPaid': data['total_paid'],
        'flagCount': len(data['flags']),
        'flags': data['flags'],
        'flagDetails': data['flag_details']
    })

smart_watchlist.sort(key=lambda x: (-x['flagCount'], -x['totalPaid']))

with open(os.path.join(OUT, 'smart-watchlist.json'), 'w') as f:
    json.dump(smart_watchlist, f)

# Save per-test results
for name, flags in [('code-outliers', code_outlier_flags), ('billing-swings', swing_flags),
                     ('new-entrants', new_entrant_flags), ('rate-outliers', rate_flags)]:
    with open(os.path.join(OUT, f'fraud-{name}.json'), 'w') as f:
        json.dump(flags, f)

multi = sum(1 for p in smart_watchlist if p['flagCount'] >= 2)
triple = sum(1 for p in smart_watchlist if p['flagCount'] >= 3)
print(f"\n=== SMART WATCHLIST ===")
print(f"Total flagged: {len(smart_watchlist)}")
print(f"2+ flags: {multi}")
print(f"3+ flags: {triple}")
print(f"\nTop 10 most flagged:")
for p in smart_watchlist[:10]:
    print(f"  {p['name']} ({p['state']}): {p['flagCount']} flags, ${p['totalPaid']:,.0f}")
    for fl in p['flags']:
        print(f"    - {fl}")

con.close()
print("\nDone!")
