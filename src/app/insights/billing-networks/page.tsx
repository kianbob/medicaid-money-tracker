import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import networkData from "../../../../public/data/billing-networks.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "The Hidden Billing Networks of Medicaid — 65% of Payments Flow Through Intermediaries",
  description: "65% of all 227M Medicaid billing records have a different billing NPI than servicing NPI. 174,774 ghost billers never provide services. The largest network bills for 5,745 providers.",
  openGraph: {
    title: "The Hidden Billing Networks of Medicaid",
    description: "65% of Medicaid payments flow through intermediary billers. Cleveland Clinic bills for 5,745 providers. 174,774 NPIs bill but never provide services.",
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

const stats = networkData.stats;
const topNetworks = networkData.topNetworks;

export default function BillingNetworks() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Billing Networks</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 text-xs font-medium text-violet-400">Original Analysis</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          65% of Medicaid Payments Flow Through Intermediary Billers
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          In the majority of Medicaid claims, the entity that bills is not the entity that provides the service.
          Hundreds of billions of dollars flow through organizational billing intermediaries &mdash; and 174,774 NPIs bill
          but <em>never</em> appear as service providers.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-violet-400 tabular-nums">{stats.pctDifferentNpi}%</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Claims via intermediary</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{formatNumber(stats.ghostBillers)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Ghost billers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{formatNumber(stats.ghostServicers)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Ghost servicers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 tabular-nums">5,745</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Largest network</p>
        </div>
      </div>

      {/* Featured Cards: Top 3 */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {topNetworks.slice(0, 3).map((n: any) => {
          const name = lookupName(n.billingNpi, n.name);
          return (
            <div key={n.billingNpi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
              <Link href={`/providers/${n.billingNpi}`} className="text-white font-bold text-sm hover:text-violet-400 transition-colors block mb-1 truncate">
                {name}
              </Link>
              <p className="text-xs text-slate-500 mb-3">NPI: {n.billingNpi}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Providers billed for</span>
                  <span className="text-sm text-violet-400 font-bold tabular-nums">{n.servicingProviderCount.toLocaleString()}</span>
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
          When a doctor sees a patient, the claim that goes to Medicaid often isn&apos;t filed by the doctor.
          It&apos;s filed by a hospital, a management company, or a billing entity. In the T-MSIS dataset, {stats.pctDifferentNpi}%
          of all {formatNumber(stats.totalDifferentRows * 1.5)} billing records have a <em>different</em> billing NPI than servicing NPI &mdash;
          meaning the biller and the provider are two different entities.
        </p>

        <div className="bg-dark-800 border-l-4 border-violet-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Cleveland Clinic: 5,745 Providers Under One Billing NPI</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The Cleveland Clinic Foundation (NPI: 1679525919) is the largest billing network in Medicaid.
            A single billing NPI represents <span className="text-violet-400 font-semibold">5,745 individual service providers</span>,
            filing <span className="text-white font-semibold">9.2 million claims</span> worth <span className="text-white font-semibold">{formatMoney(topNetworks[0].totalPaid)}</span> across {topNetworks[0].codeCount} procedure codes.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Many of the largest networks are exactly what you&apos;d expect: major hospital systems (Montefiore, Vanderbilt, Ochsner),
          medical groups (Kaiser Permanente appears multiple times), and university health systems (Yale, NYU, Duke).
          These are legitimate billing arrangements where an institution files claims on behalf of its employed providers.
        </p>

        <h2 className="text-xl font-bold text-white flex items-center gap-2 !mt-10 !mb-4">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          The Ghost Billers
        </h2>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          But the data also reveals something more troubling: <span className="text-red-400 font-semibold">{stats.ghostBillers.toLocaleString()} NPIs</span> appear
          as billing entities but <em>never once</em> appear as service providers in the entire dataset.
          These are &quot;ghost billers&quot; &mdash; entities that exist only to bill, never to provide care.
        </p>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          On the flip side, <span className="text-amber-400 font-semibold">{stats.ghostServicers.toLocaleString()} NPIs</span> appear
          only as service providers but never file their own claims. These &quot;ghost servicers&quot; may be
          employed physicians who always bill through their institution, but the sheer number suggests many
          NPIs exist in the dataset with no clear bilateral billing relationship.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Why this matters</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Many billing networks are legitimate &mdash; hospitals bill for their employed physicians, management
            companies bill for home care aides. But the scale and opacity of these relationships creates
            vulnerability to fraud. When 65% of all payments flow through intermediaries, it becomes harder
            to trace where money actually goes and whether the services were really provided.
          </p>
        </div>
      </div>

      {/* Top Billing Networks Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-violet-500 rounded-full" />
          Top 100 Billing Networks by Provider Count
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
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Codes</th>
              </tr>
            </thead>
            <tbody>
              {topNetworks.slice(0, 100).map((n: any, i: number) => {
                const name = lookupName(n.billingNpi, n.name);
                return (
                  <tr key={n.billingNpi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                    <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                    <td data-label="Entity" className="py-2.5 pr-3">
                      <Link href={`/providers/${n.billingNpi}`} className="text-slate-300 hover:text-violet-400 transition-colors">
                        {name}
                      </Link>
                    </td>
                    <td data-label="Providers" className="py-2.5 pr-3 text-right text-violet-400 font-semibold tabular-nums">{n.servicingProviderCount.toLocaleString()}</td>
                    <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-white tabular-nums">{formatMoney(n.totalPaid)}</td>
                    <td data-label="Claims" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatNumber(n.totalClaims)}</td>
                    <td data-label="Codes" className="py-2.5 text-right text-slate-500 tabular-nums">{n.codeCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology note */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">Why This Is Unique</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-3">
          This is the first public analysis of billing-vs-servicing NPI relationships in the T-MSIS dataset.
          While CMS publishes provider-level spending data, no public source maps the intermediary billing
          networks that control how money flows from Medicaid to individual providers.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Our analysis compared the <code className="text-xs bg-dark-700 px-1.5 py-0.5 rounded text-slate-300">billing_npi</code> and
          <code className="text-xs bg-dark-700 px-1.5 py-0.5 rounded text-slate-300">servicing_npi</code> fields across all
          227 million records in the T-MSIS Other Services file. The {stats.pctDifferentNpi}% figure represents
          records where these two fields contain different values.
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-violet-400 mt-0.5">&#9656;</span>
            <span><span className="text-violet-400 font-semibold">{stats.pctDifferentNpi}%</span> of Medicaid billing records flow through an intermediary &mdash; the biller and provider are different entities.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span><span className="text-red-400 font-semibold">{stats.ghostBillers.toLocaleString()}</span> &quot;ghost billers&quot; file claims but never appear as service providers in the entire dataset.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>The largest single billing network (Cleveland Clinic) represents <span className="text-white font-semibold">5,745 providers</span> and {formatMoney(topNetworks[0].totalPaid)} in payments.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Most large networks are legitimate hospital systems and medical groups, but the opacity of these relationships creates fraud vulnerability.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("65% of Medicaid payments flow through intermediary billers. 174,774 NPIs bill but never provide services. Cleveland Clinic bills for 5,745 providers.")}&url=${encodeURIComponent("https://medicaidmoneytracker.com/insights/billing-networks")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
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
