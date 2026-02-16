import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, formatMoneyFull, riskLabel, riskColor, flagLabel, flagColor, hcpcsDescription, hcpcsLabel } from "@/lib/format";
import watchlist from "../../../../public/data/watchlist.json";
import topProviders from "../../../../public/data/top-providers.json";
import fs from "fs";
import path from "path";

interface Props {
  params: { npi: string };
}

export async function generateStaticParams() {
  const npis = new Set<string>();
  topProviders.forEach((p: any) => npis.add(p.npi));
  watchlist.forEach((p: any) => npis.add(p.npi));
  return Array.from(npis).map((npi) => ({ npi }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const provider = [...topProviders, ...watchlist].find((p: any) => p.npi === params.npi);
  const name = (provider as any)?.name || `Provider ${params.npi}`;
  const watchlistEntry = watchlist.find((p: any) => p.npi === params.npi) as any;
  const flagged = watchlistEntry ? ` Flagged for ${watchlistEntry.flagCount} billing anomalies.` : '';
  return {
    title: name,
    description: `Medicaid spending profile for ${name} (NPI: ${params.npi}). View total payments, claims, procedures, and fraud risk assessment.${flagged}`,
    openGraph: {
      title: `${name} — Medicaid Money Tracker`,
      description: `Medicaid spending profile for ${name}. Total payments, procedure breakdown, and billing analysis.${flagged}`,
    },
  };
}

export default function ProviderPage({ params }: Props) {
  const { npi } = params;

  // Find provider in our data
  const watchlistEntry = watchlist.find((p: any) => p.npi === npi) as any;
  const providerEntry = topProviders.find((p: any) => p.npi === npi) as any;
  const provider = watchlistEntry || providerEntry;

  // Load detail data
  let detail: any = null;
  try {
    const detailPath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    if (fs.existsSync(detailPath)) {
      detail = JSON.parse(fs.readFileSync(detailPath, "utf-8"));
    }
  } catch {}

  // Load monthly data
  let monthly: any[] = [];
  try {
    const monthlyPath = path.join(process.cwd(), "public", "data", "provider-monthly", `${npi}.json`);
    if (fs.existsSync(monthlyPath)) {
      monthly = JSON.parse(fs.readFileSync(monthlyPath, "utf-8"));
    }
  } catch {}

  const name = detail?.name || provider?.name || `Provider ${npi}`;
  const specialty = detail?.specialty || provider?.specialty || "";
  const city = detail?.city || provider?.city || "";
  const state = detail?.state || provider?.state || "";
  const totalPaid = provider?.totalPaid || 0;
  const totalClaims = provider?.totalClaims || 0;
  const totalBenes = provider?.totalBenes || 0;
  const avgPerClaim = totalClaims > 0 ? totalPaid / totalClaims : 0;
  const claimsPerBene = totalBenes > 0 ? totalClaims / totalBenes : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/providers" className="hover:text-blue-400 transition-colors">Providers</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">{name}</h1>
        <p className="text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
          {specialty && <span>{specialty}</span>}
          {specialty && (city || state) && <span className="text-slate-600">&middot;</span>}
          {city && <span>{city}, {state}</span>}
          {(specialty || city) && <span className="text-slate-600">&middot;</span>}
          <span className="font-mono text-sm">NPI: {npi}</span>
        </p>
      </div>

      {/* Fraud Alert */}
      {watchlistEntry && (
        <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-8" role="alert">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0" aria-hidden="true">&#9888;</span>
            <div>
              <h2 className="text-lg font-bold text-red-400 mb-2">
                Fraud Risk: {riskLabel(watchlistEntry.flagCount)}
              </h2>
              <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                This provider was flagged in {watchlistEntry.flagCount} of our 4 fraud detection analyses.
                {watchlistEntry.flagCount >= 2 && ' Providers flagged in multiple analyses are the highest priority for investigation.'}
                {' '}Statistical flags are not proof of wrongdoing &mdash;{' '}
                <Link href="/about" className="text-blue-400 hover:underline">read our methodology</Link>.
              </p>
              <div className="flex flex-wrap gap-2">
                {watchlistEntry.flags?.map((f: string) => (
                  <span key={f} className={`text-sm px-3 py-1 rounded border font-medium ${flagColor(f)}`}>
                    {flagLabel(f)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10" aria-label="Provider statistics">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">{formatMoney(totalPaid)}</p>
          <p className="text-xs text-slate-600 mt-1 font-mono">{formatMoneyFull(totalPaid)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Total Claims</p>
          <p className="text-2xl font-bold text-blue-400">{formatNumber(totalClaims)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Beneficiaries</p>
          <p className="text-2xl font-bold text-amber-400">{formatNumber(totalBenes)}</p>
          {claimsPerBene > 0 && (
            <p className="text-xs text-slate-600 mt-1">{claimsPerBene.toFixed(1)} claims/patient</p>
          )}
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Avg Cost/Claim</p>
          <p className="text-2xl font-bold text-white">{formatMoney(avgPerClaim)}</p>
        </div>
      </div>

      {/* Monthly Trend */}
      {monthly.length > 0 && (
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Monthly Spending Trend</h2>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-1 items-end" style={{ height: '80px' }}>
            {monthly.slice(-24).map((m: any) => {
              const maxPaid = Math.max(...monthly.slice(-24).map((x: any) => x.paid));
              const pct = maxPaid > 0 ? (m.paid / maxPaid) * 100 : 0;
              const height = Math.max(4, pct);
              return (
                <div key={m.month} className="flex flex-col items-center justify-end h-full group" title={`${m.month}: ${formatMoney(m.paid)}`}>
                  <div
                    className="w-full bg-blue-500/60 rounded-t hover:bg-blue-400/80 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[7px] text-slate-600 mt-1 group-hover:text-slate-400 transition-colors">{m.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-slate-500">Last {Math.min(24, monthly.length)} months &middot; Bar height = relative monthly spending</p>
            <p className="text-xs text-slate-500">Hover bars for amounts</p>
          </div>
        </div>
      )}

      {/* Top Procedures */}
      {detail?.topProcedures && detail.topProcedures.length > 0 && (
        <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-500">
            <h2 className="text-lg font-bold text-white">Top Procedures</h2>
            <p className="text-xs text-slate-500 mt-0.5">Procedure codes this provider billed, ranked by total payments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500">
                  <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Procedure</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Paid</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:table-cell">Beneficiaries</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Avg/Claim</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {detail.topProcedures.map((proc: any) => {
                  const pctOfTotal = totalPaid > 0 ? (proc.paid / totalPaid) * 100 : 0;
                  return (
                    <tr key={proc.code} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/procedures/${proc.code}`} className="text-white hover:text-blue-400 transition-colors">
                          <span className="font-mono font-medium">{proc.code}</span>
                        </Link>
                        {hcpcsDescription(proc.code) && (
                          <p className="text-xs text-slate-500 mt-0.5">{hcpcsDescription(proc.code)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-white font-semibold">{formatMoney(proc.paid)}</td>
                      <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">{formatNumber(proc.claims)}</td>
                      <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">{formatNumber(proc.benes)}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400 hidden md:table-cell">
                        {proc.claims > 0 ? formatMoney(proc.paid / proc.claims) : '\u2014'}
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 bg-dark-500 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, pctOfTotal)}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 w-10 text-right">{pctOfTotal.toFixed(1)}%</span>
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

      {/* Back link */}
      <div className="mt-8 flex gap-4">
        <Link href="/providers" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          &larr; All providers
        </Link>
        {watchlistEntry && (
          <Link href="/watchlist" className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
            &larr; Fraud watchlist
          </Link>
        )}
      </div>
    </div>
  );
}
