import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber, hcpcsDescription } from "@/lib/format";
import RelatedInsights from "@/components/RelatedInsights";
import expensiveData from "../../../../public/data/most-expensive-procedures.json";

export const metadata: Metadata = {
  title: "The Most Expensive Things Medicaid Pays For — Per-Claim Costs",
  description: "One procedure costs $92,158 per claim — it's a drug for spinal muscular atrophy. See the 50 most expensive per-claim procedures in Medicaid.",
  openGraph: {
    title: "The Most Expensive Things Medicaid Pays For",
    description: "$92,158 PER CLAIM. That's what Medicaid pays for one injection of Spinraza. See the 50 most expensive procedures.",
  },
};

export default function MostExpensive() {
  const topProcedure = expensiveData[0] as any;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Most Expensive</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-xs font-medium text-amber-400">Drug &amp; Procedure Costs</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">4 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The Most Expensive Things Medicaid Pays For
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Some Medicaid claims cost more than a house. The most expensive single procedure code
          averages <span className="text-amber-400 font-semibold">$92,158 per claim</span>. Here&apos;s what
          the most expensive items on the Medicaid bill actually are.
        </p>
      </div>

      {/* Hero Stat */}
      <div className="bg-dark-800 border border-amber-500/20 rounded-2xl p-8 mb-12 text-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Most Expensive Per Claim</p>
        <p className="text-5xl md:text-6xl font-extrabold text-amber-400 tabular-nums mb-3">{formatMoney(topProcedure.costPerClaim)}</p>
        <p className="text-white font-semibold text-lg mb-1">
          <span className="font-mono text-amber-300">{topProcedure.code}</span> &mdash; {hcpcsDescription(topProcedure.code) || 'Specialty drug injection'}
        </p>
        <p className="text-sm text-slate-500">
          {formatNumber(topProcedure.totalClaims)} claims &middot; {formatMoney(topProcedure.totalPaid)} total &middot; {topProcedure.providerCount} provider{topProcedure.providerCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          The most expensive procedures in Medicaid are overwhelmingly <span className="text-white font-semibold">specialty drug injections</span>.
          These are J-codes &mdash; the HCPCS billing codes used for drugs administered by healthcare providers
          rather than dispensed at pharmacies. Many treat rare, life-threatening conditions.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Why are these so expensive?</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-semibold">J2326</span> ({hcpcsDescription('J2326') || 'Nusinersen/Spinraza injection'}) treats spinal muscular atrophy (SMA),
            a rare genetic disease. The drug costs approximately <span className="text-white font-semibold">$750,000 for the first year</span> of treatment.
            <span className="text-amber-400 font-semibold ml-1">J7170</span> ({hcpcsDescription('J7170') || 'Emicizumab/Hemlibra injection'}) treats hemophilia,
            costing up to $500,000/year. These are genuine lifesaving treatments, but their costs reveal
            the enormous financial pressure specialty drugs place on Medicaid.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Note how concentrated these drugs are: <span className="font-mono text-white">J2326</span> is billed by only{' '}
          <span className="text-amber-400 font-semibold">{topProcedure.providerCount} providers</span>, and{' '}
          <span className="font-mono text-white">J1426</span> ({hcpcsDescription('J1426') || 'Casimersen injection'}) by just{' '}
          <span className="text-amber-400 font-semibold">1 provider</span>. These are specialty centers &mdash;
          often the only facilities in a region that can administer these treatments.
        </p>
      </div>

      {/* Top 10 Visual */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          Top 10 Most Expensive Per Claim
        </h2>
        <div className="space-y-2">
          {expensiveData.slice(0, 10).map((p: any, i: number) => {
            const maxCost = (expensiveData[0] as any).costPerClaim;
            const barWidth = (p.costPerClaim / maxCost) * 100;
            return (
              <div key={p.code} className="bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg font-extrabold text-slate-700 w-6 text-right tabular-nums">{i + 1}</span>
                    <div className="min-w-0">
                      <Link href={`/procedures/${p.code}`} className="font-mono text-amber-400 font-bold hover:text-amber-300 transition-colors">{p.code}</Link>
                      <p className="text-xs text-slate-500 truncate">{hcpcsDescription(p.code) || 'Specialty procedure'}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-white font-extrabold tabular-nums">{formatMoney(p.costPerClaim)}</p>
                    <p className="text-[10px] text-slate-600">{formatNumber(p.totalClaims)} claims · {p.providerCount} provider{p.providerCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full" style={{ width: `${barWidth}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          All 50 Most Expensive Procedures
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Code</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Description</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Cost/Claim</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Providers</th>
              </tr>
            </thead>
            <tbody>
              {expensiveData.map((p: any, i: number) => (
                <tr key={p.code} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Code" className="py-2.5 pr-3">
                    <Link href={`/procedures/${p.code}`} className="font-mono text-amber-400 hover:text-amber-300 transition-colors font-semibold">{p.code}</Link>
                  </td>
                  <td data-label="Description" className="py-2.5 pr-3 text-slate-400 text-xs">{hcpcsDescription(p.code) || '—'}</td>
                  <td data-label="Cost/Claim" className="py-2.5 pr-3 text-right text-white font-bold tabular-nums">{formatMoney(p.costPerClaim)}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-slate-300 tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Claims" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(p.totalClaims)}</td>
                  <td data-label="Providers" className="py-2.5 text-right text-slate-500 tabular-nums">{p.providerCount}</td>
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
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>The most expensive Medicaid procedures are specialty drug injections (J-codes) treating rare genetic diseases.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>Spinraza (J2326) costs <span className="text-amber-400 font-semibold">$92,158 per claim</span> and is administered by only 3 providers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>Many of the most expensive codes are billed by only 1&ndash;3 providers &mdash; specialty centers for rare disease treatment.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>Specialty drugs represent a growing share of Medicaid spending despite treating a tiny fraction of beneficiaries.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("The most expensive thing Medicaid pays for: $92,158 PER CLAIM for one drug injection. See the full list of the 50 costliest procedures.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/most-expensive")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="most-expensive" relatedSlugs={["specialty-drugs", "specialty-breakdown", "fastest-growing"]} />
      </div>
    </article>
  );
}
