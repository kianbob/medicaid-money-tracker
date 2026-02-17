import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatPercent, hcpcsDescription } from "@/lib/format";
import growthData from "../../../../public/data/fastest-growing-procedures.json";

export const metadata: Metadata = {
  title: "The Procedures Growing Fastest in Medicaid — 8,935% Growth",
  description: "One Medicaid procedure code grew 8,935% in five years. ABA therapy for autism grew 1,500%+. See the 50 fastest-growing procedures in Medicaid billing.",
  openGraph: {
    title: "The Procedures Growing Fastest in Medicaid",
    description: "8,935% growth in 5 years. ABA therapy codes surged 1,500%+, connecting to Minnesota autism fraud. See the full data.",
  },
};

export default function FastestGrowing() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Fastest Growing</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs font-medium text-purple-400">Spending Trends</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">4 min read</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The Procedures Growing Fastest in Medicaid
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          We compared 2019 and 2024 spending for every procedure code in Medicaid. Some codes
          grew by <span className="text-purple-400 font-semibold">thousands of percent</span>.
          The reasons range from policy changes to potential fraud.
        </p>
      </div>

      {/* Top 5 Growth Cards */}
      <div className="space-y-3 mb-12">
        {growthData.slice(0, 5).map((p: any, i: number) => {
          const maxGrowth = (growthData[0] as any).growthPct;
          const barWidth = (p.growthPct / maxGrowth) * 100;
          return (
            <div key={p.code} className="bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-extrabold text-slate-700 w-6 text-right tabular-nums">{i + 1}</span>
                  <div>
                    <Link href={`/procedures/${p.code}`} className="font-mono text-purple-400 font-bold hover:text-purple-300 transition-colors text-lg">{p.code}</Link>
                    <p className="text-xs text-slate-500">{hcpcsDescription(p.code) || 'Procedure'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-extrabold text-xl tabular-nums">+{p.growthPct.toLocaleString()}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm mb-2">
                <span className="text-slate-500">2019: <span className="text-slate-300 tabular-nums">{formatMoney(p.pay2019)}</span></span>
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                <span className="text-slate-500">2024: <span className="text-white font-semibold tabular-nums">{formatMoney(p.pay2024)}</span></span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{ width: `${barWidth}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <div className="bg-dark-800 border-l-4 border-purple-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">S5121: 8,935% growth — What is it?</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Code <span className="font-mono text-purple-400">S5121</span> ({hcpcsDescription('S5121') || 'Attendant care services, in-home'}) went from
            <span className="text-white font-semibold"> $1.8M</span> in 2019 to <span className="text-white font-semibold">$166M</span> in 2024.
            This is an attendant care code &mdash; in-home personal care services. The explosive growth
            likely reflects states expanding home and community-based services (HCBS) under pandemic-era waivers.
          </p>
        </div>

        <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">ABA therapy and the Minnesota autism fraud connection</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Codes <span className="font-mono text-white">97151</span> ({hcpcsDescription('97151') || 'Behavior identification assessment'}) and{' '}
            <span className="font-mono text-white">97154</span> ({hcpcsDescription('97154') || 'Group adaptive behavior treatment'}) both grew over
            <span className="text-red-400 font-semibold"> 1,500%</span>. These are Applied Behavior Analysis (ABA) therapy codes
            used for autism treatment. While ABA demand has genuinely increased, these codes are directly connected to the
            <span className="text-red-400 font-semibold"> Minnesota autism therapy fraud</span> scandal &mdash; one of the
            largest Medicaid fraud cases in history, with an estimated $100M+ in fraudulent billing. Multiple federal
            indictments followed in 2023&ndash;2024.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Code <span className="font-mono text-white">D2740</span> ({hcpcsDescription('D2740') || 'Crown, porcelain/ceramic'}) grew{' '}
          <span className="text-purple-400 font-semibold">2,753%</span>. This dental code&apos;s growth likely reflects
          Medicaid dental coverage expansion &mdash; several states added comprehensive adult dental benefits
          in recent years. Code <span className="font-mono text-white">W1793</span> ({hcpcsDescription('W1793') || 'State-defined waiver service'}) grew{' '}
          <span className="text-purple-400 font-semibold">5,085%</span> ($11M → $583M), likely reflecting new state waiver programs.
        </p>
      </div>

      {/* Full Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-purple-500 rounded-full" />
          All 50 Fastest-Growing Procedures
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Code</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Description</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">2019 Spending</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">2024 Spending</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Growth</th>
              </tr>
            </thead>
            <tbody>
              {growthData.map((p: any, i: number) => (
                <tr key={p.code} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Code" className="py-2.5 pr-3">
                    <Link href={`/procedures/${p.code}`} className="font-mono text-purple-400 hover:text-purple-300 transition-colors font-semibold">{p.code}</Link>
                  </td>
                  <td data-label="Description" className="py-2.5 pr-3 text-slate-400 text-xs">{hcpcsDescription(p.code) || '—'}</td>
                  <td data-label="2019" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatMoney(p.pay2019)}</td>
                  <td data-label="2024" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(p.pay2024)}</td>
                  <td data-label="Growth" className="py-2.5 text-right text-purple-400 font-bold tabular-nums">+{p.growthPct.toLocaleString()}%</td>
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
            <span className="text-purple-400 mt-0.5">&#9656;</span>
            <span>In-home attendant care (S5121) grew <span className="text-purple-400 font-semibold">8,935%</span>, reflecting HCBS expansion under pandemic waivers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>ABA therapy codes (97151, 97154) grew 1,500%+, connected to the Minnesota autism fraud scandal ($100M+ in fraudulent billing).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">&#9656;</span>
            <span>Dental code D2740 grew 2,753%, likely reflecting Medicaid dental coverage expansion across states.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">&#9656;</span>
            <span>Extreme growth doesn&apos;t always mean fraud &mdash; policy changes, coverage expansion, and new benefits drive legitimate increases.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("One Medicaid procedure code grew 8,935% in 5 years. ABA therapy codes grew 1,500%+, connected to MN autism fraud. See the data.")}&url=${encodeURIComponent("https://medicaidmoneytracker.com/insights/fastest-growing")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Insights</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/insights/most-expensive" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">The Most Expensive Things Medicaid Pays For</p>
            <p className="text-xs text-slate-500 mt-1">$92,158 per claim &rarr;</p>
          </Link>
          <Link href="/insights/specialty-breakdown" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Where Does $1 Trillion Actually Go?</p>
            <p className="text-xs text-slate-500 mt-1">Spending by specialty type &rarr;</p>
          </Link>
        </div>
      </div>
    </article>
  );
}
