import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, getFlagInfo } from "@/lib/format";
import smartWatchlist from "../../../public/data/smart-watchlist.json";
import oldWatchlist from "../../../public/data/expanded-watchlist.json";
import mlScores from "../../../public/data/ml-scores.json";

export const metadata: Metadata = {
  title: "Methodology — How We Detect Medicaid Fraud Across 617K Providers",
  description: "Our fraud detection methodology: 13 statistical tests across 227M claims, code-specific benchmarks, decile distributions, and OIG cross-reference. Transparent limitations and data sources.",
  openGraph: {
    title: "Methodology — Medicaid Money Tracker",
    description: "13 statistical tests, 227M claims, $1.09T analyzed. Code-specific fraud detection methodology, transparent limitations, and complete data source documentation.",
  },
};

export default function AnalysisPage() {
  const smart = smartWatchlist as any[];
  const old = oldWatchlist as any[];

  // Deduplicate statistical flags
  const allNpis = new Set<string>();
  smart.forEach(w => allNpis.add(w.npi));
  old.forEach(w => allNpis.add(w.npi));
  const statFlagged = allNpis.size;

  // Add ML-only providers (mlScore >= 0.5, not already flagged)
  const mlAll = [...((mlScores as any).topProviders || []), ...((mlScores as any).smallProviderFlags || [])];
  let mlOnlyCount = 0;
  for (const p of mlAll) {
    if (p.mlScore >= 0.5 && !allNpis.has(p.npi)) {
      mlOnlyCount++;
      allNpis.add(p.npi);
    }
  }
  const totalFlagged = allNpis.size;

  // Count risk tiers across both watchlists (deduplicated)
  const oldOnly = old.filter(w => !new Set(smart.map((s: any) => s.npi)).has(w.npi));
  const smartCritical = smart.filter(w => (w.flagCount || w.flags?.length || 0) >= 3).length
    + oldOnly.filter((w: any) => (w.flag_count || w.flags?.length || 0) >= 3).length;
  const smartHigh = smart.filter(w => (w.flagCount || w.flags?.length || 0) === 2).length
    + oldOnly.filter((w: any) => (w.flag_count || w.flags?.length || 0) === 2).length;
  const smartModerate = smart.filter(w => (w.flagCount || w.flags?.length || 0) === 1).length
    + oldOnly.filter((w: any) => (w.flag_count || w.flags?.length || 0) === 1).length;

  // Count smart flags
  const smartFlagCounts: Record<string, number> = {};
  for (const w of smart) {
    for (const f of (w.flags || [])) {
      smartFlagCounts[f] = (smartFlagCounts[f] || 0) + 1;
    }
  }

  const testCategories = [
    {
      name: 'Spending Outliers',
      description: 'Identifying providers whose total spending or per-claim costs deviate far from peers.',
      icon: '\u{1F4B0}',
      tests: [
        {
          id: 'outlier_spending',
          category: 'Spending',
          threshold: 'Total payments exceed 3 standard deviations above the mean for all providers',
          catches: 'Providers receiving disproportionately large sums of Medicaid funding relative to the entire provider population.',
          example: 'A single LLC billing $239M when the average provider bills under $2M.',
          count: smartFlagCounts['outlier_spending'] || 0,
        },
        {
          id: 'unusual_cost_per_claim',
          category: 'Spending',
          threshold: 'Average cost per claim exceeds 3\u00d7 the overall median cost per claim',
          catches: 'Providers charging far more per service than peers — potential upcoding, inflated rates, or billing for services not rendered.',
          example: 'A provider averaging $2,400/claim when the median across all providers is $78.',
          count: smartFlagCounts['unusual_cost_per_claim'] || 0,
        },
      ],
    },
    {
      name: 'Volume Anomalies',
      description: 'Detecting impossible or suspicious claim volumes relative to patient counts.',
      icon: '\u{1F4CA}',
      tests: [
        {
          id: 'beneficiary_stuffing',
          category: 'Volume',
          threshold: 'Claims-per-beneficiary ratio significantly exceeds the peer average for that provider type',
          catches: 'Providers filing an excessive number of claims per patient — potential phantom billing or service unbundling.',
          example: 'A behavioral health provider filing 48 claims per patient per month when peers average 4.',
          count: smartFlagCounts['beneficiary_stuffing'] || 0,
        },
        {
          id: 'extreme_beneficiary_stuffing',
          category: 'Volume',
          threshold: 'More than 100 claims filed per beneficiary',
          catches: 'Extreme cases where the claim volume per patient is physically implausible for most service types.',
          example: 'A provider filing 312 claims per beneficiary in a single year — roughly one claim per day including weekends.',
          count: smartFlagCounts['extreme_beneficiary_stuffing'] || 0,
        },
      ],
    },
    {
      name: 'Pattern Analysis',
      description: 'Identifying billing patterns that deviate from natural clinical variation.',
      icon: '\u{1F50D}',
      tests: [
        {
          id: 'procedure_concentration',
          category: 'Pattern',
          threshold: 'Only 1\u20132 unique procedure codes billed despite high total volume (>$1M)',
          catches: 'Providers with extremely narrow service offerings at high volume — potential "mills" focused on a single lucrative code.',
          example: 'A provider billing $47M through a single PCA code (T1019) with zero diversification.',
          count: smartFlagCounts['procedure_concentration'] || 0,
        },
        {
          id: 'billing_consistency',
          category: 'Pattern',
          threshold: 'Coefficient of variation below 0.1 across all active months',
          catches: 'Unnaturally consistent monthly billing — real clinical demand varies seasonally and month-to-month. Near-zero variation suggests automated or manufactured claims.',
          example: 'A provider billing exactly $1.23M every month for 36 consecutive months (CV = 0.02).',
          count: smartFlagCounts['billing_consistency'] || 0,
        },
        {
          id: 'billing_swing',
          category: 'Pattern',
          threshold: 'Year-over-year change exceeding 200% AND absolute change exceeding $1M',
          catches: 'Dramatic billing swings that cannot be explained by gradual growth — potential acquisition of new billing codes, new scheme deployment, or data entry anomalies.',
          example: 'A provider going from $34.6M to $107M in a single year (209% increase).',
          count: smartFlagCounts['billing_swing'] || 0,
        },
      ],
    },
    {
      name: 'Growth Signals',
      description: 'Flagging rapid billing growth that outpaces normal business expansion.',
      icon: '\u{1F4C8}',
      tests: [
        {
          id: 'explosive_growth',
          category: 'Growth',
          threshold: 'Year-over-year billing growth exceeding 500%',
          catches: 'Providers whose billing skyrockets far beyond what organic patient growth could explain.',
          example: 'A provider going from $800K to $5.2M in one year (550% growth).',
          count: smartFlagCounts['explosive_growth'] || 0,
        },
        {
          id: 'instant_high_volume',
          category: 'Growth',
          threshold: 'New provider (first year in dataset) billing over $1M immediately',
          catches: 'Brand-new entities that arrive billing at the level of established organizations — potential shell companies or recycled provider identities.',
          example: 'A newly registered home health agency billing $3.2M in its first 8 months of operation.',
          count: smartFlagCounts['instant_high_volume'] || 0,
        },
        {
          id: 'massive_new_entrant',
          category: 'Growth',
          threshold: 'First appeared in 2022 or later and already billing over $5M total',
          catches: 'Very new entities that have rapidly accumulated large Medicaid payments — especially concerning in fraud-prone categories like home care and behavioral health.',
          example: 'A health home LLC that appeared in September 2022 and has already billed $239M across 28 months.',
          count: smartFlagCounts['massive_new_entrant'] || 0,
        },
      ],
    },
    {
      name: 'Code-Specific Analysis',
      description: 'Comparing each provider\u2019s cost per claim against the national benchmark for that exact procedure code.',
      icon: '\u{1F3AF}',
      tests: [
        {
          id: 'code_specific_outlier',
          category: 'Code-Specific',
          threshold: 'Cost per claim exceeds 3\u00d7 the national MEDIAN for a specific HCPCS code',
          catches: 'Providers charging far above what other providers charge for the exact same service — the strongest signal of potential upcoding or inflated rates.',
          example: 'A provider billing $296/claim for G9005 when the national median is $47 (6.3\u00d7 higher).',
          count: smartFlagCounts['code_specific_outlier'] || 0,
        },
        {
          id: 'rate_outlier_multi_code',
          category: 'Code-Specific',
          threshold: 'Billing above the 90th percentile for 2 or more procedure codes simultaneously',
          catches: 'Providers who are expensive across multiple services — a pattern rather than a one-code anomaly. Much stronger signal than a single outlier.',
          example: 'A provider above p90 for both T2022 ($610/claim vs $203 median) and G0506 ($186/claim vs $7 median).',
          count: smartFlagCounts['rate_outlier_multi_code'] || 0,
        },
      ],
    },
    {
      name: 'Cross-Reference',
      description: 'Checking flagged providers against external federal exclusion databases.',
      icon: '\u{1F50E}',
      tests: [
        {
          id: 'oig_exclusion_check',
          category: 'Cross-Reference',
          threshold: 'NPI appears on the HHS-OIG List of Excluded Individuals and Entities (LEIE)',
          catches: 'Providers already excluded from federal healthcare programs for prior fraud, abuse, or misconduct who may still be receiving Medicaid payments.',
          example: 'Cross-referenced all flagged NPIs against 82,715 excluded providers. Result: zero current matches — our flags surface new, uninvestigated activity.',
          count: 0,
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Methodology</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Methodology</h1>
        <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
          How we analyze <span className="text-white font-semibold">227 million</span> Medicaid billing records
          across <span className="text-white font-semibold">617,503 providers</span> to identify statistical
          anomalies that may indicate fraud, waste, or abuse.
        </p>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* SECTION 1: Our Approach */}
      {/* ───────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sm">1</span>
          Our Approach
        </h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            We start with the complete <strong className="text-white">Medicaid Provider Spending dataset</strong> released
            by HHS on February 13, 2026 — 227 million aggregated billing records spanning 2018 through 2024,
            covering <strong className="text-white">$1.09 trillion</strong> in total payments across 617,503 unique providers
            and 10,881 procedure codes.
          </p>
          <p>
            Rather than relying on a single metric (like total spending), we run <strong className="text-white">13 independent
            statistical tests</strong> organized into six categories. Each test targets a different dimension of billing
            behavior — spending levels, claim volume, temporal patterns, growth trajectories, and code-specific pricing.
          </p>
          <p>
            Our most important innovation is <strong className="text-white">code-specific benchmarking</strong>. Instead of
            comparing a dermatologist&apos;s billing to a dialysis center, we compare each provider&apos;s cost-per-claim
            against the national median <em>for that exact procedure code</em>. We compute full decile distributions
            (p10 through p99) for 9,578 HCPCS codes, placing every provider in a precise percentile range for every
            service they bill.
          </p>
          <p>
            Providers are flagged only when they trip one or more of these tests. Multiple overlapping flags from
            independent tests significantly increase confidence that the anomaly is worth investigating.
          </p>
          <p>
            In addition to these statistical tests, we run a <strong className="text-white">machine learning model</strong> trained
            on 514 OIG-excluded providers to score all 617K providers for fraud similarity. The total count
            of {totalFlagged.toLocaleString()} flagged providers includes both statistically flagged providers ({statFlagged.toLocaleString()})
            and {mlOnlyCount.toLocaleString()} additional providers detected only by the ML model.
          </p>
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* Overview Stats */}
      {/* ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Statistical Tests</p>
          <p className="text-2xl font-bold text-white">13</p>
          <p className="text-[10px] text-slate-600">across 6 categories</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Providers Flagged</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{totalFlagged.toLocaleString()}</p>
          <p className="text-[10px] text-slate-600">statistical + ML-detected</p>
        </div>
        <div className="bg-dark-800 border border-red-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Critical Risk</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{smartCritical}</p>
          <p className="text-[10px] text-slate-600">3+ independent flags</p>
        </div>
        <div className="bg-dark-800 border border-amber-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">High Risk</p>
          <p className="text-2xl font-bold text-amber-400 tabular-nums">{smartHigh}</p>
          <p className="text-[10px] text-slate-600">2 independent flags</p>
        </div>
        <div className="bg-dark-800 border border-blue-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Codes Benchmarked</p>
          <p className="text-2xl font-bold text-blue-400 tabular-nums">9,578</p>
          <p className="text-[10px] text-slate-600">with full decile data</p>
        </div>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* SECTION 2: 13 Statistical Tests */}
      {/* ───────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sm">2</span>
          13 Statistical Tests
        </h2>
        <p className="text-sm text-slate-400 mb-8 max-w-3xl">
          Each test is designed to catch a specific type of anomaly. No single test is sufficient to allege fraud — but
          when multiple independent tests flag the same provider, the probability of a legitimate explanation decreases.
        </p>

        <div className="space-y-10">
          {testCategories.map((cat, catIdx) => {
            const info0 = getFlagInfo(cat.tests[0].id);
            return (
              <div key={cat.name}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{cat.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-500">{cat.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {cat.tests.map((test, testIdx) => {
                    const globalIdx = testCategories.slice(0, catIdx).reduce((sum, c) => sum + c.tests.length, 0) + testIdx + 1;
                    const info = getFlagInfo(test.id);
                    return (
                      <div key={test.id} className={`border rounded-xl p-5 ${info.bgColor}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${info.bgColor} ${info.color}`}>
                            Test {globalIdx}
                          </span>
                          <h4 className={`text-sm font-bold ${info.color}`}>{info.label}</h4>
                          {test.count > 0 && (
                            <span className="text-xs text-slate-500 ml-auto tabular-nums">{test.count} providers flagged</span>
                          )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2.5">
                            <div>
                              <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-1">Threshold</p>
                              <p className="text-slate-300 leading-relaxed">{test.threshold}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-1">What it catches</p>
                              <p className="text-slate-400 leading-relaxed">{test.catches}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-1">Real example from our data</p>
                            <p className="text-slate-300 leading-relaxed bg-dark-800/50 rounded-lg px-3 py-2 border border-dark-500/30">{test.example}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* Decile & Risk Methodology */}
      {/* ───────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sm">3</span>
          Decile Analysis &amp; Risk Levels
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Decile */}
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">National Cost Percentiles</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              For each of 9,578 procedure codes, we compute the full cost-per-claim distribution across all
              providers billing that code. Each provider is then placed in a percentile tier.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg border border-green-500/20 bg-green-500/5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div>
                  <p className="text-xs font-bold text-green-400">Normal Range</p>
                  <p className="text-[10px] text-slate-500">Below 75th percentile — typical pricing for this code</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div>
                  <p className="text-xs font-bold text-yellow-400">Top 25%</p>
                  <p className="text-[10px] text-slate-500">75th\u201390th percentile — above average but within range</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg border border-orange-500/20 bg-orange-500/5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <div>
                  <p className="text-xs font-bold text-orange-400">Top 10%</p>
                  <p className="text-[10px] text-slate-500">90th\u201395th percentile — notably expensive</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg border border-red-500/20 bg-red-500/5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div>
                  <p className="text-xs font-bold text-red-400">Top 5% / Top 1%</p>
                  <p className="text-[10px] text-slate-500">Above 95th or 99th percentile — extreme outlier territory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk levels */}
          <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">Provider Risk Levels</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Risk levels are based on how many independent tests flag a provider. More flags from
              different test categories mean higher confidence the anomaly is real.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-400">CRITICAL</p>
                  <p className="text-xs text-slate-400">3+ independent flags. Highest priority — multiple independent anomalies detected across different test dimensions.</p>
                  <p className="text-[10px] text-slate-600 mt-1">{smartCritical} providers in this tier</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-400">HIGH</p>
                  <p className="text-xs text-slate-400">2 independent flags. Two separate tests independently identified unusual billing behavior.</p>
                  <p className="text-[10px] text-slate-600 mt-1">{smartHigh} providers in this tier</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-yellow-400">MODERATE</p>
                  <p className="text-xs text-slate-400">Single flag. One anomaly detected — may have a legitimate explanation such as specialized services or geographic pricing.</p>
                  <p className="text-[10px] text-slate-600 mt-1">{smartModerate} providers in this tier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* SECTION: What This Is NOT */}
      {/* ───────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-sm text-red-400">!</span>
          What This Is NOT
        </h2>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">This is not an accusation of fraud.</strong> Every provider on our watchlist
              is flagged because their billing patterns are <em>statistically unusual</em> — not because we have evidence
              of wrongdoing. Statistical outliers have explanations that range from data errors to legitimate specialized
              services to actual fraud.
            </p>
            <p>
              <strong className="text-white">This is not a replacement for investigation.</strong> Our analysis identifies
              patterns that warrant a closer look. Actual fraud determination requires claims-level review, medical record
              audits, patient interviews, and legal proceedings — none of which we perform.
            </p>
            <p>
              <strong className="text-white">This is not a comprehensive fraud detection system.</strong> Sophisticated fraud
              schemes (phantom patients, identity fraud, kickback arrangements) may not produce the statistical signatures
              our tests detect. The absence of flags does not indicate a clean provider.
            </p>
            <div className="bg-dark-800/60 rounded-lg p-4 border border-red-500/10 mt-4">
              <p className="text-xs text-slate-400">
                <strong className="text-red-400">Bottom line:</strong> Statistical flags &ne; fraud. Treat every flag as a
                question (&ldquo;Why is this unusual?&rdquo;), not an answer (&ldquo;This is fraud.&rdquo;).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* SECTION: Known Limitations */}
      {/* ───────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sm">4</span>
          Known Limitations
        </h2>
        <p className="text-sm text-slate-400 mb-6 max-w-3xl">
          We believe transparency about limitations strengthens credibility. Here is what our analysis
          can and cannot do.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              title: 'Aggregate data only',
              detail: 'We see provider-level totals, not individual claim lines. We cannot determine whether a specific patient visit was medically necessary or billed correctly.',
              severity: 'high',
            },
            {
              title: 'Government entities appear anomalous',
              detail: 'State agencies, county health departments, and fiscal intermediaries aggregate billing for thousands of individual providers. Their high volumes are often legitimate but look extreme in our analysis.',
              severity: 'high',
            },
            {
              title: 'Per diem codes have different economics',
              detail: 'Codes like T2016 (residential habilitation) cover an entire day of care. High per-diem rates may reflect bundled services for complex patients, not provider markup.',
              severity: 'medium',
            },
            {
              title: 'Specialty drug costs reflect drug pricing',
              detail: 'J-codes (injectable drugs) have legitimately high per-claim costs driven by pharmaceutical pricing, not provider behavior. Billing $10,000/claim for Spinraza is the drug\'s actual cost.',
              severity: 'medium',
            },
            {
              title: 'No web validation or OSINT',
              detail: 'We have not verified provider addresses, corporate registrations, or online presence. Some flagged NPIs may correspond to dissolved entities or incorrect registrations.',
              severity: 'medium',
            },
            {
              title: 'LEIE labels lag actual fraud',
              detail: 'The OIG exclusion list reflects outcomes from investigations that began 1\u20135 years earlier. A provider can be actively committing fraud for years before appearing on the LEIE.',
              severity: 'low',
            },
            {
              title: 'Medicaid only',
              detail: 'T-MSIS captures Medicaid spending only. A provider billing $50M in Medicaid might also bill $200M in Medicare and private insurance — we cannot see that broader picture.',
              severity: 'medium',
            },
            {
              title: 'Self-directed care programs',
              detail: 'Organizations like Public Partnerships LLC are legitimate fiscal management entities for self-directed care. They aggregate billing on behalf of thousands of individual caregivers, so their high totals are by design — though the self-directed care category is fraud-prone.',
              severity: 'high',
            },
          ].map((lim) => (
            <div key={lim.title} className={`rounded-xl p-4 border ${
              lim.severity === 'high' ? 'bg-amber-500/5 border-amber-500/15' :
              lim.severity === 'medium' ? 'bg-dark-800 border-dark-500/50' :
              'bg-dark-800 border-dark-500/30'
            }`}>
              <p className="text-sm font-semibold text-white mb-1.5">{lim.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{lim.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* SECTION: Data Source */}
      {/* ───────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sm">5</span>
          Data Source
        </h2>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-2">CMS T-MSIS Medicaid Provider Spending</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All data comes from the{" "}
                <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" className="text-blue-400 hover:underline font-medium">
                  HHS Open Data Platform
                </a>{" "}
                — the Medicaid Provider Spending dataset released by the HHS DOGE team on February 13, 2026.
                This is derived from the Transformed Medicaid Statistical Information System (T-MSIS), the federal
                data system that collects Medicaid and CHIP data from all 50 states, DC, and territories.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
            {[
              { label: "Total Records", value: "227M" },
              { label: "Total Payments", value: "$1.09T" },
              { label: "Providers", value: "617,503" },
              { label: "Procedure Codes", value: "10,881" },
              { label: "Benchmarked Codes", value: "9,578" },
              { label: "Date Range", value: "2018\u20132024" },
            ].map((item) => (
              <div key={item.label} className="bg-dark-700/50 rounded-lg p-2.5 border border-dark-500/30">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{item.label}</p>
                <p className="text-sm font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-2">Fields available in the dataset</p>
              <div className="space-y-1 text-slate-400">
                <p>NPI (National Provider Identifier)</p>
                <p>Provider name, city, state, specialty</p>
                <p>HCPCS procedure code per row</p>
                <p>Monthly payment amounts and claim counts</p>
                <p>Beneficiary counts per code per month</p>
                <p>Date range of billing activity</p>
              </div>
            </div>
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-2">Fields NOT available (we cannot see)</p>
              <div className="space-y-1 text-slate-400">
                <p>Individual claim-line detail</p>
                <p>Patient diagnosis codes (ICD-10)</p>
                <p>Referring provider information</p>
                <p>Place of service detail</p>
                <p>Claim denial/adjustment history</p>
                <p>Medicare or private insurance billing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* SECTION: How We Compare */}
      {/* ───────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-sm text-purple-400">6</span>
          How We Compare
        </h2>
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-5">
            Most Medicaid fraud analysis is either locked behind academic paywalls, published as static PDFs with
            no interactive exploration, or uses opaque ML models that cannot explain their predictions. We built
            something different.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                title: 'Code-specific benchmarks',
                detail: 'We compare each provider to the median for THAT exact procedure code — not a generic overall average. A provider billing H2017 is compared only to other H2017 billers.',
              },
              {
                title: 'Full decile distributions',
                detail: 'For 9,578 codes we compute p10, p25, p50, p75, p90, p95, and p99 — giving a complete picture of where any provider falls in the national distribution.',
              },
              {
                title: '13 independent tests',
                detail: 'Each test catches a different anomaly type. Multiple overlapping flags from different test categories are far more significant than a single flag.',
              },
              {
                title: 'Interactive exploration',
                detail: '12,800+ pages covering every provider, procedure code, and state — with search, filtering, and drill-down into specific billing codes.',
              },
              {
                title: 'Open and free',
                detail: 'All analysis is publicly accessible at no cost. No paywall, no subscription, no login required. Built from public data for public accountability.',
              },
              {
                title: 'Explainable flags',
                detail: 'Every flag includes a plain-English explanation with specific numbers: which codes, what ratios, how much money. No black-box ML scores.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-dark-800/50 rounded-lg p-4 border border-purple-500/10">
                <p className="text-sm font-semibold text-white mb-1.5">{item.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* OIG Cross-Reference Finding */}
      {/* ───────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-sm font-bold text-amber-400 mb-3">Key Finding: OIG Exclusion List Cross-Reference</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            We cross-referenced all {totalFlagged.toLocaleString()} flagged providers against the HHS Office of Inspector General&apos;s{" "}
            <strong className="text-white">List of Excluded Individuals and Entities (LEIE)</strong> — 82,715 providers
            excluded from federal healthcare programs for fraud, abuse, or misconduct.
          </p>
          <div className="bg-dark-800/60 rounded-lg p-4 border border-amber-500/10">
            <p className="text-amber-400 font-bold text-lg mb-1">Result: Zero matches</p>
            <p className="text-xs text-slate-400">
              None of our flagged providers appear on the current OIG exclusion list. This suggests our analysis
              is surfacing <strong className="text-white">new, uninvestigated activity</strong> rather than
              re-flagging known bad actors.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* CTA */}
      {/* ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/watchlist" className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-all text-sm">
          View Risk Watchlist
        </Link>
        <Link href="/providers" className="bg-dark-700 hover:bg-dark-600 text-white font-medium px-6 py-3 rounded-lg border border-dark-500 transition-all text-sm">
          Browse All Providers
        </Link>
        <Link href="/about" className="bg-dark-700 hover:bg-dark-600 text-white font-medium px-6 py-3 rounded-lg border border-dark-500 transition-all text-sm">
          About This Project
        </Link>
      </div>
    </div>
  );
}
