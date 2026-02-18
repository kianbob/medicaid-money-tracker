import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Medicaid Fraud by State — Which States Have the Most Red Flags? — OpenMedicaid",
  description:
    "State-by-state breakdown of Medicaid fraud signals. See which states have the most flagged providers, highest per-capita rates, and biggest spending anomalies.",
};

const stateData = [
  { state: "New York", code: "NY", flags: 159, spending: "$64.2B", perCapita: "0.82", highlight: "Home care industry dominates. Brooklyn alone has 64 flagged providers." },
  { state: "California", code: "CA", flags: 87, spending: "$29.8B", perCapita: "0.22", highlight: "County-level mental health programs and large hospital systems." },
  { state: "Arizona", code: "AZ", flags: 71, spending: "$5.1B", perCapita: "0.97", highlight: "46 brand-new providers appeared post-pandemic. Major new-entrant cluster." },
  { state: "Massachusetts", code: "MA", flags: 52, spending: "$15.2B", perCapita: "0.75", highlight: "DDS entities billing 37-51× median for residential habilitation." },
  { state: "Illinois", code: "IL", flags: 38, spending: "$11.8B", perCapita: "0.30", highlight: "City of Chicago ambulance billing surged 942% during COVID." },
  { state: "Tennessee", code: "TN", flags: 31, spending: "$7.2B", perCapita: "0.45", highlight: "Nashville-based state disability programs with consistently high billing." },
  { state: "Vermont", code: "VT", flags: 7, spending: "$1.1B", perCapita: "1.08", highlight: "Highest per-capita fraud flag rate in the country despite small size." },
  { state: "Florida", code: "FL", flags: 29, spending: "$7.9B", perCapita: "0.13", highlight: "Large state with relatively low flag rate per capita." },
];

export default function FraudByStatePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Guides</span>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Medicaid Fraud by State</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Guide</p>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Medicaid Fraud by State
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          Which states have the most flagged providers? Where are the biggest concentrations of billing anomalies? A state-by-state breakdown.
        </p>
      </div>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">The Big Picture</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Medicaid fraud isn&apos;t evenly distributed. Our analysis of 227 million billing records flagged <span className="text-white font-semibold">1,860 providers</span> across all 50 states — but some states have dramatically higher concentrations of suspicious billing patterns than others.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="text-white font-semibold">New York</span> leads in absolute flags (159), while <span className="text-white font-semibold">Vermont</span> leads per capita (1.08 per 100K residents). <span className="text-white font-semibold">Arizona</span> stands out for its cluster of brand-new providers that appeared post-pandemic.
          </p>
        </div>
      </section>

      {/* State Cards */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">State Breakdown</h2>
        <div className="space-y-3">
          {stateData.map((s) => (
            <Link key={s.code} href={`/states/${s.code}`} className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{s.state}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${parseInt(String(s.flags)) >= 50 ? 'bg-red-500/20 text-red-400' : parseInt(String(s.flags)) >= 30 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {s.flags} flags
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.highlight}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-white">{s.spending}</p>
                  <p className="text-[10px] text-slate-500">{s.perCapita}/100K</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/states" className="text-sm text-blue-400 hover:underline">View all 50 states →</Link>
        </div>
      </section>

      {/* Key Patterns */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Key Patterns</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">New York Dominance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              New York accounts for roughly 1 in 12 flagged providers nationally. The <Link href="/insights/ny-home-care" className="text-blue-400 hover:underline">home care industry</Link> is the primary driver — Brooklyn alone has more flags than most states.
            </p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-amber-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Arizona New-Entrant Cluster</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arizona&apos;s <Link href="/insights/arizona-problem" className="text-blue-400 hover:underline">46 new providers</Link> that appeared in 2022+ represent a distinct pattern from other states — suggesting systemic gaps in provider enrollment screening.
            </p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-blue-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Small State Surprises</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vermont (1.08/100K), DC (1.03), and Maine (1.00) lead per-capita rates. Small populations mean a few flagged providers create outsized per-capita numbers. See our <Link href="/insights/geographic-hotspots" className="text-blue-400 hover:underline">geographic analysis</Link>.
            </p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-purple-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">COVID Amplification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every state saw billing increases during 2020-2023. But some — particularly Illinois and Virginia — saw specific providers with extraordinary growth that hasn&apos;t reverted.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Explore Your State</h2>
        <p className="text-sm text-slate-400 mb-5">See flagged providers, top procedures, and spending trends for any state.</p>
        <Link href="/states" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          Browse All States →
        </Link>
      </section>
    </div>
  );
}
