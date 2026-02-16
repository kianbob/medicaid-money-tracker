#!/usr/bin/env python3
"""Step 4: Watchlist data"""
import duckdb, json, os, csv
PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data")
REF = os.path.join(os.path.dirname(__file__), "..", "reference-data")
npi_info = {}
with open(os.path.join(REF,"npi_lookups.csv")) as f:
    for row in csv.DictReader(f):
        npi_info[row["npi"]] = {"name":row["provider_name"],"specialty":row["taxonomy_description"],"city":row["city"],"state":row["state"],"entityType":row["entity_type"]}
multi_flags = []
with open(os.path.join(REF,"5_multi_flag_providers.csv")) as f:
    reader = csv.DictReader(f)
    cols = reader.fieldnames
    print(f"CSV columns: {cols}")
    for row in reader:
        multi_flags.append(row)
print(f"Loaded {len(multi_flags)} flagged providers")
print(f"Sample row: {multi_flags[0]}")
con = duckdb.connect()
watchlist = []
for mf in multi_flags:
    npi = mf.get("npi") or mf.get("BILLING_PROVIDER_NPI_NUM") or list(mf.values())[0]
    info = npi_info.get(npi, {})
    flags_raw = mf.get("flag_types", mf.get("flags", ""))
    flags = [f.strip().strip("'\"") for f in flags_raw.replace("[","").replace("]","").split() if f.strip().strip("'\"")]
    r = con.execute(f"SELECT SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS), SUM(TOTAL_UNIQUE_BENEFICIARIES) FROM read_parquet('{PARQUET}') WHERE BILLING_PROVIDER_NPI_NUM = '{npi}'").fetchone()
    watchlist.append({
        "npi":npi,"name":info.get("name","Unknown"),"specialty":info.get("specialty",""),
        "city":info.get("city",""),"state":info.get("state",""),"entityType":info.get("entityType",""),
        "flagCount":len(flags),"flags":flags,
        "totalPaid":r[0] or 0,"totalClaims":r[1] or 0,"totalBenes":r[2] or 0
    })
    print(f"  {npi}: ${r[0]:,.0f}" if r[0] else f"  {npi}: no data")
con.close()
watchlist.sort(key=lambda x: (-x["flagCount"], -x["totalPaid"]))
with open(os.path.join(OUT,"watchlist.json"),"w") as f: json.dump(watchlist,f)
print(f"Done: {len(watchlist)} watchlist entries")
