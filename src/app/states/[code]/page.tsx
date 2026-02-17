import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, stateName, hcpcsDescription } from "@/lib/format";
import statesSummary from "../../../../public/data/states-summary.json";
import fs from "fs";
import path from "path";

interface Props {
  params: { code: string };
}

export async function generateStaticParams() {
  return (statesSummary as any[])
    .filter((s: any) => s.state !== 'Unknown')
    .map((s: any) => ({ code: s.state }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = stateName(params.code);
  const summary = (statesSummary as any[]).find((s: any) => s.state === params.code);
  return {
    title: `${name} Medicaid Spending \u2014 Provider Analysis`,
    description: `${name} Medicaid provider spending analysis. ${summary ? `${formatMoney(summary.total_payments)} across ${summary.provider_count} top providers.` : ''} Top providers, procedures, and yearly trends.`,
    openGraph: {
      title: `${name} Medicaid Spending \u2014 Medicaid Money Tracker`,
      description: `Explore ${name}'s top Medicaid providers and procedures. ${summary ? formatMoney(summary.total_payments) + ' in total spending.' : ''}`,
    },
  };
}

export default function StateDetailPage({ params }: Props) {
  const { code } = params;
  const name = stateName(code);

  // Load state detail data
  let stateData: any = null;
  try {
    const statePath = path.join(process.cwd(), "public", "data", "states", `${code}.json`);
    if (fs.existsSync(statePath)) {
      stateData = JSON.parse(fs.readFileSync(statePath, "utf-8"));
    }
  } catch {}

  const summaryEntry = (statesSummary as any[]).find((s: any) => s.state === code);

  if (!stateData && !summaryEntry) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">State Not Found</h1>
        <p className="text-slate-400 mb-4">No data available for state code &ldquo;{code}&rdquo;.</p>
        <Link href="/states" className="text-blue-400 hover:underline font-medium">&larr; Back to states</Link>
      </div>
    );
  }

  const summary = stateData?.summary || summaryEntry || {};
  const providers = stateData?.top_providers || [];
  const procedures = stateData?.top_procedures || [];
  const trends = stateData?.yearly_trends || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/states" className="hover:text-blue-400 transition-colors">States</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-black text-blue-400">{code}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">{name} Medicaid Spending</h1>
        <p className="text-sm text-slate-400 mt-2">
          Top provider spending in {name} from 2018&ndash;2024
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Spending</p>
          <p className="text-xl font-bold text-green-400 tabular-nums">{formatMoney(summary.total_payments || 0)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Claims</p>
          <p className="text-xl font-bold text-blue-400 tabular-nums">{formatNumber(summary.total_claims || 0)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Top Providers</p>
          <p className="text-xl font-bold text-amber-400 tabular-nums">{summary.provider_count || providers.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Beneficiaries</p>
          <p className="text-xl font-bold text-white tabular-nums">{formatNumber(summary.total_benes || 0)}</p>
        </div>
      </div>

      {/* Yearly Trend */}
      {trends.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
          <h2 className="text-sm font-bold text-white mb-4">Yearly Spending Trend</h2>
          <div className="flex items-end gap-4 h-28">
            {trends.map((y: any) => {
              const maxP = Math.max(...trends.map((t: any) => t.payments || t.total_payments || 0));
              const val = y.payments || y.total_payments || 0;
              const pct = maxP > 0 ? (val / maxP) * 100 : 0;
              return (
                <div key={y.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <p className="text-[10px] text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">{formatMoney(val)}</p>
                  <div className="w-full bg-blue-500/40 hover:bg-blue-400/60 rounded-t transition-colors" style={{ height: `${Math.max(4, pct)}%` }} />
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">{y.year}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Providers */}
      {providers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-bold text-white mb-4">Top Providers in {name}</h2>
          <div className="space-y-1.5">
            {providers.slice(0, 20).map((p: any, i: number) => (
              <Link key={p.npi} href={`/providers/${p.npi}`}
                className="flex items-center gap-3 bg-dark-800 border border-dark-500/50 rounded-lg px-4 py-3 hover:bg-dark-700 hover:border-dark-400 transition-all group">
                <span className="text-xs font-bold text-slate-600 w-6 text-right tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate group-hover:text-blue-400 transition-colors">{p.name || `NPI: ${p.npi}`}</p>
                  <p className="text-[10px] text-slate-500">{p.specialty ? p.specialty.substring(0, 50) : ''} {p.city ? `\u00b7 ${p.city}` : ''}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-white font-bold tabular-nums">{formatMoney(p.total_payments || p.totalPaid || 0)}</p>
                  <p className="text-[10px] text-slate-600 tabular-nums">{formatNumber(p.total_claims || p.totalClaims || 0)} claims</p>
                </div>
              </Link>
            ))}
          </div>
          {providers.length > 20 && (
            <p className="text-xs text-slate-500 mt-3 text-center">Showing top 20 of {providers.length} providers</p>
          )}
        </div>
      )}

      {/* Top Procedures */}
      {procedures.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-10">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Top Procedures in {name}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500/50">
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Code</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total Paid</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                </tr>
              </thead>
              <tbody>
                {procedures.slice(0, 15).map((p: any) => (
                  <tr key={p.code} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-2.5">
                      <Link href={`/procedures/${p.code}`} className="text-white hover:text-blue-400 text-xs font-medium transition-colors">
                        <span className="font-mono">{p.code}</span>
                      </Link>
                      {hcpcsDescription(p.code) && <p className="text-[10px] text-slate-500 mt-0.5">{hcpcsDescription(p.code)}</p>}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-white text-xs tabular-nums">{formatMoney(p.payments || p.total_payments || p.totalPaid || 0)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400 text-xs hidden sm:table-cell tabular-nums">{formatNumber(p.claims || p.total_claims || p.totalClaims || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/states" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          &larr; All states
        </Link>
        <Link href="/providers" className="text-slate-400 hover:text-slate-300 text-xs font-medium transition-colors">
          All providers &rarr;
        </Link>
      </div>
    </div>
  );
}
