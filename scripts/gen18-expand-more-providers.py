#!/usr/bin/env python3
"""
Generate provider detail JSON files for providers ranked 10,001-30,000 by spending.
Processes in small batches of 50 to avoid OOM on 16GB Mac.
"""
import duckdb, json, os

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data", "providers")
os.makedirs(OUT_DIR, exist_ok=True)

existing = set(f.replace('.json','') for f in os.listdir(OUT_DIR) if f.endswith('.json'))
print(f"Existing detail files: {len(existing)}")

# Step 1: Get providers ranked 10,001-30,000 by total spending
print("Finding providers ranked 10,001-30,000...")
con = duckdb.connect()
providers = con.execute(f"""
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
    LIMIT 30000 OFFSET 10000
""").fetchall()
con.close()
print(f"Found {len(providers)} providers in rank range")

# Filter out those we already have
need = [(npi, tp, tc, tb, uc, am) for npi, tp, tc, tb, uc, am in providers if str(npi) not in existing]
print(f"Need to generate: {len(need)} new detail files")

# Step 2: Process in batches of 50
BATCH = 50
generated = 0

for i in range(0, len(need), BATCH):
    batch = need[i:i+BATCH]
    npis = [str(r[0]) for r in batch]
    npi_list = ",".join(f"'{n}'" for n in npis)
    
    con = duckdb.connect()
    # Procedure breakdown
    rows = con.execute(f"""
        SELECT BILLING_PROVIDER_NPI_NUM, HCPCS_CODE,
               SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS), SUM(TOTAL_UNIQUE_BENEFICIARIES)
        FROM read_parquet('{PARQUET}')
        WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
        GROUP BY 1, 2
        ORDER BY 1, 3 DESC
    """).fetchall()
    
    # Monthly trends
    monthly = con.execute(f"""
        SELECT BILLING_PROVIDER_NPI_NUM, CLAIM_FROM_MONTH,
               SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS)
        FROM read_parquet('{PARQUET}')
        WHERE BILLING_PROVIDER_NPI_NUM IN ({npi_list})
        GROUP BY 1, 2
        ORDER BY 1, 2
    """).fetchall()
    con.close()
    
    # Group
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
    
    for npi, tp, tc, tb, uc, am in batch:
        detail = {
            "npi": str(npi),
            "totalPaid": round(float(tp), 2),
            "totalClaims": int(tc),
            "totalBeneficiaries": int(tb),
            "uniqueCodes": int(uc),
            "activeMonths": int(am),
            "procedures": proc_by.get(npi, [])[:30],
            "monthlyTrend": month_by.get(npi, [])
        }
        with open(os.path.join(OUT_DIR, f"{npi}.json"), 'w') as f:
            json.dump(detail, f, separators=(',', ':'))
        generated += 1
    
    if (i // BATCH) % 20 == 0:
        print(f"  Progress: {generated}/{len(need)} ({generated*100//max(len(need),1)}%)")

print(f"\nDone! Generated {generated} new files. Total: {len(os.listdir(OUT_DIR))}")
