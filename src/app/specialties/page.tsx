"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMoney, formatNumber } from "@/lib/format";
import specialties from "../../../public/data/specialties.json";

export default function SpecialtiesPage() {
  const data = specialties as any[];
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"spending" | "providers" | "name">("spending");

  const totalProviders = data.reduce((s: number, d: any) => s + d.providerCount, 0);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s: any) => s.name.toLowerCase().includes(q));
    }
    if (sortBy === "name") return [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "providers") return [...result].sort((a, b) => b.providerCount - a.providerCount);
    return [...result].sort((a, b) => b.totalPaid - a.totalPaid);
  }, [data, search, sortBy]);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold mb-3">Browse Providers by Specialty</h1>
        <p className="text-slate-400 text-lg mb-8">
          {data.length.toLocaleString()} medical specialties across {totalProviders.toLocaleString()} Medicaid providers.
          Explore billing patterns and top providers by specialty.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search specialties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-4 py-2 text-white placeholder-slate-500 flex-1"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-4 py-2 text-white"
          >
            <option value="spending">Sort by Spending</option>
            <option value="providers">Sort by Provider Count</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-600 text-slate-400 text-sm">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Specialty</th>
                <th className="pb-3 pr-4 text-right">Providers</th>
                <th className="pb-3 text-right">Total Medicaid Payments</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: any, i: number) => (
                <tr key={s.slug} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                  <td className="py-3 pr-4 text-slate-500 text-sm">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <Link href={`/specialties/${s.slug}`} className="text-blue-400 hover:text-blue-300 font-medium">
                      {s.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-right text-slate-300">{formatNumber(s.providerCount)}</td>
                  <td className="py-3 text-right font-mono text-emerald-400">{formatMoney(s.totalPaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <Link href="/providers" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Browse All Providers
          </Link>
        </div>
      </div>
    </div>
  );
}
