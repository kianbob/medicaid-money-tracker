import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Read Medicaid Billing Data: Beginner Guide",
  description:
    "NPIs, HCPCS codes, cost-per-claim — what do the numbers actually mean? A 5-minute guide to reading any Medicaid provider's billing profile.",
  openGraph: {
    title: "Read Medicaid Billing Data: Beginner Guide",
    description:
      "NPIs, HCPCS codes, cost-per-claim — what do the numbers actually mean? A 5-minute guide to reading any Medicaid provider's billing profile.",
  },
};

export default function ReadingBillingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Guides</span>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Reading Medicaid Billing</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Guide</p>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          How to Read a Medicaid Billing Record
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          A beginner&apos;s guide to understanding the numbers on OpenMedicaid. What NPIs, claims, beneficiaries, and cost-per-claim actually mean.
        </p>
      </div>

      {/* Key Terms */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Key Terms</h2>
        <div className="space-y-3">
          {[
            { term: "NPI (National Provider Identifier)", icon: "🏥", desc: "A unique 10-digit number assigned to every healthcare provider in the US. Think of it like a Social Security Number for doctors and organizations. Every provider page on OpenMedicaid is organized by NPI." },
            { term: "HCPCS Code", icon: "📋", desc: "The billing code that identifies what service was provided. Each code has a standardized description and expected price range. For example, 99213 is a routine office visit, T1019 is personal care services." },
            { term: "Claim", icon: "📄", desc: "A single billing transaction — one service provided to one patient. A provider might file thousands of claims per month. Each claim has a code, date, and payment amount." },
            { term: "Beneficiary", icon: "👤", desc: "A Medicaid patient who received services. The count of unique beneficiaries tells you how many different patients a provider served. High claims-per-beneficiary ratios can indicate overbilling." },
            { term: "Total Paid", icon: "💰", desc: "The total amount Medicaid actually paid to the provider. This is taxpayer money. It's the sum of all approved claim payments for a given time period." },
            { term: "Cost Per Claim", icon: "📊", desc: "Total paid divided by total claims. This tells you the average reimbursement per service. Comparing this to the national median for the same code reveals whether a provider charges more or less than peers." },
          ].map((item) => (
            <div key={item.term} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{item.icon}</span>
                <h3 className="text-sm font-bold text-white">{item.term}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reading a Provider Profile */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Reading a Provider Profile</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            When you open a provider page on OpenMedicaid, here&apos;s what to look for:
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">1. Risk Tier &amp; Flag Count</h3>
              <p className="text-xs text-slate-400 leading-relaxed">At the top, you&apos;ll see a risk tier (Critical, High, Elevated, ML Flag) and the number of statistical tests that flagged this provider. More flags = more independent tests found unusual patterns.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">2. Red Flags Explained</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Each flag has a plain-English explanation of what the test detected and why it&apos;s unusual. This is the most important section for understanding why a provider was flagged.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">3. Peer Comparison</h3>
              <p className="text-xs text-slate-400 leading-relaxed">The horizontal percentile bar shows where this provider&apos;s spending falls relative to others in their specialty. Being above the 90th percentile isn&apos;t automatically suspicious — but it means they bill more than 90% of peers.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">4. Yearly Trends</h3>
              <p className="text-xs text-slate-400 leading-relaxed">The spending chart shows billing over time. Look for sudden spikes (could indicate a billing scheme ramping up), steady growth (often legitimate), or sharp drops (could mean the provider stopped billing or was investigated).</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">5. Billing Codes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">The procedure breakdown shows exactly what services this provider bills for and how their rates compare to national medians. A provider billing 5× the median for a specific code is much more informative than just knowing their total spending.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Red Flags to Watch */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Red Flags to Watch For</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">🚀 Explosive Growth</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Billing that jumps 500%+ in a year. While growth can be legitimate, rapid scaling is a well-known fraud pattern.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">💰 High Cost Per Claim</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Billing 3×+ the national median for the same procedure code. One high code could be specialization — multiple high codes suggests systematic overbilling.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-amber-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">🆕 New Entity, Big Bills</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Brand-new providers billing millions immediately. Legitimate practices take years to build patient volume.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-amber-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">📈 No Natural Variation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Monthly billing with almost zero variation. Real medical practice has natural ups and downs — perfectly flat billing looks manufactured.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Try It Yourself</h2>
        <p className="text-sm text-slate-400 mb-5">Look up any Medicaid provider and apply what you&apos;ve learned.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/check" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
            Check a Provider →
          </Link>
          <Link href="/providers/1396049987" className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-semibold px-5 py-2.5 rounded-lg border border-dark-500 transition-all text-sm">
            See an Example (CARES INC) →
          </Link>
        </div>
      </section>

      {/* Related Guides */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">Related Guides</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/guides/how-medicaid-fraud-works" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">How Medicaid Fraud Works</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Common schemes, red flags, and how data analysis can detect them.</p>
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
