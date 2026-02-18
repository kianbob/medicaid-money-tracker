import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatMoney, stateName } from "@/lib/format";
import { CityHotspotsChart } from "@/components/Charts";
import cityData from "../../../../public/data/city-fraud-hotspots.json";

export const metadata: Metadata = {
  title: "America's Medicaid Fraud Capitals: City-Level Analysis — OpenMedicaid",
  description: "Brooklyn NY leads the nation with 64 flagged providers and $13.7B in suspicious spending. NYC boroughs account for 111 flagged providers. Arizona cities have 71 combined.",
  openGraph: {
    title: "America's Medicaid Fraud Capitals: City-Level Analysis",
    description: "Brooklyn leads with 64 flagged providers. NYC boroughs total 111. Nashville has the highest per-provider spending at $858M each. Analysis of 227M Medicaid billing records.",
  },
};

type CityRow = {
  city: string;
  state: string;
  flaggedCount: number;
  flaggedSpending: number;
};

const cities = cityData as CityRow[];

// Computed stats
const top15 = cities.slice(0, 15);
const brooklyn = cities.find((c) => c.city === "Brooklyn, NY")!;
const nycBoroughs = cities.filter((c) => ["Brooklyn, NY", "New York, NY", "Bronx, NY", "Flushing, NY"].includes(c.city));
const nycTotal = nycBoroughs.reduce((s, c) => s + c.flaggedCount, 0);
const nycSpending = nycBoroughs.reduce((s, c) => s + c.flaggedSpending, 0);
const azCities = cities.filter((c) => c.state === "AZ");
const azTotal = azCities.reduce((s, c) => s + c.flaggedCount, 0);
const nashville = cities.find((c) => c.city === "Nashville, TN")!;
const nashvillePerProvider = nashville.flaggedSpending / nashville.flaggedCount;
const totalFlaggedAll = cities.reduce((s, c) => s + c.flaggedCount, 0);
const totalSpendingAll = cities.reduce((s, c) => s + c.flaggedSpending, 0);

