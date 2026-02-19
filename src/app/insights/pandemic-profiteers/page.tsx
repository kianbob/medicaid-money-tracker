import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber, formatMoneyFull } from "@/lib/format";
import RelatedInsights from "@/components/RelatedInsights";
import pandemicData from "../../../../public/data/pandemic-billing-jumps.json";

export const metadata: Metadata = {
  title: "Who Made the Most Money During COVID? — Medicaid Pandemic Spending",
  description: "The City of Chicago went from $23M to $240M in Medicaid billing — a 942% increase. See the 100 providers with the biggest pandemic billing jumps.",
  openGraph: {
    title: "Who Made the Most Money During COVID?",
    description: "City of Chicago: +942%. Freedom Care LLC: +125%. See the 100 biggest pandemic billing jumps in Medicaid data.",
  },
};

export default function PandemicProfiteers() {
  const topJump = pandemicData[0] as any;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Pandemic Profiteers</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium text-red-400">COVID-19 Investigation</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">4 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Who Made the Most Money During COVID?
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          We compared every provider&apos;s pre-pandemic billing (2019) to their post-pandemic peak (2021).
          Some increases are legitimate. Others raise serious questions.
        </p>
      </div>

      {/* Key Findings */}
      <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-5 mb-12">
        <h2 className="text-white font-bold text-base mb-3">Key Findings</h2>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-red-400 mt-0.5 shrink-0">&#9656;</span>
            <span><span className="text-white font-semibold">City of Chicago: $23M → $240M (+942%)</span> — the single largest percentage jump among major billers</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-red-400 mt-0.5 shrink-0">&#9656;</span>
            <span><span className="text-white font-semibold">Consumer Direct Care Network Virginia: $0 → $2.1B</span> — didn&apos;t exist before 2020</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-red-400 mt-0.5 shrink-0">&#9656;</span>
            <span><span className="text-white font-semibold">COVID testing code U0003 generated $3.9B</span> in total Medicaid payments</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-red-400 mt-0.5 shrink-0">&#9656;</span>
            <span><span className="text-white font-semibold">46 new Arizona providers</span> appeared post-pandemic and immediately billed <span className="text-white font-semibold">$800M+ combined</span></span>
          </li>
        </ul>
      </div>

      {/* Featured Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {pandemicData.slice(0, 3).map((p: any) => (
          <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
            <Link href={`/providers/${p.npi}`} className="text-white font-bold text-sm hover:text-red-400 transition-colors block mb-2 truncate">
              {p.name || `NPI: ${p.npi}`}
            </Link>
            <p className="text-xs text-slate-500 mb-3">{p.city ? `${p.city}, ${p.state}` : p.state}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-0.5">Before</p>
                <p className="text-sm text-slate-400 tabular-nums">{formatMoney(p.prePay)}</p>
              </div>
              <div className="text-center px-2">
                <svg className="w-5 h-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-0.5">After</p>
                <p className="text-sm text-white font-bold tabular-nums">{formatMoney(p.postPay)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-dark-500/50 flex justify-between items-center">
              <span className="text-red-400 font-extrabold text-lg tabular-nums">+{p.growthPct.toFixed(0)}%</span>
              <span className="text-xs text-slate-500">+{formatMoney(p.dollarIncrease)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          The COVID-19 pandemic didn&apos;t just change healthcare &mdash; it reshaped how money flows through Medicaid.
          Some providers saw their billing explode by hundreds or thousands of percent. While some growth is expected
          (telehealth expansion, testing, vaccines), the scale of certain increases demands scrutiny.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The City of Chicago: $23M to $240M</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The City of Chicago&apos;s Medicaid billing jumped <span className="text-red-400 font-semibold">942%</span> during the pandemic &mdash;
            from $23 million to $240 million. That&apos;s a <span className="text-white font-semibold">$217 million increase</span>.
            What was the city billing for? Our data shows this NPI is associated with ambulance services,
            where Chicago charges <span className="text-amber-400 font-semibold">$1,611 per transport</span> vs a national median of $163.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          <span className="text-white font-semibold">Freedom Care LLC</span> in New York, a consumer-directed personal care agency,
          grew from $169M to $380M (+125%). <span className="text-white font-semibold">Consumer Direct Care Network</span> similarly jumped
          from $150M to $323M. These are home care providers that expanded dramatically as demand for
          in-home services surged during lockdowns.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Context matters</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The pandemic was a gold rush for Medicaid billers. Some increases were legitimate &mdash; telehealth expansion, 
            COVID testing infrastructure, home health demand. But the government essentially wrote a blank check with 
            minimal oversight, and the data shows that many providers took full advantage. Increases concentrated in 
            a single billing code or with unusual per-claim costs deserve serious scrutiny.
          </p>
        </div>
      </div>

      {/* Before/After Comparison Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          Top 100 Pandemic Billing Jumps
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">State</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">2019 Billing</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">2021 Billing</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Growth</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">$ Increase</th>
              </tr>
            </thead>
            <tbody>
              {pandemicData.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-red-400 transition-colors">
                      {p.name || `NPI: ${p.npi}`}
                    </Link>
                  </td>
                  <td data-label="State" className="py-2.5 pr-3 text-slate-500">{p.state || '—'}</td>
                  <td data-label="2019" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatMoney(p.prePay)}</td>
                  <td data-label="2021" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(p.postPay)}</td>
                  <td data-label="Growth" className="py-2.5 pr-3 text-right text-red-400 font-semibold tabular-nums">+{p.growthPct.toFixed(0)}%</td>
                  <td data-label="Increase" className="py-2.5 text-right text-amber-400 tabular-nums">{formatMoney(p.dollarIncrease)}</td>
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
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>The City of Chicago&apos;s Medicaid billing jumped <span className="text-red-400 font-semibold">942%</span> ($23M → $240M), linked to ambulance services charging 10x the national median.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>Home care agencies (Freedom Care, Consumer Direct) saw 100%+ growth as in-home care demand surged during lockdowns.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>Some growth is legitimate (telehealth, testing, vaccines), but extreme single-code concentration or unusual per-claim costs warrant investigation.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Who made the most money during COVID? City of Chicago: $23M → $240M (+942%). See the full Medicaid data.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/pandemic-profiteers")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="pandemic-profiteers" relatedSlugs={["covid-vaccines", "covid-testing", "spending-growth"]} />
      </div>
    </article>
  );
}
