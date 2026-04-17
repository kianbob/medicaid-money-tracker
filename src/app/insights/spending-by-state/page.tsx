import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import statesSummary from "../../../../public/data/states-summary.json";

export const metadata: Metadata = {
  title: "Medicaid Spending by State: Who Gets the Most Federal Dollars?",
  description: "New York receives $81.1B in Medicaid payments — more than the next two states combined. We ranked all 50 states by spending, claims, and fraud signals.",
  keywords: ["medicaid spending by state", "medicaid payments by state 2026", "medicaid state spending comparison", "which state spends most on medicaid"],
  openGraph: {
    title: "Medicaid Spending by State: Who Gets the Most Federal Dollars?",
    description: "New York receives $81.1B — more than California and Massachusetts combined. The full state-by-state breakdown of $1.09 trillion in Medicaid spending.",
  },
};

const stateNames: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia", PR: "Puerto Rico", Unknown: "Unknown/Other"
};

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${(n / 1e3).toFixed(0)}K`;
}

function fmtNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

export default function SpendingByState() {
  const data = (statesSummary as any[]).filter((s: any) => s.state !== 'Unknown');
  const totalSpending = data.reduce((s: number, d: any) => s + d.total_payments, 0);
  const totalClaims = data.reduce((s: number, d: any) => s + d.total_claims, 0);
  const top5Spending = data.slice(0, 5).reduce((s: number, d: any) => s + d.total_payments, 0);
  const top5Pct = (top5Spending / totalSpending * 100).toFixed(0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Medicaid Spending by State: Who Gets the Most Federal Dollars?",
          "description": "New York receives $81.1B in Medicaid payments — more than the next two states combined.",
          "datePublished": "2026-04-17",
          "url": "https://www.openmedicaid.org/insights/spending-by-state",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/spending-by-state" }
        }) }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Spending by State</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-400">Spending Analysis</span>
          <span className="text-xs text-slate-500">April 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">7 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Medicaid Spending by State: Who Gets the Most Federal Dollars?
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          New York receives <strong className="text-white">$81.1 billion</strong> in Medicaid payments — more than California
          and Massachusetts combined. The top 5 states account for <strong className="text-white">{top5Pct}%</strong> of
          total spending. Here&apos;s the full state-by-state breakdown of $1.09 trillion in taxpayer-funded healthcare.
        </p>
      </div>

      {/* Key stat callout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">$81.1B</div>
          <div className="text-xs text-slate-500 mt-1">New York (#1)</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">$36.8B</div>
          <div className="text-xs text-slate-500 mt-1">California (#2)</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">{data.length}</div>
          <div className="text-xs text-slate-500 mt-1">States + DC</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-purple-400">{top5Pct}%</div>
          <div className="text-xs text-slate-500 mt-1">Top 5 States&apos; Share</div>
        </div>
      </div>

      {/* Article body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">The Concentration Problem</h2>
        <p>
          Medicaid spending is wildly uneven. New York alone accounts for{" "}
          <strong className="text-white">{(data[0]?.total_payments / totalSpending * 100).toFixed(0)}%</strong> of all payments in our
          dataset — driven by the state&apos;s massive home care industry, high provider reimbursement rates, and the
          largest Medicaid enrollment in the country. Our investigation into{" "}
          <Link href="/insights/ny-home-care" className="text-blue-400 hover:text-blue-300">New York&apos;s $47 billion home care machine</Link>{" "}
          reveals why: Brooklyn alone has dozens of agencies billing $200M+ each.
        </p>
        <p>
          This concentration matters for policy. When Congress debates Medicaid cuts, the impact is not distributed
          evenly. A 10% reduction affects New York&apos;s $81 billion stream very differently than Wyoming&apos;s. States
          with large Medicaid populations and expensive provider networks absorb disproportionate cuts.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">Top 20 States by Medicaid Spending</h2>

        {/* State table */}
        <div className="overflow-x-auto my-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-600 text-left">
                <th className="py-3 pr-4 text-slate-400 font-medium">#</th>
                <th className="py-3 pr-4 text-slate-400 font-medium">State</th>
                <th className="py-3 pr-4 text-slate-400 font-medium text-right">Total Payments</th>
                <th className="py-3 pr-4 text-slate-400 font-medium text-right">Claims</th>
                <th className="py-3 pr-4 text-slate-400 font-medium text-right">Top Providers</th>
                <th className="py-3 text-slate-400 font-medium text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 20).map((state: any, i: number) => (
                <tr key={state.state} className="border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 pr-4 text-slate-500">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <Link href={`/states`} className="text-blue-400 hover:text-blue-300">
                      {stateNames[state.state] || state.state}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-white">{fmt(state.total_payments)}</td>
                  <td className="py-3 pr-4 text-right font-mono text-slate-400">{fmtNum(state.total_claims)}</td>
                  <td className="py-3 pr-4 text-right font-mono text-slate-400">{state.provider_count}</td>
                  <td className="py-3 text-right font-mono text-slate-400">{(state.total_payments / totalSpending * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">New York: The $81 Billion Outlier</h2>
        <p>
          New York&apos;s Medicaid spending is in a category of its own. At $81.1 billion, it exceeds California ($36.8B)
          despite having roughly half the population. The reason is structural: New York has the most generous Medicaid
          program in the country, with benefits that go far beyond federal minimums.
        </p>
        <p>
          The state&apos;s home care spending alone is staggering. Our analysis of{" "}
          <Link href="/insights/ny-home-care" className="text-blue-400 hover:text-blue-300">T1019 billing codes</Link> shows the
          top 100 personal care billers in New York received over $47 billion — nearly half the state&apos;s total. Brooklyn
          is the epicenter, with agencies concentrated in neighborhoods where Medicaid enrollment is highest.
        </p>
        <p>
          New York is also where potential federal cuts hit hardest. Under the{" "}
          <Link href="/insights/obbba-medicaid-cuts" className="text-blue-400 hover:text-blue-300">OBBBA&apos;s proposed FMAP reduction</Link>,
          dropping the federal match for expansion populations from 90% to 80% could shift billions to the state budget.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">The Small States, Big Spending Problem</h2>
        <p>
          Raw dollar totals don&apos;t tell the full story. On a per-capita basis, smaller states often have
          disproportionately high Medicaid spending. Massachusetts ranks #3 in total spending at $30.8 billion despite
          being the 16th largest state by population. Connecticut ($6.3B) and Vermont consistently rank high on
          per-enrollee spending.
        </p>
        <p>
          Our <Link href="/insights/geographic-hotspots" className="text-blue-400 hover:text-blue-300">geographic risk analysis</Link>{" "}
          shows this pattern extends to fraud signals too. Vermont leads the nation in fraud flags per 100,000
          residents (1.08), followed by DC (1.03) and Maine (1.00). Small states aren&apos;t immune to the waste
          problem — in some cases, they&apos;re more vulnerable because smaller oversight agencies have fewer
          resources to monitor billing patterns.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">States in Austerity Mode</h2>
        <p>
          As of April 2026, multiple states are already grappling with Medicaid budget pressures — even before the
          OBBBA&apos;s full effects take hold:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Colorado:</strong> Facing a $1.5 billion budget shortfall. The state is debating a 2% cut to Medicaid provider reimbursement rates to save $95 million.</li>
          <li><strong className="text-white">Idaho:</strong> Governor Brad Little approved $22 million in cuts to Medicaid disability services in March 2026.</li>
          <li><strong className="text-white">Arizona:</strong> Our analysis found{" "}
            <Link href="/insights/arizona-problem" className="text-blue-400 hover:text-blue-300">46 new providers</Link> that appeared in 2022+ and immediately billed $800M+ combined — raising questions about oversight.</li>
          <li><strong className="text-white">Minnesota:</strong> Facing federal pressure after CMS threatened to withhold payments over potential fraud. The state submitted a corrective action plan in March 2026.</li>
        </ul>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">What the Data Tells Us</h2>
        <p>
          The state-by-state picture reveals why one-size-fits-all Medicaid policy is so difficult. New York&apos;s
          $81 billion program has fundamentally different dynamics than Texas&apos;s $10 billion program. The fraud
          patterns in Minnesota look nothing like the spending patterns in California. Provider networks,
          reimbursement rates, enrollment policies, and oversight capacity vary enormously.
        </p>
        <p>
          What&apos;s consistent across states is that <strong className="text-white">accountability matters</strong>. Whether a state
          spends $1 billion or $80 billion, the same tools can identify anomalies: statistical outliers, impossible
          billing volumes, exclusion list violations, and sudden behavior changes. Our{" "}
          <Link href="/watchlist" className="text-blue-400 hover:text-blue-300">watchlist</Link> covers providers in every state
          — because fraud doesn&apos;t respect state lines.
        </p>
        <p>
          Explore the full data:{" "}
          <Link href="/states" className="text-blue-400 hover:text-blue-300">browse all states</Link>,{" "}
          <Link href="/compare" className="text-blue-400 hover:text-blue-300">compare states side by side</Link>, or{" "}
          <Link href="/check" className="text-blue-400 hover:text-blue-300">check any provider</Link> in any state.
        </p>
      </div>

      <RelatedInsights
        currentSlug="spending-by-state"
        relatedSlugs={["spending-growth", "ny-home-care", "geographic-hotspots", "obbba-medicaid-cuts"]}
      />
    </article>
  );
}
