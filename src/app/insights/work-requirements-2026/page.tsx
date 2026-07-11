import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "Medicaid Work Requirements 2026: State-by-State Tracker",
  description: "44 states must implement Medicaid work requirements by January 2027. Track which states are moving early, who's exempt, and what 80 hours/month of work activity means for 20M+ enrollees.",
  keywords: ["medicaid work requirements 2026", "medicaid work requirements by state", "medicaid work requirements tracker", "one big beautiful bill work requirements", "medicaid eligibility 2027"],
  openGraph: {
    title: "Medicaid Work Requirements 2026: State-by-State Tracker",
    description: "44 states must implement Medicaid work requirements by January 2027. Here's where every state stands and what it means for enrollees.",
  },
};

export default function WorkRequirements2026() {
  const stateData = [
    { state: "Georgia", status: "Enforcing (early)", details: "Already implementing via 1115 waiver. Non-expansion state with limited eligibility.", color: "text-green-400" },
    { state: "Nebraska", status: "Enforcing (early)", details: "Moved early on work requirements enforcement through state plan amendment.", color: "text-green-400" },
    { state: "Montana", status: "Implementing soon", details: "Preparing for early enforcement via waiver authority.", color: "text-amber-400" },
    { state: "Arkansas", status: "Implementing soon", details: "Previously tried work requirements in 2018 (struck down). Now has federal mandate.", color: "text-amber-400" },
    { state: "Tennessee", status: "1115 waiver (subject)", details: "Non-expansion state with waiver populations subject to requirements.", color: "text-blue-400" },
    { state: "Wisconsin", status: "1115 waiver (subject)", details: "Non-expansion state with waiver program enrollees affected.", color: "text-blue-400" },
    { state: "New York", status: "1115 waiver (subject)", details: "Expansion state — both expansion adults and waiver populations affected.", color: "text-blue-400" },
    { state: "Massachusetts", status: "1115 waiver (subject)", details: "Expansion state with waiver populations identified by CMS.", color: "text-blue-400" },
    { state: "Oregon", status: "1115 waiver (subject)", details: "Expansion state with waiver populations subject to requirements.", color: "text-blue-400" },
    { state: "Hawaii", status: "1115 waiver (subject)", details: "Expansion state with waiver populations identified.", color: "text-blue-400" },
    { state: "Utah", status: "1115 waiver (subject)", details: "Expansion state with waiver populations subject to requirements.", color: "text-blue-400" },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Medicaid Work Requirements 2026: State-by-State Tracker",
          "description": "44 states must implement Medicaid work requirements by January 2027. Track which states are moving early and what the requirements mean.",
          "datePublished": "2026-07-11",
          "url": "https://www.openmedicaid.org/insights/work-requirements-2026",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/work-requirements-2026" }
        }) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Work Requirements 2026</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-400">Policy &amp; Accountability</span>
          <span className="text-xs text-slate-500">July 11, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">9 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Medicaid Work Requirements 2026: Where Every State Stands
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          The 2025 reconciliation law — signed July 4, 2025 — requires <strong className="text-white">44 states</strong> to
          condition Medicaid eligibility on work activity by <strong className="text-white">January 1, 2027</strong>. Some states
          are already enforcing. Others are scrambling to build the systems. Here&apos;s the state-by-state picture — and why
          work requirements are long-overdue accountability for a program spending <strong className="text-white">$900+ billion per year</strong>.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">44</div>
          <div className="text-xs text-slate-500 mt-1">States Required</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">80 hrs</div>
          <div className="text-xs text-slate-500 mt-1">Monthly Minimum</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">Jan 2027</div>
          <div className="text-xs text-slate-500 mt-1">Enforcement Deadline</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">20M+</div>
          <div className="text-xs text-slate-500 mt-1">Enrollees Affected</div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What the Law Requires</h2>
        <p>
          The reconciliation law mandates that <strong className="text-white">Medicaid expansion adults</strong> (those eligible
          under the ACA at up to 138% of the federal poverty level — $21,597 for an individual) must demonstrate at least{" "}
          <strong className="text-white">80 hours per month</strong> of &ldquo;work activity&rdquo; to maintain coverage.
          Qualifying activities include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Employment</strong> — full-time, part-time, or self-employment</li>
          <li><strong className="text-white">Education</strong> — college, vocational training, GED programs</li>
          <li><strong className="text-white">Job training</strong> — apprenticeships, workforce development</li>
          <li><strong className="text-white">Community service</strong> — volunteer work at qualifying organizations</li>
          <li><strong className="text-white">Caregiving</strong> — caring for a dependent child or disabled family member</li>
        </ul>
        <p>
          States must use <strong className="text-white">payroll data and Medicaid encounter data</strong> to verify compliance
          before requesting documentation from enrollees. Self-attestation is allowed initially but will be restricted starting in 2027.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Who&apos;s Exempt</h2>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            The law carves out exemptions for populations where work requirements would be impractical or counterproductive:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>Pregnant women and postpartum mothers (up to 60 days)</li>
            <li>Individuals with disabilities or serious medical conditions</li>
            <li>Full-time students</li>
            <li>People in substance abuse or mental health treatment programs</li>
            <li>Primary caregivers for dependents</li>
            <li>Individuals in areas with unemployment rates above 10%</li>
          </ul>
          <p className="text-sm text-slate-400 mt-3">
            These exemptions are reasonable — the goal isn&apos;t to strip coverage from people who genuinely can&apos;t work. It&apos;s
            to ensure that <em>able-bodied adults</em> who can contribute are doing so as a condition of receiving taxpayer-funded
            health coverage.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">State-by-State Status</h2>
        <p>
          CMS released its list of affected states in June 2026. Here&apos;s where key states stand:
        </p>

        <div className="space-y-3">
          {stateData.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-3 sm:w-48">
                <span className="font-bold text-white">{s.state}</span>
                <span className={`text-xs font-medium ${s.color}`}>{s.status}</span>
              </div>
              <p className="text-sm text-slate-400 flex-1">{s.details}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-2">
          The remaining 33 expansion states are required to implement by January 2027. Most are in planning and system-build phases.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Case for Accountability</h2>
        <p>
          Work requirements are framed as cruel by critics, but the underlying logic is straightforward: Medicaid is
          a <strong className="text-white">$900+ billion per year</strong> program funded entirely by taxpayers. In FY2025, the
          program recorded <strong className="text-white">$37.4 billion in improper payments</strong> — a 6.12% error rate.
          Enrollment ballooned from 71 million pre-pandemic to 94 million during COVID&apos;s continuous enrollment mandate,
          and has only partially corrected to 74.3 million.
        </p>
        <p>
          The question isn&apos;t whether people deserve healthcare — it&apos;s whether an unchecked entitlement program with
          minimal verification serves anyone well. Work requirements introduce a basic reciprocity: the program helps
          you if you&apos;re making an effort. That&apos;s not radical — it&apos;s how SNAP, TANF, and housing assistance already work.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Risks</h2>
        <p>
          Honest analysis requires acknowledging the operational challenges. When Arkansas tried work requirements in
          2018 under an 1115 waiver, <strong className="text-white">18,000 people lost coverage</strong> in just five months — many
          because they didn&apos;t understand the reporting requirements, not because they weren&apos;t working. The program was
          struck down in court.
        </p>
        <p>
          This time, the federal mandate changes the legal landscape — but the administrative challenge remains.
          States need to build reporting systems, verify employment data against payroll records, process exemption
          applications, and do all of it by January 2027. That&apos;s a tight timeline for bureaucracies that took years
          to process <em>unwinding</em> redeterminations.
        </p>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mt-4">
          <p className="text-sm text-amber-400 font-semibold mb-2">⚠️ The Real Risk</p>
          <p className="text-sm text-slate-300">
            The biggest danger isn&apos;t the policy — it&apos;s the <em>implementation</em>. If states build clunky
            reporting portals, fail to auto-verify through payroll data, or don&apos;t adequately communicate exemptions,
            people who <em>do</em> qualify will lose coverage through paperwork failures. The law mandates data matching
            before requesting documentation — states must actually follow through.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What Our Data Shows</h2>
        <p>
          Our analysis of 227 million Medicaid billing records can&apos;t directly measure employment status of enrollees, but
          it illuminates the <em>provider side</em> of this equation. States with the highest fraud-risk flags — New York (159),
          California (87), Arizona (71) — are also states with large expansion populations that will be subject to
          work requirements. If work requirements reduce enrollment by even 10-15% among expansion adults,{" "}
          <strong className="text-white">billions in billing volume shifts</strong> — and providers billing at anomalous levels
          may face even greater scrutiny as their patient pools shrink.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Timeline</h2>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Jul 2025</div>
              <p className="text-sm text-slate-300">Reconciliation law signed. Work requirements mandated.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Jun 2026</div>
              <p className="text-sm text-slate-300">CMS releases list of states with 1115 waiver populations subject to requirements.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Oct 2026</div>
              <p className="text-sm text-slate-300">Immigrant eligibility restrictions take effect.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">Jan 2027</div>
              <p className="text-sm text-slate-300">Work requirements enforcement begins nationwide.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-slate-500 w-28 shrink-0">2027+</div>
              <p className="text-sm text-slate-300">Self-attestation restrictions take effect. Full data-matching required.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Bottom Line</h2>
        <p>
          Medicaid work requirements represent the most significant structural reform to the program since the ACA expansion.
          They&apos;re not a silver bullet for fraud or waste — but they introduce a basic principle of accountability that has
          been conspicuously absent from a trillion-dollar entitlement program. The question now is whether state
          bureaucracies can implement them competently, or whether paperwork failures will undermine a sound policy.
        </p>
        <p>
          We&apos;ll be tracking state-by-state implementation data as it becomes available. Bookmark this page for updates.
        </p>
      </div>

      <div className="mt-16">
        <RelatedInsights
          currentSlug="work-requirements-2026"
          relatedSlugs={["obbba-medicaid-cuts", "doge-medicaid", "enrollment-trends-2026"]}
        />
      </div>
    </article>
  );
}
