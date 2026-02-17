import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, formatMoneyFull, formatCpc, riskLabel, riskColor, riskDot, riskBgColor, getFlagInfo, parseFlags, hcpcsDescription, stateName, decileColor, decileBgColor } from "@/lib/format";
import topProviders from "../../../../public/data/top-providers-1000.json";
import smartWatchlist from "../../../../public/data/smart-watchlist.json";
import oldWatchlist from "../../../../public/data/expanded-watchlist.json";
import stats from "../../../../public/data/stats.json";
import fs from "fs";
import path from "path";

interface Props {
  params: { npi: string };
}

export async function generateStaticParams() {
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
  let detail: any = null;
  try {
    const detailPath = path.join(process.cwd(), "public", "data", "providers", `${params.npi}.json`);
    if (fs.existsSync(detailPath)) {
      detail = JSON.parse(fs.readFileSync(detailPath, "utf-8"));
    }
  } catch {}
  const name = detail?.name || provider?.name || `Provider ${params.npi}`;
  const smartEntry = (smartWatchlist as any[]).find((w: any) => w.npi === params.npi);
  const oldEntry = (oldWatchlist as any[]).find((w: any) => w.npi === params.npi);
  const flagCount = smartEntry?.flagCount || oldEntry?.flag_count || 0;
  const flagged = flagCount > 0 ? ` Flagged for ${flagCount} billing anomalies.` : '';
  return {
    title: `${name} \u2014 Medicaid Spending Profile`,
    description: `Medicaid spending profile for ${name} (NPI: ${params.npi}). View total payments, claims, procedures, monthly trends, and fraud risk assessment.${flagged}`,
    openGraph: {
      title: `${name} \u2014 Medicaid Money Tracker`,
      description: `Medicaid spending for ${name}. Total payments, procedure breakdown, and billing analysis.${flagged}`,
    },
  };
}

