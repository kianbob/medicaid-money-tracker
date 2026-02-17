import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, stateName } from "@/lib/format";
import statesSummary from "../../../public/data/states-summary.json";
import stateFlagCounts from "../../../public/data/state-flag-counts.json";

export const metadata: Metadata = {
  title: "Medicaid Spending by State \u2014 All 50 States | Medicaid Money Tracker",
  description: "Medicaid provider spending across all 50 states, ranked by total payments. New York leads at $81.1B. See top providers, procedures, and yearly trends for each state.",
  openGraph: {
    title: "Medicaid Spending by State \u2014 All 50 States",
    description: "State-by-state breakdown of Medicaid provider spending. New York leads with $81.1B, followed by California at $36.8B.",
  },
};

function flagColor(total: number): string {
  if (total === 0) return 'bg-dark-600 text-slate-500';
  if (total <= 5) return 'bg-blue-900 text-blue-200';
  if (total <= 20) return 'bg-blue-700 text-blue-100';
  if (total <= 50) return 'bg-amber-600 text-amber-100';
  return 'bg-red-500 text-white';
}

function flagBorder(total: number): string {
  if (total === 0) return 'border-dark-500/50';
  if (total <= 5) return 'border-blue-800';
  if (total <= 20) return 'border-blue-600';
  if (total <= 50) return 'border-amber-500';
  return 'border-red-400';
}

export default function StatesPage() {
  const states = (statesSummary as any[]).filter((s: any) => s.state !== 'Unknown');
  const totalSpending = states.reduce((sum: number, s: any) => sum + s.total_payments, 0);
  const maxSpending = states[0]?.total_payments || 1;

  // Filter to real US states/territories (2-letter codes, not "Individual"/"Organization")
  const flagData = (stateFlagCounts as any[]).filter(
    (s: any) => s.state.length === 2
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">States</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Medicaid Spending by State</h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          Provider spending across <span className="text-white font-semibold">{states.length} states</span>,
          totaling <span className="text-white font-semibold">{formatMoney(totalSpending)}</span>.
          Click any state for top providers, procedures, and yearly trends.
        </p>
      </div>

      {/* Flagged Providers Heat Map */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-1">Flagged Providers by State</h2>
        <p className="text-sm text-slate-400 mb-4">
          Combined statistical and ML flags per state. Color intensity reflects flag count.
        </p>
        <div className="flex flex-wrap gap-2">
          {flagData.map((s: any) => (
            <Link
              key={s.state}
              href={`/states/${s.state}`}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border ${flagColor(s.total)} ${flagBorder(s.total)} flex flex-col items-center justify-center hover:scale-110 hover:shadow-lg transition-all`}
            >
              <span className="text-xs font-black leading-none">{s.state}</span>
              <span className="text-[10px] font-bold leading-none mt-0.5 tabular-nums">{s.total}</span>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-dark-600 border border-dark-500/50" /> 0</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-900 border border-blue-800" /> 1&ndash;5</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-700 border border-blue-600" /> 6&ndash;20</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-600 border border-amber-500" /> 21&ndash;50</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 border border-red-400" /> 50+</span>
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
              <span className="text-xs font-bold text-slate-600 w-7 text-right tabular-nums">{i + 1}</span>
              <div className="w-12 shrink-0">
                <span className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{s.state}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-400 font-medium">{stateName(s.state)}</p>
                <div className="mt-1.5 w-full bg-dark-600 rounded-full h-1.5">
                  <div className="bg-blue-500/60 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-white font-bold tabular-nums">{formatMoney(s.total_payments)}</p>
                <p className="text-[10px] text-slate-500">{s.provider_count} providers &middot; {formatNumber(s.total_claims)} claims</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
