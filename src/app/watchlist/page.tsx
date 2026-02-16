import Link from "next/link";
import { formatMoney, formatNumber, riskLabel, riskColor, flagLabel, flagColor } from "@/lib/format";
import watchlist from "../../../public/data/watchlist.json";

export const metadata = {
  title: "Fraud Watchlist — Medicaid Money Tracker",
  description: "Providers flagged for suspicious Medicaid billing patterns. Statistical anomalies detected across spending, cost-per-claim, beneficiary ratios, and spending spikes.",
};

export default function WatchlistPage() {
  const totalFlaggedSpending = watchlist.reduce((sum: number, p: any) => sum + (p.totalPaid || 0), 0);
  const criticalCount = watchlist.filter((p: any) => p.flagCount >= 3).length;
  const highCount = watchlist.filter((p: any) => p.flagCount === 2).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          🚩 Fraud Watchlist
        </h1>
        <p className="text-lg text-slate-400 max-w-3xl">
          These providers were flagged by our automated analysis for statistical anomalies in their Medicaid billing. 
          Flags indicate <strong className="text-slate-200">where to look</strong> — not proof of wrongdoing. 
          Some may have legitimate reasons for unusual patterns.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Flagged Providers</p>
          <p className="text-3xl font-bold text-red-400">{watchlist.length}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Total Spending (Flagged)</p>
          <p className="text-3xl font-bold text-white">{formatMoney(totalFlaggedSpending)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Critical Risk</p>
          <p className="text-3xl font-bold text-red-400">{criticalCount}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">High Risk</p>
          <p className="text-3xl font-bold text-amber-400">{highCount}</p>
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold text-white mb-3">How We Detect Anomalies</h2>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="inline-block px-2 py-0.5 rounded border bg-red-500/20 text-red-400 border-red-500/30 text-xs font-semibold mb-2">Outlier Spending</span>
            <p className="text-slate-400">Provider&apos;s total billing is more than 3 standard deviations above average — statistically very rare.</p>
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded border bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-semibold mb-2">Unusual Cost/Claim</span>
            <p className="text-slate-400">Charges 3x+ the median cost per claim for the same procedure code. May indicate upcoding.</p>
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded border bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs font-semibold mb-2">Bene Stuffing</span>
            <p className="text-slate-400">Files far more claims per patient than peers. Could indicate billing for services not rendered.</p>
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded border bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs font-semibold mb-2">Spending Spike</span>
            <p className="text-slate-400">Monthly spending jumped 500%+ overnight. Sudden surges can signal new billing schemes.</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">#</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Provider</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Location</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Total Paid</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden sm:table-cell">Claims</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden lg:table-cell">Flags</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Risk</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-bold">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/providers/${p.npi}`} className="text-white font-medium hover:text-blue-400">
                      {p.name || p.npi}
                    </Link>
                    <p className="text-xs text-slate-500">{p.specialty} · NPI: {p.npi}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                    {p.city ? `${p.city}, ${p.state}` : p.state || '—'}
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
                    <span className={`text-xs font-bold ${riskColor(p.flagCount)}`}>
                      {riskLabel(p.flagCount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
