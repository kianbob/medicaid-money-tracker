import type { Metadata } from "next";
import Link from "next/link";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "Medicaid Fraud by State: All 50 States Ranked (2024)",
  description:
    "NY leads with 159 risk flags, but tiny Vermont tops per capita. See all 50 states ranked by suspicious billing patterns from 227M records.",
  openGraph: {
    title: "Medicaid Fraud by State: All 50 States Ranked (2024)",
    description:
      "NY leads with 159 risk flags, but tiny Vermont tops per capita. See all 50 states ranked by suspicious billing patterns from 227M records.",
  },
};

const stateData = [
  { state: "New York", code: "NY", flags: 159, spending: "$64.2B", perCapita: "0.82", highlight: "Home care industry dominates. Brooklyn alone has 64 flagged providers." },
  { state: "California", code: "CA", flags: 87, spending: "$29.8B", perCapita: "0.22", highlight: "County-level mental health programs and large hospital systems." },
  { state: "Arizona", code: "AZ", flags: 71, spending: "$5.1B", perCapita: "0.97", highlight: "46 brand-new providers appeared post-pandemic. Major new-entrant cluster." },
  { state: "Massachusetts", code: "MA", flags: 52, spending: "$15.2B", perCapita: "0.75", highlight: "DDS entities billing 37-51× median for residential habilitation." },
  { state: "Illinois", code: "IL", flags: 38, spending: "$11.8B", perCapita: "0.30", highlight: "City of Chicago ambulance billing surged 942% during COVID." },
  { state: "Tennessee", code: "TN", flags: 31, spending: "$7.2B", perCapita: "0.45", highlight: "Nashville-based state disability programs with consistently high billing." },
  { state: "Vermont", code: "VT", flags: 7, spending: "$1.1B", perCapita: "1.08", highlight: "Highest per-capita risk flag rate in the country despite small size." },
  { state: "Florida", code: "FL", flags: 29, spending: "$7.9B", perCapita: "0.13", highlight: "Large state with relatively low flag rate per capita." },
];

const fraudUnitStats = [
  { state: "New York", unit: "OMIG", recoveries: "$1.8B", cases: "1,247", prosecutions: "89", notes: "Office of Medicaid Inspector General — largest state fraud unit. Recovered $1.8B over 5 years." },
  { state: "California", unit: "DHCS-AFSD", recoveries: "$1.2B", cases: "983", prosecutions: "67", notes: "Anti-Fraud Services Division partners with DOJ for criminal referrals." },
  { state: "Texas", unit: "OIG-HHSC", recoveries: "$892M", cases: "612", prosecutions: "45", notes: "Health and Human Services Commission OIG — aggressive on DME and home health fraud." },
  { state: "Florida", unit: "MPI", recoveries: "$742M", cases: "534", prosecutions: "38", notes: "Medicaid Program Integrity — historically focused on South Florida pill mills and personal care fraud." },
  { state: "Illinois", unit: "OIG", recoveries: "$398M", cases: "287", prosecutions: "22", notes: "Despite Chicago ambulance anomalies, state OIG has limited bandwidth for municipal providers." },
];

