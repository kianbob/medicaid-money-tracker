"use client";

import { formatMoney, formatNumber } from "@/lib/format";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  PieChart,
  Pie,
} from "recharts";

/* ─── Shared tooltip style ─── */
const tooltipStyle = {
  backgroundColor: "#1a1d23",
  border: "1px solid rgba(100,116,139,0.3)",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
};

/* ─── 1. Spending AreaChart (Trends page) ─── */

interface TrendDatum {
  year: string;
  payments: number;
  claims: number;
  providers: number;
}

function TrendsTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const prev = d._prev as TrendDatum | null;
  const yoy = prev
    ? ((d.payments - prev.payments) / prev.payments) * 100
    : null;
  return (
    <div style={tooltipStyle}>
      <p className="text-white font-semibold mb-1">{label}</p>
      <p className="text-blue-400 tabular-nums">{formatMoney(d.payments)}</p>
      {yoy !== null && (
        <p
          className={`text-xs tabular-nums mt-0.5 ${yoy >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          {yoy >= 0 ? "+" : ""}
          {yoy.toFixed(1)}% YoY
        </p>
      )}
    </div>
  );
}

export function SpendingAreaChart({ data }: { data: TrendDatum[] }) {
  // Attach prev for tooltip YoY calculation
  const chartData = data.map((d, i) => ({
    ...d,
    _prev: i > 0 ? data[i - 1] : null,
    paymentsBillions: d.payments / 1e9,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `$${v.toFixed(0)}B`}
          domain={["auto", "auto"]}
          width={58}
        />
        <Tooltip content={<TrendsTooltip />} cursor={{ stroke: "rgba(59,130,246,0.3)" }} />
        <Area
          type="monotone"
          dataKey="paymentsBillions"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#spendingGrad)"
          dot={{ r: 4, fill: "#3b82f6", stroke: "#1a1d23", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#60a5fa", stroke: "#1a1d23", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── 2. Claims AreaChart (Trends page) ─── */

function ClaimsTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const prev = d._prev as TrendDatum | null;
  const yoy = prev
    ? ((d.claims - prev.claims) / prev.claims) * 100
    : null;
  return (
    <div style={tooltipStyle}>
      <p className="text-white font-semibold mb-1">{label}</p>
      <p className="text-purple-400 tabular-nums">{formatNumber(d.claims)}</p>
      {yoy !== null && (
        <p
          className={`text-xs tabular-nums mt-0.5 ${yoy >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          {yoy >= 0 ? "+" : ""}
          {yoy.toFixed(1)}% YoY
        </p>
      )}
    </div>
  );
}

export function ClaimsAreaChart({ data }: { data: TrendDatum[] }) {
  const chartData = data.map((d, i) => ({
    ...d,
    _prev: i > 0 ? data[i - 1] : null,
    claimsBillions: d.claims / 1e9,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="claimsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v.toFixed(1)}B`}
          width={48}
        />
        <Tooltip content={<ClaimsTooltip />} cursor={{ stroke: "rgba(168,85,247,0.3)" }} />
        <Area
          type="monotone"
          dataKey="claimsBillions"
          stroke="#a855f7"
          strokeWidth={2.5}
          fill="url(#claimsGrad)"
          dot={{ r: 4, fill: "#a855f7", stroke: "#1a1d23", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#c084fc", stroke: "#1a1d23", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── 3. Homepage spending BarChart ─── */

function HomepageTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="text-white font-semibold mb-1">{label}</p>
      <p className="text-blue-400 tabular-nums">{formatMoney(d.payments)}</p>
      {d.yoyPct !== null && (
        <p
          className={`text-xs tabular-nums mt-0.5 ${d.yoyPct >= 0 ? "text-amber-400" : "text-green-400"}`}
        >
          {d.yoyPct >= 0 ? "+" : ""}
          {d.yoyPct.toFixed(1)}% YoY
        </p>
      )}
    </div>
  );
}

function YoYLabel(props: any) {
  const { x, y, width, value } = props;
  if (value === null || value === undefined) return null;
  const color = value >= 0 ? "#fbbf24" : "#4ade80";
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill={color}
      textAnchor="middle"
      fontSize={9}
      fontWeight={600}
      opacity={0.8}
    >
      {value >= 0 ? "+" : ""}
      {value.toFixed(1)}%
    </text>
  );
}

export function HomepageBarChart({ data }: { data: TrendDatum[] }) {
  const chartData = data.map((d, i) => {
    const prev = i > 0 ? data[i - 1] : null;
    const yoyPct = prev
      ? ((d.payments - prev.payments) / prev.payments) * 100
      : null;
    return { ...d, yoyPct };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 18, right: 5, left: 5, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" vertical={false} />
        <YAxis hide domain={[(dataMin: number) => dataMin * 0.6, (dataMax: number) => dataMax * 1.08]} />
        <XAxis
          dataKey="year"
          tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(100,116,139,0.15)" }}
        />
        <Tooltip content={<HomepageTooltip />} cursor={{ fill: "rgba(59,130,246,0.08)" }} />
        <Bar dataKey="payments" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="rgba(59,130,246,0.5)" />
          ))}
          <LabelList dataKey="yoyPct" content={<YoYLabel />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── 4. State yearly spending BarChart ─── */

interface StateYearDatum {
  year: string;
  payments?: number;
  total_payments?: number;
}

function StateTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const val = d.payments || d.total_payments || 0;
  return (
    <div style={tooltipStyle}>
      <p className="text-white font-semibold mb-1">{label}</p>
      <p className="text-blue-400 tabular-nums">{formatMoney(val)}</p>
    </div>
  );
}

export function StateSpendingChart({ data }: { data: StateYearDatum[] }) {
  const chartData = data.map((d) => ({
    ...d,
    value: (d.payments || d.total_payments || 0) / 1e6,
    rawValue: d.payments || d.total_payments || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}B` : `${v.toFixed(0)}M`}`}
          width={54}
        />
        <Tooltip content={<StateTooltip />} cursor={{ fill: "rgba(59,130,246,0.08)" }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill="rgba(59,130,246,0.5)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── 5. Monthly Spending AreaChart (Provider detail page) ─── */

interface MonthlyDatum {
  month: string;
  payments?: number;
  paid?: number;
}

function MonthlyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="text-white font-semibold mb-1">{d.month}</p>
      <p className="text-blue-400 tabular-nums">{formatMoney(d.value)}</p>
    </div>
  );
}

export function MonthlySpendingChart({ data }: { data: MonthlyDatum[] }) {
  const sliced = data.slice(-36);
  const chartData = sliced.map((d) => ({
    ...d,
    value: d.payments || d.paid || 0,
    label: d.month?.length >= 7 ? d.month.substring(5) : d.month,
  }));

  // Show ~6 tick labels evenly spaced
  const tickInterval = Math.max(1, Math.floor(chartData.length / 6));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="monthlyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
          interval={tickInterval}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(0)}K` : `$${v}`}
          width={54}
        />
        <Tooltip content={<MonthlyTooltip />} cursor={{ stroke: "rgba(59,130,246,0.3)" }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#monthlyGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#60a5fa", stroke: "#1a1d23", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── 6. Risk Tier PieChart (Watchlist page) ─── */

interface RiskTierDatum {
  name: string;
  value: number;
  color: string;
}

function RiskTierTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="font-semibold mb-0.5" style={{ color: d.color }}>{d.name}</p>
      <p className="text-white tabular-nums">{d.value.toLocaleString()} providers</p>
    </div>
  );
}

export function RiskTierChart({ data }: { data: RiskTierDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={65}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<RiskTierTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ─── 7. State Procedure PieChart ─── */

interface StateProcDatum {
  name: string;
  value: number;
  color: string;
}

const PROC_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

function StateProcTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="font-semibold text-white mb-0.5">{d.name}</p>
      <p className="text-blue-400 tabular-nums">{formatMoney(d.value)}</p>
    </div>
  );
}

export function StateProcedurePieChart({ data }: { data: StateProcDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<StateProcTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ─── 8. Risk Rankings Horizontal BarChart (States page) ─── */

interface RiskRankDatum {
  state: string;
  flagsPerCapita: number;
  flaggedCount: number;
  population: number;
}

function RiskRankTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="text-white font-semibold mb-1">{d.state}</p>
      <p className="text-red-400 tabular-nums">{d.flagsPerCapita.toFixed(2)} per 100K</p>
      <p className="text-slate-400 text-xs tabular-nums">{d.flaggedCount} flags &middot; Pop {(d.population / 1e6).toFixed(1)}M</p>
    </div>
  );
}

export function RiskRankingsChart({ data }: { data: RiskRankDatum[] }) {
  const maxVal = Math.max(...data.map(d => d.flagsPerCapita));

  return (
    <ResponsiveContainer width="100%" height={data.length * 40 + 20}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 60, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
          domain={[0, Math.ceil(maxVal * 10) / 10]}
          tickFormatter={(v: number) => v.toFixed(1)}
        />
        <YAxis
          type="category"
          dataKey="state"
          tick={{ fill: "#e2e8f0", fontSize: 12, fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip content={<RiskRankTooltip />} cursor={{ fill: "rgba(239,68,68,0.06)" }} />
        <Bar dataKey="flagsPerCapita" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.flagsPerCapita > 0.8
                  ? "rgba(239,68,68,0.7)"
                  : entry.flagsPerCapita > 0.6
                    ? "rgba(245,158,11,0.7)"
                    : entry.flagsPerCapita > 0.3
                      ? "rgba(59,130,246,0.7)"
                      : "rgba(59,130,246,0.4)"
              }
            />
          ))}
          <LabelList
            dataKey="flagsPerCapita"
            position="right"
            formatter={(v: any) => Number(v).toFixed(2)}
            style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── 9. Spending Growth AreaChart (Insights: spending-growth) ─── */

interface SpendingGrowthDatum {
  year: string;
  totalPaid: number;
}

function SpendingGrowthTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="text-white font-semibold mb-1">{label}</p>
      <p className="text-blue-400 tabular-nums">{formatMoney(d.totalPaid)}</p>
      {d.yoyPct !== null && (
        <p className={`text-xs tabular-nums mt-0.5 ${d.yoyPct >= 0 ? "text-green-400" : "text-red-400"}`}>
          {d.yoyPct >= 0 ? "+" : ""}{d.yoyPct.toFixed(1)}% YoY
        </p>
      )}
      {d.isPartial && (
        <p className="text-xs text-yellow-400 mt-0.5">Partial year</p>
      )}
    </div>
  );
}

export function SpendingGrowthChart({ data }: { data: SpendingGrowthDatum[] }) {
  const chartData = data.map((d, i) => {
    const prev = i > 0 ? data[i - 1] : null;
    const yoyPct = prev ? ((d.totalPaid - prev.totalPaid) / prev.totalPaid) * 100 : null;
    return {
      ...d,
      yoyPct,
      totalPaidBillions: d.totalPaid / 1e9,
      isPartial: d.year === "2024",
    };
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `$${v.toFixed(0)}B`}
          domain={[0, "auto"]}
          width={58}
        />
        <Tooltip content={<SpendingGrowthTooltip />} cursor={{ stroke: "rgba(59,130,246,0.3)" }} />
        <Area
          type="monotone"
          dataKey="totalPaidBillions"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#growthGrad)"
          dot={{ r: 5, fill: "#3b82f6", stroke: "#1a1d23", strokeWidth: 2 }}
          activeDot={{ r: 7, fill: "#60a5fa", stroke: "#1a1d23", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── 10. City Fraud Hotspots Horizontal BarChart ─── */

interface CityHotspotDatum {
  city: string;
  state: string;
  flaggedCount: number;
  flaggedSpending: number;
}

function CityHotspotTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="text-white font-semibold mb-1">{d.city}</p>
      <p className="text-teal-400 tabular-nums">{d.flaggedCount} flagged providers</p>
      <p className="text-slate-400 text-xs tabular-nums">{formatMoney(d.flaggedSpending)} in spending</p>
    </div>
  );
}

export function CityHotspotsChart({ data }: { data: CityHotspotDatum[] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: d.city.split(",")[0],
  }));

  return (
    <ResponsiveContainer width="100%" height={chartData.length * 36 + 20}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 60, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fill: "#e2e8f0", fontSize: 11, fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip content={<CityHotspotTooltip />} cursor={{ fill: "rgba(20,184,166,0.06)" }} />
        <Bar dataKey="flaggedCount" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.flaggedCount >= 30
                  ? "rgba(239,68,68,0.7)"
                  : entry.flaggedCount >= 15
                    ? "rgba(245,158,11,0.7)"
                    : entry.flaggedCount >= 10
                      ? "rgba(20,184,166,0.7)"
                      : "rgba(20,184,166,0.4)"
              }
            />
          ))}
          <LabelList
            dataKey="flaggedCount"
            position="right"
            style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// PROC_COLORS moved inline to server components that need it
