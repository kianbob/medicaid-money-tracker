"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney, formatNumber, riskLabel, riskColor, riskDot, riskBgColor, flagLabel, flagColor, getFlagInfo, parseFlags } from "@/lib/format";
import watchlistData from "../../../public/data/expanded-watchlist.json";
import providersData from "../../../public/data/top-providers-1000.json";

// Merge watchlist flags with provider data
function getMergedProviders() {
  const providerMap = new Map<string, any>();
  for (const p of providersData as any[]) {
    providerMap.set(p.npi, p);
  }

  return (watchlistData as any[]).map(w => {
    const provider = providerMap.get(w.npi);
    return {
      npi: w.npi,
      name: provider?.name || `NPI: ${w.npi}`,
      specialty: provider?.specialty || '',
      city: provider?.city || '',
      state: provider?.state || '',
      totalPaid: provider?.totalPaid || 0,
      totalClaims: provider?.totalClaims || 0,
      flagCount: w.flag_count,
      flags: w.flags || [],
      flagDetails: w.flag_details || {},
    };
  }).sort((a, b) => b.flagCount - a.flagCount || b.totalPaid - a.totalPaid);
}

export default function WatchlistPage() {
  const allProviders = useMemo(() => getMergedProviders(), []);
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [flagFilter, setFlagFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = allProviders;
    if (riskFilter === "critical") result = result.filter(p => p.flagCount >= 3);
    else if (riskFilter === "high") result = result.filter(p => p.flagCount === 2);
    else if (riskFilter === "moderate") result = result.filter(p => p.flagCount === 1);
    if (flagFilter !== "all") result = result.filter(p => p.flags.includes(flagFilter));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.npi.includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allProviders, riskFilter, flagFilter, search]);

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
          <span className="text-white font-semibold">{allProviders.length} Medicaid providers</span> flagged across{" "}
          <span className="text-white font-semibold">9 independent fraud detection tests</span>.
          Flags indicate statistical anomalies worth investigating &mdash; not proof of wrongdoing.
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
              We cross-referenced all {allProviders.length} flagged providers against the HHS OIG exclusion list
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
          <p className="text-[10px] text-slate-600">from 9 fraud tests</p>
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
        <div className="flex gap-2">
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

      {/* Results count */}
      <p className="text-xs text-slate-500 mb-4">
        Showing <strong className="text-white">{Math.min(visibleCount, filtered.length)}</strong> of {filtered.length} flagged providers
      </p>

      {/* Table */}
      <div className="space-y-2">
        {filtered.slice(0, visibleCount).map((p, i) => (
          <Link
            key={p.npi}
            href={`/providers/${p.npi}`}
            className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-4 py-3.5 hover:bg-dark-700 hover:border-dark-400 transition-all group"
          >
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-slate-600 w-6 text-right tabular-nums">{i + 1}</span>
              <div className={`w-2.5 h-2.5 rounded-full ${riskDot(p.flagCount)} ${p.flagCount >= 3 ? 'risk-dot-critical' : ''}`}
                title={`${riskLabel(p.flagCount)} risk`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{p.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] text-slate-500">{p.specialty ? p.specialty.substring(0, 40) : ''}</span>
                {p.city && <span className="text-[10px] text-slate-600">&middot; {p.city}, {p.state}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex flex-wrap gap-1 max-w-[200px] justify-end">
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
          <Link href="/about" className="text-slate-400 hover:text-slate-300 font-medium text-sm transition-colors">
            About this project &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
