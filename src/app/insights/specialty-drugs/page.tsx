import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber, hcpcsDescription } from "@/lib/format";
import pharmaData from "../../../../public/data/specialty-pharma.json";

/* Extra J-code descriptions not in the main hcpcsDescription lookup */
const jCodeDescriptions: Record<string, string> = {
  J2326: "Nusinersen (Spinraza)",
  J2426: "Canakinumab (Ilaris)",
  J7999: "Compounded drug, NOC",
  J0642: "Injectable, NOC",
  J0548: "Injectable, NOC",
  J0178: "Emicizumab-kxwh (Hemlibra)",
  J0039: "Not otherwise classified",
  J9395: "Tisagenlecleucel (Kymriah)",
  J2350: "Ocrelizumab (Ocrevus)",
  J3584: "Burosumab-twza (Crysvita)",
  J1726: "Trastuzumab (Herceptin)",
  J7170: "Emicizumab (Hemlibra) prefilled syringe",
  J3590: "Unclassified biologic",
  J9354: "Ado-trastuzumab emtansine",
  J3397: "Ustekinumab (Stelara)",
};

function getJCodeDescription(code: string): string {
  return hcpcsDescription(code) || jCodeDescriptions[code] || "";
}

export const metadata: Metadata = {
  title: "Inside Medicaid's Most Expensive Drugs — Specialty J-Codes — Medicaid",
  description: "50 provider-administered drugs billed through Medicaid as J-codes. The most expensive costs $92,158 per claim. Combined spending exceeds $3.5 billion.",
  openGraph: {
    title: "Inside Medicaid's Most Expensive Drugs",
    description: "50 specialty J-codes billed through Medicaid. Many cost over $10,000 per claim. Combined spending: $3.5B+.",
  },
};

