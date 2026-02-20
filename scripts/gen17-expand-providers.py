#!/usr/bin/env python3
"""
Generate provider detail JSON files for top 10,000 providers by total spending.
Also generates an expanded top-providers list.
Uses DuckDB to query parquet in small batches to avoid OOM.
"""
import duckdb
import json
import os
PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data", "providers")
TOP_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "data", "top-providers-expanded.json")
os.makedirs(OUT_DIR, exist_ok=True)

# Step 1: Get top 10,000 providers by total spending
print("Step 1: Finding top 10,000 providers...")
con = duckdb.connect()
top_providers = con.execute(f"""
    SELECT 
        BILLING_PROVIDER_NPI_NUM as npi,
        SUM(TOTAL_PAID) as total_paid,
        SUM(TOTAL_CLAIMS) as total_claims,
        SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_beneficiaries,
        COUNT(DISTINCT HCPCS_CODE) as unique_codes,
        COUNT(DISTINCT CLAIM_FROM_MONTH) as active_months
    FROM read_parquet('{PARQUET}')
    GROUP BY BILLING_PROVIDER_NPI_NUM
    ORDER BY total_paid DESC
    LIMIT 10000
""").fetchall()
con.close()
print(f"Found {len(top_providers)} providers")

# Check which already have detail files
existing = set(f.replace('.json','') for f in os.listdir(OUT_DIR) if f.endswith('.json'))
print(f"Existing detail files: {len(existing)}")

need_details = [(npi, tp, tc, tb, uc, am) for npi, tp, tc, tb, uc, am in top_providers if npi not in existing]
print(f"Need to generate: {len(need_details)} new detail files")

# Step 2: For each provider needing details, query their procedure breakdown
BATCH_SIZE = 100
generated = 0

for batch_start in range(0, len(need_details), BATCH_SIZE):
    batch = need_details[batch_start:batch_start + BATCH_SIZE]
    npis = [str(row[0]) for row in batch]
    npi_list = ",".join(f"'{n}'" for n in npis)
    
    print(f"Batch {batch_start//BATCH_SIZE + 1}: querying {len(batch)} providers...")
    
    con = duckdb.connect()
    # Get procedure breakdown for this batch
    rows = con.execute(f"""
        SELECT 
            BILLING_PROVIDER_NPI_NUM as npi,
            HCPCS_CODE as code,
            SUM(TOTAL_PAID) as paid,
            SUM(TOTAL_CLAIMS) as claims,
            SUM(TOTAL_UNIQUE_BENEFICIARIES) as beneficiaries
        FROM read_parquet('{PARQUET}')
        WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
        GROUP BY BILLING_PROVIDER_NPI_NUM, HCPCS_CODE
        ORDER BY BILLING_PROVIDER_NPI_NUM, paid DESC
    """).fetchall()
    
    # Get monthly trends for this batch
    monthly = con.execute(f"""
        SELECT 
            BILLING_PROVIDER_NPI_NUM as npi,
            CLAIM_FROM_MONTH as month,
            SUM(TOTAL_PAID) as paid,
            SUM(TOTAL_CLAIMS) as claims
        FROM read_parquet('{PARQUET}')
        WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
        GROUP BY BILLING_PROVIDER_NPI_NUM, CLAIM_FROM_MONTH
        ORDER BY BILLING_PROVIDER_NPI_NUM, month
    """).fetchall()
    con.close()
    
    # Group by NPI
    proc_by_npi = {}
    for npi, code, paid, claims, bene in rows:
        if npi not in proc_by_npi:
            proc_by_npi[npi] = []
        proc_by_npi[npi].append({
            "code": code,
            "totalPaid": round(float(paid), 2),
            "totalClaims": int(claims),
            "uniqueBeneficiaries": int(bene)
        })
    
    monthly_by_npi = {}
    for npi, month, paid, claims in monthly:
        if npi not in monthly_by_npi:
            monthly_by_npi[npi] = []
        monthly_by_npi[npi].append({
            "month": month,
            "totalPaid": round(float(paid), 2),
            "totalClaims": int(claims)
        })
    
    # Write detail files
    for npi, tp, tc, tb, uc, am in batch:
        detail = {
            "npi": npi,
            "totalPaid": round(float(tp), 2),
            "totalClaims": int(tc),
            "totalBeneficiaries": int(tb),
            "uniqueCodes": int(uc),
            "activeMonths": int(am),
            "procedures": proc_by_npi.get(npi, [])[:50],  # top 50 procedures
            "monthlyTrend": monthly_by_npi.get(npi, [])
        }
        
        out_path = os.path.join(OUT_DIR, f"{npi}.json")
        with open(out_path, 'w') as f:
            json.dump(detail, f, separators=(',', ':'))
        generated += 1
    
    print(f"  Generated {generated} files so far")

# Step 3: Build expanded top providers list (for the provider listing page)
print("\nStep 3: Building expanded top providers list...")
top_list = []
for npi, tp, tc, tb, uc, am in top_providers[:5000]:  # top 5000 for listing
    # Try to read detail file for name/specialty
    detail_path = os.path.join(OUT_DIR, f"{npi}.json")
    name = f"Provider {npi}"
    specialty = None
    city = None
    state = None
    if os.path.exists(detail_path):
        try:
            with open(detail_path) as f:
                d = json.load(f)
            name = d.get("name", name)
            specialty = d.get("specialty")
            city = d.get("city")
            state = d.get("state")
        except:
            pass
    
    top_list.append({
        "npi": npi,
        "name": name,
        "specialty": specialty,
        "city": city,
        "state": state,
        "totalPaid": round(float(tp), 2),
        "totalClaims": int(tc),
        "totalBeneficiaries": int(tb),
        "uniqueCodes": int(uc)
    })

with open(TOP_FILE, 'w') as f:
    json.dump(top_list, f, separators=(',', ':'))
print(f"Wrote {len(top_list)} providers to top-providers-expanded.json")

print(f"\nDone! Generated {generated} new detail files. Total detail files: {len(os.listdir(OUT_DIR))}")
