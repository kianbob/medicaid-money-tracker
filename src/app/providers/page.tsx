"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney, formatNumber, riskDot, parseFlags, flagLabel, flagColor } from "@/lib/format";
import topProviders from "../../../public/data/top-providers-1000.json";
import smartWatchlist from "../../../public/data/smart-watchlist.json";
import mlScores from "../../../public/data/ml-scores.json";

// Build risk lookup
type RiskTier = 'Critical' | 'High' | 'Elevated' | 'ML Flag';

const riskTierConfig: Record<RiskTier, { dot: string; label: string }> = {
  'Critical': { dot: 'bg-red-500', label: 'Critical' },
  'High': { dot: 'bg-orange-500', label: 'High' },
  'Elevated': { dot: 'bg-yellow-500', label: 'Elevated' },
  'ML Flag': { dot: 'bg-purple-500', label: 'ML Flag' },
};

function buildRiskLookup(): Map<string, RiskTier> {
  const mlAll = (((mlScores as any).topProviders || []) as any[])
    .concat(((mlScores as any).smallProviderFlags || []) as any[]);
  const mlMap = new Map<string, number>(mlAll.map((p: any) => [p.npi, p.mlScore]));

  const flagMap = new Map<string, number>();
  for (const w of smartWatchlist as any[]) {
    flagMap.set(w.npi, w.flagCount || w.flags?.length || 0);
  }

  const result = new Map<string, RiskTier>();
  const allNpis = Array.from(new Set(Array.from(flagMap.keys()).concat(Array.from(mlMap.keys()))));

  for (let idx = 0; idx < allNpis.length; idx++) {
    const npi = allNpis[idx];
    const fc = flagMap.get(npi) || 0;
    const ml = mlMap.get(npi) ?? 0;
    let tier: RiskTier | null = null;
    if (fc >= 3 || (fc >= 2 && ml >= 0.7)) tier = 'Critical';
    else if (fc === 2 || (fc >= 1 && ml >= 0.7) || ml >= 0.8) tier = 'High';
    else if (fc === 1 || ml >= 0.6) tier = 'Elevated';
    else if (ml >= 0.5) tier = 'ML Flag';
    if (tier) result.set(npi, tier);
  }
  return result;
}

const riskLookup = buildRiskLookup();

export default function ProvidersPage() {
  const providers = topProviders as any[];
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [flagFilter, setFlagFilter] = useState("all");
  const [sortBy, setSortBy] = useState("spending");
  const [visibleCount, setVisibleCount] = useState(50);

  const states = useMemo(() => {
    const s = new Set<string>();
    providers.forEach(p => p.state && s.add(p.state));
    return Array.from(s).sort();
  }, [providers]);

  const filtered = useMemo(() => {
    let result = providers;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        p.npi.includes(q) ||
        (p.specialty || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q)
      );
    }
    if (stateFilter !== "all") result = result.filter(p => p.state === stateFilter);
    if (flagFilter === "flagged") result = result.filter(p => parseFlags(p.flags).length > 0);
    else if (flagFilter === "clean") result = result.filter(p => parseFlags(p.flags).length === 0);

    if (sortBy === "name") {
      result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === "claims") {
      result = [...result].sort((a, b) => (b.totalClaims || 0) - (a.totalClaims || 0));
    } else if (sortBy === "flags") {
      result = [...result].sort((a, b) => parseFlags(b.flags).length - parseFlags(a.flags).length);
    }
    // default "spending" — data is already sorted by totalPaid desc

    return result;
  }, [providers, search, stateFilter, flagFilter, sortBy]);

  const totalSpending = providers.reduce((sum: number, p: any) => sum + p.totalPaid, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Providers</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Top 1,000 Medicaid Providers</h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          The 1,000 highest-spending Medicaid providers from 2018&ndash;2024. These organizations received the most in total
          Medicaid payments, representing <span className="text-white font-semibold">{formatMoney(totalSpending)}</span>.
          Colored badges indicate fraud risk flags from our 13 statistical tests. Click any provider for their full spending profile.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by name, NPI, specialty, or city..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(50); }}
          className="flex-1 bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <select
          value={stateFilter}
          onChange={(e) => { setStateFilter(e.target.value); setVisibleCount(50); }}
          className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={flagFilter}
          onChange={(e) => { setFlagFilter(e.target.value); setVisibleCount(50); }}
          className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Providers</option>
          <option value="flagged">Flagged Only</option>
          <option value="clean">No Flags</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setVisibleCount(50); }}
          className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="spending">Highest Spending</option>
          <option value="name">Name A-Z</option>
          <option value="claims">Most Claims</option>
          <option value="flags">Most Flags</option>
        </select>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        Showing <strong className="text-white">{Math.min(visibleCount, filtered.length)}</strong> of {filtered.length} providers
      </p>

      <div className="space-y-1.5">
        {filtered.slice(0, visibleCount).map((p: any, i: number) => {
          const flags = parseFlags(p.flags);
          const tier = riskLookup.get(p.npi);
          return (
            <Link key={p.npi} href={`/providers/${p.npi}`}
              className="flex items-center gap-3 bg-dark-800 border border-dark-500/50 rounded-lg px-4 py-3 hover:bg-dark-700 hover:border-dark-400 transition-all group">
              <span className="text-xs font-bold text-slate-600 w-7 text-right tabular-nums">{i + 1}</span>
              {tier ? (
                <div className={`w-2 h-2 rounded-full shrink-0 ${riskTierConfig[tier].dot}`} title={`${riskTierConfig[tier].label} risk`} />
              ) : flags.length > 0 ? (
                <div className={`w-2 h-2 rounded-full shrink-0 ${riskDot(flags.length)}`} />
              ) : null}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                  {p.name || `NPI: ${p.npi}`}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {p.specialty ? p.specialty.substring(0, 50) : ''} {p.city ? `\u00b7 ${p.city}, ${p.state}` : ''}
                </p>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1 max-w-[220px] justify-end shrink-0">
                {flags.length <= 3 ? (
                  flags.map((f: string) => (
                    <span key={f} className={`text-[9px] px-1.5 py-0.5 rounded border ${flagColor(f)}`}>{flagLabel(f)}</span>
                  ))
                ) : (
                  <>
                    {flags.slice(0, 3).map((f: string) => (
                      <span key={f} className={`text-[9px] px-1.5 py-0.5 rounded border ${flagColor(f)}`}>{flagLabel(f)}</span>
                    ))}
                    <span className="text-[9px] text-slate-500 px-1">+{flags.length - 3} more</span>
                  </>
                )}
              </div>
              <div className="text-right shrink-0 w-20">
                <p className="text-sm text-white font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                <p className="text-[10px] text-slate-600 tabular-nums">{formatNumber(p.totalClaims)} claims</p>
              </div>
            </Link>
          );
        })}
      </div>

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
    </div>
  );
}
