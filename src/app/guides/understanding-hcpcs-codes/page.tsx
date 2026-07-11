import type { Metadata } from "next";
import Link from "next/link";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "HCPCS Codes Explained: Medicaid Billing Guide",
  description:
    "What do 10,881 Medicaid billing codes actually mean? See every category decoded plus the 5 codes most linked to fraud anomalies.",
  openGraph: {
    title: "HCPCS Codes Explained: Medicaid Billing Guide",
    description:
      "What do 10,881 Medicaid billing codes actually mean? See every category decoded plus the 5 codes most linked to fraud anomalies.",
  },
};

const codeCategories = [
  { prefix: "99xxx", name: "E/M Codes", desc: "Evaluation & Management — office visits, hospital care, consultations. The backbone of outpatient billing.", example: "99213 = Established patient office visit, moderate complexity", color: "text-blue-400" },
  { prefix: "Txxxx", name: "T-Codes", desc: "State Medicaid-specific codes not covered by national HCPCS. Includes personal care, transportation, habilitation.", example: "T1019 = Personal care services, per 15 min ($86.9B total)", color: "text-green-400" },
  { prefix: "Hxxxx", name: "H-Codes", desc: "Behavioral health services — mental health, substance abuse, community support programs.", example: "H2015 = Comprehensive community support, per 15 min", color: "text-purple-400" },
  { prefix: "Jxxxx", name: "J-Codes", desc: "Injectable drugs administered by providers. These reflect actual drug costs, not provider markup.", example: "J2326 = Nusinersen injection — $92,158 per claim average", color: "text-amber-400" },
  { prefix: "Axxxx", name: "A-Codes", desc: "Ambulance services and medical supplies — transport, catheters, test strips, DME supplies.", example: "A0427 = Ambulance service, ALS emergency transport", color: "text-red-400" },
  { prefix: "Exxxx", name: "E-Codes", desc: "Durable Medical Equipment (DME) — wheelchairs, hospital beds, CPAP machines, oxygen.", example: "E0601 = CPAP device for sleep apnea", color: "text-cyan-400" },
];

const additionalCategories = [
  { prefix: "1xxxx", name: "CPT Surgery Codes", desc: "Surgical procedures — from minor skin excisions to complex cardiac surgery. Level I CPT codes assigned by the AMA.", example: "10021 = Fine needle aspiration biopsy", color: "text-pink-400" },
  { prefix: "7xxxx", name: "Radiology & Imaging", desc: "X-rays, CT scans, MRIs, ultrasounds, and nuclear medicine. Includes both technical and professional components.", example: "71046 = Chest X-ray, 2 views", color: "text-teal-400" },
  { prefix: "8xxxx", name: "Pathology & Lab", desc: "Laboratory tests, blood panels, tissue pathology, and genetic testing. High-volume, low per-unit cost codes.", example: "80053 = Comprehensive metabolic panel", color: "text-orange-400" },
  { prefix: "9xxxx", name: "Medicine & Therapy", desc: "Non-surgical medical services — physical therapy, occupational therapy, vaccinations, psychiatry, dialysis.", example: "90834 = Psychotherapy, 45 minutes", color: "text-indigo-400" },
  { prefix: "Gxxxx", name: "G-Codes", desc: "CMS temporary national codes for services not yet assigned permanent codes. Used heavily in telehealth and quality reporting.", example: "G2012 = Virtual check-in by physician", color: "text-lime-400" },
  { prefix: "Sxxxx", name: "S-Codes", desc: "Temporary codes for services not described by existing codes. Used by private payers and some state Medicaid programs.", example: "S5121 = Attendant care services, in-home (grew 8,935%)", color: "text-rose-400" },
];

const fraudCodes = [
  { code: "T1019", name: "Personal care services", spending: "$86.9B", risk: "Largest single code. Home care agencies billing billions — hard to verify services delivered." },
  { code: "T2016", name: "Habilitation, residential", spending: "$6.8B", risk: "MA DDS entities billing 37-51× national median. Per-diem rates can mask overbilling." },
  { code: "H2015", name: "Community support services", spending: "$2.1B", risk: "15-minute increments are easy to inflate. CARES INC bills 5.8× median for this code." },
  { code: "U0003", name: "COVID-19 testing", spending: "$3.9B", risk: "Pandemic-era code that generated massive billing. Some providers billed thousands of tests." },
  { code: "A0427", name: "ALS ambulance transport", spending: "$1.8B", risk: "City of Chicago bills $1,611 per trip vs $163 national median. Transport fraud is well-documented." },
];

