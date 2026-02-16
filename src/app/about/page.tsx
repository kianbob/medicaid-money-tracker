import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About & Methodology",
  description: "How we built the Medicaid Money Tracker: our data sources, fraud detection methodology, OIG cross-reference findings, and important caveats. Analyzing 227 million HHS records.",
  openGraph: {
    title: "About & Methodology — Medicaid Money Tracker",
    description: "How we analyzed 227 million Medicaid billing records to detect spending anomalies. Four statistical tests, OIG cross-referencing, and transparent methodology.",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">About &amp; Methodology</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">About This Project</h1>
      <p className="text-lg text-slate-400 mb-12 leading-relaxed">
        How we analyzed 227 million Medicaid billing records &mdash; and what we found.
      </p>

      <div className="space-y-12">
        {/* The Story */}
        <section aria-labelledby="story-heading">
          <h2 id="story-heading" className="text-2xl font-bold text-white mb-4">The Story Behind the Data</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-4">
            <p className="text-sm text-blue-400 font-semibold uppercase tracking-wider mb-2">February 13, 2026</p>
            <p className="text-slate-300 leading-relaxed">
              The HHS DOGE team open-sourced what they called <strong className="text-white">&ldquo;the largest Medicaid dataset
              in department history&rdquo;</strong> &mdash; aggregated, provider-level claims data covering every Medicaid billing
              code from 2018 through 2024. The announcement on X received over <strong className="text-white">50 million views</strong>.
            </p>
            <p className="text-slate-300 leading-relaxed mt-3">
              DOGE specifically noted the data could have been used to detect the
              <strong className="text-white"> large-scale autism diagnosis fraud in Minnesota</strong> &mdash; a scheme where
              providers billed for autism therapy (EIDBI services) that was never delivered, resulting in $100M+ in
              fraudulent claims and multiple federal indictments.
            </p>
          </div>
          <p className="text-slate-300 leading-relaxed">
            We built Medicaid Money Tracker to make this data accessible to everyone. Not as a one-time
            blog post, but as a permanent, searchable resource where journalists, researchers, policymakers,
            and citizens can explore how $1.09 trillion in Medicaid payments were distributed.
          </p>
        </section>

        {/* Data Source */}
        <section aria-labelledby="data-heading">
          <h2 id="data-heading" className="text-2xl font-bold text-white mb-4">Data Source</h2>
          <p className="text-slate-300 leading-relaxed">
            All data comes from the{" "}
            <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" className="text-blue-400 hover:underline font-medium">
              HHS Open Data Platform &mdash; Medicaid Provider Spending
            </a>{" "}
            dataset, published by the U.S. Department of Health and Human Services.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {[
              { label: "Records", value: "227M" },
              { label: "Total Payments", value: "$1.09T" },
              { label: "Providers", value: "617,503" },
              { label: "Procedure Codes", value: "10,881" },
              { label: "Date Range", value: "2018\u20132024" },
              { label: "Claim Types", value: "FFS + MC + CHIP" },
            ].map((item) => (
              <div key={item.label} className="bg-dark-700 border border-dark-500 rounded-lg p-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-4">
            The dataset contains provider-level Medicaid spending derived from T-MSIS claims data.
            It covers fee-for-service, managed care, and CHIP claims. Each record represents a
            provider&apos;s aggregated billing for a specific HCPCS procedure code in a given month.
          </p>
        </section>

        {/* Fraud Detection Methodology */}
        <section aria-labelledby="methodology-heading">
          <h2 id="methodology-heading" className="text-2xl font-bold text-white mb-4">Fraud Detection Methodology</h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            We apply four independent statistical tests to identify unusual billing patterns.
            Providers flagged by <strong className="text-white">multiple tests</strong> receive higher risk ratings,
            since multiple independent anomalies are harder to explain by legitimate factors alone.
          </p>
          <div className="space-y-4">
            <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-2 py-0.5 rounded border bg-red-500/20 text-red-400 border-red-500/30 text-xs font-bold">Test 1</span>
                <h3 className="text-white font-semibold text-lg">Spending Outliers</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                We identify providers whose total spending is more than <strong className="text-slate-200">3 standard deviations above the mean</strong> for
                their procedure codes. This threshold captures only the top fraction of a percent &mdash; providers whose overall billing volume
                is statistically extraordinary compared to peers.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Example: A residential care agency billing $15,000/day when the median is $300/day.
              </p>
            </div>

            <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-2 py-0.5 rounded border bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-bold">Test 2</span>
                <h3 className="text-white font-semibold text-lg">Unusual Cost Per Claim</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                For each HCPCS procedure code, we calculate the median cost per claim across all providers.
                We then flag providers charging <strong className="text-slate-200">3x or more the median</strong> for the same service.
                This can indicate upcoding (billing a higher-level service than provided) or inflated billing.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Example: Chicago EMS billing $1,611 per ambulance trip vs. $163 median nationally.
              </p>
            </div>

            <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-2 py-0.5 rounded border bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs font-bold">Test 3</span>
                <h3 className="text-white font-semibold text-lg">Beneficiary Stuffing</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                We compare the <strong className="text-slate-200">claims-per-beneficiary ratio</strong> for each provider against their peers
                billing the same procedure codes. Providers filing dramatically more claims per patient may be billing for
                services never actually provided.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Example: A home health agency filing 26 claims per patient when peers average 4.
              </p>
            </div>

            <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-2 py-0.5 rounded border bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs font-bold">Test 4</span>
                <h3 className="text-white font-semibold text-lg">Spending Spikes</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                We analyze each provider&apos;s monthly billing history for <strong className="text-slate-200">month-over-month increases of 500% or more</strong>.
                Sudden, dramatic surges in billing can signal the launch of new fraudulent billing schemes, reactivation of
                dormant shell entities, or other suspicious activity.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Example: A provider going from $50K/month to $34.6M/month overnight (692x increase).
              </p>
            </div>
          </div>
        </section>

        {/* OIG Cross-Reference */}
        <section aria-labelledby="oig-heading">
          <h2 id="oig-heading" className="text-2xl font-bold text-white mb-4">OIG Exclusion List Cross-Reference</h2>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
            <p className="text-slate-300 leading-relaxed">
              We cross-referenced our flagged providers against the HHS Office of Inspector General&apos;s
              <strong className="text-white"> List of Excluded Individuals and Entities (LEIE)</strong> &mdash; a database of
              <strong className="text-white"> 82,715 providers</strong> who have been excluded from federal healthcare programs
              for fraud, abuse, or other misconduct.
            </p>
            <div className="bg-dark-800/60 rounded-lg p-4 mt-4 border border-amber-500/10">
              <p className="text-amber-400 font-bold text-lg mb-1">Result: Zero matches</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                None of our 76 statistically flagged providers appear on the OIG exclusion list. This suggests our
                analysis may be <strong className="text-slate-200">surfacing new suspicious activity</strong> that has not yet been
                investigated or caught through existing oversight mechanisms.
              </p>
            </div>
            <p className="text-slate-500 text-xs mt-3">
              Source: HHS OIG LEIE database, downloaded February 2026. Cross-referenced by NPI number.
            </p>
          </div>
        </section>

        {/* Minnesota Context */}
        <section aria-labelledby="mn-heading">
          <h2 id="mn-heading" className="text-2xl font-bold text-white mb-4">The Minnesota Autism Fraud Context</h2>
          <p className="text-slate-300 leading-relaxed">
            The DOGE team specifically referenced their dataset&apos;s ability to detect <strong className="text-white">&ldquo;large-scale
            autism diagnosis fraud seen in Minnesota.&rdquo;</strong> This refers to a major federal investigation into
            providers who billed Medicaid for autism therapy services (EIDBI &mdash; Early Intensive Developmental and
            Behavioral Intervention) that were never delivered.
          </p>
          <ul className="text-slate-400 mt-3 space-y-2 text-sm list-disc list-inside">
            <li>Multiple Minnesota providers billed for autism therapy using procedure codes like H2019 and T1024</li>
            <li>Services were either never provided or grossly misrepresented</li>
            <li>Estimated $100M+ in fraudulent billing</li>
            <li>Multiple federal indictments were issued in 2023&ndash;2024</li>
            <li>Pattern: sudden spike in autism therapy providers, unrealistic billing volumes, beneficiaries enrolled in multiple providers simultaneously</li>
          </ul>
          <p className="text-slate-300 leading-relaxed mt-3">
            This is exactly the type of pattern our statistical tests are designed to surface &mdash; explosive growth rates,
            impossibly high claims-per-beneficiary ratios, and spending spikes that defy legitimate medical practice.
          </p>
        </section>

        {/* Caveats */}
        <section aria-labelledby="caveats-heading">
          <h2 id="caveats-heading" className="text-2xl font-bold text-white mb-4">Important Caveats</h2>
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-6">
            <ul className="text-slate-300 space-y-4">
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">1.</span>
                <div>
                  <strong className="text-amber-400">Statistical flags are not proof of fraud.</strong>
                  <p className="text-sm text-slate-400 mt-0.5">Our tests identify unusual patterns that <em>may</em> warrant investigation. Many flagged providers have legitimate reasons for unusual billing &mdash; including serving high-need populations, operating in high-cost areas, or acting as fiscal intermediaries.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">2.</span>
                <div>
                  <strong className="text-amber-400">State agencies may legitimately have high spending.</strong>
                  <p className="text-sm text-slate-400 mt-0.5">Government entities (state health departments, county agencies) often serve as billing pass-throughs or large-scale service providers. Their cost structures differ fundamentally from private practices.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">3.</span>
                <div>
                  <strong className="text-amber-400">This data is aggregated, not claims-level.</strong>
                  <p className="text-sm text-slate-400 mt-0.5">We see billing totals per provider per procedure per month &mdash; not individual claims. A full investigation would require claims-level detail, patient records, and context we don&apos;t have.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">4.</span>
                <div>
                  <strong className="text-amber-400">Some &ldquo;anomalies&rdquo; reflect state-specific Medicaid policies.</strong>
                  <p className="text-sm text-slate-400 mt-0.5">States set their own Medicaid reimbursement rates, eligibility rules, and covered services. What looks unusual nationally may be normal in a specific state&apos;s program.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">5.</span>
                <div>
                  <strong className="text-amber-400">We don&apos;t make medical judgments.</strong>
                  <p className="text-sm text-slate-400 mt-0.5">We cannot evaluate whether services were medically necessary, appropriately coded, or properly authorized. Our analysis is purely statistical.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Built By */}
        <section aria-labelledby="built-heading">
          <h2 id="built-heading" className="text-2xl font-bold text-white mb-4">Built By</h2>
          <p className="text-slate-300 leading-relaxed">
            Medicaid Money Tracker is a project of{" "}
            <a href="https://thedataproject.ai" className="text-blue-400 hover:underline font-medium">TheDataProject.ai</a>,
            which builds data-driven transparency tools from public records.
          </p>
          <p className="text-slate-400 text-sm mt-3">
            Our goal is to make public data genuinely accessible &mdash; not locked behind paywalls, obscured by
            jargon, or requiring technical expertise to explore. If you&apos;re a journalist, researcher, or
            policymaker interested in this data, <a href="https://thedataproject.ai" className="text-blue-400 hover:underline">get in touch</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
