#!/usr/bin/env python3
"""
Expand provider detail files. Two-step approach to avoid OOM:
Step 1: DuckDB → CSV of top 30K providers (aggregate only)
Step 2: For each new NPI, query procedure/monthly data in small batches
"""
import duckdb, json, os, csv

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data", "providers")
TMP_CSV = "/tmp/top30k_providers.csv"
os.makedirs(OUT_DIR, exist_ok=True)

existing = set(f.replace('.json','') for f in os.listdir(OUT_DIR) if f.endswith('.json'))
print(f"Existing detail files: {len(existing)}")

# Step 1: Export top 30K NPIs to CSV
print("Step 1: Exporting top 30K providers to CSV...")
con = duckdb.connect()
con.execute(f"""
    COPY (
        SELECT 
            BILLING_PROVIDER_NPI_NUM as npi,
            SUM(TOTAL_PAID) as total_paid,
            SUM(TOTAL_CLAIMS) as total_claims,
            SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_bene,
            COUNT(DISTINCT HCPCS_CODE) as unique_codes,
            COUNT(DISTINCT CLAIM_FROM_MONTH) as active_months
        FROM read_parquet('{PARQUET}')
        GROUP BY 1
        ORDER BY 2 DESC
        LIMIT 30000
    ) TO '{TMP_CSV}' (HEADER, DELIMITER ',')
""")
con.close()
print(f"Exported to {TMP_CSV}")

# Read CSV and find new NPIs
need = []
with open(TMP_CSV) as f:
    for row in csv.DictReader(f):
        npi = row['npi']
        if npi not in existing:
            need.append(row)

print(f"Need to generate: {len(need)} new detail files")

# Step 2: Process in batches of 50
BATCH = 50
generated = 0

for i in range(0, len(need), BATCH):
    batch = need[i:i+BATCH]
    npis = [r['npi'] for r in batch]
    npi_list = ",".join(f"'{n}'" for n in npis)
    
    con = duckdb.connect()
    rows = con.execute(f"""
        SELECT BILLING_PROVIDER_NPI_NUM, HCPCS_CODE,
               SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS), SUM(TOTAL_UNIQUE_BENEFICIARIES)
        FROM read_parquet('{PARQUET}')
        WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
        GROUP BY 1, 2 ORDER BY 1, 3 DESC
    """).fetchall()
    
    monthly = con.execute(f"""
        SELECT BILLING_PROVIDER_NPI_NUM, CLAIM_FROM_MONTH,
               SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS)
        FROM read_parquet('{PARQUET}')
        WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
        GROUP BY 1, 2 ORDER BY 1, 2
    """).fetchall()
    con.close()
    
    proc_by = {}
    for npi, code, paid, claims, bene in rows:
        proc_by.setdefault(npi, []).append({
            "code": code, "totalPaid": round(float(paid), 2),
            "totalClaims": int(claims), "uniqueBeneficiaries": int(bene)
        })
    
    month_by = {}
    for npi, month, paid, claims in monthly:
        month_by.setdefault(npi, []).append({
            "month": month, "totalPaid": round(float(paid), 2), "totalClaims": int(claims)
        })
    
    for row in batch:
        npi = row['npi']
        detail = {
            "npi": npi,
            "totalPaid": round(float(row['total_paid']), 2),
            "totalClaims": int(float(row['total_claims'])),
            "totalBeneficiaries": int(float(row['total_bene'])),
            "uniqueCodes": int(float(row['unique_codes'])),
            "activeMonths": int(float(row['active_months'])),
            "procedures": proc_by.get(npi, [])[:30],
            "monthlyTrend": month_by.get(npi, [])
        }
        with open(os.path.join(OUT_DIR, f"{npi}.json"), 'w') as f:
            json.dump(detail, f, separators=(',', ':'))
        generated += 1
    
    if (i // BATCH) % 10 == 0:
        print(f"  Progress: {generated}/{len(need)} files")

print(f"\nDone! Generated {generated} new files. Total: {len(os.listdir(OUT_DIR))}")
