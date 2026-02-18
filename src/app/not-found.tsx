"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/lookup?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-8xl font-extrabold text-dark-500 mb-4">404</p>
      <h1 className="font-headline text-2xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-slate-400 mb-10 max-w-md mx-auto">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Search box */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search providers by name or NPI..."
            className="flex-1 bg-dark-800 border border-dark-500/50 border-r-0 rounded-l-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-r-lg transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestion links grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
        <Link
          href="/lookup"
          className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-blue-500/30 hover:bg-dark-700 transition-colors group"
        >
          <svg className="w-6 h-6 text-blue-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Search Providers</p>
        </Link>
        <Link
          href="/watchlist"
          className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-red-500/30 hover:bg-dark-700 transition-colors group"
        >
          <svg className="w-6 h-6 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
          <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">Risk Watchlist</p>
        </Link>
        <Link
          href="/states"
          className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-amber-500/30 hover:bg-dark-700 transition-colors group"
        >
          <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Browse States</p>
        </Link>
        <Link
          href="/insights"
          className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-purple-500/30 hover:bg-dark-700 transition-colors group"
        >
          <svg className="w-6 h-6 text-purple-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">Investigations</p>
        </Link>
      </div>
    </div>
  );
}
