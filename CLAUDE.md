# CLAUDE.md — Wire ML Scores + Code Providers into UI

## Context
Next.js 14, TypeScript, Tailwind, dark theme. Two new data sources to integrate:

### 1. Code Provider Lists (`public/data/code-providers/{CODE}.json`)
7,020 files. Each has:
```json
{
  "code": "H2015",
  "providerCount": 4295,
  "topProviders": [
    {
      "npi": "1234567890",
      "name": "Provider Name",
      "city": "Miami",
      "state": "FL", 
      "specialty": "Behavioral Health",
      "totalPaid": 5000000,
      "claims": 50000,
      "beneficiaries": 200,
      "costPerClaim": 100.00,
      "tier": "p99",  // one of: p99, p90, p75, above_median, below_median
      "vsMedian": 4.2  // ratio vs national median
    }
  ]
}
```

### 2. ML Fraud Scores (`public/data/ml-scores.json`)
Random forest model (AUC 0.7673) trained on 514 OIG-excluded providers.
```json
{
  "modelType": "random_forest",
  "modelAuc": 0.7673,
  "totalProviders": 594234,
  "featuresUsed": [...],
  "topProviders": [200 entries with mlScore, totalPaid, etc.],
  "scoreDistribution": { "p50": 0.07, "p90": 0.41, "p95": 0.48, "p99": 0.66, "p999": 0.79 }
}
```

## TASKS

### A. Procedure Pages — Add "Top Providers" section
In `src/app/procedures/[code]/page.tsx`:
1. Try to load `code-providers/{code}.json` at build time (import from public/data)
2. Add a "Top Providers Billing This Code" section BELOW the cost distribution
3. Show a table/list of up to 20 providers with: rank, name (linked to /providers/[npi]), city/state, total paid, cost/claim, tier badge
4. Tier badges should be color coded:
   - p99 = red badge "Top 1%"
   - p90 = orange badge "Top 10%"  
   - p75 = yellow badge "Above 75th"
   - above_median = gray "Above Median"
   - below_median = green "Below Median"
5. Show "vs Median" ratio: "4.2× median" in appropriate color
6. Link each provider name to their detail page
7. At the bottom: "Showing top 20 of {providerCount} providers billing this code"

### B. ML Scores Page — New page at `/ml-analysis`
Create `src/app/ml-analysis/page.tsx`:
1. Hero section: "Machine Learning Fraud Detection"
   - "Random forest model trained on 514 confirmed-excluded providers (OIG LEIE database)"
   - "AUC: 0.77 under 5-fold cross-validation"
   - "594,234 providers scored"
2. Show feature importance as a horizontal bar chart (use the featuresUsed list with human-readable names)
3. Show score distribution (p50, p90, p95, p99, p999) as a visual
4. Show top 50 highest-scored providers as a table:
   - NPI (linked if we have a provider page), ML Score (as percentage bar), Total Paid, Codes, Self-Billing Ratio, Active Months
5. Disclaimer: "ML scores identify statistical patterns similar to known fraud cases. A high score is not evidence of fraud."
6. Add "ML Analysis" to the nav bar (under Methodology or as separate item)

### C. Provider Pages — Add ML Score
In `src/app/providers/[npi]/page.tsx`:
- Load ml-scores.json and check if this provider is in the top 200
- If yes, show an "ML Risk Score" badge with their score (0-100% scale)
- Color: green <30%, yellow 30-60%, orange 60-80%, red >80%

### D. Homepage — Update stats
- Add "ML Model AUC: 0.77" somewhere credible (maybe in the methodology teaser)

### Run `npm run build` when done. Fix ALL type errors.
