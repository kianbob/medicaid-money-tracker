"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { formatMoney, formatNumber, formatMoneyFull, formatCpc } from "@/lib/format";
import topProviders from "../../../public/data/top-providers-1000.json";
import mlScores from "../../../public/data/ml-scores.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

interface ProviderDetail {
  npi: string;
  name: string;
  city: string;
  state: string;
  specialty: string;
  totalPaid: number;
  totalClaims: number;
  totalBeneficiaries: number;
  costPerClaim: number;
  claimsPerBeneficiary: number;
  yearlyData?: Record<string, { totalPaid: number; totalClaims?: number; totalBeneficiaries?: number }>;
  procedures?: any[];
}

const COLORS = ["#3b82f6", "#a855f7", "#f59e0b"];

// Build ML score lookup
const mlAll = (((mlScores as any).topProviders || []) as any[])
  .concat(((mlScores as any).smallProviderFlags || []) as any[]);
const mlMap = new Map<string, number>(mlAll.map((p: any) => [p.npi, p.mlScore]));

export default function ComparePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ProviderDetail[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const providers = topProviders as any[];

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return providers
      .filter(
        (p: any) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          p.npi === query.trim()
      )
      .slice(0, 8);
  }, [query, providers]);

  const addProvider = async (npi: string) => {
    if (selected.length >= 3) return;
    if (selected.some((p) => p.npi === npi)) return;

    setLoading(npi);
    setError(null);
    setQuery("");

    try {
      const res = await fetch(`/data/providers/${npi}.json`);
      if (res.ok) {
        const detail = await res.json();
        setSelected((prev) => [
          ...prev,
          {
            npi: detail.npi || npi,
            name: detail.name || `Provider ${npi}`,
            city: detail.city || "",
            state: detail.state || "",
            specialty: detail.specialty || "",
            totalPaid: detail.totalPaid || 0,
            totalClaims: detail.totalClaims || 0,
            totalBeneficiaries: detail.totalBeneficiaries || 0,
            costPerClaim: detail.costPerClaim || (detail.totalClaims > 0 ? detail.totalPaid / detail.totalClaims : 0),
            claimsPerBeneficiary: detail.claimsPerBeneficiary || (detail.totalBeneficiaries > 0 ? detail.totalClaims / detail.totalBeneficiaries : 0),
            yearlyData: detail.yearlyData || {},
          },
        ]);
      } else {
        // Fallback to top-providers data
        const topEntry = providers.find((p: any) => p.npi === npi);
        if (topEntry) {
          setSelected((prev) => [
            ...prev,
            {
              npi: topEntry.npi,
              name: topEntry.name || `Provider ${npi}`,
              city: topEntry.city || "",
              state: topEntry.state || "",
              specialty: topEntry.specialty || "",
              totalPaid: topEntry.totalPaid || 0,
              totalClaims: topEntry.totalClaims || 0,
              totalBeneficiaries: topEntry.totalBenes || 0,
              costPerClaim: topEntry.totalClaims > 0 ? topEntry.totalPaid / topEntry.totalClaims : 0,
              claimsPerBeneficiary: topEntry.totalBenes > 0 ? topEntry.totalClaims / topEntry.totalBenes : 0,
              yearlyData: {},
            },
          ]);
        } else {
          setError("Provider detail not found.");
        }
      }
    } catch {
      setError("Failed to load provider data.");
    }
    setLoading(null);
  };

  const removeProvider = (npi: string) => {
    setSelected((prev) => prev.filter((p) => p.npi !== npi));
  };

  // Build yearly chart data
  const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];
  const yearlyChartData = useMemo(() => {
    if (selected.length === 0) return [];
    return years
      .map((year) => {
        const row: any = { year };
        let hasData = false;
        selected.forEach((p, idx) => {
          const val = p.yearlyData?.[year]?.totalPaid || 0;
          row[`provider${idx}`] = val;
          if (val > 0) hasData = true;
        });
        return hasData ? row : null;
      })
      .filter(Boolean);
  }, [selected]);

  // Total spending chart data
  const totalChartData = useMemo(() => {
    return selected.map((p, idx) => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
      totalPaid: p.totalPaid,
      fill: COLORS[idx],
    }));
  }, [selected]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Compare Providers</span>
      </nav>

      <h1 className="font-headline text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
        Compare Providers
      </h1>
      <p className="text-sm text-slate-400 mb-8">
        Search and compare up to 3 Medicaid providers side by side. View spending, claims, and yearly trends.
      </p>

      {/* Search */}
      <div className="relative mb-8 max-w-xl">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by provider name or NPI..."
              className="w-full bg-dark-800 border border-dark-500/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
              disabled={selected.length >= 3}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500 shrink-0">
            {selected.length}/3 selected
          </span>
        </div>

        {/* Search results dropdown */}
        {results.length > 0 && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-dark-500 rounded-xl shadow-2xl shadow-black/60 z-50 max-h-64 overflow-y-auto">
            {results.map((p: any) => (
              <button
                key={p.npi}
                onClick={() => addProvider(p.npi)}
                disabled={selected.some((s) => s.npi === p.npi) || selected.length >= 3}
                className="w-full text-left px-4 py-3 hover:bg-dark-600 transition-colors border-b border-dark-600/50 last:border-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <p className="text-sm text-white font-medium">{p.name}</p>
                <p className="text-[10px] text-slate-500">
                  {p.specialty} &middot; {p.city}, {p.state} &middot; NPI: {p.npi} &middot; {formatMoney(p.totalPaid)}
                </p>
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        {selected.length >= 3 && (
          <p className="text-xs text-slate-500 mt-2">
            Maximum 3 providers. Remove one to add another.
          </p>
        )}
      </div>

      {/* Selected provider chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selected.map((p, idx) => (
            <div
              key={p.npi}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-dark-800 border-dark-500/50"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[idx] }}
              />
              <span className="text-xs text-white font-medium truncate max-w-[180px]">
                {p.name}
              </span>
              <button
                onClick={() => removeProvider(p.npi)}
                className="text-slate-500 hover:text-red-400 transition-colors ml-1"
                aria-label={`Remove ${p.name}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {selected.length === 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-sm mb-2">No providers selected yet</p>
          <p className="text-slate-500 text-xs">
            Search for providers above to start comparing. Data is available for the top 1,000 providers by spending.
          </p>
        </div>
      )}

      {/* Comparison Table */}
      {selected.length > 0 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-dark-500/50">
            <h2 className="text-sm font-bold text-white">Side-by-Side Comparison</h2>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-600/50">
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-40">
                    Metric
                  </th>
                  {selected.map((p, idx) => (
                    <th key={p.npi} className="text-right px-4 py-3 min-w-[160px]">
                      <div className="flex items-center justify-end gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[idx] }}
                        />
                        <Link
                          href={`/providers/${p.npi}`}
                          className="text-white hover:text-blue-400 transition-colors text-xs font-semibold truncate max-w-[140px] inline-block"
                        >
                          {p.name}
                        </Link>
                        <button
                          onClick={() => removeProvider(p.npi)}
                          className="text-slate-600 hover:text-red-400 transition-colors"
                          aria-label={`Remove ${p.name}`}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600/50">
                <MetricRow label="State" values={selected.map((p) => p.state)} />
                <MetricRow label="Specialty" values={selected.map((p) => p.specialty)} isText />
                <MetricRow label="Total Paid" values={selected.map((p) => formatMoney(p.totalPaid))} highlight />
                <MetricRow label="Total Claims" values={selected.map((p) => formatNumber(p.totalClaims))} />
                <MetricRow label="Beneficiaries" values={selected.map((p) => formatNumber(p.totalBeneficiaries))} />
                <MetricRow label="Cost/Claim" values={selected.map((p) => formatCpc(p.costPerClaim))} />
                <MetricRow
                  label="Claims/Beneficiary"
                  values={selected.map((p) => p.claimsPerBeneficiary > 0 ? p.claimsPerBeneficiary.toFixed(1) : "\u2014")}
                />
                <MetricRow
                  label="Flag Count"
                  values={selected.map((p) => {
                    const top = providers.find((t: any) => t.npi === p.npi);
                    return String(top?.flagCount || 0);
                  })}
                />
                <MetricRow
                  label="ML Score"
                  values={selected.map((p) => {
                    const score = mlMap.get(p.npi);
                    return score != null ? `${(score * 100).toFixed(0)}%` : "\u2014";
                  })}
                />
                {/* Yearly spending rows */}
                {years.map((year) => {
                  const vals = selected.map(
                    (p) => p.yearlyData?.[year]?.totalPaid
                  );
                  if (vals.every((v) => !v)) return null;
                  return (
                    <MetricRow
                      key={year}
                      label={year}
                      values={vals.map((v) => (v ? formatMoney(v) : "\u2014"))}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <div className="md:hidden divide-y divide-dark-600/50">
            {selected.map((p, idx) => {
              const topEntry = providers.find((t: any) => t.npi === p.npi);
              const mlScore = mlMap.get(p.npi);
              return (
                <div key={p.npi} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[idx] }}
                      />
                      <Link
                        href={`/providers/${p.npi}`}
                        className="text-white hover:text-blue-400 text-sm font-semibold truncate transition-colors"
                      >
                        {p.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeProvider(p.npi)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                      aria-label={`Remove ${p.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500">State</p>
                      <p className="text-white">{p.state}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Specialty</p>
                      <p className="text-white truncate">{p.specialty}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Total Paid</p>
                      <p className="text-green-400 font-bold tabular-nums">{formatMoney(p.totalPaid)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Total Claims</p>
                      <p className="text-white tabular-nums">{formatNumber(p.totalClaims)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Beneficiaries</p>
                      <p className="text-white tabular-nums">{formatNumber(p.totalBeneficiaries)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Cost/Claim</p>
                      <p className="text-white tabular-nums">{formatCpc(p.costPerClaim)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Claims/Bene</p>
                      <p className="text-white tabular-nums">
                        {p.claimsPerBeneficiary > 0 ? p.claimsPerBeneficiary.toFixed(1) : "\u2014"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Flags</p>
                      <p className="text-white">{topEntry?.flagCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">ML Score</p>
                      <p className="text-white">{mlScore != null ? `${(mlScore * 100).toFixed(0)}%` : "\u2014"}</p>
                    </div>
                  </div>
                  {/* Yearly for mobile */}
                  {Object.keys(p.yearlyData || {}).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-dark-600/50">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Yearly Spending</p>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        {years.map((year) => {
                          const val = p.yearlyData?.[year]?.totalPaid;
                          if (!val) return null;
                          return (
                            <div key={year}>
                              <p className="text-slate-500 text-[10px]">{year}</p>
                              <p className="text-white tabular-nums">{formatMoney(val)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Total Spending Chart */}
      {selected.length >= 2 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-white mb-4">Total Spending Comparison</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={totalChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(100,116,139,0.15)" }}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatMoney(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1d23",
                  border: "1px solid rgba(100,116,139,0.3)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [formatMoneyFull(value), "Total Paid"] as any}
              />
              <Bar dataKey="totalPaid" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {totalChartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Yearly Trend Chart */}
      {yearlyChartData.length > 0 && selected.length >= 2 && (
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-white mb-4">Yearly Spending Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={yearlyChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(100,116,139,0.15)" }}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatMoney(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1d23",
                  border: "1px solid rgba(100,116,139,0.3)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "12px",
                }}
                formatter={(value: any, name: any) => {
                  const idx = parseInt(name.replace("provider", ""), 10);
                  const label = selected[idx]?.name || name;
                  return [formatMoneyFull(value), label];
                }}
              />
              <Legend
                formatter={(value: any) => {
                  const idx = parseInt(value.replace("provider", ""), 10);
                  const name = selected[idx]?.name || "";
                  return name.length > 25 ? name.substring(0, 25) + "..." : name;
                }}
                wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
              />
              {selected.map((_, idx) => (
                <Bar
                  key={idx}
                  dataKey={`provider${idx}`}
                  fill={COLORS[idx]}
                  fillOpacity={0.7}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={36}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-3 mt-4">
        <Link href="/providers" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          &larr; Browse all providers
        </Link>
        <Link href="/watchlist" className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">
          Risk Watchlist &rarr;
        </Link>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  values,
  highlight,
  isText,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
  isText?: boolean;
}) {
  return (
    <tr className="hover:bg-dark-700/30 transition-colors">
      <td className="px-4 py-2.5 text-xs text-slate-400 font-medium">{label}</td>
      {values.map((val, idx) => (
        <td
          key={idx}
          className={`px-4 py-2.5 text-right text-xs tabular-nums ${
            highlight ? "text-green-400 font-bold" : "text-white"
          } ${isText ? "max-w-[160px] truncate" : ""}`}
        >
          {val}
        </td>
      ))}
    </tr>
  );
}
