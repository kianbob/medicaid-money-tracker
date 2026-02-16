import Link from "next/link";
import { formatMoney, formatNumber, riskLabel, riskColor, flagLabel, flagColor } from "@/lib/format";
import stats from "../../public/data/stats.json";
import topProviders from "../../public/data/top-providers.json";
import topProcedures from "../../public/data/top-procedures.json";
import watchlist from "../../public/data/watchlist.json";

export default function Home() {
  const top5Watchlist = watchlist.slice(0, 5);
  const top10Providers = topProviders.slice(0, 10);
  const top10Procedures = topProcedures.slice(0, 10);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-dark-900 to-dark-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Follow the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Medicaid Money
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
            Tracking <span className="text-white font-semibold">{formatMoney(stats.totalPaid)}</span> in 
            Medicaid payments across <span className="text-white font-semibold">{formatNumber(stats.providers)}</span> providers. 
            See where taxpayer healthcare dollars go — and where they shouldn&apos;t.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/watchlist" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              🚩 View Fraud Watchlist
            </Link>
            <Link href="/providers" className="inline-flex items-center gap-2 bg-dark-600 hover:bg-dark-500 text-white font-semibold px-6 py-3 rounded-lg border border-dark-500 transition-colors">
              Search Providers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Payments", value: formatMoney(stats.totalPaid), color: "text-green-400" },
            { label: "Billing Records", value: formatNumber(stats.records), color: "text-blue-400" },
            { label: "Providers", value: formatNumber(stats.providers), color: "text-amber-400" },
            { label: "Flagged Providers", value: String(watchlist.length), color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-dark-700 border border-dark-500 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fraud Watchlist Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🚩 Fraud Watchlist</h2>
          <Link href="/watchlist" className="text-sm text-red-400 hover:text-red-300">
            View all {watchlist.length} flagged →
          </Link>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Provider</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Location</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Total Paid</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden sm:table-cell">Red Flags</th>
                  <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Risk</th>
                </tr>
              </thead>
              <tbody>
                {top5Watchlist.map((p: any) => (
                  <tr key={p.npi} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/providers/${p.npi}`} className="text-white font-medium hover:text-blue-400">
                        {p.name || p.npi}
                      </Link>
                      <p className="text-xs text-slate-500">{p.specialty}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                      {p.city ? `${p.city}, ${p.state}` : p.state || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white">
                      {formatMoney(p.totalPaid)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
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
      </section>

      {/* Top Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">💰 Top Providers by Spending</h2>
          <Link href="/providers" className="text-sm text-blue-400 hover:text-blue-300">
            View all →
          </Link>
        </div>
        <div className="grid gap-3">
          {top10Providers.map((p: any, i: number) => (
            <Link key={p.npi} href={`/providers/${p.npi}`}
              className="flex items-center gap-4 bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 hover:bg-dark-600 transition-colors">
              <span className="text-lg font-bold text-slate-500 w-8">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{p.name || `NPI: ${p.npi}`}</p>
                <p className="text-xs text-slate-500">{p.specialty} {p.city ? `· ${p.city}, ${p.state}` : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-mono font-bold">{formatMoney(p.totalPaid)}</p>
                <p className="text-xs text-slate-500">{formatNumber(p.totalClaims)} claims</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Procedures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">💊 Top Procedures by Spending</h2>
          <Link href="/procedures" className="text-sm text-blue-400 hover:text-blue-300">
            View all →
          </Link>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Code</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Total Paid</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden sm:table-cell">Claims</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Providers</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Avg/Claim</th>
                </tr>
              </thead>
              <tbody>
                {top10Procedures.map((p: any) => (
                  <tr key={p.code} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/procedures/${p.code}`} className="text-white font-mono font-medium hover:text-blue-400">
                        {p.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white">{formatMoney(p.totalPaid)}</td>
                    <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">{formatNumber(p.totalClaims)}</td>
                    <td className="px-4 py-3 text-right text-slate-400 hidden md:table-cell">{formatNumber(p.providerCount)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400 hidden md:table-cell">{formatMoney(p.avgCostPerClaim || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-red-600/20 to-purple-600/20 border border-dark-500 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Where is your tax money going?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            We analyzed 227 million Medicaid billing records and found providers charging 50x the going rate, 
            overnight spending spikes of 692x, and billions in suspicious payments.
          </p>
          <Link href="/watchlist" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg">
            🚩 See the Fraud Watchlist
          </Link>
        </div>
      </section>
    </div>
  );
}
