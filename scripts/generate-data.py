#!/usr/bin/env python3
"""Generate JSON data files for the Medicaid Money Tracker site."""
import duckdb
import json
import os
import csv

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data")
REF = os.path.join(os.path.dirname(__file__), "..", "reference-data")
os.makedirs(OUT, exist_ok=True)

con = duckdb.connect()

print("1. Global stats...")
r = con.execute(f"""
    SELECT COUNT(*) as records, SUM(TOTAL_PAID) as total_paid,
           COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM) as providers,
           COUNT(DISTINCT HCPCS_CODE) as procedures,
           MIN(CLAIM_FROM_MONTH) as min_month, MAX(CLAIM_FROM_MONTH) as max_month,
           SUM(TOTAL_CLAIMS) as total_claims, SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes
    FROM read_parquet('{PARQUET}')
""").fetchone()
stats = {
    "records": r[0], "totalPaid": r[1], "providers": r[2], "procedures": r[3],
    "minMonth": str(r[4]), "maxMonth": str(r[5]), "totalClaims": r[6], "totalBenes": r[7]
}
with open(os.path.join(OUT, "stats.json"), "w") as f:
    json.dump(stats, f)
print(f"   Records: {r[0]:,}, Total: ${r[1]:,.0f}")

print("2. Top 50 providers by spending...")
rows = con.execute(f"""
    SELECT BILLING_PROVIDER_NPI_NUM as npi, SUM(TOTAL_PAID) as total_paid,
           SUM(TOTAL_CLAIMS) as total_claims, SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
           COUNT(DISTINCT HCPCS_CODE) as proc_count
    FROM read_parquet('{PARQUET}')
    GROUP BY 1 ORDER BY 2 DESC LIMIT 50
""").fetchall()
providers = [{"npi":r[0],"totalPaid":r[1],"totalClaims":r[2],"totalBenes":r[3],"procCount":r[4]} for r in rows]
with open(os.path.join(OUT, "top-providers.json"), "w") as f:
    json.dump(providers, f)
print(f"   Done ({len(providers)} providers)")

print("3. Top 50 procedures by spending...")
rows = con.execute(f"""
    SELECT HCPCS_CODE as code, SUM(TOTAL_PAID) as total_paid,
           SUM(TOTAL_CLAIMS) as total_claims, COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM) as provider_count,
           AVG(TOTAL_PAID / NULLIF(TOTAL_CLAIMS, 0)) as avg_cost_per_claim
    FROM read_parquet('{PARQUET}')
    GROUP BY 1 ORDER BY 2 DESC LIMIT 50
""").fetchall()
procs = [{"code":r[0],"totalPaid":r[1],"totalClaims":r[2],"providerCount":r[3],"avgCostPerClaim":r[4]} for r in rows]
with open(os.path.join(OUT, "top-procedures.json"), "w") as f:
    json.dump(procs, f)
print(f"   Done ({len(procs)} procedures)")

print("4. State summary...")
rows = con.execute(f"""
    SELECT SUBSTRING(BILLING_PROVIDER_NPI_NUM, 1, 2) as state_prefix,
           SUM(TOTAL_PAID) as total_paid, SUM(TOTAL_CLAIMS) as total_claims,
           COUNT(DISTINCT BILLING_PROVIDER_NPI_NUM) as providers
    FROM read_parquet('{PARQUET}')
    GROUP BY 1 ORDER BY 2 DESC
""").fetchall()
# NPI doesn't encode state, so let's do state from NPI lookups instead
# For now, save provider-level data and we'll enrich later
print("   Skipping state (NPI doesn't encode state) — will use NPI lookups")

print("5. Watchlist data...")
# Load NPI lookups
npi_info = {}
with open(os.path.join(REF, "npi_lookups.csv")) as f:
    reader = csv.DictReader(f)
    for row in reader:
        npi_info[row["npi"]] = {
            "name": row["provider_name"],
            "entityType": row["entity_type"],
            "specialty": row["taxonomy_description"],
            "city": row["city"],
            "state": row["state"]
        }

# Load multi-flag providers
multi_flags = []
with open(os.path.join(REF, "5_multi_flag_providers.csv")) as f:
    reader = csv.DictReader(f)
    for row in reader:
        multi_flags.append(row)

