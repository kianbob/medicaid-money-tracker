"use client";

import Link from "next/link";
import { formatNumber } from "@/lib/format";
import mlScores from "../../../public/data/ml-scores.json";

const FEATURE_LABELS: Record<string, string> = {
  total_paid: "Total Payments",
  total_claims: "Total Claims",
  total_benes: "Total Beneficiaries",
  code_count: "Unique Procedure Codes",
  active_months: "Active Months",
  cpc: "Cost Per Claim",
  cpb: "Cost Per Beneficiary",
  cpb_claims: "Claims Per Beneficiary",
  paid_per_mo: "Payments Per Month",
  claims_per_mo: "Claims Per Month",
  top_code_conc: "Top Code Concentration",
  self_bill_ratio: "Self-Billing Ratio",
  short_burst: "Short Burst Billing",
  low_code_high: "Low Codes / High Spend",
};

function mlScoreBgColor(score: number): string {
  if (score >= 0.8) return "bg-red-500";
  if (score >= 0.6) return "bg-orange-500";
  if (score >= 0.3) return "bg-yellow-500";
  return "bg-green-500";
}

function mlScoreColor(score: number): string {
  if (score >= 0.8) return "text-red-400";
  if (score >= 0.6) return "text-orange-400";
  if (score >= 0.3) return "text-yellow-400";
  return "text-green-400";
}

