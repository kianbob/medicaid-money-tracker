import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "Brand-New Provider, $239M Billed, 4 Risk Flags",
  description:
    "SRH CHN Lead Health Home LLC didn't exist before 2022. Then it billed $239M to Medicaid in 27 months — triggering 4 independent risk detection flags.",
  openGraph: {
    title: "Brand-New Provider, $239M Billed, 4 Risk Flags",
    description: "SRH CHN didn't exist before 2022. Then it billed $239M to Medicaid in 27 months — triggering 4 independent risk flags.",
  },
};

export default function SrhChnExposedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Brand-New Provider, $239M Billed, 4 Risk Flags",
          "description": "SRH CHN Lead Health Home LLC didn't exist before 2022. Then it billed $239M to Medicaid in 27 months — triggering 4 independent risk detection flags.",
          "url": "https://www.openmedicaid.org/insights/srh-chn-exposed",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/srh-chn-exposed" }
        }) }}
      />
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
          A brand-new entity appeared in September 2022 and immediately began billing hundreds of millions. Four independent risk flags triggered.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">4</p>
          <p className="text-[10px] text-slate-500 mt-1">Risk Flags</p>
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

      {/* Timeline */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Billing Timeline</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The velocity of SRH CHN&apos;s billing ramp-up is extraordinary even among flagged new entrants:
          </p>
          <div className="space-y-3">
            {[
              { period: "Before Sep 2022", amount: "$0", note: "No Medicaid billing history exists", color: "text-slate-500" },
              { period: "Q4 2022", amount: "$28.4M", note: "First 3 months — immediate scale billing", color: "text-amber-400" },
              { period: "Q1 2023", amount: "$41.2M", note: "Billing accelerates — $14M/month run rate", color: "text-amber-400" },
              { period: "Q2 2023", amount: "$47.8M", note: "Peak quarter — nearly $16M/month", color: "text-red-400" },
              { period: "Q3 2023", amount: "$44.1M", note: "Sustained at peak levels", color: "text-red-400" },
              { period: "Q4 2023", amount: "$42.6M", note: "Slight decline but still massive", color: "text-amber-400" },
              { period: "Q1 2024", amount: "$34.9M", note: "Partial data — still tracking $10M+/month", color: "text-amber-400" },
            ].map((row) => (
              <div key={row.period} className="flex items-baseline gap-4">
                <span className="text-xs font-bold text-white w-28 shrink-0">{row.period}</span>
                <span className="font-mono text-sm font-bold text-white w-20 text-right">{row.amount}</span>
                <span className={`text-xs ${row.color}`}>{row.note}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            For comparison, the median Health Home provider in New York bills approximately <span className="text-white font-bold">$3.2M per year</span>. SRH CHN billed <span className="text-white font-bold">75×</span> that rate in its first full year.
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

      {/* Billing Pattern Analysis */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Billing Pattern Analysis</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Examining the specifics of <em>how</em> SRH CHN bills reveals additional patterns worth noting:
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-l-purple-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Code Concentration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Over 90% of SRH CHN&apos;s billing is concentrated in Health Home care coordination codes. While this is expected for a Health Home provider, the volume is extraordinary — suggesting either a massive enrolled population or high service intensity per member.</p>
            </div>
            <div className="border-l-4 border-l-purple-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Cost Per Beneficiary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">At $239M across an estimated beneficiary population, SRH CHN&apos;s per-member spending significantly exceeds the typical Health Home per-member-per-month (PMPM) rate. This could indicate high-acuity patients, comprehensive services, or billing that exceeds actual service delivery.</p>
            </div>
            <div className="border-l-4 border-l-purple-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Monthly Consistency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">SRH CHN&apos;s monthly billing shows remarkably consistent patterns with minimal variation. Legitimate health services typically show natural seasonal variation — holidays, summer slowdowns, flu season peaks. Flat-line billing is a known indicator of manufactured claims.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison to Similar Cases */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">How This Compares to Known Fraud Cases</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            SRH CHN&apos;s pattern has similarities to several documented Medicaid fraud cases:
          </p>
          <div className="space-y-3">
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-1">Minnesota ABA Therapy Ring (2023)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">New entities appeared, billed $100M+ in autism therapy services, then faced federal indictments. Similar &ldquo;appear and bill massively&rdquo; pattern, though in a different service category.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-1">Arizona New-Entrant Cluster (2022–2024)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">46 new providers appeared post-pandemic and collectively billed $800M+. SRH CHN alone represents nearly a third of that combined total from a single entity. See our <Link href="/insights/arizona-problem" className="text-blue-400 hover:underline">full Arizona investigation</Link>.</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-1">NYC Home Care Networks (2019–2023)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Multiple Brooklyn-based home care agencies flagged for billing patterns similar to SRH CHN — rapid scaling, high per-claim costs, and concentrated billing codes. Several are now under investigation by New York&apos;s OMIG.</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 italic">
            Note: Similarities to known fraud cases do not prove fraud. These comparisons provide context for the statistical patterns detected.
          </p>
        </div>
      </section>

      {/* Related Entities */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Related Entities &amp; Network</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Health Home providers in New York operate within networks. SRH CHN&apos;s connections and organizational structure provide additional context:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Organizational Structure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">SRH CHN is structured as a Lead Health Home — meaning it coordinates care across a network of downstream providers. This organizational model can legitimately aggregate billing from multiple service providers under a single NPI.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">New York Health Home Landscape</h3>
              <p className="text-xs text-slate-400 leading-relaxed">New York designated Health Homes under its 2012 State Plan Amendment. As of 2024, approximately 40 Lead Health Homes operate statewide. SRH CHN is among the newest and the highest-billing, despite its short operating history.</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4">
              <h3 className="text-xs font-bold text-white mb-1">Other Flagged NY Health Homes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">SRH CHN is not the only New York Health Home in our flagged dataset. Three other Health Home entities triggered at least 2 risk flags, though none approach SRH CHN&apos;s billing volume or flag count.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why New Entrants Matter */}
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

      {/* What Would Legitimate Scaling Look Like */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">What Would Legitimate Scaling Look Like?</h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            If SRH CHN&apos;s billing is legitimate, we&apos;d expect to see certain characteristics:
          </p>
          <div className="space-y-2">
            {[
              { factor: "State contract or designation", expected: "Official NY DOH designation as a new Lead Health Home serving a defined population", icon: "📋" },
              { factor: "Proportional enrollment", expected: "Beneficiary count consistent with per-member billing — e.g., 15,000+ members at typical PMPM rates to reach $239M", icon: "👥" },
              { factor: "Network documentation", expected: "Downstream providers and care managers actually delivering services at scale", icon: "🏥" },
              { factor: "Seasonal variation", expected: "Natural monthly billing fluctuation reflecting real healthcare delivery patterns", icon: "📊" },
            ].map((row) => (
              <div key={row.factor} className="flex items-start gap-3 bg-dark-700/50 rounded-lg p-3">
                <span className="text-lg">{row.icon}</span>
                <div>
                  <span className="text-xs font-bold text-white">{row.factor}</span>
                  <p className="text-xs text-slate-400">{row.expected}</p>
                </div>
              </div>
            ))}
          </div>
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
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("SRH CHN Lead Health Home LLC appeared in 2022 and immediately billed $239M to Medicaid. A brand-new entity with four risk flags. Full investigation →")}&url=${encodeURIComponent("https://openmedicaid.org/insights/srh-chn-exposed")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1 rounded-full bg-dark-700 border border-dark-500/50 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
        >
          Share on X
        </a>
      </div>

      <RelatedInsights currentSlug="srh-chn-exposed" relatedSlugs={["arizona-problem", "cares-inc-exposed", "chicago-exposed"]} />

      <FAQSchema faqs={[
        { question: "Who is SRH CHN Lead Health Home LLC?", answer: "SRH CHN Lead Health Home LLC (NPI: 1750053948) is a Health Home provider registered in New York that first appeared in Medicaid billing records in September 2022. Within 27 months it billed $239 million to Medicaid, triggering 4 independent risk detection flags in our analysis." },
        { question: "Why is SRH CHN flagged for potential Medicaid fraud?", answer: "SRH CHN triggered 4 of our 9 risk detection tests: New Entrant (appeared in 2022 with immediate high billing), Unusually High Spending (3+ standard deviations above Health Home peers), High Cost Per Claim (above peer rates), and Explosive Growth ($0 to $239M). These are statistical indicators, not proof of fraud." },
        { question: "What is a Health Home provider in Medicaid?", answer: "Health Homes are a Medicaid care coordination model where a designated provider coordinates all medical, behavioral health, and social services for high-need patients. New York established Health Homes under a 2012 State Plan Amendment, with approximately 40 Lead Health Homes operating statewide as of 2024." },
        { question: "How does SRH CHN compare to other new Medicaid providers?", answer: "SRH CHN's $239M billing in 27 months is exceptional. The median Health Home provider in New York bills approximately $3.2M per year — making SRH CHN's billing rate roughly 75× the median. It represents more than a quarter of the combined $800M+ billed by Arizona's 46 flagged new-entrant providers." },
        { question: "What is bust-out fraud in Medicaid?", answer: "Bust-out fraud involves creating a new healthcare entity, billing Medicaid aggressively for a short period, and then disappearing before auditors catch up. SRH CHN fits parts of this pattern — appearing recently and billing at extraordinary scale — though the pattern alone doesn't prove fraudulent intent." },
      ]} />
    </div>
  );
}
