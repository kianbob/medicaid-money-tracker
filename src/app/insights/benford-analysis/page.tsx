import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, formatNumber } from "@/lib/format";
import benfordData from "../../../../public/data/benford-flags.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "When the Numbers Don't Add Up: Benford's Law Analysis — Medicaid",
  description: "Benford's Law predicts the leading digit distribution in natural financial data. We tested 617K Medicaid providers' claim amounts. 200 providers show the highest statistical deviations.",
  openGraph: {
    title: "Benford's Law: 200 Medicaid Providers With Unnatural Billing Patterns",
    description: "Real financial data follows Benford's Law. Fabricated data often doesn't. We tested 617K providers — these 200 deviate the most.",
  },
};

function titleCase(s: string): string {
  if (!s) return "";
  if (s === s.toUpperCase() && s.length > 3) {
    return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return s;
}

function lookupName(npi: string): string {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return titleCase(data.name || data.providerName || "") || `NPI: ${npi}`;
    }
  } catch {}
  return `NPI: ${npi}`;
}

const BENFORD_EXPECTED = [
  { digit: 1, pct: 30.1 },
  { digit: 2, pct: 17.6 },
  { digit: 3, pct: 12.5 },
  { digit: 4, pct: 9.7 },
  { digit: 5, pct: 7.9 },
  { digit: 6, pct: 6.7 },
  { digit: 7, pct: 5.8 },
  { digit: 8, pct: 5.1 },
  { digit: 9, pct: 4.6 },
];

const providers = (benfordData as any[]).sort((a, b) => b.chiSquared - a.chiSquared);