const commonErrors = [
  { error: "Upcoding", desc: "Billing a higher-complexity E/M code than the visit justified. For example, billing 99215 (high complexity) for a routine follow-up that should be 99213 (moderate).", icon: "⬆️" },
  { error: "Unbundling", desc: "Billing separately for services that should be billed as a single bundled code. Breaks one procedure into multiple codes to increase reimbursement.", icon: "🔓" },
  { error: "Modifier Misuse", desc: "Adding modifiers like -25 (significant, separately identifiable E/M service) to justify billing for visits that don't meet the criteria.", icon: "🏷️" },
  { error: "Phantom Billing", desc: "Billing for services that were never provided. Particularly common with home care codes (T1019) where verification is difficult.", icon: "👻" },
  { error: "Duplicate Claims", desc: "Submitting the same claim multiple times, sometimes with slight modifications to avoid duplicate detection systems.", icon: "📋" },
  { error: "Wrong Place of Service", desc: "Billing under a place-of-service code with higher reimbursement rates. For example, billing an office visit as a hospital outpatient visit.", icon: "📍" },
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

      {/* How Codes Are Structured */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">How HCPCS Codes Are Structured</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Every HCPCS code is exactly 5 characters. The first character tells you what type of code it is:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-dark-700/50 rounded-lg p-3">
              <p className="text-xs font-bold text-blue-400 mb-1">Level I — CPT Codes</p>
              <p className="text-xs text-slate-400">5 digits (00100–99499). Created by the AMA. Cover physician services, surgery, radiology, pathology, and evaluation/management.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3">
              <p className="text-xs font-bold text-green-400 mb-1">Level II — National Codes</p>
              <p className="text-xs text-slate-400">Letter + 4 digits (A0000–V9999). Created by CMS. Cover ambulance, DME, drugs, prosthetics, and state-specific services.</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Modifiers (two additional characters) can change how a code is interpreted. For example, modifier <span className="font-mono text-white">-25</span> indicates a significant, separately identifiable E/M service on the same day as another procedure. Modifier abuse is one of the most common billing errors in Medicaid.
          </p>
        </div>
      </section>

      {/* Primary Code Categories */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Primary Code Categories</h2>
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

      {/* Additional Code Categories */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Additional Code Categories</h2>
        <p className="text-sm text-slate-400 mb-4">
          Beyond the primary categories, these code ranges appear frequently in Medicaid billing data:
        </p>
        <div className="space-y-3">
          {additionalCategories.map((cat) => (
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

      {/* E/M Code Deep Dive */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">E/M Codes: The Most Common Category</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Evaluation and Management (E/M) codes (99201–99499) represent the most frequently billed category in Medicaid. They cover every type of patient encounter — from a 10-minute office visit to a complex hospital admission.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            E/M codes are tiered by complexity:
          </p>
          <div className="space-y-2 mb-4">
            {[
              { code: "99211", level: "Level 1", desc: "Minimal problem — nurse visit, no physician required", cost: "~$25" },
              { code: "99212", level: "Level 2", desc: "Straightforward problem — brief physician encounter", cost: "~$50" },
              { code: "99213", level: "Level 3", desc: "Low-moderate complexity — most common office visit", cost: "~$95" },
              { code: "99214", level: "Level 4", desc: "Moderate-high complexity — multiple conditions", cost: "~$140" },
              { code: "99215", level: "Level 5", desc: "High complexity — comprehensive evaluation needed", cost: "~$195" },
            ].map((em) => (
              <div key={em.code} className="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
                <span className="font-mono text-xs font-bold text-blue-400 w-14">{em.code}</span>
                <span className="text-xs font-semibold text-white w-16">{em.level}</span>
                <span className="text-xs text-slate-400 flex-1">{em.desc}</span>
                <span className="text-xs text-slate-500 font-mono">{em.cost}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="text-white font-semibold">Why this matters for fraud:</span> &ldquo;Upcoding&rdquo; — billing a higher-level E/M code than justified — is the single most common Medicaid fraud scheme. A provider who bills 99215 for 80% of visits when the national average is 15% warrants scrutiny.
          </p>
        </div>
      </section>

      {/* How Codes Relate to Fraud Detection */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">How HCPCS Codes Relate to Fraud Detection</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            HCPCS codes are central to fraud detection because they create a standardized benchmark. When every provider uses the same code for the same service, we can compare billing patterns across millions of claims.
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Cost-Per-Claim Comparison</h3>
              <p className="text-xs text-slate-400 leading-relaxed">For each HCPCS code, we calculate a national median cost per claim. Providers billing 3× or more the median for the same code are flagged for review. This catches inflated billing while accounting for regional cost differences.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Code Distribution Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Legitimate providers bill a natural distribution of codes. A physician who only bills the highest-complexity E/M code (99215) or a DME supplier with 95% of billing on one supply code may be gaming the system.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Procedure-to-Specialty Mismatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">When a provider&apos;s specialty doesn&apos;t match their billing codes — like a podiatrist billing cardiology procedures — it triggers an anomaly flag. HCPCS codes make these mismatches detectable at scale.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Volume Outlier Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Some codes have natural volume limits. A single provider billing 50 surgeries per day, or 200 therapy sessions per week, exceeds what&apos;s physically possible — and HCPCS codes make that math simple.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Billing Errors */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Common Billing Errors &amp; Fraud Schemes</h2>
        <p className="text-sm text-slate-400 mb-4">
          These are the most common ways HCPCS codes are misused — whether through error or intent:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {commonErrors.map((err) => (
            <div key={err.error} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{err.icon}</span>
                <h3 className="text-sm font-bold text-white">{err.error}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{err.desc}</p>
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

      {/* How to Look Up a Code */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">How to Look Up Any HCPCS Code</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            On OpenMedicaid, every HCPCS code has its own page showing national spending, top providers, and per-claim benchmarks. Here&apos;s how to use them:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-l-green-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">1. Search by Code</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Enter any 5-character HCPCS code in the search bar or browse the procedures page. Each code page shows total national spending, number of providers, and average cost per claim.</p>
            </div>
            <div className="border-l-4 border-l-green-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">2. Check the National Median</h3>
              <p className="text-xs text-slate-400 leading-relaxed">The national median cost per claim is the benchmark. If a provider bills 3× or more above this median, it&apos;s worth investigating why.</p>
            </div>
            <div className="border-l-4 border-l-green-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">3. Review Top Providers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Each code page lists the highest-billing providers for that code. Look for patterns: are the top billers flagged? Are they concentrated in one state?</p>
            </div>
          </div>
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

      {/* Related Guides */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">Related Guides</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/guides/how-medicaid-fraud-works" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">How Medicaid Fraud Works</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Common schemes, red flags, and how data analysis can detect them.</p>
          </Link>
          <Link href="/guides/top-billing-codes" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">Top Medicaid Billing Codes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">The highest-spending HCPCS codes explained in plain English with fraud risk levels.</p>
          </Link>
          <Link href="/guides/reading-medicaid-billing" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">How to Read a Medicaid Billing Record</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Understand NPIs, claims, beneficiaries, and what the numbers mean on provider profiles.</p>
          </Link>
          <Link href="/guides/medicaid-fraud-by-state" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">Medicaid Fraud by State</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Which states have the most flagged providers and biggest spending anomalies.</p>
          </Link>
        </div>
      </section>

      <FAQSchema faqs={[
        { question: "What is a HCPCS code in Medicaid billing?", answer: "HCPCS (Healthcare Common Procedure Coding System) codes are standardized 5-character codes used to identify medical services, procedures, drugs, and supplies billed to Medicaid and Medicare. Level I codes (CPT) are 5 digits for physician services, while Level II codes start with a letter and cover ambulance, DME, drugs, and state-specific services." },
        { question: "How many HCPCS codes are used in Medicaid?", answer: "Our dataset contains 10,881 unique HCPCS codes across 227 million Medicaid billing records. These range from common office visit codes (99213) to specialized drug injection codes (J-codes) and state-specific service codes (T-codes)." },
        { question: "Which HCPCS codes are most associated with Medicaid fraud?", answer: "The codes most frequently flagged in our analysis include T1019 (personal care services, $86.9B total), T2016 (residential habilitation, $6.8B), H2015 (community support, $2.1B), U0003 (COVID testing, $3.9B), and A0427 (ALS ambulance transport, $1.8B). These codes appear frequently due to high billing volumes and difficulty verifying service delivery." },
        { question: "What is upcoding in Medicaid billing?", answer: "Upcoding is billing a higher-complexity code than the service actually provided. For example, billing a 99215 (high-complexity visit, ~$195) when the visit only justified a 99213 (moderate complexity, ~$95). It is the most common Medicaid fraud scheme and is detectable by comparing a provider's code distribution to peer averages." },
        { question: "What is the difference between Level I and Level II HCPCS codes?", answer: "Level I codes are CPT (Current Procedural Terminology) codes — 5-digit numeric codes created by the AMA for physician services, surgery, radiology, and pathology. Level II codes start with a letter followed by 4 digits and are maintained by CMS for ambulance services, durable medical equipment, drugs, prosthetics, and state Medicaid-specific services." },
      ]} />
    </div>
  );
}
