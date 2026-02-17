import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, getFlagInfo } from "@/lib/format";
import smartWatchlist from "../../../public/data/smart-watchlist.json";
import oldWatchlist from "../../../public/data/expanded-watchlist.json";

export const metadata: Metadata = {
  title: "Fraud Analysis \u2014 Code-Specific Detection Across 617K Providers",
  description: "How we detect Medicaid fraud: code-specific benchmarks comparing each provider's billing against the national median for that exact procedure code. 880+ providers flagged. Methodology, results, and OIG cross-reference.",
  openGraph: {
    title: "Fraud Analysis \u2014 Medicaid Money Tracker",
    description: "Code-specific fraud detection, 880+ flagged providers, $1.09 trillion analyzed. See our methodology and findings.",
  },
};

export default function AnalysisPage() {
  const smart = smartWatchlist as any[];
  const old = oldWatchlist as any[];

  // Deduplicate
  const allNpis = new Set<string>();
  smart.forEach(w => allNpis.add(w.npi));
  old.forEach(w => allNpis.add(w.npi));
  const totalFlagged = allNpis.size;

  const smartCritical = smart.filter(w => (w.flagCount || w.flags?.length || 0) >= 3).length;
  const smartHigh = smart.filter(w => (w.flagCount || w.flags?.length || 0) === 2).length;
  const smartModerate = smart.filter(w => (w.flagCount || w.flags?.length || 0) === 1).length;

  // Count smart flags
  const smartFlagCounts: Record<string, number> = {};
  for (const w of smart) {
    for (const f of (w.flags || [])) {
      smartFlagCounts[f] = (smartFlagCounts[f] || 0) + 1;
    }
  }

  const smartTests = [
    {
      id: 'code_specific_outlier',
      num: 1,
      category: 'Code-Specific',
      threshold: 'Billing >3\u00d7 the national MEDIAN cost/claim for a specific HCPCS code',
      example: 'A provider bills $296/claim for G9005 when the national median is $47 (6.3\u00d7)',
      why: 'Unlike generic "high cost" flags, this compares apples to apples \u2014 each code has its own benchmark.',
      count: smartFlagCounts['code_specific_outlier'] || 0,
    },
    {
      id: 'billing_swing',
      num: 2,
      category: 'Temporal',
      threshold: '>200% year-over-year change AND >$1M absolute change',
      example: 'A provider went from $34.6M to $107M in one year (209% increase)',
      why: 'Requires both percentage AND dollar thresholds to avoid flagging small providers with natural variation.',
      count: smartFlagCounts['billing_swing'] || 0,
    },
    {
      id: 'massive_new_entrant',
      num: 3,
      category: 'Temporal',
      threshold: 'First appeared 2022+ and already billing >$5M total',
      example: 'A health home LLC appeared in Sep 2022 and has already billed $239M',
      why: 'New entities receiving massive Medicaid funding quickly deserve scrutiny, especially in fraud-prone categories.',
      count: smartFlagCounts['massive_new_entrant'] || 0,
    },
    {
      id: 'rate_outlier_multi_code',
      num: 4,
      category: 'Multi-Code',
      threshold: 'Billing above the 90th percentile for 2+ procedure codes simultaneously',
      example: 'A provider is above p90 for both T2022 ($610/claim vs $203 median) and G0506 ($186/claim vs $7 median)',
      why: 'Being expensive for one code could be an anomaly. Being expensive across multiple codes is a pattern.',
      count: smartFlagCounts['rate_outlier_multi_code'] || 0,
    },
  ];

  const legacyTests = [
    { id: 'outlier_spending', num: 5, category: 'Statistical', threshold: '3+ standard deviations above mean total spending' },
    { id: 'unusual_cost_per_claim', num: 6, category: 'Statistical', threshold: '3\u00d7+ overall median cost per claim' },
    { id: 'beneficiary_stuffing', num: 7, category: 'Utilization', threshold: 'Claims-per-beneficiary ratio far above peers' },
    { id: 'spending_spike', num: 8, category: 'Temporal', threshold: 'Month-over-month increase of 500%+' },
    { id: 'explosive_growth', num: 9, category: 'Temporal', threshold: '>500% year-over-year growth' },
    { id: 'instant_high_volume', num: 10, category: 'Temporal', threshold: 'New provider billing >$1M in first year' },
    { id: 'procedure_concentration', num: 11, category: 'Billing Pattern', threshold: 'Only 1-2 codes billed at high volume' },
    { id: 'billing_consistency', num: 12, category: 'Statistical', threshold: 'Coefficient of variation < 0.1 across months' },
    { id: 'extreme_beneficiary_stuffing', num: 13, category: 'Utilization', threshold: '>100 claims per beneficiary' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Fraud Analysis</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Fraud Analysis</h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          Our latest methodology uses <span className="text-white font-semibold">code-specific benchmarks</span> &mdash;
          comparing each provider&apos;s cost per claim against the national median for that exact procedure code,
          not an overall average. This catches providers who are expensive for the services they actually bill.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Fraud Tests</p>
          <p className="text-2xl font-bold text-white">13</p>
          <p className="text-[10px] text-slate-600">4 smart + 9 legacy</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Providers Flagged</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{totalFlagged}</p>
          <p className="text-[10px] text-slate-600">merged watchlist</p>
        </div>
        <div className="bg-dark-800 border border-red-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Critical Risk</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{smartCritical}</p>
          <p className="text-[10px] text-slate-600">3+ flags</p>
        </div>
        <div className="bg-dark-800 border border-amber-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">High Risk</p>
          <p className="text-2xl font-bold text-amber-400 tabular-nums">{smartHigh}</p>
          <p className="text-[10px] text-slate-600">2 flags</p>
        </div>
        <div className="bg-dark-800 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Codes Benchmarked</p>
          <p className="text-2xl font-bold text-blue-400 tabular-nums">9,578</p>
          <p className="text-[10px] text-slate-600">HCPCS codes with decile data</p>
        </div>
      </div>

      {/* Data Source */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-white mb-3">Data Source &amp; Dataset</h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          All data comes from the <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" className="text-blue-400 hover:underline font-medium">HHS Open Data Platform</a> &mdash;
          Medicaid Provider Spending dataset. This is aggregated, provider-level claims data covering every billing
          code from 2018 through 2024, released by the HHS DOGE team on February 13, 2026.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { label: "Records", value: "227M" },
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
      </div>

      {/* How We're Different */}
      <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-purple-400 mb-3">How Our Analysis Is Different</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold shrink-0 mt-0.5">1.</span>
              <p><strong className="text-white">Code-specific benchmarks.</strong> We compare a provider&apos;s cost per claim against the median <em>for that exact procedure code</em>, not a generic overall average. A dermatologist and a dialysis center have different normal costs.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold shrink-0 mt-0.5">2.</span>
              <p><strong className="text-white">13 independent tests.</strong> We run 4 code-specific smart tests and 9 legacy statistical tests. Multiple overlapping flags increase confidence.</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold shrink-0 mt-0.5">3.</span>
              <p><strong className="text-white">National decile distributions.</strong> We compute p10&ndash;p99 for 9,578 codes so providers can be placed in precise percentile ranges, not just &ldquo;above/below average.&rdquo;</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold shrink-0 mt-0.5">4.</span>
              <p><strong className="text-white">OIG cross-reference.</strong> We checked all {totalFlagged} flagged providers against 82,715 excluded providers. Zero matches &mdash; our analysis surfaces new, uninvestigated activity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What Changed */}
      <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-blue-400 mb-3">What Changed: Code-Specific vs. Overall Benchmarks</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-500/30">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Before (Overall Median)</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Compared each provider&apos;s average cost/claim against a single overall median.
              Problem: a dermatologist and a dialysis center have very different normal costs.
            </p>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-4 border border-blue-500/20">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Now (Code-Specific Median)</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              We compute benchmarks for each of 9,578 HCPCS codes separately: median, average, p10&ndash;p99, and standard deviation.
              Then compare each provider&apos;s cost/claim against the benchmark <strong className="text-white">for that exact code</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* OIG Finding */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-amber-400 mb-2">Key Finding: OIG Exclusion List Cross-Reference</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          We cross-referenced all flagged providers against the HHS Office of Inspector General&apos;s{" "}
          <strong className="text-white">List of Excluded Individuals and Entities (LEIE)</strong> &mdash; 82,715 providers
          excluded from federal healthcare programs for fraud, abuse, or misconduct.
        </p>
        <div className="bg-dark-800/60 rounded-lg p-4 mt-3 border border-amber-500/10">
          <p className="text-amber-400 font-bold text-lg mb-1">Result: Zero matches</p>
          <p className="text-xs text-slate-400">
            Our analysis may be surfacing <strong className="text-white">new suspicious activity</strong> that has not yet been investigated.
          </p>
        </div>
      </div>

      {/* Smart Tests (Primary) */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-2">Smart Fraud Tests (Code-Specific)</h2>
        <p className="text-sm text-slate-400 mb-6">These 4 tests use per-code national benchmarks and form our primary watchlist.</p>
        <div className="space-y-3">
          {smartTests.map((test) => {
            const info = getFlagInfo(test.id);
            return (
              <div key={test.id} className={`border rounded-xl p-5 ${info.bgColor}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${info.bgColor} ${info.color}`}>Test {test.num}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{test.category}</span>
                  <span className="text-xs text-slate-400 ml-auto tabular-nums">{test.count} providers</span>
                </div>
                <h3 className={`text-base font-bold ${info.color} mb-1`}>{info.label}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-2">{info.description}</p>
                <div className="space-y-1 text-xs text-slate-500">
                  <p><strong className="text-slate-300">Threshold:</strong> {test.threshold}</p>
                  <p><strong className="text-slate-300">Example:</strong> {test.example}</p>
                  <p><strong className="text-slate-300">Why this works:</strong> {test.why}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legacy Tests */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-2">Legacy Fraud Tests</h2>
        <p className="text-sm text-slate-400 mb-6">These 9 additional tests from our earlier analysis are still applied. Providers flagged by these tests remain on the combined watchlist.</p>
        <div className="space-y-2">
          {legacyTests.map((test) => {
            const info = getFlagInfo(test.id);
            return (
              <div key={test.id} className="border border-dark-500/50 rounded-lg p-4 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-600 w-8 shrink-0">#{test.num}</span>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${info.color}`}>{info.label}</p>
                  <p className="text-xs text-slate-500">{test.threshold}</p>
                </div>
                <span className="text-xs text-slate-600 uppercase">{test.category}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decile Analysis */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-white mb-3">Decile Analysis</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          For each of 9,578 procedure codes, we compute national decile breakdowns (p10, p25, p50, p75, p90, p95, p99).
          Each provider&apos;s cost-per-claim is placed in a decile relative to all providers billing that code.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg border border-green-500/20 bg-green-500/5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <p className="text-xs font-bold text-green-400">Normal Range</p>
              <p className="text-[10px] text-slate-500">Below 75th percentile</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div>
              <p className="text-xs font-bold text-yellow-400">Top 25%</p>
              <p className="text-[10px] text-slate-500">75th&ndash;90th percentile</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg border border-orange-500/20 bg-orange-500/5">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <div>
              <p className="text-xs font-bold text-orange-400">Top 10%</p>
              <p className="text-[10px] text-slate-500">90th&ndash;95th percentile</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg border border-red-500/20 bg-red-500/5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div>
              <p className="text-xs font-bold text-red-400">Top 5% / Top 1%</p>
              <p className="text-[10px] text-slate-500">Above 95th percentile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Methodology */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-white mb-4">Risk Level Methodology</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div>
              <p className="text-sm font-bold text-red-400">CRITICAL</p>
              <p className="text-xs text-slate-500">3 or more flags &mdash; highest priority for investigation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div>
              <p className="text-sm font-bold text-amber-400">HIGH</p>
              <p className="text-xs text-slate-500">2 flags &mdash; multiple independent anomalies detected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div>
              <p className="text-sm font-bold text-yellow-400">MODERATE</p>
              <p className="text-xs text-slate-500">1 flag &mdash; single anomaly, may have legitimate explanation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Caveats */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-white mb-3">Important Caveats</h2>
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <p>
            <strong className="text-white">Statistical flags are not proof of fraud.</strong> These are anomalies that warrant investigation.
            Many flagged providers may have legitimate reasons for high billing.
          </p>
          <p>
            <strong className="text-white">Government entities</strong> (state agencies, county health departments, cities) often serve as fiscal agents
            for large populations and legitimately bill at high volumes.
          </p>
          <p>
            <strong className="text-white">Home care management programs</strong> like Public Partnerships LLC and Consumer Direct are
            legitimate fiscal management organizations for self-directed care programs. They manage billing on behalf of thousands of
            individual caregivers, so their aggregate billing is high by design. However, the self-directed care category is fraud-prone.
          </p>
          <p>
            <strong className="text-white">Per diem codes</strong> (like T2016 for residential habilitation) cover an entire day of care.
            High per-diem rates may reflect bundled services for complex patients. Dividing by ~30 days brings some high values closer to
            expected daily rates.
          </p>
          <p>
            <strong className="text-white">Specialty drugs</strong> (J-codes) have legitimately high costs per claim due to drug prices,
            not provider markup.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/watchlist" className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-all text-sm">
          View Full Watchlist
        </Link>
        <Link href="/about" className="bg-dark-700 hover:bg-dark-600 text-white font-medium px-6 py-3 rounded-lg border border-dark-500 transition-all text-sm">
          Read Full Methodology
        </Link>
      </div>
    </div>
  );
}
