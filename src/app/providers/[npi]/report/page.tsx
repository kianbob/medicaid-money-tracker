import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, formatMoneyFull, formatCpc, getFlagInfo, parseFlags, hcpcsDescription, stateName } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import topProviders from "../../../../../public/data/top-providers-1000.json";
import smartWatchlist from "../../../../../public/data/smart-watchlist.json";
import oldWatchlist from "../../../../../public/data/expanded-watchlist.json";
import mlScores from "../../../../../public/data/ml-scores.json";
import fs from "fs";
import path from "path";

interface Props {
  params: { npi: string };
}

export async function generateStaticParams() {
  // Only pre-render report pages for flagged providers
  const npis = new Set<string>();
  for (const p of smartWatchlist as any[]) npis.add(p.npi);
  for (const p of oldWatchlist as any[]) npis.add(p.npi);
  return Array.from(npis).slice(0, 200).map((npi) => ({ npi }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let detail: any = null;
  try {
    const detailPath = path.join(process.cwd(), "public", "data", "providers", `${params.npi}.json`);
    if (fs.existsSync(detailPath)) {
      detail = JSON.parse(fs.readFileSync(detailPath, "utf-8"));
    }
  } catch {}
  const provider = (topProviders as any[]).find((p: any) => p.npi === params.npi);
  const smartEntry = (smartWatchlist as any[]).find((w: any) => w.npi === params.npi);
  const name = detail?.name || smartEntry?.name || provider?.name || `Provider ${params.npi}`;
  return {
    title: `Report Card — ${name}`,
    description: `Printable fraud analysis report card for ${name} (NPI: ${params.npi}).`,
    robots: { index: false, follow: false },
  };
}

function loadJsonArray(filename: string): any[] {
  try {
    const p = path.join(process.cwd(), "public", "data", filename);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {}
  return [];
}

function buildFlagExplanation(flag: string, details: any): string {
  if (!details) return '';
  switch (flag) {
    case 'code_specific_outlier': {
      const code = details.code || '';
      const desc = hcpcsDescription(code);
      const codeLabel = desc ? `${code} (${desc})` : code;
      return `Bills ${formatCpc(details.providerCpc)} per claim for ${codeLabel}, which is ${details.ratio?.toFixed(1)}\u00d7 the national median of ${formatCpc(details.nationalMedianCpc)}.`;
    }
    case 'billing_swing':
      return `Billing changed from ${formatMoney(details.fromPay)} (${details.fromYear}) to ${formatMoney(details.toPay)} (${details.toYear}) \u2014 a ${details.pctChange?.toFixed(0)}% swing with ${formatMoney(details.absChange)} absolute change.`;
    case 'massive_new_entrant':
      return `First appeared in ${details.firstMonth || details.firstYear} and has already billed ${formatMoney(details.totalPaid)}, averaging ${formatMoney(details.avgMonthlyBilling)}/month across ${details.monthsActive} months.`;
    case 'rate_outlier_multi_code': {
      const codes = details.codesAboveP90 || 0;
      const topCodes = details.topOutlierCodes || [];
      const codeExamples = topCodes.slice(0, 2).map((c: any) => `${c.code} at ${c.ratio?.toFixed(1)}\u00d7 median`).join(', ');
      return `Billing above the 90th percentile for ${codes} procedure codes${codeExamples ? `: ${codeExamples}` : ''}.`;
    }
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

// Load advanced detection datasets
const impossibleVolumeMap = new Map<string, any>(loadJsonArray("impossible-volume.json").map((d: any) => [d.npi, d]));
const benfordFlagsMap = new Map<string, any>(loadJsonArray("benford-flags.json").map((d: any) => [d.npi, d]));
const changePointsMap = new Map<string, any>(loadJsonArray("change-points.json").map((d: any) => [d.npi, d]));
const suspiciousConcentrationMap = new Map<string, any>(loadJsonArray("suspicious-concentration.json").map((d: any) => [d.npi, d]));

export default function ProviderReportPage({ params }: Props) {
  const { npi } = params;

  // Load detail data
  let detail: any = null;
  try {
    const detailPath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    if (fs.existsSync(detailPath)) {
      detail = JSON.parse(fs.readFileSync(detailPath, "utf-8"));
    }
  } catch {}

  const smartEntry = (smartWatchlist as any[]).find((w: any) => w.npi === npi);
  const oldEntry = (oldWatchlist as any[]).find((w: any) => w.npi === npi);
  const providerEntry = (topProviders as any[]).find((p: any) => p.npi === npi);

  const name = detail?.name || smartEntry?.name || providerEntry?.name || `Provider ${npi}`;
  const specialty = detail?.specialty || smartEntry?.specialty || providerEntry?.specialty || "";
  const city = detail?.city || smartEntry?.city || providerEntry?.city || "";
  const state = detail?.state || smartEntry?.state || providerEntry?.state || "";
  const totalPaid = detail?.totalPaid || smartEntry?.totalPaid || providerEntry?.totalPaid || 0;
  const totalClaims = detail?.totalClaims || providerEntry?.totalClaims || 0;
  const totalBenes = detail?.totalBeneficiaries || detail?.totalBenes || providerEntry?.totalBeneficiaries || providerEntry?.totalBenes || 0;
  const avgPerClaim = totalClaims > 0 ? totalPaid / totalClaims : 0;
  const monthly = detail?.monthly || [];

  // ML Score lookup
  const mlEntry = ((mlScores as any).topProviders as any[])?.find((p: any) => p.npi === npi)
    || ((mlScores as any).smallProviderFlags as any[])?.find((p: any) => p.npi === npi);
  const mlScore = mlEntry?.mlScore ?? null;

  // Merge flags
  const smartFlags = smartEntry?.flags || [];
  const oldFlags = oldEntry ? (oldEntry.flags || []) : [];
  const detailFlags = parseFlags(detail?.flags || providerEntry?.flags);
  const allFlags = Array.from(new Set([...smartFlags, ...oldFlags, ...detailFlags]));
  const flagCount = allFlags.length;

  // Merge flag details
  const flagDetails: Record<string, any> = {};
  if (smartEntry?.flagDetails) {
    for (const [k, v] of Object.entries(smartEntry.flagDetails)) flagDetails[k] = v;
  }
  if (oldEntry?.flag_details) {
    for (const [k, v] of Object.entries(oldEntry.flag_details)) {
      if (!flagDetails[k]) flagDetails[k] = v;
    }
  }

  // Advanced detection
  const ivEntry = impossibleVolumeMap.get(npi);
  const bfEntry = benfordFlagsMap.get(npi);
  const cpEntry = changePointsMap.get(npi);
  const scEntry = suspiciousConcentrationMap.get(npi);
  const hasAdvanced = !!(ivEntry || bfEntry || cpEntry || scEntry);

  // Risk tier
  let riskTier = 'Low';
  let riskTierColor = 'bg-green-100 text-green-800 border-green-300';
  if (flagCount >= 3) {
    riskTier = 'Critical';
    riskTierColor = 'bg-red-100 text-red-800 border-red-300';
  } else if (flagCount >= 2) {
    riskTier = 'High';
    riskTierColor = 'bg-orange-100 text-orange-800 border-orange-300';
  } else if (flagCount >= 1) {
    riskTier = 'Elevated';
    riskTierColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
  } else if (mlScore !== null && mlScore >= 0.6) {
    riskTier = 'ML Flag';
    riskTierColor = 'bg-purple-100 text-purple-800 border-purple-300';
  }

  // Active months count
  const activeMonths = monthly.length || mlEntry?.activeMonths || 0;

  // Not found
  if (!detail && !providerEntry && !smartEntry) {
    return (
      <div className="report-page bg-white min-h-screen p-8 text-black">
        <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
        <p className="text-gray-600">NPI {npi} is not in our analyzed dataset.</p>
        <Link href={`/providers/${npi}`} className="text-blue-600 underline mt-4 inline-block print-hide">Back to provider page</Link>
      </div>
    );
  }

  return (
    <div className="report-page bg-white min-h-screen text-black">
      {/* Print button — hidden when printing */}
      <div className="print-hide bg-gray-50 border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <Link href={`/providers/${npi}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          &larr; Back to full profile
        </Link>
        <PrintButton />
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="border-b-2 border-gray-900 pb-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{name}</h1>
              <div className="mt-2 text-sm text-gray-600 space-y-0.5">
                {specialty && <p>{specialty}</p>}
                {(city || state) && <p>{city}{city && state ? ', ' : ''}{state ? stateName(state) : ''}</p>}
                <p className="font-mono text-xs text-gray-500">NPI: {npi}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 text-center shrink-0 ${riskTierColor}`}>
              <p className="text-[10px] uppercase tracking-widest font-semibold leading-none mb-1">Risk Tier</p>
              <p className="text-xl font-black leading-none">{riskTier}</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-300 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total Paid</p>
            <p className="text-xl font-bold text-gray-900">{formatMoney(totalPaid)}</p>
            <p className="text-[10px] text-gray-500 font-mono">{formatMoneyFull(totalPaid)}</p>
          </div>
          <div className="border border-gray-300 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total Claims</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(totalClaims)}</p>
          </div>
          <div className="border border-gray-300 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Beneficiaries</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(totalBenes)}</p>
          </div>
          <div className="border border-gray-300 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Avg Cost/Claim</p>
            <p className="text-xl font-bold text-gray-900">{formatCpc(avgPerClaim)}</p>
          </div>
        </div>

        {activeMonths > 0 && (
          <p className="text-sm text-gray-600 mb-8">
            Active billing period: <strong>{activeMonths} months</strong>
            {monthly.length > 0 && <> ({monthly[0]?.month} to {monthly[monthly.length - 1]?.month})</>}
          </p>
        )}

        {/* Fraud Flags */}
        {flagCount > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
              Statistical Fraud Flags ({flagCount})
            </h2>
            <div className="space-y-4">
              {allFlags.map((flag: string) => {
                const info = getFlagInfo(flag);
                const details = flagDetails[flag];
                const explanation = buildFlagExplanation(flag, details);
                return (
                  <div key={flag} className="border-l-4 border-gray-400 pl-4">
                    <p className="font-bold text-gray-900">{info.label}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                    {explanation && (
                      <p className="text-sm text-gray-800 mt-1 bg-gray-50 rounded px-3 py-2 border border-gray-200">
                        {explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {flagCount === 0 && mlScore === null && (
          <div className="mb-8 border border-green-300 bg-green-50 rounded-lg p-4">
            <p className="text-green-800 font-semibold">No statistical fraud flags detected for this provider.</p>
          </div>
        )}

        {/* Advanced Detection Signals */}
        {hasAdvanced && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
              Advanced Detection Signals
            </h2>
            <div className="space-y-3">
              {ivEntry && (
                <div className="flex items-start gap-3 border-l-4 border-red-400 pl-4">
                  <div>
                    <p className="font-bold text-gray-900">Billing Velocity</p>
                    <p className="text-sm text-gray-700">{ivEntry.claimsPerDay.toFixed(1)} claims per working day — may exceed physically possible volume for a single provider.</p>
                  </div>
                </div>
              )}
              {bfEntry && (
                <div className="flex items-start gap-3 border-l-4 border-orange-400 pl-4">
                  <div>
                    <p className="font-bold text-gray-900">Benford&apos;s Law Anomaly</p>
                    <p className="text-sm text-gray-700">Chi-squared statistic of {bfEntry.chiSquared.toFixed(1)} — the distribution of leading digits in billing amounts deviates significantly from the expected natural pattern.</p>
                  </div>
                </div>
              )}
              {cpEntry && (
                <div className="flex items-start gap-3 border-l-4 border-yellow-500 pl-4">
                  <div>
                    <p className="font-bold text-gray-900">CUSUM Change Point</p>
                    <p className="text-sm text-gray-700">Billing shifted {cpEntry.ratio.toFixed(1)}x in {cpEntry.changeMonth} — a statistically significant structural change in billing behavior was detected.</p>
                  </div>
                </div>
              )}
              {scEntry && (
                <div className="flex items-start gap-3 border-l-4 border-purple-400 pl-4">
                  <div>
                    <p className="font-bold text-gray-900">Suspicious Concentration</p>
                    <p className="text-sm text-gray-700">Herfindahl-Hirschman Index of {scEntry.hhiIndex.toFixed(0)} across {scEntry.codeCount} procedure codes — billing is highly concentrated in very few services.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ML Score */}
        {mlScore !== null && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
              Machine Learning Risk Score
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${mlScore >= 0.8 ? 'bg-red-500' : mlScore >= 0.6 ? 'bg-orange-500' : mlScore >= 0.3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${mlScore * 100}%` }}
                />
              </div>
              <span className="font-bold text-xl text-gray-900 shrink-0">{(mlScore * 100).toFixed(0)}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              A Random Forest model trained on OIG-excluded providers scored this provider at {(mlScore * 100).toFixed(1)}% fraud similarity.
              {mlScore >= 0.8 && ' This is a very high score, placing this provider in the top risk tier.'}
              {mlScore >= 0.6 && mlScore < 0.8 && ' This is a high score, indicating significant similarity to known fraud patterns.'}
              {mlScore >= 0.3 && mlScore < 0.6 && ' This is a moderate score.'}
              {mlScore < 0.3 && ' This is a low score.'}
            </p>
            {flagCount > 0 && (
              <p className="text-sm text-gray-800 font-semibold mt-2">
                This provider was flagged by both statistical tests and machine learning — providers flagged by both methods are significantly more likely to warrant investigation.
              </p>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="border-t-2 border-gray-300 pt-6 mt-8">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Disclaimer:</strong> Statistical flags indicate unusual billing patterns — they are not proof of fraud or wrongdoing. Some entities (government agencies, home care programs, hospitals) may legitimately bill at higher rates due to patient acuity, overhead costs, or specialized services. This report is generated from public HHS data and statistical analysis only. No clinical or investigative review has been performed.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-6 flex items-center justify-between text-[10px] text-gray-400">
          <p>Generated by OpenMedicaid | openmedicaid.org | Data: HHS 2018-2024</p>
          <p className="print-hide">
            <Link href={`/providers/${npi}`} className="text-blue-600 hover:underline">View full profile</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
