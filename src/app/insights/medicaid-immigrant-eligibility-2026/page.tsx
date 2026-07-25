import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "Medicaid Immigrant Eligibility Changes October 2026: Who Loses Coverage",
  description: "Starting October 1, 2026, new federal rules restrict Medicaid eligibility for certain immigrant populations. Here's which groups are affected, what states are doing, and the enrollment impact.",
  keywords: ["medicaid immigrant eligibility 2026", "medicaid eligibility changes 2026", "medicaid immigrants october 2026", "reconciliation law medicaid immigrants", "medicaid coverage immigrants"],
  openGraph: {
    title: "Medicaid Immigrant Eligibility Changes October 2026",
    description: "New federal rules restrict Medicaid for certain immigrant populations starting October 2026. Who's affected and what it means.",
  },
};

export default function MedicaidImmigrantEligibility2026() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Medicaid Immigrant Eligibility Changes October 2026: Who Loses Coverage",
          "description": "Starting October 1, 2026, new federal rules restrict Medicaid eligibility for certain immigrant populations.",
          "datePublished": "2026-07-25",
          "url": "https://www.openmedicaid.org/insights/medicaid-immigrant-eligibility-2026",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/medicaid-immigrant-eligibility-2026" }
        }) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Immigrant Eligibility Changes 2026</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-400">Policy &amp; Accountability</span>
          <span className="text-xs text-slate-500">July 25, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">6 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Medicaid Immigrant Eligibility Changes: What Happens October 2026
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          The 2025 reconciliation law restricts Medicaid eligibility for certain immigrant populations starting{" "}
          <strong className="text-white">October 1, 2026</strong>. Combined with work requirements taking effect in
          January 2027, these changes represent the most significant tightening of Medicaid eligibility since the
          program&apos;s creation. Here&apos;s who&apos;s affected, what states are doing, and the data behind the enrollment impact.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">Oct 1</div>
          <div className="text-xs text-slate-500 mt-1">2026 Effective Date</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">~4M</div>
          <div className="text-xs text-slate-500 mt-1">Potentially Affected</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">5-Year</div>
          <div className="text-xs text-slate-500 mt-1">New Waiting Period</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">68 days</div>
          <div className="text-xs text-slate-500 mt-1">Until Implementation</div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What&apos;s Changing</h2>
        <p>
          Under current law, states have the <em>option</em> to provide Medicaid coverage to lawfully residing immigrants
          during their first five years in the United States. Many states — particularly those with large immigrant
          populations like California, New York, Texas, and Florida — have exercised this option.
        </p>
        <p>
          The reconciliation law eliminates this state option for most populations, imposing a{" "}
          <strong className="text-white">mandatory five-year waiting period</strong> before lawfully present immigrants
          can access Medicaid. This aligns Medicaid with the existing five-year bar for most other federal means-tested
          programs.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Who&apos;s Affected</h2>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <p className="text-sm font-semibold text-white mb-3">Populations losing coverage:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>Lawfully present immigrants within their first 5 years of residency who currently have state-option Medicaid coverage</li>
            <li>Certain immigrants covered under state-funded programs that rely on federal Medicaid matching funds</li>
            <li>DACA recipients in states that extended coverage</li>
          </ul>
          <p className="text-sm font-semibold text-white mt-4 mb-3">Populations protected:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>U.S. citizens (including naturalized citizens)</li>
            <li>Lawful permanent residents who have resided in the U.S. for 5+ years</li>
            <li>Refugees and asylees (exempt from waiting period)</li>
            <li>Pregnant women (emergency Medicaid preserved regardless of status)</li>
            <li>Children under CHIP (separate program, different rules)</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">States Most Affected</h2>
        <p>
          The impact varies dramatically by state, depending on whether they exercised the option to cover immigrants
          during the five-year waiting period:
        </p>
        <div className="space-y-3 my-6">
          {[
            { state: "California", enrolled: "~1.4M", pctMedicaid: "12%", note: "Largest immigrant Medicaid population nationally. State may backfill with state-only funds." },
            { state: "New York", enrolled: "~680K", pctMedicaid: "10%", note: "Extensive state-option coverage. Considering state-funded bridge programs." },
            { state: "Illinois", enrolled: "~340K", pctMedicaid: "11%", note: "Expanded immigrant coverage significantly under current governor." },
            { state: "Washington", enrolled: "~210K", pctMedicaid: "11%", note: "State Apple Health covers many immigrants. May create state-only program." },
            { state: "New Jersey", enrolled: "~180K", pctMedicaid: "9%", note: "Expanded coverage to undocumented adults in 2024 — separate from this change." },
            { state: "Massachusetts", enrolled: "~150K", pctMedicaid: "7%", note: "Longstanding immigrant coverage programs." },
          ].map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-3 sm:w-40">
                <span className="font-bold text-white">{s.state}</span>
                <span className="text-sm font-mono text-red-400">{s.enrolled}</span>
              </div>
              <span className="text-xs text-slate-500 sm:w-20">{s.pctMedicaid} of rolls</span>
              <p className="text-sm text-slate-400 flex-1">{s.note}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Fiscal Case</h2>
        <p>
          Supporters argue the change is straightforward fiscal responsibility. Medicaid is a{" "}
          <strong className="text-white">$900+ billion per year</strong> program already strained by improper payments,
          enrollment growth, and rising per-capita costs. Extending coverage to individuals during their first five
          years of legal residency was always a <em>state option</em> — not a federal requirement. Making the five-year
          waiting period mandatory aligns Medicaid with SNAP, SSI, and TANF, all of which already have similar bars.
        </p>
        <p>
          CBO estimates this provision saves approximately <strong className="text-white">$30 billion</strong> over
          10 years — a meaningful but relatively modest share of the law&apos;s total $880 billion in Medicaid savings.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What States Can Do</h2>
        <p>
          States retain the ability to fund coverage for immigrant populations using <em>state-only</em> funds — no
          federal Medicaid matching. Several states have already signaled they may create bridge programs:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">California</strong> — Governor Newsom has proposed a state-funded coverage program for affected immigrants, though budget constraints are a concern</li>
          <li><strong className="text-white">New York</strong> — Legislature exploring a state-only Medicaid supplement</li>
          <li><strong className="text-white">Illinois</strong> — Existing Health Benefits for Immigrants program may expand</li>
          <li><strong className="text-white">Washington</strong> — Evaluating Apple Health bridge coverage using state funds</li>
        </ul>
        <p className="text-sm text-slate-500 mt-2">
          Without federal matching, these programs are significantly more expensive for states to maintain — roughly
          doubling the per-enrollee cost to state budgets.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Impact on Provider Billing</h2>
        <p>
          Providers serving communities with large immigrant populations will see patient volume shifts starting
          October 2026. Our data shows that providers in border states and major metro areas — particularly
          those billing under community health centers, FQHCs, and primary care specialties — are most exposed.
        </p>
        <p>
          For providers in our database with high billing volumes concentrated in high-immigration areas, this
          creates a natural enrollment correction that may amplify the statistical anomalies we&apos;re already flagging.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Combined Effect: The Fall 2026 Cliff</h2>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mt-4">
          <p className="text-sm text-amber-400 font-semibold mb-2">📉 Multiple Changes Converging</p>
          <p className="text-sm text-slate-300">
            October 2026 through January 2027 represents the most compressed period of Medicaid eligibility changes
            in the program&apos;s history. Immigrant restrictions (Oct 2026), Iowa&apos;s early work requirements (Dec 2026),
            and the national work requirements deadline (Jan 2027) all hit within a four-month window. Combined
            enrollment impact could exceed <strong className="text-white">8-12 million</strong> people over the following year.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Bottom Line</h2>
        <p>
          The immigrant eligibility changes are one piece of a larger Medicaid restructuring that prioritizes fiscal
          accountability and aligns the program with other federal benefit programs. The policy question is straightforward
          — should taxpayer-funded health coverage be available to immigrants during their first five years, or should
          they meet the same waiting period required for other federal benefits? The law answers: same rules for everyone.
        </p>
        <p>
          States that want to maintain coverage can do so with their own money. The federal government is simply
          stopping the practice of matching those costs. We&apos;ll track enrollment data as October approaches.
        </p>
      </div>

      <div className="mt-16">
        <RelatedInsights
          currentSlug="medicaid-immigrant-eligibility-2026"
          relatedSlugs={["enrollment-trends-2026", "work-requirements-2026", "obbba-medicaid-cuts"]}
        />
      </div>
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "When do Medicaid immigrant eligibility changes take effect?", a: "October 1, 2026. The reconciliation law imposes a mandatory five-year waiting period for lawfully present immigrants to access Medicaid, eliminating the previous state option to waive this period." },
            { q: "Are refugees affected by the Medicaid immigrant changes?", a: "No. Refugees and asylees are exempt from the five-year waiting period and retain Medicaid eligibility. The changes primarily affect lawfully present immigrants within their first five years of residency." },
            { q: "Can states still cover immigrants on Medicaid?", a: "States can fund immigrant coverage using state-only dollars (no federal matching). Several states including California and New York are exploring state-funded bridge programs, though the cost is roughly double without federal match." },
          ].map((faq, i) => (
            <div key={i} className="border-b border-dark-500/30 pb-4">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      <FAQSchema faqs={[
        { question: "When do Medicaid immigrant eligibility changes take effect?", answer: "October 1, 2026. The reconciliation law imposes a mandatory five-year waiting period for lawfully present immigrants to access Medicaid, eliminating the previous state option to waive this period." },
        { question: "Are refugees affected by the Medicaid immigrant changes?", answer: "No. Refugees and asylees are exempt from the five-year waiting period and retain Medicaid eligibility. The changes primarily affect lawfully present immigrants within their first five years of residency." },
        { question: "Can states still cover immigrants on Medicaid?", answer: "States can fund immigrant coverage using state-only dollars (no federal matching). Several states including California and New York are exploring state-funded bridge programs, though the cost is roughly double without federal match." },
      ]} />
    </article>
  );
}
