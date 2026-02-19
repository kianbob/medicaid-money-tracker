"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import matchedProviders from "../../../../public/data/leie-matched.json";

const tooltipStyle = {
  backgroundColor: "#1a1d23",
  border: "1px solid rgba(100,116,139,0.3)",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
};

type MatchedProvider = {
  lastName: string;
  firstName: string;
  midName: string;
  busName: string;
  general: string;
  specialty: string;
  npi: string;
  city: string;
  state: string;
  zip: string;
  exclType: string;
  exclTypeDesc: string;
  exclDate: string;
};

const providers = matchedProviders as MatchedProvider[];

function getDisplayName(p: MatchedProvider): string {
  if (p.busName) return titleCase(p.busName);
  const parts = [p.lastName, p.firstName, p.midName].filter(Boolean);
  return titleCase(parts.join(", "));
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/(?:^|\s|[-/])\S/g, (c) => c.toUpperCase());
}

function formatExclDate(raw: string): string {
  if (!raw || raw.length < 8) return raw || "";
  const m = raw.substring(4, 6);
  const d = raw.substring(6, 8);
  const y = raw.substring(0, 4);
  return `${m}/${d}/${y}`;
}

export default function MatchedPage() {
  // Summary stats
  const byState = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of providers) {
      counts[p.state] = (counts[p.state] || 0) + 1;
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([state, count]) => ({ state, count }));
  }, []);

  const byReason = useMemo(() => {
    const counts: Record<string, { desc: string; count: number }> = {};
    for (const p of providers) {
      const key = p.exclType;
      if (!counts[key]) counts[key] = { desc: p.exclTypeDesc, count: 0 };
      counts[key].count++;
    }
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, []);

  const bySpecialty = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of providers) {
      const spec = p.specialty || "Unknown";
      counts[spec] = (counts[spec] || 0) + 1;
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([specialty, count]) => ({ specialty, count }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/exclusions" className="hover:text-blue-400 transition-colors">OIG Exclusion List</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Matched Providers</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Banned But Still Billing
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          We cross-referenced <span className="text-white font-semibold">82,714 providers</span> on the
          HHS OIG Exclusion List against Medicaid billing records and found{" "}
          <span className="text-red-400 font-semibold">40 matches</span> &mdash; providers who have been
          convicted of fraud, had their licenses revoked, or were otherwise banned from federal healthcare
          programs, yet whose NPIs appear in HHS payment data.
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Source: HHS OIG LEIE Database cross-referenced with CMS Medicaid Provider Spending 2018&ndash;2024
        </p>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Matched</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">40</p>
          <p className="text-[10px] text-slate-600">excluded &amp; in billing data</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">States</p>
          <p className="text-2xl font-bold text-white tabular-nums">{byState.length}</p>
          <p className="text-[10px] text-slate-600">states represented</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Top State</p>
          <p className="text-2xl font-bold text-amber-400 tabular-nums">{byState[0]?.state}</p>
          <p className="text-[10px] text-slate-600">{byState[0]?.count} providers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Top Reason</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{byReason[0]?.count}</p>
          <p className="text-[10px] text-slate-600 truncate">{byReason[0]?.desc}</p>
        </div>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* By State */}
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-amber-500 rounded-full" />
            <h2 className="font-headline text-sm font-bold text-white">By State</h2>
          </div>
          <ResponsiveContainer width="100%" height={byState.length * 32 + 20}>
            <BarChart data={byState} layout="vertical" margin={{ top: 5, right: 45, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
              />
              <YAxis
                type="category"
                dataKey="state"
                tick={{ fill: "#e2e8f0", fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={tooltipStyle}>
                      <p className="text-white font-semibold">{d.state}</p>
                      <p className="text-amber-400 tabular-nums">{d.count} providers</p>
                    </div>
                  );
                }}
                cursor={{ fill: "rgba(245,158,11,0.06)" }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {byState.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.count >= 8 ? "rgba(239,68,68,0.7)" : entry.count >= 3 ? "rgba(245,158,11,0.7)" : "rgba(59,130,246,0.5)"}
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Reason + By Specialty */}
        <div className="space-y-6">
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-red-500 rounded-full" />
              <h2 className="font-headline text-sm font-bold text-white">By Exclusion Reason</h2>
            </div>
            <div className="space-y-2">
              {byReason.map((r) => {
                const pct = (r.count / providers.length) * 100;
                return (
                  <div key={r.desc}>
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-xs text-slate-300 truncate max-w-[70%]">{r.desc}</p>
                      <p className="text-xs font-bold text-white tabular-nums">{r.count}</p>
                    </div>
                    <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-500/60"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-purple-500 rounded-full" />
              <h2 className="font-headline text-sm font-bold text-white">By Specialty</h2>
            </div>
            <div className="space-y-2">
              {bySpecialty.slice(0, 10).map((s) => {
                const pct = (s.count / providers.length) * 100;
                return (
                  <div key={s.specialty}>
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-xs text-slate-300 truncate max-w-[70%]">{titleCase(s.specialty)}</p>
                      <p className="text-xs font-bold text-white tabular-nums">{s.count}</p>
                    </div>
                    <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500/60"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Full Table */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <h2 className="font-headline text-sm font-bold text-white">All 40 Matched Providers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500/50">
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">#</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">Name</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">NPI</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">Location</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">Specialty</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">Exclusion Type</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p, i) => (
                <tr key={p.npi} className="border-b border-dark-500/20 hover:bg-dark-700/50 transition-colors">
                  <td className="py-2.5 pr-4 text-xs text-slate-600 tabular-nums">{i + 1}</td>
                  <td className="py-2.5 pr-4">
                    <p className="text-xs text-white font-medium">{getDisplayName(p)}</p>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Link
                      href={`/providers/${p.npi}`}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors tabular-nums"
                    >
                      {p.npi}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-slate-400 whitespace-nowrap">
                    {titleCase(p.city)}, {p.state}
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-slate-400">{titleCase(p.specialty)}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-xs ${
                      p.exclTypeDesc.includes("Convicted") ? "text-red-400"
                        : p.exclTypeDesc.includes("revocation") || p.exclTypeDesc.includes("suspension") ? "text-amber-400"
                          : "text-slate-400"
                    }`}>
                      {p.exclTypeDesc}
                    </span>
                  </td>
                  <td className="py-2.5 text-xs text-slate-500 tabular-nums whitespace-nowrap">
                    {formatExclDate(p.exclDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-dark-800 border border-slate-500/20 rounded-xl p-4 mb-8">
        <p className="text-xs text-slate-400 leading-relaxed text-center">
          <strong className="text-slate-300">Important timing caveat:</strong> The Medicaid billing data covers 2018&ndash;2024.
          Some of these providers may have been excluded <em>after</em> the billing period, meaning they were legitimately
          billing Medicaid at the time the claims were submitted. The presence of an NPI in payment data does not
          necessarily indicate fraudulent billing after exclusion. This analysis identifies providers worth investigating,
          not definitive cases of post-exclusion billing.
        </p>
      </div>

      {/* Bottom Links */}
      <div className="text-center space-y-2">
        <div className="flex justify-center gap-4">
          <Link href="/exclusions" className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
            &larr; Full exclusion list
          </Link>
          <Link href="/watchlist" className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors">
            Risk Watchlist &rarr;
          </Link>
          <Link href="/about" className="text-slate-400 hover:text-slate-300 font-medium text-sm transition-colors">
            About this project &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
