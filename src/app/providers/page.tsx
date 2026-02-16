import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber } from "@/lib/format";
import topProviders from "../../../public/data/top-providers.json";

export const metadata: Metadata = {
  title: "Top Medicaid Providers",
  description: "The highest-spending Medicaid providers from 2018-2024. Explore who receives the most taxpayer healthcare dollars, sorted by total payments received.",
  openGraph: {
    title: "Top Medicaid Providers — Medicaid Money Tracker",
    description: "Explore the top Medicaid providers by total spending. See who receives the most taxpayer healthcare dollars across 617,000+ providers.",
  },
};

export default function ProvidersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Top Providers</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Top Medicaid Providers</h1>
      <p className="text-lg text-slate-400 mb-10 max-w-3xl leading-relaxed">
        The highest-spending Medicaid providers from 2018&ndash;2024, ranked by total payments received.
        Click any provider to see their full spending profile and procedure breakdown.
      </p>

      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500 bg-dark-800/50">
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">#</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Specialty</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Location</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Paid</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:table-cell">Claims</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden lg:table-cell">Beneficiaries</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden lg:table-cell">Procedures</th>
              </tr>
            </thead>
            <tbody>
              {topProviders.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                  <td className="px-4 py-3 text-slate-600 font-bold">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/providers/${p.npi}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                      {p.name || `NPI: ${p.npi}`}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">NPI: {p.npi}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell max-w-[200px] truncate">{p.specialty || '\u2014'}</td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                    {p.city ? `${p.city}, ${p.state}` : '\u2014'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white font-semibold">{formatMoney(p.totalPaid)}</td>
                  <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">{formatNumber(p.totalClaims)}</td>
                  <td className="px-4 py-3 text-right text-slate-400 hidden lg:table-cell">{formatNumber(p.totalBenes)}</td>
                  <td className="px-4 py-3 text-right text-slate-400 hidden lg:table-cell">{p.procCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
