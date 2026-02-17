import Link from "next/link";
import type { Metadata } from "next";
import { formatMoney, formatNumber, getFlagInfo } from "@/lib/format";
import watchlistData from "../../../public/data/expanded-watchlist.json";
import explosiveGrowth from "../../../public/data/fraud-explosive-growth.json";
import instantVolume from "../../../public/data/fraud-instant-volume.json";
import procedureConcentration from "../../../public/data/fraud-procedure-concentration.json";
import billingConsistency from "../../../public/data/fraud-billing-consistency.json";
import beneStuffingExtreme from "../../../public/data/fraud-beneficiary-stuffing-extreme.json";

export const metadata: Metadata = {
  title: "Fraud Analysis \u2014 9 Detection Tests Across 617K Providers",
  description: "How we detect Medicaid fraud: 9 independent statistical tests analyzing billing patterns across 617,000+ providers. 788 providers flagged for investigation. Methodology, results, and OIG cross-reference.",
  openGraph: {
    title: "Fraud Analysis \u2014 Medicaid Money Tracker",
    description: "9 fraud detection tests, 788 flagged providers, $1.09 trillion analyzed. See our methodology and findings.",
  },
};

export default function AnalysisPage() {
  const watchlist = watchlistData as any[];
  const criticalCount = watchlist.filter(w => w.flag_count >= 3).length;
  const highCount = watchlist.filter(w => w.flag_count === 2).length;
  const moderateCount = watchlist.filter(w => w.flag_count === 1).length;

  const tests = [
    {
      id: 'outlier_spending',
      num: 1,
      category: 'Statistical',
      threshold: '3+ standard deviations above mean',
      example: 'A residential care agency billing $15,000/day when median is $300/day',
    },
    {
      id: 'unusual_cost_per_claim',
      num: 2,
      category: 'Statistical',
      threshold: '3x+ the median cost per claim for the same procedure',
      example: 'Chicago EMS billing $1,611 per ambulance trip vs. $163 median nationally',
    },
    {
      id: 'beneficiary_stuffing',
      num: 3,
      category: 'Utilization',
      threshold: 'Claims-per-beneficiary ratio far above peers',
      example: 'Home health agency filing 26 claims per patient when peers average 4',
    },
    {
      id: 'spending_spike',
      num: 4,
      category: 'Temporal',
      threshold: 'Month-over-month increase of 500%+',
      example: 'Provider going from $50K/month to $34.6M/month (692x increase)',
    },
    {
      id: 'explosive_growth',
      num: 5,
      category: 'Temporal',
      threshold: '>500% year-over-year growth',
      example: `${(explosiveGrowth as any[]).length} providers detected, top growth: ${(explosiveGrowth as any[])[0] ? Math.round((explosiveGrowth as any[])[0].growth_pct) + '%' : 'N/A'}`,
      count: (explosiveGrowth as any[]).length,
    },
    {
      id: 'instant_high_volume',
      num: 6,
      category: 'Temporal',
      threshold: 'New provider billing >$1M in first year',
      example: `${(instantVolume as any[]).length} providers detected, highest first-year: ${(instantVolume as any[])[0] ? formatMoney((instantVolume as any[])[0].first_year_payments) : 'N/A'}`,
      count: (instantVolume as any[]).length,
    },
    {
      id: 'procedure_concentration',
      num: 7,
      category: 'Billing Pattern',
      threshold: 'Only 1-2 codes billed at high volume',
      example: `${(procedureConcentration as any[]).length} providers bill billions for just 1-2 codes`,
      count: (procedureConcentration as any[]).length,
    },
    {
      id: 'billing_consistency',
      num: 8,
      category: 'Statistical',
      threshold: 'Coefficient of variation < 0.1 across months',
      example: `${(billingConsistency as any[]).length} providers with almost zero monthly variation`,
      count: (billingConsistency as any[]).length,
    },
    {
      id: 'extreme_beneficiary_stuffing',
      num: 9,
      category: 'Utilization',
      threshold: '>100 claims per beneficiary',
      example: `${(beneStuffingExtreme as any[]).length} providers, highest: ${(beneStuffingExtreme as any[])[0] ? Math.round((beneStuffingExtreme as any[])[0].claims_per_bene) + ' claims/patient' : 'N/A'}`,
      count: (beneStuffingExtreme as any[]).length,
    },
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
          We apply <span className="text-white font-semibold">9 independent statistical tests</span> to the
          entire Medicaid provider dataset. Providers flagged by multiple tests receive higher risk ratings.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Fraud Tests</p>
          <p className="text-2xl font-bold text-white">9</p>
          <p className="text-[10px] text-slate-600">independent analyses</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Providers Flagged</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{watchlist.length}</p>
          <p className="text-[10px] text-slate-600">of 617K+ providers</p>
        </div>
        <div className="bg-dark-800 border border-red-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Critical Risk</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{criticalCount}</p>
          <p className="text-[10px] text-slate-600">3+ flags</p>
        </div>
        <div className="bg-dark-800 border border-amber-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">High Risk</p>
          <p className="text-2xl font-bold text-amber-400 tabular-nums">{highCount}</p>
          <p className="text-[10px] text-slate-600">2 flags</p>
        </div>
        <div className="bg-dark-800 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Moderate Risk</p>
          <p className="text-2xl font-bold text-yellow-400 tabular-nums">{moderateCount}</p>
          <p className="text-[10px] text-slate-600">1 flag</p>
        </div>
      </div>

      {/* OIG Finding */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-amber-400 mb-2">Key Finding: OIG Exclusion List Cross-Reference</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          We cross-referenced all {watchlist.length} flagged providers against the HHS Office of Inspector General&apos;s{" "}
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

      {/* 9 Tests */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6">The 9 Fraud Detection Tests</h2>
        <div className="space-y-3">
          {tests.map((test) => {
            const info = getFlagInfo(test.id);
            return (
              <div key={test.id} className={`border rounded-xl p-5 ${info.bgColor}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${info.bgColor} ${info.color}`}>Test {test.num}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{test.category}</span>
                  {test.count !== undefined && (
                    <span className="text-xs text-slate-400 ml-auto tabular-nums">{test.count} providers</span>
                  )}
                </div>
                <h3 className={`text-base font-bold ${info.color} mb-1`}>{info.label}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-2">{info.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500">
                  <span><strong className="text-slate-300">Threshold:</strong> {test.threshold}</span>
                  <span className="hidden sm:inline text-slate-600">&middot;</span>
                  <span><strong className="text-slate-300">Example:</strong> {test.example}</span>
                </div>
              </div>
            );
          })}
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

      {/* Competitive Context */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-12">
        <h2 className="text-sm font-bold text-white mb-3">How We Compare</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-3">
          Independent analysts applied up to 24 statistical tests to this dataset and identified billions in suspicious billing.
          Our analysis uses 9 well-validated tests &mdash; covering temporal, statistical, utilization, and billing pattern anomalies.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-xs font-bold text-white mb-1">Our Approach</p>
            <p className="text-xs text-slate-500">9 fraud tests, 788 flagged providers, OIG cross-reference, per-provider detail pages</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3 border border-dark-500/30">
            <p className="text-xs font-bold text-white mb-1">What Makes Us Different</p>
            <p className="text-xs text-slate-500">Publicly browsable, per-provider detail pages, state-level analysis, transparent methodology</p>
          </div>
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
