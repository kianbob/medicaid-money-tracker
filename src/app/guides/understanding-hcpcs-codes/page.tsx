import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Understanding HCPCS Codes — What Medicaid Billing Codes Mean",
  description:
    "A guide to HCPCS codes used in Medicaid billing. Learn what the codes mean, how they're structured, and which ones are most commonly associated with fraud.",
};

const codeCategories = [
  { prefix: "99xxx", name: "E/M Codes", desc: "Evaluation & Management — office visits, hospital care, consultations. The backbone of outpatient billing.", example: "99213 = Established patient office visit, moderate complexity", color: "text-blue-400" },
  { prefix: "Txxxx", name: "T-Codes", desc: "State Medicaid-specific codes not covered by national HCPCS. Includes personal care, transportation, habilitation.", example: "T1019 = Personal care services, per 15 min ($86.9B total)", color: "text-green-400" },
  { prefix: "Hxxxx", name: "H-Codes", desc: "Behavioral health services — mental health, substance abuse, community support programs.", example: "H2015 = Comprehensive community support, per 15 min", color: "text-purple-400" },
  { prefix: "Jxxxx", name: "J-Codes", desc: "Injectable drugs administered by providers. These reflect actual drug costs, not provider markup.", example: "J2326 = Nusinersen injection — $92,158 per claim average", color: "text-amber-400" },
  { prefix: "Axxxx", name: "A-Codes", desc: "Ambulance services and medical supplies — transport, catheters, test strips, DME supplies.", example: "A0427 = Ambulance service, ALS emergency transport", color: "text-red-400" },
  { prefix: "Exxxx", name: "E-Codes", desc: "Durable Medical Equipment (DME) — wheelchairs, hospital beds, CPAP machines, oxygen.", example: "E0601 = CPAP device for sleep apnea", color: "text-cyan-400" },
];

const fraudCodes = [
  { code: "T1019", name: "Personal care services", spending: "$86.9B", risk: "Largest single code. Home care agencies billing billions — hard to verify services delivered." },
  { code: "T2016", name: "Habilitation, residential", spending: "$6.8B", risk: "MA DDS entities billing 37-51× national median. Per-diem rates can mask overbilling." },
  { code: "H2015", name: "Community support services", spending: "$2.1B", risk: "15-minute increments are easy to inflate. CARES INC bills 5.8× median for this code." },
  { code: "U0003", name: "COVID-19 testing", spending: "$3.9B", risk: "Pandemic-era code that generated massive billing. Some providers billed thousands of tests." },
  { code: "A0427", name: "ALS ambulance transport", spending: "$1.8B", risk: "City of Chicago bills $1,611 per trip vs $163 national median. Transport fraud is well-documented." },
];

export default function HcpcsCodesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Guides</span>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Understanding HCPCS Codes</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Guide</p>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Understanding HCPCS Codes
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          What Medicaid billing codes mean, how they&apos;re structured, and which ones are most commonly associated with fraud.
        </p>
      </div>

      {/* What Are HCPCS Codes */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">What Are HCPCS Codes?</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            HCPCS (Healthcare Common Procedure Coding System) codes are the standardized billing codes used for Medicaid and Medicare claims. Every service, procedure, drug, or supply billed to Medicaid has a corresponding HCPCS code.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Our dataset contains <span className="text-white font-semibold">10,881 unique HCPCS codes</span> across 227 million billing records. Understanding what these codes represent is essential for interpreting billing patterns and fraud signals.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Codes fall into two levels: <span className="text-white font-semibold">Level I</span> (CPT codes, 5 digits, for physician services) and <span className="text-white font-semibold">Level II</span> (letter + 4 digits, for supplies, drugs, ambulance, and state-specific services).
          </p>
        </div>
      </section>

      {/* Code Categories */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Code Categories</h2>
        <div className="space-y-3">
          {codeCategories.map((cat) => (
            <div key={cat.prefix} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
              <div className="flex items-baseline gap-3 mb-2">
                <span className={`font-mono text-sm font-bold ${cat.color}`}>{cat.prefix}</span>
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">{cat.desc}</p>
              <p className="text-[11px] text-slate-500 italic">Example: {cat.example}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fraud-Prone Codes */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Codes Most Associated with Billing Anomalies</h2>
        <p className="text-sm text-slate-400 mb-4">
          These codes appear most frequently in our flagged provider analysis. Having billing anomalies on these codes doesn&apos;t prove fraud — but these are the codes where unusual patterns are most common.
        </p>
        <div className="space-y-3">
          {fraudCodes.map((fc) => (
            <Link key={fc.code} href={`/procedures/${fc.code}`} className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{fc.code}</span>
                    <span className="text-xs text-white font-semibold">{fc.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{fc.risk}</p>
                </div>
                <span className="text-sm font-bold text-white shrink-0">{fc.spending}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Explore All Procedure Codes</h2>
        <p className="text-sm text-slate-400 mb-5">Browse 10,881 HCPCS codes with national benchmarks, top providers, and spending data.</p>
        <Link href="/procedures" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          Browse Procedures →
        </Link>
      </section>
    </div>
  );
}
