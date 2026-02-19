import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import matchedData from "../../../../public/data/leie-matched.json";
import leieData from "../../../../public/data/leie-data.json";

export const metadata: Metadata = {
  title: "Banned But Still Billing? Excluded Providers Found in Medicaid Data",
  description: "40 healthcare providers appearing in Medicaid billing data are also on the OIG's federal exclusion list. Billing while excluded is a federal offense. Here's what we found.",
  openGraph: {
    title: "Banned But Still Billing? Excluded Providers in Medicaid Data",
    description: "Our analysis found 40 providers in Medicaid billing data who appear on the federal OIG exclusion list. Program-related crimes are the most common reason.",
  },
};

export default function BannedButBilling() {
  const matched = matchedData as any[];
  const totalExcluded = (leieData as any).totalExcluded;

  // Compute breakdowns
  const byReason: Record<string, number> = {};
  const byState: Record<string, number> = {};
  matched.forEach((p) => {
    const reason = p.exclTypeDesc || "Unknown";
    byReason[reason] = (byReason[reason] || 0) + 1;
    const st = p.state || "Unknown";
    byState[st] = (byState[st] || 0) + 1;
  });

  const topReasons = Object.entries(byReason)
    .sort((a, b) => b[1] - a[1]);
  const topStates = Object.entries(byState)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const programCrimesCount = byReason["Convicted of program-related crimes"] || 0;
  const programCrimesPct = Math.round((programCrimesCount / matched.length) * 100);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Banned But Still Billing</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium text-red-400">OIG Exclusion Analysis</span>
          <span className="text-xs text-slate-500">February 19, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">6 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Banned But Still Billing?
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          We cross-referenced {totalExcluded.toLocaleString()} providers on the federal exclusion list with
          Medicaid billing records. 40 excluded providers appear in the data — and billing federal
          healthcare programs while excluded is a federal offense.
        </p>
      </div>

      {/* Key stat callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">{totalExcluded.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Providers on OIG List</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400">40</div>
          <div className="text-xs text-slate-500 mt-1">Found in Billing Data</div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-red-400">{programCrimesPct}%</div>
          <div className="text-xs text-slate-500 mt-1">Program-Related Crimes</div>
        </div>
      </div>

      {/* Article body */}
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">What Is the OIG Exclusion List?</h2>
        <p>
          The Office of Inspector General (OIG) maintains the <strong>List of Excluded Individuals and Entities (LEIE)</strong> —
          a federal database of healthcare providers banned from participating in Medicare, Medicaid, and all other
          federal healthcare programs. When a provider is excluded, no federal healthcare program may pay for any
          items or services furnished, ordered, or prescribed by that individual or entity.
        </p>
        <p>
          Exclusions happen for serious reasons: conviction of program-related crimes (healthcare fraud, patient abuse,
          controlled substance offenses), license revocations, or other actions that demonstrate a provider is unfit
          to participate in federal programs. The consequences are severe — providers who bill while excluded face
          civil monetary penalties of up to $100,000 per item or service, treble damages, and potential criminal prosecution.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">40 Excluded Providers in Medicaid Data</h2>
        <p>
          Our analysis cross-referenced the full OIG exclusion database — {totalExcluded.toLocaleString()} excluded
          individuals and entities — against Medicaid billing records. We found <strong>40 providers</strong> who
          appear in both datasets. These are providers with National Provider Identifiers (NPIs) that match between
          the exclusion list and active Medicaid billing records.
        </p>
        <p>
          This finding warrants careful interpretation. Exclusion dates vary — some providers were excluded years before
          the billing period in our data, while others were excluded more recently. The presence of an excluded provider
          in billing data does not necessarily mean they billed <em>after</em> their exclusion date. However, it does
          mean these cases deserve scrutiny from state Medicaid agencies and federal oversight bodies.
        </p>

        {/* Inline callout */}
        <div className="bg-red-950/40 border border-red-500/20 rounded-xl p-6 my-8">
          <div className="text-sm font-semibold text-red-400 mb-2">⚠️ Key Finding</div>
          <p className="text-slate-300 text-sm m-0">
            Of the 40 matched providers, <strong>{programCrimesCount}</strong> ({programCrimesPct}%) were excluded for
            conviction of program-related crimes — the most serious category, indicating prior fraud, theft, or
            financial crimes against healthcare programs.
          </p>
        </div>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">Why They Were Excluded</h2>
        <p>
          The exclusion reasons paint a concerning picture. The breakdown among our 40 matched providers:
        </p>
        <ul className="space-y-2">
          {topReasons.map(([reason, count]) => (
            <li key={reason}>
              <strong className="text-white">{reason}</strong>: {count} provider{count !== 1 ? "s" : ""}{" "}
              <span className="text-slate-500">({Math.round((count / matched.length) * 100)}%)</span>
            </li>
          ))}
        </ul>
        <p>
          Program-related crimes dominate, which includes healthcare fraud, kickback schemes, and billing for
          services never rendered. License revocations and suspensions are the second most common reason,
          suggesting providers whose state medical boards found them unfit to practice.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">Geographic Concentration</h2>
        <p>
          The 40 excluded providers aren&apos;t evenly distributed. The states with the most matches:
        </p>
        <ul className="space-y-1">
          {topStates.map(([state, count]) => (
            <li key={state}>
              <strong className="text-white">{state}</strong>: {count} provider{count !== 1 ? "s" : ""}
            </li>
          ))}
        </ul>
        <p>
          This geographic clustering may reflect the concentration of Medicaid spending in larger states, but it
          also suggests that certain state Medicaid programs may benefit from more aggressive cross-referencing
          against the federal exclusion list.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">What This Means for Patients</h2>
        <p>
          When an excluded provider continues to bill Medicaid, patients may unknowingly receive care from someone
          the federal government has deemed unfit. In cases where exclusion was due to patient abuse or neglect,
          this creates direct safety concerns. In fraud cases, it means taxpayer dollars continue flowing to
          providers with demonstrated histories of financial crimes.
        </p>
        <p>
          Federal regulations require state Medicaid agencies to check the LEIE before enrolling providers and
          periodically thereafter. The fact that matches exist in the data suggests gaps in this screening process —
          or timing issues where exclusions occurred mid-billing period.
        </p>

        <h2 className="font-headline text-2xl font-bold text-white mt-10 mb-4">Explore the Data</h2>
        <p>
          We&apos;ve made the full dataset available for public transparency:
        </p>
        <ul className="space-y-2">
          <li>
            <Link href="/exclusions/matched" className="text-red-400 hover:text-red-300 font-semibold">
              View all 40 matched providers →
            </Link>{" "}
            — See every excluded provider found in Medicaid billing data, with names, NPIs, exclusion dates, and reasons.
          </li>
          <li>
            <Link href="/exclusions" className="text-blue-400 hover:text-blue-300 font-semibold">
              Browse the full exclusion database →
            </Link>{" "}
            — Search {totalExcluded.toLocaleString()} excluded providers. Check any NPI against the list.
          </li>
        </ul>

        {/* Disclaimer */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 my-8">
          <div className="text-sm font-semibold text-slate-400 mb-2">📋 Methodology Note</div>
          <p className="text-slate-400 text-sm m-0">
            We matched providers by National Provider Identifier (NPI) between the OIG LEIE database (updated January 2026)
            and Medicaid billing records (2018–2024). Exclusion may have occurred before, during, or after the billing period
            captured in our data. This analysis is presented for public transparency and does not constitute an accusation
            of wrongdoing. We encourage readers to examine the data and draw their own conclusions.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <RelatedInsights currentSlug="banned-but-billing" relatedSlugs={["arizona-problem", "highest-confidence", "most-expensive"]} />
      </div>
    </article>
  );
}
