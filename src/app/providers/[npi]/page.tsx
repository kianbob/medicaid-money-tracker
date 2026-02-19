import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, formatMoneyFull, formatCpc, riskLabel, riskColor, riskDot, riskBgColor, getFlagInfo, parseFlags, hcpcsDescription, stateName, decileColor, decileBgColor } from "@/lib/format";
import { MonthlySpendingChart } from "@/components/Charts";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import topProviders from "../../../../public/data/top-providers-1000.json";
import smartWatchlist from "../../../../public/data/smart-watchlist.json";
import oldWatchlist from "../../../../public/data/expanded-watchlist.json";
import stats from "../../../../public/data/stats.json";
import mlScores from "../../../../public/data/ml-scores.json";
import specialtyBenchmarks from "../../../../public/data/specialty-benchmarks.json";
import leieMatched from "../../../../public/data/leie-matched.json";
import fs from "fs";
import path from "path";

// Build exclusion lookup (40 entries)
const leieMatchedMap = new Map<string, any>((leieMatched as any[]).map((d: any) => [d.npi, d]));

interface Props {
  params: { npi: string };
}

export async function generateStaticParams() {
  // Only pre-render top 200 providers to avoid build OOM
  // Rest render on-demand (still work fine, just not pre-built)
  return (topProviders as any[]).slice(0, 200).map((p: any) => ({ npi: p.npi }));
}

export const dynamicParams = true;

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
      title: `${name} \u2014 OpenMedicaid`,
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

