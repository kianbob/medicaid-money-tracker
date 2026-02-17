import Link from "next/link";
import type { Metadata } from "next";
import { getFlagInfo } from "@/lib/format";

export const metadata: Metadata = {
  title: "About & Methodology \u2014 How We Detect Medicaid Fraud",
  description: "How we built the Medicaid Money Tracker: data sources, 9 fraud detection tests, OIG cross-reference, Minnesota autism fraud context, and important caveats. Analyzing 227 million HHS records.",
  openGraph: {
    title: "About & Methodology \u2014 Medicaid Money Tracker",
    description: "How we analyzed 227M Medicaid billing records with 9 fraud detection tests. OIG cross-referencing, transparent methodology, and important caveats.",
  },
};

export default function AboutPage() {
  const tests = [
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

      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">About This Project</h1>
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
              { label: "Date Range", value: "2018\u20132024" },
              { label: "Fraud Tests", value: "9" },
            ].map((item) => (
              <div key={item.label} className="bg-dark-800 border border-dark-500/50 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{item.label}</p>
                <p className="text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9 Fraud Tests */}
        <section aria-labelledby="methodology-heading">
          <h2 id="methodology-heading" className="text-xl font-bold text-white mb-4">9 Fraud Detection Tests</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            We apply <strong className="text-white">9 independent statistical tests</strong> to identify unusual billing patterns.
            Providers flagged by multiple tests receive higher risk ratings.
          </p>
          <div className="space-y-3">
            {tests.map((test, i) => {
              const info = getFlagInfo(test.id);
              return (
                <div key={test.id} className={`border rounded-xl p-4 ${info.bgColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold ${info.color}`}>Test {i + 1}</span>
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
                None of our 788 flagged providers appear on the OIG exclusion list, suggesting
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
                { title: "State agencies may legitimately have high spending.", desc: "Government entities often serve as billing pass-throughs. Their cost structures differ from private practices." },
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
