import type { Metadata } from "next";
import Link from "next/link";
import FAQSchema from "@/components/FAQSchema";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "Medicaid Unwinding: 25 Million Lost Coverage in the Largest Health Insurance Shakeup in U.S. History",
  description: "The end of COVID-era continuous enrollment triggered the largest Medicaid coverage disruption ever. 25.4 million people were disenrolled — 72% for paperwork failures, not ineligibility. State-by-state data, impact on children, and where things stand in 2026.",
  keywords: ["medicaid unwinding", "medicaid redeterminations", "medicaid disenrollment", "continuous enrollment", "medicaid coverage loss", "medicaid unwinding by state"],
  openGraph: {
    title: "Medicaid Unwinding: 25 Million Lost Coverage",
    description: "The end of COVID continuous enrollment led to 25.4M disenrollments. 72% were procedural — paperwork, not ineligibility.",
  },
};

export default function MedicaidUnwinding() {
  const stateDisenrollment = [
    { state: "Texas", lost: "2.1M", pctProcedural: "78%", note: "Non-expansion state, highest raw disenrollment" },
    { state: "Florida", lost: "1.8M", pctProcedural: "75%", note: "Non-expansion, aggressive timeline" },
    { state: "Georgia", lost: "800K", pctProcedural: "80%", note: "Non-expansion, minimal outreach budget" },
    { state: "Tennessee", lost: "650K", pctProcedural: "71%", note: "Non-expansion, block grant waiver state" },
    { state: "Ohio", lost: "620K", pctProcedural: "68%", note: "Expansion state, faster processing" },
    { state: "California", lost: "1.5M", pctProcedural: "64%", note: "Expansion state, large population offsets volume" },
    { state: "New York", lost: "980K", pctProcedural: "62%", note: "Expansion state, strong outreach reduced procedural rate" },
    { state: "Indiana", lost: "540K", pctProcedural: "74%", note: "Gateway to Work waiver complications" },
    { state: "Missouri", lost: "380K", pctProcedural: "69%", note: "Recent expansion state, still building systems" },
    { state: "North Carolina", lost: "420K", pctProcedural: "66%", note: "Expanded Dec 2023, mid-unwinding" },
  ];

  const reEnrollmentRates = [
    { state: "Massachusetts", rate: "38%", note: "Best-in-class outreach, ex parte renewals" },
    { state: "Oregon", rate: "35%", note: "Automatic data matching with tax records" },
    { state: "California", rate: "32%", note: "Invested $200M+ in renewal infrastructure" },
    { state: "Virginia", rate: "28%", note: "Expansion state, moderate re-enrollment" },
    { state: "Texas", rate: "12%", note: "Minimal outreach, no expansion" },
    { state: "Florida", rate: "14%", note: "Limited re-enrollment support" },
    { state: "Georgia", rate: "11%", note: "Lowest re-enrollment rate nationally" },
  ];

  const faqs = [
    {
      question: "What is the Medicaid unwinding?",
      answer: "The Medicaid unwinding refers to the process of resuming normal Medicaid eligibility redeterminations after the COVID-19 continuous enrollment provision expired on March 31, 2023. During the pandemic, states were prohibited from removing anyone from Medicaid rolls in exchange for enhanced federal funding. When that protection ended, states began reviewing eligibility for all 94 million enrollees — the largest health coverage transition in U.S. history."
    },
    {
      question: "How many people lost Medicaid coverage during the unwinding?",
      answer: "As of Q1 2026, approximately 25.4 million people have been disenrolled from Medicaid during the unwinding process, according to KFF tracking data. Of those, roughly 72% were removed for procedural reasons — meaning they failed to return paperwork or couldn't be reached — rather than being found actually ineligible for coverage."
    },
    {
      question: "Why were so many people disenrolled for procedural reasons?",
      answer: "The high procedural disenrollment rate (72%) resulted from multiple factors: outdated contact information after 3 years without verification, overwhelmed state eligibility systems processing millions of cases simultaneously, language barriers for non-English speakers, confusing renewal forms, and short response deadlines. Some states had procedural disenrollment rates above 80%, suggesting systemic failures rather than individual non-compliance."
    },
    {
      question: "How did the Medicaid unwinding affect children?",
      answer: "Children were disproportionately affected by the unwinding. More than 5 million children lost Medicaid or CHIP coverage, despite most being eligible. Children can't fill out their own paperwork, and many parents — especially in households with language barriers or unstable housing — missed renewal deadlines. CMS issued guidance requiring states to prioritize children's cases and implement ex parte (automatic) renewals where data was available."
    },
    {
      question: "What is the current status of the Medicaid unwinding in 2026?",
      answer: "As of mid-2026, the unwinding is largely complete, with enrollment stabilizing around 74.3 million. Most states finished initial redeterminations by late 2024. Some states are still processing backlogged cases and re-enrolling people who were improperly disenrolled. The national uninsured rate, which jumped from 7.7% to 10.2% during the unwinding peak, has partially recovered to approximately 9.4% as some individuals found employer coverage, marketplace plans, or re-enrolled in Medicaid."
    },
    {
      question: "Did any states pause their Medicaid unwinding?",
      answer: "Yes. CMS ordered several states to pause disenrollments due to processing errors. Arkansas, Idaho, South Dakota, and Utah were among states that received corrective action plans. Some states voluntarily paused to fix system issues — Oregon paused for two months in late 2023 after discovering its automated system was terminating eligible enrollees. States that paused generally had lower overall disenrollment rates once they resumed with corrected processes."
    },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Medicaid Unwinding: 25 Million Lost Coverage in the Largest Health Insurance Shakeup in U.S. History",
          "description": "25.4 million people lost Medicaid coverage after COVID continuous enrollment ended. 72% were procedural disenrollments.",
          "datePublished": "2026-07-11",
          "url": "https://www.openmedicaid.org/insights/medicaid-unwinding",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/medicaid-unwinding" }
        }) }}
      />
      <FAQSchema faqs={faqs} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Medicaid Unwinding</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium text-red-400">Coverage Crisis</span>
          <span className="text-xs text-slate-500">July 11, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">12 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Medicaid Unwinding: 25 Million Lost Coverage in the Largest Health Insurance Shakeup in U.S. History
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          When Congress ended COVID&apos;s continuous enrollment mandate in March 2023, it triggered the
          largest health coverage transition in American history. Over <strong className="text-white">25.4 million
          people</strong> lost Medicaid coverage — and <strong className="text-white">72% of them</strong> were
          dropped for paperwork failures, not because they were found ineligible. Here&apos;s the full story
          of what happened, state by state.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">25.4M</div>
          <div className="text-xs text-slate-500 mt-1">Total Disenrolled</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">72%</div>
          <div className="text-xs text-slate-500 mt-1">Procedural (Paperwork)</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">5M+</div>
          <div className="text-xs text-slate-500 mt-1">Children Lost Coverage</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">10.2%</div>
          <div className="text-xs text-slate-500 mt-1">Peak Uninsured Rate</div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What Was Continuous Enrollment?</h2>
        <p>
          In March 2020, as part of the Families First Coronavirus Response Act, Congress offered states a deal:
          receive a <strong className="text-white">6.2 percentage point boost</strong> to your Federal Medical Assistance
          Percentage (FMAP) — but in exchange, you can&apos;t remove anyone from Medicaid for any reason. Not
          for income changes, not for moving out of state, not even for death in some cases.
        </p>
        <p>
          For three years, Medicaid operated as a one-way door. People could enroll but couldn&apos;t be removed.
          The predictable result: enrollment ballooned from <strong className="text-white">71 million</strong> (February 2020)
          to <strong className="text-white">94 million</strong> (March 2023) — a 32% increase. Some of that growth
          was legitimate: millions lost jobs and employer coverage during the pandemic. But a significant portion
          were people who got jobs, moved, or became eligible for other coverage but stayed on the rolls because
          states literally couldn&apos;t remove them.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Unwinding Begins: April 2023</h2>
        <p>
          The Consolidated Appropriations Act of 2023 set March 31, 2023 as the end date. Starting April 1,
          states could resume normal eligibility redeterminations — but they had to work through their entire
          caseload within 14 months. For most states, this meant reviewing <strong className="text-white">millions
          of cases</strong> with eligibility systems that hadn&apos;t been stress-tested in three years.
        </p>
        <p>
          CMS gave states a framework: prioritize &quot;ex parte&quot; renewals (using existing data to verify
          eligibility without requiring paperwork from enrollees), send notices in multiple languages, and
          give people at least 30 days to respond. Some states followed this guidance carefully. Others
          treated it as a suggestion.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Procedural Disenrollment Problem</h2>
        <p>
          The most damning statistic from the unwinding: <strong className="text-white">72% of all disenrollments
          were procedural</strong>. That means nearly three-quarters of the 25.4 million people who lost coverage
          were removed not because anyone determined they were ineligible, but because they didn&apos;t return
          a form, couldn&apos;t be reached at their address on file, or missed a deadline.
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <h3 className="text-lg font-bold text-white mb-3">Why Procedural Rates Were So High</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li><strong className="text-white">Outdated contact info</strong> — After 3 years without verification, millions of addresses, phone numbers, and emails were stale</li>
            <li><strong className="text-white">Overwhelmed systems</strong> — State eligibility workers faced unprecedented caseloads; some states had 500,000+ cases per month</li>
            <li><strong className="text-white">Short deadlines</strong> — Many states gave 30 days to respond, with no extensions</li>
            <li><strong className="text-white">Language barriers</strong> — Renewal forms often arrived only in English in states with large non-English-speaking populations</li>
            <li><strong className="text-white">Digital access gaps</strong> — Online renewal portals were unavailable or broken in several states</li>
          </ul>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mt-4">
          <p className="text-sm text-amber-400 font-semibold mb-2">🤔 The Other Side</p>
          <p className="text-sm text-slate-300">
            Not everyone who didn&apos;t return paperwork was a victim of bureaucratic failure. Many of those 18+
            million &quot;procedural&quot; disenrollments were people who had moved on — they got employer coverage,
            aged into Medicare, moved to another state, or simply no longer needed Medicaid. When you haven&apos;t
            verified someone&apos;s eligibility in three years, a non-response to a renewal form may simply mean
            &quot;I don&apos;t need this anymore.&quot; The continuous enrollment mandate created an artificially
            inflated baseline, and the correction was always going to look dramatic.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">State-by-State Disenrollment</h2>
        <p>
          The unwinding hit every state, but the scale and procedural rates varied enormously based on
          whether states expanded Medicaid, how much they invested in outreach, and how aggressively
          they processed cases.
        </p>
        <div className="space-y-3 my-6">
          {stateDisenrollment.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-3 sm:w-32">
                <span className="font-bold text-white">{s.state}</span>
              </div>
              <span className="text-sm font-mono text-red-400 sm:w-20">{s.lost} lost</span>
              <span className="text-sm font-mono text-amber-400 sm:w-28">{s.pctProcedural} procedural</span>
              <p className="text-sm text-slate-400 flex-1">{s.note}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          Source: KFF Medicaid Enrollment Tracker, CMS redetermination reports, state-level data through Q1 2026.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Children: The Most Vulnerable Casualties</h2>
        <p>
          More than <strong className="text-white">5 million children</strong> lost Medicaid or CHIP coverage during
          the unwinding — a number that drew bipartisan criticism. Children can&apos;t fill out renewal forms.
          They depend entirely on parents or guardians to navigate the process, and many parents in
          Medicaid-eligible households face their own barriers: limited English, unstable housing,
          multiple jobs, or simple unfamiliarity with government paperwork.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-red-400">5M+</div>
            <div className="text-xs text-slate-500 mt-1">Children Disenrolled</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-amber-400">76%</div>
            <div className="text-xs text-slate-500 mt-1">Procedural (Children)</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-green-400">2.1M</div>
            <div className="text-xs text-slate-500 mt-1">Re-enrolled by Mid-2026</div>
          </div>
        </div>
        <p>
          CMS responded by issuing guidance in August 2023 requiring states to implement ex parte renewals
          for children wherever possible and to reinstate children who were improperly disenrolled. By
          mid-2026, approximately 2.1 million children had been re-enrolled, but millions remain uninsured
          or in coverage gaps.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">States That Paused: What Happened</h2>
        <p>
          CMS intervened in several states where disenrollment processes were clearly broken. The agency
          issued corrective action plans and, in some cases, ordered states to pause terminations entirely.
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">Arkansas</div>
              <p className="text-sm text-slate-300">Paused Oct 2023 after procedural rate hit 89%. Resumed Jan 2024 with simplified forms. Post-pause rate dropped to 61%.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">Idaho</div>
              <p className="text-sm text-slate-300">Paused Nov 2023. System was auto-terminating people who had returned forms. Resumed after IT fix in Feb 2024.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Oregon</div>
              <p className="text-sm text-slate-300">Voluntary pause Oct–Dec 2023. Discovered automated system errors. Re-enrolled 68,000 people before resuming.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">South Dakota</div>
              <p className="text-sm text-slate-300">CMS-ordered pause Dec 2023. State was not sending renewal forms to correct addresses. Fixed address verification, resumed Mar 2024.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Utah</div>
              <p className="text-sm text-slate-300">Paused Jan 2024 after children&apos;s disenrollment rate spiked. Implemented ex parte renewals for children under 6.</p>
            </div>
          </div>
        </div>
        <p>
          The pattern was clear: states that paused and fixed their processes saw significantly lower procedural
          disenrollment rates when they resumed. The problem was never that too many people were ineligible —
          it was that state systems weren&apos;t equipped to process millions of renewals at once.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Re-enrollment Rates by State</h2>
        <p>
          Some disenrolled individuals later re-enrolled in Medicaid, found marketplace coverage, or obtained
          employer insurance. Re-enrollment rates varied dramatically by state, largely driven by how much
          states invested in outreach and whether they had functioning online renewal systems.
        </p>
        <div className="space-y-3 my-6">
          {reEnrollmentRates.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-3 sm:w-36">
                <span className="font-bold text-white">{s.state}</span>
              </div>
              <span className="text-sm font-mono text-green-400 sm:w-20">{s.rate}</span>
              <p className="text-sm text-slate-400 flex-1">{s.note}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Impact on the Uninsured Rate</h2>
        <p>
          The unwinding&apos;s most visible consequence was a sharp increase in the national uninsured rate.
          Before the unwinding, the U.S. had reached a historic low uninsured rate of <strong className="text-white">7.7%</strong> —
          partly due to Medicaid&apos;s artificially inflated enrollment. As millions lost coverage, the rate
          climbed to <strong className="text-white">10.2%</strong> by Q3 2024, the highest level since 2018.
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-sm font-mono text-green-400 w-28 shrink-0">Q1 2023</div>
              <p className="text-sm text-slate-300">Uninsured rate: <strong className="text-white">7.7%</strong> — historic low, boosted by continuous enrollment</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Q4 2023</div>
              <p className="text-sm text-slate-300">Uninsured rate: <strong className="text-white">8.9%</strong> — unwinding impact begins showing in survey data</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">Q3 2024</div>
              <p className="text-sm text-slate-300">Uninsured rate: <strong className="text-white">10.2%</strong> — peak, as unwinding disenrollments fully reflected</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Q1 2026</div>
              <p className="text-sm text-slate-300">Uninsured rate: <strong className="text-white">9.4%</strong> — partial recovery as people find alternative coverage</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">CMS Enforcement Actions</h2>
        <p>
          CMS took an increasingly active enforcement role as the unwinding progressed. Key actions included:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">30+ corrective action plans</strong> issued to states with excessive procedural disenrollment rates</li>
          <li><strong className="text-white">Mandatory reinstatement orders</strong> for states that improperly terminated eligible enrollees</li>
          <li><strong className="text-white">Monthly reporting requirements</strong> — states had to submit detailed disenrollment data to CMS</li>
          <li><strong className="text-white">Ex parte renewal mandates</strong> — states required to attempt automatic renewals before sending paper forms</li>
          <li><strong className="text-white">Enhanced call center standards</strong> — maximum hold times and multilingual support requirements</li>
        </ul>
        <p>
          Whether CMS&apos;s interventions helped or simply slowed down a necessary correction is debatable.
          States that received corrective action plans did reduce procedural rates, but they also took longer
          to complete redeterminations, extending the uncertainty for enrollees.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Timeline of Key Events</h2>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Mar 2020</div>
              <p className="text-sm text-slate-300">COVID emergency declared. Continuous enrollment provision enacted as part of Families First Coronavirus Response Act.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Mar 2023</div>
              <p className="text-sm text-slate-300">Continuous enrollment ends. Medicaid enrollment at all-time peak of <strong className="text-white">94 million</strong>.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Apr 2023</div>
              <p className="text-sm text-slate-300">States begin redeterminations. First wave of disenrollment notices sent to tens of millions.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">Aug 2023</div>
              <p className="text-sm text-slate-300">CMS issues first corrective action plans as procedural disenrollment rates exceed 80% in some states.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">Oct 2023</div>
              <p className="text-sm text-slate-300">First state pauses (Arkansas, Oregon). Children&apos;s disenrollment draws bipartisan criticism.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Jun 2024</div>
              <p className="text-sm text-slate-300">14-month unwinding deadline. Most states request and receive extensions for remaining cases.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Sep 2024</div>
              <p className="text-sm text-slate-300">Initial unwinding largely complete. 25M+ disenrolled. Enrollment stabilizes around 78 million.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Jun 2026</div>
              <p className="text-sm text-slate-300">Current enrollment: <strong className="text-white">74.3 million</strong>. Stabilization phase, but work requirements loom.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Where Things Stand: Mid-2026</h2>
        <p>
          The initial unwinding is essentially complete. Enrollment has stabilized around <strong className="text-white">74.3
          million</strong> — still above the pre-pandemic baseline of 71 million but far below the 94 million peak.
          The remaining tasks:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Backlog processing</strong> — Several states are still working through cases that were paused or appealed</li>
          <li><strong className="text-white">Re-enrollment campaigns</strong> — CMS and states running targeted outreach to people who were improperly disenrolled</li>
          <li><strong className="text-white">System upgrades</strong> — States investing in eligibility system modernization before work requirements hit in 2027</li>
          <li><strong className="text-white">Data reconciliation</strong> — Matching disenrolled individuals with marketplace, employer, and other coverage databases</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Bottom Line</h2>
        <p>
          The Medicaid unwinding was painful but inevitable. You can&apos;t freeze a $900 billion program&apos;s
          eligibility verification for three years and not expect a messy correction. The 94 million peak was
          artificial — the product of a policy that banned states from removing <em>anyone</em>, for any reason,
          including people who had long since moved on to other coverage.
        </p>
        <p>
          That said, the execution was often terrible. A 72% procedural disenrollment rate reflects systems
          that were unprepared, underfunded, and in some cases, indifferent. Whether those 18 million
          procedural disenrollments represent bureaucratic failure or people who simply didn&apos;t need
          Medicaid anymore is the central question — and the honest answer is probably &quot;a lot of both.&quot;
        </p>
        <p>
          With work requirements arriving in January 2027, the next phase of coverage disruption is already
          on the horizon. The lessons from the unwinding — invest in systems, communicate clearly, don&apos;t
          assume a non-response means ineligibility — will determine whether the next transition is smoother
          or just as chaotic.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-4">
            <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
            <p className="text-sm text-slate-300">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <RelatedInsights
          currentSlug="medicaid-unwinding"
          relatedSlugs={["enrollment-trends-2026", "work-requirements-2026", "spending-by-state"]}
        />
      </div>
    </article>
  );
}
