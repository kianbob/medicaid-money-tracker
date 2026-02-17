import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, hcpcsDescription } from "@/lib/format";
import allProcedures from "../../../../public/data/all-procedures.json";
import topProcedures from "../../../../public/data/top-procedures.json";
import fs from "fs";
import path from "path";

interface Props {
  params: { code: string };
}

export async function generateStaticParams() {
  return (allProcedures as any[]).map((p: any) => ({ code: p.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proc = (allProcedures as any[]).find((p: any) => p.code === params.code);
  const desc = hcpcsDescription(params.code);
  const label = desc ? `${params.code} \u2014 ${desc}` : params.code;
  return {
    title: `${label} \u2014 Medicaid Procedure Spending`,
    description: `Medicaid spending for HCPCS code ${params.code}${desc ? ` (${desc})` : ''}. ${proc ? `${formatMoney(proc.totalPaid)} in total payments across ${formatNumber(proc.providerCount)} providers.` : ''} Analysis of 227M billing records.`,
    openGraph: {
      title: `${label} \u2014 Medicaid Money Tracker`,
      description: `Medicaid spending for procedure ${params.code}.${desc ? ` ${desc}.` : ''} Total payments, claim volumes, and provider statistics.`,
    },
  };
}

export default function ProcedureDetailPage({ params }: Props) {
  const proc = (allProcedures as any[]).find((p: any) => p.code === params.code);
  const topProc = (topProcedures as any[]).find((p: any) => p.code === params.code);
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
      {(params.code === 'T1019' || params.code === 'T2016' || params.code === 'A0427') && (
        <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5 mb-8">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Investigation Context</h3>
          {params.code === 'T1019' && (
            <p className="text-sm text-slate-300 leading-relaxed">
              Personal care services (T1019) is the <strong className="text-white">#1 spending code</strong> in all of Medicaid.
              Services are provided in private homes, making them difficult to verify.
              The HHS OIG identifies personal care as the highest fraud-risk Medicaid category.
            </p>
          )}
          {params.code === 'T2016' && (
            <p className="text-sm text-slate-300 leading-relaxed">
              Residential habilitation (T2016) is a per-diem code for waiver-based residential care.
              Typical rates range from $200&ndash;400/day. Our analysis found Massachusetts DDS agencies
              billing <strong className="text-white">$13,000&ndash;15,000/day</strong> &mdash; 37&ndash;51x the median rate.
            </p>
          )}
          {params.code === 'A0427' && (
            <p className="text-sm text-slate-300 leading-relaxed">
              ALS emergency ambulance transport (A0427) has a national median of about{' '}
              <strong className="text-white">$163/trip</strong>. We found Chicago billing{' '}
              <strong className="text-white">$1,611/trip</strong> &mdash; nearly 10x the national average.
            </p>
          )}
        </div>
      )}

      {/* Top Providers for this code (if available) */}
      {detailProviders.length > 0 && (
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
      )}

      <Link href="/procedures" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
        &larr; All procedures
      </Link>
    </div>
  );
}
