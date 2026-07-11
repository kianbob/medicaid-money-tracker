import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "Medicaid Enrollment Trends 2026: 74.3M Enrollees and Falling",
  description: "Medicaid enrollment dropped from 94M peak to 74.3M by March 2026 — a 21% decline. Post-unwinding data, state-by-state changes, and what work requirements mean for the trajectory.",
  keywords: ["medicaid enrollment 2026", "medicaid enrollment trends", "medicaid unwinding data", "medicaid enrollment decline", "medicaid enrollment by state 2026"],
  openGraph: {
    title: "Medicaid Enrollment Trends 2026: 74.3M Enrollees and Falling",
    description: "From 94M peak to 74.3M — Medicaid enrollment has dropped 21%. Here's the post-unwinding picture and what comes next.",
  },
};

export default function EnrollmentTrends2026() {
  const stateChanges = [
    { state: "Indiana", change: "-20%", enrollees: "~1.1M", note: "Largest percentage decline nationally" },
    { state: "Texas", change: "-12%", enrollees: "~4.8M", note: "Non-expansion state, aggressive redeterminations" },
    { state: "Florida", change: "-11%", enrollees: "~3.9M", note: "Non-expansion state, high procedural disenrollment" },
    { state: "California", change: "-7%", enrollees: "~12.1M", note: "Largest absolute enrollment, moderate decline" },
    { state: "New York", change: "-6%", enrollees: "~6.8M", note: "Steady decline from post-pandemic highs" },
    { state: "Iowa", change: "<-1%", enrollees: "~680K", note: "Smallest decline nationally" },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Medicaid Enrollment Trends 2026: 74.3M Enrollees and Falling",
          "description": "Medicaid enrollment dropped from 94M peak to 74.3M. Post-unwinding data and what work requirements mean next.",
          "datePublished": "2026-07-11",
          "url": "https://www.openmedicaid.org/insights/enrollment-trends-2026",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/enrollment-trends-2026" }
        }) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Enrollment Trends 2026</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-400">Data Analysis</span>
          <span className="text-xs text-slate-500">July 11, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">7 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Medicaid Enrollment Trends 2026: The Post-Unwinding Picture
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Medicaid enrollment peaked at <strong className="text-white">94 million</strong> in March 2023 when COVID&apos;s
          continuous enrollment mandate ended. Since then, 20 million people have been removed from the rolls. As of
          March 2026, enrollment stands at <strong className="text-white">74.3 million</strong> — and with work requirements
          taking effect in January 2027, the trajectory points further down.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">74.3M</div>
          <div className="text-xs text-slate-500 mt-1">Current Enrollment</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">-21%</div>
          <div className="text-xs text-slate-500 mt-1">From 94M Peak</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">25M+</div>
          <div className="text-xs text-slate-500 mt-1">Disenrolled (Unwinding)</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">+4%</div>
          <div className="text-xs text-slate-500 mt-1">vs. Pre-Pandemic</div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Full Arc: 2014–2026</h2>
        <p>
          Understanding where Medicaid enrollment stands requires understanding how we got here:
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-sm font-mono text-slate-500 w-28 shrink-0">Jan 2014</div>
              <p className="text-sm text-slate-300">ACA Medicaid expansion begins. Enrollment starts climbing as states expand eligibility to adults up to 138% FPL.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Mar 2017</div>
              <p className="text-sm text-slate-300">First enrollment peak: <strong className="text-white">75 million</strong>. Starts declining as expansion slows.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-slate-500 w-28 shrink-0">Feb 2020</div>
              <p className="text-sm text-slate-300">Pre-pandemic baseline: <strong className="text-white">71 million</strong> enrolled.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Mar 2020</div>
              <p className="text-sm text-slate-300">COVID hits. Congress passes continuous enrollment provision — states can&apos;t disenroll anyone in exchange for enhanced federal funding.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">Mar 2023</div>
              <p className="text-sm text-slate-300">All-time peak: <strong className="text-white">94 million</strong>. Three years of zero disenrollment inflated rolls by 32%.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Apr 2023</div>
              <p className="text-sm text-slate-300">Unwinding begins. States start redetermining eligibility for everyone on the rolls.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Sep 2024</div>
              <p className="text-sm text-slate-300">Enrollment drops to 80 million. Most unwinding complete — 25M+ disenrolled.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Mar 2026</div>
              <p className="text-sm text-slate-300">Current: <strong className="text-white">74.3 million</strong>. Decline resumed after brief stabilization in late 2024.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Unwinding: What Happened</h2>
        <p>
          Between April 2023 and September 2024, states processed redeterminations for nearly their entire Medicaid
          populations. The results were revealing:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-green-400">56M</div>
            <div className="text-xs text-slate-500 mt-1">Coverage Renewed (69%)</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-red-400">25M+</div>
            <div className="text-xs text-slate-500 mt-1">Disenrolled (31%)</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-amber-400">69%</div>
            <div className="text-xs text-slate-500 mt-1">Disenrolled for Paperwork</div>
          </div>
        </div>
        <p>
          That last number is the most important: <strong className="text-white">69% of disenrollments were for
          procedural reasons</strong> — people who didn&apos;t return paperwork, not people found ineligible. Only
          31% were determined actually ineligible after review.
        </p>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mt-4">
          <p className="text-sm text-amber-400 font-semibold mb-2">🤔 What This Means</p>
          <p className="text-sm text-slate-300">
            Depending on your perspective, the high procedural disenrollment rate either means (a) the system failed
            people who were eligible but couldn&apos;t navigate bureaucracy, or (b) many of those 25 million people had
            moved on — gotten jobs with insurance, moved states, or simply didn&apos;t need Medicaid anymore but never
            bothered to tell anyone. The truth is probably both. But the continuous enrollment mandate clearly kept
            millions on the rolls who didn&apos;t belong there.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">State-by-State Changes</h2>
        <p>
          Enrollment declines from March 2025 to March 2026 varied dramatically by state:
        </p>
        <div className="space-y-3 my-6">
          {stateChanges.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-3 sm:w-36">
                <span className="font-bold text-white">{s.state}</span>
                <span className="text-sm font-mono text-red-400">{s.change}</span>
              </div>
              <span className="text-sm text-slate-500 sm:w-24">{s.enrollees}</span>
              <p className="text-sm text-slate-400 flex-1">{s.note}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          All 50 states and DC saw enrollment declines from March 2025 to March 2026. Adult enrollment increased in
          only 6 states (IA, MO, NC, OK, SD, WY).
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Children: A Different Story</h2>
        <p>
          While overall enrollment is falling, the picture for children is more nuanced. Child enrollment in
          Medicaid/CHIP <strong className="text-white">declined by 445,000 (1%)</strong> from February 2020 to March 2026.
          CHIP enrollment has actually <em>increased</em> in 19 states, partially offsetting Medicaid losses as children
          moved between programs.
        </p>
        <p>
          The 7.2 million children enrolled in CHIP represent a population that&apos;s largely shielded from work
          requirements (which apply to adults in the expansion group). But eligibility changes for immigrant families
          starting October 2026 could affect some children.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What&apos;s Coming: The Work Requirements Effect</h2>
        <p>
          Current enrollment of 74.3 million is <strong className="text-white">still 4% above pre-pandemic levels</strong> (71M
          in February 2020), even after 20 million disenrollments. The reconciliation law&apos;s provisions will push
          enrollment lower through several mechanisms:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Work requirements (Jan 2027)</strong> — The largest source of projected enrollment decline. CBO estimates millions of expansion adults may lose coverage.</li>
          <li><strong className="text-white">Immigrant eligibility restrictions (Oct 2026)</strong> — Certain immigrant populations lose Medicaid access.</li>
          <li><strong className="text-white">Six-month redeterminations</strong> — States required to verify eligibility twice a year instead of annually, catching changes faster.</li>
          <li><strong className="text-white">Reduced FMAP rates</strong> — Lower federal matching could lead states to restrict optional populations.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Impact on Provider Billing</h2>
        <p>
          Enrollment changes directly affect the providers in our database. Fewer enrollees means fewer
          billable patients, which means:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li>Providers with unusually high patient volumes may see natural corrections</li>
          <li>States with aggressive disenrollment (Indiana: -20%) will see the biggest billing shifts</li>
          <li>Managed care plans are already losing members — 60.4 million in managed care by March 2026, down 4.8% year-over-year</li>
          <li>Providers in our watchlist billing at anomalous levels will face even greater scrutiny as legitimate patient pools shrink</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Bottom Line</h2>
        <p>
          Medicaid enrollment is normalizing after the artificial pandemic-era inflation. The 94 million peak was never
          sustainable — it was the predictable result of a policy that banned states from removing <em>anyone</em> from
          the rolls for three years. The correction to 74.3 million is painful for some, but it&apos;s a return to
          verifying that people on a $900+ billion program actually qualify.
        </p>
        <p>
          With work requirements, immigrant eligibility changes, and six-month redeterminations ahead, enrollment will
          likely drop further — potentially below the pre-pandemic 71 million baseline. Whether that represents
          right-sizing or over-correction depends on how well states implement the new rules.
        </p>
      </div>

      <div className="mt-16">
        <RelatedInsights
          currentSlug="enrollment-trends-2026"
          relatedSlugs={["work-requirements-2026", "obbba-medicaid-cuts", "spending-by-state"]}
        />
      </div>
      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "How many people are on Medicaid in 2026?", a: "As of March 2026, Medicaid enrollment stands at approximately 74.3 million — down 21% from the pandemic peak of 94 million, following the end of continuous enrollment protections." },
            { q: "What caused the Medicaid enrollment drop?", a: "The post-pandemic 'unwinding' process required states to redetermine eligibility for all enrollees. Roughly 25 million people lost coverage — some because they no longer qualified, others due to paperwork issues." },
            { q: "Will Medicaid enrollment keep declining?", a: "Proposed work requirements affecting 44 states could push enrollment down further. CMS projects an additional 7-10 million could lose coverage if work requirements are fully implemented by 2027." },
          ].map((faq, i) => (
            <div key={i} className="border-b border-dark-500/30 pb-4">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      <FAQSchema faqs={[
        { question: "How many people are on Medicaid in 2026?", answer: "As of March 2026, Medicaid enrollment stands at approximately 74.3 million — down 21% from the pandemic peak of 94 million, following the end of continuous enrollment protections." },
        { question: "What caused the Medicaid enrollment drop?", answer: "The post-pandemic 'unwinding' process required states to redetermine eligibility for all enrollees. Roughly 25 million people lost coverage — some because they no longer qualified, others due to paperwork issues." },
        { question: "Will Medicaid enrollment keep declining?", answer: "Proposed work requirements affecting 44 states could push enrollment down further. CMS projects an additional 7-10 million could lose coverage if work requirements are fully implemented by 2027." },
      ]} />
    </article>
  );
}
