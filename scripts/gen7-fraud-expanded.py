#!/usr/bin/env python3
"""Expanded fraud analysis with 5 new tests using correct column names."""
import duckdb
import json
import os
from collections import defaultdict

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
con = duckdb.connect()

# Columns: BILLING_PROVIDER_NPI_NUM, SERVICING_PROVIDER_NPI_NUM, HCPCS_CODE,
#           CLAIM_FROM_MONTH (YYYY-MM format?), TOTAL_UNIQUE_BENEFICIARIES, TOTAL_CLAIMS, TOTAL_PAID

# Check CLAIM_FROM_MONTH format
sample = con.execute(f"SELECT DISTINCT CLAIM_FROM_MONTH FROM read_parquet('{PARQUET}') LIMIT 10").fetchall()
print(f"Sample CLAIM_FROM_MONTH: {[s[0] for s in sample]}")

# Test 1: Explosive growth (>500% YoY)
print("\n1. Explosive growth test...")
growth = con.execute(f"""
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
            a.npi, a.year as from_year, b.year as to_year,
            a.payments as from_pay, b.payments as to_pay,
            ((b.payments - a.payments) / NULLIF(a.payments, 0)) * 100 as growth_pct
        FROM yearly a JOIN yearly b ON a.npi = b.npi AND b.year = a.year + 1
        WHERE a.payments > 10000
    )
    SELECT * FROM yoy WHERE growth_pct > 500
    ORDER BY to_pay DESC LIMIT 200
""").fetchall()
growth_flags = [{'npi': str(r[0]), 'from_year': r[1], 'to_year': r[2],
                 'from_payments': round(float(r[3]),2), 'to_payments': round(float(r[4]),2),
                 'growth_pct': round(float(r[5]),1), 'flag': 'explosive_growth'} for r in growth]
print(f"  {len(growth_flags)} flags")

# Test 2: Instant high volume (new providers since 2021 billing >$1M first year)
print("\n2. Instant high volume test...")
instant = con.execute(f"""
    WITH provider_first AS (
        SELECT 
            BILLING_PROVIDER_NPI_NUM as npi,
            MIN(CAST(LEFT(CAST(CLAIM_FROM_MONTH AS VARCHAR), 4) AS INT)) as first_year
        FROM read_parquet('{PARQUET}')
        GROUP BY 1
        HAVING MIN(CAST(LEFT(CAST(CLAIM_FROM_MONTH AS VARCHAR), 4) AS INT)) >= 2021
    ),
    first_yr_totals AS (
        SELECT 
            p.npi, p.first_year,
            SUM(d.TOTAL_PAID) as first_yr_payments,
            SUM(d.TOTAL_CLAIMS) as first_yr_claims
        FROM provider_first p
        JOIN read_parquet('{PARQUET}') d 
            ON p.npi = d.BILLING_PROVIDER_NPI_NUM 
            AND CAST(LEFT(CAST(d.CLAIM_FROM_MONTH AS VARCHAR), 4) AS INT) = p.first_year
        GROUP BY p.npi, p.first_year
    )
    SELECT * FROM first_yr_totals
    WHERE first_yr_payments > 1000000
    ORDER BY first_yr_payments DESC LIMIT 200
""").fetchall()
instant_flags = [{'npi': str(r[0]), 'first_year': r[1],
                  'first_year_payments': round(float(r[2]),2), 'first_year_claims': int(r[3]),
                  'flag': 'instant_high_volume'} for r in instant]
print(f"  {len(instant_flags)} flags")

# Test 3: Procedure concentration (only 1-2 codes, >$5M)
print("\n3. Procedure concentration test...")
conc = con.execute(f"""
    SELECT 
        BILLING_PROVIDER_NPI_NUM as npi,
        COUNT(DISTINCT HCPCS_CODE) as unique_codes,
        SUM(TOTAL_PAID) as total_payments,
        SUM(TOTAL_CLAIMS) as total_claims,
        MAX(HCPCS_CODE) as primary_code
    FROM read_parquet('{PARQUET}')
    GROUP BY 1
    HAVING COUNT(DISTINCT HCPCS_CODE) <= 2 AND SUM(TOTAL_PAID) > 5000000
    ORDER BY total_payments DESC LIMIT 200
""").fetchall()
conc_flags = [{'npi': str(r[0]), 'unique_codes': int(r[1]),
               'total_payments': round(float(r[2]),2), 'total_claims': int(r[3]),
               'primary_code': r[4], 'flag': 'procedure_concentration'} for r in conc]
