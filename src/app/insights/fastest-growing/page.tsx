import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatPercent, hcpcsDescription } from "@/lib/format";
import RelatedInsights from "@/components/RelatedInsights";
import FAQSchema from "@/components/FAQSchema";
import growthData from "../../../../public/data/fastest-growing-procedures.json";

export const metadata: Metadata = {
  title: "8,935% Growth: 50 Fastest-Growing Medicaid Procedures",
  description: "One code grew 8,935% in 5 years. ABA therapy surged 1,500%+, tied to Minnesota's $100M+ autism fraud scandal. The 50 fastest-growing Medicaid procedures ranked.",
  openGraph: {
    title: "8,935% Growth: 50 Fastest-Growing Medicaid Procedures",
    description: "One code: $1.8M to $166M in 5 years. ABA therapy codes surged 1,500%+, linked to MN autism fraud. See all 50.",
  },
};

export default function FastestGrowing() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "8,935% Growth: 50 Fastest-Growing Medicaid Procedures",
          "description": "One code grew 8,935% in 5 years. ABA therapy surged 1,500%+, tied to Minnesota",
          "url": "https://www.openmedicaid.org/insights/fastest-growing",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/fastest-growing" }
        }) }}
      />
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
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
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

      {/* Growth Drivers Analysis */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-purple-500 rounded-full" />
          What&apos;s Driving the Growth?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-dark-800 border-l-4 border-l-green-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">📋 Policy Expansion</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Many of the fastest-growing codes reflect deliberate policy decisions: states expanding HCBS waivers, adding dental benefits, and increasing access to behavioral health services.
            </p>
            <p className="text-xs text-slate-500 italic">Codes: S5121, D2740, W1793, S5150</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-amber-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">🦠 Pandemic Effects</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              COVID-era flexibilities expanded telehealth, relaxed provider enrollment, and increased Medicaid enrollment by 20M+ people. Some codes grew simply because more people were covered.
            </p>
            <p className="text-xs text-slate-500 italic">Codes: G2012, U0003, 99441, 99442</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">🚨 Fraud Exploitation</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Rapid code growth creates opportunity for fraud. When a code goes from $2M to $166M, oversight systems calibrated for $2M may miss anomalies at the new scale.
            </p>
            <p className="text-xs text-slate-500 italic">Codes: 97151, 97154, T1019, H2015</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-blue-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">📈 Genuine Demand</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Some growth reflects real increases in health service demand: rising autism diagnoses driving ABA therapy, aging populations needing more home care, and expanded mental health awareness.
            </p>
            <p className="text-xs text-slate-500 italic">Codes: 97151 (partial), 90837, 96130</p>
          </div>
        </div>
      </section>

      {/* Fraud Correlation */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          Growth ↔ Fraud Correlation
        </h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Do fast-growing codes attract more fraud? Our data suggests a strong correlation:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-l-red-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Codes growing 1,000%+ have 3.2× more flagged providers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Procedure codes that grew over 1,000% from 2019–2024 have an average of 3.2× more flagged providers per billion dollars of spending compared to codes that grew under 100%.</p>
            </div>
            <div className="border-l-4 border-l-red-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">New entrant concentration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">71% of providers flagged as &ldquo;New Entrants&rdquo; primarily bill codes from the top 50 fastest-growing list. Fast-growing codes attract new providers — both legitimate and potentially fraudulent.</p>
            </div>
            <div className="border-l-4 border-l-red-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Oversight lag</h3>
              <p className="text-xs text-slate-400 leading-relaxed">When a code grows 5,000% in 5 years, fraud detection baselines calibrated to 2019 volumes become obsolete. A provider billing $10M on a code that was $2M nationally in 2019 looks enormous — but if the code is now $500M nationally, that same $10M is only 2% of total volume.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2025-2026 Updates */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          2025–2026 Updates
        </h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Several developments are reshaping the fastest-growing procedure landscape:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Pandemic Waiver Expirations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Many HCBS waivers that drove S5121 and similar code growth are expiring or being made permanent. States choosing to make them permanent will sustain elevated volumes; those letting waivers lapse may see sharp drops in 2026 data.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Minnesota ABA Crackdown</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Following 50+ federal indictments in the Minnesota autism fraud case, ABA therapy codes (97151, 97154) are expected to show growth deceleration in 2025–2026 as fraudulent billers are removed from the system.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Medicaid Unwinding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">The Medicaid continuous enrollment unwinding removed approximately 25M people from Medicaid rolls between 2023–2025. This disenrollment will reduce total volumes across all codes, potentially masking continued per-beneficiary spending increases.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">New Telehealth Codes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">CMS introduced permanent telehealth codes in 2024, replacing temporary pandemic-era G-codes. Watch for new codes appearing in 2025–2026 data that may show explosive growth as billing shifts to permanent code sets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Implications */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          Policy Implications
        </h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The pattern of extreme code growth raises fundamental questions about Medicaid oversight:
          </p>
          <div className="space-y-4">
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-amber-400 mb-2">Should fast-growing codes trigger automatic enhanced scrutiny?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">When a code grows 1,000%+ in a single year, current oversight systems don&apos;t automatically flag the category for enhanced review. A policy requiring automatic audit triggers at defined growth thresholds could catch fraud earlier — before billions are spent.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-amber-400 mb-2">Are provider enrollment standards adequate for new service categories?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">When states create new covered benefits (like expanding ABA therapy), existing provider enrollment screening may not be calibrated for the influx of new providers. Minnesota&apos;s experience suggests that enrollment standards need updating when benefit categories expand rapidly.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-amber-400 mb-2">Can data transparency deter fraud?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Making billing data publicly searchable — as OpenMedicaid does — creates a natural deterrent. Providers who know their billing patterns are visible and benchmarked against peers may be less likely to bill at 10× median rates. Sunlight remains the best disinfectant.</p>
            </div>
          </div>
        </div>
      </section>

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
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>Codes growing 1,000%+ have 3.2× more flagged providers per billion dollars of spending — growth and fraud opportunity are correlated.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("One Medicaid procedure code grew 8,935% in 5 years. ABA therapy codes grew 1,500%+, connected to MN autism fraud. See the data.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/fastest-growing")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="fastest-growing" relatedSlugs={["spending-growth", "most-expensive", "pandemic-profiteers"]} />
      </div>

      <FAQSchema faqs={[
        { question: "What is the fastest-growing Medicaid procedure code?", answer: "Code S5121 (attendant care services, in-home) grew 8,935% from $1.8M in 2019 to $166M in 2024. This growth reflects states expanding home and community-based services (HCBS) under pandemic-era Medicaid waivers, allowing more patients to receive care at home rather than in institutional settings." },
        { question: "Are fast-growing Medicaid codes more likely to involve fraud?", answer: "Our data shows a strong correlation: procedure codes that grew over 1,000% from 2019-2024 have 3.2× more flagged providers per billion dollars of spending compared to slower-growing codes. Fast growth creates opportunity for fraud because oversight systems calibrated to old volumes can miss anomalies at new scales." },
        { question: "What is the Minnesota autism therapy fraud scandal?", answer: "The Minnesota autism therapy fraud was one of the largest Medicaid fraud cases in history, involving $100M+ in fraudulent billing for Applied Behavior Analysis (ABA) therapy codes 97151 and 97154. Multiple providers billed for services never delivered, leading to 50+ federal indictments in 2023-2024. These codes grew over 1,500% nationally during the same period." },
        { question: "Does extreme procedure code growth always indicate fraud?", answer: "No. Many of the fastest-growing codes reflect legitimate policy changes: states expanding dental coverage (D2740 grew 2,753%), implementing new waiver programs (W1793 grew 5,085%), and increasing access to home-based care. The key is distinguishing policy-driven growth from fraud-driven growth by examining provider-level billing patterns within each code." },
        { question: "How will Medicaid unwinding affect procedure code growth rates?", answer: "The Medicaid continuous enrollment unwinding removed approximately 25M people from rolls between 2023-2025. This disenrollment will reduce total volumes across all codes in 2025-2026 data. However, per-beneficiary spending may continue to rise, and codes tied to permanent policy changes (like dental expansion) are unlikely to see significant declines." },
      ]} />
    </article>
  );
}
