import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, formatNumber } from "@/lib/format";
import roundBillers from "../../../../public/data/round-billers.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Round Number Billing: When Every Claim Ends in Zeros — OpenMedicaid",
  description: "100 Medicaid providers show heavy round-number billing patterns — nearly 68,000 claims at exact round dollar amounts totaling $128M. Legitimate billing rarely produces perfectly round numbers.",
  openGraph: {
    title: "Round Number Billing: When Every Claim Ends in Zeros",
    description: "100 providers with heavy round-number billing patterns. Nearly 68,000 claims at exact round dollar amounts totaling $128M.",
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

function lookupName(npi: string): string {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return titleCase(data.name || data.providerName || "") || `NPI: ${npi}`;
  } catch {
    return `NPI: ${npi}`;
  }
}

const providers = roundBillers as any[];
const totalRoundClaims = providers.reduce((s: number, p: any) => s + p.totalRoundClaims, 0);
const totalRoundSpending = providers.reduce((s: number, p: any) => s + p.roundSpending, 0);
const highestClaims = providers.reduce((a: any, b: any) => a.totalRoundClaims > b.totalRoundClaims ? a : b);
const mostPatterns = providers.reduce((a: any, b: any) => a.roundPatterns > b.roundPatterns ? a : b);

export default function RoundNumbers() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Round Number Billing</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-xs font-medium text-amber-400">Pattern Detection</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Round Number Billing: When Every Claim Ends in Zeros
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Legitimate medical billing rarely produces perfectly round numbers. Costs involve complex fee
          schedules, modifiers, and insurance calculations. When a provider submits dozens of claims at
          exact round dollar amounts &mdash; $500.00, $1,000.00, $2,500.00 &mdash; it suggests the
          amounts may be fabricated rather than derived from actual services.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{formatNumber(totalRoundClaims)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Round-number claims</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{formatMoney(totalRoundSpending)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Round-number spending</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{formatNumber(highestClaims.totalRoundClaims)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Most by one provider</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">100</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Flagged providers</p>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">Why Round Numbers Are Suspicious</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Medical billing amounts are determined by fee schedules, procedure modifiers, geographic
          adjustments, and insurance negotiation. The result is almost never a round number. A typical
          claim might be $347.82 or $1,213.47 &mdash; not $500.00 or $2,000.00.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-amber-400 font-bold text-lg">$347.82</p>
            <p className="text-xs text-slate-500 mt-1">Normal: Fee schedule + modifier + geographic adjustment = odd number.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-red-400 font-bold text-lg">$500.00</p>
            <p className="text-xs text-slate-500 mt-1">Suspicious: Exact round amounts suggest the number was chosen, not calculated.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-red-400 font-bold text-lg">$2,500.00</p>
            <p className="text-xs text-slate-500 mt-1">Red flag: Multiple large round claims from one provider signals fabrication.</p>
          </div>
        </div>
      </div>

      {/* Featured: Top Round Billers */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          The Heaviest Round-Number Billers
        </h2>

        <div className="space-y-4">
          {providers.slice(0, 5).map((p: any, i: number) => {
            const pctOfSpending = totalRoundSpending > 0 ? ((p.roundSpending / totalRoundSpending) * 100) : 0;
            return (
              <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-extrabold text-sm tabular-nums">#{i + 1}</span>
                      <Link href={`/providers/${p.npi}`} className="text-white font-bold text-sm hover:text-amber-400 transition-colors">
                        {lookupName(p.npi)}
                      </Link>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">NPI: {p.npi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-extrabold text-lg tabular-nums">{formatNumber(p.totalRoundClaims)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">round claims</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-white font-bold tabular-nums text-sm">{formatMoney(p.roundSpending)}</p>
                    <p className="text-[10px] text-slate-500">round spending</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-amber-400 font-bold tabular-nums text-sm">{p.roundPatterns}</p>
                    <p className="text-[10px] text-slate-500">distinct amounts</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-slate-300 font-bold tabular-nums text-sm">{pctOfSpending.toFixed(1)}%</p>
                    <p className="text-[10px] text-slate-500">of total round $</p>
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
          We scanned all 227 million billing records for providers who repeatedly submit claims at
          exact round dollar amounts. Out of more than 617,000 providers, we identified 100 with
          exceptionally heavy round-number billing &mdash; providers with 50 or more round-dollar
          claims across multiple distinct amounts.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The Top Round Biller: {formatNumber(highestClaims.totalRoundClaims)} Claims</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The most prolific round-number biller submitted <span className="text-amber-400 font-semibold">{formatNumber(highestClaims.totalRoundClaims)} claims</span> at
            exact round dollar amounts across <span className="text-white font-semibold">{highestClaims.roundPatterns} different round amounts</span>,
            totaling <span className="text-white font-semibold">{formatMoney(highestClaims.roundSpending)}</span> in round-number spending alone.
            That many round claims from a single provider is extraordinarily unlikely to occur naturally.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Together, these 100 providers submitted <span className="text-white font-semibold">{formatNumber(totalRoundClaims)} round-number claims</span> totaling <span className="text-white font-semibold">{formatMoney(totalRoundSpending)}</span>.
          The provider with the most variety billed across <span className="text-amber-400 font-semibold">{mostPatterns.roundPatterns} different round amounts</span> &mdash;
          suggesting systematic use of fabricated figures rather than an occasional coincidence.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">When round billing is legitimate</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Some services have legitimately round rates &mdash; especially flat-rate contracts,
            per-diem payments, and capitated arrangements. A group home might bill exactly $200/day
            per resident. A transportation provider might charge a flat $50 per trip. This analysis
            is a signal for further investigation, not proof of fraud. The providers flagged here
            show an unusually high concentration of round-number claims that warrants closer scrutiny.
          </p>
        </div>
      </div>

      {/* Full Table: Top 30 */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          Top 30 Round-Number Billers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Round Patterns</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Round Claims</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Round Spending</th>
              </tr>
            </thead>
            <tbody>
              {providers.slice(0, 30).map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-amber-400 transition-colors">
                      {lookupName(p.npi)}
                    </Link>
                    <p className="text-[10px] text-slate-600">NPI: {p.npi}</p>
                  </td>
                  <td data-label="Patterns" className="py-2.5 pr-3 text-right text-amber-400 font-semibold tabular-nums">{p.roundPatterns}</td>
                  <td data-label="Claims" className="py-2.5 pr-3 text-right text-white tabular-nums">{formatNumber(p.totalRoundClaims)}</td>
                  <td data-label="Spending" className="py-2.5 text-right text-slate-400 tabular-nums">{formatMoney(p.roundSpending)}</td>
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
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span><span className="text-amber-400 font-semibold">100 providers</span> show heavy round-number billing patterns across {formatNumber(totalRoundClaims)} claims totaling {formatMoney(totalRoundSpending)}.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>The top provider submitted <span className="text-amber-400 font-semibold">{formatNumber(highestClaims.totalRoundClaims)} round-number claims</span> across {highestClaims.roundPatterns} distinct round amounts.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>Legitimate medical billing involves fee schedules, modifiers, and insurance calculations that almost never produce round numbers. High concentrations of round claims suggest amounts were chosen, not calculated.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Some services (flat-rate contracts, per-diem payments, transportation) have legitimately round rates. This is a signal for investigation, not proof of fraud.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("100 Medicaid providers show heavy round-number billing — nearly 68,000 claims at exact round dollar amounts totaling $128M. Legitimate billing rarely produces perfectly round numbers.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/round-numbers")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="round-numbers" relatedSlugs={["smooth-billers", "benford-analysis", "self-billers"]} />
      </div>
    </article>
  );
}