export default function BenfordAnalysis() {
  const highestChi = providers[0].chiSquared;
  const totalSpending = providers.reduce((s: number, p: any) => s + p.totalPaid, 0);
  const totalClaims = providers.reduce((s: number, p: any) => s + p.claimCount, 0);
  const avgChi = providers.reduce((s: number, p: any) => s + p.chiSquared, 0) / providers.length;
  const top30 = providers.slice(0, 30);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Benford&apos;s Law</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs font-medium text-purple-400">Statistical Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          When the Numbers Don&apos;t Add Up: Benford&apos;s Law Analysis
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Benford&apos;s Law predicts that the leading digit of naturally occurring numbers follows a specific distribution &mdash;
          &ldquo;1&rdquo; appears about 30% of the time, while &ldquo;9&rdquo; appears only 4.6%.
          Real financial data follows this pattern. Fabricated data often doesn&apos;t.
          We tested 617,000 providers&apos; claim amounts. These 200 deviate the most.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-purple-400 tabular-nums">{highestChi.toFixed(2)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Highest chi-squared</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{providers.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Flagged providers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{avgChi.toFixed(2)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Avg chi-squared</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{formatMoney(totalSpending)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Total spending</p>
        </div>
      </div>

      {/* Benford's Law Explained */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">How Benford&apos;s Law Works</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          In naturally occurring datasets &mdash; financial transactions, population counts, street addresses &mdash;
          the leading digit &ldquo;1&rdquo; appears far more often than &ldquo;9&rdquo;. This is because numbers grow
          logarithmically: it takes a 100% increase to go from 1xx to 2xx, but only an 11% increase to go from 8xx to 9xx.
          When someone fabricates numbers, they tend to distribute digits more evenly, violating this law.
        </p>

        {/* Expected Distribution Bar */}
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Expected Leading Digit Distribution</h3>
        <div className="space-y-2">
          {BENFORD_EXPECTED.map((d) => (
            <div key={d.digit} className="flex items-center gap-3">
              <span className="text-white font-bold text-sm w-4 text-right tabular-nums">{d.digit}</span>
              <div className="flex-1 bg-dark-700/50 rounded-full h-5 overflow-hidden">
                <div
                  className="bg-purple-500/60 h-5 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(d.pct / 30.1) * 100}%` }}
                >
                  <span className="text-[10px] font-semibold text-white tabular-nums">{d.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          The chi-squared statistic measures how far a provider&apos;s actual digit distribution deviates from these expected values.
          Higher values indicate greater divergence from the natural pattern.
        </p>
      </div>

      {/* Top 5 Featured */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-purple-500 rounded-full" />
          The Most Extreme Deviations
        </h2>
        <div className="space-y-3">
          {providers.slice(0, 5).map((p: any, i: number) => {
            const name = lookupName(p.npi);
            return (
              <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 font-bold text-sm">#{i + 1}</span>
                      <Link href={`/providers/${p.npi}`} className="text-white font-bold text-sm hover:text-purple-400 transition-colors">
                        {name}
                      </Link>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">NPI: {p.npi} &middot; {formatNumber(p.claimCount)} claims</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 font-extrabold text-xl tabular-nums">{p.chiSquared.toFixed(2)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">chi-squared</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-white font-semibold text-sm tabular-nums">{formatMoney(p.totalPaid)}</p>
                    <p className="text-[10px] text-slate-500">total paid</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-white font-semibold text-sm tabular-nums">{formatNumber(p.claimCount)}</p>
                    <p className="text-[10px] text-slate-500">total claims</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          The provider with the highest chi-squared score of <span className="text-white font-semibold">{highestChi.toFixed(2)}</span> shows
          a leading-digit distribution that deviates significantly from what Benford&apos;s Law predicts.
          Across these {providers.length} flagged providers, they collectively account
          for <span className="text-white font-semibold">{formatMoney(totalSpending)}</span> in Medicaid payments
          and <span className="text-white font-semibold">{formatNumber(totalClaims)}</span> claims.
        </p>

        <div className="bg-dark-800 border-l-4 border-purple-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">What the Chi-Squared Statistic Means</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The chi-squared test compares observed leading-digit frequencies against Benford&apos;s expected distribution.
            A value near 0 means the data perfectly matches the expected pattern. Values above 2.0 suggest significant
            deviation. Values above 3.0 are unusual enough to warrant investigation &mdash; the probability of this
            occurring by chance in natural data is very low.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Benford&apos;s Law has been used to detect fraud in tax returns, election results, and corporate accounting.
          In the context of Medicaid billing, a high chi-squared value could indicate round-number billing,
          repeated identical charges, or systematically inflated amounts &mdash; all patterns associated with
          fraudulent claims. However, legitimate explanations exist: providers with few distinct charge amounts
          or those who bill at fixed contract rates may naturally deviate from Benford&apos;s distribution.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Important Caveat</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Deviation from Benford&apos;s Law alone is not proof of fraud. Some legitimate billing patterns &mdash;
            fixed-rate contracts, standardized fee schedules, or low claim counts &mdash; can produce high chi-squared
            values. This analysis identifies providers whose billing amounts have an unusual digit distribution, which
            can be a signal worth investigating alongside other indicators. It is most meaningful in combination with
            other anomaly flags.
          </p>
        </div>
      </div>

      {/* Top 30 Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-purple-500 rounded-full" />
          Top 30 Highest Chi-Squared Providers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Chi-Squared</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
              </tr>
            </thead>
            <tbody>
              {top30.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-purple-400 transition-colors">
                      {lookupName(p.npi)}
                    </Link>
                    <p className="text-[10px] text-slate-600">NPI: {p.npi}</p>
                  </td>
                  <td data-label="Chi-Squared" className="py-2.5 pr-3 text-right text-purple-400 font-semibold tabular-nums">{p.chiSquared.toFixed(4)}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Claims" className="py-2.5 text-right text-slate-500 tabular-nums">{formatNumber(p.claimCount)}</td>
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
            <span><span className="text-purple-400 font-semibold">{providers.length} providers</span> show statistically significant deviations from Benford&apos;s Law in their billing amounts.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">&#9656;</span>
            <span>The highest chi-squared value is <span className="text-purple-400 font-semibold">{highestChi.toFixed(2)}</span>, far exceeding the threshold for statistical significance.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>These {providers.length} providers account for <span className="text-amber-400 font-semibold">{formatMoney(totalSpending)}</span> in total Medicaid spending.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Benford&apos;s Law analysis is a screening tool, not a verdict. High chi-squared values warrant investigation but do not prove fraud on their own.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("We tested 617K Medicaid providers against Benford's Law. 200 providers show billing patterns that deviate significantly from what natural financial data looks like.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/benford-analysis")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="benford-analysis" relatedSlugs={["round-numbers", "smooth-billers", "change-points"]} />
      </div>
    </article>
  );
}
