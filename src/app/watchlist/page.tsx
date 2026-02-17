"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney, formatNumber, formatCpc, flagLabel, flagColor, getFlagInfo, hcpcsDescription } from "@/lib/format";
import smartWatchlist from "../../../public/data/smart-watchlist.json";
import oldWatchlist from "../../../public/data/expanded-watchlist.json";
import providersData from "../../../public/data/top-providers-1000.json";
import mlScores from "../../../public/data/ml-scores.json";
import mlProviderNames from "../../../public/data/ml-provider-names.json";

// ── Unified Risk Tiers ──────────────────────────────────────────
type UnifiedTier = 'Critical' | 'High' | 'Elevated' | 'ML Flag' | 'Low';

const TIER_ORDER: Record<UnifiedTier, number> = {
  'Critical': 0,
  'High': 1,
  'Elevated': 2,
  'ML Flag': 3,
  'Low': 4,
};

function getUnifiedTier(flagCount: number, mlScore: number | null): UnifiedTier {
  const ml = mlScore ?? 0;
  if (flagCount >= 3 || (flagCount >= 2 && ml >= 0.7)) return 'Critical';
  if (flagCount === 2 || (flagCount >= 1 && ml >= 0.7) || ml >= 0.8) return 'High';
  if (flagCount === 1 || ml >= 0.6) return 'Elevated';
  if (flagCount === 0 && ml >= 0.5) return 'ML Flag';
  return 'Low';
}

function tierDotClass(tier: UnifiedTier): string {
  switch (tier) {
    case 'Critical': return 'bg-red-500';
    case 'High': return 'bg-orange-500';
    case 'Elevated': return 'bg-yellow-500';
    case 'ML Flag': return 'bg-purple-500';
    default: return 'bg-slate-500';
  }
}

function tierTextColor(tier: UnifiedTier): string {
  switch (tier) {
    case 'Critical': return 'text-red-400';
    case 'High': return 'text-orange-400';
    case 'Elevated': return 'text-yellow-400';
    case 'ML Flag': return 'text-purple-400';
    default: return 'text-slate-400';
  }
}

// ── Build ML score & data lookup ────────────────────────────────
const mlAllProviders = (((mlScores as any).topProviders || []) as any[])
  .concat(((mlScores as any).smallProviderFlags || []) as any[]);

const mlLookup = new Map<string, number>(
  mlAllProviders.map((p: any) => [p.npi, p.mlScore])
);

const mlDataLookup = new Map<string, any>(
  mlAllProviders.map((p: any) => [p.npi, p])
);

const mlNameLookup = mlProviderNames as Record<string, string>;

// ── Merge all providers into unified watchlist ──────────────────
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
    const mlScore = mlLookup.get(w.npi) ?? null;
    const flagCount = w.flagCount || w.flags?.length || 0;
    result.push({
      npi: w.npi,
      name: w.name || provider?.name || old?.name || `NPI: ${w.npi}`,
      specialty: w.specialty || provider?.specialty || '',
      city: w.city || provider?.city || '',
      state: w.state || provider?.state || '',
      totalPaid: w.totalPaid || provider?.totalPaid || 0,
      totalClaims: provider?.totalClaims || 0,
      flagCount,
      flags: w.flags || [],
      flagDetails: w.flagDetails || {},
      source: 'smart' as const,
      mlScore,
      tier: getUnifiedTier(flagCount, mlScore),
    });
  }

  // Add old watchlist entries not already in smart
  for (const w of oldWatchlist as any[]) {
    if (seen.has(w.npi)) continue;
    seen.add(w.npi);
    const provider = providerMap.get(w.npi);
    const name = w.name || provider?.name || '';
    if (!name && !w.totalPaid && !provider?.totalPaid) continue;
    const mlScore = mlLookup.get(w.npi) ?? null;
    const flagCount = w.flag_count || w.flags?.length || 0;
    result.push({
      npi: w.npi,
      name: name || `NPI: ${w.npi}`,
      specialty: w.specialty || provider?.specialty || '',
      city: w.city || provider?.city || '',
      state: w.state || provider?.state || '',
      totalPaid: w.totalPaid || provider?.totalPaid || 0,
      totalClaims: w.totalClaims || provider?.totalClaims || 0,
      flagCount,
      flags: w.flags || [],
      flagDetails: w.flag_details || {},
      source: 'legacy' as const,
      mlScore,
      tier: getUnifiedTier(flagCount, mlScore),
    });
  }

  // Add ML-only providers (mlScore >= 0.5, no statistical flags)
  for (const mlp of mlAllProviders) {
    if (seen.has(mlp.npi)) continue;
    if (mlp.mlScore < 0.5) continue;
    seen.add(mlp.npi);
    const provider = providerMap.get(mlp.npi);
    const name = (mlp as any).name || mlNameLookup[mlp.npi] || provider?.name || `NPI: ${mlp.npi}`;
    result.push({
      npi: mlp.npi,
      name,
      specialty: (mlp as any).specialty || provider?.specialty || '',
      city: (mlp as any).city || provider?.city || '',
      state: (mlp as any).state || provider?.state || '',
      totalPaid: mlp.totalPaid || provider?.totalPaid || 0,
      totalClaims: mlp.totalClaims || provider?.totalClaims || 0,
      flagCount: 0,
      flags: [],
      flagDetails: {},
      source: 'ml' as const,
      mlScore: mlp.mlScore,
      tier: 'ML Flag' as UnifiedTier,
    });
  }

  // Default sort: tier order, then spending within tier
  return result.sort((a, b) => TIER_ORDER[a.tier as UnifiedTier] - TIER_ORDER[b.tier as UnifiedTier] || b.totalPaid - a.totalPaid);
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

