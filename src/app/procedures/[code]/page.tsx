import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, hcpcsDescription, hcpcsLabel } from "@/lib/format";
import topProcedures from "../../../../public/data/top-procedures.json";

interface Props {
  params: { code: string };
}

export async function generateStaticParams() {
  return topProcedures.map((p: any) => ({ code: p.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proc = topProcedures.find((p: any) => p.code === params.code) as any;
  const desc = hcpcsDescription(params.code) || (proc as any)?.description || '';
  const label = desc ? `${params.code} — ${desc}` : params.code;
  return {
    title: label,
    description: `Medicaid spending breakdown for HCPCS code ${params.code}${desc ? ` (${desc})` : ''}. ${proc ? `${formatMoney(proc.totalPaid)} in total payments across ${formatNumber(proc.providerCount)} providers.` : ''}`,
    openGraph: {
      title: `${label} — Medicaid Money Tracker`,
      description: `Medicaid spending analysis for procedure code ${params.code}.${desc ? ` ${desc}.` : ''} Total payments, claim volumes, and provider statistics.`,
    },
  };
}

export default function ProcedureDetailPage({ params }: Props) {
  const proc = topProcedures.find((p: any) => p.code === params.code) as any;
  const desc = hcpcsDescription(params.code) || (proc as any)?.description || '';

  if (!proc) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Procedure Not Found</h1>
        <p className="text-slate-400 mb-4">Procedure code {params.code} is not in our top 50 dataset.</p>
        <Link href="/procedures" className="text-blue-400 hover:underline font-medium">&larr; Back to procedures</Link>
      </div>
    );
  }

  const avgPerClaim = proc.totalClaims > 0 ? proc.totalPaid / proc.totalClaims : 0;
  const totalAllProcs = topProcedures.reduce((sum: number, p: any) => sum + p.totalPaid, 0);
  const pctOfTotal = (proc.totalPaid / totalAllProcs) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/procedures" className="hover:text-blue-400 transition-colors">Procedures</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{proc.code}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          <span className="font-mono">{proc.code}</span>
        </h1>
        {desc ? (
          <p className="text-lg text-slate-300">{desc}</p>
        ) : (
          <p className="text-slate-400">HCPCS Procedure Code</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10" aria-label="Procedure statistics">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">{formatMoney(proc.totalPaid)}</p>
          <p className="text-xs text-slate-600 mt-1">{pctOfTotal.toFixed(1)}% of top 50</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Total Claims</p>
          <p className="text-2xl font-bold text-blue-400">{formatNumber(proc.totalClaims)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Providers</p>
          <p className="text-2xl font-bold text-amber-400">{formatNumber(proc.providerCount)}</p>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-colors">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1.5">Avg Cost/Claim</p>
          <p className="text-2xl font-bold text-white">{formatMoney(avgPerClaim)}</p>
        </div>
      </div>

      {/* About section */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-3">About This Procedure</h2>
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <p>
            HCPCS code <span className="font-mono text-white">{proc.code}</span>
            {desc && <span> ({desc})</span>} was billed by{" "}
            <span className="text-white font-medium">{formatNumber(proc.providerCount)}</span> providers across{" "}
            <span className="text-white font-medium">{formatNumber(proc.totalClaims)}</span> claims, totaling{" "}
            <span className="text-white font-medium">{formatMoney(proc.totalPaid)}</span> in Medicaid payments from 2018&ndash;2024.
          </p>
          <p>
            The average cost per claim is <span className="text-white font-medium">{formatMoney(avgPerClaim)}</span>.
            This code accounts for <span className="text-white font-medium">{pctOfTotal.toFixed(1)}%</span> of spending
            among the top 50 procedure codes.
          </p>
        </div>
      </div>

      {/* Context for well-known codes */}
      {(proc.code === 'T1019' || proc.code === 'T2016' || proc.code === 'A0427') && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Context</h3>
          {proc.code === 'T1019' && (
            <p className="text-slate-300 text-sm leading-relaxed">
              Personal care services (T1019) is the <strong className="text-white">#1 spending code</strong> in all of Medicaid.
              Services are provided in private homes by personal care attendants, making them difficult to verify.
              The HHS OIG has consistently identified personal care as the highest fraud-risk Medicaid category
              due to the ease of inflating hours and billing for services not rendered.
            </p>
          )}
          {proc.code === 'T2016' && (
            <p className="text-slate-300 text-sm leading-relaxed">
              Residential habilitation (T2016) is a per-diem code for waiver-based residential care.
              Typical rates range from $200&ndash;400/day. Our analysis found Massachusetts DDS agencies
              billing <strong className="text-white">$13,000&ndash;15,000/day</strong> &mdash; 37&ndash;51x the median rate.
              This code is at the center of some of our most significant findings.
            </p>
          )}
          {proc.code === 'A0427' && (
            <p className="text-slate-300 text-sm leading-relaxed">
              ALS emergency ambulance transport (A0427) has a national median cost of about{' '}
              <strong className="text-white">$163 per trip</strong>. Our analysis found the City of Chicago billing{' '}
              <strong className="text-white">$1,611 per trip</strong> &mdash; nearly 10x the national average.
              Ambulance billing has been a growing area of Medicaid fraud enforcement.
            </p>
          )}
        </div>
      )}

      {/* Back link */}
      <div className="mt-4">
        <Link href="/procedures" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          &larr; All procedures
        </Link>
      </div>
    </div>
  );
}
