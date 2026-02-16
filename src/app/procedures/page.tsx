import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import topProcedures from "../../../public/data/top-procedures.json";

export const metadata = {
  title: "Procedure Explorer — Medicaid Money Tracker",
  description: "Explore the top Medicaid procedure codes by total spending. See which healthcare services cost taxpayers the most.",
};

export default function ProceduresPage() {
  const totalSpending = topProcedures.reduce((sum: number, p: any) => sum + p.totalPaid, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-4">💊 Procedure Explorer</h1>
      <p className="text-lg text-slate-400 mb-10 max-w-3xl">
        Top 50 HCPCS procedure codes by total Medicaid spending (2018–2024). These codes represent 
        <span className="text-white font-semibold"> {formatMoney(totalSpending)}</span> in payments.
      </p>

      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">#</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Procedure Code</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500">Total Paid</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden sm:table-cell">Total Claims</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Providers</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Avg Cost/Claim</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 hidden lg:table-cell">% of Top 50</th>
              </tr>
            </thead>
            <tbody>
              {topProcedures.map((p: any, i: number) => (
                <tr key={p.code} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-bold">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/procedures/${p.code}`} className="font-mono text-white font-medium hover:text-blue-400 text-base">
                      {p.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white font-semibold">{formatMoney(p.totalPaid)}</td>
                  <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">{formatNumber(p.totalClaims)}</td>
                  <td className="px-4 py-3 text-right text-slate-400 hidden md:table-cell">{formatNumber(p.providerCount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400 hidden md:table-cell">{formatMoney(p.avgCostPerClaim || 0)}</td>
                  <td className="px-4 py-3 text-right text-slate-400 hidden lg:table-cell">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-dark-500 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (p.totalPaid / topProcedures[0].totalPaid) * 100)}%` }} />
                      </div>
                      <span className="text-xs w-10 text-right">{((p.totalPaid / totalSpending) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
