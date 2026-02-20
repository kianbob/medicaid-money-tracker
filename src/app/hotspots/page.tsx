import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney } from "@/lib/format";
import hotspots from "../../../public/data/city-fraud-hotspots.json";

export const metadata: Metadata = {
  title: "City Fraud Hotspots — OpenMedicaid",
  description:
    "Explore the 32 U.S. cities with the highest concentration of flagged Medicaid providers and suspicious billing activity.",
  openGraph: {
    title: "City Fraud Hotspots — OpenMedicaid",
    description:
      "32 cities ranked by flagged provider concentration and suspicious Medicaid spending.",
  },
};

function citySlug(city: string) {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "");
}

export default function HotspotsPage() {
  const sorted = [...(hotspots as any[])].sort(
    (a, b) => b.flaggedCount - a.flaggedCount
  );

  const totalFlagged = sorted.reduce((s, c) => s + c.flaggedCount, 0);
  const totalSpending = sorted.reduce((s, c) => s + c.flaggedSpending, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-400 mb-6 flex gap-1">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Fraud Hotspots</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
        City Fraud Hotspots
      </h1>
      <p className="text-gray-400 mb-8 max-w-3xl">
        These 32 cities have the highest concentration of flagged Medicaid providers in our dataset.
        Together they account for <span className="text-white font-semibold">{totalFlagged} flagged providers</span> and{" "}
        <span className="text-white font-semibold">{formatMoney(totalSpending)}</span> in suspicious spending.
      </p>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400">Cities Tracked</div>
          <div className="text-2xl font-bold text-white">{sorted.length}</div>
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400">Flagged Providers</div>
          <div className="text-2xl font-bold text-red-400">{totalFlagged}</div>
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400">Suspicious Spending</div>
          <div className="text-2xl font-bold text-amber-400">{formatMoney(totalSpending)}</div>
        </div>
      </div>

      {/* City grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((city, i) => (
          <Link
            key={city.city}
            href={`/hotspots/${citySlug(city.city)}`}
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700/60 hover:border-gray-600 rounded-lg p-4 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs text-gray-500 font-mono">#{i + 1}</span>
                <h2 className="text-white font-semibold group-hover:text-red-300 transition-colors">
                  {city.city}
                </h2>
              </div>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                {city.flaggedCount} flagged
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {formatMoney(city.flaggedSpending)} suspicious
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex gap-4 text-sm">
        <Link href="/watchlist" className="text-red-400 hover:text-red-300 transition-colors">
          ← Risk Watchlist
        </Link>
        <Link href="/insights" className="text-purple-400 hover:text-purple-300 transition-colors">
          More Insights →
        </Link>
      </div>
    </main>
  );
}
