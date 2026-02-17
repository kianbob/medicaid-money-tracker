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
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 20, right: 5, left: 5, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" vertical={false} />
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
