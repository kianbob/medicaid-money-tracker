# CLAUDE.md — Render Provider Narratives

## Context
Each provider JSON file in `public/data/providers/{npi}.json` now has a `narrative` array:
```json
{
  "narrative": [
    {"title": "Provider Overview", "text": "Provider Name is a Psychiatry provider based in Miami, FL..."},
    {"title": "Key Findings", "items": ["Bills 4.2× the national median...", "90% billing concentrated..."]},
    {"title": "Important Context", "items": ["This is a government entity..."]},
    {"title": "Why This Matters", "text": "At $500M in Medicaid payments..."}
  ]
}
```

## TASK: Render narratives on provider detail pages

In `src/app/providers/[npi]/page.tsx`:

1. Read `provider.narrative` (it's an array of sections)
2. Render ABOVE the existing code breakdown table, BELOW the stats cards
3. Each section has:
   - `title` (string) — render as an h3
   - `text` (string, optional) — render as a paragraph
   - `items` (string array, optional) — render as styled bullet points
4. Style it like a professional analysis report:
   - Use a card/panel with a subtle left border (blue for overview, yellow for findings, green for context, gray for "why it matters")
   - Section titles in bold, slightly smaller than page headers
   - Items as bullet points with subtle icons (📊 for findings, ℹ️ for context)
   - Overall section titled "Analysis" with a 🔍 icon
5. If `narrative` doesn't exist or is empty, don't render anything (backward compatible)

Also make one small improvement: on the yearly trend section, add % change labels between years (e.g., "+42%" or "-15%").

Run `npm run build` when done. Fix any errors.
