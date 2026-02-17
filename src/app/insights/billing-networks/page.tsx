import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import intermediaryData from "../../../../public/data/billing-intermediaries.json";
import smartWatchlist from "../../../../public/data/smart-watchlist.json";
import expandedWatchlist from "../../../../public/data/expanded-watchlist.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "The Middlemen: Who Bills on Behalf of Others? — OpenMedicaid",
  description: "In Medicaid, the billing NPI doesn't always match who performed the service. The top intermediary bills on behalf of 5,000+ providers. 78 of the top 100 intermediaries are on the fraud watchlist.",
  openGraph: {
    title: "The Middlemen: Who Bills on Behalf of Others?",
    description: "The top 100 billing intermediaries in Medicaid control $42.6B in payments. 78% are also on the fraud watchlist.",
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

const intermediaries = intermediaryData as { npi: string; servicingProviders: number; totalPaid: number; totalClaims: number; codeCount: number }[];

// Compute stats
const totalPaid = intermediaries.reduce((s, i) => s + i.totalPaid, 0);
const totalClaims = intermediaries.reduce((s, i) => s + i.totalClaims, 0);
const avgServicing = intermediaries.reduce((s, i) => s + i.servicingProviders, 0) / intermediaries.length;
const maxServicing = Math.max(...intermediaries.map((i) => i.servicingProviders));

// Cross-reference with watchlists
const smartNpis = new Set((smartWatchlist as any[]).map((p) => p.npi));
const expandedNpis = new Set((expandedWatchlist as any[]).map((p) => p.npi));
const smartMap = new Map((smartWatchlist as any[]).map((p) => [p.npi, p]));
const watchlistCount = intermediaries.filter((i) => smartNpis.has(i.npi) || expandedNpis.has(i.npi)).length;
const smartFlaggedCount = intermediaries.filter((i) => smartNpis.has(i.npi)).length;

export default function BillingIntermediaries() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Billing Intermediaries</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-medium text-emerald-400">Network Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The Middlemen: Who Bills on Behalf of Others?
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          In Medicaid, the billing NPI doesn&apos;t always match who performed the service.
          Some NPIs act as billing intermediaries for dozens or hundreds of other providers.
          The top intermediary bills on behalf of {maxServicing.toLocaleString()}+ servicing providers.
          This is normal for hospitals and health systems &mdash; but when a small entity bills for hundreds of providers,
          it raises questions about pass-through billing and potential fraud.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 tabular-nums">{maxServicing.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Top intermediary count</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{formatMoney(totalPaid)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Through intermediaries</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{Math.round(avgServicing).toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Avg providers/intermediary</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{watchlistCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Also on watchlist</p>
        </div>
      </div>

      {/* Featured Cards: Top 3 */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {intermediaries.slice(0, 3).map((n) => {
          const name = lookupName(n.npi);
          const onWatchlist = smartNpis.has(n.npi) || expandedNpis.has(n.npi);
          return (
            <div key={n.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
              <Link href={`/providers/${n.npi}`} className="text-white font-bold text-sm hover:text-emerald-400 transition-colors block mb-1 truncate">
                {name}
              </Link>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs text-slate-500">NPI: {n.npi}</p>
                {onWatchlist && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 font-medium">FLAGGED</span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Providers billed for</span>
                  <span className="text-sm text-emerald-400 font-bold tabular-nums">{n.servicingProviders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Total paid</span>
                  <span className="text-sm text-white font-semibold tabular-nums">{formatMoney(n.totalPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Total claims</span>
                  <span className="text-sm text-slate-300 tabular-nums">{formatNumber(n.totalClaims)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Procedure codes</span>
                  <span className="text-sm text-slate-300 tabular-nums">{n.codeCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          When a doctor sees a Medicaid patient, the claim filed with the state often comes from
          a different entity entirely &mdash; a hospital, a management company, or a billing organization.
          The entity that submits the bill is the &quot;billing intermediary,&quot; and the providers who actually
          deliver care are the &quot;servicing providers.&quot; This intermediary model is how most of American
          healthcare billing works.
        </p>

        <div className="bg-dark-800 border-l-4 border-emerald-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The Scale of Intermediary Billing</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The top 100 billing intermediaries collectively processed <span className="text-white font-semibold">{formatMoney(totalPaid)}</span> in
            Medicaid payments across <span className="text-white font-semibold">{formatNumber(totalClaims)}</span> claims.
            The largest single intermediary bills on behalf of <span className="text-emerald-400 font-semibold">{maxServicing.toLocaleString()} servicing providers</span>,
            while the average intermediary in this list represents {Math.round(avgServicing).toLocaleString()} providers.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Many of the top intermediaries are exactly what you&apos;d expect: major hospital systems,
          managed care organizations, and large medical groups. These are legitimate arrangements
          where an institution files claims on behalf of its employed or affiliated providers.
          Cleveland Clinic, for example, bills for over 5,000 individual service providers.
        </p>

        <h2 className="text-xl font-bold text-white flex items-center gap-2 !mt-10 !mb-4">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          When Intermediaries Raise Red Flags
        </h2>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The concerning cases aren&apos;t the giant hospital systems. They&apos;re the entities that
          bill for a surprisingly large number of providers while also triggering fraud detection flags.
          Of the top 100 billing intermediaries, <span className="text-red-400 font-semibold">{watchlistCount} are also on our fraud watchlist</span> &mdash;
          flagged by statistical tests for unusual billing patterns like cost outliers, billing swings,
          or rapid growth.
        </p>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          {smartFlaggedCount} of these intermediaries were flagged specifically by our code-specific analysis,
          meaning their per-procedure costs deviate significantly from national benchmarks. When an intermediary
          bills at rates far above the median across multiple procedure codes &mdash; while also representing
          dozens or hundreds of providers &mdash; the overspending is multiplied across every provider they bill for.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Pass-Through Billing Risk</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Pass-through billing occurs when an intermediary entity inflates claims before passing
            payment to the actual service provider. Because the intermediary controls the billing
            relationship, they can set higher-than-market rates, add unnecessary codes, or bill
            for services that were never provided &mdash; all without the servicing provider&apos;s knowledge.
            The more providers an intermediary bills for, the more opportunities exist for this kind of abuse.
          </p>
        </div>
      </div>

      {/* Top 30 Billing Intermediaries Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-emerald-500 rounded-full" />
          Top 30 Billing Intermediaries
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Billing Entity</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Providers</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Codes</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-center">Watchlist</th>
              </tr>
            </thead>
            <tbody>
              {intermediaries.slice(0, 30).map((n, i) => {
                const name = lookupName(n.npi);
                const onWatchlist = smartNpis.has(n.npi) || expandedNpis.has(n.npi);
                const smartProvider = smartMap.get(n.npi);
                return (
                  <tr key={n.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                    <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                    <td data-label="Entity" className="py-2.5 pr-3">
                      <Link href={`/providers/${n.npi}`} className="text-slate-300 hover:text-emerald-400 transition-colors">
                        {name}
                      </Link>
                      {smartProvider && smartProvider.flagCount >= 3 && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 font-medium">
                          {smartProvider.flagCount} flags
                        </span>
                      )}
                    </td>
                    <td data-label="Providers" className="py-2.5 pr-3 text-right text-emerald-400 font-semibold tabular-nums">{n.servicingProviders.toLocaleString()}</td>
                    <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-white tabular-nums">{formatMoney(n.totalPaid)}</td>
                    <td data-label="Claims" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(n.totalClaims)}</td>
                    <td data-label="Codes" className="py-2.5 pr-3 text-right text-slate-500 tabular-nums">{n.codeCount}</td>
                    <td data-label="Watchlist" className="py-2.5 text-center">
                      {onWatchlist ? (
                        <span className="text-red-400 text-xs font-semibold">Yes</span>
                      ) : (
                        <span className="text-slate-600 text-xs">&mdash;</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watchlist Cross-Reference */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          Watchlist Cross-Reference
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Of the 100 largest billing intermediaries, <span className="text-red-400 font-semibold">{watchlistCount}</span> also
          appear on our fraud watchlist. {smartFlaggedCount} were flagged by the code-specific statistical analysis
          (cost outliers, billing swings, massive new entrants, or multi-code rate outliers).
          This doesn&apos;t mean these entities are committing fraud &mdash; large billing volumes naturally
          increase the chance of triggering statistical thresholds &mdash; but it means their billing
          patterns warrant closer inspection.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-red-400 tabular-nums">{watchlistCount}%</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">On any watchlist</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-amber-400 tabular-nums">{smartFlaggedCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Smart test flags</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-slate-300 tabular-nums">{100 - watchlistCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">No flags</p>
          </div>
        </div>
      </div>

      {/* Caveat */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">Important Caveat</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Large hospitals and health systems legitimately bill for many providers. A major medical center
          with thousands of employed physicians will naturally appear as a high-volume billing intermediary.
          The presence of an entity on this list does not indicate wrongdoing. The concerning cases are
          smaller, less-established entities that bill for a disproportionately large number of providers
          relative to their organizational size, especially when combined with other statistical anomalies.
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">&#9656;</span>
            <span>The top billing intermediary in Medicaid bills on behalf of <span className="text-emerald-400 font-semibold">{maxServicing.toLocaleString()}</span> servicing providers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-0.5">&#9656;</span>
            <span>The top 100 intermediaries control <span className="text-white font-semibold">{formatMoney(totalPaid)}</span> in Medicaid payments across {formatNumber(totalClaims)} claims.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span><span className="text-red-400 font-semibold">{watchlistCount} of 100</span> top intermediaries are also on the fraud watchlist, representing entities with statistically unusual billing patterns.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>Most large intermediaries are legitimate hospital systems, but the intermediary model creates opportunities for pass-through billing abuse that is difficult to detect.</span>
          </li>
        </ul>
      </div>

      {/* Methodology */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">Methodology</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          This analysis identifies billing intermediaries by comparing the <code className="text-xs bg-dark-700 px-1.5 py-0.5 rounded text-slate-300">billing_npi</code> and
          <code className="text-xs bg-dark-700 px-1.5 py-0.5 rounded text-slate-300">servicing_npi</code> fields across
          227 million T-MSIS Other Services records (2018&ndash;2024). An intermediary is defined as a billing NPI
          that submits claims on behalf of multiple distinct servicing NPIs. The top 100 are ranked by total
          payments. Watchlist cross-referencing compares intermediary NPIs against both the code-specific
          smart watchlist (880 providers) and the legacy expanded watchlist (788 providers).
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("The top 100 Medicaid billing intermediaries control $42.6B in payments. 80% are also on the fraud watchlist.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/billing-networks")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Insights</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/insights/dual-billing" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">The Dual-Billing Pattern</p>
            <p className="text-xs text-slate-500 mt-1">When claim counts match too perfectly &rarr;</p>
          </Link>
          <Link href="/insights/smooth-billers" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Providers Who Bill Like Clockwork</p>
            <p className="text-xs text-slate-500 mt-1">Suspiciously uniform monthly billing &rarr;</p>
          </Link>
        </div>
      </div>
    </article>
  );
}
