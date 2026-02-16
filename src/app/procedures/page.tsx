import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, hcpcsDescription } from "@/lib/format";
import topProcedures from "../../../public/data/top-procedures.json";

export const metadata: Metadata = {
  title: "Procedure Explorer",
  description: "Top 50 HCPCS procedure codes by total Medicaid spending (2018-2024). See which healthcare services cost taxpayers the most, from personal care to emergency transport.",
  openGraph: {
    title: "Procedure Explorer — Medicaid Money Tracker",
    description: "Explore the top 50 Medicaid procedure codes by spending. Personal care services alone account for $122.7 billion.",
  },
};

export default function ProceduresPage() {
  const totalSpending = topProcedures.reduce((sum: number, p: any) => sum + p.totalPaid, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Procedures</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Procedure Explorer</h1>
      <p className="text-lg text-slate-400 mb-10 max-w-3xl leading-relaxed">
        Top 50 HCPCS procedure codes by total Medicaid spending (2018&ndash;2024). These codes represent
        <strong className="text-white"> {formatMoney(totalSpending)}</strong> in payments.
        Click any code for details.
      </p>

      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500 bg-dark-800/50">
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">#</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Procedure</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Paid</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:table-cell">Total Claims</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Providers</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden md:table-cell">Avg Cost/Claim</th>
                <th scope="col" className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold hidden lg:table-cell">% of Top 50</th>
              </tr>
            </thead>
            <tbody>
              {topProcedures.map((p: any, i: number) => {
                const desc = hcpcsDescription(p.code) || (p as any).description || '';
                return (
                  <tr key={p.code} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3 text-slate-600 font-bold">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/procedures/${p.code}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                        <span className="font-mono text-base">{p.code}</span>
                      </Link>
                      {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white font-semibold">{formatMoney(p.totalPaid)}</td>
                    <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">{formatNumber(p.totalClaims)}</td>
                    <td className="px-4 py-3 text-right text-slate-400 hidden md:table-cell">{formatNumber(p.providerCount)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400 hidden md:table-cell">{formatMoney(p.avgCostPerClaim || 0)}</td>
                    <td className="px-4 py-3 text-right text-slate-400 hidden lg:table-cell">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-dark-500 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (p.totalPaid / topProcedures[0].totalPaid) * 100)}%` }} />
                        </div>
                        <span className="text-xs w-10 text-right">{((p.totalPaid / totalSpending) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
