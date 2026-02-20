import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, stateName } from "@/lib/format";
import geoRisk from "../../../../public/data/geographic-risk.json";

const data = geoRisk as Array<{
  state: string;
  flaggedCount: number;
  statFlags: number;
  mlFlags: number;
  totalSpending: number;
  population: number;
  flagsPerCapita: number;
  spendingPerCapita: number;
}>;

const stateMap = new Map(data.map((s) => [s.state, s]));

// National averages
const totalPop = data.reduce((s, r) => s + r.population, 0);
const totalFlags = data.reduce((s, r) => s + r.flaggedCount, 0);
const totalSpend = data.reduce((s, r) => s + r.totalSpending, 0);
const natFlagsPerCapita = totalFlags / (totalPop / 100000);
const natSpendPerCapita = totalSpend / totalPop;
const avgFlagsPerCapita = data.reduce((s, r) => s + r.flagsPerCapita, 0) / data.length;

export function generateStaticParams() {
  return data.map((s) => ({ state: s.state }));
}

export async function generateMetadata({ params }: { params: { state: string } }): Promise<Metadata> {
  const st = stateMap.get(params.state);
  const name = stateName(params.state);
  if (!st) return { title: "State Not Found — OpenMedicaid" };
  return {
    title: `Medicaid Fraud Risk Profile: ${name} — OpenMedicaid`,
    description: `${name} has ${st.flaggedCount} flagged Medicaid providers with ${formatMoney(st.totalSpending)} in suspicious spending. ${st.flagsPerCapita} flags per 100K residents.`,
    openGraph: {
      title: `${name} Medicaid Fraud Risk — OpenMedicaid`,
      description: `${st.flaggedCount} flagged providers, ${formatMoney(st.totalSpending)} suspicious spending, ${st.flagsPerCapita} flags per 100K.`,
    },
  };
}

export default function StateRiskPage({ params }: { params: { state: string } }) {
  const st = stateMap.get(params.state);
  const name = stateName(params.state);

  if (!st) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-serif text-white">State not found</h1>
        <Link href="/states" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          ← All States
        </Link>
      </main>
    );
  }

  const rank = [...data].sort((a, b) => b.flagsPerCapita - a.flagsPerCapita).findIndex((r) => r.state === st.state) + 1;
  const aboveAvgFlags = st.flagsPerCapita > avgFlagsPerCapita;

  const stats = [
    { label: "Flagged Providers", value: st.flaggedCount.toString(), sub: `${st.statFlags} statistical · ${st.mlFlags} ML`, color: "text-red-400" },
    { label: "Total Spending", value: formatMoney(st.totalSpending), sub: "Suspicious billing", color: "text-amber-400" },
    { label: "Flags per 100K", value: st.flagsPerCapita.toFixed(2), sub: `Nat'l avg: ${avgFlagsPerCapita.toFixed(2)}`, color: aboveAvgFlags ? "text-red-400" : "text-green-400" },
    { label: "Spending per Capita", value: `$${st.spendingPerCapita.toLocaleString()}`, sub: `Pop: ${(st.population / 1e6).toFixed(1)}M`, color: "text-blue-400" },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-400 mb-6 flex gap-1 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/states" className="hover:text-white transition-colors">States</Link>
        <span>/</span>
        <span className="text-white">{name}</span>
        <span>/</span>
        <span className="text-white">Risk Profile</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{st.state}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${aboveAvgFlags ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
          #{rank} risk rank
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
        Medicaid Fraud Risk Profile: {name}
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Context */}
      <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">Risk Assessment</h2>
        <p className="text-gray-300 leading-relaxed">
          {name} ranks <strong className="text-white">#{rank} out of {data.length}</strong> states by flags per capita,
          with <strong className="text-white">{st.flagsPerCapita.toFixed(2)}</strong> flagged providers per 100,000 residents
          {aboveAvgFlags
            ? <> — <strong className="text-red-400">above</strong> the national average of {avgFlagsPerCapita.toFixed(2)}</>
            : <> — <strong className="text-green-400">below</strong> the national average of {avgFlagsPerCapita.toFixed(2)}</>
          }.
          Of {st.flaggedCount} total flagged providers, {st.statFlags} were identified through statistical analysis
          {st.mlFlags > 0 && <> and {st.mlFlags} by machine learning models</>}.
          {st.totalSpending > 0 && <>
            {" "}Total suspicious spending amounts to <strong className="text-white">{formatMoney(st.totalSpending)}</strong>,
            translating to <strong className="text-white">${st.spendingPerCapita.toLocaleString()}</strong> per resident —
            {st.spendingPerCapita > Math.round(natSpendPerCapita)
              ? " higher than the national per-capita average."
              : " within the national per-capita range."}
          </>}
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-4 text-sm">
        <Link href={`/states/${st.state}`} className="text-blue-400 hover:text-blue-300 transition-colors">
          {name} Provider Analysis →
        </Link>
        <Link href="/watchlist" className="text-red-400 hover:text-red-300 transition-colors">
          Risk Watchlist →
        </Link>
        <Link href="/hotspots" className="text-red-400 hover:text-red-300 transition-colors">
          City Hotspots →
        </Link>
      </div>
    </main>
  );
}
