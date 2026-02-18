import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, formatNumber } from "@/lib/format";
import { SpendingGrowthChart } from "@/components/Charts";
import yearlySummary from "../../../../public/data/yearly-summary.json";

export const metadata: Metadata = {
  title: "From $109B to $199B: How Medicaid Spending Nearly Doubled in 6 Years — OpenMedicaid",
  description: "Medicaid spending grew 83% from $108.7B in 2018 to $198.8B in 2023. COVID was the turning point — 2021 alone added $30.5B. Provider counts grew from 324K to 360K.",
  openGraph: {
    title: "From $109B to $199B: How Medicaid Spending Nearly Doubled in 6 Years",
    description: "An 83% increase in Medicaid spending over six years, driven by COVID enrollment freezes, telehealth expansion, and rising drug costs.",
  },
};

const data = yearlySummary as {
  year: string;
  totalPaid: number;
  totalClaims: number;
  totalBenes: number;
  providers: number;
}[];

// Compute stats
const total7Year = data.reduce((s, d) => s + d.totalPaid, 0);
const peakYear = data.reduce((best, d) => (d.totalPaid > best.totalPaid ? d : best), data[0]);
const y2018 = data.find((d) => d.year === "2018")!;
const y2023 = data.find((d) => d.year === "2023")!;
const growthRate = ((y2023.totalPaid - y2018.totalPaid) / y2018.totalPaid) * 100;
const providerGrowth = y2023.providers - y2018.providers;

// YoY calculations
const withYoY = data.map((d, i) => {
  const prev = i > 0 ? data[i - 1] : null;
  const yoyPct = prev ? ((d.totalPaid - prev.totalPaid) / prev.totalPaid) * 100 : null;
  const yoyAbs = prev ? d.totalPaid - prev.totalPaid : null;
  return { ...d, yoyPct, yoyAbs };
});

function yoyColor(pct: number | null): string {
  if (pct === null) return "text-slate-400";
  if (pct > 15) return "text-red-400";
  if (pct >= 5) return "text-yellow-400";
  return "text-green-400";
}

