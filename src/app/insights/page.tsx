import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights — Data Stories from $1.09 Trillion in Medicaid Spending",
  description: "Deep-dive investigations into Medicaid spending data: COVID vaccine billing, pandemic profiteers, the most expensive procedures, and more. Built from 227 million HHS records.",
  openGraph: {
    title: "Insights — Medicaid Money Tracker",
    description: "Deep-dive investigations into $1.09 trillion in Medicaid spending. COVID billing, pandemic profiteers, the most expensive procedures, and more.",
  },
};

const insights = [
  {
    slug: "covid-vaccines",
    title: "Who Got Paid the Most to Give COVID Vaccines?",
    teaser: "Tribal hospitals dominate the top of the list. Shiprock Hospital in New Mexico billed $11.8M alone.",
    stat: "$280M+",
    statLabel: "total vaccine spending",
    color: "from-blue-500 to-cyan-500",
    accent: "text-cyan-400",
    icon: "💉",
  },
  {
    slug: "covid-testing",
    title: "The $4.7 Billion COVID Testing Bonanza",
    teaser: "A single test code billed $3.9 billion. One New Jersey lab — Infinity Diagnostics — billed $129M.",
    stat: "$4.7B",
    statLabel: "testing spending",
    color: "from-emerald-500 to-teal-500",
    accent: "text-emerald-400",
    icon: "🧪",
  },
  {
    slug: "pandemic-profiteers",
    title: "Who Made the Most Money During COVID?",
    teaser: "The City of Chicago went from $23M to $240M — a 942% increase. What were they billing for?",
    stat: "+942%",
    statLabel: "biggest jump",
    color: "from-red-500 to-orange-500",
    accent: "text-red-400",
    icon: "📈",
  },
  {
    slug: "most-expensive",
    title: "The Most Expensive Things Medicaid Pays For",
    teaser: "One procedure costs $92,158 per claim. It's a drug for spinal muscular atrophy.",
    stat: "$92,158",
    statLabel: "per claim",
    color: "from-amber-500 to-yellow-500",
    accent: "text-amber-400",
    icon: "💰",
  },
  {
    slug: "fastest-growing",
    title: "The Procedures Growing Fastest in Medicaid",
    teaser: "One code grew 8,935% in five years. ABA therapy for autism grew 1,500%+, connecting to Minnesota fraud.",
    stat: "8,935%",
    statLabel: "growth",
    color: "from-purple-500 to-pink-500",
    accent: "text-purple-400",
    icon: "🚀",
  },
  {
    slug: "top-doctors",
    title: "The Highest-Paid Individual Medicaid Providers",
    teaser: "Only 2 individual people — not organizations — appear in the top 2,000 billers. One is a psychologist in Wisconsin.",
    stat: "$77.3M",
    statLabel: "top individual",
    color: "from-indigo-500 to-blue-500",
    accent: "text-indigo-400",
    icon: "👤",
  },
  {
    slug: "specialty-breakdown",
    title: "Where Does $1 Trillion in Medicaid Money Actually Go?",
    teaser: "264 home health providers received $71B. Just 15 'Supports Brokerage' providers got $10.8B — averaging $720M each.",
    stat: "$720M",
    statLabel: "avg per provider",
    color: "from-teal-500 to-green-500",
    accent: "text-teal-400",
    icon: "🏥",
  },
  {
    slug: "billing-networks",
    title: "The Hidden Billing Networks of Medicaid",
    teaser: "65% of all claims have a different billing NPI than servicing NPI. Cleveland Clinic bills for 5,745 providers. 174,774 'ghost billers' never provide services.",
    stat: "65%",
    statLabel: "via intermediary",
    color: "from-violet-500 to-purple-500",
    accent: "text-violet-400",
    icon: "🕸️",
  },
  {
    slug: "dual-billing",
    title: "The Dual-Billing Pattern: When Claim Counts Match Too Perfectly",
    teaser: "Mass DDS bills T2016 and T2023 with 82,639 vs 82,963 claims — 0.4% difference, $958M total. This pattern appears in confirmed fraud cases.",
    stat: "0.01%",
    statLabel: "closest match",
    color: "from-orange-500 to-red-500",
    accent: "text-orange-400",
    icon: "🔀",
  },
  {
    slug: "smooth-billers",
    title: "The Providers Who Bill Exactly the Same Amount Every Month",
    teaser: "14 providers billing $100K+/month maintain less than 5% variation for years. Normal practices vary 15-40%. These are under 5%.",
    stat: "CV=0.03",
    statLabel: "smoothest biller",
    color: "from-cyan-500 to-blue-500",
    accent: "text-cyan-400",
    icon: "📊",
  },
];

export default function InsightsIndex() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/8 via-blue-600/4 to-dark-900" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-dark-700/80 border border-dark-500 rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Data Journalism &middot; 227M Records Analyzed
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.08]">
            Insights
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
            Deep-dive investigations into $1.09 trillion in Medicaid spending.
            Each story is built from 227 million billing records released by HHS.
          </p>
        </div>
      </section>

      {/* Insight Cards Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          {insights.map((insight) => (
            <Link
              key={insight.slug}
              href={`/insights/${insight.slug}`}
              className="group relative bg-dark-800 border border-dark-500/50 rounded-2xl overflow-hidden hover:border-dark-400 transition-all hover:-translate-y-0.5"
            >
              {/* Gradient accent bar */}
              <div className={`h-1 bg-gradient-to-r ${insight.color}`} />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl" role="img" aria-hidden="true">{insight.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2">
                      {insight.title}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      {insight.teaser}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-extrabold tabular-nums ${insight.accent}`}>{insight.stat}</span>
                      <span className="text-xs text-slate-600 uppercase tracking-wider">{insight.statLabel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                  Read the full investigation
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
