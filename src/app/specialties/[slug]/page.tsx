import Link from "next/link";
import { notFound } from 'next/navigation'
import type { Metadata } from "next";
import { formatMoney, formatNumber, formatMoneyFull } from "@/lib/format";
import specialtiesIndex from "../../../../public/data/specialties.json";
import fs from "fs";
import path from "path";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return (specialtiesIndex as any[]).slice(0, 50).map((s: any) => ({ slug: s.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = (specialtiesIndex as any[]).find((s: any) => s.slug === params.slug);
  const name = entry?.name || params.slug;
  return {
    title: `${name} Providers — Medicaid Spending`,
    description: `Browse ${entry?.providerCount || ''} ${name} providers and ${formatMoney(entry?.totalPaid || 0)} in Medicaid payments. See top billing providers, payment breakdowns, and trends.`,
    openGraph: {
      title: `${name} Providers — OpenMedicaid`,
      description: `${entry?.providerCount || ''} ${name} providers received ${formatMoney(entry?.totalPaid || 0)} in Medicaid payments.`,
    },
  };
}

function loadSpecialtyDetail(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "specialties", `${slug}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {}
  return null;
}

export default function SpecialtyDetailPage({ params }: Props) {
  const detail = loadSpecialtyDetail(params.slug);
  const indexEntry = (specialtiesIndex as any[]).find((s: any) => s.slug === params.slug);

  if (!detail && !indexEntry) {
    notFound()
  }

  const name = detail?.name || indexEntry?.name || params.slug;
  const providerCount = detail?.providerCount || indexEntry?.providerCount || 0;
  const totalPaid = detail?.totalPaid || indexEntry?.totalPaid || 0;
  const avgPaid = providerCount > 0 ? totalPaid / providerCount : 0;
  const providers = detail?.providers || [];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/specialties" className="text-blue-400 hover:text-blue-300">Specialties</Link>
          <span className="mx-2">›</span>
          <span>{name}</span>
        </div>

        <h1 className="font-serif text-4xl font-bold mb-3">{name} Providers</h1>
        <p className="text-slate-400 text-lg mb-8">
          Medicaid billing data for {providerCount.toLocaleString()} {name} providers.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-dark-700 rounded-xl p-5 border border-dark-600">
            <div className="text-slate-400 text-sm mb-1">Providers</div>
            <div className="text-2xl font-bold">{providerCount.toLocaleString()}</div>
          </div>
          <div className="bg-dark-700 rounded-xl p-5 border border-dark-600">
            <div className="text-slate-400 text-sm mb-1">Total Payments</div>
            <div className="text-2xl font-bold text-emerald-400">{formatMoney(totalPaid)}</div>
          </div>
          <div className="bg-dark-700 rounded-xl p-5 border border-dark-600">
            <div className="text-slate-400 text-sm mb-1">Avg per Provider</div>
            <div className="text-2xl font-bold text-amber-400">{formatMoney(avgPaid)}</div>
          </div>
        </div>

        {/* Provider table */}
        {providers.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Top {name} Providers by Medicaid Payments</h2>
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-600 text-slate-400 text-sm">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">Provider</th>
                    <th className="pb-3 pr-4">State</th>
                    <th className="pb-3 pr-4 text-right">Total Paid</th>
                    <th className="pb-3 pr-4 text-right">Claims</th>
                    <th className="pb-3 text-right">Beneficiaries</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p: any, i: number) => (
                    <tr key={p.npi} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                      <td className="py-3 pr-4 text-slate-500 text-sm">{i + 1}</td>
                      <td className="py-3 pr-4">
                        <Link href={`/providers/${p.npi}`} className="text-blue-400 hover:text-blue-300 font-medium">
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">{p.state}</td>
                      <td className="py-3 pr-4 text-right font-mono text-emerald-400">{formatMoney(p.totalPaid)}</td>
                      <td className="py-3 pr-4 text-right text-slate-300">{formatNumber(p.totalClaims)}</td>
                      <td className="py-3 text-right text-slate-300">{formatNumber(p.totalBeneficiaries)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Context paragraph */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-600 mb-8">
          <h3 className="text-lg font-semibold mb-2">About {name}</h3>
          <p className="text-slate-400 leading-relaxed">
            This page shows Medicaid billing data for {providerCount.toLocaleString()} providers classified under the <strong className="text-white">{name}</strong> specialty.
            Together, these providers received {formatMoneyFull(totalPaid)} in Medicaid payments, averaging {formatMoney(avgPaid)} per provider.
            Provider data is sourced from CMS Medicaid billing records (2018–2024).
          </p>
        </div>

        <div className="flex gap-6 text-sm">
          <Link href="/specialties" className="text-blue-400 hover:text-blue-300">← All Specialties</Link>
          <Link href="/providers" className="text-blue-400 hover:text-blue-300">Browse All Providers →</Link>
        </div>
      </div>
    </div>
  );
}
