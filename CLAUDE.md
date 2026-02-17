# CLAUDE.md — Create 3 New Unique Insight Pages

## Context
We ran 5 novel analyses nobody else has published. Data files are ready. Create insight pages for the 3 most interesting findings.

## Data Files Available
- `public/data/billing-networks.json` — Top billing networks + ghost biller stats
- `public/data/dual-billing.json` — Providers with suspiciously equal claim counts across code pairs  
- `public/data/billing-consistency.json` — Providers with suspiciously uniform monthly billing
- `public/data/code-monopolies.json` — Providers controlling 25%+ of a code's total spending
- `public/data/code-migrations.json` — Providers who changed primary billing code

## TASK: Create 3 new insight pages

### Page 1: `/insights/billing-networks` — "The Hidden Billing Networks of Medicaid"
Data: `billing-networks.json`

Story angle: 65% of all 227M Medicaid billing records have a DIFFERENT billing NPI than servicing NPI. This means hundreds of billions flow through intermediary billing entities. Cleveland Clinic bills for 5,745 individual providers. 174,774 NPIs bill but NEVER provide services themselves — "ghost billers."

Structure:
- Hero: "65% of Medicaid Payments Flow Through Intermediary Billers"
- Key stats: 174K ghost billers, 1.18M ghost servicers, top network = 5,745 providers
- Table: Top 20 billing networks (billing NPI, # of providers they bill for, total $)
  - Load names from provider detail files if available
- "Ghost Billers" section: 174,774 NPIs that bill but never appear as service providers
- Context box: "Many billing networks are legitimate — hospitals bill for their employed physicians, management companies bill for home care aides. But the scale and opacity of these relationships creates vulnerability to fraud."
- Why unique: "This is the first public analysis of billing-vs-servicing relationships in the T-MSIS dataset."

### Page 2: `/insights/dual-billing` — "The Dual-Billing Pattern: When Claim Counts Match Too Perfectly"
Data: `dual-billing.json`

Story angle: When a provider bills two different procedure codes with nearly identical claim counts, it may indicate systematic dual-billing — billing two codes for every single service. Mass DDS bills T2016 and T2023 with 82,639 vs 82,963 claims (0.4% difference, $958M total). This exact pattern was identified in confirmed NEMT fraud cases.

Structure:
- Hero: "When Two Codes Have the Same Number of Claims, Something May Be Wrong"
- Explanation: What dual-billing means, why identical claim counts are suspicious
- Top 20 dual-billing pairs with: provider name (linked), code 1, claims 1, code 2, claims 2, % difference, combined $
- Visual: side-by-side bar chart showing the matching claim counts
- Context: "Some dual-billing is legitimate — a provider may always perform two services together. But when claim counts match within 1-3% across hundreds of thousands of claims, it suggests systematic pairing."
- Cross-reference: Note that this pattern was documented in confirmed NEMT fraud (Pedro Denga case — near-equal A0130/A0380 claims)

### Page 3: `/insights/smooth-billers` — "The Providers Who Bill Exactly the Same Amount Every Month"
Data: `billing-consistency.json`

Story angle: Real medical practices have natural variation — flu season, holidays, staff changes. But 14 providers billing $100K+/month maintain less than 5% variation over 2+ years. The smoothest biller: Senior Resources of West Michigan, CV=0.03, billing ~$379K/month for 83 months with almost no variation.

Structure:
- Hero: "14 Providers Bill Like Clockwork — Is That Normal?"
- Explanation: What coefficient of variation means in plain English. "If you billed exactly $100,000 every single month for 7 years, your CV would be 0. If some months were $80K and others $120K, your CV would be ~0.15. These providers have CVs under 0.05."
- Table: 14 smooth billers with name, CV, avg monthly $, total $, months
- Comparison: Show the most volatile billers (CV > 2.0) for contrast
- Context: "Government contracts and per-diem arrangements can produce legitimately smooth billing. But extreme uniformity in medical billing — where patient needs fluctuate by nature — deserves a closer look."

## Also:
- Add all 3 to the `/insights` index page
- Add provider name lookups where possible (check provider detail files)
- Link provider names to their detail pages where we have them
- Run `npm run build` when done
