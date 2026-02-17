import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { formatMoney, formatNumber } from "@/lib/format";
import azDataRaw from "../../../../public/data/az-new-entrants.json";

function toTitleCase(str: string): string {
  if (!str) return str;
  if (str === str.toUpperCase() && str.length > 3) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  return str;
}

// Enrich provider data with names from detail files at build time
const azData = azDataRaw.map((p: any) => {
  if (p.name) return p;
  try {
    const detailPath = path.join(process.cwd(), 'public', 'data', 'providers', `${p.npi}.json`);
    if (fs.existsSync(detailPath)) {
      const detail = JSON.parse(fs.readFileSync(detailPath, 'utf-8'));
      if (detail.name) return { ...p, name: toTitleCase(detail.name) };
    }
  } catch {}
  return p;
});

export const metadata: Metadata = {
  title: "The Arizona Problem — New Behavioral Health Clinics Billing Millions — Medicaid",
  description: "46 Arizona providers that appeared in 2022+ have already billed over $800M combined. Many operated for less than a year. Phoenix and Mesa dominate.",
  openGraph: {
    title: "The Arizona Problem: New Clinics, Massive Billing",
    description: "46 Arizona providers appeared in 2022+ and immediately started billing millions. Combined: $800M+. Average time active: under 14 months.",
  },
};

