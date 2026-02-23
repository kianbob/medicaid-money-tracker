import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "Brand-New Provider, $239M Billed, 4 Fraud Flags",
  description:
    "SRH CHN Lead Health Home LLC didn't exist before 2022. Then it billed $239M to Medicaid in 27 months — triggering 4 independent fraud detection flags.",
  openGraph: {
    title: "Brand-New Provider, $239M Billed, 4 Fraud Flags",
    description: "SRH CHN didn't exist before 2022. Then it billed $239M to Medicaid in 27 months — triggering 4 independent fraud flags.",
  },
};

export default function SrhChnExposedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">SRH CHN Exposed</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 uppercase tracking-wider">Exposed</span>
          <span className="text-[10px] text-slate-500">February 18, 2026 · 5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">
          SRH CHN Lead Health Home: $239 Million From Nowhere
        </h1>
        <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
          A brand-new entity appeared in September 2022 and immediately began billing hundreds of millions. Four independent fraud flags triggered.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">4</p>
          <p className="text-[10px] text-slate-500 mt-1">Fraud Flags</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">$239M</p>
          <p className="text-[10px] text-slate-500 mt-1">Total Billing</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">NEW</p>
          <p className="text-[10px] text-slate-500 mt-1">First Appeared 2022</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">27 mo</p>
          <p className="text-[10px] text-slate-500 mt-1">Active Period</p>
        </div>
      </div>

      {/* The Story */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Appeared From Nowhere</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            SRH CHN Lead Health Home LLC (NPI: <Link href="/providers/1750053948" className="text-blue-400 hover:underline font-mono">1750053948</Link>) is registered as a Health Home provider in New York. It has no billing history before September 2022. Then, suddenly, it began billing at scale.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Within its first year of existence, SRH CHN billed <span className="text-white font-bold">$239 million</span> to Medicaid. For context, that&apos;s more than many established hospital systems bill in a decade.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            This is precisely the pattern that triggered the &ldquo;New Entrant&rdquo; flag in our analysis — entities that appear recently but immediately bill at levels that take legitimate organizations years to reach.
          </p>
        </div>
      </section>

      {/* The Flags */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Four Red Flags</h2>
        <div className="space-y-3">
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-4">
            <h3 className="text-xs font-bold text-red-400 mb-1">New Entrant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">First appeared in 2022 but already billing over $5M. SRH CHN far exceeds this threshold at $239M — making it one of the highest-billing new entities in the dataset.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-4">
            <h3 className="text-xs font-bold text-red-400 mb-1">Unusually High Spending</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Total payments are more than 3 standard deviations above the mean for Health Home providers. Most Health Home entities bill a fraction of this amount.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-4">
            <h3 className="text-xs font-bold text-red-400 mb-1">High Cost Per Claim</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Per-claim costs significantly exceed peer Health Home providers billing the same procedure codes.</p>
          </div>
          <div className="bg-dark-800 border-l-4 border-l-red-500 rounded-r-xl p-4">
            <h3 className="text-xs font-bold text-red-400 mb-1">Explosive Growth</h3>
            <p className="text-xs text-slate-400 leading-relaxed">By definition, any entity that goes from $0 to $239M triggers explosive growth detection. The velocity of billing ramp-up is unprecedented in our dataset.</p>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Why New Entrants Matter</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            In healthcare fraud investigations, new entities that immediately bill at scale are a well-known red flag. The pattern — sometimes called &ldquo;bust-out&rdquo; fraud — involves creating a new entity, billing aggressively for a short period, then disappearing before auditors catch up.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            SRH CHN fits parts of this pattern: it appeared recently, billed at extraordinary scale, and has only been active for about 27 months. Whether this represents legitimate rapid scaling of a health home program or something that warrants investigation is a question for qualified auditors.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our Arizona investigation found a similar pattern: <Link href="/insights/arizona-problem" className="text-blue-400 hover:underline">46 new providers</Link> appeared post-pandemic and immediately billed $800M+ combined. SRH CHN alone exceeds a quarter of that total.
          </p>
        </div>
      </section>

      {/* Context */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Important Context</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            <strong className="text-white">Health Home programs are a legitimate Medicaid innovation.</strong> New York actively expanded Health Home programs to coordinate care for high-need Medicaid beneficiaries. New entities entering this space is expected.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">These findings are statistical indicators, not accusations.</strong> SRH CHN may be a legitimate health home that scaled rapidly due to state contracts or population need. The billing volume is unusual, not necessarily improper.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 rounded-xl p-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white mb-1">View the full provider profile</p>
            <p className="text-xs text-slate-400">See all billing data, yearly trends, and detection signals.</p>
          </div>
          <Link href="/providers/1750053948" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm shrink-0">
            SRH CHN Profile →
          </Link>
        </div>
      </div>

      {/* Share */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs text-slate-500">Share this investigation:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("SRH CHN Lead Health Home LLC appeared in 2022 and immediately billed $239M to Medicaid. A brand-new entity with four fraud flags. Full investigation →")}&url=${encodeURIComponent("https://openmedicaid.org/insights/srh-chn-exposed")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1 rounded-full bg-dark-700 border border-dark-500/50 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
        >
          Share on X
        </a>
      </div>

      <RelatedInsights currentSlug="srh-chn-exposed" relatedSlugs={["arizona-problem", "cares-inc-exposed", "chicago-exposed"]} />
    </div>
  );
}
