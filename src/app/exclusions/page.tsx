"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
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
  LineChart,
  Line,
} from "recharts";
import leieData from "../../../public/data/leie-data.json";
import npiIndex from "../../../public/data/leie-npi-index.json";
import recentExclusions from "../../../public/data/leie-recent.json";

const tooltipStyle = {
  backgroundColor: "#1a1d23",
  border: "1px solid rgba(100,116,139,0.3)",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
};

const npiLookup = npiIndex as Record<string, { name: string; state: string; spec: string; reason: string; date: string }>;

function formatExclDate(raw: string): string {
  if (!raw || raw.length < 8) return raw || "";
  return `${raw.substring(4, 6)}/${raw.substring(6, 8)}/${raw.substring(0, 4)}`;
}

export default function ExclusionsPage() {
  const [npiSearch, setNpiSearch] = useState("");
  const [npiResult, setNpiResult] = useState<null | { found: boolean; data?: any }>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [tablePage, setTablePage] = useState(0);
  const PAGE_SIZE = 50;

  const handleNpiLookup = () => {
    const npi = npiSearch.trim();
    if (!npi) return;
    const match = npiLookup[npi];
    if (match) {
      setNpiResult({ found: true, data: match });
    } else {
      setNpiResult({ found: false });
    }
  };

  // State bar chart data (top 20)
  const stateData = (leieData.byState as { state: string; count: number }[])
    .slice(0, 20)
    .map((s) => ({ ...s, label: s.state }));
  const maxStateCount = Math.max(...stateData.map((s) => s.count));

  // Exclusion type bar chart data (top 10)
  const typeData = (leieData.byType as { type: string; desc: string; count: number }[])
    .slice(0, 10)
    .map((t) => ({
      ...t,
      label: t.desc.length > 30 ? t.desc.substring(0, 28) + "..." : t.desc,
    }));

  // Trend line chart
  const yearData = leieData.byYear as { year: string; count: number }[];

  // Top specialties (top 15, filter empty)
  const specialtyData = (leieData.bySpecialty as { specialty: string; count: number }[])
    .filter((s) => s.specialty)
    .slice(0, 15);

  // Recent exclusions table
  const recent = recentExclusions as { n: string; s: string; sp: string; npi: string; r: string; d: string }[];

  const filteredRecent = useMemo(() => {
    if (!tableSearch) return recent;
    const q = tableSearch.toLowerCase();
    return recent.filter(
      (r) =>
        r.n.toLowerCase().includes(q) ||
        r.s.toLowerCase().includes(q) ||
        r.sp.toLowerCase().includes(q) ||
        r.npi.includes(q)
    );
  }, [tableSearch, recent]);

  const totalPages = Math.ceil(filteredRecent.length / PAGE_SIZE);
  const pageItems = filteredRecent.slice(tablePage * PAGE_SIZE, (tablePage + 1) * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">OIG Exclusion List</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          OIG Exclusion List
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          The HHS Office of Inspector General maintains a list of individuals and entities banned from
          participating in federal healthcare programs. We cross-referenced{" "}
          <span className="text-white font-semibold">82,714 excluded providers</span> against our Medicaid
          billing data and found <span className="text-white font-semibold">40 providers</span> who appear
          in both datasets.
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Source: HHS OIG LEIE Database | Last updated: January 2026
        </p>
      </div>

      {/* Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Excluded</p>
          <p className="text-3xl font-bold text-white tabular-nums">82,714</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Individuals &amp; entities banned from federal healthcare</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">With NPIs</p>
          <p className="text-3xl font-bold text-blue-400 tabular-nums">8,473</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Have National Provider Identifiers we can match</p>
        </div>
        <Link href="/exclusions/matched" className="bg-dark-800 border border-red-500/30 rounded-xl p-5 hover:border-red-500/50 transition-all group">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Found in Billing Data</p>
          <p className="text-3xl font-bold text-red-400 tabular-nums">40</p>
          <p className="text-[10px] text-red-400/60 mt-0.5 group-hover:text-red-400 transition-colors">
            Banned but still billing &rarr;
          </p>
        </Link>
      </div>

      {/* NPI Lookup */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-500 rounded-full" />
          <h2 className="font-headline text-lg font-bold text-white">Check a Provider</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Enter an NPI to check if a provider appears on the OIG Exclusion List.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter NPI (e.g. 1234567890)"
            value={npiSearch}
            onChange={(e) => {
              setNpiSearch(e.target.value.replace(/\D/g, "").substring(0, 10));
              setNpiResult(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleNpiLookup()}
            className="flex-1 max-w-sm bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors tabular-nums"
          />
          <button
            onClick={handleNpiLookup}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            Check
          </button>
        </div>
        {npiResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            npiResult.found
              ? "bg-red-500/8 border-red-500/30"
              : "bg-green-500/8 border-green-500/30"
          }`}>
            {npiResult.found ? (
              <div>
                <p className="text-sm font-semibold text-red-400 mb-1">
                  Excluded Provider Found
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                  <span>Name: <strong className="text-white">{npiResult.data.name}</strong></span>
                  <span>State: <strong className="text-white">{npiResult.data.state}</strong></span>
                  <span>Specialty: <strong className="text-white">{npiResult.data.spec}</strong></span>
                  <span>Reason: <strong className="text-white">{npiResult.data.reason}</strong></span>
                  <span>Excluded: <strong className="text-white">{npiResult.data.date}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-green-400">
                Not on exclusion list &mdash; NPI {npiSearch} is not in the OIG LEIE database.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* State Breakdown */}
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-amber-500 rounded-full" />
            <h2 className="font-headline text-sm font-bold text-white">Exclusions by State (Top 20)</h2>
          </div>
          <ResponsiveContainer width="100%" height={stateData.length * 32 + 20}>
            <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 55, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
                domain={[0, Math.ceil(maxStateCount / 1000) * 1000]}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: "#e2e8f0", fontSize: 11, fontWeight: 600 }}
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
                      <p className="text-white font-semibold mb-0.5">{d.state}</p>
                      <p className="text-amber-400 tabular-nums">{d.count.toLocaleString()} exclusions</p>
                    </div>
                  );
                }}
                cursor={{ fill: "rgba(245,158,11,0.06)" }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {stateData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.count > 5000
                        ? "rgba(239,68,68,0.7)"
                        : entry.count > 2000
                          ? "rgba(245,158,11,0.7)"
                          : "rgba(59,130,246,0.5)"
                    }
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  formatter={(v: any) => Number(v).toLocaleString()}
                  style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exclusion Type Breakdown */}
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-red-500 rounded-full" />
            <h2 className="font-headline text-sm font-bold text-white">Exclusion Reasons</h2>
          </div>
          <ResponsiveContainer width="100%" height={typeData.length * 38 + 20}>
            <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 55, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: "#e2e8f0", fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                width={160}
              />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={tooltipStyle}>
                      <p className="text-white font-semibold mb-0.5">{d.desc}</p>
                      <p className="text-red-400 tabular-nums">{d.count.toLocaleString()} exclusions</p>
                      <p className="text-xs text-slate-500 mt-0.5">{d.type}</p>
                    </div>
                  );
                }}
                cursor={{ fill: "rgba(239,68,68,0.06)" }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {typeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.count > 10000
                        ? "rgba(239,68,68,0.7)"
                        : entry.count > 3000
                          ? "rgba(245,158,11,0.7)"
                          : "rgba(59,130,246,0.5)"
                    }
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  formatter={(v: any) => Number(v).toLocaleString()}
                  style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yearly Trend */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-500 rounded-full" />
          <h2 className="font-headline text-sm font-bold text-white">Exclusions by Year</h2>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={yearData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
              interval={2}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)}
              width={42}
            />
            <Tooltip
              content={({ active, payload, label }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={tooltipStyle}>
                    <p className="text-white font-semibold mb-0.5">{label}</p>
                    <p className="text-blue-400 tabular-nums">{d.count.toLocaleString()} exclusions</p>
                  </div>
                );
              }}
              cursor={{ stroke: "rgba(59,130,246,0.3)" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#3b82f6", stroke: "#1a1d23", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#60a5fa", stroke: "#1a1d23", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-500 mt-3 text-center">
          2026 is partial (Jan only). Peak exclusion activity in 2014&ndash;2016 and 2024.
        </p>
      </div>

      {/* Top Specialties */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-purple-500 rounded-full" />
          <h2 className="font-headline text-sm font-bold text-white">Top Specialties Excluded</h2>
        </div>
        <ResponsiveContainer width="100%" height={specialtyData.length * 32 + 20}>
          <BarChart data={specialtyData} layout="vertical" margin={{ top: 5, right: 55, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
            />
            <YAxis
              type="category"
              dataKey="specialty"
              tick={{ fill: "#e2e8f0", fontSize: 10, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={tooltipStyle}>
                    <p className="text-white font-semibold mb-0.5">{d.specialty}</p>
                    <p className="text-purple-400 tabular-nums">{d.count.toLocaleString()} excluded</p>
                  </div>
                );
              }}
              cursor={{ fill: "rgba(168,85,247,0.06)" }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {specialtyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.count > 5000
                      ? "rgba(168,85,247,0.8)"
                      : entry.count > 1000
                        ? "rgba(168,85,247,0.6)"
                        : "rgba(168,85,247,0.4)"
                  }
                />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                formatter={(v: any) => Number(v).toLocaleString()}
                style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-500 mt-3 text-center">
          Nurses and nurse aides account for <strong className="text-white">41.6%</strong> of all exclusions.
        </p>
      </div>

      {/* Matched Providers CTA */}
      <Link href="/exclusions/matched" className="block mb-10">
        <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-1">Banned But Still Billing: 40 Providers</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                We found 40 excluded providers whose NPIs appear in HHS Medicaid billing data.
                These providers were convicted of fraud, had licenses revoked, or were otherwise banned
                &mdash; yet their NPIs show up in payment records.
              </p>
              <p className="text-xs text-red-400 font-medium mt-2 flex items-center gap-1">
                View all 40 matched providers
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Recent Exclusions Table */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-slate-500 rounded-full" />
            <h2 className="font-headline text-sm font-bold text-white">Recent Exclusions</h2>
            <span className="text-[10px] text-slate-500 ml-2">{recent.length.toLocaleString()} entries</span>
          </div>
        </div>
        <input
          type="search"
          placeholder="Search by name, state, specialty, or NPI..."
          value={tableSearch}
          onChange={(e) => { setTableSearch(e.target.value); setTablePage(0); }}
          className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors mb-4"
        />
        <p className="text-xs text-slate-500 mb-3">
          Showing <strong className="text-white">{pageItems.length}</strong> of {filteredRecent.length.toLocaleString()} results
          {tableSearch && <span> matching &ldquo;{tableSearch}&rdquo;</span>}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500/50">
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">Name</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">State</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">Specialty</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">NPI</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2 pr-4">Reason</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r, i) => (
                <tr key={`${r.npi || r.n}-${i}`} className="border-b border-dark-500/20 hover:bg-dark-700/50 transition-colors">
                  <td className="py-2 pr-4 text-white font-medium text-xs">{r.n}</td>
                  <td className="py-2 pr-4 text-slate-400 text-xs">{r.s}</td>
                  <td className="py-2 pr-4 text-slate-400 text-xs">{r.sp}</td>
                  <td className="py-2 pr-4 text-slate-500 text-xs tabular-nums">
                    {r.npi ? (
                      <Link href={`/providers/${r.npi}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                        {r.npi}
                      </Link>
                    ) : (
                      <span className="text-slate-600">&mdash;</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-xs">
                    <span className={
                      r.r.includes("crime") || r.r.includes("fraud")
                        ? "text-red-400"
                        : r.r.includes("revok") || r.r.includes("suspend")
                          ? "text-amber-400"
                          : "text-slate-400"
                    }>
                      {r.r}
                    </span>
                  </td>
                  <td className="py-2 text-slate-500 text-xs tabular-nums whitespace-nowrap">{r.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-500/50">
            <button
              onClick={() => setTablePage(Math.max(0, tablePage - 1))}
              disabled={tablePage === 0}
              className="text-xs px-3 py-1.5 rounded-lg border border-dark-500 text-slate-400 hover:text-white hover:border-dark-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500 tabular-nums">
              Page {tablePage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setTablePage(Math.min(totalPages - 1, tablePage + 1))}
              disabled={tablePage >= totalPages - 1}
              className="text-xs px-3 py-1.5 rounded-lg border border-dark-500 text-slate-400 hover:text-white hover:border-dark-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 bg-dark-800 border border-slate-500/20 rounded-xl p-4">
        <p className="text-xs text-slate-400 leading-relaxed text-center">
          The OIG LEIE is updated monthly. Exclusion from federal healthcare programs does not necessarily mean a provider was convicted
          of fraud &mdash; some exclusions result from license actions, loan defaults, or administrative proceedings.
          Presence in billing data may reflect claims submitted before exclusion took effect.
        </p>
      </div>

      {/* Bottom Links */}
      <div className="mt-6 text-center space-y-2">
        <div className="flex justify-center gap-4">
          <Link href="/exclusions/matched" className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors">
            40 matched providers &rarr;
          </Link>
          <Link href="/watchlist" className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
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
