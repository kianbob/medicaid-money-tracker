import Link from "next/link";
import { formatMoney, formatNumber, riskLabel, riskColor, riskDot, flagLabel, flagColor, parseFlags, stateName } from "@/lib/format";
import stats from "../../public/data/stats.json";
import topProviders from "../../public/data/top-providers-1000.json";
import smartWatchlist from "../../public/data/smart-watchlist.json";
import oldWatchlist from "../../public/data/expanded-watchlist.json";
import statesSummary from "../../public/data/states-summary.json";
import yearlyTrends from "../../public/data/yearly-trends.json";

export default function Home() {
  const top5Providers = topProviders.slice(0, 5);
  const top5States = (statesSummary as any[]).filter((s: any) => s.state !== 'Unknown').slice(0, 5);

  // Deduplicate watchlist
  const allWatchlistNpis = new Set<string>();
  (smartWatchlist as any[]).forEach((w: any) => allWatchlistNpis.add(w.npi));
  (oldWatchlist as any[]).forEach((w: any) => allWatchlistNpis.add(w.npi));
  const watchlistCount = allWatchlistNpis.size;

  const totalFlaggedSpending = (smartWatchlist as any[]).reduce((sum: number, p: any) => sum + (p.totalPaid || 0), 0);
  const criticalCount = (smartWatchlist as any[]).filter((p: any) => (p.flagCount || 0) >= 3).length;
  const latestYear = yearlyTrends[yearlyTrends.length - 1] as any;
  const prevYear = yearlyTrends[yearlyTrends.length - 2] as any;
  const yoyGrowth = prevYear ? ((latestYear.payments - prevYear.payments) / prevYear.payments * 100) : 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/8 via-purple-600/4 to-dark-900" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-dark-700/80 border border-dark-500 rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Updated with 227M records &middot; Feb 2026 HHS Data Release
            </div>
            <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
              Follow the money.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400">
                $1.09 trillion
              </span>{" "}in<br className="hidden md:inline" /> Medicaid spending.
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 animate-fade-in-delay-1 leading-relaxed">
            We analyzed every Medicaid billing record released by HHS &mdash; and ran{" "}
            <span className="text-white font-medium">code-specific fraud detection</span> across 617,000+ providers.{" "}
            <span className="text-white font-medium">{watchlistCount} providers</span> raised red flags.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-in-delay-2">
            <Link href="/watchlist" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:shadow-red-500/30 hover:-translate-y-0.5">
              View Fraud Watchlist
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/providers" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-semibold px-6 py-3 rounded-lg border border-dark-500 transition-all hover:-translate-y-0.5">
              Browse 1,000 Providers
            </Link>
            <Link href="/states" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-semibold px-6 py-3 rounded-lg border border-dark-500 transition-all hover:-translate-y-0.5">
              Explore by State
            </Link>
          </div>
        </div>
      </section>

      {/* Key Numbers Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6" aria-label="Key statistics">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Spending", value: formatMoney(stats.totalPaid), sub: "2018\u20132024", color: "text-white" },
            { label: "Billing Records", value: formatNumber(stats.records), sub: "Individual claims", color: "text-blue-400" },
            { label: "Providers Analyzed", value: formatNumber(stats.providers), sub: "Unique NPIs", color: "text-slate-300" },
            { label: "Flagged Providers", value: String(watchlistCount), sub: "code-specific analysis", color: "text-red-400" },
            { label: "Procedure Codes", value: formatNumber(10881), sub: "HCPCS codes", color: "text-purple-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
              <p className={`text-xl md:text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investigation Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="investigation-heading">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <h2 id="investigation-heading" className="text-xl font-bold text-white">Key Findings</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 hover:border-red-500/20 transition-all group">
            <p className="text-3xl font-extrabold text-red-400 tabular-nums mb-2">{watchlistCount}</p>
            <p className="text-sm font-semibold text-white mb-1">Providers Flagged</p>
            <p className="text-xs text-slate-500 leading-relaxed">Using code-specific benchmarks that compare each provider against the national median for their exact procedure codes. None appear on the OIG exclusion list.</p>
            <Link href="/watchlist" className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-3 font-medium transition-colors">
              View watchlist <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 hover:border-amber-500/20 transition-all group">
            <p className="text-3xl font-extrabold text-amber-400 tabular-nums mb-2">$122.7B</p>
            <p className="text-sm font-semibold text-white mb-1">Personal Care Spending</p>
            <p className="text-xs text-slate-500 leading-relaxed">Code T1019 alone accounts for 11% of all Medicaid spending. The OIG calls personal care the #1 fraud-risk category.</p>
            <Link href="/procedures/T1019" className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 mt-3 font-medium transition-colors">
              See details <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 hover:border-purple-500/20 transition-all group">
            <p className="text-3xl font-extrabold text-purple-400 tabular-nums mb-2">0 of {watchlistCount}</p>
            <p className="text-sm font-semibold text-white mb-1">On OIG Exclusion List</p>
            <p className="text-xs text-slate-500 leading-relaxed">Cross-referenced against 82,715 excluded providers. Zero matches &mdash; suggesting our analysis surfaces new, uninvestigated activity.</p>
            <Link href="/about" className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-3 font-medium transition-colors">
              Our methodology <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Spending Trend Mini Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="trend-heading">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full" />
            <h2 id="trend-heading" className="text-xl font-bold text-white">Spending Growth</h2>
          </div>
          <Link href="/trends" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Full analysis &rarr;
          </Link>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <div className="flex items-end gap-3 h-32">
            {yearlyTrends.map((y: any) => {
              const maxP = Math.max(...yearlyTrends.map((t: any) => t.payments));
              const pct = (y.payments / maxP) * 100;
              return (
                <div key={y.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <p className="text-[10px] text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">{formatMoney(y.payments)}</p>
                  <div
                    className="w-full bg-blue-500/40 hover:bg-blue-400/60 rounded-t transition-colors bar-segment"
                    style={{ height: `${pct}%` }}
                  />
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">{y.year}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-500/50">
            <p className="text-xs text-slate-500">Medicaid spending grew <span className="text-white font-semibold">{formatMoney(latestYear.payments - (yearlyTrends[0] as any).payments)}</span> from 2018 to 2024</p>
            {yoyGrowth !== 0 && (
              <p className={`text-xs font-semibold ${yoyGrowth < 0 ? 'text-green-400' : 'text-amber-400'}`}>
                {yoyGrowth > 0 ? '+' : ''}{yoyGrowth.toFixed(1)}% YoY
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Top Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="providers-heading">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-green-500 rounded-full" />
            <h2 id="providers-heading" className="text-xl font-bold text-white">Highest-Spending Providers</h2>
          </div>
          <Link href="/providers" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
            View all 1,000 &rarr;
          </Link>
        </div>
        <div className="space-y-2">
          {top5Providers.map((p: any, i: number) => {
            const flags = parseFlags(p.flags);
            return (
              <Link key={p.npi} href={`/providers/${p.npi}`}
                className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-4 hover:bg-dark-700 hover:border-dark-400 transition-all group">
                <span className="text-2xl font-extrabold text-slate-700 w-8 text-right group-hover:text-slate-500 transition-colors tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{p.name || `NPI: ${p.npi}`}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.specialty} {p.city ? `\u00b7 ${p.city}, ${p.state}` : ''}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {flags.length > 0 && (
                    <div className={`w-2 h-2 rounded-full ${riskDot(flags.length)}`} title={`${flags.length} flag${flags.length > 1 ? 's' : ''}`} />
                  )}
                  <div className="text-right">
                    <p className="text-white font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                    <p className="text-[10px] text-slate-600">{formatNumber(p.totalClaims)} claims</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top States */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="states-heading">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500 rounded-full" />
            <h2 id="states-heading" className="text-xl font-bold text-white">Top States by Provider Spending</h2>
          </div>
          <Link href="/states" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
            All 50 states &rarr;
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {top5States.map((s: any, i: number) => (
            <Link key={s.state} href={`/states/${s.state}`}
              className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">#{i + 1}</span>
                <span className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">{s.state}</span>
              </div>
              <p className="text-xl font-bold text-green-400 tabular-nums">{formatMoney(s.total_payments)}</p>
              <p className="text-[10px] text-slate-600 mt-1">{stateName(s.state)} &middot; {s.provider_count} top providers</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Insights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="insights-heading">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-500 rounded-full" />
            <h2 id="insights-heading" className="text-xl font-bold text-white">Latest Insights</h2>
          </div>
          <Link href="/insights" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
            All stories &rarr;
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { slug: "covid-testing", title: "The $4.7 Billion COVID Testing Bonanza", stat: "$4.7B", color: "text-emerald-400", border: "hover:border-emerald-500/20" },
            { slug: "pandemic-profiteers", title: "Who Made the Most Money During COVID?", stat: "+942%", color: "text-red-400", border: "hover:border-red-500/20" },
            { slug: "most-expensive", title: "The Most Expensive Things Medicaid Pays For", stat: "$92,158", color: "text-amber-400", border: "hover:border-amber-500/20" },
            { slug: "top-doctors", title: "Only 2 Individuals in Top 2,000 Billers", stat: "2 of 2,000", color: "text-indigo-400", border: "hover:border-indigo-500/20" },
          ].map((insight) => (
            <Link key={insight.slug} href={`/insights/${insight.slug}`}
              className={`bg-dark-800 border border-dark-500/50 rounded-xl p-4 ${insight.border} transition-all group`}>
              <p className={`text-2xl font-extrabold tabular-nums mb-2 ${insight.color}`}>{insight.stat}</p>
              <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">{insight.title}</p>
              <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                Read more
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-4" aria-labelledby="cta-heading">
        <div className="relative overflow-hidden bg-dark-800 border border-dark-500/50 rounded-2xl p-8 md:p-14 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-purple-600/5" aria-hidden="true" />
          <div className="relative">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-4">Where are your tax dollars going?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
              We used code-specific benchmarks on 617,000 providers and flagged {watchlistCount} for investigation.
              Explore the data yourself.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/analysis" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:-translate-y-0.5">
                See Fraud Analysis
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-semibold px-8 py-3.5 rounded-lg border border-dark-500 transition-all hover:-translate-y-0.5">
                Read Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
