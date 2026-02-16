# Competitive Research & Context

## The Dataset
- Released Feb 13, 2026 by HHS DOGE team (@DOGE_HHS on X)
- "Today the HHS DOGE team open sourced the largest Medicaid dataset in department history"
- Contains aggregated, provider-level claims data for a specific billing code over time
- DOGE specifically mentioned it could have been used to detect "large-scale autism diagnosis fraud seen in Minnesota"
- The tweet got 50M+ views, 10K retweets, 50K likes — massive public interest
- Data source: opendata.hhs.gov

## Key Competitor: memorystack.substack.com Analysis
Author used Claude Sonnet 4.5 + Claude Code over 2 days to build 30+ fraud detection scripts with 24 statistical tests. Found $23.5B in suspicious billing.

### Their 24 Statistical Tests (grouped into 4 categories):

**Temporal Anomalies:**
1. Explosive Growth Rate (>1,000% YoY)
2. Billing Velocity Acceleration (rate of change of growth)
3. Volume Spike Analysis (3x+ vs trailing average)
4. Instant High Volume (new providers billing at max capacity immediately)
5. Year-End/Quarter-End Spikes (fraud spikes before audit periods)
6. Billing Gap Analysis (dormant then sudden high-volume = shell reactivation)

**Geographic/Population:**
7. Per-Capita Utilization Impossibility (billing vs local population)
8. Market Penetration Calculation (% of population needed as patients)
9. Beneficiary Concentration Ratio (too many services on too few patients)
10. Beneficiary Replacement Rate/Churning (rapid patient turnover)
11. Geographic Clustering (multiple flagged providers sharing addresses)
12. Small-City, Massive-Billing Detection

**Billing Pattern:**
13. Day-of-Month Concentration (61-78% claims on one day = automated billing)
14. Same-Month Billing Patterns
15. Weekend vs Weekday Anomalies
16. Monday/Friday Batch Submission
17. Claim Size Distribution (uniform = suspicious)
18. Claims Rounding Pattern (too many round numbers)

**Statistical:**
19. Unrealistic Consistency (low variance in monthly billing)
20. Statistical Outlier Analysis (Z-Scores >3 SD)
21. Payment-Per-Claim Stability (identical per-claim amounts = template billing)
22. Zero Variance Months (identical totals across months)
23. Coefficient of Variation Analysis
24. Procedure Code Concentration (billing only 1-2 codes)

### Their Key Findings:
- 6,112 providers flagged nationally, $23.5B suspicious
- Top 300 providers = $11.2B
- Focused deep-dive on California home health agencies (116 providers, $275M)
- Found 2 providers with $75.7M in "virtually certain" fraud
- Provider A: 10,948% growth in one year, $563 per capita (7.5x national avg), 61% claims on single day
- Provider B: $1,367 per capita in town of 20,000 (18.2x national avg), 78% claims on day 1

### Their Cross-Reference Sources:
- NPI Registry (npiregistry.cms.hhs.gov) — provider verification
- Census data — per-capita analysis
- Google Maps/Street View — physical location verification
- State license databases — valid license verification

## Competitor: Luke Thomas (X article, 543K views)
"I Analyzed 227 Million Rows of Medicaid Data. Here's a Tiny Sample of What I Found in Maine."
- State-focused analysis (Maine)
- Similar approach but state-specific deep dive

## Competitor: Samir Unni (Ex-Palantir Healthcare, X article, 64K views)
"I Cross-Referenced Medicaid Billing Anomalies With Senate Campaign Donations. Here's What I Found."
- Cross-referenced Medicaid fraud with political donations — VERY interesting angle
- This is the kind of unique cross-referencing that drives traffic

## Competitor: medicaid-analyzer.vercel.app
- Natural language query interface for the data ("Ask questions about Medicaid spending")
- Interactive analysis tool

## Competitor: medicaidopendata.org
- "Medicaid Open Data Explorer" — another explorer/dashboard

## Key Context: Minnesota Autism Fraud
- DOGE specifically referenced this in their announcement
- Large-scale autism diagnosis fraud in Minnesota was a known case
- Our data should be able to surface this pattern

## What Makes Our Site Different
Our site should:
1. Be the most comprehensive PUBLIC explorer (not just an analysis post)
2. Have per-provider detail pages (no one else has this as a website)
3. Include fraud methodology that's transparent and well-explained
4. Cross-reference NPI data for real provider names
5. Be an ongoing resource, not just a one-time blog post
6. Include the DOGE/HHS context in the about page

## Additional Data Sources to Cross-Reference

1. **NPI Registry** (npiregistry.cms.hhs.gov) — Full provider database (988MB), every registered healthcare provider in the US. We're already using the API for lookups. Could download the full NPPES file for bulk enrichment of all 617K providers.

2. **CMS Medicaid Provider Utilization** (data.cms.gov) — Additional Medicare/Medicaid spending data, updated quarterly. Could cross-reference providers billing both Medicare AND Medicaid suspiciously.

3. **U.S. Census Data** (census.gov) — Population by ZIP/city. Critical for per-capita analysis: "Is this provider billing more than the entire population of their town could justify?"

4. **State License Databases** — e.g., California Home Health Licenses (cdph.ca.gov). Verify flagged providers actually hold valid licenses.

5. **Google Maps / Street View** — Physical location verification. Is the provider's registered address a real healthcare facility or a residential home?

6. **OIG Exclusion List (LEIE)** — HHS Office of Inspector General maintains a list of excluded providers. Cross-reference our flagged providers against already-known bad actors.

7. **FEC Data** — Kian already has 46M+ FEC records. Cross-referencing Medicaid fraud flags with political donations (like the Samir Unni analysis) could be a unique differentiator.

## OIG Exclusion List Cross-Reference
We downloaded the OIG LEIE exclusion list (82,715 excluded providers) and cross-referenced against our 137 top/flagged providers. **ZERO matches.** This means:
- Our flagged providers are NOT on the existing exclusion list
- Our analysis is potentially surfacing NEW suspicious providers that haven't been caught
- This is a significant finding worth highlighting on the site

## Important Caveats to Include
- Statistical flags ≠ proof of fraud
- State agencies and large health systems may legitimately have high spending
- Some "anomalies" may reflect state-specific Medicaid policies
- Per-capita analysis needs local population data we don't fully have yet
- The dataset is aggregated — individual claim-level detail isn't available