export default function CityHotspots() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">City Fraud Hotspots</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1 text-xs font-medium text-teal-400">Geographic Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          America&apos;s Medicaid Fraud Capitals: City-Level Analysis
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Brooklyn, NY leads the nation with {brooklyn.flaggedCount} flagged providers and {formatMoney(brooklyn.flaggedSpending)} in
          suspicious spending. New York City boroughs account for {nycTotal} flagged providers combined.
          Arizona cities add {azTotal} more. And Nashville, TN is a surprise entry &mdash; just {nashville.flaggedCount} flagged
          providers, but {formatMoney(nashville.flaggedSpending)} in spending, the highest per-provider total of any city.
        </p>
      </div>

      {/* Key Findings */}
      <div className="bg-dark-800 border-l-4 border-l-amber-500 rounded-r-xl p-5 mb-12">
        <h2 className="text-white font-bold text-base mb-3">Key Findings</h2>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-amber-400 mt-0.5 shrink-0">&#9656;</span>
            <span><span className="text-white font-semibold">Brooklyn leads the nation:</span> 64 flagged providers billing $13.7B combined</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-amber-400 mt-0.5 shrink-0">&#9656;</span>
            <span><span className="text-white font-semibold">All 5 NYC boroughs combined: 111 flagged providers</span> — more than any state except New York itself</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-amber-400 mt-0.5 shrink-0">&#9656;</span>
            <span><span className="text-white font-semibold">Nashville has the highest average spending</span> per flagged provider at <span className="text-white font-semibold">$858M</span></span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-amber-400 mt-0.5 shrink-0">&#9656;</span>
            <span><span className="text-white font-semibold">Phoenix and surrounding Arizona cities</span> account for <span className="text-white font-semibold">71 flagged providers</span></span>
          </li>
        </ul>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-teal-400 tabular-nums">{brooklyn.flaggedCount}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">#1 City (Brooklyn)</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{nycTotal}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">NYC Total Flags</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-orange-400 tabular-nums">{azTotal}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Arizona Cities</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{formatMoney(nashvillePerProvider)}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Nashville Per Provider</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          State-level analysis can obscure where fraud signals really cluster. When we drill down to the city level,
          a striking pattern emerges: a handful of cities account for a disproportionate share of flagged providers.
          The top 5 cities alone &mdash; Brooklyn, Phoenix, New York (Manhattan), Las Vegas, and the Bronx &mdash;
          account for {cities.slice(0, 5).reduce((s, c) => s + c.flaggedCount, 0)} of the {totalFlaggedAll} flagged
          providers across all 32 cities in our dataset.
        </p>

        <div className="bg-dark-800 border-l-4 border-teal-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The Brooklyn Effect</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Brooklyn alone has <span className="text-teal-400 font-semibold">{brooklyn.flaggedCount} flagged providers</span> billing
            a combined <span className="text-teal-400 font-semibold">{formatMoney(brooklyn.flaggedSpending)}</span>. This is driven
            largely by the <Link href="/insights/ny-home-care" className="text-blue-400 hover:text-blue-300">home care industry</Link> &mdash;
            dozens of agencies billing hundreds of millions each for personal care services under code T1019.
            When you add Manhattan ({nycBoroughs.find((c) => c.city === "New York, NY")?.flaggedCount}),
            the Bronx ({nycBoroughs.find((c) => c.city === "Bronx, NY")?.flaggedCount}),
            and Flushing ({nycBoroughs.find((c) => c.city === "Flushing, NY")?.flaggedCount}),
            NYC boroughs total <span className="text-white font-semibold">{nycTotal} flagged
            providers</span> and <span className="text-white font-semibold">{formatMoney(nycSpending)}</span> in spending.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          <Link href="/insights/arizona-problem" className="text-blue-400 hover:text-blue-300">Arizona&apos;s fraud problem</Link> is
          equally concentrated. Phoenix leads with {azCities.find((c) => c.city === "Phoenix, AZ")?.flaggedCount} flagged providers,
          followed by Mesa ({azCities.find((c) => c.city === "Mesa, AZ")?.flaggedCount}),
          Tucson ({azCities.find((c) => c.city === "Tucson, AZ")?.flaggedCount}),
          and Scottsdale ({azCities.find((c) => c.city === "Scottsdale, AZ")?.flaggedCount}).
          Combined, Arizona cities account for <span className="text-orange-400 font-semibold">{azTotal} flagged
          providers</span> and <span className="text-orange-400 font-semibold">{formatMoney(azCities.reduce((s, c) => s + c.flaggedSpending, 0))}</span> in
          suspicious spending &mdash; driven by an influx of new behavioral health clinics that appeared after 2022.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Nashville: The Per-Provider Outlier</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Nashville, TN is one of the most surprising entries on this list.
            With only <span className="text-amber-400 font-semibold">{nashville.flaggedCount} flagged providers</span>,
            it wouldn&apos;t stand out by count alone. But those providers billed a
            combined <span className="text-amber-400 font-semibold">{formatMoney(nashville.flaggedSpending)}</span> &mdash;
            an average of <span className="text-white font-semibold">{formatMoney(nashvillePerProvider)} per
            provider</span>. That&apos;s the highest per-provider spending of any city in the dataset, suggesting
            a small number of very large organizations driving the total.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Other notable clusters include <span className="text-white font-semibold">Las Vegas</span> (18 flags),
          which has emerged as a hotspot for billing anomalies in Nevada,
          and <span className="text-white font-semibold">Los Angeles</span> (12 flags, {formatMoney(cities.find((c) => c.city === "Los Angeles, CA")!.flaggedSpending)} in spending),
          which despite being the second-largest US city has fewer flags than Brooklyn alone.
          Texas contributes 36 flags across four cities (San Antonio, Houston, Fort Worth, Dallas),
          while the DC&ndash;Baltimore corridor adds 19 combined.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-1">Top 15 Cities by Flagged Provider Count</h2>
        <p className="text-xs text-slate-500 mb-4">Providers flagged for statistical billing anomalies across all detection methods.</p>
        <CityHotspotsChart data={top15} />
      </div>

      {/* Full Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-teal-500 rounded-full" />
          All 32 Cities with Flagged Providers
        </h2>
        <div className="table-wrapper">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">City</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">State</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Flagged</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Spending</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Avg Per Provider</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c, i) => (
                <tr key={c.city} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="City" className="py-2.5 pr-3 text-white font-medium">
                    {c.city.split(",")[0]}
                  </td>
                  <td data-label="State" className="py-2.5 pr-3">
                    <Link href={`/states/${c.state}`} className="text-slate-300 hover:text-teal-400 transition-colors font-medium">
                      {stateName(c.state)}
                    </Link>
                  </td>
                  <td data-label="Flagged" className="py-2.5 pr-3 text-right text-teal-400 font-bold tabular-nums">{c.flaggedCount}</td>
                  <td data-label="Total Spending" className="py-2.5 pr-3 text-right text-white font-semibold tabular-nums">{formatMoney(c.flaggedSpending)}</td>
                  <td data-label="Avg Per Provider" className="py-2.5 text-right text-slate-400 tabular-nums">{formatMoney(c.flaggedSpending / c.flaggedCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Caveat */}
      <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5 mb-12">
        <p className="text-white font-semibold mb-1">Important caveat: Medical center bias</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Cities with major medical centers, teaching hospitals, and large healthcare systems naturally
          have more providers and therefore more potential flags. A city like Nashville &mdash; home to HCA
          Healthcare and numerous hospital systems &mdash; will have high-volume billers that may trigger
          statistical anomaly detection without necessarily indicating fraud. These rankings identify
          where billing anomalies concentrate geographically, not where fraud is confirmed.
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-0.5">&#9656;</span>
            <span><span className="text-teal-400 font-semibold">Brooklyn leads the nation</span> with {brooklyn.flaggedCount} flagged providers and {formatMoney(brooklyn.flaggedSpending)} in spending, driven by the home care industry.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span><span className="text-blue-400 font-semibold">NYC boroughs combined ({nycTotal} flags)</span> account for more flagged providers than any single state except New York itself.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">&#9656;</span>
            <span><span className="text-orange-400 font-semibold">Arizona cities ({azTotal} flags)</span> represent the second-largest geographic cluster, fueled by new behavioral health clinics post-2022.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span><span className="text-amber-400 font-semibold">Nashville ({formatMoney(nashvillePerProvider)}/provider)</span> has the highest per-provider spending of any city &mdash; a small number of very large billers driving {formatMoney(nashville.flaggedSpending)} total.</span>
          </li>
        </ul>
      </div>

      {/* Footer + Related */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS Medicaid Provider Spending Data (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Brooklyn NY leads America's Medicaid fraud hotspots with 64 flagged providers and $13.7B in spending. NYC boroughs total 111 flags. Nashville averages $858M per flagged provider.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/city-hotspots")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="city-hotspots" relatedSlugs={["geographic-hotspots", "arizona-problem", "ny-home-care"]} />
      </div>
    </article>
  );
}
