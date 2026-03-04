#!/bin/bash
# Step 1: Extract features using DuckDB CLI (much lower RAM than Python+DuckDB)
# Run: bash scripts/ml-v3-step1-extract.sh

PARQUET="$HOME/.openclaw/workspace/medicaid-provider-spending.parquet"
NPI_LOOKUP="$HOME/Projects/medicaid-tracker-app/reference-data/npi_lookups_expanded.csv"
OUTDIR="/tmp/ml_v3"
mkdir -p "$OUTDIR"

echo "=== ML v3 Step 1: Feature Extraction ==="

echo ""
echo "1/6: Base provider features..."
duckdb -csv <<EOF > "$OUTDIR/features.csv"
WITH billing AS (
    SELECT
        BILLING_PROVIDER_NPI_NUM as npi,
        SUM(TOTAL_PAID) as total_paid,
        SUM(TOTAL_CLAIMS) as total_claims,
        SUM(TOTAL_UNIQUE_BENEFICIARIES) as total_benes,
        COUNT(DISTINCT HCPCS_CODE) as code_count,
        COUNT(DISTINCT CLAIM_FROM_MONTH) as active_months,
        SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_CLAIMS), 0) as cost_per_claim,
        SUM(TOTAL_PAID) / NULLIF(SUM(TOTAL_UNIQUE_BENEFICIARIES), 0) as cost_per_bene,
        SUM(TOTAL_CLAIMS) / NULLIF(SUM(TOTAL_UNIQUE_BENEFICIARIES), 0) as claims_per_bene,
        SUM(TOTAL_PAID) / NULLIF(COUNT(DISTINCT CLAIM_FROM_MONTH), 0) as paid_per_month,
        SUM(TOTAL_CLAIMS) / NULLIF(COUNT(DISTINCT CLAIM_FROM_MONTH), 0) as claims_per_month
    FROM '${PARQUET}'
    GROUP BY npi
    HAVING SUM(TOTAL_PAID) > 0
),
lookup AS (
    SELECT npi, taxonomy_description as specialty, state
    FROM read_csv_auto('${NPI_LOOKUP}')
)
SELECT b.*, COALESCE(l.specialty, '') as specialty, COALESCE(l.state, '') as state
FROM billing b
LEFT JOIN lookup l ON b.npi = l.npi;
EOF
echo "  $(wc -l < "$OUTDIR/features.csv") rows"

echo ""
echo "2/6: Top code concentration..."
duckdb -csv <<EOF > "$OUTDIR/conc.csv"
WITH code_totals AS (
    SELECT BILLING_PROVIDER_NPI_NUM as npi, HCPCS_CODE,
           SUM(TOTAL_PAID) as code_paid,
           ROW_NUMBER() OVER (PARTITION BY BILLING_PROVIDER_NPI_NUM ORDER BY SUM(TOTAL_PAID) DESC) as rn
    FROM '${PARQUET}'
    GROUP BY npi, HCPCS_CODE
),
provider_totals AS (
    SELECT BILLING_PROVIDER_NPI_NUM as npi, SUM(TOTAL_PAID) as total
    FROM '${PARQUET}' GROUP BY npi
)
SELECT ct.npi, ct.code_paid / NULLIF(pt.total, 0) as top_code_conc
FROM code_totals ct
JOIN provider_totals pt ON ct.npi = pt.npi
WHERE ct.rn = 1;
EOF
echo "  $(wc -l < "$OUTDIR/conc.csv") rows"

echo ""
echo "3/6: Self-billing ratio..."
duckdb -csv <<EOF > "$OUTDIR/self.csv"
SELECT BILLING_PROVIDER_NPI_NUM as npi,
       AVG(CASE WHEN BILLING_PROVIDER_NPI_NUM = SERVICING_PROVIDER_NPI_NUM THEN 1.0 ELSE 0.0 END) as self_bill_ratio
FROM '${PARQUET}'
GROUP BY npi;
EOF
echo "  $(wc -l < "$OUTDIR/self.csv") rows"

echo ""
echo "4/6: Growth ratio..."
duckdb -csv <<EOF > "$OUTDIR/growth.csv"
WITH yearly AS (
    SELECT BILLING_PROVIDER_NPI_NUM as npi,
           LEFT(CLAIM_FROM_MONTH, 4) as yr,
           SUM(TOTAL_PAID) as yr_paid
    FROM '${PARQUET}'
    GROUP BY npi, LEFT(CLAIM_FROM_MONTH, 4)
)
SELECT npi,
       MAX(yr_paid) / NULLIF(MIN(CASE WHEN yr_paid > 100 THEN yr_paid END), 0) as max_growth_ratio