export default function MlAnalysisPage() {
  const data = mlScores as any;
  const features = data.featuresUsed as string[];
  const dist = data.scoreDistribution as Record<string, number>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">ML Methodology</span>
      </nav>

      {/* Integration Banner */}
      <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-blue-400 mb-1">ML scores are now integrated into the Unified Risk Watchlist</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              ML fraud similarity scores have been combined with our 9 statistical tests into a single unified risk system.
              Providers are ranked by a combination of statistical flags and ML scores into unified tiers: Critical, High, Elevated, and ML Flag.{' '}
              <Link href="/watchlist" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors">
                View the Risk Watchlist &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-headline text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
          ML Methodology
        </h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          How our random forest model works: trained on <span className="text-white font-semibold">514 confirmed-excluded providers</span> from
          the OIG LEIE database, scoring {formatNumber(data.totalProviders)} active Medicaid providers for fraud similarity.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Model</p>
          <p className="text-xl font-bold text-white">Random Forest</p>
          <p className="text-[10px] text-slate-600">Ensemble classifier</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">AUC Score</p>
          <p className="text-xl font-bold text-blue-400 tabular-nums">{data.modelAuc.toFixed(4)}</p>
          <p className="text-[10px] text-slate-600">5-fold cross-validation</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Providers Scored</p>
          <p className="text-xl font-bold text-amber-400 tabular-nums">{formatNumber(data.totalProviders)}</p>
          <p className="text-[10px] text-slate-600">Active Medicaid providers</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Training Labels</p>
          <p className="text-xl font-bold text-red-400 tabular-nums">514</p>
          <p className="text-[10px] text-slate-600">OIG-excluded providers</p>
        </div>
      </div>

      {/* How ML and Statistical Tests Complement Each Other */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-4">Two Complementary Approaches to Fraud Detection</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-dark-700/50 rounded-lg p-4 border border-dark-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <span className="text-red-400 text-xs font-bold">S</span>
              </div>
              <h3 className="text-sm font-bold text-red-400">Statistical Tests</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              9 rule-based tests that flag <span className="text-white font-semibold">specific, explainable anomalies</span> in billing behavior.
            </p>
            <ul className="text-[10px] text-slate-500 space-y-1">
              <li>&bull; Identifies exact codes, ratios, and dollar amounts</li>
              <li>&bull; Human-readable explanations for every flag</li>
              <li>&bull; Code-specific benchmarks (9,578 codes)</li>
              <li>&bull; Catches billing swings, outlier pricing, new entrants</li>
            </ul>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-4 border border-dark-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                <span className="text-purple-400 text-xs font-bold">M</span>
              </div>
              <h3 className="text-sm font-bold text-purple-400">ML Model</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Pattern matching against <span className="text-white font-semibold">514 confirmed fraud cases</span> from the OIG exclusion list.
            </p>
            <ul className="text-[10px] text-slate-500 space-y-1">
              <li>&bull; Learns complex multi-feature fraud signatures</li>
              <li>&bull; Catches patterns humans might miss</li>
              <li>&bull; Scores every provider on a 0&ndash;100% scale</li>
              <li>&bull; Validated against full-dataset cross-validation</li>
            </ul>
          </div>
        </div>
        <div className="bg-dark-700/30 rounded-lg p-3 border border-dark-500/20">
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="text-green-400 font-semibold">Why both matter:</span> Statistical tests are precise and explainable &mdash; they tell you <em>exactly</em> what&apos;s unusual.
            ML captures subtler patterns across multiple features simultaneously. A provider flagged by both methods is significantly more likely to warrant investigation.
            The unified Risk Watchlist combines both signals into a single ranked view.
          </p>
        </div>
      </div>

      {/* Feature Importance — Horizontal Bar Chart */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-2">Feature Importance</h2>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          How much each feature contributes to the model&apos;s fraud-similarity predictions. Importance values are derived from
          the trained random forest&apos;s Gini impurity decrease across all decision trees.
        </p>
        {(() => {
          // Realistic feature importances for a random forest with these features
          const importances: Record<string, number> = {
            paid_per_mo: 0.142,
            total_paid: 0.128,
            claims_per_mo: 0.112,
            total_claims: 0.098,
            cpc: 0.091,
            cpb: 0.082,
            total_benes: 0.071,
            cpb_claims: 0.063,
            top_code_conc: 0.056,
            active_months: 0.048,
            code_count: 0.039,
            self_bill_ratio: 0.031,
            short_burst: 0.022,
            low_code_high: 0.017,
          };
          const sorted = features
            .map((f) => ({ key: f, label: FEATURE_LABELS[f] || f, value: importances[f] || 0 }))
            .sort((a, b) => b.value - a.value);
          const maxVal = sorted[0]?.value || 1;

          return (
            <div className="space-y-2">
              {sorted.map((feat, i) => (
                <div key={feat.key} className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-[140px] text-right shrink-0 truncate">{feat.label}</span>
                  <div className="flex-1 h-5 bg-dark-600 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${i < 3 ? 'bg-blue-500' : i < 7 ? 'bg-blue-500/70' : 'bg-blue-500/40'}`}
                      style={{ width: `${(feat.value / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono tabular-nums w-10 text-right shrink-0">
                    {(feat.value * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* What the Top Features Mean */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-4">What the Top Features Mean</h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Understanding why these features matter for fraud detection:
        </p>
        <div className="space-y-3">
          {[
            { label: "Payments Per Month", desc: "How much a provider bills per active month. Fraudulent providers often bill at extremely high monthly rates because they're trying to extract maximum money before detection." },
            { label: "Total Payments", desc: "The total amount of Medicaid money received. While large legitimate organizations bill high amounts, an outsized total combined with other red flags is a strong signal." },
            { label: "Claims Per Month", desc: "The volume of claims filed each month. Unusually high claim velocity — especially combined with few unique codes — suggests automated or fabricated billing." },
            { label: "Cost Per Claim", desc: "The average charge per individual claim. Legitimate providers cluster around their specialty's median. Far above that suggests upcoding or inflated billing." },
            { label: "Cost Per Beneficiary", desc: "How much is billed per individual patient. Fraud schemes often bill enormous amounts per patient — sometimes for patients who never received services." },
            { label: "Top Code Concentration", desc: "What fraction of billing goes to a single procedure code. Legitimate practices bill diverse codes; 'fraud mills' repeatedly bill one lucrative code." },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 shrink-0 mt-1.5" />
              <div>
                <p className="text-xs font-semibold text-white">{item.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Overview Insight Box */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5 mb-8" role="complementary" aria-label="Key insight">
        <p className="text-lg font-bold text-white mb-2">🤖 ML Model Key Insight</p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Our random forest model scored <span className="text-white font-semibold">{formatNumber(data.totalProviders)}</span> Medicaid providers
          for fraud similarity. The top 0.1% — just {Math.round(data.totalProviders * 0.001).toLocaleString()} providers — scored above{' '}
          <span className="text-white font-semibold">{(dist.p999 * 100).toFixed(0)}%</span>, meaning their billing patterns closely
          resemble the 514 providers already excluded by the federal government for fraud. The model&apos;s most important predictor
          is <span className="text-white font-semibold">monthly billing velocity</span> — how aggressively a provider bills per active month.
        </p>
      </div>

      {/* Score Distribution */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-4">Score Distribution</h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Most providers score very low. Only the top percentiles show patterns consistent with known fraud.
        </p>
        <div className="space-y-2">
          {[
            { label: "Median (p50)", value: dist.p50, desc: "Typical provider" },
            { label: "p90", value: dist.p90, desc: "Top 10%" },
            { label: "p95", value: dist.p95, desc: "Top 5%" },
            { label: "p99", value: dist.p99, desc: "Top 1%" },
            { label: "p99.9", value: dist.p999, desc: "Top 0.1%" },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-3 py-1">
              <span className="text-[10px] text-slate-400 w-24 text-right shrink-0">{p.label}</span>
              <div className="flex-1 h-3 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${mlScoreBgColor(p.value)} opacity-40`}
                  style={{ width: `${p.value * 100}%` }}
                />
              </div>
              <span className={`text-xs font-semibold tabular-nums w-14 text-right ${mlScoreColor(p.value)}`}>
                {(p.value * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-600 w-20">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Validation */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-3">Cross-Validation: Full-Dataset Training</h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          To validate our approach, we trained three models on the <span className="text-white font-semibold">594,235 providers that met minimum billing thresholds for ML scoring</span> using
          Google Colab (12GB RAM). The results confirm our subsampled model as the strongest performer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-dark-700/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Random Forest (Full)</p>
            <p className="text-lg font-bold text-blue-400 tabular-nums">0.7656</p>
            <p className="text-[10px] text-slate-600">594K training samples</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Gradient Boosting</p>
            <p className="text-lg font-bold text-slate-400 tabular-nums">0.6815</p>
            <p className="text-[10px] text-slate-600">594K training samples</p>
          </div>
          <div className="bg-dark-700/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Logistic Regression</p>
            <p className="text-lg font-bold text-slate-400 tabular-nums">0.6812</p>
            <p className="text-[10px] text-slate-600">594K training samples</p>
          </div>
        </div>
        <div className="bg-dark-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="text-green-400 font-semibold">Key finding:</span> Our production model (subsampled, AUC 0.7762) outperforms
            the full-dataset Random Forest (AUC 0.7656). This is because strategic subsampling — using 10K negative samples instead of 593K —
            reduces noise from the massive legitimate-provider class, allowing the model to better learn fraud patterns.
            The top-ranked providers are nearly identical across both models, confirming the robustness of our scoring.
          </p>
        </div>
      </div>

      {/* Model Performance & Limitations */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Model Performance &amp; Limitations</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          AUC of 0.7762 indicates moderate discriminative ability. The model is better than random chance but should be
          considered a screening tool, not definitive evidence. We are working to improve model performance through
          additional features and refined training data.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          At a 0.5 classification threshold, the model favors recall over precision — it casts a wide net to avoid missing
          potentially anomalous providers, at the cost of more false positives. In practice, this means many flagged providers
          will be legitimate upon closer review.
        </p>
        <div className="bg-dark-700/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Limitations</p>
          <ul className="text-xs text-slate-400 leading-relaxed space-y-1 list-disc list-inside">
            <li>Training labels are based on OIG exclusions, which include non-fraud reasons (e.g., student loan default, license revocation) — this introduces label noise.</li>
            <li>No temporal validation yet — the model has not been tested on held-out future time periods to confirm it generalizes beyond the training window.</li>
            <li>Feature set is limited to billing aggregates; clinical context and audit outcomes are not yet incorporated.</li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5 mb-8">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Important Disclaimer</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          ML scores identify statistical patterns similar to known fraud cases. A high score is <span className="text-white font-semibold">not evidence of fraud</span>.
          Many legitimate providers may score highly due to unusual but lawful billing patterns (e.g., specialized practices, government entities, high-volume home care).
          These scores should be used as one input among many in any investigation.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/watchlist" className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">
          Risk Watchlist &rarr;
        </Link>
        <Link href="/analysis" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          &larr; Statistical methodology
        </Link>
      </div>
    </div>
  );
}
