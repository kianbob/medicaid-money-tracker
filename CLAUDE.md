# CLAUDE.md - Project Context for Claude Code

## Project Overview
Medicaid Money Tracker - a data journalism site analyzing $1.09T in Medicaid spending (227M billing records, 2018-2024).
Built with Next.js 14, TypeScript, Tailwind CSS, App Router. Deployed to Vercel.

## Key Files
- `src/lib/format.ts` - Shared utility functions (formatting, HCPCS descriptions, risk labels)
- `src/app/page.tsx` - Homepage
- `src/app/watchlist/page.tsx` - Fraud watchlist (1360 flagged providers)
- `src/app/ml-analysis/page.tsx` - ML fraud detection results
- `src/app/providers/page.tsx` - Top 1000 providers listing
- `src/app/providers/[npi]/page.tsx` - Individual provider detail
- `src/app/procedures/page.tsx` - Procedure codes listing
- `src/app/procedures/[code]/page.tsx` - Individual procedure detail
- `src/app/states/page.tsx` - States overview
- `src/app/states/[code]/page.tsx` - Individual state detail
- `src/app/insights/page.tsx` - Insights index
- `src/app/insights/*/page.tsx` - Individual insight articles
- `src/app/trends/page.tsx` - Spending trends
- `src/app/analysis/page.tsx` - Methodology/analysis explanation
- `src/app/layout.tsx` - Root layout with nav, footer
- `src/app/ml-analysis/layout.tsx` - ML Analysis metadata (page is "use client")
- `src/components/GlobalSearch.tsx` - Search component
- `public/data/` - All JSON data files

## Data Files Available
- `public/data/top-providers-1000.json` - Top 1000 providers by spending
- `public/data/smart-watchlist.json` - 880 flagged providers (code-specific fraud tests)
- `public/data/expanded-watchlist.json` - 788 flagged providers (original tests)
- `public/data/ml-scores.json` - ML model scores (500 top + 200 small provider flags)
- `public/data/ml-provider-names.json` - Name lookup for ML-scored providers
- `public/data/stats.json` - Overall statistics
- `public/data/code-benchmarks.json` - Per-code benchmark distributions
- `public/data/procedures-*.json` - Procedure data
- `public/data/providers/*.json` - Individual provider detail files (2,470 files)
- `public/data/code-providers/*.json` - Per-code top provider files (7,020 files)
- `public/data/states/*.json` - State-level data files

## Critical Constraints
- This Mac has 16GB shared RAM - do NOT create massive client-side JS bundles
- All listing pages use "use client" for interactive features
- Keep data imports small - use pagination, not loading everything at once
- HCPCS descriptions are in `format.ts` `hcpcsDescription()` function
- ml-analysis page is "use client" — metadata must stay in layout.tsx

## Design System
- Dark theme (bg-dark-900, bg-dark-800 cards)
- Tailwind classes: text-slate-300/400/500 for text hierarchy
- Cards: bg-dark-800 border border-dark-500/50 rounded-xl
- Risk colors: red-400 (critical), orange-400 (high), yellow-400 (moderate), green-400 (low)
- ML score colors: red-400 (>=80%), orange-400 (>=60%), yellow-400 (>=30%), green-400 (<30%)
- Font: system font stack, tabular-nums for numbers

## Current Risk System (SEPARATE - needs merging)
Statistical watchlist: 13 rule-based tests flag specific anomalies (billing swing, code outlier, etc.)
ML model: Random Forest trained on 514 OIG-excluded providers, scores 594K providers for fraud similarity.
Currently these are on SEPARATE pages (/watchlist and /ml-analysis) with no unified view.

## ML Score Data Structure
```json
{
  "topProviders": [{ "npi": "...", "mlScore": 0.898, "totalPaid": 651880, "totalClaims": 6436, "totalBeneficiaries": 1312, "codeCount": 7, "activeMonths": 19, "costPerClaim": 101.29, "selfBillingRatio": 0.0, "topCodeConcentration": 0.562, "paidPerMonth": 34309 }],
  "smallProviderFlags": [{ same structure }],
  "modelAuc": 0.7762,
  "totalProviders": 594234,
  "featuresUsed": [...],
  "scoreDistribution": { "p50": ..., "p90": ..., "p95": ..., "p99": ..., "p999": ... }
}
```

## Smart Watchlist Data Structure
```json
[{ "npi": "...", "name": "...", "specialty": "...", "city": "...", "state": "...", "totalPaid": 238967730, "flagCount": 4, "flags": ["code_specific_outlier", "billing_swing", ...], "flagDetails": { "code_specific_outlier": { ... }, ... } }]
```
