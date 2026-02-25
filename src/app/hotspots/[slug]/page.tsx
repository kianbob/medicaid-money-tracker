import Link from "next/link";
import { notFound } from 'next/navigation'
import type { Metadata } from "next";
import { formatMoney } from "@/lib/format";
import hotspots from "../../../../public/data/city-fraud-hotspots.json";

const data = hotspots as Array<{
  city: string;
  state: string;
  flaggedCount: number;
  flaggedSpending: number;
}>;

function citySlug(city: string) {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "");
}

const slugMap = new Map(data.map((c) => [citySlug(c.city), c]));

// National averages for context
const avgFlagged = Math.round(data.reduce((s, c) => s + c.flaggedCount, 0) / data.length);
const avgSpending = data.reduce((s, c) => s + c.flaggedSpending, 0) / data.length;

export function generateStaticParams() {
  return data.map((c) => ({ slug: citySlug(c.city) }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const city = slugMap.get(params.slug);
  if (!city) return { title: "City Not Found — OpenMedicaid" };
  return {
    title: `${city.city} Medicaid Fraud Hotspot — OpenMedicaid`,
    description: `${city.city} has ${city.flaggedCount} flagged Medicaid providers with ${formatMoney(city.flaggedSpending)} in suspicious spending. Explore fraud patterns in this city.`,
    openGraph: {
      title: `${city.city} — Fraud Hotspot — OpenMedicaid`,
      description: `${city.flaggedCount} flagged providers, ${formatMoney(city.flaggedSpending)} suspicious spending.`,
    },
  };
}

export default function CityHotspotPage({ params }: { params: { slug: string } }) {
  const city = slugMap.get(params.slug);
  if (!city) {
    notFound()
  }

  const rank = [...data].sort((a, b) => b.flaggedCount - a.flaggedCount).findIndex((c) => c.city === city.city) + 1;
  const spendPerProvider = city.flaggedCount > 0 ? city.flaggedSpending / city.flaggedCount : 0;
  const aboveAvgFlagged = city.flaggedCount > avgFlagged;
  const aboveAvgSpending = city.flaggedSpending > avgSpending;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-400 mb-6 flex gap-1 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/hotspots" className="hover:text-white transition-colors">Fraud Hotspots</Link>
        <span>/</span>
        <span className="text-white">{city.city}</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
          #{rank} Hotspot
        </span>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
          {city.state}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
        {city.city}
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Flagged Providers</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{city.flaggedCount}</div>
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Suspicious Spending</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{formatMoney(city.flaggedSpending)}</div>
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Avg per Provider</div>
          <div className="text-2xl font-bold text-white mt-1">{formatMoney(spendPerProvider)}</div>
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide">National Rank</div>
          <div className="text-2xl font-bold text-white mt-1">#{rank} <span className="text-sm text-gray-400">of 32</span></div>
        </div>
      </div>

      {/* Context */}
      <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">Fraud Pattern Analysis</h2>
        <p className="text-gray-300 leading-relaxed">
          {city.city} ranks <strong className="text-white">#{rank}</strong> among the 32 cities with the highest concentration of
          flagged Medicaid providers in the OpenMedicaid dataset. With{" "}
          <strong className="text-white">{city.flaggedCount} flagged providers</strong> billing a combined{" "}
          <strong className="text-white">{formatMoney(city.flaggedSpending)}</strong> in suspicious Medicaid charges, this city
          is {aboveAvgFlagged ? "significantly above" : "near"} the national city average of {avgFlagged} flagged providers.
          {aboveAvgSpending && (
            <> Suspicious spending here also exceeds the city average of {formatMoney(avgSpending)}, suggesting
            a higher-than-typical fraud risk environment.</>
          )}
          {spendPerProvider > 100_000_000 && (
            <> The average suspicious spending per flagged provider ({formatMoney(spendPerProvider)}) is notably high,
            which may indicate large-scale billing schemes rather than isolated incidents.</>
          )}
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/hotspots" className="text-red-400 hover:text-red-300 transition-colors">
          ← All Hotspots
        </Link>
        <Link href={`/states/${city.state}`} className="text-blue-400 hover:text-blue-300 transition-colors">
          {city.state} State Page →
        </Link>
        <Link href="/watchlist" className="text-red-400 hover:text-red-300 transition-colors">
          Risk Watchlist →
        </Link>
      </div>
    </main>
  );
}
