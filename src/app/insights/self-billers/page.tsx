import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, formatNumber } from "@/lib/format";
import selfBillers from "../../../../public/data/self-billers.json";
import smartWatchlist from "../../../../public/data/smart-watchlist.json";
import expandedWatchlist from "../../../../public/data/expanded-watchlist.json";
import topProviders from "../../../../public/data/top-providers-1000.json";

export const metadata: Metadata = {
  title: "Solo Operators: Providers Billing $5M+ Entirely Themselves — OpenMedicaid",
  description: "100 Medicaid providers bill $5M+ where 95%+ of payments go to self-billed claims. Together they account for over $72B. These solo operators process millions of claims essentially alone.",
  openGraph: {
    title: "Solo Operators: Providers Billing $5M+ Entirely Themselves",
    description: "100 providers billing $5M+ with 95%+ self-billing ratios — over $72B combined. An unusual pattern warranting scrutiny.",
  },
};

// Build name lookup map from top providers and watchlists
const nameMap = new Map<string, string>();
for (const p of topProviders as any[]) {
  if (p.npi && p.name) nameMap.set(p.npi, p.name);
}
for (const p of smartWatchlist as any[]) {
  if (p.npi && p.name && !nameMap.has(p.npi)) nameMap.set(p.npi, p.name);
}
for (const p of expandedWatchlist as any[]) {
  if (p.npi && p.name && !nameMap.has(p.npi)) nameMap.set(p.npi, p.name);
}

function lookupName(npi: string): string {
  return nameMap.get(npi) || "Unknown Provider";
}

const providers = selfBillers as any[];

// Compute stats
const totalSelfSpending = providers.reduce((s: number, p: any) => s + p.selfPaid, 0);
const totalSpending = providers.reduce((s: number, p: any) => s + p.totalPaid, 0);
const totalClaims = providers.reduce((s: number, p: any) => s + p.totalClaims, 0);
const fullSelfBillers = providers.filter((p: any) => p.selfPct >= 100.0);
const highest = providers[0]; // sorted by totalPaid desc

// Cross-reference with watchlists
const smartNpis = new Set((smartWatchlist as any[]).map((p: any) => p.npi));
const expandedNpis = new Set((expandedWatchlist as any[]).map((p: any) => p.npi));
const watchlistNpis = new Set([...Array.from(smartNpis), ...Array.from(expandedNpis)]);
const onWatchlist = providers.filter((p: any) => watchlistNpis.has(p.npi));