export default function ArizonaProblem() {
  const totalSpending = azData.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const totalProviders = azData.length;
  const avgMonths = Math.round(azData.reduce((sum: number, p: any) => sum + p.monthsActive, 0) / totalProviders);
  const totalBenes = azData.reduce((sum: number, p: any) => sum + p.totalBenes, 0);

  const phoenixCount = azData.filter((p: any) => p.city === "PHOENIX").length;
  const mesaCount = azData.filter((p: any) => p.city === "MESA").length;

  const cityCounts: Record<string, number> = {};
  azData.forEach((p: any) => {
    cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
  });

  const shortTimers = azData.filter((p: any) => p.monthsActive <= 12);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">The Arizona Problem</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 text-xs font-medium text-orange-400">Geographic Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The Arizona Problem
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Starting in 2022, dozens of new providers appeared in Arizona and immediately
          began billing Medicaid for millions of dollars. Many operated for less than a year
          before disappearing from the data. The concentration in Phoenix and its suburbs is striking.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-orange-400 tabular-nums">{totalProviders}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">New AZ providers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{formatMoney(totalSpending)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Total spending</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{avgMonths}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Avg months active</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{shortTimers.length}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Active ≤12 months</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          Something unusual happened in Arizona starting in early 2022. Dozens of new providers — many with
          no prior Medicaid billing history — registered NPIs and began submitting claims. Within months,
          some were billing at rates that would put them among the top providers in the entire country.
        </p>

        <div className="bg-dark-800 border-l-4 border-orange-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The top biller: $62M in 11 months</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The highest-billing new entrant in Arizona billed <span className="text-orange-400 font-semibold">{formatMoney(azData[0].totalPaid)}</span> in
            just <span className="text-white font-semibold">{azData[0].monthsActive} months</span> — averaging{' '}
            <span className="text-orange-400 font-semibold">{formatMoney(azData[0].totalPaid / azData[0].monthsActive)}/month</span>.
            Their first billing month was {azData[0].firstMonth}, and by {azData[0].lastMonth} they had served{' '}
            {formatNumber(azData[0].totalBenes)} beneficiaries with {formatNumber(azData[0].totalClaims)} claims.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The geographic concentration is remarkable. <span className="text-white font-semibold">{phoenixCount} of {totalProviders}</span> providers
          are based in Phoenix alone. Add Mesa ({mesaCount}), Scottsdale, Tempe, and other Maricopa County suburbs
          and the vast majority are clustered in the greater Phoenix metro area. This pattern is consistent with
          what fraud investigators call &quot;geographic clustering&quot; — where fraudulent operators set up multiple entities
          in the same region.
        </p>

        <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Short lifespans, big billing</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            <span className="text-red-400 font-semibold">{shortTimers.length} of {totalProviders} providers</span> were active for 12 months or less.
            One provider billed <span className="text-white font-semibold">{formatMoney(azData.find((p: any) => p.monthsActive === 4)?.totalPaid || 0)}</span> in
            just 4 months. Another billed <span className="text-white font-semibold">{formatMoney(azData[1].totalPaid)}</span> in 6 months.
            Legitimate healthcare providers typically take years to build patient volume to these levels.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Arizona&apos;s behavioral health system has faced scrutiny before. The state expanded Medicaid under
          the ACA and later expanded access to behavioral health services, creating opportunities for
          both legitimate providers and bad actors. The pattern here — new NPIs, rapid billing ramp-up,
          short operational lifespans, and geographic clustering — matches profiles seen in previous
          Medicaid fraud cases in other states.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Context: Not all are necessarily fraudulent</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Some of these providers may be legitimate clinics that expanded rapidly to meet demand, rebranded
            from existing practices, or took over contracts from other providers. However, the combination of
            new registration, immediate high-volume billing, and short operational periods warrants investigation.
            Several of these providers bill for only {azData.filter((p: any) => p.codeCount <= 3).length > 0 ? '1-3' : 'a handful of'} procedure codes, suggesting narrow service models.
          </p>
        </div>
      </div>

      {/* Top 20 Highlight */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          Top 20 Arizona New Entrants
        </h2>
        <div className="space-y-2">
          {azData.slice(0, 20).map((p: any, i: number) => (
            <div key={p.npi} className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-3 hover:border-dark-400 transition-colors">
              <span className="text-xl font-extrabold text-slate-700 w-6 text-right tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <Link href={`/providers/${p.npi}`} className="text-white font-semibold hover:text-orange-400 transition-colors truncate block">
                  {p.name || <span className="font-mono text-sm text-slate-400">NPI {p.npi}</span>}
                </Link>
                <p className="text-xs text-slate-500">{p.city}, AZ · First billed: {p.firstMonth}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-orange-400 font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                <p className="text-[10px] text-slate-600">{p.monthsActive} months active</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Data Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          All {totalProviders} Arizona New Entrants (2022+)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">City</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">First Month</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Months</th>
              </tr>
            </thead>
            <tbody>
              {azData.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-orange-400 transition-colors">
                      {p.name || <span className="font-mono text-xs">NPI {p.npi}</span>}
                    </Link>
                  </td>
                  <td data-label="City" className="py-2.5 pr-3 text-slate-500">{p.city}</td>
                  <td data-label="First Month" className="py-2.5 pr-3 text-slate-400 tabular-nums">{p.firstMonth}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Claims" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(p.totalClaims)}</td>
                  <td data-label="Months" className="py-2.5 text-right text-slate-400 tabular-nums">{p.monthsActive}</td>
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
            <span className="text-orange-400 mt-0.5">&#9656;</span>
            <span><span className="text-orange-400 font-semibold">{totalProviders} new Arizona providers</span> that first appeared in 2022 or later have billed a combined <span className="text-white font-semibold">{formatMoney(totalSpending)}</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">&#9656;</span>
            <span>The average time active is just <span className="text-orange-400 font-semibold">{avgMonths} months</span>. {shortTimers.length} providers were active for 12 months or less.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>Phoenix ({phoenixCount}), Mesa ({mesaCount}), and Scottsdale account for the majority — a classic geographic clustering pattern.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>The top biller earned <span className="text-white font-semibold">{formatMoney(azData[0].totalPaid)}</span> in just {azData[0].monthsActive} months — averaging {formatMoney(azData[0].totalPaid / azData[0].monthsActive)}/month.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related Insights */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018–2024) · 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${totalProviders} new Arizona providers appeared in 2022+ and immediately billed ${formatMoney(totalSpending)}. Average time active: ${avgMonths} months.`)}&url=${encodeURIComponent("https://medicaidmoneytracker.com/insights/arizona-problem")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Insights</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/insights/pandemic-profiteers" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Who Made the Most Money During COVID?</p>
            <p className="text-xs text-slate-500 mt-1">The biggest pandemic billing jumps →</p>
          </Link>
          <Link href="/insights/fastest-growing" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">The Procedures Growing Fastest in Medicaid</p>
            <p className="text-xs text-slate-500 mt-1">ABA therapy grew 1,500%+ →</p>
          </Link>
        </div>
      </div>
    </article>
  );
}
