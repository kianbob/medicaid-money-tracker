# CLAUDE.md - Medicaid Money Tracker

## Project
Data journalism website analyzing $1.09T in Medicaid provider spending (227M records, 2018-2024).
Next.js 14, TypeScript, Tailwind CSS, dark theme. Deployed at medicaid-money-tracker.vercel.app

## YOUR TASK: Major site overhaul

This is a comprehensive improvement pass. Work through EVERY section below. Be thorough and iterative — after making changes, review the result and fix anything that doesn't look right.

### NEW DATA AVAILABLE
These new JSON files are in `public/data/`. Use them to build new pages and features:

- `top-providers-1000.json` — Top 1000 providers (was only 50) with computed fields: costPerClaim, costPerBene, claimsPerBene, flags, flagCount
- `all-procedures.json` — ALL 10,881 procedure codes (was only 50). Has: code, totalPaid, totalClaims, providerCount, totalBenes
- `states-summary.json` — Per-state totals for top providers (state, total_payments, provider_count, etc.)
- `states/[STATE].json` — 50 state detail files with: summary, top_providers, top_procedures, yearly_trends
- `expanded-watchlist.json` — 788 flagged providers from 9 fraud tests (was 112 from 4 tests). Each has: npi, flag_count, flags array, flag_details
- `fraud-explosive-growth.json` — Providers with >500% YoY growth
- `fraud-instant-volume.json` — New providers billing >$1M in first year
- `fraud-procedure-concentration.json` — Providers billing only 1-2 codes at high volume
- `fraud-billing-consistency.json` — Suspiciously consistent monthly billing (CV < 0.1)
- `fraud-beneficiary-stuffing-extreme.json` — >100 claims per beneficiary
- `yearly-trends.json` — Overall yearly spending trends
- Provider detail files: `providers/[NPI].json` — now 1034 files (was 137), each with: monthly trends, procedures, computed fields, growth rate, merged flags

### 1. UI OVERHAUL — Make it unique and best-in-class

Research what sites like ProPublica, The Markup, OpenSecrets, FiveThirtyEight look like. Our site should feel like professional data journalism — NOT a generic dashboard.

Design goals:
- **Distinctive visual identity** — not cookie-cutter. Think editorial design meets data viz.
- **Data storytelling** — lead with narratives, not just tables
- **Visual hierarchy** — clear information architecture, readers know where to look
- **Micro-interactions** — subtle hover effects, smooth transitions, engaging without being distracting
- **Cards and sections** with clear boundaries and breathing room
- **Color system** — use color meaningfully (red for high risk, amber for moderate, green for low). Don't just use random colors.
- **Typography** — clear hierarchy. Large bold headlines, readable body text, monospace for numbers/codes
- **Mobile-first** — must look great on phones. Hamburger nav, responsive tables that become cards on mobile
- **Dark theme** — keep the dark theme but make it sophisticated, not just "dark background with white text"

### 2. FIX FRAUD RISK DISPLAY — Make flags human-readable

Currently shows things like `outlier_spending|unusual_cost_per_claim` which means nothing to users.

Replace ALL flag codes with human-readable explanations:
- `outlier_spending` → "Unusually High Spending — This provider's total payments are significantly above the median for their specialty"
- `unusual_cost_per_claim` → "High Cost Per Claim — Average payment per claim is much higher than peers"
- `beneficiary_stuffing` → "High Claims Per Patient — Filing an unusually high number of claims per beneficiary"
- `spending_spike` → "Spending Spike — Experienced a dramatic increase in billing over a short period"
- `explosive_growth` → "Explosive Growth — Billing increased over 500% year-over-year"
- `instant_high_volume` → "Instant High Volume — New provider billing over $1M in their first year"
- `procedure_concentration` → "Single-Code Billing — Billing almost exclusively for 1-2 procedure codes despite high volume"
- `billing_consistency` → "Suspiciously Consistent — Monthly billing amounts show almost no natural variation"
- `extreme_beneficiary_stuffing` → "Extreme Claims Per Patient — Filing over 100 claims per beneficiary"

