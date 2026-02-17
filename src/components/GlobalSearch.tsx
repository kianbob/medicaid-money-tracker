"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { formatMoney, stateName } from "@/lib/format";
import topProviders from "../../public/data/top-providers-1000.json";
import statesSummary from "../../public/data/states-summary.json";

interface SearchResult {
  type: "provider" | "state" | "procedure";
  name: string;
  href: string;
  sub: string;
  stat?: string;
}

const COMMON_CODES = [
  { code: "T1019", desc: "Personal care services" },
  { code: "T2016", desc: "Residential habilitation" },
  { code: "99213", desc: "Office visit (established, low)" },
  { code: "99214", desc: "Office visit (established, mod)" },
  { code: "A0427", desc: "ALS emergency transport" },
  { code: "H2015", desc: "Comprehensive community support" },
  { code: "H2016", desc: "Comprehensive community support (per diem)" },
  { code: "T1015", desc: "Clinic visit/encounter" },
  { code: "S5125", desc: "Attendant care (per 15 min)" },
  { code: "T2022", desc: "Case management (per month)" },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search providers
    for (const p of topProviders as any[]) {
      if (matches.length >= 8) break;
      if (
        (p.name || "").toLowerCase().includes(q) ||
        p.npi.includes(q) ||
        (p.city || "").toLowerCase().includes(q)
      ) {
        matches.push({
          type: "provider",
          name: p.name || `NPI: ${p.npi}`,
          href: `/providers/${p.npi}`,
          sub: `${p.specialty || ""} ${p.city ? `· ${p.city}, ${p.state}` : ""}`.trim(),
          stat: formatMoney(p.totalPaid),
        });
      }
    }

    // Search states
    for (const s of statesSummary as any[]) {
      if (s.state === "Unknown") continue;
      const full = stateName(s.state).toLowerCase();
      if (full.includes(q) || s.state.toLowerCase() === q) {
        matches.push({
          type: "state",
          name: stateName(s.state),
          href: `/states/${s.state}`,
          sub: `${s.provider_count} top providers`,
          stat: formatMoney(s.total_payments),
        });
      }
    }

    // Search procedures
    for (const c of COMMON_CODES) {
      if (c.code.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) {
        matches.push({
          type: "procedure",
          name: c.code,
          href: `/procedures/${c.code}`,
          sub: c.desc,
        });
      }
    }

    return matches.slice(0, 8);
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 bg-dark-700/60 border border-dark-500/50 rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:border-dark-400 hover:text-slate-400 transition-all"
        aria-label="Search"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 border border-dark-500 rounded px-1.5 py-0.5 text-[10px] text-slate-600 font-mono">
          <span className="text-[9px]">&#8984;</span>K
        </kbd>
      </button>

      {/* Mobile search icon */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-dark-600 transition-colors"
        aria-label="Search"
      >
        <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div ref={containerRef} className="relative w-full max-w-lg bg-dark-800 border border-dark-500 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-500/50">
              <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search providers, states, or procedures..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none"
              />
              <kbd className="text-[10px] text-slate-600 border border-dark-500 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
            </div>

            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto py-2">
                {results.map((r, i) => (
                  <Link
                    key={`${r.type}-${r.href}-${i}`}
                    href={r.href}
                    onClick={() => { setOpen(false); setQuery(""); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-dark-700 transition-colors group"
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider w-14 shrink-0 ${
                      r.type === "provider" ? "text-blue-400" : r.type === "state" ? "text-green-400" : "text-purple-400"
                    }`}>
                      {r.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate group-hover:text-blue-400 transition-colors">{r.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{r.sub}</p>
                    </div>
                    {r.stat && (
                      <span className="text-xs text-slate-400 font-bold tabular-nums shrink-0">{r.stat}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-500">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-slate-600 mt-1">Try searching by provider name, NPI, state, or procedure code</p>
              </div>
            )}

            {query.length < 2 && (
              <div className="px-4 py-4 text-xs text-slate-600">
                <p>Type at least 2 characters to search providers, states, and procedures.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
