#!/usr/bin/env python3
"""Generate provider detail pages for ML v2 flagged providers that don't have pages yet."""
import json, os, csv, sys
sys.path.insert(0, os.path.dirname(__file__))

PROJ = os.path.expanduser("~/Projects/medicaid-tracker-app")
PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
PROVIDERS_DIR = os.path.join(PROJ, "public/data/providers")
NPI_CSV = os.path.join(PROJ, "reference-data/npi_lookups_expanded.csv")
MISSING_FILE = "/tmp/ml_missing_npis.txt"

# Load missing NPIs
with open(MISSING_FILE) as f:
    missing_npis = [line.strip() for line in f if line.strip()]
print(f"Need to generate {len(missing_npis)} provider pages")

# Load existing NPI lookups
npi_info = {}
with open(NPI_CSV) as f:
    for row in csv.DictReader(f):
        npi_info[row['npi']] = row

# Query parquet for these NPIs
import duckdb
con = duckdb.connect()

# Process in batches of 50 to avoid memory issues
BATCH = 50
generated = 0

for i in range(0, len(missing_npis), BATCH):
    batch = missing_npis[i:i+BATCH]
    npi_list = ",".join(f"'{n}'" for n in batch)
    
    query = f"""
    SELECT 
        BILLING_PROVIDER_NPI_NUM as npi,
        HCPCS_CODE as code,
        LEFT(CLAIM_FROM_MONTH, 4) as year,
        SUM(TOTAL_PAID) as total_paid,
        SUM(TOTAL_CLAIMS) as total_claims,
        SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes
    FROM read_parquet('{PARQUET}')
    WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
    GROUP BY 1, 2, 3
    """
    rows = con.execute(query).fetchall()
    
    # Organize by NPI
    npi_data = {}
    for npi, code, year, paid, claims, benes in rows:
        if npi not in npi_data:
            npi_data[npi] = {'codes': {}, 'years': {}}
        
        # By code
        if code not in npi_data[npi]['codes']:
            npi_data[npi]['codes'][code] = {'totalPaid': 0, 'totalClaims': 0, 'totalBeneficiaries': 0}
        npi_data[npi]['codes'][code]['totalPaid'] += float(paid or 0)
        npi_data[npi]['codes'][code]['totalClaims'] += int(claims or 0)
        npi_data[npi]['codes'][code]['totalBeneficiaries'] += int(benes or 0)
        
        # By year
        if year not in npi_data[npi]['years']:
            npi_data[npi]['years'][year] = {'totalPaid': 0, 'totalClaims': 0, 'totalBeneficiaries': 0}
        npi_data[npi]['years'][year]['totalPaid'] += float(paid or 0)
        npi_data[npi]['years'][year]['totalClaims'] += int(claims or 0)
        npi_data[npi]['years'][year]['totalBeneficiaries'] += int(benes or 0)
    
    # Also check servicing provider
    query2 = f"""
    SELECT 
        SERVICING_PROVIDER_NPI_NUM as npi,
        COUNT(*) as serv_claims
    FROM read_parquet('{PARQUET}')
    WHERE SERVICING_PROVIDER_NPI_NUM IN ({npi_list})
      AND BILLING_PROVIDER_NPI_NUM != SERVICING_PROVIDER_NPI_NUM
    GROUP BY 1
    """
    serv_rows = con.execute(query2).fetchall()
    serv_claims = {r[0]: r[1] for r in serv_rows}
    
    for npi in batch:
        info = npi_info.get(npi, {})
        d = npi_data.get(npi, {'codes': {}, 'years': {}})
        
        # Build procedures list
        procedures = []
        for code, vals in sorted(d['codes'].items(), key=lambda x: -x[1]['totalPaid']):
            cpc = vals['totalPaid'] / vals['totalClaims'] if vals['totalClaims'] > 0 else 0
            procedures.append({
                'code': code,
                'totalPaid': round(vals['totalPaid'], 2),
                'totalClaims': vals['totalClaims'],
                'totalBeneficiaries': vals['totalBeneficiaries'],
                'costPerClaim': round(cpc, 2)
            })
        
        # Build yearly data
        yearly = {}
        for year, vals in sorted(d['years'].items()):
            yearly[year] = {
                'totalPaid': round(vals['totalPaid'], 2),
                'totalClaims': vals['totalClaims'],
                'totalBeneficiaries': vals['totalBeneficiaries']
            }
        
        total_paid = sum(v['totalPaid'] for v in d['years'].values())
        total_claims = sum(v['totalClaims'] for v in d['years'].values())
        total_benes = sum(v['totalBeneficiaries'] for v in d['years'].values())
        
        # Compute fields
        cpc = total_paid / total_claims if total_claims > 0 else 0
        cpb = total_paid / total_benes if total_benes > 0 else 0
        
        years_active = sorted(d['years'].keys())
        growth = None
        if len(years_active) >= 2:
            first_yr = d['years'][years_active[0]]['totalPaid']
            last_yr = d['years'][years_active[-1]]['totalPaid']
            if first_yr > 0:
                growth = round((last_yr - first_yr) / first_yr * 100, 1)
        
        name = info.get('name', '')
        if name:
            name = ' '.join(w.capitalize() for w in name.lower().split())
        
        provider = {
            'npi': npi,
            'name': name,
            'city': info.get('city', ''),
            'state': info.get('state', ''),
            'specialty': info.get('taxonomy_desc', ''),
            'entityType': info.get('entity_type', ''),
            'totalPaid': round(total_paid, 2),
            'totalClaims': total_claims,
            'totalBeneficiaries': total_benes,
            'costPerClaim': round(cpc, 2),
            'costPerBeneficiary': round(cpb, 2),
            'claimsPerBeneficiary': round(total_claims / total_benes, 1) if total_benes > 0 else 0,
            'growthRate': growth,
            'codeCount': len(d['codes']),
            'yearlyData': yearly,
            'procedures': procedures[:50],
        }
        
        out_path = os.path.join(PROVIDERS_DIR, f"{npi}.json")
        with open(out_path, 'w') as f:
            json.dump(provider, f, indent=2)
        generated += 1
    
    print(f"  Batch {i//BATCH + 1}: generated {len(batch)} pages ({generated} total)")

con.close()
print(f"\nDone! Generated {generated} provider detail pages")
print(f"Total provider pages: {len(os.listdir(PROVIDERS_DIR))}")
