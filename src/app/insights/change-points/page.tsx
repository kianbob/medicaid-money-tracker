import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import changePointData from "../../../../public/data/change-points.json";

export const metadata: Metadata = {
  title: "Billing Behavior Shifts: When Providers Suddenly Change — Medicaid",
  description: "CUSUM change point detection identifies the exact month a provider's billing dramatically shifted. 170 providers showed 3x+ increases or decreases in monthly billing.",
  openGraph: {
    title: "Billing Behavior Shifts: When Providers Suddenly Change",
    description: "CUSUM change point detection found 170 providers whose monthly billing shifted 3x+ overnight. The biggest jump: 113x.",
  },
};

function titleCase(s: string): string {
  if (!s) return "";
  if (s === s.toUpperCase() && s.length > 3) {
    return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return s;
}

const providers = changePointData as any[];

export default function ChangePoints() {
  const increases = providers.filter((p) => p.direction === "increase");
  const decreases = providers.filter((p) => p.direction === "decrease");
  const highestRatio = Math.max(...providers.filter((p) => p.direction === "increase").map((p) => p.ratio));
  const totalSpending = providers.reduce((s: number, p: any) => s + p.totalPaid, 0);

  // Most common change year
  const yearCounts: Record<string, number> = {};
  providers.forEach((p) => {
    const year = p.changeMonth.substring(0, 4);
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  const topYear = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0];

  const top30 = providers.slice(0, 30);

  function ratioColor(ratio: number, direction: string): string {
    if (direction === "decrease") return "text-blue-400";
    if (ratio > 20) return "text-red-400";
    if (ratio > 5) return "text-orange-400";
    return "text-yellow-400";
  }

  function formatRatio(ratio: number, direction: string): string {
    if (direction === "decrease") {
      return `${(1 / ratio).toFixed(0)}x drop`;
    }
    return `${ratio.toFixed(1)}x`;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Change Points</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 text-xs font-medium text-cyan-400">Temporal Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Billing Behavior Shifts: When Providers Suddenly Change
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          CUSUM change point detection identifies the exact month a provider&apos;s billing behavior dramatically shifted.
          A 3x+ increase or decrease in monthly billing suggests a fundamental change &mdash; a new fraud scheme,
          new ownership, or legitimate expansion. We found 7,314 providers with 3x+ shifts; these {providers.length} are
          the most extreme among top billers.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 tabular-nums">{providers.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Providers with shifts</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{highestRatio.toFixed(1)}x</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Highest ratio</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{topYear[0]}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Most common year</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{formatMoney(totalSpending)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Total spending</p>
        </div>
      </div>

      {/* CUSUM Explained */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">How CUSUM Change Point Detection Works</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          CUSUM (Cumulative Sum) is a sequential analysis technique that detects shifts in a time series.
          For each provider, we analyzed their monthly billing over 7 years (2018&ndash;2024) and identified the single
          month where the cumulative deviation from the mean was greatest &mdash; the &ldquo;change point.&rdquo;
          We then compared average monthly billing before and after this point.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-yellow-400 font-bold text-lg tabular-nums">3&ndash;5x</p>
            <p className="text-xs text-slate-500 mt-1">Moderate shift. Could indicate new services, contract changes, or gradual expansion.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-orange-400 font-bold text-lg tabular-nums">5&ndash;20x</p>
            <p className="text-xs text-slate-500 mt-1">Major shift. New ownership, merger, or significant operational change likely.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-red-400 font-bold text-lg tabular-nums">20x+</p>
            <p className="text-xs text-slate-500 mt-1">Extreme shift. Often a near-zero baseline suddenly jumping to millions monthly.</p>
          </div>
        </div>
      </div>

      {/* Top 5 Featured */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          The Most Dramatic Shifts
        </h2>
        <div className="space-y-3">
          {providers.slice(0, 5).map((p: any, i: number) => (
            <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold text-sm">#{i + 1}</span>
                    <Link href={`/providers/${p.npi}`} className="text-white font-bold text-sm hover:text-cyan-400 transition-colors">
                      {titleCase(p.name)}
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">NPI: {p.npi} &middot; {p.state} &middot; Changed {p.changeMonth}</p>
                </div>
                <div className="text-right">
                  <p className={`font-extrabold text-xl tabular-nums ${ratioColor(p.ratio, p.direction)}`}>{formatRatio(p.ratio, p.direction)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">{p.direction}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                  <p className="text-slate-400 font-semibold text-sm tabular-nums">{formatMoney(p.beforeAvg)}</p>
                  <p className="text-[10px] text-slate-500">before/month</p>
                </div>
                <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                  <p className="text-white font-semibold text-sm tabular-nums">{formatMoney(p.afterAvg)}</p>
                  <p className="text-[10px] text-slate-500">after/month</p>
                </div>
                <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                  <p className="text-amber-400 font-semibold text-sm tabular-nums">{formatMoney(p.totalPaid)}</p>
                  <p className="text-[10px] text-slate-500">total paid</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          The top provider on this list went from <span className="text-white font-semibold">{formatMoney(providers[0].beforeAvg)}/month</span> to{" "}
          <span className="text-white font-semibold">{formatMoney(providers[0].afterAvg)}/month</span> in{" "}
          <span className="text-white font-semibold">{providers[0].changeMonth}</span> &mdash;
          a <span className="text-red-400 font-semibold">{providers[0].ratio.toFixed(1)}x</span> increase.
          Among these {providers.length} providers, {increases.length} show dramatic increases and {decreases.length} show
          dramatic decreases.
        </p>

        <div className="bg-dark-800 border-l-4 border-cyan-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Why {topYear[0]} Dominates</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            <span className="text-white font-semibold">{topYear[1]} of {providers.length}</span> providers had their change point
            in {topYear[0]}. This aligns with major policy shifts &mdash; pandemic-era waivers,
            telehealth expansions, and new managed care contracts all created legitimate reasons for billing to change.
            But they also created cover for providers who dramatically increased billing under less scrutiny.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Not all shifts are suspicious. Hospitals expanding services, providers joining larger networks, or
          states transitioning to managed care can all produce dramatic billing changes. The most concerning cases
          are those where a small provider suddenly begins billing millions per month with no clear operational
          explanation &mdash; especially when the change is concentrated in a single procedure code.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Important Caveat</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Billing shifts have many legitimate causes: mergers and acquisitions, new service lines, state policy
            changes, pandemic waivers, and changes in patient population. This analysis identifies the statistical
            fact that billing changed dramatically &mdash; determining <em>why</em> requires investigation. The most
            extreme ratios often involve providers that had near-zero billing before the shift, making
            even modest post-shift billing appear as a large multiple.
          </p>
        </div>
      </div>

      {/* Top 30 Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          Top 30 Most Dramatic Billing Shifts
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Change Month</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Before/Mo</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">After/Mo</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Ratio</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {top30.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-cyan-400 transition-colors">
                      {titleCase(p.name)}
                    </Link>
                    <p className="text-[10px] text-slate-600">{p.state}</p>
                  </td>
                  <td data-label="Change Month" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{p.changeMonth}</td>
                  <td data-label="Before/Mo" className="py-2.5 pr-3 text-right text-slate-500 tabular-nums">{formatMoney(p.beforeAvg)}</td>
                  <td data-label="After/Mo" className="py-2.5 pr-3 text-right text-white tabular-nums">{formatMoney(p.afterAvg)}</td>
                  <td data-label="Ratio" className={`py-2.5 pr-3 text-right font-semibold tabular-nums ${ratioColor(p.ratio, p.direction)}`}>
                    {formatRatio(p.ratio, p.direction)}
                  </td>
                  <td data-label="Total Paid" className="py-2.5 text-right text-slate-400 tabular-nums">{formatMoney(p.totalPaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-0.5">&#9656;</span>
            <span><span className="text-cyan-400 font-semibold">7,314 providers</span> across the dataset showed 3x+ billing shifts. These {providers.length} are the most extreme among top billers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>The highest increase ratio is <span className="text-red-400 font-semibold">{highestRatio.toFixed(1)}x</span> &mdash; monthly billing jumping from {formatMoney(providers[0].beforeAvg)} to {formatMoney(providers[0].afterAvg)}.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span><span className="text-amber-400 font-semibold">{topYear[0]}</span> was the most common year for change points ({topYear[1]} providers), coinciding with pandemic-era policy changes.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Billing shifts have many legitimate explanations. This flag is most meaningful when combined with other anomaly indicators.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("CUSUM change point analysis found 7,314 Medicaid providers whose monthly billing shifted 3x+ overnight. The biggest jump: 113x.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/change-points")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Insights</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/insights/fastest-growing" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Fastest Growing Procedures</p>
            <p className="text-xs text-slate-500 mt-1">One code grew 8,935% in five years &rarr;</p>
          </Link>
          <Link href="/insights/pandemic-profiteers" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Pandemic Profiteers</p>
            <p className="text-xs text-slate-500 mt-1">Who made the most money during COVID? &rarr;</p>
          </Link>
        </div>
      </div>
    </article>
  );
}
