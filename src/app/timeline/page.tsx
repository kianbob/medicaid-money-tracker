"use client";

import Link from "next/link";
import { useState, useMemo, useRef } from "react";
import { formatMoney } from "@/lib/format";
import timelines from "../../../public/data/provider-timelines.json";

// Build month index: 2018-01 = 0, 2024-12 = 83
function monthIndex(m: string): number {
  const [y, mo] = m.split("-").map(Number);
  return (y - 2018) * 12 + (mo - 1);
}

const TOTAL_MONTHS = 84; // 2018-01 to 2024-12
const YEAR_LABELS = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

function barColor(flagCount: number): string {
  if (flagCount >= 3) return "bg-red-500/80";
  if (flagCount >= 2) return "bg-orange-500/80";
  return "bg-yellow-500/80";
}

function barBorder(flagCount: number): string {
  if (flagCount >= 3) return "border-red-500/40";
  if (flagCount >= 2) return "border-orange-500/40";
  return "border-yellow-500/40";
}

function dotColor(flagCount: number): string {
  if (flagCount >= 3) return "bg-red-400";
  if (flagCount >= 2) return "bg-orange-400";
  return "bg-yellow-400";
}

type SortOption = "first" | "spending" | "flags";

export default function TimelinePage() {
  const providers = timelines as any[];
  const [sortBy, setSortBy] = useState<SortOption>("flags");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    const arr = [...providers];
    if (sortBy === "first") {
      arr.sort((a, b) => a.firstMonth.localeCompare(b.firstMonth));
    } else if (sortBy === "spending") {
      arr.sort((a, b) => b.totalPaid - a.totalPaid);
    } else {
      arr.sort((a, b) => b.flagCount - a.flagCount || b.totalPaid - a.totalPaid);
    }
    return arr;
  }, [providers, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Timeline</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Provider Activity Timeline
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          When did flagged providers start billing? See the timeline of activity for the most suspicious
          Medicaid providers. Each bar shows when a provider was active, colored by their flag count.
          The dot marks their peak billing month.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        <label className="text-sm text-slate-400">Sort by:</label>
        <div className="flex gap-1.5">
          {([
            ["flags", "Flag Count"],
            ["spending", "Total Spending"],
            ["first", "Start Date"],
          ] as [SortOption, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortBy(val)}
              className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
                sortBy === val
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                  : "bg-dark-700 border-dark-500 text-slate-400 hover:text-white hover:border-dark-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-4 ml-auto text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-red-500/80" /> 3+ flags</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-orange-500/80" /> 2 flags</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-yellow-500/80" /> 1 flag</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white" /> Peak month</span>
        </div>
      </div>

      {/* Timeline chart */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 sm:p-6 overflow-x-auto">
        {/* Year axis */}
        <div className="flex mb-2" style={{ paddingLeft: "220px" }}>
          <div className="flex-1 relative" style={{ minWidth: "500px" }}>
            {YEAR_LABELS.map((year) => {
              const left = ((year - 2018) * 12 / TOTAL_MONTHS) * 100;
              return (
                <span
                  key={year}
                  className="absolute text-[10px] text-slate-500 font-mono"
                  style={{ left: `${left}%` }}
                >
                  {year}
                </span>
              );
            })}
          </div>
        </div>

        {/* Provider rows */}
        <div className="space-y-0.5">
          {sorted.map((p: any, i: number) => {
            const start = monthIndex(p.firstMonth);
            const end = monthIndex(p.lastMonth);
            const peak = monthIndex(p.peakMonth);
            const leftPct = (start / TOTAL_MONTHS) * 100;
            const widthPct = ((end - start + 1) / TOTAL_MONTHS) * 100;
            const peakPct = ((peak - start) / (end - start + 1)) * 100;
            const isHovered = hoveredIdx === i;

            return (
              <div
                key={p.npi}
                className={`flex items-center gap-2 py-1 rounded transition-colors ${
                  isHovered ? "bg-dark-700" : ""
                }`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Provider name */}
                <div className="w-[210px] shrink-0 truncate text-right pr-2">
                  <Link
                    href={`/providers/${p.npi}`}
                    className="text-[11px] text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {(p.name || `NPI: ${p.npi}`).substring(0, 35)}
                    {(p.name || '').length > 35 ? '...' : ''}
                  </Link>
                </div>

                {/* Bar area */}
                <div className="flex-1 relative h-5" style={{ minWidth: "500px" }}>
                  {/* Year gridlines */}
                  {YEAR_LABELS.map((year) => {
                    const x = ((year - 2018) * 12 / TOTAL_MONTHS) * 100;
                    return (
                      <div
                        key={year}
                        className="absolute top-0 bottom-0 border-l border-dark-600/50"
                        style={{ left: `${x}%` }}
                      />
                    );
                  })}

                  {/* Activity bar */}
                  <div
                    className={`absolute top-0.5 bottom-0.5 rounded-sm border ${barColor(p.flagCount)} ${barBorder(p.flagCount)} transition-opacity ${
                      hoveredIdx !== null && !isHovered ? "opacity-30" : "opacity-100"
                    }`}
                    style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 0.5)}%` }}
                  >
                    {/* Peak dot */}
                    {end > start && (
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${dotColor(p.flagCount)} ring-1 ring-white/30`}
                        style={{ left: `${Math.min(Math.max(peakPct, 5), 95)}%`, transform: "translate(-50%, -50%)" }}
                      />
                    )}
                  </div>

                  {/* Tooltip */}
                  {isHovered && (
                    <div
                      ref={tooltipRef}
                      className="absolute z-20 bg-dark-700 border border-dark-400 rounded-lg px-3 py-2 shadow-xl shadow-black/40 pointer-events-none"
                      style={{
                        left: `${Math.min(leftPct + widthPct / 2, 70)}%`,
                        top: "-58px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <p className="text-xs text-white font-medium">{p.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatMoney(p.totalPaid)} &middot; {p.flagCount} flag{p.flagCount !== 1 ? "s" : ""} &middot; {p.state}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {p.firstMonth} to {p.lastMonth} &middot; Peak: {p.peakMonth} ({formatMoney(p.peakAmount)})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom axis */}
        <div className="flex mt-3 border-t border-dark-600/50 pt-2" style={{ paddingLeft: "220px" }}>
          <div className="flex-1 relative h-4" style={{ minWidth: "500px" }}>
            {YEAR_LABELS.map((year) => {
              const left = ((year - 2018) * 12 / TOTAL_MONTHS) * 100;
              return (
                <span
                  key={year}
                  className="absolute text-[10px] text-slate-500 font-mono"
                  style={{ left: `${left}%` }}
                >
                  {year}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-4">
        Showing {sorted.length} providers from provider-timelines dataset.
        Bars indicate months with Medicaid billing activity.
        Dot indicates the month with the highest single-month payment.
      </p>
    </div>
  );
}
