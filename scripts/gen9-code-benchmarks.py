#!/usr/bin/env python3
"""Generate per-code benchmarks: national avg, median, deciles, state averages."""
import duckdb
import json
import os

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')

con = duckdb.connect()

# 1. National benchmarks per HCPCS code
print("Generating national code benchmarks...")
benchmarks = con.execute(f"""
    WITH provider_code AS (
        SELECT 
            HCPCS_CODE as code,
            BILLING_PROVIDER_NPI_NUM as npi,
            SUM(TOTAL_PAID) as total_paid,
            SUM(TOTAL_CLAIMS) as total_claims,
            SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as cost_per_claim
        FROM read_parquet('{PARQUET}')
        GROUP BY 1, 2
    )
    SELECT 
        code,
        COUNT(DISTINCT npi) as provider_count,
        SUM(total_paid) as total_spending,
        SUM(total_claims) as total_claims,
        AVG(cost_per_claim) as avg_cost_per_claim,
        MEDIAN(cost_per_claim) as median_cost_per_claim,
        PERCENTILE_CONT(0.10) WITHIN GROUP (ORDER BY cost_per_claim) as p10,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY cost_per_claim) as p25,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY cost_per_claim) as p75,
        PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY cost_per_claim) as p90,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY cost_per_claim) as p95,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY cost_per_claim) as p99,
        MIN(cost_per_claim) as min_cpc,
        MAX(cost_per_claim) as max_cpc,
        STDDEV(cost_per_claim) as stddev_cpc
    FROM provider_code
    WHERE cost_per_claim IS NOT NULL AND cost_per_claim > 0
    GROUP BY code
""").fetchall()

code_benchmarks = {}
for r in benchmarks:
    code_benchmarks[r[0]] = {
        'code': r[0],
        'providerCount': int(r[1]),
        'totalSpending': round(float(r[2]), 2),
        'totalClaims': int(r[3]),
        'avgCostPerClaim': round(float(r[4]), 2) if r[4] else None,
        'medianCostPerClaim': round(float(r[5]), 2) if r[5] else None,
        'p10': round(float(r[6]), 2) if r[6] else None,
        'p25': round(float(r[7]), 2) if r[7] else None,
        'p75': round(float(r[8]), 2) if r[8] else None,
        'p90': round(float(r[9]), 2) if r[9] else None,
        'p95': round(float(r[10]), 2) if r[10] else None,
        'p99': round(float(r[11]), 2) if r[11] else None,
        'minCpc': round(float(r[12]), 2) if r[12] else None,
        'maxCpc': round(float(r[13]), 2) if r[13] else None,
        'stddevCpc': round(float(r[14]), 2) if r[14] else None
    }

with open(os.path.join(OUT, 'code-benchmarks.json'), 'w') as f:
    json.dump(code_benchmarks, f)
print(f"  {len(code_benchmarks)} code benchmarks generated")

# 2. State-level benchmarks per code (top 200 codes only to keep size reasonable)
print("Generating state-level code benchmarks...")
top_codes = sorted(code_benchmarks.values(), key=lambda x: x['totalSpending'], reverse=True)[:200]
top_code_list = [c['code'] for c in top_codes]
code_str = ",".join([f"'{c}'" for c in top_code_list])

state_benchmarks = con.execute(f"""
    WITH provider_code_state AS (
        SELECT 
            HCPCS_CODE as code,
            BILLING_PROVIDER_NPI_NUM as npi,
            SUM(TOTAL_PAID) as total_paid,
            SUM(TOTAL_CLAIMS) as total_claims,
            SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as cost_per_claim
        FROM read_parquet('{PARQUET}')
        WHERE HCPCS_CODE IN ({code_str})
        GROUP BY 1, 2
    )
    SELECT 
        p.code,
        n.state,
        COUNT(DISTINCT p.npi) as providers,
        AVG(p.cost_per_claim) as avg_cpc,
        MEDIAN(p.cost_per_claim) as median_cpc
    FROM provider_code_state p
    LEFT JOIN (
        SELECT npi, state FROM read_csv_auto('{os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/npi_lookups_expanded.csv")}')
    ) n ON CAST(p.npi AS VARCHAR) = n.npi
    WHERE p.cost_per_claim IS NOT NULL AND p.cost_per_claim > 0 AND n.state IS NOT NULL AND n.state != ''
    GROUP BY p.code, n.state
    HAVING COUNT(DISTINCT p.npi) >= 3
""").fetchall()

state_code_benchmarks = {}
for r in state_benchmarks:
    code = r[0]
    state = r[1]
    if code not in state_code_benchmarks:
        state_code_benchmarks[code] = {}
    state_code_benchmarks[code][state] = {
        'providers': int(r[2]),
        'avgCpc': round(float(r[3]), 2) if r[3] else None,
        'medianCpc': round(float(r[4]), 2) if r[4] else None
    }

with open(os.path.join(OUT, 'state-code-benchmarks.json'), 'w') as f:
    json.dump(state_code_benchmarks, f)
print(f"  State benchmarks for {len(state_code_benchmarks)} codes")

print("Done!")
con.close()
