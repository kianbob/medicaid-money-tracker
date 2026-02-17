"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney, formatNumber, formatCpc, riskLabel, riskColor, riskDot, riskBgColor, flagLabel, flagColor, getFlagInfo, parseFlags, hcpcsDescription } from "@/lib/format";
import smartWatchlist from "../../../public/data/smart-watchlist.json";
import oldWatchlist from "../../../public/data/expanded-watchlist.json";
import providersData from "../../../public/data/top-providers-1000.json";
import mlScores from "../../../public/data/ml-scores.json";

// Build ML score lookup from both topProviders and smallProviderFlags
const mlLookup = new Map(
  (((mlScores as any).topProviders || []) as any[])
    .concat(((mlScores as any).smallProviderFlags || []) as any[])
    .map((p: any) => [p.npi, p.mlScore])
);

// Merge smart watchlist (primary) with old watchlist
function getMergedProviders() {
  const seen = new Set<string>();
  const result: any[] = [];
  const providerMap = new Map<string, any>();
  for (const p of providersData as any[]) {
    providerMap.set(p.npi, p);
  }

  // Build old watchlist lookup for fallback data
  const oldMap = new Map<string, any>();
  for (const w of oldWatchlist as any[]) {
    oldMap.set(w.npi, w);
  }

  // Smart watchlist first (primary)
  for (const w of smartWatchlist as any[]) {
    seen.add(w.npi);
    const provider = providerMap.get(w.npi);
    const old = oldMap.get(w.npi);
    result.push({
      npi: w.npi,
      name: w.name || provider?.name || old?.name || `NPI: ${w.npi}`,
      specialty: w.specialty || provider?.specialty || '',
      city: w.city || provider?.city || '',
      state: w.state || provider?.state || '',
      totalPaid: w.totalPaid || provider?.totalPaid || 0,
      totalClaims: provider?.totalClaims || 0,
      flagCount: w.flagCount || w.flags?.length || 0,
      flags: w.flags || [],
      flagDetails: w.flagDetails || {},
      source: 'smart',
      mlScore: mlLookup.get(w.npi) ?? null,
    });
  }

  // Add old watchlist entries not already in smart
  for (const w of oldWatchlist as any[]) {
    if (seen.has(w.npi)) continue;
    seen.add(w.npi);
    const provider = providerMap.get(w.npi);
    const name = w.name || provider?.name || '';
    // Skip entries with no name and no spending data
    if (!name && !w.totalPaid && !provider?.totalPaid) continue;
    result.push({
      npi: w.npi,
      name: name || `NPI: ${w.npi}`,
      specialty: w.specialty || provider?.specialty || '',
      city: w.city || provider?.city || '',
      state: w.state || provider?.state || '',
      totalPaid: w.totalPaid || provider?.totalPaid || 0,
      totalClaims: w.totalClaims || provider?.totalClaims || 0,
      flagCount: w.flag_count || w.flags?.length || 0,
      flags: w.flags || [],
      flagDetails: w.flag_details || {},
      source: 'legacy',
      mlScore: mlLookup.get(w.npi) ?? null,
    });
  }

  return result.sort((a, b) => b.flagCount - a.flagCount || b.totalPaid - a.totalPaid);
}

function formatFlagDetail(flag: string, details: any): string {
  if (!details) return '';
  switch (flag) {
    case 'code_specific_outlier': {
      const desc = hcpcsDescription(details.code);
      return `${details.code}${desc ? ` (${desc})` : ''}: ${formatCpc(details.providerCpc)}/claim vs ${formatCpc(details.nationalMedianCpc)} median (${details.ratio?.toFixed(1)}\u00d7)`;
    }
    case 'billing_swing':
      return `${formatMoney(details.fromPay)} (${details.fromYear}) \u2192 ${formatMoney(details.toPay)} (${details.toYear}), ${details.pctChange?.toFixed(0)}% change`;
    case 'massive_new_entrant':
      return `First appeared ${details.firstMonth || details.firstYear}, ${formatMoney(details.totalPaid)} total, ${formatMoney(details.avgMonthlyBilling)}/mo`;
    case 'rate_outlier_multi_code': {
      const codes = (details.topOutlierCodes || []).slice(0, 3).map((c: any) => `${c.code} (${c.ratio?.toFixed(1)}\u00d7)`).join(', ');
      return `${details.codesAboveP90} codes above p90${codes ? `: ${codes}` : ''}`;
    }
    default:
      return '';
  }
}

type SortOption = 'flags' | 'spending' | 'name' | 'ml';

