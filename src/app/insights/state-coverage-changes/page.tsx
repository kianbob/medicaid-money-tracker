import type { Metadata } from "next";
import Link from "next/link";
import FAQSchema from "@/components/FAQSchema";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "State-by-State Medicaid Coverage Changes 2024-2026: Who Gained, Who Lost, Why",
  description: "Comprehensive 50-state Medicaid enrollment tracker. From 94M peak to 74.3M current — which states lost the most, which held steady, and how work requirements, FMAP changes, and political dynamics are shaping coverage.",
  keywords: ["medicaid enrollment by state", "medicaid coverage changes 2026", "medicaid expansion states", "medicaid work requirements by state", "state medicaid spending", "medicaid FMAP rates"],
  openGraph: {
    title: "State-by-State Medicaid Coverage Changes 2024-2026",
    description: "From 94M to 74.3M enrolled. Which states lost the most, which held steady, and why.",
  },
};

export default function StateCoverageChanges() {
  const biggestDrops = [
    { state: "Texas", peak: "5.8M", current: "4.8M", change: "-17%", expansion: "No", note: "Aggressive redeterminations, minimal outreach, no expansion buffer" },
    { state: "Florida", peak: "5.1M", current: "3.9M", change: "-24%", expansion: "No", note: "Fastest unwinding timeline, non-expansion, high procedural rate" },
    { state: "Georgia", peak: "2.8M", current: "2.1M", change: "-25%", expansion: "Partial", note: "Limited expansion via waiver, narrow eligibility" },
    { state: "Tennessee", peak: "2.0M", current: "1.5M", change: "-25%", expansion: "No", note: "Block grant waiver, strictest redetermination standards" },
    { state: "Missouri", peak: "1.2M", current: "920K", change: "-23%", expansion: "Yes (2021)", note: "Recent expansion state, still building infrastructure" },
    { state: "Indiana", peak: "1.6M", current: "1.1M", change: "-31%", expansion: "Yes (waiver)", note: "Gateway to Work waiver, highest % decline nationally" },
  ];

  const holdingSteady = [
    { state: "New York", peak: "7.8M", current: "6.8M", change: "-13%", expansion: "Yes", note: "Strong outreach, automatic renewals, $150M renewal investment" },
    { state: "California", peak: "14.6M", current: "12.1M", change: "-17%", expansion: "Yes", note: "Largest program, invested $200M+ in renewal infrastructure" },
    { state: "Massachusetts", peak: "2.3M", current: "2.0M", change: "-13%", expansion: "Yes", note: "Best ex parte renewal rate nationally (82%), robust navigator program" },
    { state: "Minnesota", peak: "1.4M", current: "1.2M", change: "-14%", expansion: "Yes", note: "MinnesotaCare bridge coverage, strong community health worker network" },
    { state: "Connecticut", peak: "1.1M", current: "980K", change: "-11%", expansion: "Yes", note: "Smallest decline among large states, aggressive re-enrollment campaigns" },
  ];

  const spendingData = [
    { state: "New York", perCapita: "$14,000", total: "$95.2B", note: "Highest per-capita, driven by long-term care costs" },
    { state: "Connecticut", perCapita: "$12,800", total: "$12.5B", note: "High managed care rates, generous benefits" },
    { state: "Massachusetts", perCapita: "$12,200", total: "$24.4B", note: "Comprehensive benefits, high provider rates" },
    { state: "California", perCapita: "$8,400", total: "$101.7B", note: "Largest total spend, moderate per-capita" },
    { state: "Texas", perCapita: "$5,800", total: "$27.8B", note: "Low per-capita, non-expansion" },
    { state: "Florida", perCapita: "$5,200", total: "$20.3B", note: "Low per-capita, non-expansion, heavy managed care" },
    { state: "Mississippi", perCapita: "$4,000", total: "$3.2B", note: "Lowest per-capita nationally, non-expansion" },
  ];

  const waiverInnovations = [
    { state: "Arkansas", waiver: "ARHOME", description: "Premium assistance model using marketplace plans for expansion adults. Work requirements approved." },
    { state: "Georgia", waiver: "Pathways to Coverage", description: "Partial expansion to 100% FPL with work/community engagement requirements." },
    { state: "Indiana", waiver: "HIP 2.0 / Gateway to Work", description: "Health savings account model with work requirements. Lockout provisions for non-compliance." },
    { state: "Montana", waiver: "HELP Act Extension", description: "Expansion with community engagement, premium requirements above 50% FPL." },
    { state: "Ohio", waiver: "OhioRISE", description: "Specialized managed care for children with complex behavioral health needs." },
    { state: "Oregon", waiver: "1115 Demonstration", description: "Housing supports, nutrition services as covered Medicaid benefits. Continuous eligibility for children 0-6." },
  ];

  const faqs = [
    {
      question: "How many people are currently enrolled in Medicaid?",
      answer: "As of mid-2026, approximately 74.3 million people are enrolled in Medicaid and CHIP combined. This is down from the all-time peak of 94 million in March 2023 when COVID-era continuous enrollment ended, but still about 4% above the pre-pandemic baseline of 71 million in February 2020."
    },
    {
      question: "Which states lost the most Medicaid enrollment?",
      answer: "Indiana had the largest percentage decline at 31%, followed by Florida and Georgia (both around 25%), Tennessee (25%), Missouri (23%), and Texas (17%). Non-expansion states and states with aggressive redetermination timelines generally saw the steepest drops. Florida's 24% decline was notable given its large population — representing about 1.2 million people."
    },
    {
      question: "How do expansion states compare to non-expansion states?",
      answer: "Expansion states generally had smaller enrollment declines (13-17%) compared to non-expansion states (17-25%). Expansion states benefited from higher FMAP rates that incentivized retention efforts, more experience with eligibility systems, and broader eligible populations that provided a larger base. However, some expansion states like Indiana (31%) and Missouri (23%) saw large declines due to waiver complications or recent expansion with immature systems."
    },
    {
      question: "How will work requirements affect state enrollment?",
      answer: "Work requirements take effect January 2027 under the reconciliation law, with 44 states expected to implement them. CBO estimates 8-10 million expansion adults could face work reporting requirements. Based on Arkansas's 2018-2019 experience, where 18,000 lost coverage in 10 months (about 25% of the affected population), national implementation could result in millions of additional disenrollments. States with strong existing workforce programs and reporting infrastructure will likely see less disruption."
    },
    {
      question: "What is FMAP and why does it matter for state coverage?",
      answer: "FMAP (Federal Medical Assistance Percentage) is the share of Medicaid costs the federal government pays. It ranges from 50% (wealthier states like New York) to 77% (poorer states like Mississippi). The ACA set expansion population FMAP at 90%, but the reconciliation law reduces it to 80% by 2028. This reduction means states will pay a larger share of expansion costs, potentially leading some to restrict eligibility or benefits to manage budgets."
    },
    {
      question: "Why does per-capita Medicaid spending vary so much between states?",
      answer: "Per-capita spending ranges from about $4,000 in Mississippi to $14,000 in New York due to several factors: differences in provider reimbursement rates, scope of covered benefits (some states cover dental, vision, and long-term care more generously), cost of living variations, managed care vs fee-for-service mix, population health status, and the proportion of high-cost enrollees (elderly, disabled) vs lower-cost populations (healthy adults, children)."
    },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "State-by-State Medicaid Coverage Changes 2024-2026: Who Gained, Who Lost, Why",
          "description": "Comprehensive 50-state Medicaid enrollment tracker. From 94M peak to 74.3M — state-by-state breakdown.",
          "datePublished": "2026-07-11",
          "url": "https://www.openmedicaid.org/insights/state-coverage-changes",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/state-coverage-changes" }
        }) }}
      />
      <FAQSchema faqs={faqs} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">State Coverage Changes</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-400">State Tracker</span>
          <span className="text-xs text-slate-500">July 11, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">14 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          State-by-State Medicaid Coverage Changes 2024–2026: Who Gained, Who Lost, Why
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Medicaid enrollment peaked at <strong className="text-white">94 million</strong> in January 2023 and has
          since dropped to <strong className="text-white">74.3 million</strong> — a 21% decline that played out
          very differently across the 50 states. Expansion vs. non-expansion, red vs. blue, aggressive
          vs. cautious — here&apos;s the comprehensive state-by-state picture.
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
          <div className="text-3xl font-bold text-amber-400">44</div>
          <div className="text-xs text-slate-500 mt-1">States w/ Work Req (2027)</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">3.5x</div>
          <div className="text-xs text-slate-500 mt-1">Per-Capita Spending Range</div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The National Picture</h2>
        <p>
          The trajectory from peak to present tells a clear story: COVID inflated Medicaid rolls by 32%,
          and the unwinding brought them back down — but not evenly. Every state experienced enrollment
          declines, but the magnitude ranged from <strong className="text-white">11% (Connecticut)</strong> to
          <strong className="text-white">31% (Indiana)</strong>.
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Jan 2023</div>
              <p className="text-sm text-slate-300">Peak enrollment: <strong className="text-white">94 million</strong>. Three years of continuous enrollment created the highest rolls in Medicaid history.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-amber-400 w-28 shrink-0">Dec 2023</div>
              <p className="text-sm text-slate-300">Down to <strong className="text-white">85 million</strong>. First wave of unwinding disenrollments hit, mostly procedural.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-red-400 w-28 shrink-0">Dec 2024</div>
              <p className="text-sm text-slate-300">Down to <strong className="text-white">78 million</strong>. Most states completed initial redeterminations. Pace of decline slowing.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-sm font-mono text-blue-400 w-28 shrink-0">Jun 2026</div>
              <p className="text-sm text-slate-300">Current: <strong className="text-white">74.3 million</strong>. Enrollment stabilizing, but work requirements loom.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Expansion vs. Non-Expansion: The Divide</h2>
        <p>
          As of mid-2026, <strong className="text-white">40 states plus DC</strong> have expanded Medicaid under
          the ACA, covering adults up to 138% of the federal poverty level. The remaining 10 states
          have not expanded (though Georgia has a partial expansion waiver). This divide fundamentally
          shaped how the unwinding played out:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
            <h3 className="text-lg font-bold text-green-400 mb-3">Expansion States (40 + DC)</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              <li>Average enrollment decline: <strong className="text-white">16%</strong></li>
              <li>Higher FMAP (90%) incentivized retention efforts</li>
              <li>More ex parte renewal capacity</li>
              <li>Broader eligible population = larger base</li>
              <li>More experience with eligibility systems</li>
            </ul>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
            <h3 className="text-lg font-bold text-red-400 mb-3">Non-Expansion States (10)</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              <li>Average enrollment decline: <strong className="text-white">22%</strong></li>
              <li>Standard FMAP (50-77%) = less federal support</li>
              <li>Narrower eligibility = fewer people qualify</li>
              <li>Less investment in renewal infrastructure</li>
              <li>Higher procedural disenrollment rates</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">States With the Biggest Drops</h2>
        <p>
          Six states stand out for particularly steep enrollment declines:
        </p>
        <div className="space-y-3 my-6">
          {biggestDrops.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <span className="font-bold text-white sm:w-28">{s.state}</span>
                <span className="text-sm font-mono text-red-400 sm:w-16">{s.change}</span>
                <span className="text-sm text-slate-500 sm:w-32">{s.peak} → {s.current}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  s.expansion === "No" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                  s.expansion === "Yes" || s.expansion === "Yes (2021)" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                  "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>Expansion: {s.expansion}</span>
              </div>
              <p className="text-sm text-slate-400">{s.note}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">States Holding Steady</h2>
        <p>
          In contrast, several states managed to limit enrollment losses through aggressive outreach,
          automatic renewals, and investment in eligibility infrastructure:
        </p>
        <div className="space-y-3 my-6">
          {holdingSteady.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <span className="font-bold text-white sm:w-32">{s.state}</span>
                <span className="text-sm font-mono text-amber-400 sm:w-16">{s.change}</span>
                <span className="text-sm text-slate-500 sm:w-32">{s.peak} → {s.current}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Expansion: {s.expansion}</span>
              </div>
              <p className="text-sm text-slate-400">{s.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mt-4">
          <p className="text-sm text-amber-400 font-semibold mb-2">🤔 Is &quot;Holding Steady&quot; Always Good?</p>
          <p className="text-sm text-slate-300">
            Lower enrollment declines aren&apos;t automatically a sign of success. States that spent heavily
            to retain enrollees may have kept people on the rolls who no longer qualified — essentially using
            taxpayer money to delay inevitable disenrollments. Massachusetts&apos;s 82% ex parte renewal rate
            is impressive, but it also means 82% of renewals were approved without the enrollee lifting a finger.
            Whether that reflects efficient government or insufficient verification is a matter of perspective.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Work Requirements: The Next Wave</h2>
        <p>
          The reconciliation law signed in early 2026 requires work reporting for non-disabled, non-pregnant
          expansion adults ages 19-64 starting <strong className="text-white">January 2027</strong>. 44 states
          are expected to implement these requirements, with CBO projecting <strong className="text-white">8-10
          million</strong> expansion adults subject to work reporting.
        </p>
        <p>
          The precedent from Arkansas&apos;s 2018-2019 work requirements is instructive — and concerning.
          In just 10 months, 18,000 people (about 25% of the affected population) lost coverage, primarily
          for reporting failures rather than not meeting work requirements. If national implementation
          follows a similar pattern, millions could lose coverage.
        </p>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-6">
          <h3 className="text-lg font-bold text-white mb-3">Work Requirements Implementation Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-400 font-semibold mb-2">States Preparing Early</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                <li>Indiana — Existing Gateway to Work infrastructure</li>
                <li>Arkansas — Rebuilt system from 2018 experience</li>
                <li>Ohio — Integrating with workforce development</li>
                <li>Montana — HELP Act framework already in place</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-amber-400 font-semibold mb-2">States Facing Challenges</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                <li>California — 12.1M enrollees, massive scale</li>
                <li>New York — Political resistance, complex system</li>
                <li>Illinois — Legacy IT systems need overhaul</li>
                <li>Michigan — Rural areas lack reporting access</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">FMAP Changes and Fiscal Cliffs</h2>
        <p>
          The federal share of Medicaid expansion costs is scheduled to decline from <strong className="text-white">90%
          to 80%</strong> by 2028 under the reconciliation law. This 10-percentage-point shift means states
          will pay double their current share of expansion costs — from 10% to 20%. For large expansion
          states, this translates to billions in additional state spending.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-green-400">90%</div>
            <div className="text-xs text-slate-500 mt-1">Current Expansion FMAP</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-amber-400">85%</div>
            <div className="text-xs text-slate-500 mt-1">2027 Expansion FMAP</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-red-400">80%</div>
            <div className="text-xs text-slate-500 mt-1">2028 Expansion FMAP</div>
          </div>
        </div>
        <p>
          States most at risk from the FMAP reduction are those with large expansion populations and tight
          budgets. Ohio (1.8M expansion enrollees), Michigan (1.1M), and Pennsylvania (1.0M) face the
          biggest fiscal exposure. Some analysts predict 3-5 states could roll back expansion entirely
          if the math doesn&apos;t work.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Per-Capita Spending: A 3.5x Gap</h2>
        <p>
          Medicaid spending per enrollee varies enormously — from about <strong className="text-white">$4,000
          in Mississippi</strong> to <strong className="text-white">$14,000 in New York</strong>. This 3.5x
          gap reflects fundamentally different programs operating under the same federal framework.
        </p>
        <div className="space-y-3 my-6">
          {spendingData.map((s) => (
            <div key={s.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-bold text-white sm:w-32">{s.state}</span>
              <span className="text-sm font-mono text-blue-400 sm:w-28">{s.perCapita}/person</span>
              <span className="text-sm font-mono text-slate-500 sm:w-24">{s.total} total</span>
              <p className="text-sm text-slate-400 flex-1">{s.note}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Section 1115 Waiver Innovations</h2>
        <p>
          Several states are using Section 1115 waivers to reshape their Medicaid programs in ways that
          go well beyond traditional coverage. These experimental models are worth watching as the
          program evolves:
        </p>
        <div className="space-y-3 my-6">
          {waiverInnovations.map((w) => (
            <div key={w.state} className="bg-dark-800 border border-dark-600 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-white">{w.state}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">{w.waiver}</span>
              </div>
              <p className="text-sm text-slate-400">{w.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Political Dynamics: Red vs. Blue</h2>
        <p>
          The Medicaid landscape increasingly mirrors the partisan divide:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
            <h3 className="text-lg font-bold text-red-400 mb-3">Red State Trends</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              <li>10 states still haven&apos;t expanded Medicaid</li>
              <li>Embracing work requirements enthusiastically</li>
              <li>Pursuing Section 1115 waivers with conservative features (premiums, lockouts, HSAs)</li>
              <li>Lower per-capita spending, narrower benefits</li>
              <li>Faster unwinding timelines, higher disenrollment rates</li>
            </ul>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
            <h3 className="text-lg font-bold text-blue-400 mb-3">Blue State Trends</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              <li>All expanded Medicaid, some covering above 138% FPL</li>
              <li>Resisting work requirements (legal challenges expected)</li>
              <li>Using waivers for social determinants (housing, nutrition)</li>
              <li>Higher per-capita spending, broader benefits</li>
              <li>Investing in retention infrastructure, slower unwinding</li>
            </ul>
          </div>
        </div>
        <p>
          The irony: red states with the narrowest Medicaid programs often have the highest rates of
          uninsured residents. Texas (17.3% uninsured), Georgia (13.4%), and Florida (12.8%) lead the
          nation. Whether this reflects principled limited government or a coverage gap that harms
          working families depends on your political prism.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What to Watch: 2026-2027</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Work requirements launch (Jan 2027)</strong> — The biggest enrollment disruptor since the unwinding. Implementation quality will vary wildly.</li>
          <li><strong className="text-white">FMAP reduction to 85% (2027)</strong> — First step down. Watch for states signaling expansion rollback.</li>
          <li><strong className="text-white">Immigrant eligibility changes (Oct 2026)</strong> — Certain immigrant populations lose Medicaid access. Could affect 1-2 million enrollees.</li>
          <li><strong className="text-white">Six-month redeterminations</strong> — States must verify eligibility twice yearly. Will catch changes faster but increase administrative burden.</li>
          <li><strong className="text-white">Legal challenges</strong> — Multiple states expected to challenge work requirements. Courts could block or delay implementation.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Bottom Line</h2>
        <p>
          Medicaid is increasingly 50 different programs rather than one national safety net. The gap
          between a New York enrollee receiving $14,000 in annual per-capita benefits with comprehensive
          coverage and a Mississippi enrollee receiving $4,000 with bare-bones benefits grows wider
          each year.
        </p>
        <p>
          The post-unwinding stabilization at 74.3 million is temporary. Work requirements, FMAP
          reductions, and six-month redeterminations will push enrollment lower — potentially below
          the pre-pandemic 71 million baseline by late 2027. Whether that represents appropriate
          program right-sizing or a coverage crisis depends on how well states implement the new
          rules and whether the people leaving Medicaid are landing in other coverage or joining
          the uninsured.
        </p>
        <p>
          The data suggests it will be both — some states will manage the transition well, others
          won&apos;t. The 50-state experiment continues.
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
          currentSlug="state-coverage-changes"
          relatedSlugs={["enrollment-trends-2026", "spending-by-state", "work-requirements-2026"]}
        />
      </div>
    </article>
  );
}
