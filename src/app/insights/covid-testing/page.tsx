import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber, hcpcsDescription } from "@/lib/format";
import RelatedInsights from "@/components/RelatedInsights";
import testingData from "../../../../public/data/covid-testing-top-billers.json";

export const metadata: Metadata = {
  title: "The $4.7 Billion COVID Testing Bonanza — Medicaid Spending Data",
  description: "A single COVID test code billed $3.9 billion to Medicaid. LabCorp, Quest, and a New Jersey lab called Infinity Diagnostics dominated COVID testing billing.",
  openGraph: {
    title: "The $4.7 Billion COVID Testing Bonanza",
    description: "Code U0003 alone = $3.9 BILLION. LabCorp ($174M), Quest ($122M), and Infinity Diagnostics ($129M) were top billers. See the full data.",
  },
};

export default function CovidTesting() {
  const totalSpending = testingData.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const totalClaims = testingData.reduce((sum: number, p: any) => sum + p.totalClaims, 0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">COVID Testing</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-medium text-emerald-400">COVID-19 Investigation</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The $4.7 Billion COVID Testing Bonanza
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          COVID testing became one of the biggest single-category payouts in Medicaid history.
          A single procedure code &mdash; U0003 &mdash; billed <span className="text-white font-semibold">$3.9 billion</span> alone.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Top 100 Testing Billers</p>
          <p className="text-2xl font-extrabold text-emerald-400 tabular-nums">{formatMoney(totalSpending)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">U0003 Code Alone</p>
          <p className="text-2xl font-extrabold text-white tabular-nums">$3.9B</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">87635 Growth</p>
          <p className="text-2xl font-extrabold text-amber-400 tabular-nums">$406 → $736M</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Claims</p>
          <p className="text-2xl font-extrabold text-white tabular-nums">{formatNumber(totalClaims)}</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          When COVID-19 hit, Medicaid paid for millions of diagnostic tests for low-income Americans.
          The numbers are staggering: code <span className="font-mono text-white">U0003</span> (<span className="text-slate-400">{hcpcsDescription('U0003') || 'Infectious disease detection (COVID-19)'}</span>)
          alone accounts for <span className="text-emerald-400 font-semibold">$3.9 billion</span> in Medicaid spending.
          Code <span className="font-mono text-white">87635</span> (<span className="text-slate-400">{hcpcsDescription('87635') || 'COVID-19 amplified probe detection'}</span>)
          went from just $406 in 2019 to <span className="text-white font-semibold">$736 million</span> by 2024.
        </p>

        <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The Infinity Diagnostics question</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Among the top billers are expected names like <span className="text-white">LabCorp ($174M)</span> and
            <span className="text-white"> Quest Diagnostics ($122M)</span> &mdash; the two largest lab chains in America.
            But one name stands out: <span className="text-red-400 font-semibold">Infinity Diagnostics Laboratory</span>,
            a New Jersey lab that billed <span className="text-red-400 font-semibold">$129 million</span>.
            That&apos;s more than Quest Diagnostics &mdash; for a single lab facility. This level of billing
            from a non-chain laboratory is extraordinary and warrants closer examination.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The top 100 COVID testing billers collectively billed <span className="font-semibold text-white">{formatMoney(totalSpending)}</span> to Medicaid.
          The pandemic created a blank check for testing labs &mdash; billions in taxpayer money with minimal oversight.
          The sheer volume created massive opportunities for overbilling and fraud that investigators are still
          uncovering. How much of this was genuinely necessary, and how much was opportunistic billing?
        </p>
      </div>

      {/* Top 10 Highlight */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-emerald-500 rounded-full" />
          Top 10 COVID Testing Billers
        </h2>
        <div className="space-y-2">
          {testingData.slice(0, 10).map((p: any, i: number) => {
            const isHighlight = p.name?.includes('INFINITY');
            return (
              <div key={p.npi} className={`flex items-center gap-4 bg-dark-800 border rounded-xl px-5 py-3 hover:border-dark-400 transition-colors ${isHighlight ? 'border-red-500/30' : 'border-dark-500/50'}`}>
                <span className="text-xl font-extrabold text-slate-700 w-6 text-right tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <Link href={`/providers/${p.npi}`} className={`font-semibold hover:text-emerald-400 transition-colors truncate block ${isHighlight ? 'text-red-400' : 'text-white'}`}>
                    {p.name || `NPI: ${p.npi}`}
                  </Link>
                  <p className="text-xs text-slate-500">{p.specialty}{p.city ? ` · ${p.city}, ${p.state}` : p.state ? ` · ${p.state}` : ''}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-emerald-400 font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                  <p className="text-[10px] text-slate-600">{formatNumber(p.totalClaims)} claims</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-emerald-500 rounded-full" />
          All 100 Top Testing Billers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">State</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
              </tr>
            </thead>
            <tbody>
              {testingData.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-emerald-400 transition-colors">
                      {p.name || `NPI: ${p.npi}`}
                    </Link>
                    {p.specialty && <span className="text-[10px] text-slate-600 block">{p.specialty}</span>}
                  </td>
                  <td data-label="State" className="py-2.5 pr-3 text-slate-500">{p.state || '—'}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Claims" className="py-2.5 text-right text-slate-400 tabular-nums">{formatNumber(p.totalClaims)}</td>
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
            <span className="text-emerald-400 mt-0.5">&#9656;</span>
            <span>A single COVID test code (U0003) billed <span className="text-white font-semibold">$3.9 billion</span> to Medicaid &mdash; one of the largest single-code payouts in program history.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">&#9656;</span>
            <span>LabCorp and Quest Diagnostics are the top two billers, as expected for the nation&apos;s largest lab chains.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>Infinity Diagnostics, a single NJ lab, billed <span className="text-red-400 font-semibold">$129M</span> &mdash; more than Quest Diagnostics. This is an extraordinary amount for a non-chain laboratory.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">&#9656;</span>
            <span>Code 87635 went from $406 in spending to $736M &mdash; a demonstration of how COVID reshaped Medicaid billing patterns overnight.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("The $4.7 Billion COVID Testing Bonanza: A single test code billed $3.9B to Medicaid. One NJ lab billed $129M.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/covid-testing")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="covid-testing" relatedSlugs={["covid-vaccines", "pandemic-profiteers", "fastest-growing"]} />
      </div>
    </article>
  );
}