export default function SpendingGrowth() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Spending Growth</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-400">Spending Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">6 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          From $109B to $199B: How Medicaid Spending Nearly Doubled in 6 Years
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Medicaid spending grew from {formatMoney(y2018.totalPaid)} in 2018 to {formatMoney(y2023.totalPaid)} in
          2023 &mdash; an {growthRate.toFixed(0)}% increase. The COVID pandemic was the turning point: 2020 saw
          a modest jump, then 2021 exploded with $30.5B in additional spending. With 2024 partial-year data
          already at {formatMoney(data.find((d) => d.year === "2024")!.totalPaid)}, the full year will likely
          set another record.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{formatMoney(total7Year)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Total 7-Year Spending</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-blue-400 tabular-nums">{formatMoney(peakYear.totalPaid)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Peak Year ({peakYear.year})</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">+{growthRate.toFixed(0)}%</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Growth 2018&ndash;2023</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-green-400 tabular-nums">+{formatNumber(providerGrowth)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Provider Growth</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-1">Medicaid Spending by Year</h2>
        <p className="text-xs text-slate-500 mb-4">Total payments in billions of dollars. 2024 is partial-year data.</p>
        <SpendingGrowthChart data={data.map((d) => ({ year: d.year, totalPaid: d.totalPaid }))} />
      </div>

      {/* Year-by-Year Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          Year-by-Year Breakdown
        </h2>
        <div className="table-wrapper">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Year</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Providers</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">YoY Change</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">YoY %</th>
              </tr>
            </thead>
            <tbody>
              {withYoY.map((d) => (
                <tr key={d.year} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Year" className="py-2.5 pr-3 text-white font-semibold tabular-nums">
                    {d.year}
                    {d.year === "2024" && <span className="text-[9px] text-yellow-400 ml-1">*</span>}
                  </td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(d.totalPaid)}</td>
                  <td data-label="Claims" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(d.totalClaims)}</td>
                  <td data-label="Providers" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(d.providers)}</td>
                  <td data-label="YoY Change" className="py-2.5 pr-3 text-right tabular-nums text-slate-400">
                    {d.yoyAbs !== null ? (d.yoyAbs >= 0 ? "+" : "") + formatMoney(d.yoyAbs) : "\u2014"}
                  </td>
                  <td data-label="YoY %" className={`py-2.5 text-right font-semibold tabular-nums ${yoyColor(d.yoyPct)}`}>
                    {d.yoyPct !== null ? (d.yoyPct >= 0 ? "+" : "") + d.yoyPct.toFixed(1) + "%" : "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-slate-600 mt-2">* 2024 data is partial year (not all months reported).</p>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          The Story Behind the Numbers
        </h2>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Between 2018 and 2023, Medicaid spending grew every single year. But not all growth was
          equal. From 2018 to 2019, spending jumped <span className="text-white font-semibold">$18.2B (+16.8%)</span>,
          driven partly by state Medicaid expansion under the ACA. Then 2020 hit.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The COVID Inflection Point</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The Families First Coronavirus Response Act (FFCRA) in March 2020 included a
            <span className="text-blue-400 font-semibold"> continuous enrollment requirement</span>: states
            couldn&rsquo;t disenroll Medicaid beneficiaries during the public health emergency. Enrollment
            surged from roughly 71 million to over 90 million. This single policy change rippled
            through every spending category for three years.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The effect wasn&rsquo;t immediate. In 2020, total spending rose
          by <span className="text-white font-semibold">{formatMoney(withYoY[2].yoyAbs!)}</span> &mdash;
          a modest <span className="text-white font-semibold">{withYoY[2].yoyPct!.toFixed(1)}%</span> increase. Many
          in-person services dropped as lockdowns took hold and elective procedures were postponed. But
          by 2021, deferred care came roaring back. Spending exploded
          by <span className="text-red-400 font-semibold">{formatMoney(withYoY[3].yoyAbs!)}</span> in a single
          year &mdash; a <span className="text-red-400 font-semibold">{withYoY[3].yoyPct!.toFixed(1)}%</span> jump,
          the largest absolute increase in our dataset.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">What Drove the Growth?</p>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
              <p className="text-blue-400 font-bold text-sm">Continuous Enrollment</p>
              <p className="text-xs text-slate-500 mt-1">The FFCRA enrollment freeze added 20+ million beneficiaries
                who couldn&rsquo;t be disenrolled, even if they no longer qualified. States received enhanced
                federal matching in exchange.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
              <p className="text-purple-400 font-bold text-sm">Telehealth Expansion</p>
              <p className="text-xs text-slate-500 mt-1">Medicaid rapidly expanded telehealth coverage during COVID.
                Many states made temporary expansions permanent, adding new billing codes and reimbursement pathways.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
              <p className="text-amber-400 font-bold text-sm">Rising Drug Costs</p>
              <p className="text-xs text-slate-500 mt-1">New specialty drugs, gene therapies, and provider-administered
                biologics entered the market at price points exceeding $100K per treatment. Medicaid absorbed these
                costs for a growing beneficiary population.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
              <p className="text-green-400 font-bold text-sm">State Expansion</p>
              <p className="text-xs text-slate-500 mt-1">Several states expanded Medicaid eligibility between 2018
                and 2023, including Nebraska (2020), Oklahoma (2021), Missouri (2021), and South Dakota (2023),
                adding hundreds of thousands of new enrollees.</p>
            </div>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The growth continued in 2022 (<span className="text-white font-semibold">+{withYoY[4].yoyPct!.toFixed(1)}%</span>)
          and 2023 (<span className="text-white font-semibold">+{withYoY[5].yoyPct!.toFixed(1)}%</span>), pushing
          total annual spending to nearly <span className="text-white font-semibold">{formatMoney(y2023.totalPaid)}</span>.
          The provider ecosystem grew too: from {formatNumber(y2018.providers)} active providers in 2018
          to {formatNumber(y2023.providers)} in 2023 &mdash;
          a net increase of {formatNumber(providerGrowth)} billing entities.
        </p>

        <div className="bg-dark-800 border-l-4 border-yellow-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">2024: Partial Data, But Telling</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The 2024 figures in our dataset ({formatMoney(data[6].totalPaid)}) reflect an
            <span className="text-yellow-400 font-semibold"> incomplete reporting year</span>. Not all
            states have submitted their full 2024 data. Despite this, the partial total already exceeds
            every full year before 2022. If the remaining months follow historical patterns, 2024 will
            almost certainly surpass 2023&rsquo;s record {formatMoney(y2023.totalPaid)}.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The numbers tell a clear story: Medicaid is on a trajectory that shows no sign of slowing.
          Over seven years, the program paid out a combined <span className="text-white font-semibold">{formatMoney(total7Year)}</span> across <span className="text-white font-semibold">{formatNumber(data.reduce((s, d) => s + d.totalClaims, 0))} claims</span>.
          Understanding where this money goes &mdash; and whether it&rsquo;s being spent effectively &mdash;
          is the central question behind every investigation on this site.
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Medicaid spending grew <span className="text-blue-400 font-semibold">{growthRate.toFixed(0)}%</span> from 2018 to 2023, from {formatMoney(y2018.totalPaid)} to {formatMoney(y2023.totalPaid)} annually.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>2021 was the inflection year: <span className="text-red-400 font-semibold">{formatMoney(withYoY[3].yoyAbs!)}</span> in additional spending (+{withYoY[3].yoyPct!.toFixed(1)}%), the largest single-year jump in the dataset.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">&#9656;</span>
            <span>The provider ecosystem expanded by <span className="text-green-400 font-semibold">{formatNumber(providerGrowth)} providers</span> ({formatNumber(y2018.providers)} to {formatNumber(y2023.providers)}) over six years.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-0.5">&#9656;</span>
            <span>2024 partial data ({formatMoney(data[6].totalPaid)}) already exceeds pre-2022 full-year totals, suggesting another record when complete.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Medicaid spending grew 83% in 6 years — from $109B to $199B. COVID was the turning point: 2021 added $30.5B in a single year.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/spending-growth")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="spending-growth" relatedSlugs={["fastest-growing", "pandemic-profiteers", "most-expensive"]} />
      </div>
    </article>
  );
}
