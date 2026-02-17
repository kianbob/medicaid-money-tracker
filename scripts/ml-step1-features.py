#!/usr/bin/env python3
"""Step 1: Extract ML features to CSV using DuckDB (low memory)"""
import duckdb, os

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
OUT = '/tmp/ml_features.csv'

con = duckdb.connect()

print("Extracting provider features (this takes ~2 min)...")
con.execute(f"""
COPY (
    WITH base AS (
        SELECT
            BILLING_PROVIDER_NPI_NUM as npi,
            SUM(TOTAL_PAID) as total_paid,
            SUM(TOTAL_CLAIMS) as total_claims,
            SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
            COUNT(DISTINCT HCPCS_CODE) as code_count,
            COUNT(DISTINCT CLAIM_FROM_MONTH) as active_months
        FROM '{PARQUET}'
        GROUP BY npi
        HAVING SUM(TOTAL_PAID) > 0
    ),
    top_code AS (
        SELECT npi, top_paid / NULLIF(total, 0) as top_code_conc FROM (
            SELECT BILLING_PROVIDER_NPI_NUM as npi,
                   MAX(code_paid) as top_paid, SUM(code_paid) as total
            FROM (SELECT BILLING_PROVIDER_NPI_NUM, SUM(TOTAL_PAID) as code_paid
                  FROM '{PARQUET}' GROUP BY BILLING_PROVIDER_NPI_NUM, HCPCS_CODE)
            GROUP BY npi
        )
    ),
    self_bill AS (
        SELECT BILLING_PROVIDER_NPI_NUM as npi,
               AVG(CASE WHEN BILLING_PROVIDER_NPI_NUM = SERVICING_PROVIDER_NPI_NUM THEN 1.0 ELSE 0.0 END) as self_bill_ratio
        FROM '{PARQUET}'
        GROUP BY npi
    )
    SELECT 
        b.npi,
        b.total_paid,
        b.total_claims,
        b.total_benes,
        b.code_count,
        b.active_months,
        b.total_paid / NULLIF(b.total_claims, 0) as cpc,
        b.total_paid / NULLIF(b.total_benes, 0) as cpb,
        b.total_claims / NULLIF(b.total_benes, 0) as cpb_claims,
        b.total_paid / NULLIF(b.active_months, 0) as paid_per_mo,
        b.total_claims / NULLIF(b.active_months, 0) as claims_per_mo,
        tc.top_code_conc,
        sb.self_bill_ratio,
        CASE WHEN b.active_months <= 12 AND b.total_paid > 1000000 THEN 1 ELSE 0 END as short_burst,
        CASE WHEN b.code_count <= 2 AND b.total_paid > 500000 THEN 1 ELSE 0 END as low_code_high
    FROM base b
    LEFT JOIN top_code tc ON b.npi = tc.npi
    LEFT JOIN self_bill sb ON b.npi = sb.npi
) TO '{OUT}' (HEADER, DELIMITER ',')
""")
con.close()

# Count rows
with open(OUT) as f:
    lines = sum(1 for _ in f) - 1
print(f"Done! {lines:,} providers → {OUT}")