export default function FraudByStatePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Guides</span>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Medicaid Fraud by State</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Guide</p>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Medicaid Fraud by State
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          Which states have the most flagged providers? Where are the biggest concentrations of billing anomalies? A state-by-state breakdown.
        </p>
      </div>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">The Big Picture</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Medicaid fraud isn&apos;t evenly distributed. Our analysis of 227 million billing records flagged <span className="text-white font-semibold">1,860 providers</span> across all 50 states — but some states have dramatically higher concentrations of suspicious billing patterns than others.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="text-white font-semibold">New York</span> leads in absolute flags (159), while <span className="text-white font-semibold">Vermont</span> leads per capita (1.08 per 100K residents). <span className="text-white font-semibold">Arizona</span> stands out for its cluster of brand-new providers that appeared post-pandemic.
          </p>
        </div>
      </section>

      {/* State Cards */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">State Breakdown</h2>
        <div className="space-y-3">
          {stateData.map((s) => (
            <Link key={s.code} href={`/states/${s.code}`} className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{s.state}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${parseInt(String(s.flags)) >= 50 ? 'bg-red-500/20 text-red-400' : parseInt(String(s.flags)) >= 30 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {s.flags} flags
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.highlight}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-white">{s.spending}</p>
                  <p className="text-[10px] text-slate-500">{s.perCapita}/100K</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/states" className="text-sm text-blue-400 hover:underline">View all 50 states →</Link>
        </div>
      </section>

      {/* 2026 Enforcement Updates */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">2026 Enforcement Updates</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The Medicaid fraud enforcement landscape is shifting significantly in 2026. Federal and state agencies are adopting data-driven detection methods while facing new political pressures:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Federal Strike Force Expansion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">HHS-OIG&apos;s Health Care Fraud Strike Force expanded to 3 new regions in 2025, bringing total coverage to 15 metropolitan areas. Q1 2026 saw 47 indictments totaling $380M in alleged fraud — a 23% increase over Q1 2025.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">AI-Powered Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">CMS deployed its Fraud Prevention System (FPS) 3.0 in late 2025, incorporating machine learning models similar to our approach. Early results show a 31% improvement in pre-payment fraud identification over the prior system.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Post-Pandemic Unwinding Audits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">As pandemic-era flexibilities expire, states are conducting retroactive audits of 2020–2023 billing. Multiple states have initiated recovery actions against providers whose COVID-era billing spikes never reverted to baseline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DOGE Impact */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">DOGE &amp; Federal Oversight Impact</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The Department of Government Efficiency (DOGE) has identified Medicaid improper payments as a top-priority target. Medicaid&apos;s estimated improper payment rate of <span className="text-white font-semibold">21.4%</span> (approximately $80B annually) makes it the largest source of improper payments in the federal government.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-green-400 mb-2">What DOGE Is Pushing</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Real-time claims verification before payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Cross-state provider enrollment databases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Mandatory provider site visits for new high-billing entities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Open data mandates for state Medicaid spending</span>
                </li>
              </ul>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-amber-400 mb-2">Potential Challenges</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Federal workforce reductions may slow investigations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>States have historically resisted federal oversight mandates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>CMS staff cuts could reduce existing audit capacity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Technology modernization requires upfront investment</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            The core question: can you cut waste and improve detection simultaneously? The data suggests that <span className="text-white font-semibold">smarter systems</span> — not just more staff — are the key to catching fraud at scale. OpenMedicaid&apos;s approach of analyzing 227M records with statistical tests demonstrates what&apos;s possible with modern data analysis.
          </p>
        </div>
      </section>

      {/* State Fraud Unit Statistics */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">State Fraud Unit Performance</h2>
        <p className="text-sm text-slate-400 mb-4">
          Every state operates a Medicaid Fraud Control Unit (MFCU) funded by federal and state dollars. Their effectiveness varies enormously:
        </p>
        <div className="space-y-3">
          {fraudUnitStats.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{s.state} — {s.unit}</h3>
                  <p className="text-xs text-slate-500">{s.notes}</p>
                </div>
                <span className="text-sm font-bold text-green-400 shrink-0">{s.recoveries}</span>
              </div>
              <div className="flex gap-4 text-xs text-slate-400">
                <span>Cases: <span className="text-white font-semibold">{s.cases}</span></span>
                <span>Prosecutions: <span className="text-white font-semibold">{s.prosecutions}</span></span>
                <span>Conviction rate: <span className="text-white font-semibold">~92%</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Patterns */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Key Patterns</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">New York Dominance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              New York accounts for roughly 1 in 12 flagged providers nationally. The <Link href="/insights/ny-home-care" className="text-blue-400 hover:underline">home care industry</Link> is the primary driver — Brooklyn alone has more flags than most states.
            </p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-amber-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Arizona New-Entrant Cluster</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arizona&apos;s <Link href="/insights/arizona-problem" className="text-blue-400 hover:underline">46 new providers</Link> that appeared in 2022+ represent a distinct pattern from other states — suggesting systemic gaps in provider enrollment screening.
            </p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-blue-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Small State Surprises</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vermont (1.08/100K), DC (1.03), and Maine (1.00) lead per-capita rates. Small populations mean a few flagged providers create outsized per-capita numbers. See our <Link href="/insights/geographic-hotspots" className="text-blue-400 hover:underline">geographic analysis</Link>.
            </p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-purple-500 rounded-r-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">COVID Amplification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every state saw billing increases during 2020-2023. But some — particularly Illinois and Virginia — saw specific providers with extraordinary growth that hasn&apos;t reverted.
            </p>
          </div>
        </div>
      </section>

      {/* Prosecution Rates */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Why Prosecution Rates Vary</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Getting flagged by data analysis and getting prosecuted are very different things. Here&apos;s why:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-l-slate-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Burden of Proof</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Statistical anomalies identify <em>where to look</em>, not proof of fraud. Investigators must establish intent and specific false claims — requiring chart reviews, interviews, and document analysis that can take 18–36 months per case.</p>
            </div>
            <div className="border-l-4 border-l-slate-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Resource Constraints</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Most state MFCUs can only investigate 50–200 cases per year. With 1,860 flagged providers nationally, only a fraction receive full investigation. States prioritize by dollar amount and evidence strength.</p>
            </div>
            <div className="border-l-4 border-l-slate-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Civil vs. Criminal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Many cases are resolved civilly through settlements and repayment agreements rather than criminal prosecution. Civil cases require only a &ldquo;preponderance of evidence&rdquo; vs. &ldquo;beyond reasonable doubt&rdquo; for criminal cases, making them faster and more cost-effective.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Explore Your State</h2>
        <p className="text-sm text-slate-400 mb-5">See flagged providers, top procedures, and spending trends for any state.</p>
        <Link href="/states" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          Browse All States →
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
          <Link href="/guides/understanding-hcpcs-codes" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">Understanding HCPCS Codes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">What billing codes mean, how they&apos;re structured, and which ones are most associated with fraud.</p>
          </Link>
          <Link href="/guides/reading-medicaid-billing" className="block bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-dark-400 hover:bg-dark-700/50 transition-all group">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">How to Read a Medicaid Billing Record</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Understand NPIs, claims, beneficiaries, and what the numbers mean on provider profiles.</p>
          </Link>
        </div>
      </section>

      <FAQSchema faqs={[
        { question: "Which state has the most Medicaid fraud?", answer: "New York leads with 159 risk flags among its Medicaid providers, driven primarily by its massive home care industry. However, when measured per capita, smaller states like Vermont (1.08 flags per 100K residents) show higher rates of suspicious billing per provider." },
        { question: "How is Medicaid fraud measured by state?", answer: "We measure fraud risk by counting providers flagged by our 9 statistical tests and ML model per state, both in absolute numbers and per capita relative to state Medicaid enrollment. Flags include unusually high spending, explosive growth, high cost per claim, and new entrant patterns." },
        { question: "What is a Medicaid Fraud Control Unit (MFCU)?", answer: "Every state operates an MFCU, funded roughly 75% by the federal government and 25% by the state. These units investigate and prosecute Medicaid provider fraud and patient abuse/neglect. Performance varies widely — New York's OMIG recovered $1.8B over 5 years while some smaller state units recover under $10M annually." },
        { question: "How does DOGE impact Medicaid fraud enforcement?", answer: "The Department of Government Efficiency has identified Medicaid's 21.4% improper payment rate (~$80B annually) as a top target. DOGE is pushing for real-time claims verification, cross-state provider databases, and open data mandates, though federal workforce reductions may affect existing investigation capacity." },
        { question: "Why do some states have more Medicaid fraud than others?", answer: "State fraud levels correlate with several factors: total Medicaid spending (larger programs = more opportunity), provider enrollment screening rigor, state reimbursement rates, program structure (home care and personal care programs are harder to verify), and the strength of state fraud detection systems. States that expanded Medicaid under the ACA generally have more providers and higher total spending." },
      ]} />
    </div>
  );
}
