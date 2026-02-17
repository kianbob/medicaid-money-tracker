import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, formatCpc, hcpcsDescription } from "@/lib/format";
import allProcedures from "../../../../public/data/all-procedures.json";
import topProcedures from "../../../../public/data/top-procedures.json";
import codeBenchmarks from "../../../../public/data/code-benchmarks.json";
import fs from "fs";
import path from "path";

interface Props {
  params: { code: string };
}

export async function generateStaticParams() {
  // Only pre-render top 200 procedures to avoid build OOM
  return (topProcedures as any[]).slice(0, 200).map((p: any) => ({ code: p.code }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proc = (allProcedures as any[]).find((p: any) => p.code === params.code);
  const desc = hcpcsDescription(params.code);
  const label = desc ? `${params.code} \u2014 ${desc}` : params.code;
  const benchmark = (codeBenchmarks as Record<string, any>)[params.code];
  const benchmarkText = benchmark?.medianCostPerClaim != null ? ` National median: ${formatCpc(benchmark.medianCostPerClaim)}/claim.` : '';
  return {
    title: `${label} \u2014 Medicaid Procedure Spending`,
    description: `Medicaid spending for HCPCS code ${params.code}${desc ? ` (${desc})` : ''}. ${proc ? `${formatMoney(proc.totalPaid)} in total payments across ${formatNumber(proc.providerCount)} providers.` : ''}${benchmarkText} Analysis of 227M billing records.`,
    openGraph: {
      title: `${label} \u2014 Medicaid Money Tracker`,
      description: `Medicaid spending for procedure ${params.code}.${desc ? ` ${desc}.` : ''} Total payments, claim volumes, and provider statistics.`,
    },
  };
}

export default function ProcedureDetailPage({ params }: Props) {
  const proc = (allProcedures as any[]).find((p: any) => p.code === params.code);
  const topProc = (topProcedures as any[]).find((p: any) => p.code === params.code);
  const benchmark = (codeBenchmarks as Record<string, any>)[params.code];
  const desc = hcpcsDescription(params.code);

  if (!proc) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Procedure Not Found</h1>
        <p className="text-slate-400 mb-4">Procedure code {params.code} is not in our dataset.</p>
        <Link href="/procedures" className="text-blue-400 hover:underline font-medium">&larr; Back to procedures</Link>
      </div>
    );
  }

  const avgPerClaim = proc.totalClaims > 0 ? proc.totalPaid / proc.totalClaims : 0;
  const totalAllProcs = (allProcedures as any[]).reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const pctOfTotal = (proc.totalPaid / totalAllProcs) * 100;

  // Try to load top-50 procedure detail data (has provider breakdowns)
  let detailProviders: any[] = [];
  if (topProc) {
    try {
      const detailPath = path.join(process.cwd(), "public", "data", "procedures", `${params.code}.json`);
      if (fs.existsSync(detailPath)) {
        const detail = JSON.parse(fs.readFileSync(detailPath, "utf-8"));
        detailProviders = detail.topProviders || detail.providers || [];
      }
    } catch {}
  }

  // Try to load code-providers data (7,020 codes with tier/vsMedian)
  let codeProviders: any = null;
  try {
    const cpPath = path.join(process.cwd(), "public", "data", "code-providers", `${params.code}.json`);
    if (fs.existsSync(cpPath)) {
      codeProviders = JSON.parse(fs.readFileSync(cpPath, "utf-8"));
    }
  } catch {}

  // Rank among all procedures
  const rank = (allProcedures as any[]).findIndex((p: any) => p.code === params.code) + 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/procedures" className="hover:text-blue-400 transition-colors">Procedures</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{params.code}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-slate-500 bg-dark-700 px-2 py-0.5 rounded">#{rank} of {formatNumber((allProcedures as any[]).length)}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight font-mono">{params.code}</h1>
        {desc ? (
          <p className="text-lg text-slate-300">{desc}</p>
        ) : (
          <p className="text-slate-400">HCPCS Procedure Code</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Paid</p>
          <p className="text-xl font-bold text-green-400 tabular-nums">{formatMoney(proc.totalPaid)}</p>
          <p className="text-[10px] text-slate-600">{pctOfTotal.toFixed(2)}% of all spending</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Claims</p>
          <p className="text-xl font-bold text-blue-400 tabular-nums">{formatNumber(proc.totalClaims)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Providers</p>
          <p className="text-xl font-bold text-amber-400 tabular-nums">{formatNumber(proc.providerCount)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Avg Cost/Claim</p>
          <p className="text-xl font-bold text-white tabular-nums">{formatMoney(avgPerClaim)}</p>
        </div>
      </div>

      {/* Benchmark Distribution */}
      {benchmark && benchmark.medianCostPerClaim != null && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-white mb-4">National Cost Distribution</h2>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            How much do providers bill per claim for <span className="font-mono text-white">{params.code}</span>?
            Based on {formatNumber(benchmark.providerCount)} providers billing this code nationally.
          </p>

          {/* Key stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Median</p>
              <p className="text-lg font-bold text-white tabular-nums">{formatCpc(benchmark.medianCostPerClaim)}</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Average</p>
              <p className="text-lg font-bold text-slate-300 tabular-nums">{formatCpc(benchmark.avgCostPerClaim)}</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Std Dev</p>
              <p className="text-lg font-bold text-slate-300 tabular-nums">{formatCpc(benchmark.stddevCpc)}</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Max</p>
              <p className="text-lg font-bold text-slate-300 tabular-nums">{formatCpc(benchmark.maxCpc)}</p>
            </div>
          </div>

          {/* Distribution visualization */}
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Percentile Distribution (Cost per Claim)</p>
            <div className="relative">
              {[
                { label: 'p10', value: benchmark.p10, desc: '10th percentile' },
                { label: 'p25', value: benchmark.p25, desc: '25th percentile' },
                { label: 'Median', value: benchmark.medianCostPerClaim, desc: '50th percentile' },
                { label: 'p75', value: benchmark.p75, desc: '75th percentile' },
                { label: 'p90', value: benchmark.p90, desc: '90th percentile' },
                { label: 'p95', value: benchmark.p95, desc: '95th percentile' },
                { label: 'p99', value: benchmark.p99, desc: '99th percentile' },
              ].map((pct) => {
                const maxVal = benchmark.p99 || benchmark.p95 || benchmark.p90 || benchmark.medianCostPerClaim || 1;
                const barWidth = maxVal > 0 && pct.value != null ? Math.min(100, (pct.value / maxVal) * 100) : 0;
                const isMedian = pct.label === 'Median';
                return (
                  <div key={pct.label} className="flex items-center gap-3 py-1">
                    <span className={`text-[10px] w-12 text-right shrink-0 ${isMedian ? 'text-white font-bold' : 'text-slate-500'}`}>{pct.label}</span>
                    <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isMedian ? 'bg-blue-500' : 'bg-blue-500/30'}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className={`text-[10px] tabular-nums w-20 text-right ${isMedian ? 'text-white font-bold' : 'text-slate-400'}`}>{formatCpc(pct.value)}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-1 mt-3">
              <p className="text-[10px] text-slate-500">
                50% of providers bill between <span className="text-white font-semibold">{formatCpc(benchmark.p25)}</span> and{' '}
                <span className="text-white font-semibold">{formatCpc(benchmark.p75)}</span> per claim for this code.
              </p>
              <p className="text-[10px] text-slate-500">
                90% bill between <span className="text-white font-semibold">{formatCpc(benchmark.p10)}</span> and{' '}
                <span className="text-white font-semibold">{formatCpc(benchmark.p90)}</span>.
              </p>
              {benchmark.p99 != null && (
                <p className="text-[10px] text-slate-500">
                  Top 1% bill above <span className="text-red-400 font-semibold">{formatCpc(benchmark.p99)}</span>.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* About */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-3">About This Procedure</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          HCPCS code <span className="font-mono text-white">{params.code}</span>
          {desc && <span> ({desc})</span>} was billed by{" "}
          <span className="text-white font-semibold">{formatNumber(proc.providerCount)}</span> providers across{" "}
          <span className="text-white font-semibold">{formatNumber(proc.totalClaims)}</span> claims, totaling{" "}
          <span className="text-white font-semibold">{formatMoney(proc.totalPaid)}</span> in Medicaid payments from 2018&ndash;2024.
          {proc.totalBenes > 0 && <> This code was used for <span className="text-white font-semibold">{formatNumber(proc.totalBenes)}</span> unique beneficiaries.</>}
        </p>
      </div>

      {/* Context for well-known codes */}
      {(() => {
        const contextMap: Record<string, string> = {
          'T1019': 'Personal care services (T1019) is the <strong>#1 spending code</strong> in all of Medicaid. Services are provided in private homes, making them difficult to verify. The HHS OIG identifies personal care as the highest fraud-risk Medicaid category.',
          'T2016': 'Residential habilitation (T2016) is a per-diem code for waiver-based residential care. Typical rates range from $200\u2013400/day. Our analysis found Massachusetts DDS agencies billing <strong>$13,000\u201315,000/day</strong> \u2014 37\u201351x the median rate. Per diem codes cover an entire day of care, so high values may reflect bundled services.',
          'A0427': 'ALS emergency ambulance transport (A0427) has a national median of about <strong>$163/trip</strong>. We found Chicago billing <strong>$1,611/trip</strong> \u2014 nearly 10x the national average.',
          '99213': 'Office visit for an established patient with low complexity (99213) is one of the most commonly billed codes in all of healthcare. It represents a standard follow-up visit and is used millions of times annually across Medicaid. Due to its volume, even small per-claim anomalies can represent significant spending.',
          '99214': 'Office visit for an established patient with moderate complexity (99214) is the higher-level counterpart to 99213. Upcoding from 99213 to 99214 is a well-documented fraud pattern \u2014 providers bill for a more complex visit than what actually occurred to receive higher reimbursement.',
          'H2015': 'Comprehensive community support services (H2015) covers intensive community-based behavioral health services. This code has seen significant growth alongside the expansion of community-based mental health programs and is closely monitored for billing anomalies.',
          'H2016': 'Comprehensive community support per diem (H2016) covers a full day of community-based behavioral health services. Per diem billing for community support has been flagged by investigators as an area with limited verification mechanisms.',
        };
        const context = contextMap[params.code];
        return context ? (
          <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5 mb-8">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Investigation Context</h3>
            <p className="text-sm text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: context }} />
          </div>
        ) : null;
      })()}

      {/* Top Providers Billing This Code (code-providers data with tiers) */}
      {codeProviders && codeProviders.topProviders?.length > 0 ? (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Top Providers Billing This Code</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Ranked by total Medicaid payments for {params.code}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500/50">
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold w-8">#</th>
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Provider</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total Paid</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:table-cell">Cost/Claim</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden md:table-cell">vs Median</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden lg:table-cell">Tier</th>
                </tr>
              </thead>
              <tbody>
                {codeProviders.topProviders.slice(0, 20).map((p: any, i: number) => {
                  const tierConfig: Record<string, { label: string; color: string; bg: string }> = {
                    p99: { label: 'Top 1%', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
                    p90: { label: 'Top 10%', color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' },
                    p75: { label: 'Above 75th', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                    above_median: { label: 'Above Median', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
                    below_median: { label: 'Below Median', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                  };
                  const tier = tierConfig[p.tier] || tierConfig.above_median;
                  const vsColor = p.vsMedian >= 3 ? 'text-red-400' : p.vsMedian >= 1.5 ? 'text-yellow-400' : p.vsMedian >= 1 ? 'text-slate-300' : 'text-green-400';
                  return (
                    <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-slate-600 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/providers/${p.npi}`} className="text-white hover:text-blue-400 text-xs font-medium transition-colors">
                          {p.name || `NPI: ${p.npi}`}
                        </Link>
                        {(p.city || p.state) && (
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {p.city ? `${p.city}, ` : ''}
                            {p.state ? <Link href={`/states/${p.state}`} className="hover:text-blue-400 transition-colors">{p.state}</Link> : ''}
                            {p.specialty ? ` \u00b7 ${p.specialty}` : ''}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-white text-xs tabular-nums">{formatMoney(p.totalPaid)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-slate-300 hidden sm:table-cell">{formatCpc(p.costPerClaim)}</td>
                      <td className="px-4 py-2.5 text-right hidden md:table-cell">
                        {p.vsMedian != null && (
                          <span className={`text-xs font-semibold tabular-nums ${vsColor}`}>{p.vsMedian.toFixed(1)}&times; median</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right hidden lg:table-cell">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${tier.bg} ${tier.color}`}>{tier.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-dark-500/50">
            <p className="text-[10px] text-slate-500">
              Showing top {Math.min(20, codeProviders.topProviders.length)} of{' '}
              <span className="text-white font-semibold">{formatNumber(codeProviders.providerCount)}</span> providers billing this code
            </p>
          </div>
        </div>
      ) : detailProviders.length > 0 ? (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Top Providers Using This Code</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500/50">
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Provider</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total Paid</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                </tr>
              </thead>
              <tbody>
                {detailProviders.slice(0, 10).map((p: any) => (
                  <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-2.5">
                      <Link href={`/providers/${p.npi}`} className="text-white hover:text-blue-400 text-xs font-medium transition-colors">
                        {p.name || `NPI: ${p.npi}`}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-white text-xs tabular-nums">{formatMoney(p.paid || p.totalPaid || 0)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400 text-xs hidden sm:table-cell tabular-nums">{formatNumber(p.claims || p.totalClaims || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : benchmark?.providerCount ? (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-white mb-2">Provider Coverage</h2>
          <p className="text-sm text-slate-400">
            We have <span className="text-white font-semibold">{formatNumber(benchmark.providerCount)}</span> providers
            billing this code in our dataset. Individual provider breakdowns are available for top-spending procedure codes.
          </p>
        </div>
      ) : null}

      {/* Related Procedures */}
      {(() => {
        const codePrefix = params.code.replace(/[0-9]/g, '');
        const codeNum = parseInt(params.code.replace(/[^0-9]/g, ''), 10);
        const related = (allProcedures as any[])
          .filter((p: any) => {
            if (p.code === params.code) return false;
            const pPrefix = p.code.replace(/[0-9]/g, '');
            const pNum = parseInt(p.code.replace(/[^0-9]/g, ''), 10);
            return pPrefix === codePrefix && Math.abs(pNum - codeNum) <= 10;
          })
          .slice(0, 5);
        return related.length > 0 ? (
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-white mb-3">Related Procedures</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((p: any) => (
                <Link key={p.code} href={`/procedures/${p.code}`}
                  className="inline-flex items-center gap-2 bg-dark-700/50 border border-dark-500/30 rounded-lg px-3 py-2 hover:border-dark-400 transition-colors group">
                  <span className="font-mono text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">{p.code}</span>
                  {hcpcsDescription(p.code) && <span className="text-[10px] text-slate-500">{hcpcsDescription(p.code)}</span>}
                  <span className="text-[10px] text-slate-600 tabular-nums">{formatMoney(p.totalPaid)}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      <div className="flex flex-wrap gap-4">
        <Link href="/procedures" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          &larr; All procedures
        </Link>
        <Link href="/providers" className="text-slate-400 hover:text-slate-300 text-xs font-medium transition-colors">
          Top providers &rarr;
        </Link>
      </div>
    </div>
  );
}
