import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";

export const metadata: Metadata = {
  title: "$37.4B in Improper Payments: Medicaid's Error Rate Hits 6.12%",
  description: "Medicaid's error rate jumped 20% in one year to 6.12%. Only $1.4B recovered from $37.4B in improper payments — a 3.7% recovery rate. 23 years on the GAO high-risk list.",
  openGraph: {
    title: "$37.4B in Improper Payments: Medicaid's Error Rate Hits 6.12%",
    description: "Medicaid's error rate jumped 20% in one year to 6.12%. Only $1.4B recovered from $37.4B in improper payments — a 3.7% recovery rate. 23 years on the GAO high-risk list.",
  },
  keywords: ["medicaid improper payments 2025", "medicaid error rate", "medicaid waste", "medicaid fraud statistics"],
};

export default function ImproperPayments() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Improper Payments</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-xs font-medium text-amber-400">Policy Analysis</span>
          <span className="text-xs text-slate-500">February 19, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">8 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          $37.4 Billion in Improper Payments
        </h1>
        <p className="text-xl text-slate-300 font-semibold mb-3">Inside Medicaid&apos;s Growing Error Rate</p>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          CMS reported $37.39 billion in improper payments for FY2025 &mdash; a 6.12% error rate, up from 5.09% the
          year before. That&apos;s a 20% increase in one year. Most of it isn&apos;t fraud. But after 23 years on the
          GAO&apos;s high-risk list, the numbers keep going the wrong direction.
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">$37.39B</div>
          <div className="text-xs text-slate-500 mt-1">FY2025 Improper Payments</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">6.12%</div>
          <div className="text-xs text-slate-500 mt-1">Error Rate (Up from 5.09%)</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">79.11%</div>
          <div className="text-xs text-slate-500 mt-1">&lsquo;Insufficient Documentation&rsquo;</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">$1.4B</div>
          <div className="text-xs text-slate-500 mt-1">Recovered by MFCUs</div>
        </div>
      </div>

      {/* Article body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">What Are Improper Payments?</h2>
        <p>
          Every three years, CMS measures each state&apos;s Medicaid error rate through the <strong>Payment Error Rate
          Measurement (PERM)</strong> program. Federal contractors pull random samples of claims and eligibility
          determinations, then check whether payments were made correctly &mdash; right amount, right person, right
          documentation.
        </p>
        <p>
          A payment is &ldquo;improper&rdquo; if it was the wrong amount, went to an ineligible recipient, wasn&apos;t
          supported by sufficient documentation, or was otherwise not in compliance with program rules. States are
          measured on a rotating three-year cycle, with roughly 17 states reviewed each year.
        </p>
        <p>
          Here&apos;s the critical nuance: <strong>improper does not mean fraudulent</strong>. The vast majority of
          improper payments are paperwork failures &mdash; a missing signature, an incomplete form, a provider who
          didn&apos;t submit documentation in time. The payment may have been for a legitimate service delivered to an
          eligible patient. It just couldn&apos;t be fully verified.
        </p>
        <p>
          That said, a system that can&apos;t verify $37.4 billion in payments is a system that can&apos;t tell you how
          much of that $37.4 billion was actually stolen.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">The Numbers: FY2024 vs FY2025</h2>
        <p>
          The trend is moving in the wrong direction. Here&apos;s what the last two years look like:
        </p>

        {/* Year comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">FY2024</div>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-slate-300">5.09%</div>
                <div className="text-xs text-slate-500">Error Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-300">$31.10B</div>
                <div className="text-xs text-slate-500">Improper Payments</div>
              </div>
              <div className="text-xs text-slate-600 pt-2 border-t border-dark-600">Baseline</div>
            </div>
          </div>
          <div className="bg-dark-800 border border-amber-500/30 rounded-xl p-6">
            <div className="text-xs text-amber-400 uppercase tracking-wider mb-3">FY2025</div>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-amber-400">6.12%</div>
                <div className="text-xs text-slate-500">Error Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">$37.39B</div>
                <div className="text-xs text-slate-500">Improper Payments</div>
              </div>
              <div className="text-xs text-red-400 pt-2 border-t border-dark-600">+20.2% increase</div>
            </div>
          </div>
        </div>

        <p>
          A 20% jump in one year. Total Medicaid spending grew too, but not by 20%. The error <em>rate</em> itself
          climbed from 5.09% to 6.12% &mdash; meaning the system is getting worse at processing payments correctly,
          not just spending more.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">The Documentation Problem</h2>
        <p>
          Of all improper payments identified, <strong>79.11%</strong> were classified as &ldquo;insufficient
          documentation.&rdquo; Not overpayments. Not payments to ineligible people. Just &mdash; the paperwork
          wasn&apos;t there.
        </p>
        <p>
          This is simultaneously reassuring and deeply frustrating. Reassuring because it suggests most of the $37.4
          billion wasn&apos;t outright theft. Frustrating because after decades of reform efforts, nearly 4 out of 5
          errors are still just missing paperwork.
        </p>
        <p>
          The documentation problem creates a convenient fog. When you can&apos;t verify a payment, you can&apos;t
          distinguish a legitimate service with sloppy records from a fabricated claim with no records at all. The
          79.11% &ldquo;insufficient documentation&rdquo; bucket is where confirmed fraud hides &mdash; because the
          whole point of the category is that nobody checked.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">Recovery vs. Leakage: The Math Problem</h2>
        <p>
          State Medicaid Fraud Control Units (MFCUs) &mdash; the primary enforcement arm &mdash; recovered
          approximately <strong>$1.4 billion</strong> in FY2024. They secured 1,151 criminal convictions and 741 civil
          settlements. The enforcement return is solid: for every $1 spent on MFCUs, $3.46 comes back in recoveries.
        </p>

        {/* Callout box */}
        <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl p-6 my-8">
          <div className="text-sm font-semibold text-amber-400 mb-2">The Recovery Math</div>
          <p className="text-slate-300 text-sm m-0 mb-3">
            MFCUs recovered <strong>$1.4 billion</strong> against <strong>$37.4 billion</strong> in improper payments.
            That&apos;s a <strong>3.7% recovery rate</strong>.
          </p>
          <p className="text-slate-400 text-sm m-0">
            Even if only 10% of improper payments are actual fraud (~$3.7B), the system is recovering less than 38% of
            estimated fraud. If the true fraud rate is higher, the gap gets worse.
          </p>
        </div>

        <p>
          The $3.46-per-dollar return sounds impressive until you realize the scale of the problem. $1.4 billion
          recovered against $37.4 billion in improper payments means 96.3% of the money that shouldn&apos;t have gone
          out the door is never coming back.
        </p>
        <p>
          To be fair, not all $37.4 billion is recoverable &mdash; much of it represents legitimate services with bad
          paperwork. But even conservative estimates of the true fraud rate (5&ndash;10% of total spending) suggest
          billions in actual theft that goes unrecovered every year.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">23 Years on the GAO High-Risk List</h2>
        <p>
          The Government Accountability Office first placed Medicaid on its{" "}
          <strong>High-Risk List</strong> in 2003, citing &ldquo;improper payments&rdquo; and &ldquo;program
          integrity&rdquo; concerns. It has remained there every year since. The 2025 update kept it right where it&apos;s
          been for over two decades.
        </p>
        <p>
          What has changed in 23 years? Total Medicaid spending roughly tripled. The improper payment rate has
          fluctuated between 5% and 12%, never sustainably dropping below 5%. New fraud schemes emerge
          faster than enforcement can adapt &mdash; from pill mills in the 2000s to COVID testing fraud in 2021
          to home health billing schemes today.
        </p>
        <p>
          GAO has issued hundreds of recommendations. CMS has implemented &ldquo;corrective action plans.&rdquo;
          States have upgraded their systems. And the error rate in FY2025 is higher than it was in FY2024.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">What Our Data Shows</h2>
        <p>
          The PERM numbers measure the <em>system&apos;s</em> error rate. Our analysis of 227 million Medicaid billing
          records measures <em>individual provider behavior</em>. The two tell complementary stories.
        </p>
        <p>
          In our data, <strong>0.3% of providers account for 18% of all spending</strong>. The top 1,000 billers
          collected over $265 billion. Some of these are large health systems doing legitimate high-volume work. Others
          show patterns that don&apos;t look like paperwork errors &mdash; billing swings of 500%+ in a single year,
          cost-per-claim ratios 10x the national median, or appearing as a new provider and immediately billing tens
          of millions.
        </p>
        <p>
          These aren&apos;t documentation gaps. They&apos;re behavioral anomalies that the PERM sampling methodology
          isn&apos;t designed to catch.
        </p>
        <ul className="space-y-2">
          <li>
            <Link href="/watchlist" className="text-blue-400 hover:text-blue-300 font-semibold">
              View the watchlist →
            </Link>{" "}
            &mdash; 1,360+ providers flagged by 13 independent statistical tests
          </li>
          <li>
            <Link href="/ml-analysis" className="text-blue-400 hover:text-blue-300 font-semibold">
              ML fraud detection →
            </Link>{" "}
            &mdash; Random forest model trained on OIG-excluded providers, scoring 594K+ providers
          </li>
        </ul>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">The Path Forward</h2>
        <p>
          The traditional approach &mdash; sample claims after the fact, audit paperwork, publish an error rate &mdash;
          has had 23 years to prove itself. The error rate is going up.
        </p>
        <p>
          What would actually work? The technology exists. Machine learning models can flag anomalous billing patterns
          in real time, before payments go out the door. Cross-database matching can catch excluded providers before
          they bill, not after. Behavioral analytics can identify the statistical fingerprints of fraud schemes as
          they emerge, not years later.
        </p>
        <p>
          Some of these tools are being piloted. None are deployed at scale across all state Medicaid programs. The
          barriers aren&apos;t technical &mdash; they&apos;re bureaucratic, political, and financial. States run their
          own Medicaid programs with their own IT systems, and coordinating 50 different implementations of anything
          is slow.
        </p>
        <p>
          Meanwhile, $37.4 billion went out the door improperly last year alone. The year before, it was $31.1 billion.
          The year before that, it was something else. The numbers change. The direction doesn&apos;t.
        </p>
        <p>
          <Link href="/analysis" className="text-blue-400 hover:text-blue-300">
            Read about our methodology →
          </Link>
        </p>

        {/* Methodology note */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-8">
          <div className="text-sm font-semibold text-slate-400 mb-2">Sources &amp; Methodology</div>
          <p className="text-slate-400 text-sm m-0">
            Improper payment figures from the CMS FY2025 Medicaid &amp; CHIP PERM report. MFCU recovery data from the
            HHS-OIG FY2024 annual report. GAO High-Risk List designation from GAO-25-106360 (February 2025). Provider
            analysis based on 227 million Medicaid billing records (2018&ndash;2024) released by HHS. All dollar figures
            are nominal (not inflation-adjusted).
          </p>
        </div>
      </div>

      <div className="mt-16">
        <RelatedInsights currentSlug="improper-payments" relatedSlugs={["minnesota-fraud-capital", "highest-confidence", "banned-but-billing"]} />
      </div>
    </article>
  );
}
