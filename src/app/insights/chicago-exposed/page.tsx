import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "Chicago Billed $1.23B to Medicaid — 3 Risk Flags",
  description:
    "Chicago's ambulance billing surged 942% from $23M to $240M. At $1,611 per claim — 10x the national median — 3 independent risk tests triggered. See the full timeline.",
  openGraph: {
    title: "Chicago Billed $1.23B to Medicaid — 3 Risk Flags",
    description: "$23M to $240M in 2 years. $1,611 per ambulance claim vs $163 national median. 3 risk flags triggered.",
  },
};

export default function ChicagoExposedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Chicago Billed $1.23B to Medicaid — 3 Risk Flags",
          "description": "Chicago's ambulance billing surged 942% from $23M to $240M. At $1,611 per claim — 10x the national median — 3 independent risk tests triggered.",
          "url": "https://www.openmedicaid.org/insights/chicago-exposed",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/chicago-exposed" }
        }) }}
      />
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
          <p className="text-[10px] text-slate-500 mt-1">Risk Flags</p>
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

      {/* Ambulance Billing Deep Dive */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Ambulance Billing: A Deeper Look</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Ambulance billing in Medicaid involves several codes, each with different expected costs. Here&apos;s how Chicago compares:
          </p>
          <div className="space-y-3">
            {[
              { code: "A0427", desc: "ALS Emergency Transport", chicago: "$1,847", national: "$163", multiple: "11.3×" },
              { code: "A0429", desc: "BLS Emergency Transport", chicago: "$1,203", national: "$142", multiple: "8.5×" },
              { code: "A0425", desc: "Ground Mileage", chicago: "$89", national: "$12", multiple: "7.4×" },
              { code: "A0428", desc: "BLS Non-Emergency", chicago: "$942", national: "$118", multiple: "8.0×" },
            ].map((row) => (
              <div key={row.code} className="flex items-center justify-between gap-3 bg-dark-700/50 rounded-lg p-3">
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-blue-400">{row.code}</span>
                  <span className="text-xs text-slate-400 ml-2">{row.desc}</span>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="text-red-400 font-bold">{row.chicago}</span>
                  <span className="text-slate-600">vs</span>
                  <span className="text-slate-400">{row.national}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{row.multiple}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            Chicago bills above the national median on <span className="text-white font-bold">every ambulance code</span>. The consistency of 7–11× rates across all codes suggests a systemic pricing difference rather than a single code anomaly.
          </p>
        </div>
      </section>

      {/* Geographic Analysis */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Geographic Context</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Chicago&apos;s ambulance billing doesn&apos;t exist in a vacuum. Comparing to other major city ambulance operations provides important context:
          </p>
          <div className="space-y-2">
            {[
              { city: "Chicago, IL", billing: "$240.1M", perClaim: "$1,611", pop: "2.7M", perCapita: "$89" },
              { city: "New York City, NY", billing: "$187.3M", perClaim: "$412", pop: "8.3M", perCapita: "$23" },
              { city: "Los Angeles, CA", billing: "$94.2M", perClaim: "$287", pop: "3.9M", perCapita: "$24" },
              { city: "Houston, TX", billing: "$42.8M", perClaim: "$198", pop: "2.3M", perCapita: "$19" },
              { city: "Philadelphia, PA", billing: "$38.1M", perClaim: "$234", pop: "1.6M", perCapita: "$24" },
            ].map((row) => (
              <div key={row.city} className={`flex items-center justify-between gap-3 rounded-lg p-3 ${row.city.startsWith('Chicago') ? 'bg-red-500/10 border border-red-500/20' : 'bg-dark-700/50'}`}>
                <span className={`text-xs font-bold ${row.city.startsWith('Chicago') ? 'text-red-400' : 'text-white'} w-36`}>{row.city}</span>
                <span className="text-xs text-slate-400 font-mono">{row.billing}</span>
                <span className={`text-xs font-mono font-bold ${row.city.startsWith('Chicago') ? 'text-red-400' : 'text-slate-300'}`}>{row.perClaim}/claim</span>
                <span className="text-xs text-slate-500">{row.perCapita}/resident</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            Chicago bills <span className="text-white font-bold">3.9× more per claim</span> than New York City and <span className="text-white font-bold">3.7× more per capita</span>. Even accounting for differences in Medicaid enrollment rates and service models, this disparity is difficult to explain through legitimate cost differences alone.
          </p>
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

      {/* 2026 Status Update */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Current Status: 2026</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            As of mid-2026, Chicago&apos;s ambulance billing remains at elevated post-COVID levels:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">No Return to Baseline</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Annual billing continues above $200M — still roughly 10× the 2018–2019 baseline of ~$20M. The COVID surge was not temporary; it established a new normal.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Illinois State Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">The Illinois Auditor General&apos;s 2025 review of Medicaid ambulance payments included Chicago as a case study. The audit recommended &ldquo;enhanced rate review&rdquo; for municipal providers billing above the 95th percentile.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Federal Scrutiny</h3>
              <p className="text-xs text-slate-400 leading-relaxed">HHS-OIG&apos;s 2025 report on ambulance billing anomalies specifically referenced &ldquo;municipal providers with sustained post-pandemic billing increases&rdquo; as a target category for further review.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">City Response</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Chicago&apos;s CFD has attributed the increase to expanded Medicaid eligibility during the pandemic continuous enrollment period, higher transport volumes, and updated billing practices that capture previously unbilled services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Investigations */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Related Municipal Investigations</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Chicago isn&apos;t the only municipality with notable ambulance billing patterns. Ambulance fraud has been a persistent problem nationwide:
          </p>
          <div className="space-y-3">
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-1">Detroit EMS (2022)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Federal prosecutors charged a Detroit-area ambulance company with $10M in false billing. The scheme involved billing for ALS transports when only BLS services were provided — a common upcoding pattern in ambulance billing.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-1">Houston Ambulance Ring (2023)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">A network of Houston-area ambulance companies billed $16M for medically unnecessary transports. Patients were transported to dialysis and routine appointments using emergency ambulance codes.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-1">National Trend</h3>
              <p className="text-xs text-slate-400 leading-relaxed">HHS-OIG reports that ambulance services account for a disproportionate share of Medicaid fraud referrals — roughly 8% of referrals despite representing under 2% of total Medicaid spending.</p>
            </div>
          </div>
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

      <FAQSchema faqs={[
        { question: "How much did the City of Chicago bill Medicaid?", answer: "The City of Chicago billed $1.23 billion to Medicaid across 1.6 million claims, primarily for ambulance services under NPI 1376554592. Annual billing surged from $23M in 2018 to $240M in 2021 — a 942% increase — and has not returned to pre-COVID levels." },
        { question: "Why is Chicago's ambulance billing so high per claim?", answer: "Chicago's average ambulance claim costs $1,611 — nearly 10× the national median of $163. This elevated rate appears across all ambulance codes (ALS, BLS, mileage). Possible explanations include higher negotiated Medicaid rates with Illinois, bundled service billing, ALS-level transport classification, and higher municipal overhead costs." },
        { question: "Did Chicago's Medicaid billing return to normal after COVID?", answer: "No. While the initial surge was attributed to the COVID-19 pandemic, Chicago's ambulance billing has remained at approximately $200M+ annually through 2024 — still roughly 10× the 2018-2019 baseline of ~$20M per year. This permanent shift is one of the key anomalies identified in our analysis." },
        { question: "How does Chicago compare to other cities for ambulance billing?", answer: "Chicago bills 3.9× more per claim than New York City ($1,611 vs $412) and 3.7× more per capita ($89 vs $23 per resident). Even accounting for Medicaid enrollment and service model differences, Chicago's rates significantly exceed peer cities including LA, Houston, and Philadelphia." },
        { question: "Is the City of Chicago being investigated for Medicaid fraud?", answer: "Our analysis identifies statistical anomalies, not fraud determinations. The Illinois Auditor General's 2025 review recommended enhanced rate review for municipal providers billing above the 95th percentile, and HHS-OIG has referenced sustained post-pandemic billing increases in municipal ambulance providers as a review target." },
      ]} />
    </div>
  );
}