export default function WatchlistPage() {
  const allProviders = useMemo(() => getMergedProviders(), []);
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [flagFilter, setFlagFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("flags");
  const [stateFilter, setStateFilter] = useState<string>("all");

  // Extract unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const states = Array.from(new Set(allProviders.map(p => p.state).filter(Boolean)));
    return states.sort();
  }, [allProviders]);

  const filtered = useMemo(() => {
    let result = allProviders;
    if (riskFilter === "critical") result = result.filter(p => p.flagCount >= 3);
    else if (riskFilter === "high") result = result.filter(p => p.flagCount === 2);
    else if (riskFilter === "moderate") result = result.filter(p => p.flagCount === 1);
    if (flagFilter !== "all") result = result.filter(p => p.flags.includes(flagFilter));
    if (stateFilter !== "all") result = result.filter(p => p.state === stateFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.npi.includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'spending':
        result = [...result].sort((a, b) => b.totalPaid - a.totalPaid);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'ml':
        result = [...result].sort((a, b) => (b.mlScore ?? -1) - (a.mlScore ?? -1));
        break;
      case 'flags':
      default:
        result = [...result].sort((a, b) => b.flagCount - a.flagCount || b.totalPaid - a.totalPaid);
        break;
    }

    return result;
  }, [allProviders, riskFilter, flagFilter, stateFilter, search, sortBy]);

  const smartCount = allProviders.filter(p => p.source === 'smart').length;
  const criticalCount = allProviders.filter(p => p.flagCount >= 3).length;
  const highCount = allProviders.filter(p => p.flagCount === 2).length;
  const moderateCount = allProviders.filter(p => p.flagCount === 1).length;
  const totalFlaggedSpending = allProviders.reduce((sum, p) => sum + p.totalPaid, 0);

  // Count each flag type
  const flagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProviders) {
      for (const f of p.flags) {
        counts[f] = (counts[f] || 0) + 1;
      }
    }
    return Object.entries(counts).sort(([, a], [, b]) => b - a);
  }, [allProviders]);

  const [visibleCount, setVisibleCount] = useState(50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Fraud Watchlist</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Fraud Watchlist
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          <span className="text-white font-semibold">{allProviders.length} Medicaid providers</span> flagged by our fraud detection analysis.
          The primary watchlist uses <span className="text-white font-semibold">code-specific benchmarks</span> to compare
          each provider&apos;s billing against the national median for that exact procedure code.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          These {allProviders.length} providers collectively received <span className="text-white font-semibold">{formatMoney(totalFlaggedSpending)}</span> in
          Medicaid payments &mdash; flagged across {smartCount} code-specific and {allProviders.length - smartCount} legacy analyses.
        </p>
      </div>

      {/* ML Analysis Cross-Link Banner */}
      <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-400 mb-0.5">Complementary ML Analysis Available</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              This watchlist uses <span className="text-white font-semibold">13 statistical fraud tests</span> to flag specific billing anomalies.
              We also trained a <span className="text-white font-semibold">machine learning model</span> on 514 confirmed fraud cases
              to identify broader fraud patterns.{' '}
              <Link href="/ml-analysis" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors">
                See ML Analysis for AI-scored providers &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OIG Banner */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 mb-8" role="alert">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
            <span className="text-amber-400 text-sm">!</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-400 mb-0.5">OIG Cross-Reference: Zero Matches</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              We cross-referenced all flagged providers against the HHS OIG exclusion list
              (82,715 excluded providers). <strong className="text-white">None appear on the list</strong> &mdash; suggesting
              our analysis surfaces new, uninvestigated suspicious activity.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Flagged Providers</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{allProviders.length}</p>
          <p className="text-[10px] text-slate-600">{smartCount} from code-specific analysis</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Spending</p>
          <p className="text-2xl font-bold text-white tabular-nums">{formatMoney(totalFlaggedSpending)}</p>
          <p className="text-[10px] text-slate-600">flagged provider volume</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Critical Risk</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{criticalCount}</p>
          <p className="text-[10px] text-slate-600">3+ flags</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">High Risk</p>
          <p className="text-2xl font-bold text-amber-400 tabular-nums">{highCount}</p>
          <p className="text-[10px] text-slate-600">2 flags</p>
        </div>
      </div>

      {/* Flag Type Breakdown */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-4">Fraud Tests &mdash; Flag Distribution</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {flagCounts.map(([flag, count]) => {
            const info = getFlagInfo(flag);
            return (
              <button
                key={flag}
                onClick={() => setFlagFilter(flagFilter === flag ? "all" : flag)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                  flagFilter === flag ? info.bgColor + ' ' + info.color : 'border-dark-500/50 hover:border-dark-400'
                }`}
              >
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${flagFilter === flag ? '' : info.color}`}>{info.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{info.description}</p>
                </div>
                <span className="text-sm font-bold text-slate-300 tabular-nums ml-2 shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by name, NPI, state, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All", count: allProviders.length },
            { key: "critical", label: "Critical", count: criticalCount },
            { key: "high", label: "High", count: highCount },
            { key: "moderate", label: "Moderate", count: moderateCount },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setRiskFilter(f.key)}
              className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
                riskFilter === f.key
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                  : 'border-dark-500 text-slate-400 hover:border-dark-400'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Sort & State Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-slate-500 whitespace-nowrap">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="flags">Most Flags First</option>
            <option value="spending">Highest Spending</option>
            <option value="name">Name A-Z</option>
            <option value="ml">ML Score</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="state-select" className="text-xs text-slate-500 whitespace-nowrap">State:</label>
          <select
            id="state-select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">All States</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count + Export */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">
          Showing <strong className="text-white">{Math.min(visibleCount, filtered.length)}</strong> of {filtered.length} flagged providers
        </p>
        <button
          onClick={() => {
            const headers = ['NPI', 'Name', 'City', 'State', 'Specialty', 'Total Paid', 'Total Claims', 'Cost Per Claim', 'Flag Count', 'Flags', 'Risk Level', 'ML Score'];
            const rows = filtered.map(p => {
              const cpc = p.totalClaims > 0 ? (p.totalPaid / p.totalClaims).toFixed(2) : '';
              const risk = p.flagCount >= 3 ? 'CRITICAL' : p.flagCount >= 2 ? 'HIGH' : p.flagCount >= 1 ? 'MODERATE' : 'LOW';
              return [
                p.npi,
                `"${(p.name || '').replace(/"/g, '""')}"`,
                `"${(p.city || '').replace(/"/g, '""')}"`,
                p.state,
                `"${(p.specialty || '').replace(/"/g, '""')}"`,
                p.totalPaid.toFixed(2),
                p.totalClaims || '',
                cpc,
                p.flagCount,
                `"${p.flags.join('; ')}"`,
                risk,
                p.mlScore != null ? (p.mlScore * 100).toFixed(1) + '%' : '',
              ].join(',');
            });
            const csv = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'medicaid-watchlist.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="space-y-2">
        {filtered.slice(0, visibleCount).map((p, i) => (
          <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl hover:bg-dark-700 hover:border-dark-400 transition-all">
            <Link
              href={`/providers/${p.npi}`}
              className="flex items-center gap-4 px-4 py-3.5 group"
            >
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-600 w-6 text-right tabular-nums">{i + 1}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${riskDot(p.flagCount)} ${p.flagCount >= 3 ? 'risk-dot-critical' : ''}`}
                  title={`${riskLabel(p.flagCount)} risk`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{p.name}</p>
                  {p.mlScore != null && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      p.mlScore >= 0.8 ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                      p.mlScore >= 0.6 ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' :
                      'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
                    }`}>
                      ML {(p.mlScore * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] text-slate-500">{p.specialty ? p.specialty.substring(0, 40) : ''}</span>
                  {p.city && <span className="text-[10px] text-slate-600">&middot; {p.city}, {p.state}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex flex-wrap gap-1 max-w-[220px] justify-end">
                  {p.flags.slice(0, 3).map((f: string) => (
                    <span key={f} className={`text-[10px] px-1.5 py-0.5 rounded border ${flagColor(f)}`}>
                      {flagLabel(f)}
                    </span>
                  ))}
                  {p.flags.length > 3 && (
                    <span className="text-[10px] text-slate-500">+{p.flags.length - 3}</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-white font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                  <p className={`text-[10px] font-semibold ${riskColor(p.flagCount)}`}>{riskLabel(p.flagCount)}</p>
                </div>
              </div>
            </Link>
            {/* Expanded flag details for smart watchlist entries */}
            {p.source === 'smart' && p.flags.some((f: string) => formatFlagDetail(f, p.flagDetails[f])) && (
              <div className="px-4 pb-3 -mt-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {p.flags.map((f: string) => {
                    const detail = formatFlagDetail(f, p.flagDetails[f]);
                    if (!detail) return null;
                    const info = getFlagInfo(f);
                    return (
                      <p key={f} className="text-[10px] text-slate-500">
                        <span className={`font-semibold ${info.color}`}>{info.label}:</span> {detail}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < filtered.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 50)}
            className="bg-dark-700 hover:bg-dark-600 text-white font-medium px-8 py-3 rounded-lg border border-dark-500 transition-all text-sm"
          >
            Show More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Bottom Links */}
      <div className="mt-10 text-center space-y-2">
        <p className="text-slate-500 text-xs">Want to understand how we identified these providers?</p>
        <div className="flex justify-center gap-4">
          <Link href="/analysis" className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
            Fraud analysis methodology &rarr;
          </Link>
          <Link href="/ml-analysis" className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
            ML Analysis &rarr;
          </Link>
          <Link href="/about" className="text-slate-400 hover:text-slate-300 font-medium text-sm transition-colors">
            About this project &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
