import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "The One Big Beautiful Bill: What $880B in Medicaid Cuts Actually Mean",
  description: "The OBBBA proposes $880B in Medicaid cuts over 10 years — work requirements, FMAP reductions, and eligibility checks. Here's what the data shows about who gets hit hardest.",
  keywords: ["one big beautiful bill medicaid", "OBBBA medicaid cuts", "medicaid work requirements 2026", "medicaid FMAP cuts", "medicaid eligibility changes"],
  openGraph: {
    title: "The One Big Beautiful Bill: What $880B in Medicaid Cuts Actually Mean",
    description: "Work requirements, FMAP reductions, and eligibility redeterminations every 6 months. We break down the biggest Medicaid restructuring in decades.",
  },
};

export default function OBBBAMedicaidCuts() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "The One Big Beautiful Bill: What $880B in Medicaid Cuts Actually Mean",
          "description": "The OBBBA proposes $880B in Medicaid cuts over 10 years — work requirements, FMAP reductions, and eligibility checks.",
          "datePublished": "2026-04-17",
          "url": "https://www.openmedicaid.org/insights/obbba-medicaid-cuts",
          "publisher": { "@type": "Organization", "name": "OpenMedicaid", "url": "https://www.openmedicaid.org" },
          "author": { "@type": "Organization", "name": "OpenMedicaid" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.openmedicaid.org/insights/obbba-medicaid-cuts" }
        }) }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">OBBBA Medicaid Cuts</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium text-red-400">Policy &amp; Legislation</span>
          <span className="text-xs text-slate-500">April 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">8 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          The One Big Beautiful Bill: What $880 Billion in Medicaid Cuts Actually Mean
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          The &ldquo;One Big Beautiful Bill Act&rdquo; (OBBBA) is the most significant proposed restructuring of Medicaid in
          the program&apos;s 60-year history. Work requirements, reduced federal matching rates, six-month eligibility
          redeterminations, and roughly <strong className="text-white">$880 billion in cuts over 10 years</strong>. We analyzed
          the bill against our database of 227 million billing records to show what this means in practice.
        </p>
      </div>

      {/* Key stat callout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">$880B</div>
          <div className="text-xs text-slate-500 mt-1">Proposed Cuts (10yr)</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">17.4M</div>
          <div className="text-xs text-slate-500 mt-1">Could Lose Coverage</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">80hrs</div>
          <div className="text-xs text-slate-500 mt-1">Monthly Work Requirement</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-purple-400">6mo</div>
          <div className="text-xs text-slate-500 mt-1">Eligibility Check Cycle</div>
        </div>
      </div>

      {/* Article body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">What the Bill Actually Does</h2>
        <p>
          The OBBBA, passed by the House Energy and Commerce Committee and now being reconciled in the Senate, targets
          Medicaid through several mechanisms simultaneously. The CBO estimates the combined effect at roughly $880 billion
          in reduced federal Medicaid spending over the next decade. Here are the key provisions:
        </p>

        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 my-8">
          <div className="text-red-400 font-semibold text-sm mb-3">🏛️ Key OBBBA Provisions</div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-white font-semibold">Work Requirements:</span>{" "}
              <span>Non-disabled, non-pregnant adults ages 19-64 must document 80 hours/month of work, job training,
              or community service to maintain Medicaid coverage. States can set higher thresholds.</span>
            </div>
            <div>
              <span className="text-white font-semibold">FMAP Reduction for Expansion:</span>{" "}
              <span>The federal matching rate for Medicaid expansion populations drops from 90% to 80% by 2030,
              shifting billions in costs to states.</span>
            </div>
            <div>
              <span className="text-white font-semibold">Eligibility Redeterminations:</span>{" "}
              <span>States must verify eligibility every 6 months instead of annually — doubling the administrative
              burden and increasing the risk of coverage gaps.</span>
            </div>
            <div>
              <span className="text-white font-semibold">ID Verification:</span>{" "}
              <span>New requirements for documentary proof of citizenship or immigration status at enrollment
              and renewal, with in-person verification options for states.</span>
            </div>
          </div>
        </div>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">The Case for Reform: Real Problems Exist</h2>
        <p>
          Let&apos;s be clear about something: Medicaid has real accountability problems. Our own data confirms it. We&apos;ve
          flagged <Link href="/watchlist" className="text-blue-400 hover:text-blue-300">1,860 providers</Link> billing{" "}
          <strong className="text-white">$226.2 billion</strong> in taxpayer funds with statistical anomalies that suggest
          fraud or waste. We found{" "}
          <Link href="/insights/banned-but-billing" className="text-blue-400 hover:text-blue-300">40 providers billing while federally banned</Link>.
          Minnesota alone has an estimated{" "}
          <Link href="/insights/minnesota-fraud-capital" className="text-blue-400 hover:text-blue-300">$9 billion fraud problem</Link>.
          The FY2025 improper payment rate hit <strong className="text-white">6.12%</strong> — that&apos;s $37.4 billion in payments that
          shouldn&apos;t have been made.
        </p>
        <p>
          A program spending over $600 billion annually with a 6% error rate and documented fraud networks deserves
          serious reform. The question isn&apos;t whether Medicaid needs fixing — it&apos;s whether the OBBBA fixes the
          right things.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">Work Requirements: What the Evidence Shows</h2>
        <p>
          Work requirements are the most politically charged provision. Supporters argue they promote self-sufficiency
          and ensure Medicaid serves those who truly need it. Critics argue most Medicaid enrollees who <em>can</em> work
          already do — and that administrative barriers will disenroll people who qualify but can&apos;t navigate the
          paperwork.
        </p>
        <p>
          Arkansas tested work requirements in 2018 before courts blocked them. The result: about <strong className="text-white">18,000 people
          lost coverage</strong> in just a few months. Research published in the <em>New England Journal of Medicine</em> found
          no measurable increase in employment — most people who lost coverage already met the work threshold but
          failed to report it through the state&apos;s online portal.
        </p>
        <p>
          The OBBBA attempts to address this with exemptions for caretakers, students, and people in treatment programs.
          But the fundamental challenge remains: verifying 80 hours of monthly activity for millions of people creates
          enormous administrative costs. States already struggle with annual eligibility checks —{" "}
          the <Link href="/insights/improper-payments" className="text-blue-400 hover:text-blue-300">improper payment data</Link> shows
          that administrative complexity is itself a major source of waste.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">FMAP Cuts: Shifting Costs to States</h2>
        <p>
          The federal government currently pays <strong className="text-white">90%</strong> of costs for Medicaid expansion populations
          (adults earning up to 138% of the federal poverty level). The OBBBA would ratchet that down to 80% by 2030.
          That 10-percentage-point shift translates to billions in new costs for the 40 states (plus DC) that expanded
          Medicaid.
        </p>
        <p>
          Our <Link href="/states" className="text-blue-400 hover:text-blue-300">state-by-state spending data</Link> shows why this
          matters. New York receives <strong className="text-white">$81.1 billion</strong> in Medicaid payments through our dataset —
          more than any other state. California follows at $36.8 billion. Even a modest percentage shift in federal
          matching creates budget crises at the state level. Colorado is already facing a{" "}
          <strong className="text-white">$1.5 billion budget shortfall</strong> driven partly by Medicaid costs, and the federal
          changes haven&apos;t fully kicked in yet.
        </p>
        <p>
          States facing FMAP reductions have three options: raise taxes, cut Medicaid benefits, or reduce provider
          reimbursement rates. Idaho just approved <strong className="text-white">$22 million in Medicaid disability cuts</strong>.
          Colorado is debating a 2% cut to provider reimbursement rates. These are early signs of what&apos;s coming
          nationwide.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">Who Gets Hit Hardest?</h2>
        <p>
          The Robert Wood Johnson Foundation projects that <strong className="text-white">up to 17.4 million people</strong> could lose
          Medicaid coverage under the OBBBA&apos;s combined provisions — work requirements, more frequent eligibility
          checks, and the administrative churn they create. That&apos;s roughly one in five current enrollees.
        </p>
        <p>
          Rural areas face a particular squeeze. Rural hospitals depend heavily on Medicaid reimbursement — many
          operate on margins below 2%. The bill includes $13.5 billion in &ldquo;Rural Health Transformation&rdquo; funds,
          but analysis from the Peterson-KFF Health System Tracker suggests this won&apos;t fully offset the
          impact of reduced Medicaid funding in rural communities.
        </p>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 my-8">
          <div className="text-blue-400 font-semibold text-sm mb-2">🗺️ States Most Affected by FMAP Cuts</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-white font-semibold">New York:</span> $81.1B in spending, largest expansion population</div>
            <div><span className="text-white font-semibold">California:</span> $36.8B in spending, 14M+ Medicaid enrollees</div>
            <div><span className="text-white font-semibold">Ohio:</span> $8.6B in spending, expanded in 2014</div>
            <div><span className="text-white font-semibold">Arizona:</span> $8.5B in spending, early expansion state</div>
            <div><span className="text-white font-semibold">Michigan:</span> $12.0B in spending, bipartisan expansion</div>
            <div><span className="text-white font-semibold">Kentucky:</span> Expanded under Gov. Beshear, high enrollment</div>
          </div>
        </div>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">A Better Approach: Target the Fraud, Not the Program</h2>
        <p>
          The data supports reform — but smart reform. Our analysis shows fraud is <strong className="text-white">highly
          concentrated</strong>: specific states, specific provider types, specific billing codes. The top 1,860 flagged
          providers account for $226.2 billion in billing. Minnesota&apos;s fraud networks center on home health,
          personal care, and interpreter services.{" "}
          <Link href="/insights/arizona-problem" className="text-blue-400 hover:text-blue-300">Arizona&apos;s suspicious new clinics</Link>{" "}
          billed $800M+ shortly after appearing.
        </p>
        <p>
          Instead of across-the-board cuts that affect 90 million enrollees, the data argues for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Pre-payment verification:</strong> Flag anomalies before payments go out, not after</li>
          <li><strong className="text-white">Real-time exclusion list checks:</strong> Stop the 40+ providers currently billing while banned</li>
          <li><strong className="text-white">State-specific enforcement:</strong> Focus resources where fraud concentrates — Minnesota, Arizona, New York home care</li>
          <li><strong className="text-white">Technology investment:</strong> The{" "}
            <Link href="/ml-analysis" className="text-blue-400 hover:text-blue-300">ML models we built</Link> cost a fraction of what fraud costs. CMS should deploy similar tools at scale</li>
        </ul>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">The Bottom Line</h2>
        <p>
          The OBBBA is a blunt instrument applied to a problem that requires precision. Medicaid absolutely has a
          fraud problem — $37.4 billion in improper payments, organized fraud networks, and providers billing while
          banned. That demands accountability.
        </p>
        <p>
          But the bill&apos;s primary mechanism — reducing federal funding and adding administrative requirements —
          doesn&apos;t target fraud. It targets enrollment. Work requirements didn&apos;t increase employment in Arkansas;
          they increased paperwork. FMAP cuts don&apos;t catch the providers on our watchlist; they squeeze state budgets.
          Six-month eligibility checks don&apos;t stop the{" "}
          <Link href="/insights/impossible-volume" className="text-blue-400 hover:text-blue-300">providers filing 60,000 claims a day</Link>;
          they create more administrative errors.
        </p>
        <p>
          The data exists to fix Medicaid&apos;s fraud problem surgically. Whether Congress chooses data-driven reform
          over across-the-board cuts will determine whether $880 billion in &ldquo;savings&rdquo; actually reduces waste —
          or just reduces coverage.
        </p>
        <p>
          Explore the data yourself:{" "}
          <Link href="/watchlist" className="text-blue-400 hover:text-blue-300">view the watchlist</Link>,{" "}
          <Link href="/states" className="text-blue-400 hover:text-blue-300">compare states</Link>, or{" "}
          <Link href="/check" className="text-blue-400 hover:text-blue-300">check any provider</Link>.
        </p>
      </div>

      <RelatedInsights
        currentSlug="obbba-medicaid-cuts"
        relatedSlugs={["doge-medicaid", "improper-payments", "minnesota-fraud-capital", "spending-growth"]}
      />
    </article>
  );
}
