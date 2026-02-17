#!/usr/bin/env python3
"""Generate state-level stats by joining parquet data with NPI lookups."""
import duckdb
import json
import csv
import os

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
REF = os.path.join(os.path.dirname(__file__), '..', 'reference-data')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'states')
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(OUT_DIR, exist_ok=True)

# Load NPI lookups
npi_info = {}
csv_path = os.path.join(REF, 'npi_lookups_expanded.csv')
with open(csv_path) as f:
    for row in csv.DictReader(f):
        npi_info[row['npi']] = row

print(f"Loaded {len(npi_info)} NPI lookups")

con = duckdb.connect()

# Get per-NPI totals for top 1000
print("Getting top 1000 provider totals...")
top_npis = con.execute(f"""
    SELECT 
        BILLING_PROVIDER_NPI_NUM as npi,
        SUM(TOTAL_PAID) as total_payments,
        SUM(TOTAL_CLAIMS) as total_claims,
        SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
        COUNT(DISTINCT HCPCS_CODE) as proc_count,
        COUNT(DISTINCT LEFT(CAST(CLAIM_FROM_MONTH AS VARCHAR), 4)) as active_years,
        MIN(CLAIM_FROM_MONTH) as first_month,
        MAX(CLAIM_FROM_MONTH) as last_month
    FROM read_parquet('{PARQUET}')
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT 1000
""").fetchall()

# Build state aggregation from NPI lookups
state_totals = {}
providers_by_state = {}

for row in top_npis:
    npi = str(row[0])
    info = npi_info.get(npi, {})
    state = info.get('state', 'UNKNOWN')
    if not state:
        state = 'UNKNOWN'
    
    prov = {
        'npi': npi,
        'name': info.get('provider_name', ''),
        'specialty': info.get('taxonomy_description', ''),
        'city': info.get('city', ''),
        'state': state,
        'total_payments': round(float(row[1]), 2),
        'total_claims': int(row[2]),
        'total_benes': int(row[3]) if row[3] else 0,
        'proc_count': int(row[4]),
        'active_years': int(row[5]),
        'first_month': str(row[6]),
        'last_month': str(row[7]),
        'cost_per_claim': round(float(row[1]) / max(int(row[2]), 1), 2),
        'cost_per_bene': round(float(row[1]) / max(int(row[3]) if row[3] else 1, 1), 2),
        'claims_per_bene': round(int(row[2]) / max(int(row[3]) if row[3] else 1, 1), 1)
    }
    
    if state not in state_totals:
        state_totals[state] = {'total_payments': 0, 'total_claims': 0, 'total_benes': 0, 'provider_count': 0}
    state_totals[state]['total_payments'] += prov['total_payments']
    state_totals[state]['total_claims'] += prov['total_claims']
    state_totals[state]['total_benes'] += prov['total_benes']
    state_totals[state]['provider_count'] += 1
    
    if state not in providers_by_state:
        providers_by_state[state] = []
    providers_by_state[state].append(prov)

# Now get FULL state-level stats from parquet (no NPI join needed for this)
print("Getting full state-level yearly trends...")
# We can't get state from parquet directly, but we CAN get overall yearly trends
yearly_overall = con.execute(f"""
    SELECT 
        LEFT(CAST(CLAIM_FROM_MONTH AS VARCHAR), 4) as year,
        SUM(TOTAL_PAID) as payments,
        SUM(TOTAL_CLAIMS) as claims,
        COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM) as providers
    FROM read_parquet('{PARQUET}')
    GROUP BY 1 ORDER BY 1
""").fetchall()

# Get top procedures per state using NPI mapping
# For each state, get the NPIs in that state and query their procedures
print("Getting per-state procedure breakdowns...")
for state, provs in providers_by_state.items():
    if state == 'UNKNOWN' or len(provs) == 0:
        continue
    
    npi_list = [p['npi'] for p in provs[:50]]  # top 50 by spending
    npi_str = ",".join([f"'{n}'" for n in npi_list])
    
    procs = con.execute(f"""
        SELECT 
            HCPCS_CODE as code,
            SUM(TOTAL_PAID) as payments,
            SUM(TOTAL_CLAIMS) as claims,
            COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM) as prov_count
        FROM read_parquet('{PARQUET}')
        WHERE CAST(BILLING_PROVIDER_NPI_NUM AS VARCHAR) IN ({npi_str})
        GROUP BY 1
        ORDER BY 2 DESC
        LIMIT 20
    """).fetchall()
    
    top_procs = [{'code': r[0], 'payments': round(float(r[1]),2), 
                  'claims': int(r[2]), 'provider_count': int(r[3])} for r in procs]
    
    # Yearly trends for this state's providers
    yearly = con.execute(f"""
        SELECT 
            LEFT(CAST(CLAIM_FROM_MONTH AS VARCHAR), 4) as year,
            SUM(TOTAL_PAID) as payments,
            SUM(TOTAL_CLAIMS) as claims
        FROM read_parquet('{PARQUET}')
        WHERE CAST(BILLING_PROVIDER_NPI_NUM AS VARCHAR) IN ({npi_str})
        GROUP BY 1 ORDER BY 1
    """).fetchall()
    
    yearly_trends = [{'year': r[0], 'payments': round(float(r[1]),2), 'claims': int(r[2])} for r in yearly]
    
    state_detail = {
        'state': state,
        'summary': {
            'total_payments': round(state_totals[state]['total_payments'], 2),
            'total_claims': state_totals[state]['total_claims'],
            'total_benes': state_totals[state]['total_benes'],
            'provider_count': state_totals[state]['provider_count']
        },
        'top_providers': sorted(provs, key=lambda x: x['total_payments'], reverse=True)[:50],
        'top_procedures': top_procs,
        'yearly_trends': yearly_trends
    }
    
    with open(os.path.join(OUT_DIR, f'{state}.json'), 'w') as f:
        json.dump(state_detail, f)
    print(f"  {state}: {len(provs)} providers, ${state_totals[state]['total_payments']:,.0f}")

# State summary list
state_list = []
for state, totals in sorted(state_totals.items(), key=lambda x: x[1]['total_payments'], reverse=True):
    if state == 'UNKNOWN':
        continue
    state_list.append({
        'state': state,
        **{k: round(v, 2) if isinstance(v, float) else v for k, v in totals.items()}
    })

with open(os.path.join(OUT, 'states-summary.json'), 'w') as f:
    json.dump(state_list, f)

# Overall yearly trends
with open(os.path.join(OUT, 'yearly-trends.json'), 'w') as f:
    json.dump([{'year': r[0], 'payments': round(float(r[1]),2), 
                'claims': int(r[2]), 'providers': int(r[3])} for r in yearly_overall], f)

print(f"\nDone! {len(state_list)} states, {len(top_npis)} providers")
con.close()