FROM yearly
GROUP BY npi;
EOF
echo "  $(wc -l < "$OUTDIR/growth.csv") rows"

echo ""
echo "5/6: Specialty peer z-scores..."
duckdb -csv <<EOF > "$OUTDIR/specialty_z.csv"
WITH lookup AS (
    SELECT npi, taxonomy_description as specialty
    FROM read_csv_auto('${NPI_LOOKUP}')
    WHERE taxonomy_description IS NOT NULL AND taxonomy_description != ''
),
provider_stats AS (
    SELECT
        b.BILLING_PROVIDER_NPI_NUM as npi,
        l.specialty,
        SUM(b.TOTAL_PAID) as total_paid,
        SUM(b.TOTAL_PAID) / NULLIF(SUM(b.TOTAL_CLAIMS), 0) as cost_per_claim,
        SUM(b.TOTAL_PAID) / NULLIF(SUM(b.TOTAL_UNIQUE_BENEFICIARIES), 0) as cost_per_bene
    FROM '${PARQUET}' b
    JOIN lookup l ON b.BILLING_PROVIDER_NPI_NUM = l.npi
    GROUP BY b.BILLING_PROVIDER_NPI_NUM, l.specialty
    HAVING SUM(b.TOTAL_PAID) > 0
),
specialty_stats AS (
    SELECT
        specialty,
        AVG(total_paid) as avg_paid, STDDEV(total_paid) as std_paid,
        AVG(cost_per_claim) as avg_cpc, STDDEV(cost_per_claim) as std_cpc,
        AVG(cost_per_bene) as avg_cpb, STDDEV(cost_per_bene) as std_cpb,
        COUNT(*) as peer_count
    FROM provider_stats
    GROUP BY specialty
    HAVING COUNT(*) >= 5
)
SELECT
    p.npi,
    (p.total_paid - s.avg_paid) / NULLIF(s.std_paid, 0) as paid_z_specialty,
    (p.cost_per_claim - s.avg_cpc) / NULLIF(s.std_cpc, 0) as cpc_z_specialty,
    (p.cost_per_bene - s.avg_cpb) / NULLIF(s.std_cpb, 0) as cpb_z_specialty,
    s.peer_count
FROM provider_stats p
JOIN specialty_stats s ON p.specialty = s.specialty;
EOF
echo "  $(wc -l < "$OUTDIR/specialty_z.csv") rows"

echo ""
echo "6/6: State peer z-scores..."
duckdb -csv <<EOF > "$OUTDIR/state_z.csv"
WITH lookup AS (
    SELECT npi, state
    FROM read_csv_auto('${NPI_LOOKUP}')
    WHERE state IS NOT NULL AND state != ''
),
provider_stats AS (
    SELECT
        b.BILLING_PROVIDER_NPI_NUM as npi,
        l.state,
        SUM(b.TOTAL_PAID) as total_paid,
        SUM(b.TOTAL_PAID) / NULLIF(SUM(b.TOTAL_CLAIMS), 0) as cost_per_claim
    FROM '${PARQUET}' b
    JOIN lookup l ON b.BILLING_PROVIDER_NPI_NUM = l.npi
    GROUP BY b.BILLING_PROVIDER_NPI_NUM, l.state
    HAVING SUM(b.TOTAL_PAID) > 0
),
state_stats AS (
    SELECT state,
        AVG(total_paid) as avg_paid, STDDEV(total_paid) as std_paid,
        AVG(cost_per_claim) as avg_cpc, STDDEV(cost_per_claim) as std_cpc
    FROM provider_stats
    GROUP BY state
    HAVING COUNT(*) >= 10
)
SELECT
    p.npi,
    (p.total_paid - s.avg_paid) / NULLIF(s.std_paid, 0) as paid_z_state,
    (p.cost_per_claim - s.avg_cpc) / NULLIF(s.std_cpc, 0) as cpc_z_state
FROM provider_stats p
JOIN state_stats s ON p.state = s.state;
EOF
echo "  $(wc -l < "$OUTDIR/state_z.csv") rows"

echo ""
echo "=== Feature extraction complete ==="
ls -lh "$OUTDIR/"
echo ""
echo "Now run: python3 scripts/ml-v3-step2-train.py"
