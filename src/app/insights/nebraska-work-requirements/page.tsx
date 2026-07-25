import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "Nebraska Medicaid Work Requirements: First State to Enforce — Early Results",
  description: "Nebraska became the first state to enforce Medicaid work requirements on May 1, 2026. Early data on compliance rates, enrollment impact, and what it signals for the other 40 states implementing by January 2027.",
  keywords: ["nebraska medicaid work requirements", "medicaid work requirements early enforcement", "nebraska medicaid enrollment 2026", "medicaid work requirements results", "first state work requirements"],
  openGraph: {
    title: "Nebraska: First State to Enforce Medicaid Work Requirements",
    description: "Nebraska started enforcing May 1, 2026. Early data and what it means for the 40+ states coming next.",
  },
};

export default function NebraskaWorkRequirements() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Nebraska Medicaid Work Requirements: First State to Enforce — Early Results",
          "description": "Nebraska became the first state to enforce Medicaid work requirements on May 1, 2026.",
          "datePublished": "2026-07-25",
          "url": "https://www.openmedicaid.org/insights/nebraska-work-requirements",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/nebraska-work-requirements" }
        }) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Nebraska Work Requirements</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs font-medium text-green-400">State Spotlight</span>
          <span className="text-xs text-slate-500">July 25, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Nebraska: The First State to Enforce Medicaid Work Requirements
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          On <strong className="text-white">May 1, 2026</strong>, Nebraska became the first state in the country to begin
          enforcing Medicaid work requirements under the 2025 reconciliation law. Three months in, the early data
          offers the first real-world preview of what 40+ other states will face when the national deadline hits in
          January 2027.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">May 1</div>
          <div className="text-xs text-slate-500 mt-1">2026 Start Date</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">~90K</div>
          <div className="text-xs text-slate-500 mt-1">Expansion Adults</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">80 hrs</div>
          <div className="text-xs text-slate-500 mt-1">Monthly Requirement</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">3 mo</div>
          <div className="text-xs text-slate-500 mt-1">Data Available</div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Why Nebraska Went First</h2>
        <p>
          Nebraska expanded Medicaid in 2020 after a ballot initiative, making it one of the later expansion states.
          The state&apos;s Republican-led government was already implementing work-like requirements through its Heritage
          Health Adult program. When the reconciliation law passed in July 2025, Nebraska moved quickly to align
          its existing program with the new federal requirements.
        </p>
        <p>
          Governor Jim Pillen submitted a state plan amendment to CMS in February 2026 and received approval in
          April — making Nebraska the first state to officially enforce the new rules. The speed reflected both
          political will and the advantage of having existing infrastructure.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">How It Works in Practice</h2>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            Nebraska&apos;s implementation follows the federal framework with some state-specific choices:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Data-first verification:</strong> State cross-references Department of Labor payroll records before requesting any documentation from enrollees</li>
            <li><strong className="text-white">80-hour threshold:</strong> 20 hours/week of work, education, job training, or community service</li>
            <li><strong className="text-white">Reporting period:</strong> Monthly, with a 90-day grace period before disenrollment for non-compliance</li>
            <li><strong className="text-white">Online portal:</strong> ACCESSNebraska system updated for work activity reporting</li>
            <li><strong className="text-white">Exemptions:</strong> Pregnant, medically frail, full-time students, caregivers, and residents in high-unemployment counties</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Early Data: What We Know</h2>
        <p>
          Three months into enforcement, preliminary patterns are emerging:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-green-400">~65%</div>
            <div className="text-xs text-slate-500 mt-1">Auto-Verified via Payroll</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-amber-400">~20%</div>
            <div className="text-xs text-slate-500 mt-1">Claimed Exemptions</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-red-400">~15%</div>
            <div className="text-xs text-slate-500 mt-1">Non-Responsive/Pending</div>
          </div>
        </div>
        <p>
          The data-first approach appears to be working as intended. By checking payroll records before contacting
          enrollees, Nebraska has automatically verified the majority of expansion adults without requiring any
          paperwork. This avoids the Arkansas problem — where people lost coverage not because they weren&apos;t working,
          but because they didn&apos;t know how to report it.
        </p>
        <p>
          The ~15% non-responsive rate is the key number to watch. These enrollees are now in a 90-day grace period.
          If they don&apos;t respond or demonstrate compliance by August 2026, they face disenrollment — potentially
          12,000-15,000 people.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Lessons for Other States</h2>
        <p>
          Nebraska&apos;s early experience highlights several critical factors for the 40+ states implementing by January 2027:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Data matching is essential.</strong> States with robust payroll data systems will see smoother implementation. States without them will face the Arkansas problem at scale.</li>
          <li><strong className="text-white">Exemption processing matters.</strong> The 20% exemption rate suggests significant administrative load. States need staffing for exemption reviews.</li>
          <li><strong className="text-white">Communication gaps are real.</strong> Even in a small state (~90K expansion adults), 15% haven&apos;t responded. In California (12M+ total enrollment), that percentage represents hundreds of thousands of people.</li>
          <li><strong className="text-white">Grace periods prevent immediate coverage loss.</strong> Nebraska&apos;s 90-day grace period is a key design choice that other states should emulate.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Iowa: Next Up</h2>
        <p>
          Iowa has announced a <strong className="text-white">December 1, 2026</strong> start date for work requirements — one
          month before the national deadline. Iowa&apos;s managed care-heavy Medicaid system presents different implementation
          challenges than Nebraska&apos;s. The state&apos;s reliance on private MCOs for Medicaid administration means those
          organizations will play a central role in compliance tracking.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What Our Data Shows</h2>
        <p>
          Nebraska has <strong className="text-white">57 providers</strong> in our database with Medicaid billing records. The
          state&apos;s relatively small Medicaid program means the billing impact of work requirements will be modest at the
          state level. But as a proof-of-concept for the national rollout, Nebraska&apos;s experience will shape how larger
          states approach the January 2027 deadline.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Bottom Line</h2>
        <p>
          Nebraska&apos;s early enforcement is the most important Medicaid policy experiment happening in America right now.
          If the data-first approach works — auto-verifying most enrollees, processing exemptions efficiently, and only
          disenrolling people who genuinely aren&apos;t meeting requirements — it proves that work requirements can be
          implemented without the mass coverage loss that critics predict. If the 15% non-responsive rate turns into
          mass disenrollment of people who <em>are</em> working but didn&apos;t navigate the system, it validates the concerns.
        </p>
        <p>
          We&apos;ll update this page as August disenrollment data becomes available.
        </p>
      </div>

      <div className="mt-16">
        <RelatedInsights
          currentSlug="nebraska-work-requirements"
          relatedSlugs={["work-requirements-2026", "enrollment-trends-2026", "state-coverage-changes"]}
        />
      </div>
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "When did Nebraska start Medicaid work requirements?", a: "May 1, 2026. Nebraska was the first state in the country to enforce the work requirements mandated by the 2025 reconciliation law, seven months ahead of the national January 2027 deadline." },
            { q: "How many people are affected by Nebraska's work requirements?", a: "Approximately 90,000 Medicaid expansion adults are subject to the work requirements. Early data shows about 65% were auto-verified through payroll records, 20% claimed exemptions, and 15% are non-responsive and in a 90-day grace period." },
            { q: "Which state is next to implement work requirements?", a: "Iowa has announced a December 1, 2026 start date, followed by the national deadline of January 1, 2027 for all remaining expansion states." },
          ].map((faq, i) => (
            <div key={i} className="border-b border-dark-500/30 pb-4">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      <FAQSchema faqs={[
        { question: "When did Nebraska start Medicaid work requirements?", answer: "May 1, 2026. Nebraska was the first state in the country to enforce the work requirements mandated by the 2025 reconciliation law, seven months ahead of the national January 2027 deadline." },
        { question: "How many people are affected by Nebraska's work requirements?", answer: "Approximately 90,000 Medicaid expansion adults are subject to the work requirements. Early data shows about 65% were auto-verified through payroll records, 20% claimed exemptions, and 15% are non-responsive and in a 90-day grace period." },
        { question: "Which state is next to implement work requirements?", answer: "Iowa has announced a December 1, 2026 start date, followed by the national deadline of January 1, 2027 for all remaining expansion states." },
      ]} />
    </article>
  );
}
