import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, formatNumber, stateName } from "@/lib/format";
import beneData from "../../../../public/data/top-beneficiary-counts.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Who Bills for the Most Patients? — Top Medicaid Providers by Beneficiary Count",
  description: "Some Medicaid providers serve over 100 million beneficiaries. Transportation brokers and managed care organizations dominate. Individual doctors typically see hundreds.",
  openGraph: {
    title: "Who Bills for the Most Patients?",
    description: "The top Medicaid provider serves 108M beneficiaries. Transportation brokers and managed care orgs dominate the list.",
  },
};

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

export default function MostPatients() {
  const enriched = beneData.map((p: any) => ({
    ...p,
    displayName: (p.name && p.name.trim()) ? toTitleCase(p.name) : getProviderName(p.npi) || `NPI: ${p.npi}`,
    displayCity: toTitleCase(p.city || ''),
  }));

  const top = enriched[0];
  const totalBenes = enriched.reduce((sum: number, p: any) => sum + p.totalBenes, 0);
  const totalSpending = enriched.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const medianClaimsPerBene = [...enriched].sort((a: any, b: any) => a.claimsPerBene - b.claimsPerBene)[Math.floor(enriched.length / 2)].claimsPerBene;

  // Find most common state
  const stateCounts: Record<string, number> = {};
  enriched.forEach((p: any) => {
    if (p.state) stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
  });
  const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0];

  // High claims-per-bene outliers
  const highClaimsPerBene = enriched.filter((p: any) => p.claimsPerBene >= 5);

  // Providers with millions of benes
  const millionPlus = enriched.filter((p: any) => p.totalBenes >= 1_000_000);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Most Patients</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs font-medium text-green-400">Provider Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Who Bills for the Most Patients?
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Some Medicaid providers bill for hundreds of thousands — even millions — of beneficiaries.
          These aren&apos;t individual doctors. They&apos;re pharmacy benefit managers, transportation brokers,
          and managed care organizations processing claims at massive scale. Individual physicians
          typically see only a few hundred patients.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-green-400 tabular-nums">{formatNumber(top.totalBenes)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Top bene count</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{formatMoney(totalSpending)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Combined spending</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-green-400 tabular-nums">{medianClaimsPerBene}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Median claims / bene</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{millionPlus.length}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">1M+ beneficiaries</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          The Medicaid billing data reveals an enormous range in how many patients a single provider serves.
          At the top of the list, the largest provider billed for over <span className="text-white font-semibold">{formatNumber(top.totalBenes)} beneficiaries</span> — more
          than the population of most countries. These aren&apos;t medical practices in the traditional sense.
          They&apos;re large organizations that process claims on behalf of networks of individual providers.
        </p>

        <div className="bg-dark-800 border-l-4 border-green-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The #1 provider: {formatNumber(top.totalBenes)} beneficiaries</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            <span className="text-green-400 font-semibold">{top.displayName}</span>
            {top.displayCity && top.state ? ` in ${top.displayCity}, ${top.state}` : ''} processed{' '}
            <span className="text-white font-semibold">{formatNumber(top.totalClaims)} claims</span> totaling{' '}
            <span className="text-green-400 font-semibold">{formatMoney(top.totalPaid)}</span>.
            With {formatNumber(top.codeCount)} different procedure codes, this is clearly a large
            organizational biller — not an individual practitioner.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The most common state among the top 100 is <span className="text-white font-semibold">{topState ? `${stateName(topState[0])} (${topState[1]} providers)` : 'unknown'}</span>.
          Large states with major Medicaid populations — California, New York, Texas, Florida — dominate
          the list, reflecting both population size and the scope of their Medicaid programs.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Scale vs. individual care</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-semibold">{millionPlus.length} providers</span> serve
            over 1 million beneficiaries each. Most have a claims-per-beneficiary ratio near 1.0–1.2,
            suggesting they process standardized, high-volume transactions. By contrast, providers
            with ratios above 5.0 are likely providing ongoing care to smaller populations —
            {highClaimsPerBene.length > 0 ? ` ${highClaimsPerBene.length} providers in this list have a ratio of 5.0+` : ' a pattern typical of chronic care management'}.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The combined spending of the top {enriched.length} providers by beneficiary count
          is <span className="text-white font-semibold">{formatMoney(totalSpending)}</span>. The largest
          single biller by spending in this group processed{' '}
          {(() => {
            const biggest = [...enriched].sort((a: any, b: any) => b.totalPaid - a.totalPaid)[0];
            return (
              <span className="text-green-400 font-semibold">{formatMoney(biggest.totalPaid)}</span>
            );
          })()}.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Context: Organizational vs. individual providers</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            High beneficiary counts don&apos;t indicate fraud — they indicate organizational scale.
            Pharmacy benefit managers, managed care organizations, and transportation brokers
            legitimately process millions of claims. The interesting anomalies are providers with
            both high beneficiary counts and unusual spending patterns or claims-per-beneficiary ratios.
          </p>
        </div>
      </div>

      {/* Top 20 Highlight */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-green-500 rounded-full" />
          Top 20 Providers by Beneficiary Count
        </h2>
        <div className="space-y-2">
          {enriched.slice(0, 20).map((p: any, i: number) => (
            <div key={p.npi} className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-3 hover:border-dark-400 transition-colors">
              <span className="text-xl font-extrabold text-slate-700 w-6 text-right tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <Link href={`/providers/${p.npi}`} className="text-white font-semibold hover:text-green-400 transition-colors truncate block">
                  {p.displayName}
                </Link>
                <p className="text-xs text-slate-500">
                  {p.displayCity && p.state ? `${p.displayCity}, ${p.state}` : p.state || '—'}
                  {' · '}{formatNumber(p.claimsPerBene)} claims/bene
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-green-400 font-bold tabular-nums">{formatNumber(p.totalBenes)}</p>
                <p className="text-[10px] text-slate-600">{formatMoney(p.totalPaid)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Data Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-green-500 rounded-full" />
          All {enriched.length} Providers by Beneficiary Count
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">State</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Beneficiaries</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims / Bene</th>
              </tr>
            </thead>
            <tbody>
              {enriched.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-green-400 transition-colors">
                      {p.displayName}
                    </Link>
                  </td>
                  <td data-label="State" className="py-2.5 pr-3 text-slate-500">{p.state || '—'}</td>
                  <td data-label="Beneficiaries" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatNumber(p.totalBenes)}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-slate-300 tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Claims/Bene" className="py-2.5 text-right text-slate-400 tabular-nums">{p.claimsPerBene}</td>
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
            <span className="text-green-400 mt-0.5">&#9656;</span>
            <span>The top provider bills for <span className="text-white font-semibold">{formatNumber(top.totalBenes)} beneficiaries</span> — organizational-scale billing, not individual practice.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">&#9656;</span>
            <span>The median claims-per-beneficiary ratio is <span className="text-white font-semibold">{medianClaimsPerBene}</span> — most top providers process standardized, high-volume transactions.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span><span className="text-amber-400 font-semibold">{millionPlus.length} providers</span> each serve over 1 million beneficiaries, combining for {formatMoney(totalSpending)} in total spending.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">&#9656;</span>
            <span>The most common state is <span className="text-white font-semibold">{topState ? `${stateName(topState[0])} (${topState[1]} providers)` : '—'}</span> among the top {enriched.length}.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related Insights */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018–2024) · 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`The top Medicaid provider bills for ${formatNumber(top.totalBenes)} beneficiaries. ${millionPlus.length} providers each serve 1M+.`)}&url=${encodeURIComponent("https://openmedicaid.org/insights/most-patients")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="most-patients" relatedSlugs={["billing-networks", "self-billers", "ny-home-care"]} />
      </div>
    </article>
  );
}
