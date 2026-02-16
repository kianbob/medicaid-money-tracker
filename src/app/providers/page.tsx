import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import topProviders from "../../../public/data/top-providers.json";

export const metadata = {
  title: "Top Medicaid Providers — Medicaid Money Tracker",
  description: "Explore the top Medicaid providers by total spending. See who receives the most taxpayer healthcare dollars.",
};

export default function ProvidersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-4">🏥 Top Medicaid Providers</h1>
      <p className="text-lg text-slate-400 mb-10 max-w-3xl">
        The highest-spending Medicaid providers from 2018–2024, ranked by total payments received.
      </p>

      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">#</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Provider</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Specialty</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Location</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Total Paid</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden sm:table-cell">Claims</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden lg:table-cell">Beneficiaries</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden lg:table-cell">Procedures</th>
              </tr>
            </thead>
            <tbody>
              {topProviders.map((p: any, i: number) => (
                <tr key={p.npi} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-bold">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/providers/${p.npi}`} className="text-white font-medium hover:text-blue-400">
                      {p.name || `NPI: ${p.npi}`}
                    </Link>
                    <p className="text-xs text-slate-500">NPI: {p.npi}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">{p.specialty || '—'}</td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                    {p.city ? `${p.city}, ${p.state}` : '—'}
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
