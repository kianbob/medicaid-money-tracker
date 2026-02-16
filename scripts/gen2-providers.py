#!/usr/bin/env python3
"""Step 2: Top 50 providers"""
import duckdb, json, os, csv
PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data")
REF = os.path.join(os.path.dirname(__file__), "..", "reference-data")
con = duckdb.connect()
rows = con.execute(f"SELECT BILLING_PROVIDER_NPI_NUM, SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS), SUM(TOTAL_UNIQUE_BENEFICIARIES), COUNT(DISTINCT HCPCS_CODE) FROM read_parquet('{PARQUET}') GROUP BY 1 ORDER BY 2 DESC LIMIT 50").fetchall()
con.close()
npi_info = {}
with open(os.path.join(REF,"npi_lookups.csv")) as f:
    for row in csv.DictReader(f):
        npi_info[row["npi"]] = {"name":row["provider_name"],"specialty":row["taxonomy_description"],"city":row["city"],"state":row["state"]}
providers = []
for r in rows:
    info = npi_info.get(r[0],{})
    providers.append({"npi":r[0],"totalPaid":r[1],"totalClaims":r[2],"totalBenes":r[3],"procCount":r[4],"name":info.get("name",""),"specialty":info.get("specialty",""),"city":info.get("city",""),"state":info.get("state","")})
with open(os.path.join(OUT,"top-providers.json"),"w") as f: json.dump(providers,f)
print(f"Done: {len(providers)} providers")
