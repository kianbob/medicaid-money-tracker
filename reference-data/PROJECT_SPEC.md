# Medicaid Money Tracker — Project Spec

## Overview
A standalone interactive data journalism website that exposes Medicaid provider spending patterns and potential fraud. Think ProPublica's Dollars for Docs meets OpenSecrets — but for Medicaid.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Chart.js with react-chartjs-2
- **Database:** SQLite (via better-sqlite3) for the initial build — easy to deploy, no external DB needed
- **Maps:** Simple SVG US map (no heavy mapping libraries)
- **Deployment:** Vercel-ready
- **Language:** TypeScript

## Data Source
HHS Medicaid Provider Spending dataset:
- 227 million billing records
- $1.09 trillion in total payments
- 617,503 unique providers
- 10,881 procedure codes
- Date range: January 2018 — December 2024
- Source parquet file: ~/.openclaw/workspace/medicaid-provider-spending.parquet

### Schema
| Column | Type | Description |
|--------|------|-------------|
| BILLING_PROVIDER_NPI_NUM | string | NPI of billing provider |
| SERVICING_PROVIDER_NPI_NUM | string | NPI of servicing provider |
| HCPCS_CODE | string | Procedure code |
| CLAIM_FROM_MONTH | date | Month (YYYY-MM-01) |
| TOTAL_UNIQUE_BENEFICIARIES | integer | Unique beneficiaries |
| TOTAL_CLAIMS | integer | Total claims |
| TOTAL_PAID | float | Total $ paid by Medicaid |

## Site Structure

### 1. Homepage (`/`)
- Hero section with big headline stats ($1.09T, 617K providers, 227M records)
- Interactive US map showing spending by state (color-coded heat map)
- "Fraud Watchlist" teaser — top 5 most suspicious providers
- Search bar: "Look up any Medicaid provider"
- Top spending providers carousel
- Recent findings / analysis highlights
- Clean, modern dark theme

### 2. Provider Search & Directory (`/providers`)
- Search by name, NPI, state, specialty
- Filterable/sortable results table
- Each result shows: name, specialty, location, total spending, fraud risk indicator
- Pagination

### 3. Provider Detail Pages (`/providers/[npi]`)
- Provider header: name, NPI, specialty, address, entity type
- Summary stats cards: total paid, total claims, unique beneficiaries, avg cost per claim
- Monthly spending line chart (2018-2024)
- Top procedures table with spending breakdown
- Fraud risk assessment box (if flagged):
  - Which analyses flagged them
  - Plain-language explanation
  - Risk rating (Critical/High/Moderate/None)
- Compare to peers: how does this provider's spending compare to others in same specialty/state

### 4. Fraud Watchlist (`/watchlist`)
- THE flagship page — this is what gets shared
- Top 10 most suspicious providers with deep-dive cards
- Each card: provider name, location, total spending, all red flags, risk rating, plain-language explanation
- Summary stats: total flagged, total $ at risk
- Methodology section explaining how fraud detection works
- Filter by risk level, flag type, state

### 5. Procedure Explorer (`/procedures`)
- Browse all HCPCS procedure codes
- Each code: total spending, provider count, average cost per claim
- Highlight codes with highest variance (where some providers charge way more than others)

### 6. Procedure Detail (`/procedures/[code]`)
- Procedure info and description
- Total spending, trends over time
- Provider comparison: who charges the most vs least for this procedure
- Cost distribution chart

### 7. State Pages (`/states/[state]`)
- State overview with total Medicaid spending
- Top providers in state
- Top procedures in state
- Fraud flags in state
- Comparison to national averages

### 8. About / Methodology (`/about`)
- Data source and freshness
- Fraud detection methodology in plain language
- Disclaimers (statistical flags ≠ proof of fraud)
- About TheDataProject.ai

## Design Requirements
- **Dark theme** — professional, data-journalism feel (dark navy/charcoal background, white text, accent colors for charts)
- **Responsive** — works great on mobile
- **Fast** — static generation where possible, lazy-load charts
- **Accessible** — proper contrast, semantic HTML
- **Shareable** — OpenGraph meta tags for each page, especially watchlist and provider pages

## Data Processing (Build Step)
Create a data processing script (`scripts/process-data.ts` or Python) that:
1. Reads the parquet file using DuckDB
2. Aggregates into provider profiles, procedure profiles, state profiles
3. Calculates fraud risk scores
4. Outputs JSON files to `public/data/` or populates SQLite database
5. NPI enrichment data is already available in npi_lookups.csv (expand this later)

For the initial build, use pre-processed JSON files in `public/data/` for the key pages:
- `stats.json` — global summary stats
- `top-providers.json` — top 50 providers with NPI lookup data
- `top-procedures.json` — top 50 procedures
- `state-summary.json` — per-state totals
- `watchlist.json` — fraud watchlist data with all flags and explanations
- `provider-monthly/[npi].json` — monthly time series for key providers

## Phase 1 (Build Now)
Focus on getting a working, impressive site with:
- Homepage with stats, map, search
- Fraud Watchlist page (the viral page)
- Provider detail pages for the top flagged providers
- Procedure explorer
- Static data from our analysis

## Phase 2 (Later)
- Full provider search across all 617K providers (needs DB)
- State detail pages
- API endpoints for dynamic search
- Bulk NPI enrichment for all providers
- Automated data refresh pipeline

## Reference Data Files (in project root)
- `npi_lookups.csv` — NPI registry data for top providers
- `dashboard_data.json` — summary stats and top procedures
- `top10_monthly.json` — monthly spending for top 10 suspicious providers
- `5_multi_flag_providers.csv` — all multi-flag providers

## Additional Data to Generate
The build script should query the parquet file at `~/.openclaw/workspace/medicaid-provider-spending.parquet` to generate additional JSON data files. Use DuckDB via Python (`/usr/bin/python3` with `duckdb` module installed).

IMPORTANT: Python on this machine has memory constraints. Keep queries small and focused — query one thing at a time, don't load the whole dataset into memory.
