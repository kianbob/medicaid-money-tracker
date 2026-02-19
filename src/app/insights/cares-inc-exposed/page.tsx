import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "CARES INC: From $1.6M to $112.6M — A 6,886% Billing Explosion",
  description:
    "Deep dive into CARES INC (NPI 1396049987), a New York case management provider whose Medicaid billing exploded 6,886% in a single year. Seven independent fraud flags triggered.",
  openGraph: {
    title: "CARES INC: A 6,886% Billing Explosion",
    description: "From $1.6M to $112.6M in one year. Seven fraud flags. The full story.",
  },
};

export default function CaresIncExposedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">CARES INC Exposed</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 uppercase tracking-wider">Exposed</span>
          <span className="text-[10px] text-slate-500">February 18, 2026 · 8 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">
          CARES INC: From $1.6M to $112.6M &mdash; A 6,886% Billing Explosion
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          A New York case management provider triggered seven independent fraud detection flags. Here&apos;s everything the data shows.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">7</p>
          <p className="text-[10px] text-slate-500 mt-1">Fraud Flags</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">$1.04B</p>
          <p className="text-[10px] text-slate-500 mt-1">Total Billing</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">6,886%</p>
          <p className="text-[10px] text-slate-500 mt-1">Peak Growth</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">240K</p>
          <p className="text-[10px] text-slate-500 mt-1">Beneficiaries</p>
        </div>
      </div>

      {/* The Timeline */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">The Timeline</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Community Assistance Resources &amp; Extended Services INC (CARES INC) is registered as a Case Management provider in New York, NY (NPI: <Link href="/providers/1396049987" className="text-blue-400 hover:underline font-mono">1396049987</Link>). Their billing trajectory tells a striking story:
          </p>
          <div className="space-y-3">
            {[
              { year: "2019", amount: "$77K", note: "First appears in Medicaid billing records", color: "text-slate-400" },
              { year: "2020", amount: "$1.6M", note: "+1,992% growth — billing ramps up", color: "text-amber-400" },
              { year: "2021", amount: "$112.6M", note: "+6,886% — the explosion year", color: "text-red-400" },
              { year: "2022", amount: "$486.1M", note: "+332% — billing continues surging to peak", color: "text-red-400" },
              { year: "2023", amount: "$297.6M", note: "-39% — first decline", color: "text-amber-400" },
              { year: "2024", amount: "$144.9M", note: "-51% — sharp continued decline", color: "text-amber-400" },
            ].map((row) => (
              <div key={row.year} className="flex items-baseline gap-4">
                <span className="text-sm font-bold text-white w-12">{row.year}</span>
                <span className="font-mono text-sm font-bold text-white w-20 text-right">{row.amount}</span>
                <span className={`text-xs ${row.color}`}>{row.note}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            Total lifetime billing: <span className="text-white font-bold">$1.04 billion</span> in taxpayer-funded Medicaid payments across 2.8 million claims serving 240,000 beneficiaries.
          </p>
        </div>
      </section>

      {/* The Flags */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Seven Independent Red Flags</h2>
        <p className="text-sm text-slate-400 mb-4">
          CARES INC triggered more fraud detection flags than almost any other provider in our dataset. Each flag represents a different statistical test:
        </p>
        <div className="space-y-3">
          {[
            {
              flag: "Cost Outlier",
              detail: "Bills $555.61 per claim for H2015 (comprehensive community support) — 5.8× the national median of $96.24. Also 4.5× median for H2014 and 3.1× for 90847.",
            },
            {
              flag: "Billing Swing",
              detail: "Billing changed by more than 200% year-over-year with over $1M in absolute change — triggered in multiple years as billing surged from $77K to $486M.",
            },
            {
              flag: "Rate Outlier",
              detail: "Billing above the 90th percentile for 9 procedure codes simultaneously. One high-cost code could be specialization — nine suggests systematic overbilling.",
            },
            {
              flag: "Explosive Growth",
              detail: "6,886% year-over-year increase from 2020 to 2021 — far beyond the 500% threshold. This is the single largest percentage jump among major providers.",
            },
            {
              flag: "Unusually High Spending",
              detail: "Total payments are more than 3 standard deviations above the mean for Case Management providers. $1.04B total when many peers bill under $10M.",
            },
            {
              flag: "High Cost Per Claim",
              detail: "Average cost per claim of $378 — significantly higher than peer Case Management providers billing the same procedure codes.",
            },
            {
              flag: "High Claims Per Patient",
              detail: "11.5 claims per beneficiary — indicating either intensive treatment patterns or potential overbilling per patient.",
            },
          ].map((item) => (
            <div key={item.flag} className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-4">
              <h3 className="text-xs font-bold text-red-400 mb-1">{item.flag}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Billing Codes */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">What Are They Billing For?</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            CARES INC bills primarily for community-based behavioral health and support services:
          </p>
          <div className="space-y-2">
            {[
              { code: "H2015", desc: "Comprehensive community support services, per 15 min", cost: "$555.61/claim", median: "$96.24", ratio: "5.8×" },
              { code: "H2014", desc: "Skills training & development, per 15 min", cost: "$378.16/claim", median: "$83.88", ratio: "4.5×" },
              { code: "90847", desc: "Family psychotherapy with patient, 50 min", cost: "$237.17/claim", median: "$77.33", ratio: "3.1×" },
            ].map((item) => (
              <div key={item.code} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-2 border-b border-dark-500/30 last:border-0">
                <Link href={`/procedures/${item.code}`} className="font-mono text-xs font-bold text-blue-400 hover:underline w-16 shrink-0">{item.code}</Link>
                <span className="text-xs text-slate-400 flex-1">{item.desc}</span>
                <span className="text-xs text-white font-semibold shrink-0">{item.cost}</span>
                <span className="text-[10px] text-red-400 shrink-0">{item.ratio} median</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            These are 15-minute billing increments. At $555.61 per 15-minute session for H2015, this implies a rate of over $2,222/hour — compared to the national median of $385/hour for the same service.
          </p>
        </div>
      </section>

      {/* Context */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Important Context</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">This provider may operate as a fiscal intermediary</strong> — an organization that processes Medicaid payments on behalf of many individual caregivers. In New York&apos;s self-directed care model, these entities can legitimately aggregate high billing volumes.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            However, several patterns remain unusual even for fiscal intermediaries: the 6,886% single-year growth rate, the significantly above-median cost per claim across multiple codes, and the sharp billing decline in 2023-2024 after the peak.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">These findings are statistical indicators, not proof of fraud.</strong> A qualified investigation would need to examine individual claims, verify services were delivered, and assess whether the billing rates reflect legitimate costs.
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
          <Link href="/providers/1396049987" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm shrink-0">
            CARES INC Profile →
          </Link>
        </div>
      </div>

      {/* Share */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs text-slate-500">Share this investigation:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("CARES INC went from $1.6M to $112.6M in Medicaid billing in one year — a 6,886% increase. Seven fraud flags triggered. Full investigation →")}&url=${encodeURIComponent("https://openmedicaid.org/insights/cares-inc-exposed")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1 rounded-full bg-dark-700 border border-dark-500/50 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
        >
          Share on X
        </a>
      </div>

      <RelatedInsights currentSlug="cares-inc-exposed" relatedSlugs={["pandemic-profiteers", "city-hotspots", "highest-confidence"]} />
    </div>
  );
}
