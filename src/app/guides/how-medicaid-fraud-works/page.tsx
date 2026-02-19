import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Medicaid Fraud Works — Common Schemes & Detection Methods",
  description:
    "An overview of common Medicaid fraud schemes, how they work, and how data analysis can detect them. Based on analysis of 227 million billing records.",
  openGraph: {
    title: "How Medicaid Fraud Works",
    description:
      "Common Medicaid fraud schemes, red flags, and how data analysis can detect them.",
  },
};

const fraudSchemes = [
  {
    name: "Phantom Billing",
    icon: "👻",
    desc: "Billing for services, procedures, or supplies that were never actually provided to a patient. This is the most straightforward form of fraud — pure fabrication of claims.",
    example: "A provider submits claims for 50 home health visits that never occurred.",
  },
  {
    name: "Upcoding",
    icon: "⬆️",
    desc: "Billing for a more expensive service or procedure than what was actually provided. By substituting higher-paying billing codes, providers can dramatically inflate their reimbursements.",
    example: "Billing a comprehensive office visit (99215) when only a basic visit (99213) occurred.",
  },
  {
    name: "Unbundling",
    icon: "📦",
    desc: "Splitting services that should be billed as a single bundled code into multiple separate charges to increase total reimbursement.",
    example: "Billing lab tests individually instead of as a panel, charging 3× more than the bundled rate.",
  },
  {
    name: "Kickbacks & Referral Schemes",
    icon: "🤝",
    desc: "Paying or receiving payment for patient referrals. Federal anti-kickback laws prohibit any form of compensation for referring Medicaid patients.",
    example: "A lab paying doctors $50 per patient referral for unnecessary blood tests.",
  },
  {
    name: "Patient Churning",
    icon: "🔄",
    desc: "Scheduling unnecessary return visits or repeat services to generate additional billable claims. Patients may not realize they\u2019re being used to pad billing.",
    example: "Requiring weekly visits for a condition that only needs monthly monitoring.",
  },
  {
    name: "Identity Fraud",
    icon: "🎭",
    desc: "Using stolen patient identities or Medicaid numbers to bill for services. Sometimes involves enrolling fake patients or billing for deceased individuals.",
    example: "A provider billing under 200 patient IDs, many of whom have never visited the facility.",
  },
];

export default function HowMedicaidFraudWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Guides</span>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">How Medicaid Fraud Works</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Guide</p>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          How Medicaid Fraud Works
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          Common schemes, red flags, and how data analysis can detect them.
        </p>
      </div>

      {/* Scale of the Problem */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">The Scale of the Problem</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Medicaid fraud is estimated to cost taxpayers <span className="text-white font-semibold">$100 billion or more annually</span> — roughly 10% of total program spending. The HHS Office of Inspector General (OIG) recovers less than 5% of that each year.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The problem is structural: Medicaid processes billions of claims per year through a fee-for-service model that pays providers for each service billed. This creates inherent incentives to over-bill. With 617,000+ active providers and 10,000+ billing codes, manual auditing can only catch a fraction of abuse.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            That&apos;s why data-driven detection matters. By analyzing <span className="text-white font-semibold">227 million billing records</span> at scale, patterns emerge that would be invisible to traditional auditing. Our analysis flagged <Link href="/watchlist" className="text-blue-400 hover:underline">1,860 providers</Link> with unusual billing patterns worth investigating.
          </p>
        </div>
      </section>

      {/* Common Fraud Schemes */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Common Fraud Schemes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {fraudSchemes.map((scheme) => (
            <div key={scheme.name} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{scheme.icon}</span>
                <h3 className="text-sm font-bold text-white">{scheme.name}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{scheme.desc}</p>
              <p className="text-[11px] text-slate-500 italic border-t border-dark-500/50 pt-2">
                Example: {scheme.example}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How Data Detects Fraud */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">How Data Analysis Detects Fraud</h2>
        <div className="space-y-4">
          <div className="bg-dark-800 border-l-4 border-l-blue-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Statistical Testing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We run <span className="text-white font-semibold">13 statistical tests</span> that compare each provider&apos;s billing against national benchmarks for their specific procedure codes. Tests include cost outlier detection, billing swing analysis, new entrant monitoring, and rate outlier identification. Providers are flagged when their patterns deviate significantly from peers billing the same codes.{" "}
              <Link href="/analysis" className="text-blue-400 hover:underline">Read full methodology &rarr;</Link>
            </p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-purple-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Machine Learning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our <span className="text-white font-semibold">Random Forest ML model</span> (AUC 0.77) was trained on 514 providers confirmed as fraudulent by the OIG Exclusion List. It scores every provider on how similar their billing patterns are to known fraud cases — catching subtle multi-feature patterns that rule-based tests might miss.{" "}
              <Link href="/ml-analysis" className="text-blue-400 hover:underline">Learn about the ML model &rarr;</Link>
            </p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-amber-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Advanced Techniques</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We also apply Benford&apos;s Law analysis (digit distribution anomalies), CUSUM change-point detection (sudden billing shifts), billing velocity analysis (impossible claim volumes), and peer similarity clustering. When multiple independent methods flag the same provider, the probability of a false positive drops dramatically.
            </p>
          </div>
        </div>
      </section>

      {/* What We Found */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">What We Found</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold text-white">1,860</p>
              <p className="text-xs text-slate-500">providers flagged</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">$226B</p>
              <p className="text-xs text-slate-500">in flagged spending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-slate-500">on OIG exclusion list</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-xs text-slate-500">investigations published</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            None of our flagged providers appear on the OIG&apos;s existing exclusion list — suggesting our analysis surfaces <span className="text-white font-semibold">new suspicious activity</span> that hasn&apos;t been investigated yet. Explore the findings in our <Link href="/insights" className="text-blue-400 hover:underline">24 investigation articles</Link>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Explore the Data Yourself</h2>
        <p className="text-sm text-slate-400 mb-5">Search any provider, filter by state, or browse our investigations.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/watchlist" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
            View Risk Watchlist
          </Link>
          <Link href="/lookup" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-semibold px-5 py-2.5 rounded-lg border border-dark-500 transition-all text-sm">
            Look Up a Provider
          </Link>
        </div>
      </section>

      {/* Related Guides */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">Related Guides</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/guides/reading-medicaid-billing" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">How to Read a Medicaid Billing Record</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Understand NPIs, claims, beneficiaries, and what the numbers mean on provider profiles.</p>
          </Link>
          <Link href="/guides/understanding-hcpcs-codes" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">Understanding HCPCS Codes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">What billing codes mean, how they&apos;re structured, and which ones are most associated with fraud.</p>
          </Link>
          <Link href="/guides/top-billing-codes" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">Top Medicaid Billing Codes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">The highest-spending HCPCS codes explained in plain English with fraud risk levels.</p>
          </Link>
          <Link href="/guides/medicaid-fraud-by-state" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">Medicaid Fraud by State</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Which states have the most flagged providers and biggest spending anomalies.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
