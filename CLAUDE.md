# CLAUDE.md — Second Improvement Pass (Methodology & Depth)

## Context  
Medicaid Money Tracker. Next.js 14, TypeScript, Tailwind, dark theme. ~12K pages.
A competitor report uses ML (logistic regression, AUC 0.883, 19 features) to identify fraud targets.
We need to improve our methodology page and fraud analysis to be MORE credible than theirs.

## TASK: Make methodology + fraud analysis world-class

### 1. ANALYSIS/METHODOLOGY PAGE (`/analysis`)
This is the most important page for credibility. Currently it just has caveats. 
Rewrite it completely with these sections:

**a) "Our Approach"** — Overview paragraph explaining we analyze 227M claims across 617K providers
**b) "13 Statistical Tests"** — For each test:
  - Name and plain-English description
  - What it catches (with example)
  - Threshold used
  Group them into categories:
  - Spending Outliers: outlier_spending, unusual_cost_per_claim
  - Volume Anomalies: beneficiary_stuffing, impossible_volume  
  - Pattern Analysis: procedure_concentration, billing_consistency, billing_swing
  - Growth Signals: explosive_growth, instant_high_volume, massive_new_entrant
  - Code-Specific: code_specific_outlier, rate_outlier_multi_code
  - Cross-Reference: oig_exclusion_check
  
**c) "What This Is NOT"** — Clear disclaimer (statistical flags ≠ fraud accusations)
**d) "Known Limitations"** — Be transparent:
  - We only see aggregate billing, not individual claims
  - Government entities/fiscal intermediaries look anomalous but are often legitimate
  - Per diem codes have different economics than per-service codes
  - No web validation or OSINT on flagged providers (yet)
  - LEIE labels lag 1-5 years behind actual fraud
  - T-MSIS captures Medicaid only, not Medicare/private
**e) "Data Source"** — CMS T-MSIS dataset, 2018-2024, what columns we have and don't have
**f) "How We Compare"** — Brief section noting our unique strengths:
  - Code-specific benchmarks (compare each provider to median for THAT code, not overall)
  - Full decile distributions (p10 through p99)
  - 13 independent statistical tests
  - Interactive exploration of 12,000+ pages
  - Open and free (vs paywalled academic papers or static PDFs)

### 2. ABOUT PAGE (`/about`)  
Add FAQ with proper schema markup:
- "Where does this data come from?"
- "What does 'flagged' mean?"  
- "Is this proof of fraud?"
- "How often is this updated?"
- "How can I report suspected fraud?" (link to OIG hotline 1-800-HHS-TIPS)
- "Why are government entities on the watchlist?"
- "What is T-MSIS?"

### 3. PROVIDER PAGES — More analytical depth
On each provider's detail page (`/providers/[npi]/page.tsx`):
- Add a "Risk Assessment" card that explains in plain English WHY this provider is flagged
  (not just flag names — full sentences like "This provider bills 4.2× the national median for code H2017")
- For each code in their breakdown: show whether their cost/claim is above p90, p99, or below median
  with color coding (green = below median, yellow = above p75, orange = above p90, red = above p99)
- Add "Active Billing Period" showing first month → last month, and if billing stopped abruptly, note it
- If provider only has 1-2 codes, note "Extreme procedure concentration — 98% of billing through a single code"

### 4. WATCHLIST — Better narrative
- Each entry should have a 1-line "Why flagged" summary generated from their flags
  Example: "Individual provider billing $48.7M through PCA codes with 100% self-referral"
- Add filter chips: "All", "Critical", "High", "Moderate" risk levels
- Add sort options: by risk level, by total paid, by flag count, by cost/claim ratio

### 5. HOMEPAGE — Add credibility signals
- Change "1,360 Flagged Providers" to also show "across 13 statistical tests"
- Add a "Featured Investigation" card highlighting one interesting finding
- Add "Methodology" to the nav bar (currently missing)

### Run `npm run build` when done. Fix ALL errors.
