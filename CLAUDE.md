# CLAUDE.md — QA Fix Pass + Improvements

## Bug Fixes Required

### 1. ML Analysis page title
The page title in the browser tab shows "Medicaid Money Tracker — $1.09 Trillion..." instead of "ML Analysis — Medicaid Money Tracker". Fix the metadata/title in `src/app/ml-analysis/page.tsx`.

### 2. Watchlist: no provider names showing
The watchlist entries (fetched from smart-watchlist.json and expanded-watchlist.json) link to provider pages. But the watchlist itself seems to only show 50 entries. Add pagination: "Load More" button that shows 50 more each click. Also make sure the provider name, city, state are displayed (not just NPI).

### 3. State page procedure descriptions missing
On state pages like /states/NY, some procedures show no description (S5150, H2021, T2025, G9005, S9083 show blank). The procedure data in the state JSON likely has the code but no description field. Load procedure descriptions from `public/data/procedures/{code}.json` if the state data doesn't have them, or at minimum show the code itself prominently.

### 4. Provider ranking text
The provider page shows "#1 of 618K providers by spending (top 100.0%)". The "(top 100.0%)" is wrong/confusing — it should say "(top 0.0%)" since rank #1 is the top. Fix the percentile calculation: percentile = (rank / total) * 100, displayed as "top X%".

### 5. Insights pages — add "Back to all insights" link
Each insight page (covid-vaccines, covid-testing, etc.) should have a link back to a parent. Create `/insights/page.tsx` — an index page listing all 8 insight articles with title, description, and link. Add "← All Insights" breadcrumb to each insight page.

## New Features

### 6. Insights Index Page (`/insights`)
Create `src/app/insights/page.tsx`:
- Title: "Data Insights & Investigations"
- Subtitle: "Deep dives into the $1.09 trillion Medicaid dataset"
- Grid of 8 insight cards, each with:
  - Title (link to the insight page)
  - 1-line description
  - A key stat (e.g., "$4.7B in COVID testing" or "City of Chicago +942%")
- Add "Insights" to the main nav

### 7. Download CSV on watchlist
Add a "Download CSV" button on the watchlist page that generates a CSV of all flagged providers with columns: NPI, Name, City, State, Specialty, Total Paid, Total Claims, Cost Per Claim, Flag Count, Flags, Risk Level.
Use a client-side CSV generation approach (build the CSV string and create a blob download).

### 8. Provider search improvements
The search in the nav currently links to /providers. Instead, add an actual search input in the header that filters the providers list. If there's already a GlobalSearch component, make sure it's functional — it should search provider names and navigate to the result.

## Run `npm run build` when done.
