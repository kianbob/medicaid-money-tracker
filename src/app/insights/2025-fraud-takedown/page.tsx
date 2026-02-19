import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "The $14.6 Billion Healthcare Fraud Takedown: Lessons from 2025's Biggest Bust",
  description: "In July 2025, the DOJ and HHS-OIG charged 324 defendants in a $14.6 billion healthcare fraud takedown — the largest enforcement action in history. But reactive enforcement alone cannot solve a $37.4 billion problem.",
  keywords: "healthcare fraud takedown 2025, medicaid fraud arrests, healthcare fraud statistics, biggest healthcare fraud cases",
  openGraph: {
    title: "The $14.6 Billion Healthcare Fraud Takedown: Lessons from 2025's Biggest Bust",
    description: "324 defendants. $14.6 billion in intended losses. The largest healthcare fraud enforcement action in history — and why it's not enough.",
  },
};

export default function FraudTakedown2025() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">2025 Fraud Takedown</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium text-red-400">Investigation</span>
          <span className="text-xs text-slate-500">February 19, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">10 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The $14.6 Billion Healthcare Fraud Takedown: Lessons from 2025&apos;s Biggest Bust
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          On July 2, 2025, the Department of Justice and HHS Office of Inspector General announced the largest
          healthcare fraud enforcement action in American history: <strong className="text-white">324 defendants</strong> charged
          across the country, accused of <strong className="text-white">$14.6 billion</strong> in intended losses. It was a
          staggering number — and yet it barely scratches the surface of the problem.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-red-400">$14.6B</div>
          <div className="text-xs text-slate-400 mt-1">Intended Losses Charged</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-amber-400">324</div>
          <div className="text-xs text-slate-400 mt-1">Defendants Charged</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-orange-400">$37.4B</div>
          <div className="text-xs text-slate-400 mt-1">Annual Improper Payments</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-white">1,860</div>
          <div className="text-xs text-slate-400 mt-1">Providers We Flagged</div>
        </div>
      </div>

      {/* The Takedown */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">The 2025 National Health Care Fraud Takedown</h2>
        <div className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl p-6 mb-6">
          <p className="text-slate-300 mb-4">
            Every year, the DOJ and HHS-OIG coordinate a national healthcare fraud enforcement sweep. But 2025&apos;s
            action dwarfed anything that came before. Announced on July 2, 2025, the operation charged
            <strong className="text-white"> 324 defendants</strong> with schemes totaling <strong className="text-white">$14.6 billion</strong> in
            intended losses to federal healthcare programs — Medicare, Medicaid, and TRICARE combined.
          </p>
          <p className="text-slate-300 mb-4">
            The cases spanned the full spectrum of healthcare fraud: phantom billing for services never rendered,
            illegal kickback schemes, unnecessary prescriptions, and elaborate telemedicine operations that existed
            only on paper. Some defendants ran networks of sham clinics. Others exploited vulnerable populations —
            the elderly, the disabled, people struggling with addiction — to generate fraudulent claims at industrial scale.
          </p>
          <p className="text-slate-300">
            HHS-OIG called it the <strong className="text-white">largest healthcare fraud enforcement action ever</strong>.
            The number was so large it made national headlines. But here&apos;s the uncomfortable question:
            if $14.6 billion can accumulate before enforcement catches up, how much fraud is going undetected entirely?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">⚖️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Annual Coordinated Sweep</h3>
            <p className="text-sm text-slate-400">
              The National Health Care Fraud Takedown is an annual joint operation between DOJ, HHS-OIG, FBI, DEA,
              and state Medicaid Fraud Control Units. Each year brings bigger numbers — 2024&apos;s action charged $2.75 billion.
              The 2025 figure of $14.6 billion was a <strong className="text-white">5x increase</strong> in a single year.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🏛️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Agency Operation</h3>
            <p className="text-sm text-slate-400">
              The takedown involved prosecutors from every U.S. Attorney&apos;s office, state law enforcement, and
              federal agencies. Cases ranged from solo practitioners billing for phantom patients to
              multi-state criminal enterprises with dozens of participants and shell companies.
            </p>
          </div>
        </div>
      </section>

      {/* The Scale Problem */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">The Scale Problem: Enforcement Can&apos;t Keep Up</h2>
        <p className="text-slate-300 mb-4">
          $14.6 billion sounds enormous — and it is. But put it in context. CMS estimated <strong className="text-white">$37.4 billion</strong> in
          improper Medicaid payments in 2023 alone. The DOJ recovered approximately <strong className="text-white">$1.4 billion</strong> in
          healthcare fraud judgments and settlements that same year. That&apos;s a recovery rate of less than 4%.
        </p>
        <p className="text-slate-300 mb-4">
          The math is brutal: for every dollar the government claws back from healthcare fraud, roughly $26 in
          improper payments goes out the door. And &quot;improper payments&quot; is a polite term — it includes everything
          from clerical errors to outright theft.
        </p>

        <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/40">
            <h3 className="text-sm font-semibold text-white">The Enforcement Gap</h3>
            <p className="text-xs text-slate-500 mt-1">Federal healthcare fraud losses vs. recoveries</p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">Estimated Improper Payments (2023)</span>
                <span className="text-sm font-bold text-red-400">$37.4B</span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">2025 Takedown Charges</span>
                <span className="text-sm font-bold text-amber-400">$14.6B</span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" style={{ width: '39%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">DOJ Fraud Recoveries (2023)</span>
                <span className="text-sm font-bold text-green-400">$1.4B</span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '3.7%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/5 to-red-500/5 border border-amber-500/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-2">The Reactive Problem</h3>
          <p className="text-sm text-slate-300">
            The fundamental issue: enforcement is reactive. The 324 defendants charged in July 2025 had already
            billed for $14.6 billion. The money was already gone. Investigations take years.
            Prosecutions take more years. By the time a case reaches sentencing, the damage is measured
            in the billions. The question isn&apos;t whether this takedown was impressive — it was. The question
            is whether we can catch fraud <em>before</em> the billions are lost.
          </p>
        </div>
      </section>

      {/* Minnesota Connection */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Minnesota: Ground Zero for a Broader Wave</h2>
        <p className="text-slate-300 mb-4">
          The 2025 takedown didn&apos;t happen in isolation. It arrived amid an escalating crisis in
          <Link href="/insights/minnesota-fraud-capital" className="text-blue-400 hover:text-blue-300"> Minnesota</Link>,
          where federal prosecutors estimated Medicaid fraud across 14 state-run programs likely
          exceeds <strong className="text-white">$9 billion</strong>. The DOJ created a special strike force just for
          Minnesota — a nearly unprecedented step for a single state. To date, the Feeding Our Future case alone has
          produced <strong className="text-white">78 indictments</strong> and nearly 60 convictions.
        </p>
        <p className="text-slate-300 mb-4">
          Minnesota&apos;s fraud epidemic shows how quickly losses can compound when generous programs meet weak oversight.
          Personal care, home health, housing stabilization, autism therapy, transportation — the same categories that
          dominate the national takedown statistics are the same ones bleeding money in Minnesota.
        </p>

        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🔍</span>
            <h3 className="text-lg font-semibold text-white">California: The Next Frontier?</h3>
          </div>
          <p className="text-sm text-slate-400">
            CMS Administrator Dr. Mehmet Oz has publicly stated that California&apos;s Medicaid fraud problem may rival
            Minnesota&apos;s in scale. With a Medicaid program roughly 7 times larger than Minnesota&apos;s, the potential losses
            are staggering. If Minnesota&apos;s per-capita fraud rates applied to California, the numbers would dwarf even
            the $9 billion estimate. Federal oversight of California&apos;s program is intensifying.
          </p>
        </div>
      </section>

      {/* Ohio — Recent Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Ohio: 1,000+ Hours While Working Another Job</h2>
        <div className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl p-6 mb-6">
          <p className="text-slate-300 mb-4">
            In February 2026, the Ohio Attorney General charged <strong className="text-white">9 Medicaid providers</strong> with
            fraud. The cases illustrate the brazenness of the schemes: one provider billed for over
            <strong className="text-white"> 1,000 hours of direct care services</strong> during a period when they were
            simultaneously employed full-time at another job. The hours were physically impossible.
          </p>
          <p className="text-slate-300">
            These weren&apos;t sophisticated operations. They were simple billing fraud — submitting claims for services
            that could not have been provided because the provider wasn&apos;t even present. The kind of fraud that a
            basic cross-reference of employment records and billing data could have caught in real time.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="text-lg font-semibold text-white mb-2">The Pattern Repeats</h3>
          <p className="text-sm text-slate-400">
            Ohio&apos;s cases mirror what we see nationally: personal care providers, home health aides, and behavioral
            health services dominating fraud charges. These are services with inherently low verifiability —
            one-on-one care in a home setting, where no one but the provider and patient (if they exist) can
            confirm what happened. That makes them uniquely vulnerable to phantom billing.
          </p>
        </div>
      </section>

      {/* The Vulnerable Four */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">The Four Most Vulnerable Medicaid Services</h2>
        <p className="text-slate-300 mb-4">
          A 2025 report from the Paragon Institute identified four Medicaid service categories that are
          disproportionately vulnerable to fraud nationwide — not just in Minnesota, but across every state
          that offers them. The pattern is consistent: services delivered in private settings, difficult
          to verify, and paid based on self-reported hours or visits.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🏥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Personal Care Services</h3>
            <p className="text-sm text-slate-400">
              Attendants billing for bathing, dressing, and feeding services to homebound clients. Verification is
              nearly impossible without in-person audits. Minnesota, New York, and California all show
              massive overuse of personal care codes like T1019.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="text-lg font-semibold text-white mb-2">Home Health Services</h3>
            <p className="text-sm text-slate-400">
              Home health agencies billing for skilled nursing, therapy, and aide visits that never occurred.
              Some agencies bill for dozens of patients simultaneously across geographic areas
              that would be impossible for a single provider to cover.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="text-lg font-semibold text-white mb-2">Behavioral Health</h3>
            <p className="text-sm text-slate-400">
              Therapy sessions, substance abuse treatment, and psychiatric services with minimal documentation
              requirements. One-on-one sessions in private offices are inherently unverifiable.
              The explosion of telehealth during COVID made this even easier to exploit.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🚐</div>
            <h3 className="text-lg font-semibold text-white mb-2">Transportation</h3>
            <p className="text-sm text-slate-400">
              Non-emergency medical transportation — rides to appointments that may not have happened, for patients
              who may not have been in the vehicle. GPS tracking has helped in some states, but many still
              rely on paper logs that are trivially easy to fabricate.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/5 to-red-500/5 border border-amber-500/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-2">The Common Denominator</h3>
          <p className="text-sm text-slate-300">
            All four categories share the same structural vulnerability: <strong className="text-white">low verifiability</strong>.
            Services happen behind closed doors, in patients&apos; homes, or in vehicles. There&apos;s often no third-party
            witness, no electronic health record entry, and no way to confirm the service occurred except the
            provider&apos;s own documentation. This is why these same four categories appear in the 2025 takedown,
            in Minnesota&apos;s $9 billion crisis, in Ohio&apos;s recent charges, and in our own statistical analysis.
          </p>
        </div>
      </section>

      {/* What Our Data Shows */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">What Our Data Independently Found</h2>
        <p className="text-slate-300 mb-4">
          Before the 2025 takedown was announced, before many of these cases became public, OpenMedicaid had already
          flagged troubling patterns using purely statistical methods. Our analysis of 227 million billing records
          identified <strong className="text-white">1,860 providers</strong> with anomalous billing behavior — using a
          combination of code-specific outlier detection, billing velocity analysis, change point detection, and
          machine learning.
        </p>

        <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/40">
            <h3 className="text-sm font-semibold text-white">Our Detection Methods</h3>
            <p className="text-xs text-slate-500 mt-1">Multiple independent systems flagging the same patterns enforcement found</p>
          </div>
          <div className="divide-y divide-slate-700/30">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm font-medium text-white">Statistical Watchlist</span>
                <p className="text-xs text-slate-500">4 code-specific tests + 9 legacy anomaly tests</p>
              </div>
              <Link href="/watchlist" className="text-xs text-blue-400 hover:text-blue-300">880 flagged &rarr;</Link>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm font-medium text-white">ML Fraud Detection</span>
                <p className="text-xs text-slate-500">Random forest trained on OIG-excluded provider features</p>
              </div>
              <Link href="/ml-analysis" className="text-xs text-blue-400 hover:text-blue-300">700 flagged &rarr;</Link>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm font-medium text-white">Impossible Billing Volume</span>
                <p className="text-xs text-slate-500">Providers filing 50+ claims per working day</p>
              </div>
              <Link href="/insights/impossible-volume" className="text-xs text-blue-400 hover:text-blue-300">200 flagged &rarr;</Link>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm font-medium text-white">Multi-Method Convergence</span>
                <p className="text-xs text-slate-500">Providers flagged by 2+ independent detection methods</p>
              </div>
              <Link href="/insights/highest-confidence" className="text-xs text-blue-400 hover:text-blue-300">442 flagged &rarr;</Link>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm font-medium text-white">Billing Network Analysis</span>
                <p className="text-xs text-slate-500">Hidden intermediaries and ghost billing entities</p>
              </div>
              <Link href="/insights/billing-networks" className="text-xs text-blue-400 hover:text-blue-300">174K ghost billers &rarr;</Link>
            </div>
          </div>
        </div>

        <p className="text-slate-300 mb-4">
          The overlap between what our data shows and what enforcement actions found is striking. The same service
          categories — personal care, home health, behavioral health, transportation — that dominate the 2025 takedown
          are the same categories where our statistical analysis finds the most extreme outliers. The same states
          that produce the most fraud cases are the same ones where our geographic risk analysis identifies
          disproportionate anomaly concentrations.
        </p>

        <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-2">The Case for Proactive Detection</h3>
          <p className="text-sm text-slate-300">
            Our data didn&apos;t require warrants, subpoenas, or multi-year investigations. It used publicly available
            billing records and standard statistical methods. If a volunteer-run open data project can identify
            patterns that align with billion-dollar fraud cases, imagine what every state Medicaid agency could
            do with real-time access to claims data and basic anomaly detection. The technology exists. The data
            exists. What&apos;s missing is the infrastructure — and the political will — to use it.
          </p>
        </div>
      </section>

      {/* What Would Real-Time Monitoring Look Like */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">What If Every State Had Real-Time Monitoring?</h2>
        <p className="text-slate-300 mb-4">
          The 2025 takedown proves two things simultaneously: the fraud is massive, and our ability to catch it
          is years behind the criminals. The average healthcare fraud scheme runs for <strong className="text-white">3 to 5 years</strong> before
          detection. By then, the providers have billed tens of millions, moved the money, and sometimes left the
          country entirely.
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4 items-start">
            <div className="text-2xl">1️⃣</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Real-Time Claim Scoring</h3>
              <p className="text-sm text-slate-400">
                Every claim scored against code-specific national benchmarks at the time of submission.
                A provider billing 10x the national median for a procedure code would trigger an
                immediate flag — not an investigation three years later.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-2xl">2️⃣</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Cross-State Pattern Detection</h3>
              <p className="text-sm text-slate-400">
                Minnesota&apos;s &quot;fraud tourists&quot; — people flying in from other states to exploit programs — could be
                caught if states shared enrollment and billing data in near-real-time. The same actors appearing
                in multiple state systems is a red flag that no single state can see alone.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-2xl">3️⃣</div>
            <div>
              <h3 className="text-white font-semibold mb-1">New Entrant Monitoring</h3>
              <p className="text-sm text-slate-400">
                Our data shows that some of the most suspicious providers are massive new entrants — appearing in the
                billing data for the first time and immediately generating millions in claims. A
                new provider billing $10 million in their first year should draw automatic scrutiny.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-2xl">4️⃣</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Public Transparency</h3>
              <p className="text-sm text-slate-400">
                The data we analyze at OpenMedicaid is already public — HHS releases it. But it takes technical
                expertise to process 227 million records. Making this data accessible through tools like
                our <Link href="/watchlist" className="text-blue-400 hover:text-blue-300">fraud watchlist</Link> and{" "}
                <Link href="/exclusions" className="text-blue-400 hover:text-blue-300">exclusion tracker</Link> means
                journalists, legislators, and the public can see the patterns for themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Bottom Line */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">The Bottom Line</h2>
          <p className="text-slate-300 mb-3">
            The 2025 healthcare fraud takedown was historic — $14.6 billion in charges, 324 defendants, the largest
            enforcement action ever. It proved that the fraud is real, it&apos;s organized, and it operates at a scale
            that most people find hard to comprehend.
          </p>
          <p className="text-slate-300 mb-3">
            But enforcement alone is not the answer. When $37.4 billion leaves the system improperly every year
            and we recover $1.4 billion, the math doesn&apos;t work. The criminals are faster, more adaptable, and
            better funded than the investigators chasing them. Minnesota&apos;s $9 billion crisis, Ohio&apos;s impossible-hours
            cases, and the steady stream of fraud in personal care, home health, behavioral health, and transportation
            all point to the same conclusion: <strong className="text-white">we need to detect fraud before the money is gone,
            not after</strong>.
          </p>
          <p className="text-sm text-slate-400">
            Our analysis independently flagged 1,860 providers using statistical methods and machine learning — finding
            many of the same patterns that law enforcement eventually prosecuted. The tools exist. The data is public.
            What&apos;s needed now is the infrastructure to make proactive detection the norm, not the exception.
          </p>
        </div>
      </section>

      {/* Methodology */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-white mb-3">Methodology &amp; Sources</h2>
        <p className="text-sm text-slate-400 mb-2">
          The 2025 takedown statistics come from the HHS Office of Inspector General announcement on July 2, 2025.
          Improper payment estimates are from the CMS Financial Report (FY 2023). DOJ recovery figures are from the
          DOJ Civil Division annual fraud statistics report.
        </p>
        <p className="text-sm text-slate-400 mb-2">
          Minnesota estimates ($9 billion) are from the U.S. Attorney for the District of Minnesota (December 2025).
          Ohio cases are from the Ohio Attorney General&apos;s office (February 2026). The Paragon Institute report
          on vulnerable Medicaid services was published in 2025.
        </p>
        <p className="text-sm text-slate-400">
          OpenMedicaid&apos;s provider flags are based on analysis of HHS Medicaid billing records (2018–2024, 227 million records).
          Our methods include code-specific outlier detection, billing velocity analysis, CUSUM change point detection,
          Benford&apos;s Law analysis, and a random forest ML model trained on features from OIG-excluded providers.
          These are statistical signals — not accusations of fraud. See our <Link href="/analysis" className="text-blue-400 hover:text-blue-300">analysis methodology</Link> for details.
        </p>
      </section>

      <RelatedInsights currentSlug="2025-fraud-takedown" relatedSlugs={["minnesota-fraud-capital", "impossible-volume", "highest-confidence", "billing-networks"]} />
    </article>
  );
}
