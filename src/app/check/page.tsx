"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatMoney, riskLabel, riskColor, riskBgColor, getFlagInfo } from "@/lib/format";
import smartWatchlist from "../../../public/data/smart-watchlist.json";
import mlScores from "../../../public/data/ml-scores.json";
import topProviders from "../../../public/data/top-providers-1000.json";

type WatchlistEntry = {
  npi: string;
  name?: string;
  totalPaid?: number;
  flags?: string;
  flagCount?: number;
  city?: string;
  state?: string;
  specialty?: string;
};

type MlEntry = {
  npi: string;
  score: number;
  name?: string;
  state?: string;
  city?: string;
  specialty?: string;
};

// Build combined lookup
const allFlagged = new Map<string, WatchlistEntry>();
(smartWatchlist as WatchlistEntry[]).forEach((p) => {
  if (p.name) allFlagged.set(p.npi, p);
});

const mlData = mlScores as { topProviders: MlEntry[]; smallProviderFlags: MlEntry[] };
[...mlData.topProviders, ...mlData.smallProviderFlags].forEach((p) => {
  if (!allFlagged.has(p.npi)) {
    allFlagged.set(p.npi, {
      npi: p.npi,
      name: p.name || undefined,
      city: p.city || undefined,
      state: p.state || undefined,
      specialty: p.specialty || undefined,
      flags: "ML Flag",
      flagCount: 0,
    });
  }
});

// Also search unflagged top providers
const topProvidersList = topProviders as any[];

export default function CheckPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();

    // Check if NPI (all digits)
    const isNpi = /^\d{5,10}$/.test(q);

    // Search flagged providers
    const flagged: (WatchlistEntry & { isFlagged: true; mlScore?: number })[] = [];
    allFlagged.forEach((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const npiMatch = isNpi && p.npi.includes(q);
      const cityMatch = p.city?.toLowerCase().includes(q);
      if (nameMatch || npiMatch || cityMatch) {
        const ml = [...mlData.topProviders, ...mlData.smallProviderFlags].find((m) => m.npi === p.npi);
        flagged.push({ ...p, isFlagged: true, mlScore: ml?.score });
      }
    });

    // Search unflagged top providers
    const clean: any[] = [];
    topProvidersList.forEach((p: any) => {
      if (allFlagged.has(String(p.npi))) return; // already in flagged
      const nameMatch = p.name?.toLowerCase().includes(q);
      const npiMatch = isNpi && String(p.npi).includes(q);
      if (nameMatch || npiMatch) {
        clean.push({ ...p, isFlagged: false });
      }
    });

    return [...flagged.slice(0, 10), ...clean.slice(0, 5)];
  }, [query]);

  const handleSearch = () => {
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Check Provider</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Is My Provider Flagged?
        </h1>
        <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Enter a provider name, NPI number, or city to check if they&apos;ve been flagged for unusual Medicaid billing patterns.
        </p>
      </div>

      {/* Search Box */}
      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Type a provider name, NPI, or city..."
            className="flex-1 bg-dark-800 border border-dark-500/50 rounded-xl px-5 py-4 text-white text-lg placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            autoFocus
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-4 rounded-xl transition-all text-sm"
          >
            Check
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">
          Checks against 1,860 flagged providers from 13 statistical tests + ML model
        </p>
      </div>

      {/* Results */}
      {query.length >= 2 && (
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-8 text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="text-lg font-bold text-green-400 mb-2">No Flags Found</p>
              <p className="text-sm text-slate-400">
                No providers matching &ldquo;{query}&rdquo; appear in our flagged database.
                This means they either have no unusual billing patterns, or they&apos;re not in our top analyzed providers.
              </p>
              <p className="text-xs text-slate-600 mt-3">
                We analyze the top 618K providers by spending. Smaller providers may not be in our dataset.
              </p>
            </div>
          ) : (
            results.map((p: any) => (
              <Link
                key={p.npi}
                href={`/providers/${p.npi}`}
                className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {p.isFlagged ? (
                        <span className="text-lg">🚩</span>
                      ) : (
                        <span className="text-lg">✅</span>
                      )}
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {p.name || `NPI: ${p.npi}`}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      NPI: {p.npi}
                      {p.city && ` · ${p.city}`}
                      {p.state && `, ${p.state}`}
                      {p.specialty && ` · ${p.specialty}`}
                    </p>
                    {p.isFlagged ? (
                      <div className="space-y-1">
                        {p.flags && p.flags !== "ML Flag" && (
                          <div className="flex flex-wrap gap-1">
                            {getFlagInfo(p.flags).map((f: any, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                                {f.label}
                              </span>
                            ))}
                          </div>
                        )}
                        {p.mlScore && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                            ML Score: {(p.mlScore * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-green-400">No fraud flags detected</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {p.totalPaid && (
                      <p className="text-sm font-bold text-white tabular-nums">{formatMoney(p.totalPaid)}</p>
                    )}
                    <p className="text-[10px] text-slate-600">View details →</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Info Section */}
      {!query && (
        <div className="space-y-4 mt-8">
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
            <h2 className="text-sm font-bold text-white mb-2">What does &ldquo;flagged&rdquo; mean?</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A flagged provider has billing patterns that are statistically unusual compared to peers billing the same procedure codes. 
              Being flagged is <span className="text-white font-semibold">not proof of fraud</span> — it means the patterns warrant further investigation. 
              Many flagged providers have legitimate explanations.{" "}
              <Link href="/analysis" className="text-blue-400 hover:underline">Read our methodology</Link>
            </p>
          </div>
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
            <h2 className="text-sm font-bold text-white mb-2">What if my provider isn&apos;t found?</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              If a provider doesn&apos;t appear in our results, it likely means they don&apos;t have any unusual billing flags. 
              Our analysis covers 618K providers — virtually every active Medicaid biller. 
              Not appearing here is a good sign.
            </p>
          </div>
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
            <h2 className="text-sm font-bold text-white mb-2">How to report suspected fraud</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you suspect Medicaid fraud, report it to the <a href="https://oig.hhs.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">HHS Office of Inspector General</a> at 
              1-800-HHS-TIPS (1-800-447-8477). Whistleblower protections exist under the False Claims Act.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
