import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import individualsData from "../../../../public/data/top-individuals.json";

export const metadata: Metadata = {
  title: "The Highest-Paid Individual Medicaid Providers — Only 2 in Top 2,000",
  description: "Only 2 individual people appear in the top 2,000 Medicaid billers. A psychologist in Wisconsin ($77.3M) and a van transport provider in New Mexico ($76.2M).",
  openGraph: {
    title: "The Highest-Paid Individual Medicaid Providers",
    description: "Only 2 individuals in the top 2,000 billers. Almost all top Medicaid billing is by organizations, not doctors. See who they are.",
  },
};

export default function TopDoctors() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Top Doctors</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 text-xs font-medium text-indigo-400">Provider Analysis</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">3 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The Highest-Paid Individual Medicaid Providers
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Everyone assumes Medicaid fraud is about greedy doctors. The data tells a very different story:
          only <span className="text-indigo-400 font-semibold">2 individual people</span> appear in the top 2,000 Medicaid billers.
          The rest are all organizations.
        </p>
      </div>

      {/* The Big Reveal */}
      <div className="bg-dark-800 border border-indigo-500/20 rounded-2xl p-8 mb-12 text-center">
        <p className="text-6xl md:text-8xl font-extrabold text-indigo-400 mb-4">2</p>
        <p className="text-xl font-bold text-white mb-2">individual people in the top 2,000</p>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Almost all top Medicaid billing is by organizations &mdash; hospital systems, home care agencies,
          managed care companies. Not individual doctors.
        </p>
      </div>

      {/* The Two Individuals */}
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {individualsData.map((p: any, i: number) => (
          <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-extrabold">
                  {i + 1}
                </div>
                <div>
                  <Link href={`/providers/${p.npi}`} className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                    {p.name}
                  </Link>
                  <p className="text-xs text-slate-500">{p.specialty}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">{p.city}, {p.state}</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">Total Paid</p>
                  <p className="text-xl font-extrabold text-indigo-400 tabular-nums">{formatMoney(p.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">Claims</p>
                  <p className="text-xl font-extrabold text-white tabular-nums">{formatNumber(p.totalClaims)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">Patients</p>
                  <p className="text-xl font-extrabold text-white tabular-nums">{formatNumber(p.totalBenes)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <div className="bg-dark-800 border-l-4 border-indigo-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Eric Lund &mdash; $77.3 million</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            A clinical psychologist in Green Bay, Wisconsin. Lund billed <span className="text-indigo-400 font-semibold">{formatMoney(individualsData[0].totalPaid)}</span> to
            Medicaid across <span className="text-white font-semibold">{formatNumber(individualsData[0].totalClaims)}</span> claims
            serving <span className="text-white font-semibold">{formatNumber(individualsData[0].totalBenes)}</span> beneficiaries.
            That averages to roughly $1,054 per beneficiary &mdash; but the sheer volume of claims for a
            single practitioner is extraordinary.
          </p>
        </div>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Loren Cooke &mdash; $76.2 million</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            A non-emergency medical transport provider in Fort Wingate, New Mexico.
            Cooke billed <span className="text-indigo-400 font-semibold">{formatMoney(individualsData[1].totalPaid)}</span> for
            transporting Medicaid patients. Fort Wingate is near the Navajo Nation &mdash; suggesting this
            transportation service covers vast rural distances in tribal areas where medical facilities
            are far apart.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          <span className="text-white font-semibold">Why this matters:</span> The popular narrative around Medicaid fraud
          often focuses on individual doctors gaming the system. But the data reveals that the real money
          flows through <span className="text-white font-semibold">large organizations</span> &mdash; home care agencies,
          hospital systems, managed care companies, and government entities. The top 2,000 Medicaid billers
          are almost exclusively organizations, with only these two individuals breaking through.
        </p>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          This doesn&apos;t mean individual fraud doesn&apos;t happen &mdash; it does, frequently, at lower dollar amounts.
          But it reframes where the biggest financial risks lie: in organizational billing practices,
          not individual doctor greed.
        </p>
      </div>

      {/* Comparison: Individuals vs Organizations */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Individuals vs. Organizations</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Top individual (Eric Lund)</span>
              <span className="text-indigo-400 font-semibold tabular-nums">{formatMoney(individualsData[0].totalPaid)}</span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '1.1%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Top organization (Public Partnerships LLC)</span>
              <span className="text-white font-semibold tabular-nums">$7.18B</span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2 overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3">The top organization billed 93x more than the top individual.</p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">&#9656;</span>
            <span>Only <span className="text-indigo-400 font-semibold">2 out of 2,000</span> top Medicaid billers are individual people. The rest are organizations.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">&#9656;</span>
            <span>This challenges the &quot;rich doctors gaming Medicaid&quot; narrative. The real money flows through large organizational billing.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">&#9656;</span>
            <span>The top organization (Public Partnerships LLC) billed <span className="text-white font-semibold">93x more</span> than the top individual.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">&#9656;</span>
            <span>Loren Cooke&apos;s $76.2M in transport billing from Fort Wingate, NM highlights the costs of rural/tribal healthcare access.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Only 2 individual people appear in the top 2,000 Medicaid billers. Almost all top billing is by organizations, not doctors.")}&url=${encodeURIComponent("https://medicaidmoneytracker.com/insights/top-doctors")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Insights</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/insights/specialty-breakdown" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Where Does $1 Trillion Actually Go?</p>
            <p className="text-xs text-slate-500 mt-1">Spending by specialty type &rarr;</p>
          </Link>
          <Link href="/insights/pandemic-profiteers" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Who Made the Most Money During COVID?</p>
            <p className="text-xs text-slate-500 mt-1">The biggest pandemic billing jumps &rarr;</p>
          </Link>
        </div>
      </div>
    </article>
  );
}
