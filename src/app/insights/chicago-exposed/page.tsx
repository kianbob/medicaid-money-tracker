import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "City of Chicago: $23M to $240M — A 942% Medicaid Billing Surge",
  description:
    "Deep dive into the City of Chicago's Medicaid billing (NPI 1376554592), which surged 942% from $23M to $240M. Three independent fraud detection flags triggered.",
  openGraph: {
    title: "City of Chicago: 942% Medicaid Billing Surge",
    description: "$23M to $240M. Three fraud flags. The full breakdown.",
  },
};

export default function ChicagoExposedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">City of Chicago Exposed</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 uppercase tracking-wider">Exposed</span>
          <span className="text-[10px] text-slate-500">February 18, 2026 · 6 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">
          City of Chicago: $23M to $240M &mdash; A 942% Billing Surge
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          How a major city&apos;s ambulance service went from routine billing to over a billion dollars in Medicaid payments.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">3</p>
          <p className="text-[10px] text-slate-500 mt-1">Fraud Flags</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">$1.23B</p>
          <p className="text-[10px] text-slate-500 mt-1">Total Billing</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">942%</p>
          <p className="text-[10px] text-slate-500 mt-1">Peak Growth</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">$1,611</p>
          <p className="text-[10px] text-slate-500 mt-1">Cost Per Claim</p>
        </div>
      </div>

      {/* The Story */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">The Timeline</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The City of Chicago bills Medicaid under NPI <Link href="/providers/1376554592" className="text-blue-400 hover:underline font-mono">1376554592</Link>, classified as an Ambulance provider. Their billing trajectory:
          </p>
          <div className="space-y-3">
            {[
              { year: "2018", amount: "$23.2M", note: "Baseline — routine ambulance billing", color: "text-slate-400" },
              { year: "2019", amount: "$18.7M", note: "-19% — slight decline", color: "text-slate-400" },
              { year: "2020", amount: "$96.2M", note: "+415% — COVID year surge begins", color: "text-amber-400" },
              { year: "2021", amount: "$240.1M", note: "+150% — peak billing year", color: "text-red-400" },
              { year: "2022", amount: "$236.4M", note: "Sustained at peak levels", color: "text-red-400" },
              { year: "2023", amount: "$227.8M", note: "Slight decline but still 10× pre-COVID", color: "text-amber-400" },
              { year: "2024", amount: "$186.8M", note: "Partial year — still tracking above $200M annualized", color: "text-amber-400" },
            ].map((row) => (
              <div key={row.year} className="flex items-baseline gap-4">
                <span className="text-sm font-bold text-white w-12">{row.year}</span>
                <span className="font-mono text-sm font-bold text-white w-24 text-right">{row.amount}</span>
                <span className={`text-xs ${row.color}`}>{row.note}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            Total lifetime billing: <span className="text-white font-bold">$1.23 billion</span> across 1.6 million claims. The billing never returned to pre-COVID levels.
          </p>
        </div>
      </section>

      {/* The Flags */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Three Red Flags</h2>
        <div className="space-y-3">
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-4">
            <h3 className="text-xs font-bold text-red-400 mb-1">Unusually High Spending</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Total Medicaid payments are more than 3 standard deviations above the mean for Ambulance providers. Most municipal ambulance services bill far less.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-4">
            <h3 className="text-xs font-bold text-red-400 mb-1">High Cost Per Claim</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Average cost of $1,611 per ambulance claim — compared to the national median of $163 for ambulance services. That&apos;s nearly 10× the typical rate.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-4">
            <h3 className="text-xs font-bold text-red-400 mb-1">Explosive Growth</h3>
            <p className="text-xs text-slate-400 leading-relaxed">942% year-over-year growth from 2019 to 2021 — far exceeding the 500% threshold. While COVID increased ambulance demand, this magnitude of increase is exceptional.</p>
          </div>
        </div>
      </section>

      {/* The Key Question */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">The $1,611 Question</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The most striking data point is the cost per claim. At <span className="text-white font-bold">$1,611 per ambulance trip</span>, Chicago bills nearly <span className="text-white font-bold">10× the national median</span> of $163.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            There are potential legitimate explanations: Chicago may bill for advanced life support (ALS) transports at higher rates, may include bundled services, or may have negotiated higher Medicaid reimbursement rates with the state of Illinois. Municipal providers sometimes have higher overhead costs.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            But the combination of 10× rates <em>and</em> a 942% volume increase <em>and</em> no return to baseline raises questions that deserve answers. The post-COVID billing level appears to represent a permanent shift, not a temporary spike.
          </p>
        </div>
      </section>

      {/* Context */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Important Context</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">Government entities are flagged by design.</strong> Our tests compare all providers against peers — including municipalities. The City of Chicago bills massive amounts to Medicaid for services. Whether that spending is efficient or bloated is exactly the kind of question taxpayers should be asking.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">These findings are statistical indicators, not accusations.</strong> The billing patterns are unusual compared to other ambulance providers nationally. Whether this reflects legitimate service delivery costs, policy changes, or billing practices that warrant investigation requires deeper auditing.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 rounded-xl p-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white mb-1">View the full provider profile</p>
            <p className="text-xs text-slate-400">See all billing data, yearly trends, peer comparisons, and advanced detection signals.</p>
          </div>
          <Link href="/providers/1376554592" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm shrink-0">
            City of Chicago Profile →
          </Link>
        </div>
      </div>

      {/* Share */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs text-slate-500">Share this investigation:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("The City of Chicago went from $23M to $240M in Medicaid billing — 942% growth. Average ambulance claim: $1,611 vs $163 national median. Full investigation →")}&url=${encodeURIComponent("https://openmedicaid.org/insights/chicago-exposed")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1 rounded-full bg-dark-700 border border-dark-500/50 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
        >
          Share on X
        </a>
      </div>

      <RelatedInsights currentSlug="chicago-exposed" relatedSlugs={["pandemic-profiteers", "city-hotspots", "cares-inc-exposed"]} />
    </div>
  );
}
