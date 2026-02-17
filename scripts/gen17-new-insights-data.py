#!/usr/bin/env python3
"""Generate data for new insight articles and features."""
import duckdb
import json
import os
import csv

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")
REF = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/npi_lookups_expanded.csv")

# Load NPI lookups
npi_names = {}
if os.path.exists(REF):
    with open(REF) as f:
        for row in csv.DictReader(f):
            npi_names[row.get('npi','')] = {
                'name': row.get('name',''),
                'city': row.get('city',''),
                'state': row.get('state',''),
                'specialty': row.get('specialty','')
            }

con = duckdb.connect()

# 1. Arizona new entrants analysis
print("1. Arizona new entrants...")
az_new = con.execute(f"""
    WITH provider_months AS (
        SELECT BILLING_PROVIDER_NPI_NUM as npi,
               MIN(CLAIM_FROM_MONTH) as first_month,
               MAX(CLAIM_FROM_MONTH) as last_month,
               SUM(TOTAL_PAID) as total_paid,
               SUM(TOTAL_CLAIMS) as total_claims,
               SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
               COUNT(DISTINCT CLAIM_FROM_MONTH) as months_active,
               COUNT(DISTINCT HCPCS_CODE) as code_count
        FROM read_parquet('{PARQUET}')
        WHERE BILLING_PROVIDER_NPI_NUM IN (
            SELECT DISTINCT BILLING_PROVIDER_NPI_NUM 
            FROM read_parquet('{PARQUET}')
            GROUP BY BILLING_PROVIDER_NPI_NUM
            HAVING MIN(CLAIM_FROM_MONTH) >= '2022-01'
        )
        GROUP BY BILLING_PROVIDER_NPI_NUM
        HAVING SUM(TOTAL_PAID) > 1000000
    )
    SELECT npi, first_month, last_month, total_paid, total_claims, total_benes, months_active, code_count
    FROM provider_months
    ORDER BY total_paid DESC
    LIMIT 500
""").fetchall()

az_entries = []
for row in az_new:
    npi = str(row[0])
    info = npi_names.get(npi, {})
    state = info.get('state', '')
    az_entries.append({
        'npi': npi,
        'name': info.get('name', ''),
        'city': info.get('city', ''),
        'state': state,
        'specialty': info.get('specialty', ''),
        'firstMonth': row[1],
        'lastMonth': row[2],
        'totalPaid': float(row[3]),
        'totalClaims': int(row[4]),
        'totalBenes': int(row[5]),
        'monthsActive': int(row[6]),
        'codeCount': int(row[7])
    })

# Filter AZ specifically
az_only = [e for e in az_entries if e['state'] == 'AZ']
print(f"  AZ new entrants >$1M: {len(az_only)}")

with open(f"{OUT}/az-new-entrants.json", 'w') as f:
    json.dump(az_only[:100], f)

# 2. NY Home Care analysis
print("2. NY Home Care providers...")
ny_home = con.execute(f"""
    SELECT BILLING_PROVIDER_NPI_NUM as npi,
           SUM(TOTAL_PAID) as total_paid,
           SUM(TOTAL_CLAIMS) as total_claims,
           SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
           COUNT(DISTINCT CLAIM_FROM_MONTH) as months_active
    FROM read_parquet('{PARQUET}')
    WHERE HCPCS_CODE = 'T1019'
    GROUP BY BILLING_PROVIDER_NPI_NUM
    HAVING SUM(TOTAL_PAID) > 10000000
    ORDER BY total_paid DESC
    LIMIT 100
""").fetchall()

ny_home_entries = []
for row in ny_home:
    npi = str(row[0])
    info = npi_names.get(npi, {})
    ny_home_entries.append({
        'npi': npi,
        'name': info.get('name', ''),
        'city': info.get('city', ''),
        'state': info.get('state', ''),
        'specialty': info.get('specialty', ''),
        'totalPaid': float(row[1]),
        'totalClaims': int(row[2]),
        'totalBenes': int(row[3]),
        'monthsActive': int(row[4])
    })

