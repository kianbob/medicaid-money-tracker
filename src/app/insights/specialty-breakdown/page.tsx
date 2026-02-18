import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import RelatedInsights from "@/components/RelatedInsights";
import specialtyData from "../../../../public/data/specialty-breakdown.json";

export const metadata: Metadata = {
  title: "Where Does $1 Trillion in Medicaid Money Actually Go? — By Specialty",
  description: "264 Home Health providers got $71B. Just 15 'Supports Brokerage' providers received $10.8B ($720M each). See Medicaid spending by specialty.",
  openGraph: {
    title: "Where Does $1 Trillion in Medicaid Money Actually Go?",
    description: "Home Health: $71B from 264 providers. Supports Brokerage: $10.8B from 15 providers ($720M average). See the full specialty breakdown.",
  },
};

export default function SpecialtyBreakdown() {
  // Filter out 'Unknown' for the main display, keep for reference
  const knownSpecialties = (specialtyData as any[]).filter((s: any) => s.specialty !== 'Unknown');
  const unknownEntry = (specialtyData as any[]).find((s: any) => s.specialty === 'Unknown');
  const totalKnownSpending = knownSpecialties.reduce((sum: number, s: any) => sum + s.totalPaid, 0);
  const maxSpending = knownSpecialties[0]?.totalPaid || 1;

  // Find interesting outliers
  const supportsBrokerage = knownSpecialties.find((s: any) => s.specialty?.includes('Supports Brokerage'));
  const homeHealth = knownSpecialties.find((s: any) => s.specialty === 'Home Health');

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Specialty Breakdown</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1 text-xs font-medium text-teal-400">Spending Analysis</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Where Does $1 Trillion in Medicaid Money Actually Go?
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          We broke down $1.09 trillion in Medicaid spending by provider specialty.
          The results reveal stunning concentration &mdash; a handful of specialties
          receive the lion&apos;s share of spending.
        </p>
      </div>

      {/* Standout Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {homeHealth && (
          <div className="bg-dark-800 border border-teal-500/20 rounded-xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Home Health</p>
            <p className="text-3xl font-extrabold text-teal-400 tabular-nums">{formatMoney(homeHealth.totalPaid)}</p>
            <p className="text-xs text-slate-500 mt-1">from only <span className="text-white font-semibold">{homeHealth.providerCount}</span> providers</p>
            <p className="text-xs text-teal-400/70 mt-0.5 tabular-nums">{formatMoney(homeHealth.totalPaid / homeHealth.providerCount)} avg per provider</p>
          </div>
        )}
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Acute Care Hospitals</p>
          <p className="text-3xl font-extrabold text-white tabular-nums">{formatMoney(knownSpecialties.find((s: any) => s.specialty?.includes('Acute Care'))?.totalPaid || 0)}</p>
          <p className="text-xs text-slate-500 mt-1">{knownSpecialties.find((s: any) => s.specialty?.includes('Acute Care'))?.providerCount || 0} providers</p>
        </div>
        {supportsBrokerage && (
          <div className="bg-dark-800 border border-red-500/20 rounded-xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Supports Brokerage</p>
            <p className="text-3xl font-extrabold text-red-400 tabular-nums">{formatMoney(supportsBrokerage.totalPaid)}</p>
            <p className="text-xs text-slate-500 mt-1">from only <span className="text-red-400 font-semibold">{supportsBrokerage.providerCount}</span> providers</p>
            <p className="text-xs text-red-400/70 mt-0.5 tabular-nums">{formatMoney(supportsBrokerage.totalPaid / supportsBrokerage.providerCount)} avg each</p>
          </div>
        )}
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          When people ask &quot;where does Medicaid money go?&quot; they usually think of doctor visits
          and hospital stays. The reality is more surprising. The single largest known spending
          category is <span className="text-white font-semibold">Home Health</span> at{' '}
          <span className="text-teal-400 font-semibold">{homeHealth ? formatMoney(homeHealth.totalPaid) : '$71B'}</span> &mdash;
          but that money goes to just <span className="text-white font-semibold">{homeHealth?.providerCount || 264} providers</span>,
          averaging <span className="text-white font-semibold">{homeHealth ? formatMoney(homeHealth.totalPaid / homeHealth.providerCount) : '$269M'}</span> each.
        </p>

        <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">15 providers, $10.8 billion</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Perhaps the most striking finding: <span className="text-red-400 font-semibold">Supports Brokerage</span> providers &mdash;
            just <span className="text-red-400 font-semibold">{supportsBrokerage?.providerCount || 15} of them</span> &mdash;
            received <span className="text-red-400 font-semibold">{supportsBrokerage ? formatMoney(supportsBrokerage.totalPaid) : '$10.8B'}</span> in
            total payments. That averages to{' '}
            <span className="text-red-400 font-semibold">{supportsBrokerage ? formatMoney(supportsBrokerage.totalPaid / supportsBrokerage.providerCount) : '$720M'}</span> per provider.
            These are intermediaries that help Medicaid beneficiaries manage their self-directed care benefits.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          <span className="text-white font-semibold">Community and Behavioral Health</span> received $31.5B
          across 166 providers. <span className="text-white font-semibold">Case Management</span> received $23.8B
          from 103 providers. The pattern is clear: massive sums flowing through relatively few organizational
          entities, each handling enormous volumes of claims on behalf of thousands of beneficiaries.
        </p>

        {unknownEntry && (
          <div className="bg-dark-800 border-l-4 border-slate-500 rounded-r-xl p-5">
            <p className="text-white font-semibold mb-1">The &quot;Unknown&quot; category: {formatMoney(unknownEntry.totalPaid)}</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              The largest single category is &quot;Unknown&quot; &mdash; {formatMoney(unknownEntry.totalPaid)} across{' '}
              {formatNumber(unknownEntry.providerCount)} providers. This represents providers whose specialty
              classification is not recorded in the NPI database, including many state agencies,
              tribal health facilities, and government entities that register under non-standard categories.
            </p>
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-teal-500 rounded-full" />
          Top 25 Specialties by Spending
        </h2>
        <div className="space-y-1.5">
          {knownSpecialties.slice(0, 25).map((s: any, i: number) => {
            const barWidth = (s.totalPaid / maxSpending) * 100;
            const avgPerProvider = s.totalPaid / (s.providerCount || 1);
            const isHighlight = s.specialty?.includes('Supports Brokerage') || s.specialty === 'Home Health';
            return (
              <div key={s.specialty} className={`bg-dark-800 border rounded-lg px-4 py-2.5 ${isHighlight ? 'border-teal-500/30' : 'border-dark-500/50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-slate-600 w-5 text-right tabular-nums">{i + 1}</span>
                    <span className={`text-sm font-semibold truncate ${isHighlight ? 'text-teal-400' : 'text-white'}`}>{s.specialty}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-xs text-slate-500 tabular-nums">{s.providerCount} provider{s.providerCount !== 1 ? 's' : ''}</span>
                    <span className="text-sm font-bold text-white tabular-nums w-20 text-right">{formatMoney(s.totalPaid)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-dark-600 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${isHighlight ? 'bg-teal-500' : 'bg-blue-500/50'}`} style={{ width: `${barWidth}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-600 w-20 text-right tabular-nums">{formatMoney(avgPerProvider)}/ea</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-teal-500 rounded-full" />
          Full Specialty Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Specialty</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Providers</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Avg/Provider</th>
              </tr>
            </thead>
            <tbody>
              {(specialtyData as any[]).map((s: any, i: number) => (
                <tr key={s.specialty} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Specialty" className="py-2.5 pr-3 text-slate-300 font-medium">{s.specialty}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(s.totalPaid)}</td>
                  <td data-label="Providers" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(s.providerCount)}</td>
                  <td data-label="Claims" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(s.totalClaims)}</td>
                  <td data-label="Avg/Provider" className="py-2.5 text-right text-teal-400 tabular-nums">{formatMoney(s.totalPaid / (s.providerCount || 1))}</td>
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
            <span className="text-teal-400 mt-0.5">&#9656;</span>
            <span>Home Health dominates with <span className="text-teal-400 font-semibold">{homeHealth ? formatMoney(homeHealth.totalPaid) : '$71B'}</span> from only {homeHealth?.providerCount || 264} providers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>{supportsBrokerage?.providerCount || 15} Supports Brokerage providers received <span className="text-red-400 font-semibold">{supportsBrokerage ? formatMoney(supportsBrokerage.totalPaid) : '$10.8B'}</span> &mdash; averaging {supportsBrokerage ? formatMoney(supportsBrokerage.totalPaid / supportsBrokerage.providerCount) : '$720M'} each.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-0.5">&#9656;</span>
            <span>Medicaid spending is highly concentrated: a few hundred large organizations in each specialty handle billions in billing.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-slate-400 mt-0.5">&#9656;</span>
            <span>The &quot;Unknown&quot; category is the largest ({unknownEntry ? formatMoney(unknownEntry.totalPaid) : '$749B'}) &mdash; mostly state agencies and tribal facilities without standard specialty codes.</span>
          </li>
        </ul>
      </div>

      {/* Share + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Where does $1 trillion in Medicaid money go? 264 Home Health providers got $71B. 15 Supports Brokerage providers got $10.8B ($720M each!).")}&url=${encodeURIComponent("https://openmedicaid.org/insights/specialty-breakdown")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="specialty-breakdown" relatedSlugs={["most-expensive", "top-doctors", "spending-growth"]} />
      </div>
    </article>
  );
}