type SortOption = 'risk' | 'flags' | 'spending' | 'name' | 'ml';
type TabOption = 'all' | 'stat' | 'ml';

export default function WatchlistPage() {
  const allProviders = useMemo(() => getMergedProviders(), []);
  const [activeTab, setActiveTab] = useState<TabOption>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [flagFilter, setFlagFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("risk");
  const [stateFilter, setStateFilter] = useState<string>("all");

  // Split providers by detection method
  const statProviders = useMemo(() => allProviders.filter(p => p.flagCount > 0), [allProviders]);
  const mlOnlyProviders = useMemo(() => allProviders.filter(p => p.source === 'ml'), [allProviders]);

  // Tab-filtered base list
  const tabProviders = useMemo(() => {
    if (activeTab === 'stat') return statProviders;
    if (activeTab === 'ml') return mlOnlyProviders;
    return allProviders;
  }, [activeTab, allProviders, statProviders, mlOnlyProviders]);

  // Reset filters when switching tabs
  const handleTabChange = (tab: TabOption) => {
    setActiveTab(tab);
    setRiskFilter("all");
    setFlagFilter("all");
    setSortBy(tab === 'ml' ? 'ml' : 'risk');
    setVisibleCount(50);
  };

  // Extract unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const states = Array.from(new Set(allProviders.map(p => p.state).filter(Boolean)));
    return states.sort();
  }, [allProviders]);

  const filtered = useMemo(() => {
    let result = tabProviders;
    if (riskFilter === "critical") result = result.filter(p => p.tier === 'Critical');
    else if (riskFilter === "high") result = result.filter(p => p.tier === 'High');
    else if (riskFilter === "elevated") result = result.filter(p => p.tier === 'Elevated');
    else if (riskFilter === "ml") result = result.filter(p => p.tier === 'ML Flag');
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
        result = [...result].sort((a, b) => b.flagCount - a.flagCount || b.totalPaid - a.totalPaid);
        break;
      case 'risk':
      default:
        result = [...result].sort((a, b) => TIER_ORDER[a.tier as UnifiedTier] - TIER_ORDER[b.tier as UnifiedTier] || b.totalPaid - a.totalPaid);
        break;
    }

    return result;
  }, [tabProviders, riskFilter, flagFilter, stateFilter, search, sortBy]);

  const criticalCount = allProviders.filter(p => p.tier === 'Critical').length;
  const highCount = allProviders.filter(p => p.tier === 'High').length;
  const elevatedCount = allProviders.filter(p => p.tier === 'Elevated').length;
  const mlFlagCount = allProviders.filter(p => p.tier === 'ML Flag').length;
  const totalFlaggedSpending = allProviders.reduce((sum, p) => sum + p.totalPaid, 0);

  // Count each flag type
  const flagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of tabProviders) {
      for (const f of p.flags) {
        counts[f] = (counts[f] || 0) + 1;
      }
    }
    return Object.entries(counts).sort(([, a], [, b]) => b - a);
  }, [tabProviders]);

  const [visibleCount, setVisibleCount] = useState(50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Unified Risk Watchlist</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Unified Risk Watchlist
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          <span className="text-white font-semibold">{allProviders.length} Medicaid providers</span> flagged by our combined fraud detection system.
          This view merges <span className="text-white font-semibold">13 statistical fraud tests</span> (code-specific benchmarks, billing swings, growth patterns) with a <span className="text-white font-semibold">machine learning model</span> trained
          on 514 confirmed fraud cases to produce unified risk tiers.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          These providers collectively received <span className="text-white font-semibold">{formatMoney(totalFlaggedSpending)}</span> in
          Medicaid payments. Risk tiers combine statistical flag counts with ML fraud-similarity scores.
        </p>
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

      {/* Summary Stats - Unified Tiers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Flagged</p>
          <p className="text-2xl font-bold text-white tabular-nums">{allProviders.length}</p>
          <p className="text-[10px] text-slate-600">{formatMoney(totalFlaggedSpending)} total</p>
        </div>
        <div className="bg-dark-800 border border-red-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Critical</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{criticalCount}</p>
          <p className="text-[10px] text-slate-600">3+ flags or 2 flags + high ML</p>
        </div>
        <div className="bg-dark-800 border border-orange-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">High</p>
          <p className="text-2xl font-bold text-orange-400 tabular-nums">{highCount}</p>
          <p className="text-[10px] text-slate-600">2 flags, 1 flag + high ML, or ML &ge; 80%</p>
        </div>
        <div className="bg-dark-800 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Elevated</p>
          <p className="text-2xl font-bold text-yellow-400 tabular-nums">{elevatedCount}</p>
          <p className="text-[10px] text-slate-600">1 flag or ML &ge; 60%</p>
        </div>
        <div className="bg-dark-800 border border-purple-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">ML Flag</p>
          <p className="text-2xl font-bold text-purple-400 tabular-nums">{mlFlagCount}</p>
          <p className="text-[10px] text-slate-600">ML-only detection, no stat flags</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-1 border-b border-dark-500/50">
          {([
            { key: 'all' as TabOption, label: 'All Flagged', count: allProviders.length },
            { key: 'stat' as TabOption, label: 'Statistical', count: statProviders.length },
            { key: 'ml' as TabOption, label: 'ML Detected', count: mlOnlyProviders.length },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label} <span className={`tabular-nums ${activeTab === tab.key ? 'text-slate-300' : 'text-slate-600'}`}>({tab.count.toLocaleString()})</span>
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Statistical tests and ML model flag different provider types with zero overlap &mdash;{' '}
          <Link href="/ml-analysis" className="text-blue-400 hover:text-blue-300 transition-colors">learn why</Link>
        </p>
      </div>

      {/* Flag Type Breakdown — hidden on ML tab */}
      {activeTab !== 'ml' && (
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="font-headline text-sm font-bold text-white mb-4">Fraud Tests &mdash; Flag Distribution</h2>
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
      )}

      {/* Quick Stats */}
      {(() => {
        const base = tabProviders;
        const stateCounts: Record<string, number> = {};
        for (const p of base) {
          if (p.state) stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
        }
        const topState = Object.entries(stateCounts).sort(([,a], [,b]) => b - a)[0];
        const tabSpending = base.reduce((sum, p) => sum + p.totalPaid, 0);
        const avgSpending = base.length > 0 ? tabSpending / base.length : 0;
        const topFlag = flagCounts[0];
        return (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-8 px-1 text-xs text-slate-500">
            {topState && (
              <span>Most common state: <strong className="text-white font-semibold">{topState[0]}</strong> ({topState[1]} providers)</span>
            )}
            <span>Avg spending: <strong className="text-white font-semibold">{formatMoney(avgSpending)}</strong></span>
            {activeTab !== 'ml' && topFlag && (
              <span>Most common flag: <strong className="text-white font-semibold">{getFlagInfo(topFlag[0]).label}</strong> ({topFlag[1]})</span>
            )}
          </div>
        );
      })()}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by name, NPI, state, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {activeTab !== 'ml' && (
        <div className="flex gap-2 flex-wrap">
          {([
            { key: "all", label: "All", count: tabProviders.length },
            { key: "critical", label: "Critical", count: tabProviders.filter(p => p.tier === 'Critical').length, color: "red" },
            { key: "high", label: "High", count: tabProviders.filter(p => p.tier === 'High').length, color: "orange" },
            { key: "elevated", label: "Elevated", count: tabProviders.filter(p => p.tier === 'Elevated').length, color: "yellow" },
            ...(activeTab === 'all' ? [{ key: "ml", label: "ML Flag", count: mlFlagCount, color: "purple" }] : []),
          ] as { key: string; label: string; count: number; color?: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setRiskFilter(f.key)}
              className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
                riskFilter === f.key
                  ? f.key === 'ml' ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                  : f.key === 'critical' ? 'bg-red-500/15 border-red-500/30 text-red-400'
                  : f.key === 'high' ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                  : f.key === 'elevated' ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
                  : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                  : 'border-dark-500 text-slate-400 hover:border-dark-400'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        )}
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
            <option value="risk">Risk Level</option>
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
            const headers = ['NPI', 'Name', 'City', 'State', 'Specialty', 'Total Paid', 'Total Claims', 'Cost Per Claim', 'Flag Count', 'Flags', 'Unified Risk Tier', 'ML Score'];
            const rows = filtered.map(p => {
              const cpc = p.totalClaims > 0 ? (p.totalPaid / p.totalClaims).toFixed(2) : '';
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
                p.tier,
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

      {/* Provider List */}
      <div className="space-y-2">
        {filtered.slice(0, visibleCount).map((p, i) => (
          <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl hover:bg-dark-700 hover:border-dark-400 transition-all">
            <Link
              href={`/providers/${p.npi}`}
              className="flex items-center gap-4 px-4 py-3.5 group"
            >
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-600 w-6 text-right tabular-nums">{i + 1}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${tierDotClass(p.tier)} ${p.tier === 'Critical' ? 'risk-dot-critical' : ''}`}
                  title={`${p.tier} risk`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{p.name}</p>
                  {activeTab !== 'ml' && p.mlScore != null && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      p.mlScore >= 0.8 ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                      p.mlScore >= 0.6 ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' :
                      'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
                    }`}>
                      ML {(p.mlScore * 100).toFixed(0)}%
                    </span>
                  )}
                  {activeTab !== 'ml' && p.source === 'ml' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-purple-500/15 border-purple-500/30 text-purple-400">
                      ML Only
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] text-slate-500">{p.specialty ? p.specialty.substring(0, 40) : ''}</span>
                  {p.city && <span className="text-[10px] text-slate-600">&middot; {p.city}, {p.state}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {activeTab === 'ml' ? (
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="text-right">
                      <p className={`text-lg font-bold tabular-nums ${
                        (p.mlScore ?? 0) >= 0.8 ? 'text-red-400' :
                        (p.mlScore ?? 0) >= 0.6 ? 'text-orange-400' : 'text-yellow-400'
                      }`}>{p.mlScore != null ? (p.mlScore * 100).toFixed(1) : '?'}%</p>
                      <p className="text-[10px] text-slate-500">ML Score</p>
                    </div>
                  </div>
                ) : (
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
                )}
                <div className="text-right">
                  <p className="text-sm text-white font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                  <p className={`text-[10px] font-semibold ${tierTextColor(p.tier)}`}>{p.tier.toUpperCase()}</p>
                </div>
              </div>
            </Link>
            {/* Flag details for smart watchlist entries */}
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
            {/* ML Detection card for ML-only providers */}
            {p.source === 'ml' && (() => {
              const mlData = mlDataLookup.get(p.npi);
              return (
                <div className="px-4 pb-3 -mt-1">
                  <div className="bg-purple-500/8 border border-purple-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <span className="text-xs font-semibold text-purple-400">ML Detection</span>
                      <span className="text-xs font-bold text-purple-300 ml-auto">{p.mlScore != null ? (p.mlScore * 100).toFixed(1) : '?'}% fraud similarity</span>
                    </div>
                    {mlData && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                        <span className="text-[10px] text-slate-400">Active months: <strong className="text-white">{mlData.activeMonths}</strong></span>
                        <span className="text-[10px] text-slate-400">Self-billing ratio: <strong className="text-white">{(mlData.selfBillingRatio * 100).toFixed(0)}%</strong></span>
                        <span className="text-[10px] text-slate-400">Top code concentration: <strong className="text-white">{(mlData.topCodeConcentration * 100).toFixed(0)}%</strong></span>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500">
                      Flagged by ML pattern matching against 514 confirmed fraud cases. No individual statistical test triggered.
                    </p>
                  </div>
                </div>
              );
            })()}
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

      {/* Disclaimer */}
      <div className="mt-10 bg-dark-800 border border-slate-500/20 rounded-xl p-4">
        <p className="text-xs text-slate-400 leading-relaxed text-center">
          Statistical flags and ML scores identify unusual patterns worth investigating &mdash; not proof of fraud or wrongdoing. Many flagged providers may have legitimate explanations for their billing patterns.
        </p>
      </div>

      {/* Bottom Links */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-slate-500 text-xs">Want to understand how we identified these providers?</p>
        <div className="flex justify-center gap-4">
          <Link href="/analysis" className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
            Fraud analysis methodology &rarr;
          </Link>
          <Link href="/about" className="text-slate-400 hover:text-slate-300 font-medium text-sm transition-colors">
            About this project &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
