# VIRAL PAGES — Add after main overhaul

## New "Insights" / "Stories" section

Build these as editorial-style data story pages under `/insights/`. Each should have a compelling headline, narrative intro, data tables, and key takeaways. Think BuzzFeed-meets-ProPublica — shareable, surprising, backed by data.

### New JSON data files available in `public/data/`:

- `covid-vaccine-top-billers.json` — 100 providers who billed the most for COVID vaccines
- `covid-testing-top-billers.json` — 100 providers who billed the most for COVID testing
- `pandemic-billing-jumps.json` — 100 providers with biggest $ increase 2019→2021
- `top-individuals.json` — Highest-paid individual doctors (not organizations)
- `most-expensive-procedures.json` — 50 most expensive per-claim procedures
- `fastest-growing-procedures.json` — 50 procedures with highest growth 2019→2024
- `specialty-breakdown.json` — Spending by provider specialty type

### Pages to build:

**1. `/insights` — Insights index page**
- Grid of all insight articles with thumbnails/icons, headlines, teaser text
- Each links to its detail page

**2. `/insights/covid-vaccines` — "Who Got Paid the Most to Give COVID Vaccines?"**
- $280M+ total Medicaid spending on COVID vaccines
- Top billers: Shiprock Hospital NM ($11.8M), State of Indiana ($6.1M), Kaiser Permanente ($4.8M)
- Indian Health Service hospitals dominate — interesting angle about tribal healthcare infrastructure
- Table of top 100 vaccine billers with NPI links
- Note: many top billers have blank names in our NPI data — these are likely tribal/federal facilities

**3. `/insights/covid-testing` — "The $4.7 Billion COVID Testing Bonanza"**
- Code U0003 alone = $3.9 BILLION. Code 87635 went from $406 to $736M
- LabCorp ($174M), Quest ($122M), and a New Jersey lab called "Infinity Diagnostics" ($129M) were top billers
- Infinity Diagnostics billing $129M from NJ is worth highlighting — that's an extraordinary amount for a single lab
- Table of top 100 testing billers

**4. `/insights/pandemic-profiteers` — "Who Made the Most Money During COVID?"**
- City of Chicago: $23M → $240M (+942%) — what were they billing for?
- Freedom Care LLC (NY): $169M → $380M (+125%)
- Consumer Direct Care Network: $150M → $323M (+115%)
- Show before/after comparison cards
- Table of top 100 pandemic billing jumps
- Context: Some growth is legitimate (telehealth expansion, testing), some is suspicious

**5. `/insights/most-expensive` — "The Most Expensive Things Medicaid Pays For"**
- J2326: $92,158 PER CLAIM — what is this? (likely a specialty drug infusion)
- J1426: $31,833/claim, J7170: $24,069/claim
- People love knowing what things cost
- Show the top 50 with cost per claim prominently

**6. `/insights/fastest-growing` — "The Procedures Growing Fastest in Medicaid"**
- S5121 grew 8,935% ($1.8M → $166M) — what is it?
- ABA therapy codes (97151, 97154) grew 1500%+ — connects to Minnesota autism fraud
- Dental code D2740 grew 2,753% — dental coverage expansion?
- W1793 grew 5,085% ($11M → $583M)
- Add HCPCS descriptions for every code. Reference `reference-data/HCPCS_CODES.md` and the `hcpcsDescription()` function in `src/lib/format.ts`

**7. `/insights/top-doctors` — "The Highest-Paid Individual Medicaid Providers"**
- Only 2 individuals (not organizations) in the top 2000 billers
- Eric Lund, psychologist in Wisconsin: $77.3M
- Loren Cooke, van transport in New Mexico: $76.2M
- Context: Almost all top Medicaid billing is by organizations, not individual doctors
- This challenges the narrative of "rich doctors billing Medicaid" — it's actually massive organizations

**8. `/insights/specialty-breakdown` — "Where Does $1 Trillion in Medicaid Money Actually Go?"**
- Home Health: $71B (only 264 providers!)
- General Acute Care Hospitals: $35B
- Community/Behavioral Health: $31.5B
- Supports Brokerage: $10.8B from just 15 providers (!)
- Calculate spending per provider for each specialty
- Highlight: 15 "Supports Brokerage" providers received $10.8B = $720M average each

### Design notes:
- Each insight page should feel like a news article — headline, lede, data, analysis
- Add social sharing buttons (Twitter/X, copy link)
- Add "Related Insights" links at the bottom of each page
- Use the same dark theme and design system as the rest of the site
- Add these to the homepage as a "Latest Insights" section
- Add to the main nav as "Insights" dropdown or link
- Each insight should have Open Graph tags with compelling descriptions for social sharing

### SEO targets for insights:
- "medicaid covid vaccine spending"
- "who got paid for covid testing medicaid"
- "medicaid pandemic spending increase"
- "most expensive medicaid procedures"
- "fastest growing medicaid services"
- "highest paid medicaid providers"
- "medicaid spending by specialty"
