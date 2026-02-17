import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import homeCareData from "../../../../public/data/ny-home-care.json";

export const metadata: Metadata = {
  title: "The New York Home Care Machine — $47B+ in Personal Care Spending — Medicaid",
  description: "New York dominates Medicaid personal care spending. Brooklyn alone has dozens of agencies billing $200M+ each. The top 100 T1019 billers account for over $47 billion.",
  openGraph: {
    title: "The New York Home Care Machine",
    description: "NY's home care industry bills Medicaid for billions. Brooklyn agencies dominate the top 100 list. One provider billed $7.2B over 7 years.",
  },
};

export default function NYHomeCare() {
  const totalSpending = homeCareData.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const nyProviders = homeCareData.filter((p: any) => p.state === "NY");
  const nySpending = nyProviders.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const brooklynProviders = homeCareData.filter((p: any) => p.city === "BROOKLYN");
  const brooklynSpending = brooklynProviders.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const totalBenes = homeCareData.reduce((sum: number, p: any) => sum + p.totalBenes, 0);

  const nyPct = ((nyProviders.length / homeCareData.length) * 100).toFixed(0);
  const nySpendPct = ((nySpending / totalSpending) * 100).toFixed(0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">NY Home Care</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-400">State Investigation</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The New York Home Care Machine
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          New York&apos;s home care industry is unlike anything else in American healthcare. Dozens of
          Brooklyn-based agencies each bill Medicaid hundreds of millions of dollars. One provider billed
          over $7 billion in seven years. The state accounts for {nyPct}% of the top 100 personal care billers.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-blue-400 tabular-nums">{nyProviders.length}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">NY in top 100</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{formatMoney(nySpending)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">NY T1019 spending</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{brooklynProviders.length}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Brooklyn agencies</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{formatMoney(brooklynSpending)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Brooklyn spending</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          Procedure code T1019 — &quot;Personal care services, per 15 minutes&quot; — is one of the most heavily billed
          codes in all of Medicaid. It covers home health aides who help with daily activities: bathing, dressing,
          meal preparation, medication reminders. In New York, this code is the backbone of a massive home care
          industry driven largely by the Consumer Directed Personal Assistance Program (CDPAP).
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The scale is staggering</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The top 100 T1019 billers in Medicaid received <span className="text-blue-400 font-semibold">{formatMoney(totalSpending)}</span> over
            seven years. New York providers account for <span className="text-white font-semibold">{nyPct}%</span> of
            this list and <span className="text-blue-400 font-semibold">{nySpendPct}%</span> of
            the total spending. The single largest biller — based in Latham, NY — received{' '}
            <span className="text-white font-semibold">{formatMoney(homeCareData.find((p: any) => p.npi === "1417262056")?.totalPaid || 0)}</span> with{' '}
            {formatNumber(homeCareData.find((p: any) => p.npi === "1417262056")?.totalClaims || 0)} claims.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Brooklyn is the epicenter. <span className="text-white font-semibold">{brooklynProviders.length} of the top 100</span> billers
          are based in Brooklyn, collectively billing <span className="text-white font-semibold">{formatMoney(brooklynSpending)}</span>.
          Other NYC boroughs — Queens (Flushing, Forest Hills, Rego Park), the Bronx, and Manhattan — add
          even more. The concentration of home care agencies in New York City is unmatched anywhere in the country.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The CDPAP factor</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            New York&apos;s Consumer Directed Personal Assistance Program allows Medicaid beneficiaries to hire
            their own caregivers — including family members. This has driven explosive growth in home care
            spending. CDPAP agencies serve as fiscal intermediaries, processing payments for thousands of
            individual caregivers. This model explains why individual agencies can bill billions: they&apos;re
            not employing the caregivers directly, they&apos;re processing their paperwork and payroll.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The numbers reveal an industry operating at enormous scale. The top provider served{' '}
          <span className="text-white font-semibold">{formatNumber(homeCareData[0].totalBenes)}</span> beneficiaries
          over {homeCareData[0].monthsActive} months. Even the 100th-ranked provider billed{' '}
          <span className="text-white font-semibold">{formatMoney(homeCareData[homeCareData.length - 1].totalPaid)}</span>.
          In most states, the largest home care provider wouldn&apos;t crack the top 50 of this list.
        </p>

        <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Fraud concerns</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            New York&apos;s home care system has been the subject of multiple fraud investigations. In 2023,
            several CDPAP agencies were charged with billing for services never provided. The sheer volume
            of billing makes oversight difficult — when a single agency processes millions of claims,
            detecting fraudulent ones becomes a needle-in-a-haystack problem. This data doesn&apos;t prove
            fraud, but the scale demands scrutiny.
          </p>
        </div>
      </div>

      {/* Top 20 Highlight */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          Top 20 Personal Care Billers
        </h2>
        <div className="space-y-2">
          {homeCareData.slice(0, 20).map((p: any, i: number) => (
            <div key={p.npi} className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-3 hover:border-dark-400 transition-colors">
              <span className="text-xl font-extrabold text-slate-700 w-6 text-right tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                {p.name ? (
                  <Link href={`/providers/${p.npi}`} className="text-white font-semibold hover:text-blue-400 transition-colors truncate block">
                    {p.name}
                  </Link>
                ) : (
                  <Link href={`/providers/${p.npi}`} className="font-mono text-blue-400 hover:text-blue-300 transition-colors truncate block">
                    NPI {p.npi}
                  </Link>
                )}
                <p className="text-xs text-slate-500">{p.city}, {p.state} · {p.monthsActive} months active</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-blue-400 font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                <p className="text-[10px] text-slate-600">{formatNumber(p.totalBenes)} beneficiaries</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Data Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          All 100 Top T1019 Personal Care Billers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Location</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Beneficiaries</th>
              </tr>
            </thead>
            <tbody>
              {homeCareData.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    {p.name ? (
                      <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-blue-400 transition-colors">
                        {p.name}
                      </Link>
                    ) : (
                      <Link href={`/providers/${p.npi}`} className="font-mono text-blue-400 hover:text-blue-300 transition-colors">
                        NPI {p.npi}
                      </Link>
                    )}
                  </td>
                  <td data-label="Location" className="py-2.5 pr-3 text-slate-500">{p.city}, {p.state}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Claims" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(p.totalClaims)}</td>
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
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>New York accounts for <span className="text-blue-400 font-semibold">{nyProviders.length} of the top 100</span> T1019 billers and <span className="text-white font-semibold">{nySpendPct}%</span> of spending ({formatMoney(nySpending)}).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Brooklyn alone has <span className="text-blue-400 font-semibold">{brooklynProviders.length} agencies</span> in the top 100, billing a combined <span className="text-white font-semibold">{formatMoney(brooklynSpending)}</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>The CDPAP program, which lets beneficiaries hire family as caregivers, drives much of this spending. Agencies act as fiscal intermediaries processing billions in payments.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>The total across all 100 top billers: <span className="text-white font-semibold">{formatMoney(totalSpending)}</span> — serving {formatNumber(totalBenes)} beneficiaries.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related Insights */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018–2024) · 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`NY's home care machine: ${nyProviders.length} of top 100 personal care billers are in New York. Brooklyn alone: ${formatMoney(brooklynSpending)}. See the data.`)}&url=${encodeURIComponent("https://openmedicaid.org/insights/ny-home-care")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Insights</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/insights/specialty-breakdown" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Where Does $1 Trillion in Medicaid Money Actually Go?</p>
            <p className="text-xs text-slate-500 mt-1">264 home health providers received $71B →</p>
          </Link>
          <Link href="/insights/top-doctors" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">The Highest-Paid Individual Medicaid Providers</p>
            <p className="text-xs text-slate-500 mt-1">Only 2 individuals in the top 2,000 →</p>
          </Link>
        </div>
      </div>
    </article>
  );
}
