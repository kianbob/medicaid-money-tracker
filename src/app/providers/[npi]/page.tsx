import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, formatMoneyFull, riskLabel, riskColor, riskDot, riskBgColor, flagLabel, flagColor, getFlagInfo, parseFlags, hcpcsDescription, stateName } from "@/lib/format";
import topProviders from "../../../../public/data/top-providers-1000.json";
import watchlistData from "../../../../public/data/expanded-watchlist.json";
import fs from "fs";
import path from "path";

interface Props {
  params: { npi: string };
}

export async function generateStaticParams() {
  // Generate pages for all providers that have detail JSON files
  const providersDir = path.join(process.cwd(), "public", "data", "providers");
  try {
    const files = fs.readdirSync(providersDir);
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => ({ npi: f.replace('.json', '') }));
  } catch {
    return (topProviders as any[]).map((p: any) => ({ npi: p.npi }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const provider = (topProviders as any[]).find((p: any) => p.npi === params.npi);
  const name = provider?.name || `Provider ${params.npi}`;
  const watchEntry = (watchlistData as any[]).find((w: any) => w.npi === params.npi);
  const flagged = watchEntry ? ` Flagged for ${watchEntry.flag_count} billing anomalies across 9 fraud tests.` : '';
  return {
    title: `${name} \u2014 Medicaid Spending Profile`,
    description: `Medicaid spending profile for ${name} (NPI: ${params.npi}). View total payments, claims, procedures, monthly trends, and fraud risk assessment.${flagged}`,
    openGraph: {
      title: `${name} \u2014 Medicaid Money Tracker`,
      description: `Medicaid spending for ${name}. Total payments, procedure breakdown, and billing analysis.${flagged}`,
    },
  };
}

export default function ProviderPage({ params }: Props) {
  const { npi } = params;

  // Load detail data
  let detail: any = null;
  try {
    const detailPath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    if (fs.existsSync(detailPath)) {
      detail = JSON.parse(fs.readFileSync(detailPath, "utf-8"));
    }
  } catch {}

  // Watchlist entry
  const watchEntry = (watchlistData as any[]).find((w: any) => w.npi === npi);
  const providerEntry = (topProviders as any[]).find((p: any) => p.npi === npi);

  const name = detail?.name || providerEntry?.name || `Provider ${npi}`;
  const specialty = detail?.specialty || providerEntry?.specialty || "";
  const city = detail?.city || providerEntry?.city || "";
  const state = detail?.state || providerEntry?.state || "";
  const totalPaid = detail?.totalPaid || providerEntry?.totalPaid || 0;
  const totalClaims = detail?.totalClaims || providerEntry?.totalClaims || 0;
  const totalBenes = detail?.totalBenes || providerEntry?.totalBenes || 0;
  const avgPerClaim = totalClaims > 0 ? totalPaid / totalClaims : 0;
  const claimsPerBene = totalBenes > 0 ? totalClaims / totalBenes : 0;
  const growthRate = detail?.growthRate || 0;
  const monthly = detail?.monthly || [];
  const topProcedures = detail?.topProcedures || [];

  // Parse flags
  const allFlags = watchEntry
    ? watchEntry.flags || []
    : parseFlags(detail?.flags || providerEntry?.flags);
  const flagCount = watchEntry?.flag_count || allFlags.length;
  const flagDetails = watchEntry?.flag_details || {};

  if (!detail && !providerEntry) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Provider Not Found</h1>
        <p className="text-slate-400 mb-4">No data available for NPI {npi}.</p>
        <Link href="/providers" className="text-blue-400 hover:underline font-medium">&larr; Back to providers</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/providers" className="hover:text-blue-400 transition-colors">Providers</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-2">
          {flagCount > 0 && (
            <div className={`w-3 h-3 rounded-full mt-2.5 shrink-0 ${riskDot(flagCount)} ${flagCount >= 3 ? 'risk-dot-critical' : ''}`} />
          )}
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">{name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
          {specialty && <span>{specialty}</span>}
          {specialty && (city || state) && <span className="text-slate-600">&middot;</span>}
          {city && <span>{city}, {state}</span>}
          {!city && state && <Link href={`/states/${state}`} className="hover:text-blue-400 transition-colors">{stateName(state)}</Link>}
          {(specialty || city) && <span className="text-slate-600">&middot;</span>}
          <span className="font-mono text-xs text-slate-500">NPI: {npi}</span>
        </div>
      </div>

      {/* Fraud Alert */}
      {flagCount > 0 && (
        <div className={`border rounded-xl p-5 mb-8 ${riskBgColor(flagCount)}`} role="alert">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${riskColor(flagCount)}`}>
              {riskLabel(flagCount)} Risk
            </span>
            <span className="text-xs text-slate-500">&mdash; Flagged in {flagCount} of 9 fraud detection tests</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {allFlags.map((flag: string) => {
              const info = getFlagInfo(flag);
              const details = flagDetails[flag];
              return (
                <div key={flag} className={`rounded-lg border p-3 ${info.bgColor}`}>
                  <p className={`text-xs font-bold ${info.color}`}>{info.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{info.description}</p>
                  {details && (
                    <div className="mt-2 text-[10px] text-slate-500 space-y-0.5">
                      {details.growth_pct && <p>Growth: <span className="text-white font-semibold">{details.growth_pct.toFixed(0)}%</span> ({details.from_year}&rarr;{details.to_year})</p>}
                      {details.first_year_payments && <p>First year: <span className="text-white font-semibold">{formatMoney(details.first_year_payments)}</span> ({details.first_year})</p>}
                      {details.unique_codes && <p>Unique codes: <span className="text-white font-semibold">{details.unique_codes}</span>, primary: <span className="font-mono">{details.primary_code}</span></p>}
                      {details.cv !== undefined && <p>Coefficient of variation: <span className="text-white font-semibold">{details.cv.toFixed(4)}</span></p>}
                      {details.claims_per_bene && <p>Claims/patient: <span className="text-white font-semibold">{details.claims_per_bene.toFixed(1)}</span></p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500 mt-3">
            Statistical flags are not proof of wrongdoing. <Link href="/about" className="text-blue-400 hover:underline">Read our methodology</Link>.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Paid</p>
          <p className="text-xl font-bold text-green-400 tabular-nums">{formatMoney(totalPaid)}</p>
          <p className="text-[10px] text-slate-600 font-mono tabular-nums">{formatMoneyFull(totalPaid)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Claims</p>
          <p className="text-xl font-bold text-blue-400 tabular-nums">{formatNumber(totalClaims)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Beneficiaries</p>
          <p className="text-xl font-bold text-amber-400 tabular-nums">{formatNumber(totalBenes)}</p>
          {claimsPerBene > 0 && <p className="text-[10px] text-slate-600">{claimsPerBene.toFixed(1)} claims/patient</p>}
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Avg Cost/Claim</p>
          <p className="text-xl font-bold text-white tabular-nums">{formatMoney(avgPerClaim)}</p>
          {growthRate !== 0 && <p className={`text-[10px] ${growthRate > 100 ? 'text-red-400' : 'text-slate-600'}`}>{growthRate > 0 ? '+' : ''}{growthRate.toFixed(0)}% growth</p>}
        </div>
      </div>

      {/* Monthly Trend */}
      {monthly.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
          <h2 className="text-sm font-bold text-white mb-4">Monthly Spending Trend</h2>
          <div className="flex items-end gap-[2px] h-24">
            {monthly.slice(-36).map((m: any) => {
              const maxPaid = Math.max(...monthly.slice(-36).map((x: any) => x.payments || x.paid || 0));
              const val = m.payments || m.paid || 0;
              const pct = maxPaid > 0 ? (val / maxPaid) * 100 : 0;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full group" title={`${m.month}: ${formatMoney(val)}`}>
                  <div
                    className="w-full bg-blue-500/40 hover:bg-blue-400/70 rounded-sm transition-colors"
                    style={{ height: `${Math.max(2, pct)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-[10px] text-slate-500">{monthly[Math.max(0, monthly.length - 36)]?.month}</p>
            <p className="text-[10px] text-slate-500">{monthly[monthly.length - 1]?.month}</p>
          </div>
        </div>
      )}

      {/* Top Procedures */}
      {topProcedures.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-10">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Top Procedures</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500/50">
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Code</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total Paid</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden md:table-cell">Avg/Claim</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden md:table-cell">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {topProcedures.map((proc: any) => {
                  const pctOfTotal = totalPaid > 0 ? (proc.paid / totalPaid) * 100 : 0;
                  return (
                    <tr key={proc.code} className="border-b border-dark-600/50 hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-2.5">
                        <Link href={`/procedures/${proc.code}`} className="text-white hover:text-blue-400 transition-colors">
                          <span className="font-mono text-xs font-medium">{proc.code}</span>
                        </Link>
                        {hcpcsDescription(proc.code) && (
                          <p className="text-[10px] text-slate-500 mt-0.5">{hcpcsDescription(proc.code)}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-white font-semibold text-xs tabular-nums">{formatMoney(proc.paid)}</td>
                      <td className="px-4 py-2.5 text-right text-slate-400 text-xs hidden sm:table-cell tabular-nums">{formatNumber(proc.claims)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-400 text-xs hidden md:table-cell tabular-nums">
                        {proc.claims > 0 ? formatMoney(proc.paid / proc.claims) : '\u2014'}
                      </td>
                      <td className="px-4 py-2.5 text-right hidden md:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 bg-dark-500 rounded-full h-1">
                            <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${Math.min(100, pctOfTotal)}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-500 w-10 text-right tabular-nums">{pctOfTotal.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/providers" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          &larr; All providers
        </Link>
        {flagCount > 0 && (
          <Link href="/watchlist" className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">
            Fraud watchlist &rarr;
          </Link>
        )}
        {state && (
          <Link href={`/states/${state}`} className="text-slate-400 hover:text-slate-300 text-xs font-medium transition-colors">
            {stateName(state)} providers &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
