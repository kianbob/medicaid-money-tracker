import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Top Medicaid Billing Codes — Highest-Spending HCPCS Codes Explained",
  description:
    "The most expensive Medicaid billing codes by total spending. What each code means, who bills them, and which ones carry the highest fraud risk.",
  openGraph: {
    title: "Top Medicaid Billing Codes — OpenMedicaid",
    description:
      "The highest-spending HCPCS codes in Medicaid, explained in plain English.",
  },
};

const topCodes = [
  {
    code: "T1019",
    name: "Personal Care Services (per 15 min)",
    spending: 86_900_000_000,
    providers: 28000,
    risk: "high",
    riskNote: "Largest single code by spending. Dominated by NYC home care agencies. High fraud risk due to difficulty verifying in-home services.",
    link: "/insights/ny-home-care",
  },
  {
    code: "T1020",
    name: "Personal Care Services (per diem)",
    spending: 13_100_000_000,
    providers: 4200,
    risk: "medium",
    riskNote: "Per-diem version of personal care. Large billing per claim makes outliers more impactful.",
    link: null,
  },
  {
    code: "99213",
    name: "Office Visit, Established Patient (Low-Mod)",
    spending: 7_200_000_000,
    providers: 120000,
    risk: "low",
    riskNote: "Most commonly billed office visit code. Extremely high volume but low per-claim cost makes fraud less impactful per instance.",
    link: null,
  },
  {
    code: "T2016",
    name: "Habilitation, Residential (per diem)",
    spending: 6_800_000_000,
    providers: 3100,
    risk: "high",
    riskNote: "Massachusetts DDS entities bill 37-51× the national median for this code. One of our highest-confidence fraud signals.",
    link: null,
  },
  {
    code: "99214",
    name: "Office Visit, Established Patient (Mod-High)",
    spending: 5_900_000_000,
    providers: 95000,
    risk: "low",
    riskNote: "Second most common office visit code. Often scrutinized for upcoding from 99213.",
    link: null,
  },
  {
    code: "U0003",
    name: "COVID-19 Testing (Infectious Agent Detection)",
    spending: 3_900_000_000,
    providers: 15000,
    risk: "high",
    riskNote: "Generated $3.9B during the pandemic. Some providers billed extraordinary volumes. LabCorp alone: $174M.",
    link: "/insights/covid-testing",
  },
  {
    code: "S5126",
    name: "Attendant Care Services (per diem)",
    spending: 3_200_000_000,
    providers: 2800,
    risk: "medium",
    riskNote: "Home-based attendant care. Similar fraud risks to T1019 — difficulty verifying services delivered in private settings.",
    link: null,
  },
  {
    code: "J2326",
    name: "Nusinersen (Spinraza) Injection",
    spending: 1_800_000_000,
    providers: 450,
    risk: "low",
    riskNote: "The most expensive single procedure at $92,158 per claim. Legitimate specialty drug for spinal muscular atrophy. High cost reflects drug pricing, not fraud.",
    link: "/insights/specialty-drugs",
  },
  {
    code: "H2015",
    name: "Comprehensive Community Support (per 15 min)",
    spending: 1_500_000_000,
    providers: 4800,
    risk: "medium",
    riskNote: "Community-based behavioral health services. Wide variation in billing rates across states and provider types.",
    link: null,
  },
  {
    code: "A0427",
    name: "Ambulance, Advanced Life Support (Emergency)",
    spending: 1_200_000_000,
    providers: 8500,
    risk: "medium",
    riskNote: "Emergency ambulance transport. City of Chicago bills $1,611 per trip vs $163 national median — a 10× outlier.",
    link: null,
  },
];

function riskBadge(risk: string) {
  if (risk === "high") return "bg-red-500/20 text-red-400";
  if (risk === "medium") return "bg-amber-500/20 text-amber-400";
  return "bg-green-500/20 text-green-400";
}

export default function TopBillingCodesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Guides</span>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Top Billing Codes</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Guide</p>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Top Medicaid Billing Codes
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          The 10 highest-spending HCPCS procedure codes in Medicaid, what they mean in plain English, and which ones carry the highest fraud risk.
        </p>
      </div>

      <div className="space-y-4">
        {topCodes.map((code, i) => (
          <div key={code.code} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-slate-700 tabular-nums">{i + 1}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/procedures/${code.code}`} className="font-mono text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                      {code.code}
                    </Link>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskBadge(code.risk)}`}>
                      {code.risk} risk
                    </span>
                  </div>
                  <p className="text-sm text-white font-semibold mt-0.5">{code.name}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-white tabular-nums">{formatMoney(code.spending)}</p>
                <p className="text-[10px] text-slate-500">{code.providers.toLocaleString()} providers</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {code.riskNote}
              {code.link && (
                <>
                  {" "}<Link href={code.link} className="text-blue-400 hover:underline">Read investigation &rarr;</Link>
                </>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/procedures" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Browse all 10,881 procedure codes &rarr;
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/watchlist" className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
          View the Risk Watchlist &rarr;
        </Link>
      </div>
    </div>
  );
}
