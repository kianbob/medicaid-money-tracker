"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney, formatNumber } from "@/lib/format";

function toTitleCase(str: string): string {
  if (!str) return str;
  if (str === str.toUpperCase() && str.length > 3) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  return str;
}

interface Provider {
  npi: string;
  name?: string;
  city?: string;
  specialty?: string;
  total_payments?: number;
  totalPaid?: number;
  total_claims?: number;
  totalClaims?: number;
}

export default function StateProviderList({ providers, stateName }: { providers: Provider[]; stateName: string }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return providers;
    const q = search.toLowerCase();
    return providers.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      p.npi.includes(q) ||
      (p.city || '').toLowerCase().includes(q) ||
      (p.specialty || '').toLowerCase().includes(q)
    );
  }, [providers, search]);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-bold text-white">Top Providers in {stateName}</h2>
        {providers.length > 10 && (
          <input
            type="search"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors w-48 sm:w-56"
          />
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No providers match your search.</p>
      ) : (
        <div className="space-y-1.5">
          {filtered.slice(0, 50).map((p, i) => (
            <Link key={p.npi} href={`/providers/${p.npi}`}
              className="flex items-center gap-3 bg-dark-800 border border-dark-500/50 rounded-lg px-4 py-3 hover:bg-dark-700 hover:border-dark-400 transition-all group">
              <span className="text-xs font-bold text-slate-600 w-6 text-right tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate group-hover:text-blue-400 transition-colors">{toTitleCase(p.name || '') || `NPI: ${p.npi}`}</p>
                {(p.specialty || p.city) && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {p.specialty ? <span className="text-slate-400">{toTitleCase(p.specialty).substring(0, 50)}</span> : null}
                    {p.specialty && p.city ? ' \u00b7 ' : ''}
                    {p.city ? toTitleCase(p.city) : ''}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-white font-bold tabular-nums">{formatMoney(p.total_payments || p.totalPaid || 0)}</p>
                <p className="text-[10px] text-slate-600 tabular-nums">{formatNumber(p.total_claims || p.totalClaims || 0)} claims</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {!search && providers.length > 50 && (
        <p className="text-xs text-slate-500 mt-3 text-center">Showing top 50 of {providers.length} providers</p>
      )}
    </div>
  );
}
