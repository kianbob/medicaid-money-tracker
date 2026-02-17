import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, stateName } from "@/lib/format";
import statesSummary from "../../../public/data/states-summary.json";

export const metadata: Metadata = {
  title: "Medicaid Spending by State \u2014 All 50 States | Medicaid Money Tracker",
  description: "Medicaid provider spending across all 50 states, ranked by total payments. New York leads at $81.1B. See top providers, procedures, and yearly trends for each state.",
  openGraph: {
    title: "Medicaid Spending by State \u2014 All 50 States",
    description: "State-by-state breakdown of Medicaid provider spending. New York leads with $81.1B, followed by California at $36.8B.",
  },
};

export default function StatesPage() {
  const states = (statesSummary as any[]).filter((s: any) => s.state !== 'Unknown');
  const totalSpending = states.reduce((sum: number, s: any) => sum + s.total_payments, 0);
  const maxSpending = states[0]?.total_payments || 1;

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
