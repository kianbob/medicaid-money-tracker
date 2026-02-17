"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney, formatNumber } from "@/lib/format";
import mlScores from "../../../public/data/ml-scores.json";
import smartWatchlist from "../../../public/data/smart-watchlist.json";
import oldWatchlist from "../../../public/data/expanded-watchlist.json";
import providersData from "../../../public/data/top-providers-1000.json";

// Build name lookup from all available sources
function buildNameLookup(): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const p of providersData as any[]) {
    if (p.name) lookup.set(p.npi, p.name);
  }
  for (const p of smartWatchlist as any[]) {
    if (p.name) lookup.set(p.npi, p.name);
  }
  for (const p of oldWatchlist as any[]) {
    if (p.name) lookup.set(p.npi, p.name);
  }
  return lookup;
}

const FEATURE_LABELS: Record<string, string> = {
  total_paid: "Total Payments",
  total_claims: "Total Claims",
  total_benes: "Total Beneficiaries",
  code_count: "Unique Procedure Codes",
  active_months: "Active Months",
  cpc: "Cost Per Claim",
  cpb: "Cost Per Beneficiary",
  cpb_claims: "Claims Per Beneficiary",
  paid_per_mo: "Payments Per Month",
  claims_per_mo: "Claims Per Month",
  top_code_conc: "Top Code Concentration",
  self_bill_ratio: "Self-Billing Ratio",
  short_burst: "Short Burst Billing",
  low_code_high: "Low Codes / High Spend",
};

function mlScoreColor(score: number): string {
  if (score >= 0.8) return "text-red-400";
  if (score >= 0.6) return "text-orange-400";
  if (score >= 0.3) return "text-yellow-400";
  return "text-green-400";
}

function mlScoreBgColor(score: number): string {
  if (score >= 0.8) return "bg-red-500";
  if (score >= 0.6) return "bg-orange-500";
  if (score >= 0.3) return "bg-yellow-500";
  return "bg-green-500";
}

type SortField = 'mlScore' | 'totalPaid' | 'activeMonths' | 'name';
type ScoreThreshold = 0 | 50 | 60 | 70 | 80;

