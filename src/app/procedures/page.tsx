"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney, formatNumber, hcpcsDescription } from "@/lib/format";
import allProcedures from "../../../public/data/all-procedures.json";

export default function ProceduresPage() {
  const procedures = allProcedures as any[];
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("spending");
  const [visibleCount, setVisibleCount] = useState(100);

  const filtered = useMemo(() => {
    let result = procedures;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.code.toLowerCase().includes(q) ||
        (hcpcsDescription(p.code) || '').toLowerCase().includes(q)
      );
    }
    if (sortBy === "code") {
      result = [...result].sort((a, b) => a.code.localeCompare(b.code));
    } else if (sortBy === "claims") {
      result = [...result].sort((a, b) => (b.totalClaims || 0) - (a.totalClaims || 0));
    } else if (sortBy === "cpc") {
      result = [...result].sort((a, b) => {
        const aCpc = a.totalClaims > 0 ? a.totalPaid / a.totalClaims : 0;
        const bCpc = b.totalClaims > 0 ? b.totalPaid / b.totalClaims : 0;
        return bCpc - aCpc;
      });
    }
    // default "spending" — data is already sorted by totalPaid desc
    return result;
  }, [procedures, search, sortBy]);

  const totalSpending = procedures.reduce((sum: number, p: any) => sum + p.totalPaid, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Procedures</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Procedure Explorer</h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          Every medical procedure billed to Medicaid has a code (HCPCS). These are the{' '}
          <span className="text-white font-semibold">{formatNumber(procedures.length)}</span> most-billed procedure codes,
          ranked by total payments &mdash; <span className="text-white font-semibold">{formatMoney(totalSpending)}</span> in
          total spending from 2018&ndash;2024. Click any code to see detailed benchmarks and top providers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by code or description (e.g., T1019, psychotherapy, ambulance)..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(100); }}
          className="flex-1 bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setVisibleCount(100); }}
          className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="spending">Highest Spending</option>
          <option value="code">Code A-Z</option>
          <option value="claims">Most Claims</option>
          <option value="cpc">Highest Cost Per Claim</option>
        </select>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        Showing <strong className="text-white">{Math.min(visibleCount, filtered.length)}</strong> of {formatNumber(filtered.length)} procedures
      </p>

      <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500/50 bg-dark-700/30">
                <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold w-8">#</th>
                <th scope="col" className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Procedure</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total Paid</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden md:table-cell">Providers</th>
                <th scope="col" className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold hidden lg:table-cell">Avg/Claim</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, visibleCount).map((p: any, i: number) => {
                const desc = hcpcsDescription(p.code);
                const avgClaim = p.totalClaims > 0 ? p.totalPaid / p.totalClaims : 0;
                return (
                  <tr key={p.code} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-2 text-xs text-slate-600 font-bold tabular-nums">{i + 1}</td>
                    <td className="px-4 py-2">
                      <Link href={`/procedures/${p.code}`} className="text-white font-medium hover:text-blue-400 transition-colors inline-flex items-baseline gap-2">
                        <span className="font-mono text-xs font-bold">{p.code}</span>
                        {desc && <span className="text-slate-400 text-xs font-normal">{desc}</span>}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-white font-semibold text-xs tabular-nums">{formatMoney(p.totalPaid)}</td>
                    <td className="px-4 py-2 text-right text-slate-400 text-xs hidden sm:table-cell tabular-nums">{formatNumber(p.totalClaims)}</td>
                    <td className="px-4 py-2 text-right text-slate-400 text-xs hidden md:table-cell tabular-nums">{formatNumber(p.providerCount)}</td>
                    <td className="px-4 py-2 text-right font-mono text-slate-400 text-xs hidden lg:table-cell tabular-nums">{formatMoney(avgClaim)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {visibleCount < filtered.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 100)}
            className="bg-dark-700 hover:bg-dark-600 text-white font-medium px-8 py-3 rounded-lg border border-dark-500 transition-all text-sm"
          >
            Show More ({formatNumber(filtered.length - visibleCount)} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
