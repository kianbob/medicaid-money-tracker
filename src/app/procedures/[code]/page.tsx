import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import topProcedures from "../../../../public/data/top-procedures.json";

interface Props {
  params: { code: string };
}

export async function generateStaticParams() {
  return topProcedures.map((p: any) => ({ code: p.code }));
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Procedure ${params.code} — Medicaid Money Tracker`,
    description: `Medicaid spending breakdown for HCPCS procedure code ${params.code}. Total payments, claim volumes, and provider statistics.`,
  };
}

export default function ProcedureDetailPage({ params }: Props) {
  const proc = topProcedures.find((p: any) => p.code === params.code) as any;

  if (!proc) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Procedure Not Found</h1>
        <p className="text-slate-400">Procedure code {params.code} is not in our top 50 dataset.</p>
        <Link href="/procedures" className="text-blue-400 hover:underline mt-4 inline-block">← Back to procedures</Link>
      </div>
    );
  }

  const avgPerClaim = proc.totalClaims > 0 ? proc.totalPaid / proc.totalClaims : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/procedures" className="hover:text-blue-400">Procedures</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{proc.code}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">{proc.code}</h1>
      <p className="text-slate-400 mb-8">HCPCS Procedure Code</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">{formatMoney(proc.totalPaid)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Total Claims</p>
          <p className="text-2xl font-bold text-blue-400">{formatNumber(proc.totalClaims)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Providers</p>
          <p className="text-2xl font-bold text-amber-400">{formatNumber(proc.providerCount)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Avg Cost/Claim</p>
          <p className="text-2xl font-bold text-white">{formatMoney(avgPerClaim)}</p>
        </div>
      </div>

      <div className="bg-dark-700 border border-dark-500 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-3">About This Procedure</h2>
        <p className="text-slate-400 text-sm">
          HCPCS code <span className="font-mono text-white">{proc.code}</span> was billed by{" "}
          <span className="text-white">{formatNumber(proc.providerCount)}</span> providers across{" "}
          <span className="text-white">{formatNumber(proc.totalClaims)}</span> claims, totaling{" "}
          <span className="text-white">{formatMoney(proc.totalPaid)}</span> in Medicaid payments from 2018–2024.
          The average cost per claim is <span className="text-white">{formatMoney(avgPerClaim)}</span>.
        </p>
      </div>
    </div>
  );
}
