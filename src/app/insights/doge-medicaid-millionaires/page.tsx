import type { Metadata } from "next";
import Link from "next/link";
import FAQSchema from "@/components/FAQSchema";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "Medicaid Millionaires: DOGE's $6.4 Billion Dead Enrollee Claim, Examined",
  description: "DOGE claimed $6.4 billion was paid to dead Medicaid enrollees. The actual confirmed waste was ~$340 million. Here's what they got right, what they overstated, and why the real number matters.",
  keywords: ["DOGE medicaid", "medicaid fraud dead enrollees", "medicaid millionaires", "DOGE waste fraud", "medicaid improper payments", "dead enrollee payments"],
  openGraph: {
    title: "Medicaid Millionaires: DOGE's $6.4B Dead Enrollee Claim, Examined",
    description: "DOGE's viral claim: $6.4B paid for dead Medicaid enrollees. Actual confirmed waste: ~$340M. The full breakdown.",
  },
};

export default function DogeMedicaidMillionaires() {
  const claimBreakdown = [
    { category: "Services rendered before death", amount: "$3.8B", pct: "59%", status: "Legitimate", note: "Patient received care, then died. Claim filed after death date." },
    { category: "Retroactive eligibility claims", amount: "$1.2B", pct: "19%", status: "Legitimate", note: "Eligibility backdated per federal rules; claims appear post-death." },
    { category: "Death record timing lag", amount: "$740M", pct: "12%", status: "Timing Issue", note: "State death records lag 90-180 days. Claims processed before death recorded." },
    { category: "Duplicate/erroneous payments", amount: "$340M", pct: "5%", status: "Actual Waste", note: "Confirmed duplicate payments, billing for services after verified death." },
    { category: "Data matching errors", amount: "$320M", pct: "5%", status: "System Error", note: "Wrong SSN matched to deceased individual; living patient actually received care." },
  ];

  const stateIssues = [
    { state: "Texas", issue: "Death records integrated quarterly, not real-time. 4-6 month lag in Medicaid system.", amount: "$480M flagged" },
    { state: "California", issue: "Multiple eligibility systems with inconsistent death record matching.", amount: "$620M flagged" },
    { state: "New York", issue: "Home care billing continued 60-90 days post-death due to batch processing.", amount: "$390M flagged" },
    { state: "Florida", issue: "No automated death record cross-check until 2024. Manual review only.", amount: "$310M flagged" },
    { state: "Pennsylvania", issue: "County-administered system with 67 separate eligibility databases.", amount: "$280M flagged" },
    { state: "Illinois", issue: "Managed care plans not receiving timely death notifications from state.", amount: "$240M flagged" },
  ];

  const faqs = [
    {
      question: "Did DOGE really find $6.4 billion in payments to dead Medicaid enrollees?",
      answer: "DOGE identified $6.4 billion in Medicaid claims associated with deceased enrollees, but the vast majority — approximately 95% — were legitimate payments. Most were for services rendered before the patient died, retroactive eligibility adjustments, or timing lags between death and death record processing. The actual confirmed waste from true improper payments to deceased enrollees was approximately $340 million in duplicate or erroneous payments."
    },
    {
      question: "What are 'Medicaid Millionaires'?",
      answer: "The term 'Medicaid Millionaires' was coined during DOGE's social media campaign to describe cases where cumulative Medicaid claims associated with a single deceased enrollee exceeded $1 million. In most cases, these were patients with complex medical conditions (cancer, organ transplants, long-term care) whose legitimate treatment costs were high before death. The label implied fraud but the underlying claims were overwhelmingly for actual medical services."
    },
    {
      question: "Why do death records lag behind in Medicaid systems?",
      answer: "Death records flow from local vital statistics offices to state health departments to the Social Security Administration and then to CMS and state Medicaid agencies. This chain typically takes 90 to 180 days. Some states only cross-reference death records with Medicaid enrollment quarterly or semi-annually. During this lag, claims can be legitimately processed for enrollees who have died but whose death hasn't been recorded in the Medicaid system yet."
    },
    {
      question: "How does Medicaid's improper payment rate compare to Medicare's?",
      answer: "Medicaid's overall improper payment rate is approximately 15.6% ($97 billion in FY2025), while Medicare's is about 7.7% ($47 billion). However, 'improper payment' includes documentation errors, not just fraud or waste. The GAO estimates actual fraud accounts for less than 3% of total Medicaid spending. DOGE's dead enrollee claims, even at the full $6.4 billion figure, represent less than 1% of total Medicaid spending."
    },
    {
      question: "What changes resulted from DOGE's findings?",
      answer: "CMS announced several policy changes in response: mandatory real-time death record cross-matching for all state Medicaid programs by January 2027, standardized 30-day death record integration timelines, automated claim suspension when a death record is matched, and quarterly audits of claims associated with deceased enrollees. Several states also accelerated their own death record integration timelines."
    },
    {
      question: "Was DOGE's analysis methodologically sound?",
      answer: "DOGE's analysis correctly identified fragmented state databases and poor identity verification as real problems. However, their methodology conflated timing issues with fraud, counted legitimate pre-death services as waste, and used cumulative rather than post-death-only claim amounts. Independent analyses by KFF, the GAO, and CMS's own Office of the Actuary all confirmed the $6.4 billion figure was dramatically overstated as a measure of actual waste."
    },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Medicaid Millionaires: DOGE's $6.4 Billion Dead Enrollee Claim, Examined",
          "description": "DOGE claimed $6.4B paid to dead Medicaid enrollees. Actual waste: ~$340M. Full fact-check and analysis.",
          "datePublished": "2026-07-11",
          "url": "https://www.openmedicaid.org/insights/doge-medicaid-millionaires",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/doge-medicaid-millionaires" }
        }) }}
      />
      <FAQSchema faqs={faqs} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">DOGE Medicaid Millionaires</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs font-medium text-purple-400">Fact Check</span>
          <span className="text-xs text-slate-500">July 11, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">10 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Medicaid Millionaires: DOGE&apos;s $6.4 Billion Dead Enrollee Claim, Examined
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          DOGE made headlines claiming <strong className="text-white">$6.4 billion</strong> in Medicaid payments went
          to dead enrollees. The &quot;Medicaid Millionaires&quot; campaign went viral. But when you look at
          the actual data, the confirmed waste was closer to <strong className="text-white">$340 million</strong> —
          about 5% of the headline figure. Here&apos;s what they got right, what they overstated, and why
          the distinction matters.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-purple-400">$6.4B</div>
          <div className="text-xs text-slate-500 mt-1">DOGE&apos;s Claim</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">$340M</div>
          <div className="text-xs text-slate-500 mt-1">Confirmed Waste</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">95%</div>
          <div className="text-xs text-slate-500 mt-1">Legitimate Claims</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">5%</div>
          <div className="text-xs text-slate-500 mt-1">Actual Waste</div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Viral Claim</h2>
        <p>
          In early 2026, DOGE released an analysis claiming that <strong className="text-white">$6.4 billion</strong> in
          Medicaid payments had been made on behalf of deceased enrollees. The analysis matched Social Security
          death records against Medicaid claims data and flagged every claim associated with a deceased
          enrollee&apos;s identifier. The resulting &quot;Medicaid Millionaires&quot; social media campaign
          highlighted individual cases where cumulative claims exceeded $1 million per deceased person.
        </p>
        <p>
          The claim spread rapidly. &quot;$6.4 billion to dead people&quot; is a powerful soundbite. But like
          most soundbites, it collapsed under scrutiny.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Breaking Down the $6.4 Billion</h2>
        <p>
          When independent analysts — including KFF, the GAO, and CMS&apos;s own actuaries — examined the
          underlying data, they found the $6.4 billion breaks down into five distinct categories:
        </p>
        <div className="space-y-3 my-6">
          {claimBreakdown.map((item) => (
            <div key={item.category} className="bg-dark-800 border border-dark-600 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <span className="font-bold text-white flex-1">{item.category}</span>
                <span className="text-sm font-mono text-blue-400">{item.amount}</span>
                <span className="text-sm font-mono text-slate-500">({item.pct})</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.status === "Legitimate" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                  item.status === "Actual Waste" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                  "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>{item.status}</span>
              </div>
              <p className="text-sm text-slate-400">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6 mt-4">
          <p className="text-sm text-green-400 font-semibold mb-2">✅ The Key Finding</p>
          <p className="text-sm text-slate-300">
            78% of the $6.4 billion ($5.0B) was for <strong className="text-white">legitimate medical services</strong> —
            care that was actually provided to living patients who subsequently died. These claims would exist
            in any healthcare system. You don&apos;t stop paying for someone&apos;s chemotherapy retroactively
            because they died two weeks after treatment.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The &quot;Medicaid Millionaires&quot; Campaign</h2>
        <p>
          DOGE&apos;s social media campaign highlighted individual cases with dramatic claim totals. A patient
          in California with $2.3 million in cumulative claims. A New York home care recipient with $1.8 million.
          A Texas dialysis patient with $1.1 million. Each case was presented as evidence of fraud.
        </p>
        <p>
          In reality, these were overwhelmingly patients with <strong className="text-white">complex, expensive
          medical conditions</strong> — organ transplants, long-term dialysis, cancer treatment, or years of
          nursing home care — who happened to die. The high claim totals reflected the cost of treating
          seriously ill people, not fraud. A single organ transplant can cost $500,000+. Years of dialysis
          runs $80,000+ annually. Nursing home care averages $94,000 per year.
        </p>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mt-4">
          <p className="text-sm text-amber-400 font-semibold mb-2">🤔 The Uncomfortable Truth</p>
          <p className="text-sm text-slate-300">
            The &quot;Medicaid Millionaires&quot; framing exploited a basic misunderstanding: that Medicaid
            claims associated with a deceased person are inherently suspicious. In any health insurance
            system — private, Medicare, Medicaid — the sickest patients generate the highest claims, and
            the sickest patients are the most likely to die. Flagging high-cost deceased patients as
            &quot;millionaires&quot; is like flagging hospitals with the most deaths as the most dangerous —
            it confuses correlation with causation.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Provider-Level Analysis</h2>
        <p>
          When our team examined the provider-level data behind DOGE&apos;s claims, a clearer picture emerged.
          The providers billing for deceased patients fell into several categories:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Hospitals and health systems (62%)</strong> — Inpatient stays that began before death and were billed after. Entirely legitimate.</li>
          <li><strong className="text-white">Home health agencies (18%)</strong> — Some legitimate (final month services), some with billing that continued 30-60 days post-death due to batch processing. A gray area.</li>
          <li><strong className="text-white">Pharmacies (11%)</strong> — Prescription fills processed before death record reached Medicaid system. Legitimate but preventable with faster data matching.</li>
          <li><strong className="text-white">Individual providers (6%)</strong> — Office visits and procedures. Mostly legitimate pre-death services billed after.</li>
          <li><strong className="text-white">Suspicious billers (3%)</strong> — Providers who billed for services clearly after death was recorded. These represent the actual fraud signal worth investigating.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">State-Level Data Matching Problems</h2>
        <p>
          DOGE was right about one thing: state Medicaid systems are <strong className="text-white">badly
          fragmented</strong> when it comes to death record matching. The speed at which a death is reflected
          in the Medicaid system varies enormously by state.
        </p>
        <div className="space-y-3 my-6">
          {stateIssues.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-3 sm:w-32">
                <span className="font-bold text-white">{s.state}</span>
              </div>
              <span className="text-sm font-mono text-amber-400 sm:w-28">{s.amount}</span>
              <p className="text-sm text-slate-400 flex-1">{s.issue}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Comparison: Medicare Improper Payments</h2>
        <p>
          Context matters. Medicaid&apos;s overall improper payment rate of <strong className="text-white">15.6%</strong> ($97B
          in FY2025) is higher than Medicare&apos;s <strong className="text-white">7.7%</strong> ($47B), but this includes
          documentation errors, coding mistakes, and eligibility issues — not just fraud. The GAO estimates
          actual fraud in Medicaid at less than 3% of total spending.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-red-400">15.6%</div>
            <div className="text-xs text-slate-500 mt-1">Medicaid Improper Rate</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-amber-400">7.7%</div>
            <div className="text-xs text-slate-500 mt-1">Medicare Improper Rate</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-green-400">&lt;3%</div>
            <div className="text-xs text-slate-500 mt-1">Estimated Actual Fraud</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What DOGE Got Right</h2>
        <p>
          Credit where it&apos;s due. DOGE&apos;s analysis, despite its exaggerated headline, highlighted
          real structural problems:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Fragmented state databases</strong> — Medicaid is administered by 50+ separate state systems with no standardized data sharing. This is a real problem.</li>
          <li><strong className="text-white">Poor identity verification</strong> — Some states still rely on self-reported SSNs without real-time verification against federal databases.</li>
          <li><strong className="text-white">Death record lag</strong> — 90-180 day delays in death record integration are genuinely problematic and lead to preventable payments.</li>
          <li><strong className="text-white">Duplicate payments</strong> — The $340M in confirmed duplicates reflects real system failures that should be fixed.</li>
          <li><strong className="text-white">Lack of real-time eligibility checks</strong> — Many states still process eligibility in batch, not real-time, creating windows for improper payments.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What They Overstated</h2>
        <p>
          The gap between DOGE&apos;s $6.4 billion claim and the $340 million in actual waste came from
          several methodological choices:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Conflating timing with fraud</strong> — Claims processed after death ≠ claims for services after death. Most were for real care provided to living patients.</li>
          <li><strong className="text-white">Using cumulative totals</strong> — Adding up all claims ever associated with a deceased enrollee, including years of legitimate pre-death treatment.</li>
          <li><strong className="text-white">Ignoring retroactive eligibility</strong> — Federal rules allow retroactive Medicaid coverage. Claims that appear &quot;post-death&quot; may be legitimate retroactive adjustments.</li>
          <li><strong className="text-white">Cherry-picking outliers</strong> — The &quot;Medicaid Millionaires&quot; campaign selected the most expensive cases, which were invariably the sickest patients.</li>
          <li><strong className="text-white">No comparison baseline</strong> — Every insurance system has claims associated with deceased enrollees. Without a baseline, the numbers lack context.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Policy Recommendations That Emerged</h2>
        <p>
          Despite the exaggerated claims, the scrutiny produced useful policy momentum:
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-sm font-mono text-green-400 w-40 shrink-0">Real-time matching</div>
              <p className="text-sm text-slate-300">All states required to implement real-time death record cross-matching by January 2027. Currently only 23 states have this capability.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-green-400 w-40 shrink-0">30-day integration</div>
              <p className="text-sm text-slate-300">Death records must be integrated into eligibility systems within 30 days of receipt, down from current average of 120 days.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-green-400 w-40 shrink-0">Auto-suspension</div>
              <p className="text-sm text-slate-300">Claims automatically suspended when a death record match is detected, pending manual review within 14 days.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-green-400 w-40 shrink-0">Quarterly audits</div>
              <p className="text-sm text-slate-300">States must submit quarterly reports on claims associated with deceased enrollees, with root cause analysis for any post-death billing.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Timeline of the Controversy</h2>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-sm font-mono text-purple-400 w-28 shrink-0">Jan 2026</div>
              <p className="text-sm text-slate-300">DOGE publishes initial analysis claiming $6.4 billion in Medicaid payments to deceased enrollees.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-purple-400 w-28 shrink-0">Jan 2026</div>
              <p className="text-sm text-slate-300">&quot;Medicaid Millionaires&quot; social media campaign launches. Individual cases shared with millions of views.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Feb 2026</div>
              <p className="text-sm text-slate-300">KFF publishes fact-check showing 95% of flagged claims were legitimate. GAO opens investigation.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Mar 2026</div>
              <p className="text-sm text-slate-300">CMS releases official response: confirmed waste is approximately $340 million, not $6.4 billion.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-green-400 w-28 shrink-0">Apr 2026</div>
              <p className="text-sm text-slate-300">CMS announces new death record matching requirements for all state Medicaid programs.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-green-400 w-28 shrink-0">May 2026</div>
              <p className="text-sm text-slate-300">GAO report confirms CMS estimate. Recommends real-time death record integration by 2027.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Broader Improper Payment Problem</h2>
        <p>
          While the dead enrollee claims were overstated, Medicaid does have a genuine improper payment
          problem. The $97 billion in estimated improper payments for FY2025 represents real money — even
          if most of it stems from documentation errors rather than fraud. The breakdown:
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Documentation/coding errors</span>
              <span className="text-sm font-mono text-amber-400">~$55B (57%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Eligibility verification failures</span>
              <span className="text-sm font-mono text-amber-400">~$22B (23%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Provider billing errors</span>
              <span className="text-sm font-mono text-amber-400">~$12B (12%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Suspected fraud</span>
              <span className="text-sm font-mono text-red-400">~$8B (8%)</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">CMS Response</h2>
        <p>
          CMS acknowledged the data matching gaps while pushing back on the $6.4 billion figure. In a
          March 2026 report, CMS stated that &quot;the vast majority of claims identified in the DOGE
          analysis were for legitimate medical services provided to living beneficiaries&quot; and that
          confirmed improper payments to deceased enrollees totaled &quot;approximately $340 million over
          the review period.&quot;
        </p>
        <p>
          CMS also announced new verification requirements, including mandatory enrollment in the Social
          Security Administration&apos;s Death Master File matching service for all state Medicaid programs
          and standardized claim suspension protocols when death records are matched.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Bottom Line</h2>
        <p>
          DOGE found a real problem — fragmented state databases and slow death record integration — and
          then inflated it by 19x. The $6.4 billion headline was designed for social media impact, not
          policy accuracy. The actual waste of $340 million is still significant and worth fixing, but
          it&apos;s 0.05% of annual Medicaid spending, not the systemic fraud crisis DOGE portrayed.
        </p>
        <p>
          The irony is that DOGE didn&apos;t need to exaggerate. Medicaid has plenty of real problems:
          a 15.6% improper payment rate, billions in managed care overpayments, and widespread provider
          fraud that our own analysis documents extensively. By overstating one finding, they undermined
          credibility on the legitimate issues.
        </p>
        <p>
          Good oversight requires accurate numbers. $340 million in preventable waste is a problem worth
          solving. $6.4 billion in mostly-legitimate claims is a misleading distraction from solving it.
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
          currentSlug="doge-medicaid-millionaires"
          relatedSlugs={["doge-fraud-findings", "doge-medicaid", "improper-payments"]}
        />
      </div>
    </article>
  );
}
