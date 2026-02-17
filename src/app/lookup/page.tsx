"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney } from "@/lib/format";
import topProviders from "../../../public/data/top-providers-1000.json";
import smartWatchlist from "../../../public/data/smart-watchlist.json";

const watchlistNpis = new Set((smartWatchlist as any[]).map((w: any) => w.npi));

const allProviders: any[] = (() => {
  const byNpi = new Map<string, any>();
  for (const p of topProviders as any[]) {
    byNpi.set(p.npi, { npi: p.npi, name: p.name, city: p.city, state: p.state, totalPaid: p.totalPaid, flagged: watchlistNpis.has(p.npi) });
  }
  for (const w of smartWatchlist as any[]) {
    if (!byNpi.has(w.npi)) {
      byNpi.set(w.npi, { npi: w.npi, name: w.name, city: w.city, state: w.state, totalPaid: w.totalPaid, flagged: true });
    } else {
      byNpi.get(w.npi)!.flagged = true;
    }
  }
  return Array.from(byNpi.values());
})();

const recentlyFlagged = (smartWatchlist as any[])
  .slice()
  .sort((a: any, b: any) => b.totalPaid - a.totalPaid)
  .slice(0, 10);

export default function LookupPage() {
  const [query, setQuery] = useState("");

  const isNpi = /^\d{10}$/.test(query.trim());
  const trimmed = query.trim();

  const results = useMemo(() => {
    if (!trimmed || isNpi) return [];
    const q = trimmed.toLowerCase();
    return allProviders
      .filter((p) => (p.name || "").toLowerCase().includes(q))
      .sort((a, b) => b.totalPaid - a.totalPaid)
      .slice(0, 20);
  }, [trimmed, isNpi]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Provider Lookup
        </h1>
        <p className="text-slate-400 text-lg">
          Search any of 1,800+ providers by NPI number or name
        </p>
      </div>

      {/* Search Box */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter an NPI number or provider name"
          className="w-full pl-14 pr-5 py-5 text-lg bg-dark-800 border-2 border-dark-500/50 focus:border-blue-500 rounded-2xl text-white placeholder-slate-500 outline-none transition-colors"
          autoFocus
        />
      </div>

      {/* NPI Direct Link */}
      {isNpi && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">NPI Number</p>
              <p className="text-white text-xl font-mono font-semibold">{trimmed}</p>
            </div>
            <Link
              href={`/providers/${trimmed}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            >
              Go to Provider
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Name Search Results */}
      {trimmed && !isNpi && results.length > 0 && (
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-3">
            {results.length === 20 ? "Showing top 20 results" : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </p>
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden divide-y divide-dark-500/30">
            {results.map((p) => (
              <Link
                key={p.npi}
                href={`/providers/${p.npi}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-dark-700/50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                      {p.name}
                    </span>
                    {p.flagged && (
                      <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20">
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    NPI {p.npi} &middot; {p.city}, {p.state}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-semibold text-slate-300 tabular-nums">
                    {formatMoney(p.totalPaid)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {trimmed && !isNpi && results.length === 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-8 text-center mb-8">
          <p className="text-slate-400">No providers found matching &ldquo;{trimmed}&rdquo;</p>
          <p className="text-slate-600 text-sm mt-2">
            Try searching by NPI number or a different name. Only top providers and flagged providers are searchable here.
          </p>
        </div>
      )}

      {/* Recently Flagged */}
      {!trimmed && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recently Flagged</h2>
          <p className="text-slate-500 text-sm mb-4">
            Top 10 flagged providers by total Medicaid payments
          </p>
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden divide-y divide-dark-500/30">
            {recentlyFlagged.map((w: any, i: number) => (
              <Link
                key={w.npi}
                href={`/providers/${w.npi}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-dark-700/50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm font-mono w-5">{i + 1}</span>
                    <span className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                      {w.name}
                    </span>
                    <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20">
                      {w.flagCount} flag{w.flagCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 ml-7">
                    NPI {w.npi} &middot; {w.city}, {w.state}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-semibold text-slate-300 tabular-nums">
                    {formatMoney(w.totalPaid)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
