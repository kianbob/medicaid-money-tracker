# CLAUDE.md - Project Instructions

## Project: Medicaid Money Tracker
A data journalism website analyzing $1.09T in Medicaid provider spending (227M records, 2018-2024).
Built with Next.js 14, TypeScript, Tailwind CSS, dark theme.

## Your Task: Full Polish Pass

Read these reference files first:
- `reference-data/COMPETITIVE_RESEARCH.md` — competitor analysis, DOGE context, data sources
- `reference-data/HCPCS_CODES.md` — procedure code descriptions

Then make these improvements:

### 1. HCPCS Procedure Code Descriptions
- Currently the site just shows codes like "T2016" or "99213"
- Add human-readable descriptions everywhere codes appear
- Reference `HCPCS_CODES.md` for the top 20 codes
- Format: "T2016 — Residential Habilitation" not just "T2016"
- Update `public/data/top-procedures.json` to include descriptions
- Update procedure pages and provider detail pages

### 2. About/Methodology Page (`/about`)
- Add DOGE/HHS release context (Feb 13, 2026, DOGE tweet got 50M views)
- Explain our 4 fraud detection tests clearly for non-technical readers
- Add the OIG cross-reference finding: "We cross-referenced our flagged providers against the HHS OIG exclusion list (82,715 excluded providers). None of our flagged providers appear on this list, suggesting our analysis may be surfacing new suspicious activity not yet investigated."
- Add Minnesota autism fraud context (DOGE specifically referenced this)
- Add caveats section: statistical flags ≠ proof of fraud, state agencies may have legitimately high spending, etc.
- Credit the dataset source (opendata.hhs.gov)

### 3. Design Polish
- Make it ProPublica/OpenSecrets quality — professional data journalism
- Improve typography, spacing, visual hierarchy
- Add subtle animations/transitions where appropriate
- Ensure mobile responsiveness is excellent
- Add a mobile hamburger nav menu
- Make data tables sortable where possible
- Add visual indicators for risk levels (color-coded badges)

### 4. SEO & Meta
- Add JSON-LD structured data (Dataset, Organization schemas)
- Add proper Open Graph tags for social sharing on every page
- Add Twitter Card meta tags
- Write compelling meta descriptions for each page type
- Add canonical URLs

### 5. Homepage Improvements
- Make it more compelling — lead with the story, not just stats
- Add a "Key Findings" section highlighting the most interesting discoveries
- Add a search bar or quick navigation to provider/procedure lookup
- Show a preview of the watchlist with the most suspicious providers

### 6. Watchlist Page Improvements  
- Add filtering by state, risk level, flag type
- Improve the flag explanations
- Add the OIG finding as a banner

### 7. Provider Detail Pages
- Add HCPCS code descriptions in the procedures breakdown
- Improve the monthly trend charts
- Add context about what "normal" looks like for comparison

### 8. Accessibility
- Ensure proper heading hierarchy
- Add aria labels where needed
- Ensure sufficient color contrast
- Keyboard navigation support

## Tech Notes
- Static site — all data is in `public/data/` as JSON files
- Don't modify the Python scripts in `scripts/` — data is already generated
- Run `npm run build` when done to verify everything compiles
- Keep the dark theme consistent
- The site should work without JavaScript for basic content (progressive enhancement)

## Don't
- Don't touch the parquet file or data processing scripts
- Don't add any backend/API — keep it fully static
- Don't add any tracking/analytics code
- Don't remove existing functionality — only enhance

When completely finished, run this command to notify me:
openclaw system event --text "Done: Claude Code finished the full polish pass on Medicaid Money Tracker. Ready for build verification." --mode now