print(f"  {len(conc_flags)} flags")

# Test 4: Billing consistency (very low coefficient of variation across months)
print("\n4. Billing consistency test...")
consistency = con.execute(f"""
    WITH monthly AS (
        SELECT 
            BILLING_PROVIDER_NPI_NUM as npi,
            CLAIM_FROM_MONTH as month,
            SUM(TOTAL_PAID) as payments
        FROM read_parquet('{PARQUET}')
        GROUP BY 1, 2
    )
    SELECT 
        npi,
        AVG(payments) as avg_monthly,
        STDDEV(payments) as std_monthly,
        STDDEV(payments) / NULLIF(AVG(payments), 0) as cv,
        COUNT(*) as months_active,
        SUM(payments) as total_payments
    FROM monthly
    GROUP BY npi
    HAVING COUNT(*) >= 12 AND AVG(payments) > 100000 
        AND STDDEV(payments) / NULLIF(AVG(payments), 0) < 0.1
    ORDER BY total_payments DESC LIMIT 200
""").fetchall()
cons_flags = [{'npi': str(r[0]), 'avg_monthly': round(float(r[1]),2),
               'cv': round(float(r[3]),4) if r[3] else None,
               'months_active': int(r[4]), 'total_payments': round(float(r[5]),2),
               'flag': 'billing_consistency'} for r in consistency]
print(f"  {len(cons_flags)} flags")

# Test 5: Beneficiary stuffing extreme (>100 claims per beneficiary)
print("\n5. Extreme beneficiary stuffing test...")
stuffing = con.execute(f"""
    SELECT 
        BILLING_PROVIDER_NPI_NUM as npi,
        SUM(TOTAL_CLAIMS) as total_claims,
        SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
        SUM(TOTAL_PAID) as total_payments,
        SUM(TOTAL_CLAIMS) / NULLIF(SUM(TOTAL_UNIQUE_BENEFICIARIES), 0) as claims_per_bene
    FROM read_parquet('{PARQUET}')
    GROUP BY 1
    HAVING SUM(TOTAL_UNIQUE_BENEFICIARIES) > 0 
        AND SUM(TOTAL_CLAIMS) / NULLIF(SUM(TOTAL_UNIQUE_BENEFICIARIES), 0) > 100
        AND SUM(TOTAL_PAID) > 1000000
    ORDER BY claims_per_bene DESC LIMIT 200
""").fetchall()
stuff_flags = [{'npi': str(r[0]), 'total_claims': int(r[1]),
                'total_benes': int(r[2]), 'total_payments': round(float(r[3]),2),
                'claims_per_bene': round(float(r[4]),1),
                'flag': 'extreme_beneficiary_stuffing'} for r in stuffing]
print(f"  {len(stuff_flags)} flags")

# Aggregate all flags by NPI
all_flags = growth_flags + instant_flags + conc_flags + cons_flags + stuff_flags
flag_counts = defaultdict(lambda: {'flags': [], 'details': {}})
for f in all_flags:
    npi = f['npi']
    ft = f['flag']
    if ft not in flag_counts[npi]['flags']:
        flag_counts[npi]['flags'].append(ft)
    flag_counts[npi]['details'][ft] = f

expanded_watchlist = []
for npi, data in flag_counts.items():
    expanded_watchlist.append({
        'npi': npi,
        'flag_count': len(data['flags']),
        'flags': data['flags'],
        'flag_details': data['details']
    })
expanded_watchlist.sort(key=lambda x: x['flag_count'], reverse=True)

with open(os.path.join(OUT, 'expanded-watchlist.json'), 'w') as f:
    json.dump(expanded_watchlist, f)

# Save per-test files
for name, flags in [('explosive-growth', growth_flags), ('instant-volume', instant_flags),
                     ('procedure-concentration', conc_flags), ('billing-consistency', cons_flags),
                     ('beneficiary-stuffing-extreme', stuff_flags)]:
    with open(os.path.join(OUT, f'fraud-{name}.json'), 'w') as f:
        json.dump(flags, f)

multi = sum(1 for p in expanded_watchlist if p['flag_count'] >= 2)
print(f"\n=== RESULTS ===")
print(f"Total flagged providers: {len(expanded_watchlist)}")
print(f"Multi-flag (2+): {multi}")
print(f"Triple-flag (3+): {sum(1 for p in expanded_watchlist if p['flag_count'] >= 3)}")
print("Done!")
con.close()
