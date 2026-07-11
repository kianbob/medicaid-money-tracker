import type { Metadata } from "next";
import Link from "next/link";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "How to Read Medicaid Billing Data: Beginner Guide",
  description:
    "NPIs, HCPCS codes, cost-per-claim — what do the numbers actually mean? A 5-minute guide to reading any Medicaid provider's billing profile.",
  openGraph: {
    title: "How to Read Medicaid Billing Data: Beginner Guide",
    description:
      "NPIs, HCPCS codes, cost-per-claim — what do the numbers actually mean? A 5-minute guide to reading any Medicaid provider's billing profile.",
  },
};

const sampleRecord = [
  { field: "NPI", value: "1396049987", explanation: "Unique 10-digit provider ID. This is CARES INC, a community support provider in MA." },
  { field: "Provider Type", value: "Community Mental Health Center", explanation: "The provider's specialty classification in the Medicaid system." },
  { field: "HCPCS Code", value: "H2015", explanation: "Comprehensive community support services, billed per 15-minute increment." },
  { field: "Total Claims", value: "148,291", explanation: "Number of individual billing transactions submitted for this code." },
  { field: "Total Beneficiaries", value: "1,847", explanation: "Unique Medicaid patients who received this service." },
  { field: "Total Paid", value: "$47.2M", explanation: "Amount Medicaid actually reimbursed for these claims." },
  { field: "Cost Per Claim", value: "$318", explanation: "Average payment per claim ($47.2M ÷ 148,291). National median is $55 — this is 5.8× higher." },
  { field: "Claims Per Beneficiary", value: "80.3", explanation: "Average claims per patient (148,291 ÷ 1,847). High ratios can indicate overbilling or intensive service delivery." },
];

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

      {/* Sample Billing Record Walkthrough */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Sample Billing Record: Walkthrough</h2>
        <p className="text-sm text-slate-400 mb-4">
          Let&apos;s walk through a real billing record from our dataset to see how each field connects:
        </p>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">FLAGGED PROVIDER</span>
            <span className="text-xs text-slate-500">CARES INC — NPI 1396049987</span>
          </div>
          <div className="space-y-3">
            {sampleRecord.map((row) => (
              <div key={row.field} className="border-b border-dark-600/30 pb-3 last:border-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <span className="text-xs font-bold text-slate-300">{row.field}</span>
                  <span className="font-mono text-sm font-semibold text-white">{row.value}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{row.explanation}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-xs text-red-300 leading-relaxed">
              <span className="font-bold">What the data tells us:</span> CARES INC bills 5.8× the national median for H2015 services. With 80 claims per patient per year, each patient averages a 15-minute community support session roughly every 4.5 days. This intensity level — combined with the elevated rate — triggered multiple risk flags.
            </p>
          </div>
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

      {/* Individual vs Group Providers */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Individual vs. Group Provider Billing</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Medicaid billing can be submitted under an individual provider&apos;s NPI or a group/organizational NPI. Understanding the difference is critical for interpreting billing data:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-blue-400 mb-2">Individual Provider (Type 1 NPI)</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Single physician, therapist, or practitioner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Billing reflects one person&apos;s work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Easier to benchmark — compare to peers in same specialty</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Volume has natural limits (one person can only see so many patients)</span>
                </li>
              </ul>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-green-400 mb-2">Group/Organization (Type 2 NPI)</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Hospital, clinic, agency, or practice group</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Billing aggregates multiple providers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Higher totals are expected — harder to benchmark</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Fraud schemes often use group NPIs to obscure individual responsibility</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            <span className="text-white font-semibold">Why this matters:</span> When a group NPI bills $50M, that might be normal for a large hospital. When a newly created group NPI with 3 listed employees bills $50M, that&apos;s a major red flag. Always check the entity size and age when evaluating group provider billing.
          </p>
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
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">👥 Unusually High Claims Per Patient</h3>
            <p className="text-xs text-slate-400 leading-relaxed">A provider billing 300+ claims per beneficiary per year means multiple services per patient per day. While intensive care situations exist, this ratio often indicates phantom billing.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-amber-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">🔄 Single Code Concentration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">A provider billing 95%+ of their claims under a single HCPCS code. Legitimate medical practice typically involves a variety of services and codes.</p>
          </div>
        </div>
      </section>

      {/* Understanding the Numbers in Context */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Understanding the Numbers in Context</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Raw numbers without context can be misleading. Here&apos;s how to properly contextualize what you see:
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-l-purple-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">High Billing ≠ Fraud</h3>
              <p className="text-xs text-slate-400 leading-relaxed">A large hospital system will legitimately bill billions. What matters is whether billing is proportional to the provider&apos;s size, specialty, and patient volume. A solo practitioner billing $50M is very different from a 500-bed hospital billing $50M.</p>
            </div>
            <div className="border-l-4 border-l-purple-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Regional Cost Differences</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Medicaid reimbursement rates vary significantly by state. A provider in New York may legitimately bill 2× what a provider in Mississippi bills for the same service due to state rate differences. Our analysis accounts for this where possible.</p>
            </div>
            <div className="border-l-4 border-l-purple-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Specialty Matters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">A provider billing J-codes (injectable drugs) will naturally have much higher cost-per-claim than a provider billing E/M codes (office visits). Always compare within the same code or specialty, not across all providers.</p>
            </div>
            <div className="border-l-4 border-l-purple-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Multiple Flags Matter Most</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Any single flag could have an innocent explanation. When a provider triggers 4-5 independent tests — high spending AND explosive growth AND new entrant AND high cost per claim — the probability of a benign explanation drops dramatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference Cheat Sheet */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Quick Reference Cheat Sheet</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <div className="space-y-2">
            {[
              { metric: "Cost per claim > 3× median", meaning: "Provider bills significantly above peers for same service", severity: "High" },
              { metric: "Claims per beneficiary > 200", meaning: "Multiple services per patient per day on average", severity: "High" },
              { metric: "YoY growth > 500%", meaning: "Billing increased more than 5× in a single year", severity: "High" },
              { metric: "New entity + >$5M billing", meaning: "Recently created provider with immediate high revenue", severity: "Medium" },
              { metric: "Single code > 90% of billing", meaning: "Provider relies almost entirely on one procedure code", severity: "Medium" },
            ].map((row) => (
              <div key={row.metric} className="flex items-center justify-between gap-3 bg-dark-700/50 rounded-lg p-3">
                <span className="text-xs font-mono text-white flex-1">{row.metric}</span>
                <span className="text-xs text-slate-400 flex-1">{row.meaning}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{row.severity}</span>
              </div>
            ))}
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

      <FAQSchema faqs={[
        { question: "What is an NPI number in Medicaid billing?", answer: "An NPI (National Provider Identifier) is a unique 10-digit number assigned to every healthcare provider in the United States. It serves as the primary identifier in Medicaid billing records, linking all claims, payments, and services to a specific provider or organization." },
        { question: "What does cost per claim mean in Medicaid data?", answer: "Cost per claim is the average Medicaid payment per billing transaction, calculated by dividing total payments by total claims. Comparing a provider's cost per claim to the national median for the same HCPCS code reveals whether they bill above or below typical rates — a key indicator in fraud detection." },
        { question: "How can I tell if a Medicaid provider's billing is suspicious?", answer: "Look for multiple red flags occurring together: billing far above national medians (3×+), explosive year-over-year growth (500%+), being a new entity with immediate high billing, unusually high claims per beneficiary, and concentration on a single billing code. Any one flag could have an innocent explanation, but multiple flags together warrant scrutiny." },
        { question: "What is the difference between individual and group NPI billing?", answer: "Individual (Type 1) NPIs represent single practitioners and reflect one person's work. Group (Type 2) NPIs represent organizations like hospitals, clinics, or agencies and aggregate billing across multiple providers. Group NPIs naturally have higher totals, but new small groups billing at levels of large hospitals is a fraud red flag." },
        { question: "What are Medicaid beneficiaries in billing data?", answer: "Beneficiaries are Medicaid-enrolled patients who received services from a provider. The beneficiary count shows how many unique patients a provider served. The ratio of claims to beneficiaries reveals service intensity — very high ratios (300+ claims per patient per year) can indicate overbilling or phantom services." },
      ]} />
    </div>
  );
}