Show each flag as a card/badge with icon, title, short explanation, and the actual data that triggered it.

Risk levels should be:
- 🔴 CRITICAL: 3+ flags
- 🟠 HIGH: 2 flags  
- 🟡 MODERATE: 1 flag

### 3. NEW PAGES TO BUILD

**State Pages** (`/states` index + `/states/[code]` detail):
- Index: US map or ranked list of all 50 states by spending
- Detail: State summary stats, top providers in that state, top procedures, yearly spending trend chart, link to provider details
- Use data from `states-summary.json` and `states/[STATE].json`

**Procedure Pages — Fix "Not Found" issue**:
- Currently only top 50 procedures have pages. Use `all-procedures.json` (10,881 codes) so EVERY procedure code has a page
- For procedure detail pages: show stats, top providers using that code, spending trends
- Since we don't have per-procedure provider breakdowns for all 10K codes in separate files, the procedure detail pages for codes outside the top 50 can show the summary stats from all-procedures.json

**Provider Directory** — expand from 50 to 1000:
- Use `top-providers-1000.json`
- Add filtering by state, specialty, flag status
- Add search functionality
- Pagination or virtual scrolling for 1000 providers

**Fraud Analysis Pages** (`/analysis` or `/fraud`):
- Overview page explaining all 9 fraud tests with methodology
- Sub-pages for each fraud test showing flagged providers
- Comparison: our approach vs competitors (we now use 9 tests, up from 4)
- The OIG cross-reference finding prominently featured

**Trends Page** (`/trends`):
- Year-over-year spending trends using `yearly-trends.json`
- Growth charts, provider count over time
- Which specialties/procedures are growing fastest

### 4. SEO — Comprehensive keyword optimization

Target these keyword clusters:
- "medicaid spending data" / "medicaid provider spending" / "medicaid billing data"
- "medicaid fraud detection" / "medicaid fraud analysis" / "medicaid waste"
- "HHS DOGE medicaid data" / "DOGE medicaid" / "HHS open data"
- "[state] medicaid spending" (50 variations)
- "medicaid provider lookup" / "NPI medicaid billing"
- "[procedure code] medicaid" (for each procedure)
- "medicaid spending by state" / "medicaid spending trends"
- "medicaid fraud watchlist" / "suspicious medicaid providers"

Implementation:
- Unique, keyword-rich title and meta description for EVERY page
- JSON-LD: Dataset, Organization, WebSite, BreadcrumbList schemas
- Open Graph + Twitter Card tags on every page
- Internal linking strategy (link between related providers, states, procedures)
- Breadcrumb navigation on all pages
- XML sitemap generation (important with 1000+ pages!)
- robots.txt
- Semantic HTML (article, section, nav, header, footer, aside)
- FAQ schema on methodology/about page
- Add a `sitemap.xml` page or use next-sitemap

### 5. QUALITY ASSURANCE

After making all changes:
1. Run `npm run build` — fix ANY errors
2. Spot-check these pages manually (read the generated HTML):
   - Homepage
   - A provider detail page (e.g., /providers/1417262056)
   - A state page
   - A procedure page for a code that was previously "not found"
   - The watchlist
   - The about/methodology page
3. Verify all internal links work
4. Check that flag descriptions are human-readable everywhere
5. Verify mobile nav works
6. Make sure data loads correctly on state pages
7. Check that search works

### 6. IMPORTANT CONSTRAINTS

- Keep it a static site — all data from JSON files in public/data/
- Don't touch Python scripts in `scripts/`
- Don't add backend/API
- Don't add analytics/tracking
- Dark theme always
- Run `npm run build` when completely done to verify
- Reference `reference-data/COMPETITIVE_RESEARCH.md` for competitor context
- Reference `reference-data/HCPCS_CODES.md` for procedure code descriptions

When completely finished, run:
openclaw system event --text "Done: Major site overhaul complete — new state pages, 1000 providers, 10K procedures, UI redesign, expanded fraud analysis, SEO" --mode now
