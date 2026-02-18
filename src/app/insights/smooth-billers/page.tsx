import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, formatNumber } from "@/lib/format";
import consistencyData from "../../../../public/data/billing-consistency.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "The Providers Who Bill Exactly the Same Amount Every Month — Medicaid",
  description: "14 providers billing $100K+/month maintain less than 5% variation over years. The smoothest: Senior Resources of West Michigan, CV=0.03, ~$379K/month for 83 months.",
  openGraph: {
    title: "14 Providers Bill Like Clockwork — Is That Normal?",
    description: "Real medical practices have natural variation. These providers maintain under 5% monthly variation for years. The smoothest has a CV of 0.03.",
  },
};

function titleCase(s: string): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function lookupName(npi: string, fallbackName: string): string {
  if (fallbackName) return titleCase(fallbackName);
  try {
    const filePath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return titleCase(data.name || data.providerName || "") || `NPI: ${npi}`;
  } catch {
    return `NPI: ${npi}`;
  }
}

const smooth = consistencyData.smoothestBillers as any[];
const volatile = consistencyData.mostVolatile as any[];

export default function SmoothBillers() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Smooth Billers</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 text-xs font-medium text-cyan-400">Original Analysis</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">4 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          14 Providers Bill Like Clockwork &mdash; Is That Normal?
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Real medical practices have natural variation &mdash; flu season, holidays, staff changes.
          But {smooth.length} providers billing $100K+/month maintain less than 5% variation for years.
          The smoothest bills ~$379K/month for 83 months with almost no change.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 tabular-nums">{smooth.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Smooth billers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">0.03</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Lowest CV</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">83</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Months of data</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{volatile.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Most volatile</p>
        </div>
      </div>

      {/* CV Explanation Box */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">What is Coefficient of Variation?</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          The coefficient of variation (CV) measures how uniform a set of numbers is. It&apos;s the
          standard deviation divided by the mean &mdash; essentially, how much the monthly bills
          bounce around their average.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-cyan-400 font-bold text-lg tabular-nums">CV = 0.00</p>
            <p className="text-xs text-slate-500 mt-1">Exactly $100,000 every single month. Perfect uniformity.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-yellow-400 font-bold text-lg tabular-nums">CV = 0.15</p>
            <p className="text-xs text-slate-500 mt-1">Some months $85K, others $115K. Normal medical practice variation.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-red-400 font-bold text-lg tabular-nums">CV = 2.00+</p>
            <p className="text-xs text-slate-500 mt-1">Wild swings &mdash; $10K one month, $500K the next. Often pandemic-related spikes.</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mt-4">
          Real medical practices typically have a CV between 0.15 and 0.40. These providers are all under 0.05 &mdash;
          meaning their monthly billing varies by less than 5%.
        </p>
      </div>

      {/* Featured: Smoothest Biller */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          The Smoothest Billers
        </h2>

        {/* Visual cards for top smooth billers */}
        <div className="space-y-4">
          {smooth.slice(0, 6).map((p: any, i: number) => {
            const range = p.maxMonth - p.minMonth;
            const minPct = ((p.minMonth - p.minMonth) / range) * 100 || 0;
            const avgPct = ((p.avgMonthlyPaid - p.minMonth) / range) * 100 || 50;
            return (
              <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Link href={`/providers/${p.npi}`} className="text-white font-bold text-sm hover:text-cyan-400 transition-colors">
                      {lookupName(p.npi, p.name)}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{p.activeMonths} months &middot; {formatMoney(p.totalPaid)} total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-extrabold text-lg tabular-nums">CV = {p.coefficientOfVariation.toFixed(4)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">coefficient of variation</p>
                  </div>
                </div>

                {/* Range visualization */}
                <div className="relative">
                  <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
                    <span>Min: {formatMoney(p.minMonth)}</span>
                    <span>Max: {formatMoney(p.maxMonth)}</span>
                  </div>
                  <div className="h-6 bg-dark-700 rounded-full overflow-hidden relative">
                    {/* Full range bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 rounded-full" />
                    {/* Average marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-cyan-400"
                      style={{ left: `${avgPct}%` }}
                    />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-cyan-400">Avg: {formatMoney(p.avgMonthlyPaid)}/mo</span>
                    <span className="text-xs text-slate-600 ml-2">Max/Min ratio: {p.maxMinRatio.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <div className="bg-dark-800 border-l-4 border-cyan-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Senior Resources of West Michigan: The Flatline</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            This provider billed an average of <span className="text-white font-semibold">{formatMoney(smooth[6]?.avgMonthlyPaid || 379038)}/month</span> for
            <span className="text-cyan-400 font-semibold"> {smooth[6]?.activeMonths || 83} consecutive months</span> with a CV of just {smooth[6]?.coefficientOfVariation?.toFixed(4) || "0.0299"}.
            Their lowest month was {formatMoney(smooth[6]?.minMonth || 346381)} and their highest was {formatMoney(smooth[6]?.maxMonth || 396019)} &mdash;
            a max/min ratio of only {smooth[6]?.maxMinRatio?.toFixed(2) || "1.14"}x. That&apos;s nearly 7 years of billing that barely budges.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          To put this in perspective: imagine a medical practice that sees patients every day. Some months are
          busier (flu season, back-to-school physicals). Some are slower (holidays, summer). Staff take
          vacations, patients cancel appointments, insurance reimbursement rates change. All of this creates
          natural variation in monthly billing.
        </p>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Yet these {smooth.length} providers bill with less variation than most people&apos;s monthly grocery spending.
          The top provider on the list bills over <span className="text-white font-semibold">{formatMoney(smooth[0].avgMonthlyPaid)}/month</span> for {smooth[0].activeMonths} months with
          a CV of {smooth[0].coefficientOfVariation.toFixed(4)} &mdash; totaling <span className="text-white font-semibold">{formatMoney(smooth[0].totalPaid)}</span>.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">When smooth billing is legitimate</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Government contracts and per-diem arrangements can produce legitimately smooth billing. A group
            home that houses 20 residents at a fixed daily rate will bill nearly the same amount each month.
            But extreme uniformity in medical billing &mdash; where patient needs fluctuate by nature &mdash;
            deserves a closer look, especially when the amounts are in the millions.
          </p>
        </div>
      </div>

      {/* Smooth Billers Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          All {smooth.length} Smooth Billers (CV &lt; 0.05, $100K+/month)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">CV</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Avg/Month</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Months</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Max/Min</th>
              </tr>
            </thead>
            <tbody>
              {smooth.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-cyan-400 transition-colors">
                      {lookupName(p.npi, p.name)}
                    </Link>
                  </td>
                  <td data-label="CV" className="py-2.5 pr-3 text-right text-cyan-400 font-semibold tabular-nums">{p.coefficientOfVariation.toFixed(4)}</td>
                  <td data-label="Avg/Month" className="py-2.5 pr-3 text-right text-white tabular-nums">{formatMoney(p.avgMonthlyPaid)}</td>
                  <td data-label="Total" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Months" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{p.activeMonths}</td>
                  <td data-label="Max/Min" className="py-2.5 text-right text-slate-500 tabular-nums">{p.maxMinRatio.toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contrast: Most Volatile */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          For Comparison: The Most Volatile Billers
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          These providers show the opposite pattern &mdash; extreme variation in monthly billing (CV &gt; 2.0).
          Many are pandemic-related (COVID testing labs, dialysis centers with capacity surges).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">CV</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Avg/Month</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Months</th>
              </tr>
            </thead>
            <tbody>
              {volatile.slice(0, 20).map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-red-400 transition-colors">
                      {lookupName(p.npi, p.name)}
                    </Link>
                  </td>
                  <td data-label="CV" className="py-2.5 pr-3 text-right text-red-400 font-semibold tabular-nums">{p.coefficientOfVariation.toFixed(4)}</td>
                  <td data-label="Avg/Month" className="py-2.5 pr-3 text-right text-white tabular-nums">{formatMoney(p.avgMonthlyPaid)}</td>
                  <td data-label="Total" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Months" className="py-2.5 text-right text-slate-400 tabular-nums">{p.activeMonths}</td>
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
            <span><span className="text-cyan-400 font-semibold">{smooth.length} providers</span> billing $100K+ per month maintain less than 5% variation over 2+ years of data.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-0.5">&#9656;</span>
            <span>The smoothest biller has a CV of <span className="text-cyan-400 font-semibold">{smooth[6]?.coefficientOfVariation?.toFixed(4) || "0.0299"}</span> &mdash; normal medical practices range from 0.15 to 0.40.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>Per-diem and government contract arrangements can produce legitimately smooth billing, but the extreme uniformity of these providers warrants closer inspection.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>The most volatile biller (CV = {volatile[0]?.coefficientOfVariation.toFixed(2) || "2.46"}) is <span className="text-white font-semibold">{titleCase(volatile[0]?.name || "")}</span> &mdash; a COVID testing lab whose billing spiked and crashed.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("14 Medicaid providers billing $100K+/month maintain less than 5% variation for years. Normal practices vary 15-40%. These are under 5%.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/smooth-billers")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="smooth-billers" relatedSlugs={["round-numbers", "benford-analysis", "billing-similarity"]} />
      </div>
    </article>
  );
}