export default function SelfBillers() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Self-Billing Providers</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-3 py-1 text-xs font-medium text-rose-400">Billing Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Solo Operators: Providers Billing $5M+ Entirely Themselves
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Most large Medicaid billers are organizations that bill on behalf of many practitioners.
          But some providers bill $5M+ where 95%+ of payments go to claims where the billing and
          servicing NPI are the same entity. These &ldquo;solo operators&rdquo; are processing millions
          in claims essentially alone &mdash; an unusual pattern that warrants scrutiny.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-rose-400 tabular-nums">{fullSelfBillers.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">At 100% self-billing</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{formatMoney(totalSpending)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Total self-biller spending</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{formatMoney(highest.totalPaid)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Highest single provider</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-orange-400 tabular-nums">{onWatchlist.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Also on fraud watchlist</p>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">What Is Self-Billing?</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          In Medicaid, the &ldquo;billing NPI&rdquo; is the entity that submits the claim, and the
          &ldquo;servicing NPI&rdquo; is the provider who actually delivered the care. Large health
          systems, hospital networks, and billing intermediaries typically submit claims on behalf
          of many individual practitioners &mdash; so their billing NPI appears on thousands of
          claims from different servicing providers.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-emerald-400 font-bold text-sm">Typical Pattern</p>
            <p className="text-xs text-slate-500 mt-1">Billing NPI &#8800; Servicing NPI. An organization bills for many practitioners.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-orange-400 font-bold text-sm">Self-Billing (95%+)</p>
            <p className="text-xs text-slate-500 mt-1">Billing NPI = Servicing NPI on nearly every claim. One entity does everything.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-red-400 font-bold text-sm">100% Self-Billing</p>
            <p className="text-xs text-slate-500 mt-1">Every single claim is billed and serviced by the same NPI. No outside practitioners involved.</p>
          </div>
        </div>
      </div>

      {/* Featured: Top Self-Billers */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-rose-500 rounded-full" />
          The Largest Solo Operators
        </h2>

        <div className="space-y-4">
          {providers.slice(0, 5).map((p: any, i: number) => {
            const isWatchlisted = watchlistNpis.has(p.npi);
            return (
              <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400 font-extrabold text-sm tabular-nums">#{i + 1}</span>
                      <Link href={`/providers/${p.npi}`} className="text-white font-bold text-sm hover:text-rose-400 transition-colors">
                        {lookupName(p.npi)}
                      </Link>
                      {isWatchlisted && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 uppercase tracking-wider">Watchlist</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">NPI: {p.npi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-rose-400 font-extrabold text-lg tabular-nums">{formatMoney(p.totalPaid)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">total paid</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-white font-bold tabular-nums text-sm">{formatMoney(p.selfPaid)}</p>
                    <p className="text-[10px] text-slate-500">self-billed</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className={`font-bold tabular-nums text-sm ${p.selfPct >= 100 ? 'text-red-400' : 'text-orange-400'}`}>{p.selfPct.toFixed(1)}%</p>
                    <p className="text-[10px] text-slate-500">self-billing ratio</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-slate-300 font-bold tabular-nums text-sm">{formatNumber(p.totalClaims)}</p>
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
          We analyzed billing-vs-servicing NPI relationships across all 227 million records
          and identified 100 providers who bill $5M+ where at least 95% of their payments
          flow to claims where they are both the billing and servicing entity. Together, these
          solo operators account for <span className="text-white font-semibold">{formatMoney(totalSpending)}</span> in
          total Medicaid spending across <span className="text-white font-semibold">{formatNumber(totalClaims)} claims</span>.
        </p>

        <div className="bg-dark-800 border-l-4 border-rose-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The Scale: {fullSelfBillers.length} Providers at 100% Self-Billing</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Of the 100 providers on this list, <span className="text-rose-400 font-semibold">{fullSelfBillers.length} bill at
            exactly 100% self-billing ratio</span> &mdash; meaning every single claim they submitted over seven years
            listed themselves as both the billing and servicing provider. For entities processing millions of claims
            and billions in payments, having zero involvement from any other practitioner is a striking pattern.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The highest single self-biller received <span className="text-white font-semibold">{formatMoney(highest.totalPaid)}</span> across <span className="text-white font-semibold">{formatNumber(highest.totalClaims)} claims</span>,
          with <span className="text-rose-400 font-semibold">{highest.selfPct.toFixed(1)}%</span> of payments going to
          self-billed claims. At that volume, the question becomes: can one entity truly deliver that scale
          of services without any other providers involved in billing?
        </p>

        <div className="bg-dark-800 border-l-4 border-orange-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Watchlist Cross-Reference: {onWatchlist.length} Overlap</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Of the 100 self-billing providers, <span className="text-orange-400 font-semibold">{onWatchlist.length} also
            appear on our fraud watchlist</span>, flagged for independent statistical anomalies like billing swings,
            cost-per-claim outliers, or massive new entrant patterns. The overlap between self-billing behavior
            and other fraud signals reinforces the value of investigating these providers further.
          </p>
        </div>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">When self-billing is legitimate</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Many providers legitimately bill for their own services. Nursing homes, DME suppliers, home health
            agencies, and solo medical practices often operate with a single NPI for both billing and service delivery.
            Government entities and managed care organizations may also show high self-billing ratios.
            This analysis identifies an unusual pattern at high dollar volumes &mdash; not proof of fraud, but a signal
            that these providers warrant closer scrutiny given the scale of their self-billed operations.
          </p>
        </div>
      </div>

      {/* Full Table: Top 30 */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-rose-500 rounded-full" />
          Top 30 Self-Billing Providers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Self %</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
              </tr>
            </thead>
            <tbody>
              {providers.slice(0, 30).map((p: any, i: number) => {
                const isWatchlisted = watchlistNpis.has(p.npi);
                return (
                  <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                    <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                    <td data-label="Provider" className="py-2.5 pr-3">
                      <div className="flex items-center gap-1.5">
                        <div>
                          <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-rose-400 transition-colors">
                            {lookupName(p.npi)}
                          </Link>
                          <p className="text-[10px] text-slate-600 tabular-nums">NPI: {p.npi}</p>
                        </div>
                        {isWatchlisted && (
                          <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400">WL</span>
                        )}
                      </div>
                    </td>
                    <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(p.totalPaid)}</td>
                    <td data-label="Self %" className={`py-2.5 pr-3 text-right font-semibold tabular-nums ${p.selfPct >= 100 ? 'text-red-400' : 'text-orange-400'}`}>{p.selfPct.toFixed(1)}%</td>
                    <td data-label="Claims" className="py-2.5 text-right text-slate-400 tabular-nums">{formatNumber(p.totalClaims)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-rose-400 mt-0.5">&#9656;</span>
            <span><span className="text-rose-400 font-semibold">100 providers</span> bill $5M+ with 95%+ self-billing ratios, totaling {formatMoney(totalSpending)} across {formatNumber(totalClaims)} claims.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-400 mt-0.5">&#9656;</span>
            <span><span className="text-rose-400 font-semibold">{fullSelfBillers.length} providers</span> operate at exactly 100% self-billing &mdash; every claim they submitted listed themselves as both biller and servicer.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">&#9656;</span>
            <span><span className="text-orange-400 font-semibold">{onWatchlist.length} of these providers</span> also appear on the fraud watchlist, flagged independently for statistical billing anomalies.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Legitimate solo practices, nursing homes, and DME suppliers may have high self-billing ratios. This is a signal for further investigation, not proof of fraud.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("100 Medicaid providers bill $5M+ with 95%+ self-billing ratios — processing millions of claims entirely themselves. Together they account for over $72B.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/self-billers")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="self-billers" relatedSlugs={["billing-networks", "round-numbers", "dual-billing"]} />
      </div>
    </article>
  );
}