function buildFlagExplanation(flag: string, details: any): string {
  if (!details) return '';
  switch (flag) {
    case 'code_specific_outlier': {
      const code = details.code || '';
      const desc = hcpcsDescription(code);
      const codeLabel = desc ? `${code} (${desc})` : code;
      return `This provider bills ${formatCpc(details.providerCpc)} per claim for ${codeLabel}, which is ${details.ratio?.toFixed(1)}\u00d7 the national median of ${formatCpc(details.nationalMedianCpc)}.`;
    }
    case 'billing_swing': {
      return `Billing changed from ${formatMoney(details.fromPay)} (${details.fromYear}) to ${formatMoney(details.toPay)} (${details.toYear}) \u2014 a ${details.pctChange?.toFixed(0)}% swing with ${formatMoney(details.absChange)} absolute change.`;
    }
    case 'massive_new_entrant': {
      return `First appeared in ${details.firstMonth || details.firstYear} and has already billed ${formatMoney(details.totalPaid)}, averaging ${formatMoney(details.avgMonthlyBilling)}/month across ${details.monthsActive} months.`;
    }
    case 'rate_outlier_multi_code': {
      const codes = details.codesAboveP90 || 0;
      const topCodes = details.topOutlierCodes || [];
      const codeExamples = topCodes.slice(0, 2).map((c: any) =>
        `${c.code} at ${c.ratio?.toFixed(1)}\u00d7 median`
      ).join(', ');
      return `Billing above the 90th percentile for ${codes} procedure codes${codeExamples ? `: ${codeExamples}` : ''}.`;
    }
    // Old flag types
    case 'outlier_spending':
      return details.total_paid ? `Total spending of ${formatMoney(details.total_paid)} is significantly above median.` : '';
    case 'unusual_cost_per_claim':
    case 'unusual_cost':
      return details.cost_per_claim ? `Average cost per claim of ${formatCpc(details.cost_per_claim)} is much higher than peers.` : '';
    case 'explosive_growth':
      return details.growth_pct ? `Billing grew ${details.growth_pct.toFixed(0)}% from ${details.from_year} to ${details.to_year}.` : '';
    case 'instant_high_volume':
      return details.first_year_payments ? `Billed ${formatMoney(details.first_year_payments)} in first year (${details.first_year}).` : '';
    case 'procedure_concentration':
      return details.primary_code ? `Bills primarily for code ${details.primary_code} (${details.unique_codes} unique codes).` : '';
    case 'billing_consistency':
      return details.cv !== undefined ? `Monthly billing coefficient of variation: ${details.cv.toFixed(4)} (near-zero variation).` : '';
    case 'beneficiary_stuffing':
    case 'bene_stuffing':
      return details.claims_per_bene ? `${details.claims_per_bene.toFixed(1)} claims per beneficiary.` : '';
    case 'extreme_beneficiary_stuffing':
      return details.claims_per_bene ? `${details.claims_per_bene.toFixed(1)} claims per beneficiary \u2014 far exceeding normal patterns.` : '';
    case 'spending_spike':
      return details.growth_pct ? `Month-over-month increase of ${details.growth_pct.toFixed(0)}%.` : '';
    default:
      return '';
  }
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

  // Watchlist entries - smart watchlist is primary, merge with old
  const smartEntry = (smartWatchlist as any[]).find((w: any) => w.npi === npi);
  const oldEntry = (oldWatchlist as any[]).find((w: any) => w.npi === npi);
  const providerEntry = (topProviders as any[]).find((p: any) => p.npi === npi);

  const name = detail?.name || smartEntry?.name || providerEntry?.name || `Provider ${npi}`;
  const specialty = detail?.specialty || smartEntry?.specialty || providerEntry?.specialty || "";
  const city = detail?.city || smartEntry?.city || providerEntry?.city || "";
  const state = detail?.state || smartEntry?.state || providerEntry?.state || "";
  const totalPaid = detail?.totalPaid || smartEntry?.totalPaid || providerEntry?.totalPaid || 0;
  const totalClaims = detail?.totalClaims || providerEntry?.totalClaims || 0;
  const totalBenes = detail?.totalBenes || providerEntry?.totalBenes || 0;
  const avgPerClaim = totalClaims > 0 ? totalPaid / totalClaims : 0;
  const claimsPerBene = totalBenes > 0 ? totalClaims / totalBenes : 0;
  const growthRate = detail?.growthRate || 0;
  const monthly = detail?.monthly || [];
  const procedures = detail?.procedures || detail?.topProcedures || [];

  // Merge flags from smart watchlist + old watchlist + detail JSON
  const smartFlags = smartEntry?.flags || [];
  const oldFlags = oldEntry ? (oldEntry.flags || []) : [];
  const detailFlags = parseFlags(detail?.flags || providerEntry?.flags);
  const allFlags = Array.from(new Set([...smartFlags, ...oldFlags, ...detailFlags]));
  const flagCount = allFlags.length;

  // Merge flag details
  const flagDetails: Record<string, any> = {};
  if (smartEntry?.flagDetails) {
    for (const [k, v] of Object.entries(smartEntry.flagDetails)) {
      flagDetails[k] = v;
    }
  }
  if (oldEntry?.flag_details) {
    for (const [k, v] of Object.entries(oldEntry.flag_details)) {
      if (!flagDetails[k]) flagDetails[k] = v;
    }
  }

  // Not found — but we show a graceful message for providers outside top 1000
  if (!detail && !providerEntry && !smartEntry) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Limited Data Available</h1>
        <p className="text-slate-400 mb-2">This provider ranks outside our top analyzed providers. Limited data available.</p>
        <p className="text-slate-500 text-sm mb-6">NPI {npi} is not in our top 1,000 by total spending. Browse our top providers or search by state for more coverage.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/providers" className="text-blue-400 hover:underline font-medium">&larr; Browse top 1,000 providers</Link>
          <Link href="/states" className="text-blue-400 hover:underline font-medium">Explore by state &rarr;</Link>
        </div>
      </div>
    );
  }

  // Has some data but no detail file
  const limitedData = !detail && (providerEntry || smartEntry);

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
          {city && state && <span>{city}, <Link href={`/states/${state}`} className="hover:text-blue-400 transition-colors">{state}</Link></span>}
          {!city && state && <Link href={`/states/${state}`} className="hover:text-blue-400 transition-colors">{stateName(state)}</Link>}
          {(specialty || city || state) && <span className="text-slate-600">&middot;</span>}
          <span className="font-mono text-xs text-slate-500">NPI: {npi}</span>
        </div>
      </div>

      {/* Limited Data Banner */}
      {limitedData && (
        <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-400 font-semibold mb-1">Limited Detail Data</p>
          <p className="text-xs text-slate-400">This provider has summary data but no detailed procedure or monthly breakdown available. Statistics shown are from our top-provider rankings.</p>
        </div>
      )}

      {/* Fraud Alert — Rich flag cards */}
      {flagCount > 0 && (
        <div className={`border rounded-xl p-5 mb-8 ${riskBgColor(flagCount)}`} role="alert">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-bold uppercase tracking-wider ${riskColor(flagCount)}`}>
              {riskLabel(flagCount)} Risk
            </span>
            <span className="text-xs text-slate-500">&mdash; Flagged in {flagCount} fraud detection test{flagCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-3">
            {allFlags.map((flag: string) => {
              const info = getFlagInfo(flag);
              const details = flagDetails[flag];
              const explanation = buildFlagExplanation(flag, details);
              return (
                <div key={flag} className={`rounded-lg border p-4 ${info.bgColor}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${info.bgColor}`}>
                      <span className={`text-sm ${info.color}`}>
                        {flag === 'code_specific_outlier' ? '\u26a0' :
                         flag === 'billing_swing' ? '\u21c5' :
                         flag === 'massive_new_entrant' ? '\u2605' :
                         flag === 'rate_outlier_multi_code' ? '\u2261' :
                         '\u25cf'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${info.color}`}>{info.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{info.description}</p>
                      {explanation && (
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-dark-800/40 rounded px-3 py-2">
                          {explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500 mt-3">
            Statistical flags are not proof of wrongdoing. Some entities (government agencies, home care programs) may legitimately bill at high rates. <Link href="/about" className="text-blue-400 hover:underline">Read our methodology</Link>.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
        </div>
      </div>

      {/* Growth Rate + Context */}
      <div className="flex flex-wrap gap-3 mb-10">
        {growthRate !== 0 && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${growthRate > 100 ? 'bg-red-500/8 border-red-500/20' : growthRate > 0 ? 'bg-amber-500/8 border-amber-500/20' : 'bg-green-500/8 border-green-500/20'}`}>
            <span className={`text-sm font-bold ${growthRate > 100 ? 'text-red-400' : growthRate > 0 ? 'text-amber-400' : 'text-green-400'}`}>
              {growthRate > 0 ? '\u2191' : '\u2193'} {Math.abs(growthRate).toFixed(0)}% growth
            </span>
            <span className="text-[10px] text-slate-500">since first billing year</span>
          </div>
        )}
        {totalPaid > 0 && (() => {
          const rank = (topProviders as any[]).findIndex((p: any) => p.npi === npi) + 1;
          const pctAbove = ((1 - (totalPaid > 0 ? rank > 0 ? rank / (stats as any).providers : 0.001 : 1)) * 100);
          return rank > 0 ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-dark-800 border-dark-500/50">
              <span className="text-sm font-semibold text-white">#{rank}</span>
              <span className="text-[10px] text-slate-500">of {formatNumber((stats as any).providers)} providers by spending (top {pctAbove.toFixed(1)}%)</span>
            </div>
          ) : null;
        })()}
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

      {/* Procedure Breakdown with Benchmarks */}
      {procedures.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-10">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Procedure Breakdown</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Cost per claim compared to national benchmarks</p>
          </div>

          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-4 px-4 py-2 border-b border-dark-600/50 text-[10px] uppercase tracking-wider text-slate-500">
            <span>Procedure</span>
            <span className="text-right w-20">Total</span>
            <span className="text-right w-24">Your Cost/Claim</span>
            <span className="text-right w-24">National Median</span>
            <span className="text-right w-16">vs Median</span>
            <span className="text-right w-20">Percentile</span>
          </div>

          <div className="divide-y divide-dark-600/50">
            {procedures.map((proc: any) => {
              const pctOfTotal = totalPaid > 0 ? ((proc.payments || proc.paid || 0) / totalPaid) * 100 : 0;
              const hasBenchmark = proc.nationalMedianCpc != null && proc.nationalMedianCpc > 0;
              const provCpc = proc.providerCpc || (proc.claims > 0 ? (proc.payments || proc.paid || 0) / proc.claims : 0);
              const decile = proc.decile || 'Normal range';
              const ratio = proc.cpcRatio || (hasBenchmark ? provCpc / proc.nationalMedianCpc : 0);

              return (
                <div key={proc.code} className="px-4 py-3 hover:bg-dark-700/50 transition-colors">
                  {/* Desktop: table row */}
                  <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-4 items-center">
                    {/* Procedure info */}
                    <div className="min-w-0">
                      <Link href={`/procedures/${proc.code}`} className="text-white hover:text-blue-400 transition-colors">
                        <span className="font-mono text-xs font-medium">{proc.code}</span>
                      </Link>
                      {hcpcsDescription(proc.code) && (
                        <span className="text-[10px] text-slate-500 ml-2">{hcpcsDescription(proc.code)}</span>
                      )}
                    </div>

                    {/* Total */}
                    <div className="text-right w-20">
                      <p className="font-mono text-white text-xs tabular-nums">{formatMoney(proc.payments || proc.paid || 0)}</p>
                      <p className="text-[10px] text-slate-500 tabular-nums">{formatNumber(proc.claims)} claims</p>
                    </div>

                    {/* Your Cost/Claim */}
                    <div className="text-right w-24">
                      <p className={`font-mono text-xs font-semibold tabular-nums ${hasBenchmark ? decileColor(decile) : 'text-slate-300'}`}>
                        {formatCpc(provCpc)}
                      </p>
                    </div>

                    {/* National Median */}
                    <div className="text-right w-24">
                      <p className="font-mono text-xs text-slate-300 tabular-nums">
                        {hasBenchmark ? formatCpc(proc.nationalMedianCpc) : '\u2014'}
                      </p>
                    </div>

                    {/* vs Median */}
                    <div className="text-right w-16">
                      {hasBenchmark && ratio > 0 ? (
                        <span className={`font-mono text-xs font-semibold tabular-nums ${ratio >= 3 ? 'text-red-400' : ratio >= 1.5 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {ratio.toFixed(1)}&times;
                        </span>
                      ) : (
                        <span className="text-slate-600">&mdash;</span>
                      )}
                    </div>

                    {/* Percentile */}
                    <div className="text-right w-20">
                      {hasBenchmark ? (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${decileBgColor(decile)} ${decileColor(decile)}`}>
                          {decile}
                        </span>
                      ) : (
                        <span className="text-slate-600">&mdash;</span>
                      )}
                    </div>
                  </div>

                  {/* Mobile: stacked layout */}
                  <div className="md:hidden">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link href={`/procedures/${proc.code}`} className="text-white hover:text-blue-400 transition-colors">
                            <span className="font-mono text-xs font-medium">{proc.code}</span>
                          </Link>
                          {hasBenchmark && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${decileBgColor(decile)} ${decileColor(decile)}`}>
                              {decile}
                            </span>
                          )}
                        </div>
                        {hcpcsDescription(proc.code) && (
                          <p className="text-[10px] text-slate-500 mt-0.5">{hcpcsDescription(proc.code)}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono text-white font-semibold text-xs tabular-nums">{formatMoney(proc.payments || proc.paid || 0)}</p>
                        <p className="text-[10px] text-slate-500 tabular-nums">{formatNumber(proc.claims)} claims &middot; {pctOfTotal.toFixed(1)}%</p>
                      </div>
                    </div>

                    {hasBenchmark && (
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-4 text-[10px]">
                          <span className="text-slate-500">
                            Your Cost: <span className={`font-semibold ${decileColor(decile)}`}>{formatCpc(provCpc)}</span>/claim
                          </span>
                          <span className="text-slate-600">|</span>
                          <span className="text-slate-500">
                            Median: <span className="text-slate-300">{formatCpc(proc.nationalMedianCpc)}</span>
                          </span>
                        </div>
                        {ratio > 0 && (
                          <span className={`text-[10px] font-semibold ${ratio >= 3 ? 'text-red-400' : ratio >= 1.5 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {ratio.toFixed(1)}&times; median
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Visual benchmark bar (both mobile and desktop) */}
                  {hasBenchmark && proc.p90 > 0 && (
                    <div className="mt-1.5">
                      <div className="relative h-1.5 bg-dark-600 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 h-full bg-slate-500/30 rounded-full"
                          style={{ width: `${Math.min(100, (proc.p90 / Math.max(provCpc, proc.p90, proc.p99 || proc.p90) * 100))}%` }}
                        />
                        <div
                          className={`absolute top-0 h-full rounded-full ${decile === 'Normal range' ? 'bg-green-500/60' : decile === 'Top 25%' ? 'bg-yellow-500/60' : decile === 'Top 10%' ? 'bg-orange-500/60' : 'bg-red-500/60'}`}
                          style={{ width: `${Math.min(100, (provCpc / Math.max(provCpc, proc.p90, proc.p99 || proc.p90) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Similar Providers */}
      {state && (() => {
        const sameState = (topProviders as any[]).filter((p: any) => p.state === state && p.npi !== npi).slice(0, 5);
        return sameState.length > 0 ? (
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-10">
            <div className="px-5 py-4 border-b border-dark-500/50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Other Top Providers in {stateName(state)}</h2>
              <Link href={`/states/${state}`} className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="divide-y divide-dark-600/50">
              {sameState.map((p: any) => (
                <Link key={p.npi} href={`/providers/${p.npi}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-dark-700/50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate group-hover:text-blue-400 transition-colors">{p.name || `NPI: ${p.npi}`}</p>
                    <p className="text-[10px] text-slate-500">{p.specialty ? p.specialty.substring(0, 50) : ''}</p>
                  </div>
                  <p className="text-xs text-white font-bold tabular-nums shrink-0">{formatMoney(p.totalPaid)}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null;
      })()}

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
            All providers in {stateName(state)} &rarr;
          </Link>
        )}
        <Link href="/analysis" className="text-slate-400 hover:text-slate-300 text-xs font-medium transition-colors">
          How we detect fraud &rarr;
        </Link>
      </div>
    </div>
  );
}