# Build watchlist with provider details
watchlist = []
for mf in multi_flags:
    npi = mf.get("npi") or mf.get("BILLING_PROVIDER_NPI_NUM") or list(mf.values())[0]
    info = npi_info.get(npi, {})
    entry = {
        "npi": npi,
        "name": info.get("name", "Unknown Provider"),
        "specialty": info.get("specialty", ""),
        "city": info.get("city", ""),
        "state": info.get("state", ""),
        "entityType": info.get("entityType", ""),
        "flagCount": int(mf.get("flag_count", mf.get("num_flags", 0))),
        "flags": mf.get("flag_types", mf.get("flags", "")).replace("[","").replace("]","").replace("'","").split()
    }
    # Get spending data for this provider
    try:
        r = con.execute(f"""
            SELECT SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS), SUM(TOTAL_UNIQUE_BENEFICIARIES)
            FROM read_parquet('{PARQUET}')
            WHERE BILLING_PROVIDER_NPI_NUM = '{npi}'
        """).fetchone()
        entry["totalPaid"] = r[0] or 0
        entry["totalClaims"] = r[1] or 0
        entry["totalBenes"] = r[2] or 0
    except:
        entry["totalPaid"] = 0
        entry["totalClaims"] = 0
        entry["totalBenes"] = 0
    watchlist.append(entry)

watchlist.sort(key=lambda x: x["flagCount"], reverse=True)
with open(os.path.join(OUT, "watchlist.json"), "w") as f:
    json.dump(watchlist, f)
print(f"   Done ({len(watchlist)} flagged providers)")

print("6. Monthly data for top 10 watchlist providers...")
os.makedirs(os.path.join(OUT, "provider-monthly"), exist_ok=True)
# Use pre-computed monthly data
with open(os.path.join(REF, "top10_monthly.json")) as f:
    monthly = json.load(f)
for npi, data in monthly.items():
    with open(os.path.join(OUT, "provider-monthly", f"{npi}.json"), "w") as f:
        json.dump(data, f)
print(f"   Done ({len(monthly)} providers)")

print("7. Provider details for top 50 + watchlist NPIs...")
all_npis = set()
for p in providers:
    all_npis.add(p["npi"])
for w in watchlist:
    all_npis.add(w["npi"])

os.makedirs(os.path.join(OUT, "providers"), exist_ok=True)
for npi in all_npis:
    try:
        # Get top procedures for this provider
        rows = con.execute(f"""
            SELECT HCPCS_CODE, SUM(TOTAL_PAID) as paid, SUM(TOTAL_CLAIMS) as claims,
                   SUM(TOTAL_UNIQUE_BENEFICIARIES) as benes
            FROM read_parquet('{PARQUET}')
            WHERE BILLING_PROVIDER_NPI_NUM = '{npi}'
            GROUP BY 1 ORDER BY 2 DESC LIMIT 10
        """).fetchall()
        info = npi_info.get(npi, {})
        detail = {
            "npi": npi,
            "name": info.get("name", "Provider " + npi),
            "specialty": info.get("specialty", ""),
            "city": info.get("city", ""),
            "state": info.get("state", ""),
            "entityType": info.get("entityType", ""),
            "topProcedures": [{"code":r[0],"paid":r[1],"claims":r[2],"benes":r[3]} for r in rows]
        }
        with open(os.path.join(OUT, "providers", f"{npi}.json"), "w") as f:
            json.dump(detail, f)
    except Exception as e:
        print(f"   Error for {npi}: {e}")

print(f"   Done ({len(all_npis)} provider detail files)")

# Also get monthly data for top 50 providers not in top 10
print("8. Monthly data for remaining top providers...")
for p in providers[:20]:
    npi = p["npi"]
    if npi in monthly:
        continue
    try:
        rows = con.execute(f"""
            SELECT CLAIM_FROM_MONTH, SUM(TOTAL_PAID), SUM(TOTAL_CLAIMS), SUM(TOTAL_UNIQUE_BENEFICIARIES)
            FROM read_parquet('{PARQUET}')
            WHERE BILLING_PROVIDER_NPI_NUM = '{npi}'
            GROUP BY 1 ORDER BY 1
        """).fetchall()
        data = [{"month":str(r[0])[:7],"paid":r[1],"claims":r[2],"benes":r[3]} for r in rows]
        with open(os.path.join(OUT, "provider-monthly", f"{npi}.json"), "w") as f:
            json.dump(data, f)
    except Exception as e:
        print(f"   Error for {npi}: {e}")
print("   Done")

# Enrich top-providers with NPI names
print("9. Enriching top providers with names...")
for p in providers:
    info = npi_info.get(p["npi"], {})
    p["name"] = info.get("name", "")
    p["specialty"] = info.get("specialty", "")
    p["city"] = info.get("city", "")
    p["state"] = info.get("state", "")
with open(os.path.join(OUT, "top-providers.json"), "w") as f:
    json.dump(providers, f)

print("\n✅ All data generated!")
