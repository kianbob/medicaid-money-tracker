import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import similarData from "../../../../public/data/similar-providers.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "67 Provider Pairs Bill in 100% Identical Patterns",
  description: "246 pairs of flagged Medicaid providers share 95%+ billing similarity. 67 pairs are perfect 100% matches — same codes, same proportions, different NPIs.",
  openGraph: {
    title: "67 Provider Pairs Bill in 100% Identical Patterns",
    description: "246 pairs of flagged Medicaid providers share 95%+ billing similarity. 67 pairs are perfect 100% matches — same codes, same proportions, different NPIs.",
  },
  twitter: {
    title: "67 Provider Pairs Bill in 100% Identical Patterns",
    description: "246 pairs of flagged Medicaid providers share 95%+ billing similarity. 67 pairs are perfect 100% matches — same codes, same proportions, different NPIs.",
  },
};

function titleCase(s: string): string {
  if (!s) return "";
  if (s === s.toUpperCase() && s.length > 3) {
    return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return s;
}

function lookupName(npi: string): string {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return titleCase(data.name || data.providerName || "") || `NPI: ${npi}`;
    }
  } catch {}
  return `NPI: ${npi}`;
}

const pairs = (similarData as any[]).sort((a, b) => b.similarity - a.similarity);

export default function BillingSimilarity() {
  const totalPairs = pairs.length;
  const highestSim = pairs[0].similarity;
  const at100 = pairs.filter((p) => p.similarity >= 1.0).length;
  const at99 = pairs.filter((p) => p.similarity >= 0.99).length;
  const at99Pct = ((at99 / totalPairs) * 100).toFixed(0);

  const top30 = pairs.slice(0, 30);

  function simColor(sim: number): string {
    if (sim >= 1.0) return "text-red-400";
    if (sim >= 0.999) return "text-orange-400";
    return "text-yellow-400";
  }

  // Find clusters (groups of NPIs that are all 100% similar to each other)
  const perfectPairs = pairs.filter((p) => p.similarity >= 1.0);
  const clusters: Set<string>[] = [];
  for (const pair of perfectPairs) {
    const existing = clusters.find((c) => c.has(pair.npi1) || c.has(pair.npi2));
    if (existing) {
      existing.add(pair.npi1);
      existing.add(pair.npi2);
    } else {
      clusters.push(new Set([pair.npi1, pair.npi2]));
    }
  }
  // Merge overlapping clusters
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const overlap = Array.from(clusters[j]).some((npi) => clusters[i].has(npi));
        if (overlap) {
          clusters[j].forEach((npi) => clusters[i].add(npi));
          clusters.splice(j, 1);
          merged = true;
          break;
        }
      }
      if (merged) break;
    }
  }
  const bigClusters = clusters.filter((c) => c.size >= 3).sort((a, b) => b.size - a.size);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Billing Similarity</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-medium text-emerald-400">Network Analysis</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Copycat Billers: Providers With Nearly Identical Patterns
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          When two independent providers have &gt;95% cosine similarity in their billing patterns, it raises
          questions. Are they the same organization billing under multiple NPIs? Part of a coordinated billing
          scheme? Or just similar practices? We found 246 pairs among our 150 most-flagged providers.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 tabular-nums">246</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Pairs found</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{(highestSim * 100).toFixed(0)}%</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Highest similarity</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{at100}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Perfect matches</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{at99Pct}%</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">At 99%+ similarity</p>
        </div>
      </div>

      {/* Method Explained */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">How Cosine Similarity Works</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Each provider&apos;s billing is represented as a vector across all HCPCS procedure codes &mdash; how much they billed
          for each code. Cosine similarity measures the angle between two providers&apos; vectors:
          1.0 means identical billing distributions (same codes in the same proportions),
          while 0.0 means completely different billing patterns. We computed pairwise similarity among
          the 150 most-flagged providers in our watchlist.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-green-400 font-bold text-lg">&lt;90%</p>
            <p className="text-xs text-slate-500 mt-1">Normal range. Different providers naturally have different billing patterns.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-yellow-400 font-bold text-lg">95&ndash;99%</p>
            <p className="text-xs text-slate-500 mt-1">Highly similar. Same specialty in same region could explain this, but unusual.</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-red-400 font-bold text-lg">99%+</p>
            <p className="text-xs text-slate-500 mt-1">Near-identical. Suggests shared operations, same management, or coordinated billing.</p>
          </div>
        </div>
      </div>

      {/* Clusters */}
      {bigClusters.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-emerald-500 rounded-full" />
            Billing Clusters: Groups of Identical Providers
          </h2>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            When multiple providers all share 100% billing similarity with each other, they form a cluster.
            These groups are especially notable &mdash; {bigClusters.length > 1 ? `${bigClusters.length} clusters` : "1 cluster"} of
            3 or more providers bill in exactly the same pattern.
          </p>
          <div className="space-y-3">
            {bigClusters.slice(0, 5).map((cluster, ci) => {
              const npis = Array.from(cluster);
              return (
                <div key={ci} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-red-400 font-bold text-sm">Cluster {ci + 1}</span>
                    <span className="text-xs text-slate-500">&middot; {npis.length} providers at 100% similarity</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {npis.map((npi) => (
                      <Link key={npi} href={`/providers/${npi}`} className="text-sm text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span className="truncate">{lookupName(npi)}</span>
                        <span className="text-[10px] text-slate-600 shrink-0">{npi}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          Of the {totalPairs} provider pairs analyzed, <span className="text-red-400 font-semibold">{at100} pairs</span> share
          a perfect 100% cosine similarity &mdash; meaning they bill for exactly the same procedure codes in exactly the
          same proportions. Another <span className="text-white font-semibold">{at99 - at100} pairs</span> are above
          99% similarity, making them nearly indistinguishable.
        </p>

        <div className="bg-dark-800 border-l-4 border-emerald-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">What Perfect Similarity Means</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            A 100% cosine similarity score means two providers allocate their billing across procedure codes in
            identical proportions. If Provider A bills 40% code X, 35% code Y, and 25% code Z, then Provider B
            does exactly the same. This is extremely unlikely to occur by chance between truly independent practices,
            especially among providers already flagged for other billing anomalies.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The cluster analysis reveals groups of providers that all share identical billing patterns with each other.
          The largest cluster contains <span className="text-white font-semibold">{bigClusters.length > 0 ? bigClusters[0].size : 0} providers</span> &mdash;
          all billing in exactly the same pattern. This could indicate a single organization operating under
          multiple NPIs, a franchise model with standardized billing, or a coordinated billing operation.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Important Caveat</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Same specialty in the same region naturally creates some similarity. A group of home health agencies
            all billing primarily for personal care services (T1019) will have high similarity simply because
            they provide the same service. This analysis is most meaningful when high similarity appears between
            providers that are already flagged for other anomalies, or when the providers are in different
            geographic regions yet bill identically.
          </p>
        </div>
      </div>

      {/* Top 30 Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-emerald-500 rounded-full" />
          Top 30 Most Similar Provider Pairs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider 1</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider 2</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Similarity</th>
              </tr>
            </thead>
            <tbody>
              {top30.map((p: any, i: number) => (
                <tr key={`${p.npi1}-${p.npi2}`} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider 1" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi1}`} className="text-slate-300 hover:text-emerald-400 transition-colors">
                      {lookupName(p.npi1)}
                    </Link>
                    <p className="text-[10px] text-slate-600">{p.npi1}</p>
                  </td>
                  <td data-label="Provider 2" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi2}`} className="text-slate-300 hover:text-emerald-400 transition-colors">
                      {lookupName(p.npi2)}
                    </Link>
                    <p className="text-[10px] text-slate-600">{p.npi2}</p>
                  </td>
                  <td data-label="Similarity" className={`py-2.5 text-right font-semibold tabular-nums ${simColor(p.similarity)}`}>
                    {(p.similarity * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">&#9656;</span>
            <span><span className="text-emerald-400 font-semibold">246 pairs</span> of flagged providers share &gt;95% cosine similarity in their billing patterns.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span><span className="text-red-400 font-semibold">{at100} pairs</span> have perfect 100% similarity &mdash; identical billing distributions across all procedure codes.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span><span className="text-amber-400 font-semibold">{bigClusters.length} cluster{bigClusters.length !== 1 ? "s" : ""}</span> of 3+ providers all share identical billing patterns with each other, suggesting shared operations.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Same specialty naturally produces some similarity. This analysis is most meaningful for providers already flagged for other anomalies.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("246 pairs of flagged Medicaid providers have >95% identical billing patterns. 67 pairs match at 100%. Are they the same org under different NPIs?")}&url=${encodeURIComponent("https://openmedicaid.org/insights/billing-similarity")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="billing-similarity" relatedSlugs={["billing-networks", "smooth-billers", "round-numbers"]} />
      </div>
    </article>
  );
}
