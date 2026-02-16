import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, riskLabel, riskColor, flagLabel, flagColor } from "@/lib/format";
import watchlist from "../../../public/data/watchlist.json";

export const metadata: Metadata = {
  title: "Fraud Watchlist",
  description: "76 Medicaid providers flagged for suspicious billing patterns. Statistical anomalies detected across spending outliers, cost-per-claim, beneficiary stuffing, and spending spikes.",
  openGraph: {
    title: "Fraud Watchlist — Medicaid Money Tracker",
    description: "76 providers flagged for suspicious Medicaid billing. See who raised red flags across 4 statistical tests analyzing $1.09T in payments.",
  },
};

export default function WatchlistPage() {
  const totalFlaggedSpending = watchlist.reduce((sum: number, p: any) => sum + (p.totalPaid || 0), 0);
  const criticalCount = watchlist.filter((p: any) => p.flagCount >= 3).length;
  const highCount = watchlist.filter((p: any) => p.flagCount === 2).length;
  const moderateCount = watchlist.filter((p: any) => p.flagCount === 1).length;

  // State distribution
  const stateCounts: Record<string, number> = {};
  watchlist.forEach((p: any) => {
    if (p.state) stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
  });
  const topStates = Object.entries(stateCounts).sort(([, a], [, b]) => b - a).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Fraud Watchlist</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Fraud Watchlist
        </h1>
        <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
          These {watchlist.length} providers were flagged by our automated analysis for statistical anomalies in their Medicaid billing.
          Flags indicate <strong className="text-slate-200">where to look</strong> &mdash; not proof of wrongdoing.
        </p>
      </div>

      {/* OIG Finding Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-8" role="alert">
        <div className="flex items-start gap-3">
          <span className="text-amber-400 text-lg shrink-0" aria-hidden="true">&#9888;</span>
          <div>
            <p className="text-amber-400 font-semibold mb-1">OIG Cross-Reference Finding</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              We cross-referenced all {watchlist.length} flagged providers against the HHS OIG exclusion list
              (<strong className="text-white">82,715 excluded providers</strong>). <strong className="text-white">None of our flagged providers
              appear on this list</strong>, suggesting our analysis may be surfacing new suspicious activity not yet investigated.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" aria-label="Watchlist summary statistics">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Flagged Providers</p>
          <p className="text-3xl font-bold text-red-400">{watchlist.length}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Total Spending</p>
          <p className="text-3xl font-bold text-white">{formatMoney(totalFlaggedSpending)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Critical Risk</p>
          <p className="text-3xl font-bold text-red-400">{criticalCount}</p>
          <p className="text-xs text-slate-600 mt-0.5">3+ flags</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">High Risk</p>
          <p className="text-3xl font-bold text-amber-400">{highCount}</p>
          <p className="text-xs text-slate-600 mt-0.5">2 flags</p>
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">How We Detect Anomalies</h2>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="inline-block px-2.5 py-1 rounded border bg-red-500/20 text-red-400 border-red-500/30 text-xs font-bold mb-2">Outlier Spending</span>
            <p className="text-slate-400 leading-relaxed">Provider&apos;s total billing is 3+ standard deviations above average &mdash; statistically in the top fraction of a percent.</p>
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 rounded border bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-bold mb-2">Unusual Cost/Claim</span>
            <p className="text-slate-400 leading-relaxed">Charges 3x+ the median cost per claim for the same procedure. May indicate upcoding or inflated billing.</p>
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 rounded border bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs font-bold mb-2">Bene Stuffing</span>
            <p className="text-slate-400 leading-relaxed">Files far more claims per patient than peers for the same services. Could indicate billing for services not rendered.</p>
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 rounded border bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs font-bold mb-2">Spending Spike</span>
            <p className="text-slate-400 leading-relaxed">Monthly spending jumped 500%+ in a single month. Sudden surges can signal new billing schemes.</p>
          </div>
        </div>
      </div>

      {/* Distribution Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">By Risk Level</h3>
          <div className="space-y-2.5">
            {criticalCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-400 font-bold">CRITICAL (3+ flags)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-dark-500 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(criticalCount / watchlist.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-6 text-right">{criticalCount}</span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-bold">HIGH (2 flags)</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-dark-500 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(highCount / watchlist.length) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-400 w-6 text-right">{highCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400 font-bold">MODERATE (1 flag)</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-dark-500 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(moderateCount / watchlist.length) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-400 w-6 text-right">{moderateCount}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Top States</h3>
          <div className="space-y-2.5">
            {topStates.map(([state, count]) => (
              <div key={state} className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">{state}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-dark-500 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(count / watchlist.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-dark-500 bg-dark-800/50">
          <p className="text-sm text-slate-400">
            Showing all <strong className="text-white">{watchlist.length}</strong> flagged providers, sorted by total spending
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500">
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">#</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Location</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Paid</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden lg:table-cell">Flags</th>
                <th scope="col" className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                  <td className="px-4 py-3 text-slate-600 font-bold">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/providers/${p.npi}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                      {p.name || p.npi}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{p.specialty} &middot; NPI: {p.npi}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                    {p.city ? `${p.city}, ${p.state}` : p.state || '\u2014'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white font-semibold">
                    {formatMoney(p.totalPaid)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">
                    {formatNumber(p.totalClaims)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {p.flags?.map((f: string) => (
                        <span key={f} className={`text-xs px-2 py-0.5 rounded border ${flagColor(f)}`}>
                          {flagLabel(f)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold whitespace-nowrap ${riskColor(p.flagCount)}`}>
                      {riskLabel(p.flagCount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm mb-3">
          Want to understand how we identified these providers?
        </p>
        <Link href="/about" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Read our full methodology &rarr;
        </Link>
      </div>
    </div>
  );
}