export default function SpecialtyDrugs() {
  const totalSpending = pharmaData.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const totalCodes = pharmaData.length;
  const mostExpensive = pharmaData[0];
  const avgProviderCount = Math.round(pharmaData.reduce((sum: number, p: any) => sum + p.providerCount, 0) / totalCodes);
  const over10k = pharmaData.filter((p: any) => p.costPerClaim >= 10000);
  const totalBenes = pharmaData.reduce((sum: number, p: any) => sum + p.totalBenes, 0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Specialty Drugs</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-xs font-medium text-amber-400">Drug Costs</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Inside Medicaid&apos;s Most Expensive Drugs
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          J-codes are provider-administered drugs billed directly through Medicaid — injections,
          infusions, and therapies given in clinics and hospitals. Many cost over $10,000 per claim.
          Some treat rare diseases with tiny patient populations. The spending concentration is extreme.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{formatMoney(mostExpensive.costPerClaim)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Most expensive / claim</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{formatMoney(totalSpending)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Total J-code spending</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{totalCodes}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">J-codes tracked</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{avgProviderCount}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Avg providers / code</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          When most people think of drug costs, they think of prescriptions filled at a pharmacy.
          But some of the most expensive drugs in Medicaid never pass through a pharmacy counter.
          They&apos;re administered by providers — injected, infused, or implanted — and billed using
          HCPCS J-codes. These {totalCodes} codes represent some of the highest per-claim costs
          in the entire Medicaid system.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The most expensive: {formatMoney(mostExpensive.costPerClaim)} per claim</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Code <span className="text-amber-400 font-semibold">{mostExpensive.code}</span>
            {getJCodeDescription(mostExpensive.code) ? ` (${getJCodeDescription(mostExpensive.code)})` : ''} averages{' '}
            <span className="text-amber-400 font-semibold">{formatMoney(mostExpensive.costPerClaim)}</span> per claim.
            Just <span className="text-white font-semibold">{mostExpensive.providerCount} provider{mostExpensive.providerCount !== 1 ? 's' : ''}</span> billed
            it, serving {formatNumber(mostExpensive.totalBenes)} beneficiaries for a total
            of <span className="text-white font-semibold">{formatMoney(mostExpensive.totalPaid)}</span>.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The spending concentration is striking. <span className="text-white font-semibold">{over10k.length} of {totalCodes} codes</span> cost
          more than $10,000 per claim, but together they account for billions in total spending.
          Many of these drugs treat rare or complex conditions — spinal muscular atrophy,
          hemophilia, multiple sclerosis — where a single injection can cost more than a year&apos;s rent.
        </p>

        <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Extreme provider concentration</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Many of these drugs are billed by just <span className="text-red-400 font-semibold">1–3 providers</span> nationwide.
            The average J-code in this list is billed by only {avgProviderCount} providers, meaning a
            handful of specialty centers control access to — and billing for — the most expensive
            therapies Medicaid covers. This creates both monopoly pricing risk and fraud vulnerability.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The total Medicaid spend across these {totalCodes} J-codes
          is <span className="text-white font-semibold">{formatMoney(totalSpending)}</span>, serving{' '}
          <span className="text-white font-semibold">{formatNumber(totalBenes)} beneficiaries</span>.
          The biggest single code by total spending is{' '}
          {(() => {
            const biggest = [...pharmaData].sort((a: any, b: any) => b.totalPaid - a.totalPaid)[0];
            return (
              <>
                <span className="text-amber-400 font-semibold">{biggest.code}</span>
                {getJCodeDescription(biggest.code) ? ` (${getJCodeDescription(biggest.code)})` : ''} at{' '}
                <span className="text-white font-semibold">{formatMoney(biggest.totalPaid)}</span>
              </>
            );
          })()}.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Context: These costs reflect real medical need</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Many of these drugs are life-saving treatments for conditions with no alternatives.
            High per-claim costs don&apos;t automatically indicate waste or fraud — they reflect the
            reality of specialty pharmaceuticals. However, the extreme provider concentration and
            the magnitude of spending make these codes worth watching for billing anomalies.
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          All {totalCodes} Specialty J-Codes by Cost Per Claim
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Code</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Description</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Cost / Claim</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Providers</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Beneficiaries</th>
              </tr>
            </thead>
            <tbody>
              {pharmaData.map((p: any, i: number) => (
                <tr key={p.code} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Code" className="py-2.5 pr-3">
                    <Link href={`/procedures/${p.code}`} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                      {p.code}
                    </Link>
                  </td>
                  <td data-label="Description" className="py-2.5 pr-3 text-slate-400 text-xs max-w-[200px] truncate">
                    {getJCodeDescription(p.code) || <span className="text-slate-600 font-mono">{p.code}</span>}
                  </td>
                  <td data-label="Cost/Claim" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(p.costPerClaim)}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-slate-300 tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Providers" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(p.providerCount)}</td>
                  <td data-label="Beneficiaries" className="py-2.5 text-right text-slate-400 tabular-nums">{formatNumber(p.totalBenes)}</td>
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
            <span>The most expensive J-code (<span className="text-amber-400 font-semibold">{mostExpensive.code}</span>) costs <span className="text-white font-semibold">{formatMoney(mostExpensive.costPerClaim)}</span> per claim — billed by just {mostExpensive.providerCount} provider{mostExpensive.providerCount !== 1 ? 's' : ''}.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>Total Medicaid spending on these {totalCodes} J-codes: <span className="text-white font-semibold">{formatMoney(totalSpending)}</span>, serving {formatNumber(totalBenes)} beneficiaries.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span><span className="text-red-400 font-semibold">{over10k.length} codes</span> cost more than $10,000 per claim. Many are billed by fewer than 5 providers nationwide.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>The average J-code is billed by only <span className="text-white font-semibold">{avgProviderCount} providers</span> — extreme concentration that warrants oversight.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related Insights */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018–2024) · 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Medicaid's most expensive drug costs ${formatMoney(mostExpensive.costPerClaim)} per claim. ${totalCodes} specialty J-codes total ${formatMoney(totalSpending)} in spending.`)}&url=${encodeURIComponent("https://openmedicaid.org/insights/specialty-drugs")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Insights</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/insights/most-expensive" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">The Most Expensive Things Medicaid Pays For</p>
            <p className="text-xs text-slate-500 mt-1">$92,158 per claim for spinal muscular atrophy →</p>
          </Link>
          <Link href="/insights/specialty-breakdown" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Where Does $1 Trillion in Medicaid Money Go?</p>
            <p className="text-xs text-slate-500 mt-1">15 Supports Brokerage providers averaged $720M each →</p>
          </Link>
        </div>
      </div>
    </article>
  );
}
