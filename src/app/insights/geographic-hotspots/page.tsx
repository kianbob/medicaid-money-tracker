import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, formatNumber, stateName } from "@/lib/format";
import geoData from "../../../../public/data/geographic-risk.json";

export const metadata: Metadata = {
  title: "Geographic Risk Hotspots — Where Fraud Signals Concentrate — Medicaid",
  description: "Some states have disproportionately more fraud signals per resident. Vermont, DC, and Maine lead per capita. New York leads in total flags. Analysis of 227M Medicaid billing records.",
  openGraph: {
    title: "Geographic Risk Hotspots: Where Fraud Signals Concentrate",
    description: "We normalized flagged provider counts by population to find where suspicious billing concentrates. Vermont (1.08 per 100K), DC (1.03), and Maine (1.00) lead per capita.",
  },
};

export default function GeographicHotspots() {
  const data = geoData as {
    state: string;
    flaggedCount: number;
    statFlags: number;
    mlFlags: number;
    totalSpending: number;
    population: number;
    flagsPerCapita: number;
    spendingPerCapita: number;
  }[];

  // Pre-sorted by flagsPerCapita in the JSON, but sort explicitly for safety
  const byPerCapita = [...data].sort((a, b) => b.flagsPerCapita - a.flagsPerCapita);
  const byTotalFlags = [...data].sort((a, b) => b.flaggedCount - a.flaggedCount);
  const bySpendingPerCapita = [...data].sort((a, b) => b.spendingPerCapita - a.spendingPerCapita);

  const totalFlags = data.reduce((sum, s) => sum + s.flaggedCount, 0);
  const totalSpending = data.reduce((sum, s) => sum + s.totalSpending, 0);

  const highestPerCapita = byPerCapita[0];
  const mostTotalFlags = byTotalFlags[0];
  const highestSpendingPerCapita = bySpendingPerCapita[0];

  const top15PerCapita = byPerCapita.slice(0, 15);
  const top15TotalFlags = byTotalFlags.slice(0, 15);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Geographic Risk Hotspots</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1 text-xs font-medium text-teal-400">Geographic Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Geographic Risk Hotspots
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Where do fraud signals concentrate? We normalized flagged provider counts by state population
          to find where suspicious billing is most dense. The results are surprising: it&apos;s not always the
          biggest states that have the most problems.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-teal-400 tabular-nums">{highestPerCapita.flagsPerCapita.toFixed(2)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Highest per 100K ({highestPerCapita.state})</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{mostTotalFlags.flaggedCount}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Most total flags ({mostTotalFlags.state})</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">${highestSpendingPerCapita.spendingPerCapita.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Highest $/capita ({highestSpendingPerCapita.state})</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{totalFlags.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Total flags nationwide</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          When people think of Medicaid fraud hotspots, they often think of large states like New York, California, or Texas.
          And in absolute numbers, they&apos;re right: <Link href="/insights/ny-home-care" className="text-blue-400 hover:text-blue-300">New York leads with {mostTotalFlags.flaggedCount} flagged providers</Link>,
          followed by California ({byTotalFlags[1].flaggedCount}) and Arizona ({byTotalFlags.find(s => s.state === 'AZ')?.flaggedCount}).
          But raw counts obscure a more revealing picture.
        </p>

        <div className="bg-dark-800 border-l-4 border-teal-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Small states, high rates</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            When we normalize by population, <span className="text-teal-400 font-semibold">Vermont</span> leads
            with {highestPerCapita.flagsPerCapita.toFixed(2)} flagged providers per 100,000 residents &mdash;
            nearly <span className="text-white font-semibold">2&times;</span> the rate of New York.
            The <span className="text-teal-400 font-semibold">District of Columbia</span> ({byPerCapita[1].flagsPerCapita.toFixed(2)})
            and <span className="text-teal-400 font-semibold">Maine</span> ({byPerCapita[2].flagsPerCapita.toFixed(2)}) round out the top three.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Arizona stands out as a large-population state with an unusually high per-capita rate
          of {byPerCapita.find(s => s.state === 'AZ')?.flagsPerCapita.toFixed(2)} per 100K &mdash; driven by the influx of{' '}
          <Link href="/insights/arizona-problem" className="text-blue-400 hover:text-blue-300">new behavioral health clinics billing massive amounts</Link>.
          With {byPerCapita.find(s => s.state === 'AZ')?.flaggedCount} flagged providers across 7.4M residents,
          Arizona&apos;s rate is nearly 4&times; that of similarly-sized states like Ohio ({byPerCapita.find(s => s.state === 'OH')?.flagsPerCapita.toFixed(2)}) and Pennsylvania ({byPerCapita.find(s => s.state === 'PA')?.flagsPerCapita.toFixed(2)}).
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Spending doesn&apos;t always correlate with flags</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Massachusetts spends the most per capita at <span className="text-amber-400 font-semibold">${highestSpendingPerCapita.spendingPerCapita.toLocaleString()}/person</span>,
            but ranks only 9th in flags per capita ({byPerCapita.find(s => s.state === 'MA')?.flagsPerCapita.toFixed(2)}).
            Meanwhile, Nevada has a high flag rate ({byPerCapita.find(s => s.state === 'NV')?.flagsPerCapita.toFixed(2)}) despite
            relatively low Medicaid spending ($302/person). This suggests that flag rates reflect billing behavior patterns,
            not just spending volume.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Another striking pattern: Nevada gets {byPerCapita.find(s => s.state === 'NV')?.mlFlags} of
          its {byPerCapita.find(s => s.state === 'NV')?.flaggedCount} flags from the ML model rather
          than statistical tests &mdash; the highest ML-to-statistical ratio of any state. Maryland is
          similar, with {byPerCapita.find(s => s.state === 'MD')?.mlFlags} ML flags
          vs {byPerCapita.find(s => s.state === 'MD')?.statFlags} statistical flags. This may indicate
          different types of anomalies in these states &mdash; patterns that traditional rule-based
          tests miss but machine learning picks up.
        </p>
      </div>

      {/* Table 1: Top 15 by Flags Per 100K */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-teal-500 rounded-full" />
          Top 15 States by Flags Per 100K Population
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">State</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Flags/100K</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Flagged</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Spending/Capita</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Population</th>
              </tr>
            </thead>
            <tbody>
              {top15PerCapita.map((s, i) => (
                <tr key={s.state} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="State" className="py-2.5 pr-3">
                    <Link href={`/states/${s.state}`} className="text-slate-300 hover:text-teal-400 transition-colors font-medium">
                      {stateName(s.state)}
                    </Link>
                  </td>
                  <td data-label="Flags/100K" className="py-2.5 pr-3 text-right text-teal-400 font-bold tabular-nums">
                    {s.flagsPerCapita.toFixed(2)}
                  </td>
                  <td data-label="Flagged" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{s.flaggedCount}</td>
                  <td data-label="Spending/Capita" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">${s.spendingPerCapita.toLocaleString()}</td>
                  <td data-label="Population" className="py-2.5 text-right text-slate-500 tabular-nums">{s.population.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Top 15 by Total Flag Count */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          Top 15 States by Total Flag Count
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">State</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Flagged</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Statistical</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">ML</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Spending</th>
              </tr>
            </thead>
            <tbody>
              {top15TotalFlags.map((s, i) => (
                <tr key={s.state} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="State" className="py-2.5 pr-3">
                    <Link href={`/states/${s.state}`} className="text-slate-300 hover:text-red-400 transition-colors font-medium">
                      {stateName(s.state)}
                    </Link>
                  </td>
                  <td data-label="Flagged" className="py-2.5 pr-3 text-right text-red-400 font-bold tabular-nums">{s.flaggedCount}</td>
                  <td data-label="Statistical" className="py-2.5 pr-3 text-right text-slate-300 tabular-nums">{s.statFlags}</td>
                  <td data-label="ML" className="py-2.5 pr-3 text-right text-purple-400 tabular-nums">{s.mlFlags}</td>
                  <td data-label="Total Spending" className="py-2.5 text-right text-white font-semibold tabular-nums">{formatMoney(s.totalSpending)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Caveat */}
      <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5 mb-12">
        <p className="text-white font-semibold mb-1">Important caveat: Small-state bias</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Per-capita rates can be misleading for small states. Vermont&apos;s 7 flagged providers
          in a population of 647K is enough to top the rankings, while Georgia&apos;s 4 flags across
          11M residents push it to the bottom. A single fraudulent provider in Wyoming would
          give it a rate of 0.17 per 100K. Higher detection may also reflect better state-level
          reporting and audit systems rather than more actual fraud. These rankings should be
          read as starting points for investigation, not conclusions.
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-0.5">&#9656;</span>
            <span><span className="text-teal-400 font-semibold">Vermont, DC, and Maine</span> have the highest fraud flag rates per capita, despite being among the smallest states in the dataset.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span><span className="text-red-400 font-semibold">New York leads in total flags ({mostTotalFlags.flaggedCount})</span>, driven heavily by its massive home care industry &mdash; {mostTotalFlags.statFlags} from statistical tests alone.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">&#9656;</span>
            <span><span className="text-orange-400 font-semibold">Arizona (0.96 per 100K)</span> is notable as a large state with a high per-capita rate, fueled by rapid new-entrant clinics in Phoenix.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span><span className="text-amber-400 font-semibold">Spending per capita doesn&apos;t predict flags.</span> Massachusetts spends ${highestSpendingPerCapita.spendingPerCapita.toLocaleString()}/person but ranks below smaller states in flag density.</span>
          </li>
        </ul>
      </div>

      {/* Footer + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Vermont has the highest Medicaid fraud flag rate per capita (1.08/100K). NY leads in total flags (114). Where do fraud signals really concentrate?")}&url=${encodeURIComponent("https://openmedicaid.org/insights/geographic-hotspots")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="geographic-hotspots" relatedSlugs={["city-hotspots", "arizona-problem", "ny-home-care"]} />
      </div>
    </article>
  );
}
