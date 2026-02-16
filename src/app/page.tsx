import Link from "next/link";
import { formatMoney, formatNumber, riskLabel, riskColor, flagLabel, flagColor, hcpcsDescription } from "@/lib/format";
import stats from "../../public/data/stats.json";
import topProviders from "../../public/data/top-providers.json";
import topProcedures from "../../public/data/top-procedures.json";
import watchlist from "../../public/data/watchlist.json";

export default function Home() {
  const top5Watchlist = watchlist.slice(0, 5);
  const top10Providers = topProviders.slice(0, 10);
  const top10Procedures = topProcedures.slice(0, 10);
  const totalFlaggedSpending = watchlist.reduce((sum: number, p: any) => sum + (p.totalPaid || 0), 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-dark-900 to-dark-900" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          <div className="animate-fade-in">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-4">
              227 million records &middot; $1.09 trillion &middot; 617K+ providers
            </p>
            <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Where does your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Medicaid money
              </span>{" "}go?
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-8 animate-fade-in-delay-1 leading-relaxed">
            On Feb 13, 2026, HHS released the largest Medicaid dataset in history.
            We analyzed every record to find where taxpayer healthcare dollars actually go &mdash;
            and where <span className="text-white font-medium">billions</span> may be going to waste.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
            <Link href="/watchlist" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:shadow-red-500/30">
              View Fraud Watchlist
            </Link>
            <Link href="/providers" className="inline-flex items-center gap-2 bg-dark-600 hover:bg-dark-500 text-white font-semibold px-6 py-3 rounded-lg border border-dark-500 transition-all">
              Browse Providers
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium px-4 py-3 transition-colors">
              How we did this &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4" aria-label="Key statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Payments", value: formatMoney(stats.totalPaid), detail: "2018\u20132024", color: "text-green-400" },
            { label: "Billing Records", value: formatNumber(stats.records), detail: "Individual line items", color: "text-blue-400" },
            { label: "Providers", value: formatNumber(stats.providers), detail: "Unique NPIs", color: "text-amber-400" },
            { label: "Flagged Providers", value: String(watchlist.length), detail: formatMoney(totalFlaggedSpending) + " in spending", color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-600 mt-1">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Findings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="findings-heading">
        <h2 id="findings-heading" className="text-2xl font-bold text-white mb-6">Key Findings</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 hover:border-red-500/30 transition-colors">
            <div className="text-3xl font-bold text-red-400 mb-2">$7.2B</div>
            <p className="text-sm text-slate-300 font-medium mb-1">Largest single provider</p>
            <p className="text-xs text-slate-500">Public Partnerships LLC (NY) &mdash; a &ldquo;supports brokerage&rdquo; that received more Medicaid money than some states&apos; entire programs.</p>
          </div>
          <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 hover:border-amber-500/30 transition-colors">
            <div className="text-3xl font-bold text-amber-400 mb-2">$122.7B</div>
            <p className="text-sm text-slate-300 font-medium mb-1">Top procedure: Personal care (T1019)</p>
            <p className="text-xs text-slate-500">Personal care services account for 11% of all Medicaid spending &mdash; and are consistently flagged as the highest fraud-risk category by the OIG.</p>
          </div>
          <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
            <div className="text-3xl font-bold text-purple-400 mb-2">0 of 76</div>
            <p className="text-sm text-slate-300 font-medium mb-1">Flagged providers on OIG exclusion list</p>
            <p className="text-xs text-slate-500">None of our statistically flagged providers appear on the HHS OIG&apos;s list of 82,715 excluded providers &mdash; suggesting new suspicious activity.</p>
          </div>
        </div>
      </section>

      {/* Fraud Watchlist Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="watchlist-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="watchlist-heading" className="text-2xl font-bold text-white">Fraud Watchlist</h2>
          <Link href="/watchlist" className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
            View all {watchlist.length} flagged &rarr;
          </Link>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500 bg-dark-800/50">
                  <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Location</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Paid</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:table-cell">Red Flags</th>
                  <th scope="col" className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {top5Watchlist.map((p: any) => (
                  <tr key={p.npi} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/providers/${p.npi}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                        {p.name || p.npi}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">{p.specialty}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                      {p.city ? `${p.city}, ${p.state}` : p.state || '\u2014'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white font-semibold">
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
          <div className="px-4 py-3 bg-dark-800/50 border-t border-dark-500">
            <Link href="/watchlist" className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
              View full watchlist with {watchlist.length} flagged providers &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Top Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="providers-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="providers-heading" className="text-2xl font-bold text-white">Top Providers by Spending</h2>
          <Link href="/providers" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-2">
          {top10Providers.map((p: any, i: number) => (
            <Link key={p.npi} href={`/providers/${p.npi}`}
              className="flex items-center gap-4 bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 hover:bg-dark-600 hover:border-dark-400 transition-all group">
              <span className="text-lg font-bold text-slate-600 w-8 group-hover:text-slate-400 transition-colors">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{p.name || `NPI: ${p.npi}`}</p>
                <p className="text-xs text-slate-500">{p.specialty} {p.city ? `\u00b7 ${p.city}, ${p.state}` : ''}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-white font-mono font-bold">{formatMoney(p.totalPaid)}</p>
                <p className="text-xs text-slate-500">{formatNumber(p.totalClaims)} claims</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Procedures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="procedures-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="procedures-heading" className="text-2xl font-bold text-white">Top Procedures by Spending</h2>
          <Link href="/procedures" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
            View all &rarr;
          </Link>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500 bg-dark-800/50">
                  <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Procedure</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Paid</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Providers</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Avg/Claim</th>
                </tr>
              </thead>
              <tbody>
                {top10Procedures.map((p: any) => (
                  <tr key={p.code} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/procedures/${p.code}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                        <span className="font-mono">{p.code}</span>
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">{hcpcsDescription(p.code) || p.description || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white font-semibold">{formatMoney(p.totalPaid)}</td>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20" aria-labelledby="cta-heading">
        <div className="bg-gradient-to-r from-red-600/20 via-dark-700 to-purple-600/20 border border-dark-500 rounded-2xl p-8 md:p-12 text-center">
          <h2 id="cta-heading" className="text-3xl font-bold text-white mb-4">Where is your tax money going?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            We analyzed 227 million Medicaid billing records and found providers charging 50x the going rate,
            overnight spending spikes of 692x, and billions in suspicious payments.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/watchlist" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg shadow-red-600/20 text-lg">
              See the Fraud Watchlist
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 bg-dark-600 hover:bg-dark-500 text-white font-semibold px-8 py-4 rounded-lg border border-dark-500 transition-all text-lg">
              Read Our Methodology
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
