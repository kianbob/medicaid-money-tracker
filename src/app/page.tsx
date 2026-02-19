import Link from "next/link";
import { formatMoney, formatNumber, riskDot, parseFlags, stateName } from "@/lib/format";
import { HomepageBarChart } from "@/components/Charts";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import stats from "../../public/data/stats.json";
import topProviders from "../../public/data/top-providers-1000.json";
import smartWatchlist from "../../public/data/smart-watchlist.json";
import oldWatchlist from "../../public/data/expanded-watchlist.json";
import statesSummary from "../../public/data/states-summary.json";
import yearlyTrends from "../../public/data/yearly-trends.json";
import mlScores from "../../public/data/ml-scores.json";

export default function Home() {
  const top5Providers = topProviders.slice(0, 5);
  const top5States = (statesSummary as any[]).filter((s: any) => s.state !== 'Unknown').slice(0, 5);

  // Deduplicate watchlist (statistical + ML-only providers)
  const allWatchlistNpis = new Set<string>();
  (smartWatchlist as any[]).forEach((w: any) => allWatchlistNpis.add(w.npi));
  (oldWatchlist as any[]).forEach((w: any) => allWatchlistNpis.add(w.npi));
  // Add ML-only providers (score >= 0.5 with no statistical flags)
  for (const p of [...((mlScores as any).topProviders || []), ...((mlScores as any).smallProviderFlags || [])]) {
    if ((p as any).mlScore >= 0.5 && !allWatchlistNpis.has((p as any).npi)) {
      allWatchlistNpis.add((p as any).npi);
    }
  }
  const watchlistCount = allWatchlistNpis.size;

  const latestYear = yearlyTrends[yearlyTrends.length - 1] as any;
  const prevYear = yearlyTrends[yearlyTrends.length - 2] as any;
  const yoyGrowth = prevYear ? ((latestYear.payments - prevYear.payments) / prevYear.payments * 100) : 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient-bg" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/8 via-purple-600/4 to-dark-900" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-dark-700/80 border border-dark-500 rounded-full px-4 py-1.5 text-xs font-medium text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Updated with 227M records &middot; Feb 2026 HHS Data Release
              </div>
              <span className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-[10px] font-semibold text-blue-400">
                Last updated: February 2026
              </span>
            </div>
            <h1 id="hero-heading" className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
              Follow the money.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400">
                $1.09 trillion
              </span>{" "}in<br className="hidden md:inline" /> Medicaid spending.
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            We analyzed every Medicaid billing record released by HHS &mdash; and ran{" "}
            <span className="text-white font-medium">code-specific fraud detection</span> across 617,000+ providers.{" "}
            <span className="text-white font-medium">{watchlistCount} providers</span> raised red flags &mdash; collectively billing{" "}
            <span className="text-white font-medium">$229.6 billion</span> in taxpayer funds.
          </p>
          <p className="text-sm text-slate-500 mb-6">Built for journalists, researchers, taxpayers, and anyone who thinks $1 trillion in government spending deserves scrutiny.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/watchlist" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:shadow-red-500/30 hover:-translate-y-0.5">
              View Risk Watchlist
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/providers" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-semibold px-6 py-3 rounded-lg border border-dark-500 transition-all hover:-translate-y-0.5">
              Browse 1,000 Providers
            </Link>
            <Link href="/states" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-semibold px-6 py-3 rounded-lg border border-dark-500 transition-all hover:-translate-y-0.5">
              Explore by State
            </Link>
            <Link href="/check" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-semibold px-6 py-3 rounded-lg border border-dark-500 transition-all hover:-translate-y-0.5">
              Check a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Key Numbers Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10" aria-label="Key statistics">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Spending", value: formatMoney(stats.totalPaid), sub: "2018\u20132024", color: "text-white" },
            { label: "Billing Records", value: formatNumber(stats.records), sub: "Individual claims", color: "text-blue-400" },
            { label: "Providers Analyzed", value: formatNumber(stats.providers), sub: "Unique NPIs", color: "text-slate-300" },
            { label: "Flagged Providers", value: String(watchlistCount), sub: "statistical + ML analysis", color: "text-red-400" },
            { label: "Flagged Spending", value: "$229.6B", sub: "billed by flagged providers", color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
              <p className={`text-xl md:text-2xl font-bold tabular-nums ${stat.color}`}>
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Start Here */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <p className="text-sm text-slate-300"><span className="text-white font-semibold">New here?</span> Start with our top investigations, or jump straight to the <Link href="/watchlist" className="text-blue-400 hover:underline">Risk Watchlist</Link> to see all 1,860 flagged providers.</p>
          <div className="flex gap-2 shrink-0">
            <Link href="/insights" className="text-xs px-3 py-1.5 rounded-full bg-dark-700 border border-dark-500/50 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors">All 28 investigations &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Featured Investigations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6" aria-labelledby="featured-investigations-heading">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <h2 id="featured-investigations-heading" className="font-headline text-xl font-bold text-white">🔍 Featured Investigations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/insights/pandemic-profiteers" className="group bg-dark-800 border border-dark-500/50 rounded-xl p-6 border-l-4 border-l-red-500 hover:border-dark-400 transition-all">
            <h3 className="text-lg font-bold text-white mb-2">Pandemic Profiteers</h3>
            <p className="text-sm text-slate-400 mb-4">Providers whose billing surged during COVID and never came back down</p>
            <p className="text-xs text-red-400 flex items-center gap-1 font-medium">
              Read investigation
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </p>
          </Link>
          <Link href="/insights/city-hotspots" className="group bg-dark-800 border border-dark-500/50 rounded-xl p-6 border-l-4 border-l-amber-500 hover:border-dark-400 transition-all">
            <h3 className="text-lg font-bold text-white mb-2">City Fraud Hotspots</h3>
            <p className="text-sm text-slate-400 mb-4">Brooklyn leads with 64 flagged providers billing $13.7B combined</p>
            <p className="text-xs text-amber-400 flex items-center gap-1 font-medium">
              Read investigation
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </p>
          </Link>
          <Link href="/insights/arizona-problem" className="group bg-dark-800 border border-dark-500/50 rounded-xl p-6 border-l-4 border-l-blue-500 hover:border-dark-400 transition-all">
            <h3 className="text-lg font-bold text-white mb-2">The Arizona Problem</h3>
            <p className="text-sm text-slate-400 mb-4">46 new providers appeared post-pandemic with aggressive billing patterns</p>
            <p className="text-xs text-blue-400 flex items-center gap-1 font-medium">
              Read investigation
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </p>
          </Link>
          <Link href="/insights/minnesota-fraud-capital" className="group bg-dark-800 border border-dark-500/50 rounded-xl p-6 border-l-4 border-l-purple-500 hover:border-dark-400 transition-all">
            <h3 className="text-lg font-bold text-white mb-2">Minnesota&apos;s Fraud Capital</h3>
            <p className="text-sm text-slate-400 mb-4">How one state became a national hotspot for Medicaid billing anomalies</p>
            <p className="text-xs text-purple-400 flex items-center gap-1 font-medium">
              Read investigation
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </p>
          </Link>
          <Link href="/insights/banned-but-billing" className="group bg-dark-800 border border-dark-500/50 rounded-xl p-6 border-l-4 border-l-red-500 hover:border-dark-400 transition-all">
            <h3 className="text-lg font-bold text-white mb-2">Banned but Billing</h3>
            <p className="text-sm text-slate-400 mb-4">OIG-excluded providers still appearing in Medicaid payment records</p>
            <p className="text-xs text-red-400 flex items-center gap-1 font-medium">
              Read investigation
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </p>
          </Link>
        </div>
      </section>

      {/* Most Flagged Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10" aria-labelledby="flagged-providers-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-red-500 rounded-full" />
            <h2 id="flagged-providers-heading" className="font-headline text-xl font-bold text-white">Most Flagged Providers</h2>
          </div>
          <Link href="/watchlist" className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">
            View all 1,860 flagged providers &rarr;
          </Link>
        </div>
        <div className="space-y-2">
          {[
            { name: "Cares Inc", npi: "1396049987", city: "New York", state: "NY", flags: 7, totalPaid: 1040000000 },
            { name: "Consumer Direct Care Network Virginia", npi: "1538649983", city: "Missoula", state: "MT", flags: 3, totalPaid: 2110000000 },
            { name: "City of Chicago", npi: "1376554592", city: "Chicago", state: "IL", flags: 3, totalPaid: 1230000000 },
            { name: "Dept of Intellectual and Dev Disabilities, TN", npi: "1356709976", city: "Nashville", state: "TN", flags: 3, totalPaid: 1450000000 },
            { name: "Commonwealth of Massachusetts", npi: "1518096411", city: "Beverly", state: "MA", flags: 3, totalPaid: 1140000000 },
          ].map((p, i) => (
            <Link key={p.npi} href={`/providers/${p.npi}`}
              className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-4 hover:bg-dark-700 hover:border-dark-400 transition-all group">
              <span className="text-2xl font-extrabold text-slate-700 w-8 text-right group-hover:text-slate-500 transition-colors tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{p.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{p.city}, {p.state}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-flex items-center justify-center text-xs font-bold text-white rounded-full px-2.5 py-0.5 ${p.flags >= 7 ? 'bg-red-500' : 'bg-amber-500'}`}>
                  {p.flags} flag{p.flags !== 1 ? 's' : ''}
                </span>
                <p className="text-white font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Insights — moved up for engagement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10" aria-labelledby="insights-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-500 rounded-full" />
            <h2 id="insights-heading" className="font-headline text-xl font-bold text-white">Latest Investigations</h2>
          </div>
          <Link href="/insights" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
            All 28 stories &rarr;
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { slug: "specialty-drugs", title: "Inside Medicaid's Most Expensive Drugs", stat: "$3.5B+", color: "text-amber-400", border: "hover:border-amber-500/20" },
            { slug: "arizona-problem", title: "The Arizona Problem: New Clinics, Massive Billing", stat: "$800M+", color: "text-orange-400", border: "hover:border-orange-500/20" },
            { slug: "ny-home-care", title: "The New York Home Care Machine", stat: "$47B+", color: "text-blue-400", border: "hover:border-blue-500/20" },
            { slug: "most-patients", title: "Who Bills for the Most Patients?", stat: "108M+", color: "text-green-400", border: "hover:border-green-500/20" },
          ].map((insight, idx) => (
            <Link key={insight.slug} href={`/insights/${insight.slug}`}
              className={`bg-dark-800 border border-dark-500/50 rounded-xl p-4 ${insight.border} transition-all group`}>
              {idx === 0 && (
                <span className="inline-flex items-center bg-green-500/15 border border-green-500/30 rounded-full px-2 py-0.5 text-[10px] font-semibold text-green-400 mb-2">
                  Latest
                </span>
              )}
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

      {/* Key Findings — compact 2-column */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" aria-labelledby="investigation-heading">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <h2 id="investigation-heading" className="font-headline text-xl font-bold text-white">Key Findings</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link href="/watchlist" className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-4 hover:border-red-500/20 transition-all group">
            <p className="text-2xl font-extrabold text-red-400 tabular-nums shrink-0">{watchlistCount}</p>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">Providers Flagged</p>
              <p className="text-[11px] text-slate-500 leading-snug">13 statistical tests + ML model. None on OIG exclusion list.</p>
            </div>
          </Link>
          <Link href="/procedures/T1019" className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-4 hover:border-amber-500/20 transition-all group">
            <p className="text-2xl font-extrabold text-amber-400 tabular-nums shrink-0">$122.7B</p>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Personal Care Spending</p>
              <p className="text-[11px] text-slate-500 leading-snug">T1019 alone is 11% of all Medicaid. OIG&apos;s #1 fraud-risk category.</p>
            </div>
          </Link>
          <Link href="/exclusions/matched" className="flex items-center gap-4 bg-dark-800 border border-red-500/30 rounded-xl px-5 py-4 hover:border-red-500/50 transition-all group sm:col-span-2 lg:col-span-1">
            <p className="text-2xl font-extrabold text-red-400 tabular-nums shrink-0">40</p>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">Excluded Providers in Billing Data</p>
              <p className="text-[11px] text-slate-500 leading-snug">OIG-excluded providers still appearing in Medicaid billing records.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* OIG Exclusion Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl shrink-0">⚠️</span>
            <p className="text-sm text-slate-300">
              We cross-referenced <Link href="/exclusions" className="text-red-400 hover:underline font-semibold">82,714 OIG-excluded providers</Link> against Medicaid billing data and found <Link href="/exclusions/matched" className="text-red-400 hover:underline font-semibold">40 excluded providers</Link> still appearing in payment records.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/exclusions" className="text-xs px-3 py-1.5 rounded-full bg-dark-700 border border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500/50 transition-colors font-medium">Exclusion Database &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Spending Trend Mini Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="trend-heading">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full" />
            <h2 id="trend-heading" className="font-headline text-xl font-bold text-white">Spending Growth</h2>
          </div>
          <Link href="/trends" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Full analysis &rarr;
          </Link>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <HomepageBarChart data={yearlyTrends as any[]} />
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
            <h2 id="providers-heading" className="font-headline text-xl font-bold text-white">Highest-Spending Providers</h2>
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
                  {flags.length > 0 ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${flags.length >= 5 ? 'bg-red-500/20 text-red-400' : flags.length >= 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {flags.length} flag{flags.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600 px-2 py-0.5 rounded-full bg-dark-600">No flags</span>
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
            <h2 id="states-heading" className="font-headline text-xl font-bold text-white">Top States by Provider Spending</h2>
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
              <p className="text-[10px] text-slate-600 mt-1">{stateName(s.state)} &middot; {s.provider_count} high-billing providers</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How We Did This */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="methodology-heading">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-slate-500 rounded-full" />
          <h2 id="methodology-heading" className="font-headline text-xl font-bold text-white">How We Did This</h2>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            We analyzed <span className="text-white font-semibold">227 million Medicaid billing records</span> released by HHS, covering 617,503 providers and
            10,881 procedure codes from 2018&ndash;2024. We combined <span className="text-white font-semibold">13 statistical fraud tests</span> &mdash;
            including 4 code-specific smart tests that compare each provider&apos;s cost per claim against the national median &mdash; with
            a <span className="text-white font-semibold">random forest ML model</span> (AUC: 0.77) trained on 514 OIG-excluded providers.
            These are unified into <span className="text-white font-semibold">risk tiers</span> (Critical, High, Elevated, ML Flag) for a single view of the most suspicious billing patterns.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/watchlist" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Risk Watchlist &rarr;
            </Link>
            <Link href="/analysis" className="text-sm text-slate-400 hover:text-slate-300 font-medium transition-colors">
              Our methodology &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Our Data */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-labelledby="data-sources-heading">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-blue-500 rounded-full" />
          <h2 id="data-sources-heading" className="font-headline text-xl font-bold text-white">Our Data</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" target="_blank" rel="noopener" className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-blue-500/30 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <h3 className="text-sm font-bold text-white">HHS Open Data</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">227 million Medicaid billing records from the HHS Open Data Platform, covering 2018&ndash;2024.</p>
            <p className="text-[10px] text-blue-400/60 mt-2 group-hover:text-blue-400 transition-colors">opendata.hhs.gov &rarr;</p>
          </a>
          <a href="https://oig.hhs.gov/exclusions/" target="_blank" rel="noopener" className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-blue-500/30 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <h3 className="text-sm font-bold text-white">OIG Exclusion List</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">82,715 excluded providers from the HHS Office of Inspector General, cross-referenced against our watchlist.</p>
            <p className="text-[10px] text-blue-400/60 mt-2 group-hover:text-blue-400 transition-colors">oig.hhs.gov &rarr;</p>
          </a>
          <a href="https://npiregistry.cms.hhs.gov/" target="_blank" rel="noopener" className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-blue-500/30 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
              <h3 className="text-sm font-bold text-white">NPI Registry</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Provider names, specialties, and locations from the CMS National Provider Identifier registry.</p>
            <p className="text-[10px] text-blue-400/60 mt-2 group-hover:text-blue-400 transition-colors">npiregistry.cms.hhs.gov &rarr;</p>
          </a>
        </div>
      </section>

      {/* Built With */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" aria-label="Built with">
        <div className="flex flex-wrap items-center justify-center gap-3 py-6 border-t border-b border-dark-500/30">
          <span className="text-[10px] uppercase tracking-widest text-slate-600 mr-2">Built with</span>
          {[
            { label: "227M HHS Records", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            { label: "13 Statistical Tests", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { label: "Random Forest ML (AUC 0.77)", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { label: "OIG Exclusion List Cross-Ref", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
          ].map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 bg-dark-800 border border-dark-500/50 rounded-full px-3 py-1.5 text-[11px] font-medium text-slate-400">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
              {item.label}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-4 text-center">
        <Link href="/watchlist" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:-translate-y-0.5">
          Explore the Data
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </section>
    </div>
  );
}
