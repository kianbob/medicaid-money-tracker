import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, getFlagInfo, hcpcsDescription, riskColor, riskBgColor, riskLabel, stateName } from "@/lib/format";
import smartWatchlist from "../../../public/data/smart-watchlist.json";
import expandedWatchlist from "../../../public/data/expanded-watchlist.json";
import mlScores from "../../../public/data/ml-scores.json";
import fs from "fs";
import path from "path";

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

function buildSummary(provider: any): string {
  const flags = provider.flags || [];
  const fd = provider.flagDetails || {};
  const parts: string[] = [];

  if (flags.includes('massive_new_entrant') && fd.massive_new_entrant) {
    const d = fd.massive_new_entrant;
    parts.push(`Appeared in ${d.firstYear} and already billed ${formatMoney(d.totalPaid)} \u2014 one of the fastest-growing new entrants in the dataset.`);
  }
  if (flags.includes('billing_swing') && fd.billing_swing) {
    const d = fd.billing_swing;
    parts.push(`Spending changed by ${d.pctChange.toFixed(0)}% between ${d.fromYear}\u2013${d.toYear}, an unusual swing of ${formatMoney(d.absChange)}.`);
  }
  if (flags.includes('code_specific_outlier') && fd.code_specific_outlier) {
    const d = fd.code_specific_outlier;
    const desc = hcpcsDescription(d.code);
    parts.push(`Bills ${d.ratio}\u00d7 the national median for ${d.code}${desc ? ` (${desc})` : ''}.`);
  }
  if (flags.includes('rate_outlier_multi_code') && fd.rate_outlier_multi_code) {
    const d = fd.rate_outlier_multi_code;
    parts.push(`Above the 90th percentile across ${d.codesAboveP90} procedure codes simultaneously.`);
  }

  if (parts.length === 0) {
    parts.push(`Flagged for ${flags.length} statistical anomalies in billing patterns.`);
  }
  return parts.slice(0, 2).join(' ');
}

function toTitleCase(str: string): string {
  if (!str) return str;
  if (str === str.toUpperCase() && str.length > 3) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  return str;
}

function getProviderName(npi: string): string | null {
  try {
    const detailPath = path.join(process.cwd(), 'public', 'data', 'providers', `${npi}.json`);
    if (fs.existsSync(detailPath)) {
      const detail = JSON.parse(fs.readFileSync(detailPath, 'utf-8'));
      return toTitleCase(detail.name) || null;
    }
  } catch {}
  return null;
}

export default function InsightsIndex() {
  // Build suspicious providers list
  const threeFlags = (smartWatchlist as any[]).filter((p: any) => p.flagCount >= 3);
  const mlData = mlScores as any;
  const highMlSmall = (mlData.smallProviderFlags || [])
    .filter((p: any) => p.mlScore > 0.85)
    .sort((a: any, b: any) => b.mlScore - a.mlScore);

  // Merge: smart watchlist 3+ flags, plus high-scoring small ML providers
  const seenNpis = new Set<string>();
  const suspiciousList: any[] = [];

  // Add 3+ flag providers sorted by flag count then totalPaid
  const sortedThree = [...threeFlags].sort((a: any, b: any) => b.flagCount - a.flagCount || b.totalPaid - a.totalPaid);
  for (const p of sortedThree) {
    if (seenNpis.has(p.npi)) continue;
    seenNpis.add(p.npi);
    suspiciousList.push({ ...p, name: toTitleCase(p.name), source: 'smart' });
  }

  // Add high ML small providers
  for (const p of highMlSmall) {
    if (seenNpis.has(p.npi)) continue;
    seenNpis.add(p.npi);
    const name = getProviderName(p.npi);
    suspiciousList.push({ ...p, name: name || `NPI: ${p.npi}`, source: 'ml' });
  }

  const topSuspicious = suspiciousList.slice(0, 8);

  // Build small provider spotlight
  const smallSpotlight = highMlSmall.slice(0, 5).map((p: any) => ({
    ...p,
    name: getProviderName(p.npi) || `NPI: ${p.npi}`,
  }));

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

      {/* Most Suspicious Providers */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-red-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Risk Watchlist Highlights
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">Most Suspicious Providers</h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            The most concerning cases from our unified risk system. These providers triggered 3 or more
            independent anomaly flags, or scored extremely high on our ML fraud detection model.
          </p>
        </div>

        <div className="space-y-3">
          {topSuspicious.map((p: any) => {
            const flags = p.flags || [];
            const flagCount = p.flagCount || flags.length;
            const summary = p.source === 'smart' ? buildSummary(p) : `ML model scores this provider at ${(p.mlScore * 100).toFixed(1)}%, indicating billing patterns similar to confirmed fraud cases.`;

            return (
              <Link key={p.npi} href={`/providers/${p.npi}`}
                className={`block border rounded-xl p-5 hover:border-opacity-60 transition-all group ${riskBgColor(flagCount)}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                        {p.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${riskColor(flagCount)} ${riskBgColor(flagCount)}`}>
                        {riskLabel(flagCount)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {p.state ? `${stateName(p.state)} (${p.state})` : ''} &middot; NPI: {p.npi}
                      {p.specialty ? ` \u00b7 ${p.specialty}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-white tabular-nums">{formatMoney(p.totalPaid)}</p>
                    <p className="text-[10px] text-slate-500">total spending</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-3">{summary}</p>

                <div className="flex flex-wrap gap-1.5">
                  {flags.map((f: string) => {
                    const info = getFlagInfo(f);
                    return (
                      <span key={f} className={`text-[10px] px-2 py-0.5 rounded border ${info.bgColor} ${info.color}`}>
                        {info.label}
                      </span>
                    );
                  })}
                  {p.source === 'ml' && (
                    <span className="text-[10px] px-2 py-0.5 rounded border bg-purple-500/15 border-purple-500/30 text-purple-400">
                      ML Score: {(p.mlScore * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link href="/watchlist" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-medium px-6 py-2.5 rounded-lg border border-dark-500 transition-all text-sm">
            View full risk watchlist
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* Small Provider Fraud Spotlight */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-purple-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Machine Learning Detection
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">Small Provider Fraud Spotlight</h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Fraud isn&apos;t just about big billers. Our ML model identified small providers whose billing patterns
            closely match confirmed fraud cases from the OIG exclusion list. These providers bill between $10K
            and $1M but score higher than many $100M+ organizations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {smallSpotlight.map((p: any) => (
            <Link key={p.npi} href={`/providers/${p.npi}`}
              className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-purple-500/30 hover:bg-dark-700/50 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <span className="text-purple-400 font-bold text-sm tabular-nums">{(p.mlScore * 100).toFixed(0)}%</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{p.name}</h3>
                  <p className="text-[10px] text-slate-500">NPI: {p.npi}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500">Total Billing</span>
                <span className="text-sm font-bold text-white tabular-nums">{formatMoney(p.totalPaid)}</span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-1.5 mb-1">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(p.mlScore * 100, 100)}%` }} />
              </div>
              <p className="text-[10px] text-slate-500">ML fraud risk score</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 bg-dark-800/50 border border-dark-500/30 rounded-xl p-5">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-slate-300 font-medium">About these scores:</span> Our random forest model was trained on features from {(mlScores as any).totalProviders?.toLocaleString()} providers
            and validated against the HHS-OIG exclusion list. A score above 85% means the provider&apos;s billing patterns
            are statistically similar to providers who were later excluded for fraud. This is not proof of fraud &mdash;
            it&apos;s a signal that warrants closer inspection.
          </p>
        </div>
      </section>
    </div>
  );
}
