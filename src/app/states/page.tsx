"use client";

import { useState } from "react";
import Link from "next/link";
import { formatMoney, formatNumber, stateName } from "@/lib/format";
import { RiskRankingsChart } from "@/components/Charts";
import statesSummary from "../../../public/data/states-summary.json";
import stateFlagCounts from "../../../public/data/state-flag-counts.json";
import geoRisk from "../../../public/data/geographic-risk.json";

type GeoRiskEntry = {
  state: string;
  flaggedCount: number;
  flagsPerCapita: number;
  spendingPerCapita: number;
  totalSpending: number;
  population: number;
  statFlags: number;
  mlFlags: number;
};

// Build a lookup from geographic risk data
const geoRiskMap = new Map<string, GeoRiskEntry>(
  (geoRisk as GeoRiskEntry[]).map((g) => [g.state, g])
);

// Per-capita color scale
function perCapitaColor(fpc: number): string {
  if (fpc === 0) return "bg-dark-600 text-slate-500";
  if (fpc < 0.3) return "bg-blue-900 text-blue-200";
  if (fpc <= 0.6) return "bg-blue-700 text-blue-100";
  if (fpc <= 0.8) return "bg-amber-600 text-amber-100";
  return "bg-red-500 text-white";
}

function perCapitaBorder(fpc: number): string {
  if (fpc === 0) return "border-dark-500/50";
  if (fpc < 0.3) return "border-blue-800";
  if (fpc <= 0.6) return "border-blue-600";
  if (fpc <= 0.8) return "border-amber-500";
  return "border-red-400";
}

// Total flags color scale (original)
function totalFlagColor(total: number): string {
  if (total === 0) return "bg-dark-600 text-slate-500";
  if (total <= 5) return "bg-blue-900 text-blue-200";
  if (total <= 20) return "bg-blue-700 text-blue-100";
  if (total <= 50) return "bg-amber-600 text-amber-100";
  return "bg-red-500 text-white";
}

function totalFlagBorder(total: number): string {
  if (total === 0) return "border-dark-500/50";
  if (total <= 5) return "border-blue-800";
  if (total <= 20) return "border-blue-600";
  if (total <= 50) return "border-amber-500";
  return "border-red-400";
}

export default function StatesPage() {
  const [view, setView] = useState<"perCapita" | "total">("perCapita");

  const states = (statesSummary as any[]).filter(
    (s: any) => s.state !== "Unknown"
  );
  const totalSpending = states.reduce(
    (sum: number, s: any) => sum + s.total_payments,
    0
  );
  const maxSpending = states[0]?.total_payments || 1;

  // Filter to real US states/territories (2-letter codes)
  const flagData = (stateFlagCounts as any[]).filter(
    (s: any) => s.state.length === 2
  );

  // Sort flag data based on view
  const sortedFlagData =
    view === "perCapita"
      ? [...flagData].sort((a, b) => {
          const aFpc = geoRiskMap.get(a.state)?.flagsPerCapita ?? 0;
          const bFpc = geoRiskMap.get(b.state)?.flagsPerCapita ?? 0;
          return bFpc - aFpc;
        })
      : flagData;

  // Top 10 states by flagsPerCapita for the bar chart
  const top10Risk = (geoRisk as GeoRiskEntry[])
    .filter((g) => g.flagsPerCapita > 0)
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link
          href="/"
          className="hover:text-blue-400 transition-colors"
        >
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">States</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Medicaid Spending by State
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          Provider spending across{" "}
          <span className="text-white font-semibold">{states.length} states</span>,
          totaling{" "}
          <span className="text-white font-semibold">
            {formatMoney(totalSpending)}
          </span>
          . Click any state for top providers, procedures, and yearly trends.
        </p>
      </div>

      {/* Flagged Providers Heat Map */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Flagged Providers by State
            </h2>
            <p className="text-sm text-slate-400">
              {view === "perCapita"
                ? "Flags per 100K residents. Adjusts for population to reveal disproportionate risk."
                : "Combined statistical and ML flags per state. Color intensity reflects flag count."}
            </p>
          </div>
          <div className="flex bg-dark-700 rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setView("perCapita")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                view === "perCapita"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Per Capita Risk
            </button>
            <button
              onClick={() => setView("total")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                view === "total"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Total Flags
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sortedFlagData.map((s: any) => {
            const geo = geoRiskMap.get(s.state);
            const fpc = geo?.flagsPerCapita ?? 0;

            const colorClass =
              view === "perCapita"
                ? perCapitaColor(fpc)
                : totalFlagColor(s.total);
            const borderClass =
              view === "perCapita"
                ? perCapitaBorder(fpc)
                : totalFlagBorder(s.total);
            const label =
              view === "perCapita"
                ? fpc.toFixed(1)
                : s.total;

            return (
              <Link
                key={s.state}
                href={`/states/${s.state}`}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border ${colorClass} ${borderClass} flex flex-col items-center justify-center hover:scale-110 hover:shadow-lg transition-all`}
              >
                <span className="text-xs font-black leading-none">
                  {s.state}
                </span>
                <span className="text-[10px] font-bold leading-none mt-0.5 tabular-nums">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Legend */}
        {view === "perCapita" ? (
          <div className="flex flex-wrap gap-3 mt-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-dark-600 border border-dark-500/50" /> 0
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-900 border border-blue-800" /> &lt;0.3
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-700 border border-blue-600" /> 0.3&ndash;0.6
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-600 border border-amber-500" /> 0.6&ndash;0.8
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500 border border-red-400" /> &gt;0.8
            </span>
            <span className="text-slate-500 ml-1">per 100K residents</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 mt-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-dark-600 border border-dark-500/50" /> 0
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-900 border border-blue-800" /> 1&ndash;5
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-700 border border-blue-600" /> 6&ndash;20
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-600 border border-amber-500" /> 21&ndash;50
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500 border border-red-400" /> 50+
            </span>
          </div>
        )}
      </div>

      {/* Risk Rankings - Top 10 by per capita */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-1">
          Risk Rankings
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Top 10 states by flagged providers per 100K residents. Small states can
          rank high even with few total flags.
        </p>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 sm:p-6">
          <RiskRankingsChart data={top10Risk} />
        </div>
      </div>

      {/* State Cards */}
      <div className="space-y-2">
        {states.map((s: any, i: number) => {
          const pct = (s.total_payments / maxSpending) * 100;
          return (
            <Link
              key={s.state}
              href={`/states/${s.state}`}
              className="flex items-center gap-4 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-4 hover:bg-dark-700 hover:border-dark-400 transition-all group"
            >
              <span className="text-xs font-bold text-slate-600 w-7 text-right tabular-nums">
                {i + 1}
              </span>
              <div className="w-12 shrink-0">
                <span className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {s.state}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-400 font-medium">
                  {stateName(s.state)}
                </p>
                <div className="mt-1.5 w-full bg-dark-600 rounded-full h-1.5">
                  <div
                    className="bg-blue-500/60 h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-white font-bold tabular-nums">
                  {formatMoney(s.total_payments)}
                </p>
                <p className="text-[10px] text-slate-500">
                  {s.provider_count} providers &middot;{" "}
                  {formatNumber(s.total_claims)} claims
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
