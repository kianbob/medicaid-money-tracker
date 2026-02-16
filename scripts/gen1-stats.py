#!/usr/bin/env python3
"""Step 1: Just global stats"""
import duckdb, json, os
PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data")
os.makedirs(OUT, exist_ok=True)
con = duckdb.connect()
r = con.execute(f"SELECT COUNT(*), SUM(TOTAL_PAID), COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM), COUNT(DISTINCT HCPCS_CODE), MIN(CLAIM_FROM_MONTH), MAX(CLAIM_FROM_MONTH), SUM(TOTAL_CLAIMS), SUM(TOTAL_UNIQUE_BENEFICIARIES) FROM read_parquet('{PARQUET}')").fetchone()
stats = {"records":r[0],"totalPaid":r[1],"providers":r[2],"procedures":r[3],"minMonth":str(r[4]),"maxMonth":str(r[5]),"totalClaims":r[6],"totalBenes":r[7]}
with open(os.path.join(OUT,"stats.json"),"w") as f: json.dump(stats,f)
print(f"Done: {r[0]:,} records, ${r[1]:,.0f}")
con.close()
