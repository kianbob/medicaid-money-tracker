#!/usr/bin/env python3
"""Step 3: Top 50 procedures"""
import duckdb, json, os
PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data")
con = duckdb.connect()
rows = con.execute(f"SELECT HCPCS_CODE, SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS), COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM), AVG(TOTAL_PAID/NULLIF(TOTAL_CLAIMS,0)) FROM read_parquet('{PARQUET}') GROUP BY 1 ORDER BY 2 DESC LIMIT 50").fetchall()
con.close()
procs = [{"code":r[0],"totalPaid":r[1],"totalClaims":r[2],"providerCount":r[3],"avgCostPerClaim":r[4]} for r in rows]
with open(os.path.join(OUT,"top-procedures.json"),"w") as f: json.dump(procs,f)
print(f"Done: {len(procs)} procedures")
