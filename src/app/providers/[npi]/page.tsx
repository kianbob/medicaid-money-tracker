import Link from "next/link";
import { formatMoney, formatNumber, formatMoneyFull, riskLabel, riskColor, flagLabel, flagColor } from "@/lib/format";
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

export async function generateMetadata({ params }: Props) {
  const provider = [...topProviders, ...watchlist].find((p: any) => p.npi === params.npi);
  const name = (provider as any)?.name || `Provider ${params.npi}`;
  return {
    title: `${name} — Medicaid Money Tracker`,
    description: `Medicaid spending profile for ${name} (NPI: ${params.npi}). View total payments, claims, procedures, and fraud risk assessment.`,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/providers" className="hover:text-blue-400">Providers</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
        <p className="text-slate-400">
          {specialty && <span>{specialty} · </span>}
          {city && <span>{city}, {state} · </span>}
          <span className="font-mono">NPI: {npi}</span>
        </p>
      </div>

      {/* Fraud Alert */}
      {watchlistEntry && (
        <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚩</span>
            <div>
              <h2 className="text-lg font-bold text-red-400 mb-2">
                Fraud Risk: {riskLabel(watchlistEntry.flagCount)}
              </h2>
              <p className="text-slate-300 text-sm mb-3">
                This provider was flagged in {watchlistEntry.flagCount} of our 4 fraud detection analyses. 
                Providers flagged in multiple analyses are the highest priority for investigation.
              </p>
              <div className="flex flex-wrap gap-2">
                {watchlistEntry.flags?.map((f: string) => (
                  <span key={f} className={`text-sm px-3 py-1 rounded border ${flagColor(f)}`}>
                    {flagLabel(f)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">{formatMoney(totalPaid)}</p>
          <p className="text-xs text-slate-500 mt-1">{formatMoneyFull(totalPaid)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Total Claims</p>
          <p className="text-2xl font-bold text-blue-400">{formatNumber(totalClaims)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Beneficiaries</p>
          <p className="text-2xl font-bold text-amber-400">{formatNumber(totalBenes)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Avg Cost/Claim</p>
          <p className="text-2xl font-bold text-white">{formatMoney(avgPerClaim)}</p>
        </div>
      </div>

      {/* Monthly Trend (text-based for now) */}
      {monthly.length > 0 && (
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-white mb-4">📈 Monthly Spending Trend</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1">
            {monthly.slice(-24).map((m: any) => {
              const maxPaid = Math.max(...monthly.map((x: any) => x.paid));
              const height = Math.max(4, (m.paid / maxPaid) * 60);
              return (
                <div key={m.month} className="flex flex-col items-center">
                  <div className="w-full bg-blue-500/30 rounded-t" style={{ height: `${height}px` }}>
                    <div className="w-full h-full bg-blue-500 rounded-t opacity-60" />
                  </div>
                  <span className="text-[8px] text-slate-600 mt-1">{m.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-3">Last 24 months · Bar height = relative monthly spending</p>
        </div>
      )}

      {/* Top Procedures */}
      {detail?.topProcedures && detail.topProcedures.length > 0 && (
        <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-500">
            <h2 className="text-lg font-bold text-white">💊 Top Procedures</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Code</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Total Paid</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Claims</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Beneficiaries</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Avg/Claim</th>
                </tr>
              </thead>
              <tbody>
                {detail.topProcedures.map((proc: any) => (
                  <tr key={proc.code} className="border-b border-dark-600 hover:bg-dark-600/50">
                    <td className="px-4 py-3">
                      <Link href={`/procedures/${proc.code}`} className="font-mono text-white hover:text-blue-400">
                        {proc.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white">{formatMoney(proc.paid)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{formatNumber(proc.claims)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{formatNumber(proc.benes)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">
                      {proc.claims > 0 ? formatMoney(proc.paid / proc.claims) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