ny_only = [e for e in ny_home_entries if e['state'] == 'NY']
print(f"  NY home care providers >$10M: {len(ny_only)}")

with open(f"{OUT}/ny-home-care.json", 'w') as f:
    json.dump(ny_home_entries[:100], f)

# 3. Top beneficiary counts
print("3. Top beneficiary counts...")
top_benes = con.execute(f"""
    SELECT BILLING_PROVIDER_NPI_NUM as npi,
           SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
           SUM(TOTAL_PAID) as total_paid,
           SUM(TOTAL_CLAIMS) as total_claims,
           COUNT(DISTINCT HCPCS_CODE) as code_count,
           SUM(TOTAL_CLAIMS)*1.0/NULLIF(SUM(TOTAL_UNIQUE_BENEFICIARIES),0) as claims_per_bene
    FROM read_parquet('{PARQUET}')
    GROUP BY BILLING_PROVIDER_NPI_NUM
    HAVING SUM(TOTAL_UNIQUE_BENEFICIARIES) > 0
    ORDER BY total_benes DESC
    LIMIT 100
""").fetchall()

bene_entries = []
for row in top_benes:
    npi = str(row[0])
    info = npi_names.get(npi, {})
    bene_entries.append({
        'npi': npi,
        'name': info.get('name', ''),
        'city': info.get('city', ''),
        'state': info.get('state', ''),
        'specialty': info.get('specialty', ''),
        'totalBenes': int(row[1]),
        'totalPaid': float(row[2]),
        'totalClaims': int(row[3]),
        'codeCount': int(row[4]),
        'claimsPerBene': round(float(row[5]), 1) if row[5] else 0
    })

print(f"  Top beneficiary provider: {bene_entries[0]['name']} ({bene_entries[0]['totalBenes']:,} benes)")

with open(f"{OUT}/top-beneficiary-counts.json", 'w') as f:
    json.dump(bene_entries, f)

# 4. Specialty pharma deep dive (J-codes)
print("4. Specialty pharma J-codes...")
jcodes = con.execute(f"""
    SELECT HCPCS_CODE as code,
           SUM(TOTAL_PAID) as total_paid,
           SUM(TOTAL_CLAIMS) as total_claims,
           SUM(TOTAL_PAID)/NULLIF(SUM(TOTAL_CLAIMS),0) as cost_per_claim,
           COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM) as provider_count,
           SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes
    FROM read_parquet('{PARQUET}')
    WHERE HCPCS_CODE LIKE 'J%'
    GROUP BY HCPCS_CODE
    HAVING SUM(TOTAL_PAID)/NULLIF(SUM(TOTAL_CLAIMS),0) > 1000
    ORDER BY cost_per_claim DESC
    LIMIT 50
""").fetchall()

jcode_entries = []
for row in jcodes:
    jcode_entries.append({
        'code': row[0],
        'totalPaid': float(row[1]),
        'totalClaims': int(row[2]),
        'costPerClaim': round(float(row[3]), 2),
        'providerCount': int(row[4]),
        'totalBenes': int(row[5])
    })

print(f"  J-codes >$1K/claim: {len(jcode_entries)}")

with open(f"{OUT}/specialty-pharma.json", 'w') as f:
    json.dump(jcode_entries, f)

# 5. State-level flagged provider counts (for heat map)
print("5. State flagged provider counts...")
# Load watchlist data
watchlist_path = f"{OUT}/smart-watchlist.json"
expanded_path = f"{OUT}/expanded-watchlist.json"
ml_path = f"{OUT}/ml-scores.json"

state_flags = {}
if os.path.exists(watchlist_path):
    with open(watchlist_path) as f:
        for p in json.load(f):
            st = p.get('state', 'Unknown')
            if st not in state_flags:
                state_flags[st] = {'stat': 0, 'ml': 0, 'total_paid': 0}
            state_flags[st]['stat'] += 1
            state_flags[st]['total_paid'] += p.get('totalPaid', 0)

