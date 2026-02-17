#!/usr/bin/env python3
"""Generate expanded provider data: top 1000 with computed fields."""
import duckdb
import json
import os

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')

con = duckdb.connect()

# Top 1000 providers with computed fields
print("Generating top 1000 providers with computed fields...")
providers = con.execute(f"""
    WITH provider_totals AS (
        SELECT 
            NPI as npi,
            Prv_Name_Org as name,
            Prv_Spec_Desc as specialty,
            Prv_State_USPS as state,
            Prv_City as city,
            SUM(Tot_Svc_Pymnt) as total_payments,
            SUM(Tot_Svc_Cnt) as total_claims,
            SUM(Tot_Bene_Cnt) as total_beneficiaries,
            SUM(Tot_Svc_Pymnt) / NULLIF(SUM(Tot_Svc_Cnt), 0) as cost_per_claim,
            SUM(Tot_Svc_Pymnt) / NULLIF(SUM(Tot_Bene_Cnt), 0) as cost_per_beneficiary,
            SUM(Tot_Svc_Cnt) / NULLIF(SUM(Tot_Bene_Cnt), 0) as claims_per_beneficiary,
            COUNT(DISTINCT HCPCS_Cd) as unique_procedures,
            COUNT(DISTINCT Svc_Yr) as active_years,
            MIN(Svc_Yr) as first_year,
            MAX(Svc_Yr) as last_year
        FROM read_parquet('{PARQUET}')
        GROUP BY NPI, Prv_Name_Org, Prv_Spec_Desc, Prv_State_USPS, Prv_City
        ORDER BY total_payments DESC
        LIMIT 1000
    )
    SELECT * FROM provider_totals
""").fetchall()

columns = ['npi', 'name', 'specialty', 'state', 'city', 'total_payments',
           'total_claims', 'total_beneficiaries', 'cost_per_claim',
           'cost_per_beneficiary', 'claims_per_beneficiary', 'unique_procedures',
           'active_years', 'first_year', 'last_year']

prov_list = []
npi_list = []
for row in providers:
    d = {}
    for i, col in enumerate(columns):
        v = row[i]
        if isinstance(v, str):
            d[col] = v
        elif isinstance(v, int):
            d[col] = v
        elif v is not None:
            d[col] = round(float(v), 2)
        else:
            d[col] = None
    prov_list.append(d)
    npi_list.append(str(d['npi']))

# Save top 1000 list
with open(os.path.join(OUT, 'top-providers-1000.json'), 'w') as f:
    json.dump(prov_list, f)
print(f"  Saved {len(prov_list)} providers to top-providers-1000.json")

# Generate detail JSON for each of the top 1000
print("Generating individual provider detail files...")
detail_dir = os.path.join(OUT, 'providers')
os.makedirs(detail_dir, exist_ok=True)

# Process in batches of 50
for batch_start in range(0, len(npi_list), 50):
    batch = npi_list[batch_start:batch_start+50]
    npi_str = ",".join([f"'{n}'" for n in batch])
    print(f"  Batch {batch_start//50 + 1}/{(len(npi_list)+49)//50}...")
    
    # Yearly trends for batch
    yearly_data = con.execute(f"""
        SELECT 
            NPI as npi,
            Svc_Yr as year,
            SUM(Tot_Svc_Pymnt) as payments,
            SUM(Tot_Svc_Cnt) as claims,
            SUM(Tot_Bene_Cnt) as beneficiaries
        FROM read_parquet('{PARQUET}')
        WHERE CAST(NPI AS VARCHAR) IN ({npi_str})
        GROUP BY NPI, Svc_Yr
        ORDER BY NPI, Svc_Yr
    """).fetchall()
    
    # Procedure breakdown for batch
    proc_data = con.execute(f"""
        SELECT 
            NPI as npi,
            HCPCS_Cd as code,
            HCPCS_Desc as description,
            SUM(Tot_Svc_Pymnt) as payments,
            SUM(Tot_Svc_Cnt) as claims
        FROM read_parquet('{PARQUET}')
        WHERE CAST(NPI AS VARCHAR) IN ({npi_str})
        GROUP BY NPI, HCPCS_Cd, HCPCS_Desc
        ORDER BY NPI, payments DESC
    """).fetchall()
    
    # Organize by NPI
    yearly_by_npi = {}
    for row in yearly_data:
        npi = str(row[0])
        if npi not in yearly_by_npi:
            yearly_by_npi[npi] = []
        yearly_by_npi[npi].append({
            'year': int(row[1]) if row[1] else None,
            'payments': round(float(row[2]), 2) if row[2] else 0,
            'claims': int(row[3]) if row[3] else 0,
            'beneficiaries': int(row[4]) if row[4] else 0
        })
    
    proc_by_npi = {}
    for row in proc_data:
        npi = str(row[0])
        if npi not in proc_by_npi:
            proc_by_npi[npi] = []
        proc_by_npi[npi].append({
            'code': row[1],
            'description': row[2],
            'payments': round(float(row[3]), 2) if row[3] else 0,
            'claims': int(row[4]) if row[4] else 0
        })
    
    # Write individual files
    for npi in batch:
        # Find provider summary
        prov_summary = next((p for p in prov_list if str(p['npi']) == npi), None)
        if not prov_summary:
            continue
        
        # Compute growth rate
        years = yearly_by_npi.get(npi, [])
        growth_rate = None
        if len(years) >= 2:
            first_pay = years[0]['payments']
            last_pay = years[-1]['payments']
            if first_pay and first_pay > 0:
                growth_rate = round(((last_pay - first_pay) / first_pay) * 100, 1)
        
        detail = {
            **prov_summary,
            'growth_rate': growth_rate,
            'yearly_trends': years,
            'procedures': proc_by_npi.get(npi, [])[:20]  # top 20 procedures
        }
        
        with open(os.path.join(detail_dir, f'{npi}.json'), 'w') as f:
            json.dump(detail, f)

print("Done with expanded providers!")
con.close()
