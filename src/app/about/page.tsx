import Link from "next/link";
import type { Metadata } from "next";
import { getFlagInfo } from "@/lib/format";

export const metadata: Metadata = {
  title: "About & Methodology \u2014 How We Detect Medicaid Fraud",
  description: "How we built the Medicaid Money Tracker: data sources, code-specific fraud detection, decile analysis, OIG cross-reference, Minnesota autism fraud context, and important caveats. Analyzing 227 million HHS records.",
  openGraph: {
    title: "About & Methodology \u2014 Medicaid Money Tracker",
    description: "How we analyzed 227M Medicaid billing records with code-specific fraud detection. OIG cross-referencing, transparent methodology, and important caveats.",
  },
};

export default function AboutPage() {
  const smartTests = [
    { id: 'code_specific_outlier', threshold: 'Billing >3\u00d7 the national median cost/claim for a specific HCPCS code', example: 'Provider bills $296/claim for G9005 when the national median is $47 (6.3\u00d7)' },
    { id: 'billing_swing', threshold: '>200% year-over-year change AND >$1M absolute change', example: 'Provider went from $34.6M to $107M in one year (209% increase)' },
    { id: 'massive_new_entrant', threshold: 'First appeared 2022+ and already billing >$5M total', example: 'Health home LLC appeared Sep 2022 and already billed $239M' },
    { id: 'rate_outlier_multi_code', threshold: 'Billing above p90 for 2+ procedure codes simultaneously', example: 'Above 90th percentile for both T2022 and G0506 simultaneously' },
  ];

  const legacyTests = [
    { id: 'outlier_spending', threshold: '3+ standard deviations above mean total spending', example: 'Residential care agency billing $15,000/day when median is $300/day' },
    { id: 'unusual_cost_per_claim', threshold: '3x+ the median cost per claim for same procedure', example: 'Chicago EMS at $1,611/ambulance trip vs. $163 median nationally' },
    { id: 'beneficiary_stuffing', threshold: 'Claims-per-beneficiary ratio far above peers', example: 'Home health agency filing 26 claims/patient when peers average 4' },
    { id: 'spending_spike', threshold: 'Month-over-month increase of 500%+', example: '$50K/month to $34.6M/month overnight (692x increase)' },
    { id: 'explosive_growth', threshold: '>500% year-over-year growth', example: 'Provider growing from $370K to $19.2M in one year (5,106%)' },
    { id: 'instant_high_volume', threshold: 'New provider billing >$1M in first year', example: 'New provider billing $63M in their first year' },
    { id: 'procedure_concentration', threshold: 'Only 1-2 codes billed at high volume', example: 'Provider billing $1B almost entirely for a single code' },
    { id: 'billing_consistency', threshold: 'Coefficient of variation < 0.1 across months', example: 'Monthly billing almost identical for 78 consecutive months' },
    { id: 'extreme_beneficiary_stuffing', threshold: '>100 claims per beneficiary', example: '235 claims per patient \u2014 impossible in normal practice' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">About &amp; Methodology</span>
      </nav>

      <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">About This Project</h1>
      <p className="text-base text-slate-400 mb-12 leading-relaxed">
        How we analyzed 227 million Medicaid billing records &mdash; and what we found.
      </p>

      <div className="space-y-14">
        {/* The Story */}
        <section aria-labelledby="story-heading">
          <h2 id="story-heading" className="text-xl font-bold text-white mb-4">The Story Behind the Data</h2>
          <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">February 13, 2026</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              The HHS DOGE team open-sourced what they called <strong className="text-white">&ldquo;the largest Medicaid dataset
              in department history&rdquo;</strong> &mdash; aggregated, provider-level claims data covering every billing
              code from 2018 through 2024. The announcement received over <strong className="text-white">50 million views</strong>.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mt-3">
              DOGE specifically noted the data could detect the
              <strong className="text-white"> large-scale autism diagnosis fraud in Minnesota</strong> &mdash; a scheme where
              providers billed for autism therapy never delivered, resulting in $100M+ in fraudulent claims.
            </p>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            We built Medicaid Money Tracker to make this data permanently accessible &mdash; not as a one-time blog post,
            but as a searchable resource where journalists, researchers, policymakers, and citizens can explore how
            $1.09 trillion was distributed.
          </p>
        </section>

        {/* Data Source */}
        <section aria-labelledby="data-heading">
          <h2 id="data-heading" className="text-xl font-bold text-white mb-4">Data Source</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            All data comes from the{" "}
            <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" className="text-blue-400 hover:underline font-medium">
              HHS Open Data Platform
            </a>{" "}&mdash; Medicaid Provider Spending dataset.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {[
              { label: "Records", value: "227M" },
              { label: "Total Payments", value: "$1.09T" },
              { label: "Providers", value: "617,503" },
              { label: "Procedure Codes", value: "10,881" },
              { label: "Codes Benchmarked", value: "9,578" },
              { label: "Date Range", value: "2018\u20132024" },
            ].map((item) => (
              <div key={item.label} className="bg-dark-800 border border-dark-500/50 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{item.label}</p>
                <p className="text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Smart Fraud Tests */}
        <section aria-labelledby="smart-methodology-heading">
          <h2 id="smart-methodology-heading" className="text-xl font-bold text-white mb-2">Code-Specific Fraud Detection (Primary)</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Our primary analysis uses <strong className="text-white">code-specific benchmarks</strong> &mdash;
            comparing each provider&apos;s cost per claim against the national median for that exact procedure code.
            We compute decile distributions (p10&ndash;p99) for 9,578 HCPCS codes to identify providers billing
            significantly above their code-specific benchmarks.
          </p>
          <div className="space-y-3">
            {smartTests.map((test, i) => {
              const info = getFlagInfo(test.id);
              return (
                <div key={test.id} className={`border rounded-xl p-4 ${info.bgColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold ${info.color}`}>Smart Test {i + 1}</span>
                    <h3 className={`text-sm font-bold ${info.color}`}>{info.label}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-1.5">{info.description}</p>
                  <p className="text-[10px] text-slate-500"><strong className="text-slate-300">Threshold:</strong> {test.threshold}</p>
                  <p className="text-[10px] text-slate-500"><strong className="text-slate-300">Example:</strong> {test.example}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Legacy Fraud Tests */}
        <section aria-labelledby="legacy-methodology-heading">
          <h2 id="legacy-methodology-heading" className="text-xl font-bold text-white mb-2">Legacy Fraud Tests (Supplementary)</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            These 9 additional tests from our earlier analysis remain active. Providers flagged by these tests
            are included in the combined watchlist.
          </p>
          <div className="space-y-3">
            {legacyTests.map((test, i) => {
              const info = getFlagInfo(test.id);
              return (
                <div key={test.id} className={`border rounded-xl p-4 ${info.bgColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold ${info.color}`}>Test {i + 5}</span>
                    <h3 className={`text-sm font-bold ${info.color}`}>{info.label}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-1.5">{info.description}</p>
                  <p className="text-[10px] text-slate-500"><strong className="text-slate-300">Threshold:</strong> {test.threshold}</p>
                  <p className="text-[10px] text-slate-500"><strong className="text-slate-300">Example:</strong> {test.example}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* OIG */}
        <section aria-labelledby="oig-heading">
          <h2 id="oig-heading" className="text-xl font-bold text-white mb-4">OIG Exclusion List Cross-Reference</h2>
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5">
            <p className="text-sm text-slate-300 leading-relaxed">
              We cross-referenced our flagged providers against the HHS OIG&apos;s
              <strong className="text-white"> LEIE</strong> &mdash; 82,715 excluded providers.
            </p>
            <div className="bg-dark-800/60 rounded-lg p-4 mt-3 border border-amber-500/10">
              <p className="text-amber-400 font-bold text-base mb-1">Result: Zero matches</p>
              <p className="text-xs text-slate-400">
                None of our flagged providers appear on the OIG exclusion list, suggesting
                our analysis surfaces <strong className="text-white">new suspicious activity</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Minnesota */}
        <section aria-labelledby="mn-heading">
          <h2 id="mn-heading" className="text-xl font-bold text-white mb-4">The Minnesota Autism Fraud Context</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            DOGE referenced their dataset&apos;s ability to detect <strong className="text-white">&ldquo;large-scale
            autism diagnosis fraud in Minnesota.&rdquo;</strong> This refers to providers billing for autism therapy
            (EIDBI services) that was never delivered &mdash; $100M+ in fraudulent claims, multiple federal indictments in 2023&ndash;2024.
          </p>
          <ul className="text-xs text-slate-400 mt-3 space-y-1 list-disc list-inside">
            <li>Sudden spike in autism therapy providers</li>
            <li>Unrealistic billing volumes using procedure codes H2019 and T1024</li>
            <li>Beneficiaries enrolled in multiple providers simultaneously</li>
            <li>Pattern matches our explosive growth and beneficiary stuffing tests</li>
          </ul>
        </section>

        {/* Caveats */}
        <section aria-labelledby="caveats-heading">
          <h2 id="caveats-heading" className="text-xl font-bold text-white mb-4">Important Caveats</h2>
          <div className="bg-amber-600/8 border border-amber-500/20 rounded-xl p-5">
            <ul className="text-sm text-slate-300 space-y-3">
              {[
                { title: "Statistical flags are not proof of fraud.", desc: "Our tests identify unusual patterns that may warrant investigation. Many flagged providers have legitimate reasons for unusual billing." },
                { title: "Government entities may legitimately bill high.", desc: "State agencies, county health departments, and cities often serve as fiscal agents for large populations. Their aggregate billing is high by design." },
                { title: "Home care management programs are special cases.", desc: "Organizations like Public Partnerships LLC and Consumer Direct manage billing on behalf of thousands of individual caregivers in self-directed care programs. High aggregate billing is inherent to their model, though self-directed care is a fraud-prone category." },
                { title: "Per diem codes should account for daily rates.", desc: "Codes like T2016 (residential habilitation) cover an entire day of care. High per-diem rates may reflect bundled services. Dividing by ~30 days brings some values closer to expected daily rates." },
                { title: "Specialty drugs have legitimately high costs.", desc: "J-codes for injectable drugs reflect actual drug prices, not provider markup." },
                { title: "This data is aggregated, not claims-level.", desc: "We see billing totals per provider per procedure per month \u2014 not individual claims." },
                { title: "Some anomalies reflect state-specific policies.", desc: "States set their own reimbursement rates, eligibility rules, and covered services." },
                { title: "We don't make medical judgments.", desc: "We cannot evaluate whether services were medically necessary, appropriately coded, or properly authorized." },
              ].map((caveat, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0 text-xs">{i + 1}.</span>
                  <div>
                    <strong className="text-amber-400 text-xs">{caveat.title}</strong>
                    <p className="text-xs text-slate-400 mt-0.5">{caveat.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: "Where does this data come from?",
                a: "All data comes from the HHS Open Data Platform \u2014 the Medicaid Provider Spending dataset. It contains aggregated, provider-level claims data covering every billing code from 2018 through 2024, totaling 227 million records. The data was released publicly by HHS on February 13, 2026.",
              },
              {
                q: "What does 'flagged' mean?",
                a: "A 'flagged' provider has been identified by one or more of our 13 statistical fraud detection tests or our ML fraud similarity model as having billing patterns that are unusual compared to peers. Statistical flags and ML scores are combined into a unified risk system with tiers: Critical, High, Elevated, and ML Flag. Being flagged is not proof of fraud \u2014 it means the billing patterns warrant further investigation.",
              },
              {
                q: "Is this proof of fraud?",
                a: "No. Statistical flags indicate unusual patterns, not proof of wrongdoing. Many flagged providers have legitimate reasons for their billing patterns \u2014 government agencies serve large populations, home care management programs bill on behalf of thousands of caregivers, and specialty drugs have inherently high costs. Our analysis surfaces patterns that may warrant investigation by qualified auditors.",
              },
              {
                q: "Why are hospitals and government entities flagged?",
                a: "Large institutions \u2014 hospitals, county health departments, state agencies \u2014 often bill at higher aggregate rates due to overhead costs, specialized services, and the large populations they serve. Our statistical tests flag unusual patterns regardless of entity type. Being flagged means the billing pattern is unusual, not that it is fraudulent. Government entities in particular often serve as fiscal agents for entire state programs.",
              },
              {
                q: "How accurate is the ML model?",
                a: "Our random forest ML model has an AUC of 0.7762, meaning it correctly ranks a randomly chosen fraud case above a randomly chosen legitimate provider 77.6% of the time. The model was trained on 514 providers confirmed by the OIG as fraudulent. While useful for identifying patterns similar to known fraud, it is one signal among many \u2014 not a definitive fraud detector.",
              },
              {
                q: "Can I download the data?",
                a: "Yes. The watchlist page includes a CSV export button that downloads all filtered results. For the raw underlying data, visit the HHS Open Data Platform (opendata.hhs.gov) where the original 227M-record Medicaid Provider Spending dataset is publicly available.",
              },
              {
                q: "How do I report suspected fraud?",
                a: "If you suspect Medicaid fraud, you can report it to the HHS Office of Inspector General (OIG) at 1-800-HHS-TIPS (1-800-447-8477) or online at oig.hhs.gov. You can also contact your state\u2019s Medicaid Fraud Control Unit (MFCU). Whistleblower protections exist under the False Claims Act for those who report fraud.",
              },
              {
                q: "How often is this updated?",
                a: "The underlying HHS data covers 2018\u20132024. We update our analysis when HHS releases new data. The current analysis was published in February 2026 based on the initial public data release.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  { "@type": "Question", "name": "Where does this data come from?", "acceptedAnswer": { "@type": "Answer", "text": "All data comes from the HHS Open Data Platform \u2014 the Medicaid Provider Spending dataset. It contains aggregated, provider-level claims data covering every billing code from 2018 through 2024, totaling 227 million records." } },
                  { "@type": "Question", "name": "What does 'flagged' mean?", "acceptedAnswer": { "@type": "Answer", "text": "A flagged provider has been identified by one or more of our 13 statistical fraud detection tests as having billing patterns that are unusual compared to peers. Being flagged is not proof of fraud." } },
                  { "@type": "Question", "name": "Is this proof of fraud?", "acceptedAnswer": { "@type": "Answer", "text": "No. Statistical flags indicate unusual patterns, not proof of wrongdoing. Our analysis surfaces patterns that may warrant investigation by qualified auditors." } },
                  { "@type": "Question", "name": "Why are hospitals and government entities flagged?", "acceptedAnswer": { "@type": "Answer", "text": "Large institutions often bill at higher aggregate rates due to overhead costs, specialized services, and large populations. Being flagged means the billing pattern is unusual, not that it is fraudulent." } },
                  { "@type": "Question", "name": "How accurate is the ML model?", "acceptedAnswer": { "@type": "Answer", "text": "Our random forest ML model has an AUC of 0.7762, meaning it correctly ranks a fraud case above a legitimate provider 77.6% of the time." } },
                  { "@type": "Question", "name": "Can I download the data?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The watchlist page includes a CSV export. Raw data is available from the HHS Open Data Platform." } },
                  { "@type": "Question", "name": "How do I report suspected fraud?", "acceptedAnswer": { "@type": "Answer", "text": "Report suspected Medicaid fraud to the HHS Office of Inspector General (OIG) at 1-800-HHS-TIPS or online at oig.hhs.gov." } },
                  { "@type": "Question", "name": "How often is this updated?", "acceptedAnswer": { "@type": "Answer", "text": "The underlying HHS data covers 2018\u20132024. We update our analysis when HHS releases new data." } },
                ],
              }),
            }}
          />
        </section>

        {/* Built By */}
        <section aria-labelledby="built-heading">
          <h2 id="built-heading" className="text-xl font-bold text-white mb-4">Built By</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Medicaid Money Tracker is a project of{" "}
            <a href="https://thedataproject.ai" className="text-blue-400 hover:underline font-medium">TheDataProject.ai</a>,
            building data-driven transparency tools from public records.
          </p>
          <p className="text-xs text-slate-400 mt-3">
            If you&apos;re a journalist, researcher, or policymaker interested in this data,{" "}
            <a href="https://thedataproject.ai" className="text-blue-400 hover:underline">get in touch</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