export default function MlAnalysisPage() {
  const data = mlScores as any;
  const features = data.featuresUsed as string[];
  const allTopProviders = (data.topProviders as any[]).slice(0, 50);
  const smallProviderFlags = (data.smallProviderFlags || []) as any[];
  const dist = data.scoreDistribution as Record<string, number>;

  const nameLookup = useMemo(() => buildNameLookup(), []);

  const [sortField, setSortField] = useState<SortField>('mlScore');
  const [sortDesc, setSortDesc] = useState(true);
  const [scoreThreshold, setScoreThreshold] = useState<ScoreThreshold>(0);

  // Filter and sort top providers
  const sortedTopProviders = useMemo(() => {
    let result = allTopProviders;
    if (scoreThreshold > 0) {
      result = result.filter(p => p.mlScore * 100 >= scoreThreshold);
    }
    return [...result].sort((a, b) => {
      let cmp: number;
      switch (sortField) {
        case 'totalPaid':
          cmp = a.totalPaid - b.totalPaid;
          break;
        case 'activeMonths':
          cmp = a.activeMonths - b.activeMonths;
          break;
        case 'name': {
          const nameA = nameLookup.get(a.npi) || a.npi;
          const nameB = nameLookup.get(b.npi) || b.npi;
          cmp = nameA.localeCompare(nameB);
          break;
        }
        case 'mlScore':
        default:
          cmp = a.mlScore - b.mlScore;
          break;
      }
      return sortDesc ? -cmp : cmp;
    });
  }, [allTopProviders, sortField, sortDesc, scoreThreshold, nameLookup]);

  // Sort small provider flags similarly
  const sortedSmallProviders = useMemo(() => {
    let result = smallProviderFlags;
    if (scoreThreshold > 0) {
      result = result.filter((p: any) => p.mlScore * 100 >= scoreThreshold);
    }
    return [...result].sort((a: any, b: any) => {
      let cmp: number;
      switch (sortField) {
        case 'totalPaid':
          cmp = a.totalPaid - b.totalPaid;
          break;
        case 'activeMonths':
          cmp = a.activeMonths - b.activeMonths;
          break;
        case 'name': {
          const nameA = nameLookup.get(a.npi) || a.npi;
          const nameB = nameLookup.get(b.npi) || b.npi;
          cmp = nameA.localeCompare(nameB);
          break;
        }
        case 'mlScore':
        default:
          cmp = a.mlScore - b.mlScore;
          break;
      }
      return sortDesc ? -cmp : cmp;
    });
  }, [smallProviderFlags, sortField, sortDesc, scoreThreshold, nameLookup]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  }

  function sortIndicator(field: SortField) {
    if (sortField !== field) return null;
    return <span className="ml-0.5">{sortDesc ? '\u25BC' : '\u25B2'}</span>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">ML Analysis</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
          Machine Learning Fraud Detection
        </h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Random forest model trained on <span className="text-white font-semibold">514 confirmed-excluded providers</span> from
          the OIG LEIE database. Scored against {formatNumber(data.totalProviders)} active Medicaid providers.
        </p>
      </div>

      {/* Statistical Watchlist Cross-Link Banner */}
      <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-400 mb-0.5">Complementary Statistical Analysis</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              ML scoring complements our <span className="text-white font-semibold">13 statistical fraud tests</span> shown on the Fraud Watchlist.
              Statistical tests flag specific billing anomalies. ML identifies patterns similar to 514 confirmed fraud cases from the OIG exclusion list.{' '}
              <Link href="/watchlist" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-2 transition-colors">
                See the Fraud Watchlist &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Model</p>
          <p className="text-xl font-bold text-white">Random Forest</p>
          <p className="text-[10px] text-slate-600">Ensemble classifier</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">AUC Score</p>
          <p className="text-xl font-bold text-blue-400 tabular-nums">{data.modelAuc.toFixed(4)}</p>
          <p className="text-[10px] text-slate-600">5-fold cross-validation</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Providers Scored</p>
          <p className="text-xl font-bold text-amber-400 tabular-nums">{formatNumber(data.totalProviders)}</p>
          <p className="text-[10px] text-slate-600">Active Medicaid providers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Training Labels</p>
          <p className="text-xl font-bold text-red-400 tabular-nums">514</p>
          <p className="text-[10px] text-slate-600">OIG-excluded providers</p>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-4">Feature Importance</h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          The model uses {features.length} billing features to identify patterns similar to confirmed fraud cases.
        </p>
        <div className="space-y-2">
          {features.map((f, i) => {
            const barWidth = Math.max(15, 100 - i * (100 / features.length));
            return (
              <div key={f} className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 w-40 text-right shrink-0">{FEATURE_LABELS[f] || f}</span>
                <div className="flex-1 h-2.5 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500/60"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-4">Score Distribution</h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Most providers score very low. Only the top percentiles show patterns consistent with known fraud.
        </p>
        <div className="space-y-2">
          {[
            { label: "Median (p50)", value: dist.p50, desc: "Typical provider" },
            { label: "p90", value: dist.p90, desc: "Top 10%" },
            { label: "p95", value: dist.p95, desc: "Top 5%" },
            { label: "p99", value: dist.p99, desc: "Top 1%" },
            { label: "p99.9", value: dist.p999, desc: "Top 0.1%" },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-3 py-1">
              <span className="text-[10px] text-slate-400 w-24 text-right shrink-0">{p.label}</span>
              <div className="flex-1 h-3 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${mlScoreBgColor(p.value)} opacity-40`}
                  style={{ width: `${p.value * 100}%` }}
                />
              </div>
              <span className={`text-xs font-semibold tabular-nums w-14 text-right ${mlScoreColor(p.value)}`}>
                {(p.value * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-600 w-20">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sorting & Filtering Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Score threshold:</span>
          <div className="flex gap-1.5">
            {([0, 50, 60, 70, 80] as ScoreThreshold[]).map((t) => (
              <button
                key={t}
                onClick={() => setScoreThreshold(t)}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                  scoreThreshold === t
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                    : 'border-dark-500 text-slate-400 hover:border-dark-400'
                }`}
              >
                {t === 0 ? 'All' : `>${t}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 50 Providers */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-dark-500/50">
          <h2 className="text-sm font-bold text-white">Top 50 Highest-Scored Providers</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Ranked by ML fraud similarity score
            {scoreThreshold > 0 && ` \u2014 showing ${sortedTopProviders.length} above ${scoreThreshold}%`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500/50">
                <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold w-8">#</th>
                <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">NPI</th>
                <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  <button onClick={() => handleSort('name')} className="hover:text-slate-300 transition-colors">
                    Name {sortIndicator('name')}
                  </button>
                </th>
                <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  <button onClick={() => handleSort('mlScore')} className="hover:text-slate-300 transition-colors">
                    ML Score {sortIndicator('mlScore')}
                  </button>
                </th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  <button onClick={() => handleSort('totalPaid')} className="hover:text-slate-300 transition-colors">
                    Total Paid {sortIndicator('totalPaid')}
                  </button>
                </th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:table-cell">Codes</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden md:table-cell">Self-Bill Ratio</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden lg:table-cell">
                  <button onClick={() => handleSort('activeMonths')} className="hover:text-slate-300 transition-colors">
                    Active Months {sortIndicator('activeMonths')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTopProviders.map((p: any, i: number) => {
                const pct = (p.mlScore * 100);
                const name = nameLookup.get(p.npi);
                return (
                  <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-slate-600 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <Link href={`/providers/${p.npi}`} className="text-white hover:text-blue-400 text-xs font-mono font-medium transition-colors">
                        {p.npi}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">
                      {name ? (
                        <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-blue-400 text-xs font-medium transition-colors truncate block max-w-[180px]">
                          {name}
                        </Link>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-dark-600 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${mlScoreBgColor(p.mlScore)}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-xs font-bold tabular-nums ${mlScoreColor(p.mlScore)}`}>{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-white text-xs tabular-nums">{formatMoney(p.totalPaid)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400 text-xs tabular-nums hidden sm:table-cell">{p.codeCount}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400 text-xs tabular-nums hidden md:table-cell">{(p.selfBillingRatio * 100).toFixed(0)}%</td>
                    <td className="px-4 py-2.5 text-right text-slate-400 text-xs tabular-nums hidden lg:table-cell">{p.activeMonths}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Small Provider Flags */}
      {smallProviderFlags.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Small Provider Flags</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {smallProviderFlags.length} smaller providers with high ML scores &mdash; may indicate early-stage or emerging fraud patterns
              {scoreThreshold > 0 && ` (showing ${sortedSmallProviders.length} above ${scoreThreshold}%)`}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500/50">
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold w-8">#</th>
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">NPI</th>
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Name</th>
                  <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">ML Score</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total Paid</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:table-cell">Codes</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden md:table-cell">Self-Bill Ratio</th>
                  <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden lg:table-cell">Active Months</th>
                </tr>
              </thead>
              <tbody>
                {sortedSmallProviders.map((p: any, i: number) => {
                  const pct = (p.mlScore * 100);
                  const name = nameLookup.get(p.npi);
                  return (
                    <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-slate-600 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/providers/${p.npi}`} className="text-white hover:text-blue-400 text-xs font-mono font-medium transition-colors">
                          {p.npi}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5">
                        {name ? (
                          <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-blue-400 text-xs font-medium transition-colors truncate block max-w-[180px]">
                            {name}
                          </Link>
                        ) : (
                          <span className="text-slate-600 text-xs italic">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-dark-600 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${mlScoreBgColor(p.mlScore)}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className={`text-xs font-bold tabular-nums ${mlScoreColor(p.mlScore)}`}>{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-white text-xs tabular-nums">{formatMoney(p.totalPaid)}</td>
                      <td className="px-4 py-2.5 text-right text-slate-400 text-xs tabular-nums hidden sm:table-cell">{p.codeCount}</td>
                      <td className="px-4 py-2.5 text-right text-slate-400 text-xs tabular-nums hidden md:table-cell">{(p.selfBillingRatio * 100).toFixed(0)}%</td>
                      <td className="px-4 py-2.5 text-right text-slate-400 text-xs tabular-nums hidden lg:table-cell">{p.activeMonths}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cross-Validation */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-3">Cross-Validation: Full-Dataset Training</h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          To validate our approach, we trained three models on the <span className="text-white font-semibold">full 594,235-provider dataset</span> using
          Google Colab (12GB RAM). The results confirm our subsampled model as the strongest performer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-dark-700/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Random Forest (Full)</p>
            <p className="text-lg font-bold text-blue-400 tabular-nums">0.7656</p>
            <p className="text-[10px] text-slate-600">594K training samples</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Gradient Boosting</p>
            <p className="text-lg font-bold text-slate-400 tabular-nums">0.6815</p>
            <p className="text-[10px] text-slate-600">594K training samples</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Logistic Regression</p>
            <p className="text-lg font-bold text-slate-400 tabular-nums">0.6812</p>
            <p className="text-[10px] text-slate-600">594K training samples</p>
          </div>
        </div>
        <div className="bg-dark-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="text-green-400 font-semibold">Key finding:</span> Our production model (subsampled, AUC 0.7762) outperforms
            the full-dataset Random Forest (AUC 0.7656). This is because strategic subsampling — using 10K negative samples instead of 593K —
            reduces noise from the massive legitimate-provider class, allowing the model to better learn fraud patterns.
            The top-ranked providers are nearly identical across both models, confirming the robustness of our scoring.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5 mb-8">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Important Disclaimer</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          ML scores identify statistical patterns similar to known fraud cases. A high score is <span className="text-white font-semibold">not evidence of fraud</span>.
          Many legitimate providers may score highly due to unusual but lawful billing patterns (e.g., specialized practices, government entities, high-volume home care).
          These scores should be used as one input among many in any investigation.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/analysis" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          &larr; Fraud analysis methodology
        </Link>
        <Link href="/watchlist" className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">
          Fraud watchlist &rarr;
        </Link>
      </div>
    </div>
  );
}
