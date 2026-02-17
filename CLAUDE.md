# CLAUDE.md — Site Update Pass

## Context
Medicaid Money Tracker — data journalism site with ~12K pages. Next.js 14, TypeScript, Tailwind, dark theme.

## YOUR TASK: Data quality + fraud methodology + UI fixes

### NEW DATA FILES (use these to replace/supplement existing):

- `code-benchmarks.json` — National benchmarks for 9,578 HCPCS codes: avg/median cost per claim, p10/p25/p75/p90/p95/p99 deciles, min/max, stddev
- `state-code-benchmarks.json` — State-level benchmarks for top 200 codes
- `smart-watchlist.json` — 880 providers flagged by SMARTER fraud tests (replaces old watchlist as primary):
  - `code_specific_outlier` — billing >3x the MEDIAN for that specific code (not overall median)
  - `billing_swing` — >200% year-over-year change AND >$1M absolute change
  - `massive_new_entrant` — first appeared 2022+ and already billing >$5M
  - `rate_outlier_multi_code` — billing above p90 for multiple codes simultaneously
- `fraud-code-outliers.json`, `fraud-billing-swings.json`, `fraud-new-entrants.json`, `fraud-rate-outliers.json` — Individual test results
- Provider detail files now include enriched procedure data: `providerCpc`, `nationalAvgCpc`, `nationalMedianCpc`, `p90`, `p99`, `cpcRatio`, `decile`

### ALL names and cities have been cleaned to Title Case (no more ALL CAPS)

### CHANGES NEEDED:

**1. Provider pages — Show code-level benchmarks**
For each procedure in a provider's breakdown, show:
- Provider's cost/claim for this code
- National median cost/claim for this code  
- National average cost/claim
- A visual indicator: "Normal range", "Top 25%", "Top 10%", "Top 5%", "Top 1%" (use `decile` field)
- The ratio vs median (use `cpcRatio` field) — e.g., "2.3x median"
- Color code: green for normal, yellow for top 25%, orange for top 10%, red for top 5%/1%

**2. Watchlist — Use smart-watchlist.json as PRIMARY**
- Replace or merge with the old watchlist
- Show the new flag types with human-readable names:
  - `code_specific_outlier` → "Code-Specific Cost Outlier — Billing over 3× the national median for specific procedure codes"
  - `billing_swing` → "Major Billing Swing — Experienced over 200% change in year-over-year billing"
  - `massive_new_entrant` → "Massive New Entrant — Started billing recently but already receiving millions"
  - `rate_outlier_multi_code` → "Multi-Code Rate Outlier — Billing above the 90th percentile across multiple procedure codes"
- Keep old flags too but translate them all to human-readable
- Show flag details: for code_specific_outlier show which code, what ratio; for billing_swing show the years and amounts; etc.

**3. Fraud flags on provider pages — MUCH better explanations**
Instead of showing `outlier_spending|unusual_cost_per_claim`, show:
- Each flag as a card with: icon, human-readable title, 1-sentence explanation, and the actual data that triggered it
- Example: "Code-Specific Cost Outlier: This provider bills $45.20 per claim for T2016, which is 3.2× the national median of $14.12. This puts them in the top 5% of all providers billing this code."
- Context matters: note that T2016 is per diem residential care, so dividing by ~30 days brings it close to average (this kind of context from HCPCS_CODES.md)

**4. Procedure pages — Add benchmark data**
- For each procedure code page, show: national avg cost/claim, median, p10-p90 range
- Show distribution info: "50% of providers bill between $X and $Y for this code"
- Load from `code-benchmarks.json`

**5. Analysis/methodology page — Update to reflect new approach**
- We now use CODE-SPECIFIC comparisons (not overall median)
- Explain the 4 new smart tests clearly
- Mention decile analysis
- Keep caveats: government entities may legitimately bill high, per diem codes should account for daily rates, etc.
- Note about home care programs (Public Partnerships, Consumer Direct) — legitimate programs that manage self-directed care, but fraud-prone category

**6. Fix missing provider pages**
Some NPIs show "Provider Not Found" — for ANY NPI that has data in the parquet but isn't in our top 1000, the page should show a message like: "This provider ranks outside our top 1,000 by total spending. We have limited detail data available." with whatever stats we can pull from the top-providers lists. Don't show a broken "Not Found" page.

**7. Sample the site and fix issues**
After making changes, spot-check at least 10 pages:
- Homepage
- /watchlist (verify new flags show properly)
- /providers/1417262056 (Public Partnerships — should show code benchmarks)
- /providers/1699703827 (LA County Mental Health)
- /states/NY
- /states/CA
- /procedures/T2016 (should show benchmark distribution)
- /procedures/T1019
- /insights/covid-vaccines
- /analysis

Fix anything that looks wrong, broken, or confusing. Do multiple passes.

**8. Run `npm run build` when done — must pass clean**

When finished, run:
openclaw system event --text "Done: Smart fraud analysis, code benchmarks, cleaned data, UI fixes complete" --mode now