if os.path.exists(expanded_path):
    with open(expanded_path) as f:
        for p in json.load(f):
            st = p.get('state', 'Unknown')
            npi = p.get('npi', '')
            if st not in state_flags:
                state_flags[st] = {'stat': 0, 'ml': 0, 'total_paid': 0}
            # Don't double count

if os.path.exists(ml_path):
    with open(ml_path) as f:
        ml = json.load(f)
        for p in ml.get('topProviders', []):
            if p.get('mlScore', 0) >= 0.5:
                info = npi_names.get(str(p['npi']), {})
                st = info.get('state', 'Unknown')
                if st not in state_flags:
                    state_flags[st] = {'stat': 0, 'ml': 0, 'total_paid': 0}
                state_flags[st]['ml'] += 1

state_flag_list = [{'state': k, **v, 'total': v['stat'] + v['ml']} for k, v in state_flags.items() if k and k != 'Unknown']
state_flag_list.sort(key=lambda x: x['total'], reverse=True)

with open(f"{OUT}/state-flag-counts.json", 'w') as f:
    json.dump(state_flag_list, f)

print(f"  States with flags: {len(state_flag_list)}")
print(f"  Top: {state_flag_list[0]['state']} ({state_flag_list[0]['total']} flags)")

# 6. Provider timeline data (first billing month for all flagged providers)
print("6. Provider timeline data...")
# Already have monthly data in provider files, just need a summary
flagged_npis = set()
if os.path.exists(watchlist_path):
    with open(watchlist_path) as f:
        for p in json.load(f):
            flagged_npis.add(p.get('npi',''))

timeline_data = []
providers_dir = f"{OUT}/providers"
for npi in list(flagged_npis)[:200]:  # Top 200 for timeline
    pfile = f"{providers_dir}/{npi}.json"
    if os.path.exists(pfile):
        try:
            with open(pfile) as f:
                pdata = json.load(f)
            monthly = pdata.get('monthly', [])
            if monthly:
                timeline_data.append({
                    'npi': npi,
                    'name': pdata.get('name', ''),
                    'state': pdata.get('state', ''),
                    'firstMonth': monthly[0]['month'],
                    'lastMonth': monthly[-1]['month'],
                    'totalPaid': pdata.get('totalPaid', 0),
                    'flagCount': pdata.get('flagCount', 0),
                    'peakMonth': max(monthly, key=lambda m: m['payments'])['month'],
                    'peakAmount': max(monthly, key=lambda m: m['payments'])['payments']
                })
        except:
            pass

timeline_data.sort(key=lambda x: x.get('totalPaid', 0), reverse=True)
with open(f"{OUT}/provider-timelines.json", 'w') as f:
    json.dump(timeline_data[:100], f)

print(f"  Timeline entries: {len(timeline_data)}")

# 7. Spending by specialty (for charts)
print("7. Spending by specialty...")
# Load from existing provider data
specialty_totals = {}
stats_path = f"{OUT}/stats.json"
if os.path.exists(stats_path):
    with open(stats_path) as f:
        stats = json.load(f)

# Get from top providers
top_providers_path = f"{OUT}/top-providers.json"
if os.path.exists(top_providers_path):
    with open(top_providers_path) as f:
        for p in json.load(f):
            spec = p.get('specialty', 'Unknown')
            if spec not in specialty_totals:
                specialty_totals[spec] = {'count': 0, 'totalPaid': 0}
            specialty_totals[spec]['count'] += 1
            specialty_totals[spec]['totalPaid'] += p.get('totalPaid', 0)

spec_list = [{'specialty': k, **v} for k, v in specialty_totals.items()]
spec_list.sort(key=lambda x: x['totalPaid'], reverse=True)

with open(f"{OUT}/specialty-spending.json", 'w') as f:
    json.dump(spec_list[:30], f)

print(f"  Specialties: {len(spec_list)}")

print("\nDone! All new data files generated.")
