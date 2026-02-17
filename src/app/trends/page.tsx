import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber } from "@/lib/format";
import yearlyTrends from "../../../public/data/yearly-trends.json";

export const metadata: Metadata = {
  title: "Medicaid Spending Trends 2018-2024 | Medicaid Money Tracker",
  description: "Year-over-year Medicaid spending trends from $108B in 2018 to $185B in 2024. COVID-19 impact, pandemic unwinding, and key takeaways.",
  openGraph: {
    title: "Medicaid Spending Trends 2018-2024",
    description: "Year-over-year Medicaid spending trends from $108B in 2018 to $185B in 2024. COVID-19 impact, pandemic unwinding, and key takeaways.",
  },
};

export default function TrendsPage() {
  const trends = yearlyTrends as any[];
  const totalSpending = trends.reduce((sum: number, y: any) => sum + y.payments, 0);
  const maxPayments = Math.max(...trends.map((y: any) => y.payments));
  const maxClaims = Math.max(...trends.map((y: any) => y.claims));
  const firstYear = trends[0];
  const lastYear = trends[trends.length - 1];
  const totalGrowth = ((lastYear.payments - firstYear.payments) / firstYear.payments * 100);

  // Calculate YoY growth
  const withGrowth = trends.map((y: any, i: number) => {
    const prev = i > 0 ? trends[i - 1] : null;
    const paymentGrowth = prev ? ((y.payments - prev.payments) / prev.payments * 100) : 0;
    const claimGrowth = prev ? ((y.claims - prev.claims) / prev.claims * 100) : 0;
    return { ...y, paymentGrowth, claimGrowth };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Trends</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Spending Trends</h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          Medicaid spending grew <span className="text-white font-semibold">{totalGrowth.toFixed(0)}%</span> from
          {" "}<span className="text-white font-semibold">{formatMoney(firstYear.payments)}</span> in 2018 to
          {" "}<span className="text-white font-semibold">{formatMoney(lastYear.payments)}</span> in 2024.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total (7 Years)</p>
          <p className="text-xl font-bold text-green-400 tabular-nums">{formatMoney(totalSpending)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Peak Year</p>
          <p className="text-xl font-bold text-white tabular-nums">2023</p>
          <p className="text-[10px] text-slate-600 tabular-nums">{formatMoney(trends.find((y: any) => y.payments === maxPayments)?.payments || 0)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Growth</p>
          <p className="text-xl font-bold text-amber-400 tabular-nums">+{totalGrowth.toFixed(0)}%</p>
          <p className="text-[10px] text-slate-600">2018 to 2024</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">2024 Providers</p>
          <p className="text-xl font-bold text-blue-400 tabular-nums">{formatNumber(lastYear.providers)}</p>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 mb-10">
        <h2 className="text-sm font-bold text-white mb-6">Total Payments by Year</h2>
        <div className="flex items-end gap-4 h-48">
          {trends.map((y: any) => {
            const pct = (y.payments / maxPayments) * 100;
            return (
              <div key={y.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                <p className="text-xs text-white font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">{formatMoney(y.payments)}</p>
                <div className="w-full bg-gradient-to-t from-blue-600/60 to-blue-400/40 hover:from-blue-500/80 hover:to-blue-300/60 rounded-t-lg transition-colors bar-segment"
                  style={{ height: `${pct}%` }} />
                <p className="text-sm text-slate-400 mt-3 font-semibold">{y.year}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* COVID-19 Annotation */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 mb-10">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-blue-400 text-sm font-bold">!</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-400 mb-1">2020&ndash;2021: COVID-19 Pandemic Impact</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Federal continuous enrollment provisions and emergency funding dramatically expanded Medicaid during the pandemic.
              The {formatMoney((() => { const y20 = trends.find((y: any) => y.year === 2021); const y19 = trends.find((y: any) => y.year === 2020); return y20 && y19 ? y20.payments - y19.payments : 0; })())} jump
              from 2020 to 2021 was the largest single-year increase in the dataset, driven by surging enrollment and
              pandemic-related healthcare spending.
            </p>
          </div>
        </div>
      </div>

      {/* 2024 Annotation */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 mb-10">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-amber-400 text-sm font-bold">!</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-400 mb-1">2024: Medicaid Unwinding</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The end of pandemic-era continuous enrollment protections led to millions of disenrollments nationwide,
              contributing to the first spending decline since the dataset began. States resumed eligibility redeterminations,
              removing beneficiaries who no longer qualified or failed to complete paperwork.
            </p>
          </div>
        </div>
      </div>

      {/* Claims Chart */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 mb-10">
        <h2 className="text-sm font-bold text-white mb-6">Total Claims by Year</h2>
        <div className="flex items-end gap-4 h-36">
          {trends.map((y: any) => {
            const pct = (y.claims / maxClaims) * 100;
            return (
              <div key={y.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                <p className="text-xs text-slate-300 font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">{formatNumber(y.claims)}</p>
                <div className="w-full bg-gradient-to-t from-purple-600/60 to-purple-400/40 hover:from-purple-500/80 hover:to-purple-300/60 rounded-t-lg transition-colors bar-segment"
                  style={{ height: `${pct}%` }} />
                <p className="text-sm text-slate-400 mt-3 font-semibold">{y.year}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Year-by-Year Table */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-10">
        <div className="px-5 py-4 border-b border-dark-500/50">
          <h2 className="text-sm font-bold text-white">Year-by-Year Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500/50">
                <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Year</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Payments</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">YoY Growth</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden md:table-cell">Providers</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden md:table-cell">Avg/Provider</th>
              </tr>
            </thead>
            <tbody>
              {withGrowth.map((y: any, i: number) => (
                <tr key={y.year} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td className="px-4 py-3 text-white font-bold">{y.year}</td>
                  <td className="px-4 py-3 text-right font-mono text-white font-semibold tabular-nums">{formatMoney(y.payments)}</td>
                  <td className="px-4 py-3 text-right">
                    {i > 0 ? (
                      <span className={`text-xs font-semibold tabular-nums ${y.paymentGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {y.paymentGrowth >= 0 ? '+' : ''}{y.paymentGrowth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-slate-600">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400 text-xs hidden sm:table-cell tabular-nums">{formatNumber(y.claims)}</td>
                  <td className="px-4 py-3 text-right text-slate-400 text-xs hidden md:table-cell tabular-nums">{formatNumber(y.providers)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400 text-xs hidden md:table-cell tabular-nums">{formatMoney(y.payments / y.providers)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Observations */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
        <h2 className="text-sm font-bold text-white mb-4">Key Observations</h2>
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <p>
            Medicaid spending grew steadily from 2018 through 2023, accelerating during the COVID-19 pandemic era (2020&ndash;2021).
            The <span className="text-white font-medium">peak in 2023 at {formatMoney(trends.find((y: any) => y.payments === maxPayments)?.payments || 0)}</span> represents
            the highest spending year in the dataset.
          </p>
          <p>
            The slight decline in 2024 ({formatMoney(lastYear.payments)}) may reflect the{" "}
            <span className="text-white font-medium">Medicaid unwinding</span> &mdash; the end of continuous enrollment
            protections enacted during the pandemic, which led to millions of beneficiaries being disenrolled.
          </p>
          <p>
            Provider counts peaked at <span className="text-white font-medium">{formatNumber(Math.max(...trends.map((y: any) => y.providers)))}</span> in 2023,
            suggesting the growth in spending is driven by both more providers entering the system and existing providers billing more.
          </p>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
        <h2 className="text-sm font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1 shrink-0">&bull;</span>
            <span>Medicaid spending grew <span className="text-white font-medium">{totalGrowth.toFixed(0)}%</span> over seven years, from {formatMoney(firstYear.payments)} (2018) to a peak of {formatMoney(trends.find((y: any) => y.payments === maxPayments)?.payments || 0)} (2023) &mdash; far outpacing inflation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1 shrink-0">&bull;</span>
            <span>The COVID-19 pandemic was the single biggest accelerant, with federal continuous enrollment provisions and emergency funding driving the largest year-over-year increases in the dataset.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1 shrink-0">&bull;</span>
            <span>The 2024 decline marks the first spending drop since the dataset began, coinciding with Medicaid unwinding and millions of disenrollments as states resumed eligibility checks.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1 shrink-0">&bull;</span>
            <span>Rapid spending growth created opportunities for fraud &mdash; our analysis identifies <Link href="/watchlist" className="text-blue-400 hover:underline">1,860 providers</Link> with suspicious billing patterns that emerged during this expansion.</span>
          </li>
        </ul>
      </div>

      {/* What This Means */}
      <div className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-dark-800 border border-blue-500/20 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold text-white mb-4">What This Means</h2>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            Medicaid spending nearly doubled in seven years, driven by pandemic emergency measures that expanded enrollment
            and suspended eligibility checks. This rapid growth created an environment where fraudulent billing could more
            easily go undetected &mdash; more money flowing through the system with fewer guardrails.
          </p>
          <p>
            The 2024 decline signals a correction as states resume normal operations, but spending remains{" "}
            <span className="text-white font-semibold">{totalGrowth.toFixed(0)}% above 2018 levels</span>. The
            providers, procedures, and billing patterns that emerged during this expansion period deserve the closest scrutiny.
          </p>
          <p>
            Our analysis flagged <Link href="/watchlist" className="text-blue-400 hover:underline font-medium">1,860 providers</Link> whose
            billing patterns deviate significantly from their peers &mdash; many of whom saw their largest billing increases during
            the 2020&ndash;2023 growth period. Understanding <em>when</em> anomalies appeared matters as much as understanding
            <em> what</em> the anomalies are.
          </p>
        </div>
      </div>

      {/* Related Insights */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
        <h2 className="text-sm font-bold text-white mb-4">Related Insights</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/insights/pandemic-profiteers" className="p-4 rounded-lg border border-dark-500/50 hover:border-blue-500/30 hover:bg-dark-700/50 transition-all group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Pandemic Profiteers</p>
            <p className="text-xs text-slate-500 mt-1">Which providers saw the biggest billing increases during COVID-19?</p>
          </Link>
          <Link href="/insights/fastest-growing" className="p-4 rounded-lg border border-dark-500/50 hover:border-blue-500/30 hover:bg-dark-700/50 transition-all group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Fastest Growing Procedures</p>
            <p className="text-xs text-slate-500 mt-1">Which procedure codes drove the biggest spending increases year over year?</p>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/states" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          Spending by state &rarr;
        </Link>
        <Link href="/procedures" className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors">
          Top procedures &rarr;
        </Link>
        <Link href="/analysis" className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors">
          Fraud analysis &rarr;
        </Link>
      </div>
    </div>
  );
}
