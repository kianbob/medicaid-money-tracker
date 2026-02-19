export function GET() {
  const siteUrl = 'https://openmedicaid.org';
  const pubDate = new Date('2026-02-19T12:00:00Z').toUTCString();

  const articles = [
    { slug: 'covid-vaccines', title: 'The $1.5 Billion COVID Vaccine Machine', description: 'How COVID vaccine administration became one of Medicaid\'s largest spending categories overnight.' },
    { slug: 'covid-testing', title: 'The $4.7 Billion COVID Testing Bonanza', description: 'Tracking the surge in COVID testing billing across Medicaid providers nationwide.' },
    { slug: 'pandemic-profiteers', title: 'Who Made the Most Money During COVID?', description: 'Identifying the providers who saw the biggest billing increases during the pandemic.' },
    { slug: 'most-expensive', title: 'The 50 Most Expensive Medicaid Procedures', description: 'A look at the costliest procedure codes driving Medicaid spending.' },
    { slug: 'fastest-growing', title: 'The Fastest-Growing Medicaid Spending Categories', description: 'Which procedure categories saw the steepest spending increases from 2018 to 2024.' },
    { slug: 'top-doctors', title: 'Where Are the Doctors? Individual vs Organizational Billing', description: 'How organizational billing entities dominate Medicaid spending over individual physicians.' },
    { slug: 'specialty-breakdown', title: 'Specialty Spending Breakdown: Where $1 Trillion Goes', description: 'Breaking down Medicaid spending by provider specialty across 617,000+ providers.' },
    { slug: 'arizona-problem', title: 'The Arizona Problem: New Clinics, Massive Billing', description: 'Why Arizona stands out for new provider entities billing millions immediately.' },
    { slug: 'ny-home-care', title: 'The New York Home Care Machine', description: 'New York\'s home care spending dwarfs every other state — here\'s the data.' },
    { slug: 'specialty-drugs', title: 'Medicaid\'s Most Expensive Drugs', description: 'The specialty drugs costing Medicaid billions per year.' },
    { slug: 'most-patients', title: 'Most Patients: Who Bills for the Most Beneficiaries', description: 'Which providers serve — or bill for — the most Medicaid beneficiaries.' },
    { slug: 'impossible-volume', title: 'Impossible Billing Volume: 50+ Claims Per Day', description: 'Providers submitting humanly impossible numbers of daily claims.' },
    { slug: 'benford-analysis', title: "When the Numbers Don't Add Up: Benford's Law", description: 'Applying Benford\'s Law to detect anomalous billing digit patterns.' },
    { slug: 'change-points', title: 'Billing Behavior Shifts: When Providers Suddenly Change', description: 'Detecting abrupt changes in provider billing patterns over time.' },
    { slug: 'billing-similarity', title: 'Copycat Billers: Nearly Identical Patterns', description: 'Finding providers with suspiciously similar billing profiles.' },
    { slug: 'highest-confidence', title: 'Multi-Method Detection: Highest Confidence Flags', description: 'Providers flagged by multiple independent detection methods simultaneously.' },
    { slug: 'geographic-hotspots', title: 'Geographic Risk Hotspots', description: 'Mapping the states and regions with the highest concentrations of flagged providers.' },
    { slug: 'billing-networks', title: 'The Middlemen: Who Bills on Behalf of Others?', description: 'Examining billing intermediaries and organizational billing patterns.' },
    { slug: 'round-numbers', title: 'Round Number Billing', description: 'Providers whose billing amounts cluster suspiciously around round numbers.' },
    { slug: 'self-billers', title: 'Solo Operators: Providers Billing $5M+ Themselves', description: 'Individual providers billing millions without organizational backing.' },
    { slug: 'spending-growth', title: 'From $109B to $199B: How Spending Nearly Doubled', description: 'Tracing Medicaid spending growth from 2018 to 2024.' },
    { slug: 'city-hotspots', title: "America's Medicaid Fraud Capitals", description: 'The cities with the highest density of statistically flagged providers.' },
    { slug: 'smooth-billers', title: 'Suspiciously Smooth Billers', description: 'Providers with unnaturally consistent billing patterns that defy normal variation.' },
    { slug: 'dual-billing', title: 'Dual Billing Patterns', description: 'Investigating providers exhibiting dual billing pattern anomalies.' },
    { slug: 'minnesota-fraud-capital', title: "Minnesota: America's Medicaid Fraud Capital", description: 'Minnesota has 4x its population share of fraud-heavy exclusions, the $250M Feeding Our Future scandal, and housing fraud so bad they shut the entire program down.' },
    { slug: 'cares-inc-exposed', title: 'Exposed: Cares Inc.', description: 'Deep dive into a flagged provider with unusual billing patterns.' },
    { slug: 'chicago-exposed', title: 'Exposed: City of Chicago', description: 'How the City of Chicago went from $23M to $240M in Medicaid billing — a 942% increase.' },
    { slug: 'srh-chn-exposed', title: 'Exposed: SRH CHN Lead Health Home', description: 'The $239M health home with 4 independent fraud flags.' },
  ];

  const items = articles
    .map(
      (a) => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/insights/${a.slug}</link>
      <description><![CDATA[${a.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${siteUrl}/insights/${a.slug}</guid>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenMedicaid — Investigations</title>
    <link>${siteUrl}</link>
    <description>Data-driven investigations into $1.09 trillion in Medicaid spending</description>
    <language>en-us</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
