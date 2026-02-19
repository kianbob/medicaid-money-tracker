import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import RelatedInsights from "@/components/RelatedInsights";
import vaccineData from "../../../../public/data/covid-vaccine-top-billers.json";

export const metadata: Metadata = {
  title: "Who Got Paid the Most to Give COVID Vaccines? — Medicaid Spending Data",
  description: "Medicaid spent $280M+ on COVID vaccines. Tribal hospitals dominate the top billers list. See which providers billed the most for COVID-19 vaccinations through Medicaid.",
  openGraph: {
    title: "Who Got Paid the Most to Give COVID Vaccines?",
    description: "Medicaid spent $280M+ on COVID vaccines. Tribal hospitals and state agencies dominate the list. See the full data from 227M billing records.",
  },
};

export default function CovidVaccines() {
  const totalSpending = vaccineData.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const totalClaims = vaccineData.reduce((sum: number, p: any) => sum + p.totalClaims, 0);
  const totalBenes = vaccineData.reduce((sum: number, p: any) => sum + (p.totalBenes || 0), 0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">COVID Vaccines</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 text-xs font-medium text-cyan-400">COVID-19 Investigation</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">4 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Who Got Paid the Most to Give COVID Vaccines?
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          We analyzed every Medicaid billing record for COVID-19 vaccinations.
          The top billers aren&apos;t who you&apos;d expect &mdash; tribal hospitals
          and state agencies dominate the list.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Vaccine Spending</p>
          <p className="text-2xl font-extrabold text-cyan-400 tabular-nums">{formatMoney(totalSpending)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Vaccine Claims</p>
          <p className="text-2xl font-extrabold text-white tabular-nums">{formatNumber(totalClaims)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Beneficiaries</p>
          <p className="text-2xl font-extrabold text-white tabular-nums">{formatNumber(totalBenes)}</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          When COVID-19 vaccines became available in late 2020, Medicaid became one of the primary payers
          for vaccinating low-income Americans. Vaccines were just one part of the pandemic spending surge — Medicaid
          also paid <Link href="/insights/covid-testing" className="text-blue-400 hover:text-blue-300">$4.7 billion for COVID testing</Link> and
          saw <Link href="/insights/pandemic-profiteers" className="text-blue-400 hover:text-blue-300">massive billing jumps across hundreds of providers</Link>.
          Our analysis of HHS billing data reveals some surprising patterns in who billed the most for vaccinations.
        </p>
        <div className="bg-dark-800 border-l-4 border-cyan-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The tribal healthcare angle</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Indian Health Service hospitals dominate the top of this list. Shiprock Hospital in New Mexico
            billed <span className="text-cyan-400 font-semibold">$11.8 million</span> for COVID vaccinations alone.
            This highlights the scale of tribal healthcare infrastructure &mdash; and the disproportionate
            impact COVID had on Native American communities, who were prioritized for early vaccination.
          </p>
        </div>
        <p className="text-slate-300 leading-relaxed text-[15px]">
          Many of the top billers have blank or generic names in the NPI registry &mdash; these are typically
          federal or tribal facilities that register differently than private providers. The State of Indiana
          Auditor of State billed <span className="font-semibold text-white">$6.1 million</span> through its
          state-run vaccination sites, while Kaiser Permanente billed <span className="font-semibold text-white">$4.8 million</span> through
          its managed care network.
        </p>
      </div>

      {/* Top Billers Highlight */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          Top 10 COVID Vaccine Billers
        </h2>
        <div className="space-y-2">
          {vaccineData.slice(0, 10).map((p: any, i: number) => (
            <div key={p.npi} className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-3 hover:border-dark-400 transition-colors">
              <span className="text-xl font-extrabold text-slate-700 w-6 text-right tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <Link href={`/providers/${p.npi}`} className="text-white font-semibold hover:text-cyan-400 transition-colors truncate block">
                  {p.name || `NPI: ${p.npi}`}
                </Link>
                <p className="text-xs text-slate-500">{p.specialty}{p.city ? ` · ${p.city}, ${p.state}` : p.state ? ` · ${p.state}` : ''}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-cyan-400 font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                <p className="text-[10px] text-slate-600">{formatNumber(p.totalClaims)} claims</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          All 100 Top Vaccine Billers
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
              {vaccineData.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-cyan-400 transition-colors">
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
            <span className="text-cyan-400 mt-0.5">&#9656;</span>
            <span>Indian Health Service and tribal hospitals are the top vaccine billers &mdash; reflecting the massive vaccination effort in Native communities.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-0.5">&#9656;</span>
            <span>State agencies (Indiana, others) served as direct billing entities for state-run vaccination sites.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-0.5">&#9656;</span>
            <span>Many top vaccine billers have blank names in the NPI database &mdash; these are typically federal/tribal facilities with non-standard registration.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-0.5">&#9656;</span>
            <span>Total Medicaid vaccine spending across the top 100 billers: <span className="text-white font-semibold">{formatMoney(totalSpending)}</span>.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Who got paid the most to give COVID vaccines through Medicaid? Tribal hospitals dominate the list.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/covid-vaccines")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="covid-vaccines" relatedSlugs={["covid-testing", "pandemic-profiteers", "spending-growth"]} />
      </div>
    </article>
  );
}
