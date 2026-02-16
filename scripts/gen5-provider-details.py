#!/usr/bin/env python3
"""Step 5: Provider detail files for top + watchlist NPIs"""
import duckdb, json, os, csv
PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data", "providers")
REF = os.path.join(os.path.dirname(__file__), "..", "reference-data")
os.makedirs(OUT, exist_ok=True)

npi_info = {}
with open(os.path.join(REF,"npi_lookups.csv")) as f:
    for row in csv.DictReader(f):
        npi_info[row["npi"]] = {"name":row["provider_name"],"specialty":row["taxonomy_description"],"city":row["city"],"state":row["state"],"entityType":row["entity_type"]}

# Collect all NPIs we need
npis = set()
with open(os.path.join(os.path.dirname(__file__),"..","public","data","top-providers.json")) as f:
    for p in json.load(f): npis.add(p["npi"])
with open(os.path.join(os.path.dirname(__file__),"..","public","data","watchlist.json")) as f:
    for p in json.load(f): npis.add(p["npi"])
print(f"Processing {len(npis)} providers...")

con = duckdb.connect()
for npi in npis:
    try:
        rows = con.execute(f"SELECT HCPCS_CODE, SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS), SUM(TOTAL_UNIQUE_BENEFICIARIES) FROM read_parquet('{PARQUET}') WHERE BILLING_PROVIDER_NPI_NUM = '{npi}' GROUP BY 1 ORDER BY 2 DESC LIMIT 10").fetchall()
        info = npi_info.get(npi, {})
        detail = {"npi":npi,"name":info.get("name","Provider "+npi),"specialty":info.get("specialty",""),"city":info.get("city",""),"state":info.get("state",""),"entityType":info.get("entityType",""),
            "topProcedures":[{"code":r[0],"paid":r[1],"claims":r[2],"benes":r[3]} for r in rows]}
        with open(os.path.join(OUT,f"{npi}.json"),"w") as f: json.dump(detail,f)
    except Exception as e:
        print(f"  Error {npi}: {e}")
con.close()
print("Done!")
