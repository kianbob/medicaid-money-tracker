import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, formatNumber, formatMoneyFull } from "@/lib/format";
import volumeData from "../../../../public/data/impossible-volume.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Impossible Billing Volume: Providers Filing 50+ Claims Per Day — Medicaid",
  description: "200 Medicaid providers file more than 50 claims per working day — some over 60,000. At that pace, each patient visit would last seconds. Are these real services?",
  openGraph: {
    title: "60,000 Claims Per Day: Impossible Billing Volume in Medicaid",
    description: "200 providers file 50+ claims per working day. The top provider averages 60,410 claims daily for 7 years straight.",
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

const providers = (volumeData as any[]).sort((a, b) => b.claimsPerDay - a.claimsPerDay);

export default function ImpossibleVolume() {
  const topClaimsPerDay = providers[0].claimsPerDay;
  const over100 = providers.filter((p) => p.claimsPerDay > 100);
  const over1000 = providers.filter((p) => p.claimsPerDay > 1000);
  const totalSpending = providers.reduce((s: number, p: any) => s + p.totalPaid, 0);
  const totalClaims = providers.reduce((s: number, p: any) => s + p.totalClaims, 0);
  const top30 = providers.slice(0, 30);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Impossible Volume</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium text-red-400">Advanced Detection</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Impossible Billing Volume: Providers Filing 50+ Claims Per Day
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Some providers file so many claims per working day that they physically could not have performed the services.
          At 50+ claims per day, each patient visit would need to be under 10 minutes.
          The top providers file tens of thousands of claims daily &mdash; physically impossible for a single provider.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{formatNumber(topClaimsPerDay)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Top claims/day</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{providers.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Flagged providers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{over1000.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Over 1K/day</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{formatMoney(totalSpending)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Total spending</p>
        </div>
      </div>

      {/* The Math */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">The Math: Why 50+ Claims/Day Is a Red Flag</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          We calculate claims per working day by dividing total claims by active months, then by 22 working days per month.
          Here&apos;s what different volumes mean in practice:
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-green-400 font-bold text-lg tabular-nums">10&ndash;20/day</p>
            <p className="text-xs text-slate-500 mt-1">Typical busy practice. 24&ndash;48 min per patient in an 8-hour day. Normal.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-yellow-400 font-bold text-lg tabular-nums">50&ndash;100/day</p>
            <p className="text-xs text-slate-500 mt-1">Under 10 min per visit. Possible with lab work or group billing, but unusual for clinical care.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-red-400 font-bold text-lg tabular-nums">1,000+/day</p>
            <p className="text-xs text-slate-500 mt-1">Physically impossible for an individual. Likely an organization, clearinghouse, or billing aggregator.</p>
          </div>
        </div>
      </div>

      {/* Top 5 Featured */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          The Most Extreme Cases
        </h2>
        <div className="space-y-3">
          {providers.slice(0, 5).map((p: any, i: number) => {
            const name = lookupName(p.npi);
            const minutesPerClaim = (8 * 60) / p.claimsPerDay;
            return (
              <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 font-bold text-sm">#{i + 1}</span>
                      <Link href={`/providers/${p.npi}`} className="text-white font-bold text-sm hover:text-red-400 transition-colors">
                        {name}
                      </Link>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">NPI: {p.npi} &middot; {p.activeMonths} months active</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-extrabold text-xl tabular-nums">{formatNumber(p.claimsPerDay)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">claims/day</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-white font-semibold text-sm tabular-nums">{formatMoney(p.totalPaid)}</p>
                    <p className="text-[10px] text-slate-500">total paid</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-white font-semibold text-sm tabular-nums">{formatNumber(p.totalClaims)}</p>
                    <p className="text-[10px] text-slate-500">total claims</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                    <p className="text-amber-400 font-semibold text-sm tabular-nums">{minutesPerClaim < 0.01 ? "<0.01" : minutesPerClaim.toFixed(2)} min</p>
                    <p className="text-[10px] text-slate-500">per claim (8hr day)</p>
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
          The top provider on this list averaged <span className="text-white font-semibold">{formatNumber(topClaimsPerDay)} claims per working day</span> for
          {" "}{providers[0].activeMonths} consecutive months. That&apos;s roughly one claim every fraction of a second throughout the workday.
          Even if we assume 24/7 operations, the sheer volume raises questions about what&apos;s actually being billed.
        </p>

        <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Scale Matters</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            These {providers.length} providers collectively account for <span className="text-white font-semibold">{formatMoney(totalSpending)}</span> in
            Medicaid payments and <span className="text-white font-semibold">{formatNumber(totalClaims)}</span> claims.
            {over100.length > 0 && <> Of these, <span className="text-red-400 font-semibold">{over100.length} providers</span> average more than 100 claims per working day.</>}
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          To put these numbers in context: a solo physician working 8 hours with no breaks and seeing each patient for
          15 minutes could see a maximum of 32 patients. Even a high-volume urgent care center rarely exceeds 60&ndash;80
          visits per day. Many of the providers on this list exceed that by orders of magnitude.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Important Caveat: Organizational NPIs</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Some entries on this list may be organizations or billing entities &mdash; hospitals, lab chains, managed care
            organizations, or state agencies &mdash; that aggregate claims across many individual practitioners under a single NPI.
            This is expected for institutional NPIs and does not necessarily indicate fraud. The flag is most meaningful for
            individual provider NPIs, where a single person is supposedly delivering all the billed services.
          </p>
        </div>
      </div>

      {/* Top 30 Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          Top 30 Highest-Volume Providers
        </h2>
        <div className="table-wrapper">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims/Day</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Claims</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Paid</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Beneficiaries</th>
              </tr>
            </thead>
            <tbody>
              {top30.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-red-400 transition-colors">
                      {lookupName(p.npi)}
                    </Link>
                    <p className="text-[10px] text-slate-600">{p.activeMonths} months active</p>
                  </td>
                  <td data-label="Claims/Day" className="py-2.5 pr-3 text-right text-red-400 font-semibold tabular-nums">{formatNumber(p.claimsPerDay)}</td>
                  <td data-label="Total Claims" className="py-2.5 pr-3 text-right text-white tabular-nums">{formatNumber(p.totalClaims)}</td>
                  <td data-label="Total Paid" className="py-2.5 pr-3 text-right text-slate-400 tabular-nums">{formatMoney(p.totalPaid)}</td>
                  <td data-label="Beneficiaries" className="py-2.5 text-right text-slate-500 tabular-nums">{formatNumber(p.totalBenes)}</td>
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
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span><span className="text-red-400 font-semibold">{providers.length} providers</span> average more than 50 claims per working day across their active months.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span>The top provider averages <span className="text-red-400 font-semibold">{formatNumber(topClaimsPerDay)} claims/day</span> &mdash; roughly one claim every fraction of a second.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span><span className="text-amber-400 font-semibold">{over1000.length} providers</span> exceed 1,000 claims per working day &mdash; volumes only explainable by organizational or aggregated billing.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Institutional NPIs (hospitals, labs, managed care) can legitimately have high volumes. This flag is most meaningful for individual practitioner NPIs.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("200 Medicaid providers file 50+ claims per working day. The top provider averages 60,000+ claims daily. Physically impossible for a single provider.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/impossible-volume")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="impossible-volume" relatedSlugs={["benford-analysis", "round-numbers", "highest-confidence"]} />
      </div>
    </article>
  );
}