// Load advanced detection datasets (once at module level)
function loadJsonArray(filename: string): any[] {
  try {
    const p = path.join(process.cwd(), "public", "data", filename);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {}
  return [];
}
const impossibleVolumeMap = new Map<string, any>(loadJsonArray("impossible-volume.json").map((d: any) => [d.npi, d]));
const benfordFlagsMap = new Map<string, any>(loadJsonArray("benford-flags.json").map((d: any) => [d.npi, d]));
const changePointsMap = new Map<string, any>(loadJsonArray("change-points.json").map((d: any) => [d.npi, d]));
const suspiciousConcentrationMap = new Map<string, any>(loadJsonArray("suspicious-concentration.json").map((d: any) => [d.npi, d]));

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
  const totalBenes = detail?.totalBeneficiaries || detail?.totalBenes || providerEntry?.totalBeneficiaries || providerEntry?.totalBenes || 0;
  const avgPerClaim = totalClaims > 0 ? totalPaid / totalClaims : 0;
  const claimsPerBene = totalBenes > 0 ? totalClaims / totalBenes : 0;
  const growthRate = detail?.growthRate || 0;
  const monthly = detail?.monthly || [];
  // Build yearly data from various formats
  const yearlyData: Record<string, number> = {};
  if (detail?.yearlyData && typeof detail.yearlyData === 'object' && !Array.isArray(detail.yearlyData)) {
    for (const [year, data] of Object.entries(detail.yearlyData as Record<string, any>)) {
      yearlyData[year] = data.totalPaid ?? data.payments ?? 0;
    }
  } else if (Array.isArray(detail?.yearlyTrend)) {
    for (const item of detail.yearlyTrend) {
      yearlyData[item.year || item.month?.substring(0, 4)] = item.totalPaid ?? item.payments ?? 0;
    }
  }
  const procedures = (detail?.procedures || detail?.codes || detail?.topProcedures || []).map((p: any) => ({
    ...p,
    payments: p.payments ?? p.totalPaid ?? p.paid ?? 0,
    claims: p.claims ?? p.totalClaims ?? 0,
    beneficiaries: p.beneficiaries ?? p.totalBeneficiaries ?? 0,
    providerCpc: p.providerCpc ?? p.costPerClaim ?? (p.claims || p.totalClaims ? (p.payments ?? p.totalPaid ?? p.paid ?? 0) / (p.claims || p.totalClaims) : 0),
  }));

  // ML Score lookup
  const mlEntry = ((mlScores as any).topProviders as any[])?.find((p: any) => p.npi === npi)
    || ((mlScores as any).smallProviderFlags as any[])?.find((p: any) => p.npi === npi);
  const mlScore = mlEntry?.mlScore ?? null;

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

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    'name': name,
    ...(city || state ? {
      'address': {
        '@type': 'PostalAddress',
        ...(city ? { 'addressLocality': city } : {}),
        ...(state ? { 'addressRegion': state } : {}),
      }
    } : {}),
    'identifier': {
      '@type': 'PropertyValue',
      'name': 'NPI',
      'value': npi,
    },
  };

  const totalPaidDisplay = detail?.totalPaid ? `$${(detail.totalPaid / 1e9).toFixed(1)}B` : providerEntry?.totalPaid ? formatMoney(providerEntry.totalPaid) : 'N/A';
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `Is ${name} flagged for Medicaid fraud?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': flagCount > 0
            ? `${name} (NPI: ${npi}) has been flagged by ${flagCount} statistical fraud detection test${flagCount > 1 ? 's' : ''}. These flags indicate unusual billing patterns compared to peers — not proof of fraud.`
            : `${name} (NPI: ${npi}) has not been flagged by our statistical fraud detection tests. Their billing patterns fall within normal ranges for their specialty.`
        }
      },
      {
        '@type': 'Question',
        'name': `How much does ${name} bill Medicaid?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${name} received ${totalPaidDisplay} in total Medicaid payments from 2018-2024, based on HHS billing records.${specialty ? ` They are classified as a ${specialty} provider.` : ''}${city && state ? ` Located in ${city}, ${state}.` : ''}`
        }
      },
      {
        '@type': 'Question',
        'name': `What is NPI ${npi}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `NPI ${npi} is the National Provider Identifier for ${name}.${specialty ? ` They are a ${specialty} provider` : ''}${city && state ? ` based in ${city}, ${state}` : ''}. This NPI is registered with the CMS NPI Registry.`
        }
      },
    ],
  };

  // Not found — but we show a graceful message for providers outside top 1000
  if (!detail && !providerEntry && !smartEntry) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-3xl font-bold text-white mb-4">Limited Data Available</h1>
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

  // Similar providers (same specialty)
  const similarProviders = specialty
    ? (topProviders as any[])
        .filter((p: any) => p.specialty === specialty && p.npi !== npi)
        .slice(0, 5)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/providers" className="hover:text-blue-400 transition-colors">Providers</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{name}</span>
      </nav>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-6">
        <Link href="/compare" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-dark-700 border border-dark-500/50 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors">
          ⚖️ Compare
        </Link>
        <Link href={`/providers/${npi}/report`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-dark-700 border border-dark-500/50 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors">
          🖨️ Print Report
        </Link>
        <CopyLinkButton className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-dark-700 border border-dark-500/50 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors" />
      </div>

      {/* OIG Exclusion Banner */}
      {leieMatchedMap.has(npi) && (() => {
        const excl = leieMatchedMap.get(npi)!;
        const exclDateRaw = excl.exclDate || '';
        const exclDateFormatted = exclDateRaw.length === 8
          ? `${exclDateRaw.slice(4, 6)}/${exclDateRaw.slice(6, 8)}/${exclDateRaw.slice(0, 4)}`
          : exclDateRaw;
        return (
          <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-5 mb-6" role="alert">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <p className="text-base font-bold text-red-400">OIG EXCLUDED — This provider appears on the federal exclusion list</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-300">
                  {exclDateFormatted && <span>Exclusion date: <span className="text-white font-semibold">{exclDateFormatted}</span></span>}
                  {excl.exclTypeDesc && <span>Reason: <span className="text-white font-semibold">{excl.exclTypeDesc}</span></span>}
                </div>
                <Link href="/exclusions/matched" className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium mt-3 transition-colors">
                  View all excluded providers found in billing data &rarr;
                </Link>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-2">
          {flagCount > 0 && (
            <div className={`w-3 h-3 rounded-full mt-2.5 shrink-0 ${riskDot(flagCount)} ${flagCount >= 3 ? 'risk-dot-critical' : ''}`} />
          )}
          <h1 className="font-headline text-2xl md:text-4xl font-extrabold text-white tracking-tight">{name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
          {specialty && <span>{specialty}</span>}
          {specialty && (city || state) && <span className="text-slate-600">&middot;</span>}
          {city && state && <span>{city}, <Link href={`/states/${state}`} className="hover:text-blue-400 transition-colors">{state}</Link></span>}
          {!city && state && <Link href={`/states/${state}`} className="hover:text-blue-400 transition-colors">{stateName(state)}</Link>}
          {(specialty || city || state) && <span className="text-slate-600">&middot;</span>}
          <span className="font-mono text-xs text-slate-500">NPI: {npi}</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${name} received ${formatMoney(totalPaid)} in Medicaid payments. See the full spending profile →`)}&url=${encodeURIComponent(`https://openmedicaid.org/providers/${npi}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors px-2 py-0.5 rounded border border-dark-500/50 hover:border-dark-400"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share
          </a>
          <CopyLinkButton />
          {(flagCount > 0 || mlScore !== null) && (
            <Link
              href={`/providers/${npi}/report`}
              className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors px-2 py-0.5 rounded border border-dark-500/50 hover:border-dark-400 print-hide"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Print Report
            </Link>
          )}
          {mlScore !== null && (() => {
            const pct = mlScore * 100;
            const color = pct >= 80 ? 'text-red-400' : pct >= 60 ? 'text-orange-400' : pct >= 30 ? 'text-yellow-400' : 'text-green-400';
            const bg = pct >= 80 ? 'bg-red-500/15 border-red-500/30' : pct >= 60 ? 'bg-orange-500/15 border-orange-500/30' : pct >= 30 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20';
            return (
              <Link href="/ml-analysis" className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded border ${bg} ${color} font-semibold hover:opacity-80 transition-opacity`}>
                ML Risk: {pct.toFixed(0)}%
              </Link>
            );
          })()}
        </div>
        {(flagCount > 0 || mlScore !== null) && (
          <div className="flex flex-wrap gap-3 mt-3">
            <Link href="/watchlist" className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">
              View on Risk Watchlist &rarr;
            </Link>
          </div>
        )}
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
          {mlScore !== null && mlScore > 0 && (
            <div className="bg-dark-800/60 border border-slate-500/20 rounded-lg px-4 py-3 mb-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                This provider was flagged by both <strong className="text-white">statistical tests ({flagCount} flag{flagCount !== 1 ? 's' : ''})</strong> and <strong className="text-white">machine learning (ML score: {(mlScore * 100).toFixed(0)}%)</strong>. Providers flagged by both methods are significantly more likely to warrant investigation.
              </p>
            </div>
          )}
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
          <p className="text-[10px] text-slate-500 mt-4">
            Statistical flags are not proof of wrongdoing. Some entities (government agencies, home care programs) may legitimately bill at high rates. Hospitals, government entities, and large care organizations may legitimately bill at higher rates due to patient acuity, overhead costs, or specialized services. <Link href="/analysis" className="text-blue-400 hover:underline">Read our methodology</Link>.
          </p>
        </div>
      )}

      {/* Red Flags Explained — expandable plain-English guide */}
      {flagCount > 0 && (
        <details className="bg-dark-800 border border-dark-500/50 rounded-xl mb-8 group">
          <summary className="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between hover:bg-dark-700/30 transition-colors rounded-xl">
            <h2 className="text-sm font-bold text-white">Red Flags Explained</h2>
            <span className="text-slate-500 text-xs group-open:rotate-180 transition-transform">&#9660;</span>
          </summary>
          <div className="px-5 pb-5 space-y-4 border-t border-dark-500/50 pt-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Each flag represents a statistical test that identified unusual billing patterns. Here&apos;s what each flag on this provider means in plain English:
            </p>
            {allFlags.map((flag: string) => {
              const plainEnglish: Record<string, string> = {
                'code_specific_outlier': 'Cost Outlier means this provider charges significantly more per claim than other providers billing the same procedure codes. This could indicate upcoding, inflated charges, or specialized services that justify higher costs.',
                'billing_swing': 'Billing Swing means this provider\'s total billing changed dramatically from one year to the next — increasing or decreasing by more than 200% with over $1M in absolute change. This could indicate a change in practice scope, a billing scheme ramping up, or legitimate growth.',
                'massive_new_entrant': 'New Entrant means this provider began billing Medicaid recently but is already receiving millions of dollars in payments. While some new providers legitimately grow fast (e.g., large group practices), this pattern is also common in fraud schemes that set up shell companies to bill aggressively before shutting down.',
                'rate_outlier_multi_code': 'Rate Outlier means this provider charges above the 90th percentile for multiple different procedure codes simultaneously. While one high-cost code could reflect specialization, consistently high rates across many codes may indicate systematic overbilling.',
                'outlier_spending': 'Unusually High Spending means this provider\'s total Medicaid payments are significantly above the median for their specialty. This doesn\'t necessarily indicate fraud — high volume practices and those serving complex populations may legitimately bill more.',
                'unusual_cost_per_claim': 'High Cost Per Claim means each individual claim from this provider costs significantly more than what other providers charge for the same services. This could indicate upcoding (billing for more expensive services than provided) or legitimate specialized care.',
                'unusual_cost': 'High Cost Per Claim means each individual claim from this provider costs significantly more than what other providers charge for the same services. This could indicate upcoding (billing for more expensive services than provided) or legitimate specialized care.',
                'explosive_growth': 'Explosive Growth means this provider\'s billing increased by more than 500% year-over-year. While rapid expansion can be legitimate, this pattern has been observed in fraud schemes that ramp up billing quickly before detection.',
                'instant_high_volume': 'Instant Volume means this provider billed over $1 million in their very first year of Medicaid participation. New providers typically ramp up gradually, so immediate high-volume billing can be a red flag.',
                'procedure_concentration': 'Single-Code Billing means this provider bills almost exclusively for one or two procedure codes despite high total volume. Legitimate specialists may focus on specific codes, but extreme concentration can indicate a scheme billing repeatedly for the same service.',
                'billing_consistency': 'Consistent Billing means this provider\'s monthly billing amounts show almost no natural variation. Real medical practices tend to have some fluctuation in monthly billing, so unnaturally steady billing can indicate automated or fabricated claims.',
                'beneficiary_stuffing': 'High Claims Per Patient means this provider files an unusually high number of claims per individual patient. This could indicate legitimate intensive treatment or a pattern of billing for services not actually rendered.',
                'bene_stuffing': 'High Claims Per Patient means this provider files an unusually high number of claims per individual patient. This could indicate legitimate intensive treatment or a pattern of billing for services not actually rendered.',
                'extreme_beneficiary_stuffing': 'Beneficiary Stuffing means this provider files over 100 claims per patient, far exceeding any normal treatment pattern. This is a strong indicator of potential billing abuse.',
                'spending_spike': 'Spending Spike means this provider experienced a dramatic, sudden increase in billing over a short period. Legitimate causes include new contracts or expanded services, but this pattern also appears in billing fraud ramp-ups.',
              };
              const explanation = plainEnglish[flag];
              if (!explanation) return null;
              const info = getFlagInfo(flag);
              return (
                <div key={flag} className="flex items-start gap-3">
                  <span className={`text-sm mt-0.5 shrink-0 ${info.color}`}>&bull;</span>
                  <div>
                    <p className={`text-xs font-bold ${info.color}`}>{info.label}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{explanation}</p>
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-slate-600 pt-2 border-t border-dark-600/50">
              These flags are statistical indicators only. Many flagged providers have legitimate explanations for their billing patterns. <Link href="/analysis" className="text-blue-400 hover:underline">Learn more about our methodology</Link>.
            </p>
          </div>
        </details>
      )}

      {/* Advanced Detection Signals */}
      {flagCount > 0 && (() => {
        const ivEntry = impossibleVolumeMap.get(npi);
        const bfEntry = benfordFlagsMap.get(npi);
        const cpEntry = changePointsMap.get(npi);
        const scEntry = suspiciousConcentrationMap.get(npi);
        if (!ivEntry && !bfEntry && !cpEntry && !scEntry) return null;

        const signals: { label: string; value: string; color: string; bg: string }[] = [];
        if (ivEntry) signals.push({ label: 'Billing Velocity', value: `${ivEntry.claimsPerDay.toFixed(1)} claims/working day`, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/25' });
        if (bfEntry) signals.push({ label: "Benford's Law", value: `Chi-squared: ${bfEntry.chiSquared.toFixed(1)}`, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/25' });
        if (cpEntry) signals.push({ label: 'Change Point', value: `Billing shifted ${cpEntry.ratio.toFixed(1)}x in ${cpEntry.changeMonth}`, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/25' });
        if (scEntry) signals.push({ label: 'Concentration', value: `HHI: ${scEntry.hhiIndex.toFixed(0)} on ${scEntry.codeCount} codes`, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/25' });

        return (
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-white mb-3">Advanced Detection Signals</h2>
            <p className="text-[10px] text-slate-500 mb-3">Additional statistical tests from advanced fraud detection methods</p>
            <div className="flex flex-wrap gap-2">
              {signals.map((s) => (
                <div key={s.label} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${s.bg}`}>
                  <span className={`text-xs font-semibold ${s.color}`}>{s.label}</span>
                  <span className="text-[10px] text-slate-400">{s.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-3">
              These signals use advanced statistical methods including digit distribution analysis, change-point detection, and market concentration metrics. <Link href="/analysis" className="text-blue-400 hover:underline">Learn more</Link>.
            </p>
          </div>
        );
      })()}

      {/* Risk Assessment — plain-English summary */}
      {flagCount > 0 && procedures.length > 0 && (() => {
        // Build plain-English risk assessment sentences
        const assessmentLines: string[] = [];

        // Procedure concentration check
        const uniqueCodes = procedures.length;
        if (uniqueCodes <= 2 && totalPaid > 1000000) {
          const topProc = procedures[0];
          const topPct = totalPaid > 0 ? ((topProc?.payments || topProc?.paid || 0) / totalPaid * 100) : 0;
          assessmentLines.push(`Extreme procedure concentration \u2014 ${topPct.toFixed(0)}% of all billing flows through ${uniqueCodes === 1 ? 'a single code' : 'just 2 codes'} (${procedures.map((p: any) => p.code).join(', ')}).`);
        }

        // Code-specific cost outliers from procedure data
        const outlierProcs = procedures.filter((p: any) => {
          const r = p.cpcRatio || (p.nationalMedianCpc > 0 ? (p.providerCpc || 0) / p.nationalMedianCpc : 0);
          return r >= 3 && p.nationalMedianCpc > 0;
        });
        for (const op of outlierProcs.slice(0, 3)) {
          const r = op.cpcRatio || (op.providerCpc / op.nationalMedianCpc);
          const desc = hcpcsDescription(op.code);
          const codeLabel = desc ? `${op.code} (${desc})` : op.code;
          assessmentLines.push(`Bills ${formatCpc(op.providerCpc)} per claim for ${codeLabel} \u2014 ${r.toFixed(1)}\u00d7 the national median of ${formatCpc(op.nationalMedianCpc)}.`);
        }

        // Above p99 codes
        const p99Procs = procedures.filter((p: any) => p.decile === 'Top 1%');
        const p90Procs = procedures.filter((p: any) => p.decile === 'Top 5%' || p.decile === 'Top 10%');
        if (p99Procs.length > 0) {
          assessmentLines.push(`Billing in the top 1% nationally for ${p99Procs.length} procedure code${p99Procs.length > 1 ? 's' : ''}: ${p99Procs.slice(0, 3).map((p: any) => p.code).join(', ')}.`);
        } else if (p90Procs.length >= 2) {
          assessmentLines.push(`Billing above the 90th percentile for ${p90Procs.length} procedure codes simultaneously.`);
        }

        return assessmentLines.length > 0 ? (
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-white mb-3">Risk Assessment</h2>
            <div className="space-y-2">
              {assessmentLines.map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 shrink-0">&bull;</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-3">
              This is a statistical summary, not an accusation. <Link href="/analysis" className="text-blue-400 hover:underline">See our methodology</Link>.
            </p>
          </div>
        ) : null;
      })()}

      {/* Specialty Peer Comparison */}
      {totalPaid > 0 && specialty && (() => {
        const bench = (specialtyBenchmarks as Record<string, any>)[specialty];
        if (!bench || bench.count < 5) return null;

        // Determine percentile position
        let percentileLabel = '';
        let warningLevel: 'none' | 'amber' | 'red' = 'none';
        if (totalPaid >= bench.p99) {
          percentileLabel = '99th';
          warningLevel = 'red';
        } else if (totalPaid >= bench.p90) {
          percentileLabel = '90th';
          warningLevel = 'amber';
        } else if (totalPaid >= bench.p75) {
          percentileLabel = '75th';
        } else if (totalPaid >= bench.median) {
          percentileLabel = '50th';
        } else if (totalPaid >= bench.p25) {
          percentileLabel = '25th';
        } else {
          percentileLabel = 'below 25th';
        }

        // Calculate marker position on the bar (0-100%)
        // Use log scale for better visual distribution since spending ranges are huge
        const logScale = (val: number) => Math.log10(Math.max(val, 1));
        const logMin = logScale(bench.p25 * 0.5);
        const logMax = logScale(bench.p99 * 1.2);
        const logRange = logMax - logMin;
        const toPosition = (val: number) => Math.max(0, Math.min(100, ((logScale(val) - logMin) / logRange) * 100));

        const p25Pos = toPosition(bench.p25);
        const medianPos = toPosition(bench.median);
        const p75Pos = toPosition(bench.p75);
        const p90Pos = toPosition(bench.p90);
        const providerPos = toPosition(totalPaid);

        return (
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-white mb-1">Compared to {specialty} Peers</h2>
            <p className="text-[10px] text-slate-500 mb-4">Total spending distribution among {formatNumber(bench.count)} providers in this specialty</p>

            {/* Horizontal benchmark bar */}
            <div className="relative mb-4 max-w-full overflow-hidden">
              {/* Track */}
              <div className="relative h-3 bg-dark-600 rounded-full overflow-hidden">
                {/* Interquartile range (p25-p75) */}
                <div
                  className="absolute top-0 h-full bg-slate-500/25 rounded-full"
                  style={{ left: `${p25Pos}%`, width: `${p75Pos - p25Pos}%` }}
                />

                {/* Marker: P25 */}
                <div className="absolute top-0 h-full w-px bg-slate-500/60" style={{ left: `${p25Pos}%` }} />
                {/* Marker: Median */}
                <div className="absolute top-0 h-full w-0.5 bg-slate-400/80" style={{ left: `${medianPos}%` }} />
                {/* Marker: P75 */}
                <div className="absolute top-0 h-full w-px bg-slate-500/60" style={{ left: `${p75Pos}%` }} />
                {/* Marker: P90 */}
                <div className="absolute top-0 h-full w-px bg-amber-500/50" style={{ left: `${p90Pos}%` }} />

                {/* Provider marker */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${warningLevel === 'red' ? 'bg-red-400 border-red-300' : warningLevel === 'amber' ? 'bg-amber-400 border-amber-300' : 'bg-blue-400 border-blue-300'}`}
                  style={{ left: `${providerPos}%`, transform: `translate(-50%, -50%)` }}
                />
              </div>

              {/* Labels under the bar */}
              <div className="relative h-4 mt-1">
                <span className="absolute text-[9px] text-slate-500 -translate-x-1/2" style={{ left: `${p25Pos}%` }}>P25</span>
                <span className="absolute text-[9px] text-slate-400 font-semibold -translate-x-1/2" style={{ left: `${medianPos}%` }}>Median</span>
                <span className="absolute text-[9px] text-slate-500 -translate-x-1/2" style={{ left: `${p75Pos}%` }}>P75</span>
                <span className="absolute text-[9px] text-amber-500/70 -translate-x-1/2" style={{ left: `${p90Pos}%` }}>P90</span>
              </div>
            </div>

            {/* Text summary */}
            <p className="text-sm text-slate-300 leading-relaxed">
              This provider&apos;s total spending of <span className="text-white font-semibold">{formatMoney(totalPaid)}</span> is at the <span className="text-white font-semibold">{percentileLabel} percentile</span> among {formatNumber(bench.count)} {specialty} providers.
            </p>

            {/* Warning text */}
            {warningLevel === 'red' && (
              <p className="text-xs text-red-400 font-semibold mt-2">
                Above 99th percentile for this specialty &mdash; higher spending than {Math.floor(bench.count * 0.99)} of {formatNumber(bench.count)} peers
              </p>
            )}
            {warningLevel === 'amber' && (
              <p className="text-xs text-amber-400 font-semibold mt-2">
                Above 90th percentile for this specialty &mdash; higher spending than {Math.floor(bench.count * 0.9)} of {formatNumber(bench.count)} peers
              </p>
            )}
          </div>
        );
      })()}

      {/* Active Billing Period */}
      {monthly.length > 0 && (() => {
        const firstMonth = monthly[0]?.month;
        const lastMonth = monthly[monthly.length - 1]?.month;
        const lastVal = monthly[monthly.length - 1]?.payments || monthly[monthly.length - 1]?.paid || 0;
        const prevVal = monthly.length >= 2 ? (monthly[monthly.length - 2]?.payments || monthly[monthly.length - 2]?.paid || 0) : 0;
        // Check if billing stopped abruptly (last month is 0 or last month is before 2024-06)
        const abruptStop = lastMonth && lastMonth < '2024-06' && lastVal === 0;
        const recentAbruptDrop = lastVal > 0 && prevVal > 0 && lastVal < prevVal * 0.1;

        return (
          <div className="flex flex-wrap gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-dark-800 border-dark-500/50">
              <span className="text-[10px] text-slate-500">Active Billing Period:</span>
              <span className="text-sm font-semibold text-white">{firstMonth}</span>
              <span className="text-slate-600">&rarr;</span>
              <span className="text-sm font-semibold text-white">{lastMonth}</span>
              <span className="text-[10px] text-slate-600">({monthly.length} months)</span>
            </div>
            {abruptStop && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-amber-500/8 border-amber-500/20">
                <span className="text-xs text-amber-400 font-semibold">Billing appears to have stopped</span>
                <span className="text-[10px] text-slate-500">Last active: {lastMonth}</span>
              </div>
            )}
            {recentAbruptDrop && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-amber-500/8 border-amber-500/20">
                <span className="text-xs text-amber-400 font-semibold">Sharp billing drop in final month</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Procedure concentration insight */}
      {procedures.length > 0 && procedures.length <= 2 && totalPaid > 500000 && (() => {
        const topProc = procedures[0];
        const topPct = totalPaid > 0 ? ((topProc?.payments || topProc?.paid || 0) / totalPaid * 100) : 0;
        return (
          <div className="bg-orange-500/5 border border-orange-500/15 rounded-lg px-4 py-2.5 mb-3">
            <p className="text-xs text-orange-400 font-semibold">
              Extreme procedure concentration &mdash; {topPct.toFixed(0)}% of {formatMoney(totalPaid)} billed through {procedures.length === 1 ? 'a single code' : 'just 2 codes'}
            </p>
          </div>
        );
      })()}

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

      {/* Peer Comparison */}
      {totalPaid > 0 && (() => {
        const rank = (topProviders as any[]).findIndex((p: any) => p.npi === npi) + 1;
        const totalProviders = (stats as any).providers;
        const topPct = rank > 0 ? (rank / totalProviders) * 100 : 0;
        return rank > 0 ? (
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="text-white font-bold">#{rank}</span> of {formatNumber(totalProviders)} providers by total spending
              <span className="text-slate-500 ml-1">(top {topPct < 0.1 ? '<0.1' : topPct.toFixed(1)}%)</span>
            </p>
          </div>
        ) : null;
      })()}

      {/* Analysis Narrative */}
      {detail?.narrative && detail.narrative.length > 0 && (() => {
        const borderColors: Record<string, string> = {
          'Provider Overview': 'border-l-blue-500',
          'Key Findings': 'border-l-yellow-500',
          'Important Context': 'border-l-green-500',
          'Why This Matters': 'border-l-slate-500',
        };
        const icons: Record<string, string> = {
          'Key Findings': '\ud83d\udcca',
          'Important Context': '\u2139\ufe0f',
        };
        return (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span>\ud83d\udd0d</span> Analysis
            </h2>
            <div className="space-y-3">
              {detail.narrative.map((section: any, i: number) => {
                const border = borderColors[section.title] || 'border-l-slate-600';
                const icon = icons[section.title] || '';
                return (
                  <div key={i} className={`bg-dark-800 border border-dark-500/50 border-l-4 ${border} rounded-lg p-4`}>
                    <h3 className="text-xs font-bold text-white mb-2">{section.title}</h3>
                    {section.text && (
                      <p className="text-sm text-slate-300 leading-relaxed">{section.text}</p>
                    )}
                    {section.items && section.items.length > 0 && (
                      <ul className="space-y-1.5 mt-1">
                        {section.items.map((item: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                            <span className="shrink-0 mt-0.5 text-xs">{icon || '\u2022'}</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

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
      </div>

      {/* Monthly Trend */}
      {monthly.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
          <h2 className="text-sm font-bold text-white mb-4">Monthly Spending Trend</h2>
          <MonthlySpendingChart data={monthly} />
        </div>
      )}

      {/* Yearly Trend with % Change */}
      {(() => {
        const yearlyMap: Record<string, number> = { ...yearlyData };
        if (Object.keys(yearlyMap).length === 0 && monthly.length > 12) {
          for (const m of monthly) {
            const year = m.month?.substring(0, 4);
            if (year) {
              yearlyMap[year] = (yearlyMap[year] || 0) + (m.payments || m.paid || 0);
            }
          }
        }
        const years = Object.keys(yearlyMap).sort();
        if (years.length < 2) return null;
        const maxVal = Math.max(...years.map(y => yearlyMap[y]));
        return (
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
            <h2 className="text-sm font-bold text-white mb-4">Yearly Spending</h2>
            <div className="space-y-2">
              {years.map((year, idx) => {
                const val = yearlyMap[year];
                const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                const prevVal = idx > 0 ? yearlyMap[years[idx - 1]] : null;
                const change = prevVal && prevVal > 0 ? ((val - prevVal) / prevVal) * 100 : null;
                return (
                  <div key={year}>
                    {idx > 0 && change !== null && (
                      <div className="flex justify-center my-0.5">
                        <span className={`text-[10px] font-semibold tabular-nums ${change >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(0)}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-mono w-10 shrink-0">{year}</span>
                      <div className="flex-1 h-5 bg-dark-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500/50 rounded-full"
                          style={{ width: `${Math.max(2, pct)}%` }}
                        />
                      </div>
                      <span className="text-xs text-white font-mono tabular-nums w-16 text-right shrink-0">{formatMoney(val)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Procedure Breakdown with Benchmarks */}
      {procedures.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-10">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Procedure Breakdown</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Cost per claim compared to national benchmarks</p>
            {(() => {
              const topProc = procedures[0];
              const topCode = topProc?.code || '';
              const topPct = totalPaid > 0 ? ((topProc?.payments || 0) / totalPaid * 100) : 0;
              const desc = hcpcsDescription(topCode);
              const topLabel = desc ? `${topCode} (${desc})` : topCode;
              return (
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  This provider bills for {procedures.length} distinct procedure code{procedures.length !== 1 ? 's' : ''}. The top code ({topLabel}) accounts for {topPct.toFixed(0)}% of total spending.
                </p>
              );
            })()}
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
                      {(proc.description || hcpcsDescription(proc.code)) && (
                        <span className="text-[10px] text-slate-500 ml-2">{proc.description || hcpcsDescription(proc.code)}</span>
                      )}
                      <Link href={`/procedures/${proc.code}`} className="hidden lg:inline text-[10px] text-blue-400/70 hover:text-blue-400 ml-2 transition-colors">
                        See all providers &rarr;
                      </Link>
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
                        {(proc.description || hcpcsDescription(proc.code)) && (
                          <p className="text-[10px] text-slate-500 mt-0.5">{proc.description || hcpcsDescription(proc.code)}</p>
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

      {/* Similar Providers (same specialty) */}
      {similarProviders.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-10">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Similar Providers</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Other top providers in {specialty}</p>
          </div>
          <div className="divide-y divide-dark-600/50">
            {similarProviders.map((p: any) => (
              <Link key={p.npi} href={`/providers/${p.npi}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-dark-700/50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate group-hover:text-blue-400 transition-colors">{p.name || `NPI: ${p.npi}`}</p>
                  <p className="text-[10px] text-slate-500">{p.city ? `${p.city}, ` : ''}{p.state || ''}</p>
                </div>
                <p className="text-xs text-white font-bold tabular-nums shrink-0">{formatMoney(p.totalPaid)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/providers" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          &larr; All providers
        </Link>
        {(flagCount > 0 || mlScore !== null) && (
          <Link href="/watchlist" className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">
            Risk Watchlist &rarr;
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
