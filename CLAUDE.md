# CLAUDE.md — Comprehensive Improvement Pass

## Context
Medicaid Money Tracker at medicaid-money-tracker.vercel.app. ~12K pages. Next.js 14, TypeScript, Tailwind, dark theme.

## TASK: Make every page excellent. Work through ALL items below.

### 1. HOMEPAGE IMPROVEMENTS
- The title currently shows "Medicaid Money Tracker — $1.09 Trillion in Spending, Exposed" — the browser tab title shouldn't have the tagline twice
- Add a "Latest Insights" section showing 3-4 insight article cards (link to /insights/) — currently missing from homepage
- Add a "Top States" mini-ranking showing top 5 states by spending with links
- Add a prominent search bar at the top that searches providers by name
- The yearly trend section is good but add YoY % change labels on each bar
- Add a "How We Did This" summary with link to /about and /analysis
- Make the hero section more impactful — consider a large animated counter or key stat

### 2. PROVIDER PAGES — More context & comparison
- On each provider's page, add a "How does this compare?" section:
  - "This provider ranks #X of 617K providers by total spending"
  - "That's more than X% of all Medicaid providers"
  - For flagged providers: show which specific codes triggered flags with the actual numbers
- Add "Similar Providers" section — link to 3-5 providers in same state or specialty
- Add "View all providers in [State]" link
- The monthly trend chart should label the Y-axis with dollar amounts
- For providers with growth_rate, show it prominently: "↑ 89% growth since first billing year"

### 3. WATCHLIST — Better sorting & context
- Default sort should be by flag count DESC, then total paid DESC
- Add a summary sentence at top: "These X providers collectively received $Y billion — X% of all Medicaid spending"
- For each provider card, show a 1-line summary of their top flag (not just the flag name)
- Add "Export to CSV" button so journalists can download the data
- Currently says "788 providers" but smart watchlist has 880 + merged = ~1360. Fix the count to accurately reflect the merged total.
- The header stat "Flagged Providers: 1360" on homepage but "788" on watchlist page — these need to match

### 4. STATE PAGES
- The state procedure table was showing $0 — this was just fixed (field name: `payments` not `total_payments`). Verify it works.
- Add a "flag count" to state pages — how many flagged providers are in this state?
- Add state ranking: "New York ranks #1 of 50 states in Medicaid spending (among top providers)"
- Add per-capita context if possible (or note: "Per-capita analysis requires Census data")
- Add links between states: "See also: California, Texas, Massachusetts" (top spending states)

### 5. PROCEDURE PAGES
- Add "Top Providers" section for ALL procedure pages, not just top 50. Load from the provider detail files by scanning which providers bill this code.
- Actually, for codes outside the top 50, we don't have provider breakdowns. In that case, show: "We have X providers billing this code in our dataset" (from code-benchmarks.json providerCount)
- Add "Related Procedures" — link to other codes in similar ranges or categories
- The investigation context boxes for T1019, T2016, A0427 are great — add more for popular codes like 99213, 99214 (office visits), H2015 (behavioral health)

### 6. INSIGHTS PAGES
- All insight pages should have "Share on X" buttons with pre-written tweet text
- Add estimated reading time ("3 min read")
- Add publication date ("February 16, 2026")
- COVID vaccine page — add total: "Medicaid spent $280M+ on COVID vaccines across X providers"
- COVID testing page — lead with the $4.7B headline number more prominently
- Pandemic profiteers — add a "biggest dollar increases" vs "biggest percentage increases" toggle or both sections
- Top doctors page — this is fascinating but only has 2 people. Add context about WHY almost all top billers are orgs
- Add "Key Takeaways" bullet points at the top of each insight (TL;DR for sharers)

### 7. ANALYSIS/METHODOLOGY PAGE
- This is just caveats right now — needs the actual methodology!
- Add sections for each of our 13 fraud tests with:
  - Test name and what it detects
  - Threshold used (e.g., ">3x national median for that code")
  - How many providers it flagged
  - Example of a provider it caught
- Add a "How We're Different" section comparing to competitors (we use code-specific benchmarks, 13 tests, etc.)
- Add the OIG finding prominently
- Add data source info and dataset description

### 8. ABOUT PAGE
- Should have: Who built this, why, dataset description, methodology link, DOGE/HHS context
- Add FAQ section with JSON-LD FAQ schema for SEO
- Questions: "Where does this data come from?", "What does 'flagged' mean?", "Is this proof of fraud?", "How do I report suspected fraud?", "How often is this updated?"

### 9. GLOBAL SITE IMPROVEMENTS
- Add a global search component in the header/nav that searches providers, procedures, states
- Add breadcrumbs on EVERY page (some might be missing)
- Footer should have: About, Methodology, Providers, States, Procedures, Insights, Watchlist, GitHub link
- Add a "Report an Issue" or "Feedback" link in footer
- 404 page should be helpful: "Page not found. Try searching for a provider or procedure."
- Add loading states / skeleton screens for client components
- Ensure consistent number formatting everywhere (use tabular-nums, consistent decimal places)

### 10. SEO
- Verify every page has unique title + meta description
- Add FAQ schema on about page
- Add BreadcrumbList schema on all pages with breadcrumbs
- Internal links: every provider page should link to its state page and procedure pages
- Every state page should link to its providers and back to state index
- Every procedure page should link to related providers

### 11. PERFORMANCE
- The watchlist page loads ALL 1360+ providers client-side. Add pagination (show 50, load more button)
- Provider directory: same — paginate the 1000 providers
- Make sure images (if any) have proper alt text
- Check that the sitemap includes all new pages (insights, analysis, etc.)

### Run `npm run build` when done. Fix ANY errors.

When finished, run:
openclaw system event --text "Done: Comprehensive improvement pass complete — better context, search, methodology, insights, SEO, QA fixes" --mode now
