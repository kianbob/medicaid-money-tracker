import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber } from "@/lib/format";
import compositeScores from "../../../../public/data/composite-scores.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Multi-Method Detection: Providers Flagged by Multiple Independent Systems — Medicaid",
  description: "246 providers were flagged by 2+ independent detection systems — statistical tests, Benford's Law, billing velocity, and change point detection. When multiple methods agree, false positive probability drops dramatically.",
  openGraph: {
    title: "Highest Confidence Flags: Multi-Method Detection in Medicaid",
    description: "These providers were flagged by multiple independent fraud detection systems. When different approaches all point to the same provider, the probability of a false positive drops dramatically.",
  },
};

function titleCase(s: string): string {
  if (!s) return "";
  if (s === s.toUpperCase() && s.length > 3) {
    return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return s;
}

type ProviderLookup = { name: string; totalPaid?: number; specialty?: string; state?: string; city?: string };

function lookupProvider(npi: string): ProviderLookup {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return {
        name: titleCase(data.name || data.providerName || "") || `NPI: ${npi}`,
        totalPaid: data.totalPaid,
        specialty: data.specialty,
        state: data.state,
        city: titleCase(data.city || ""),
      };
    }
  } catch {}
  return { name: `NPI: ${npi}` };
}

type CompositeProvider = {
  npi: string;
  compositeScore: number;
  components: number;
  hasStatFlags: boolean;
  hasML: boolean;
  hasBenford: boolean;
  hasVelocity: boolean;
  hasChangePoint: boolean;
  hasConcentration: boolean;
};

const providers = (compositeScores as CompositeProvider[]).sort((a, b) => b.compositeScore - a.compositeScore);

const METHOD_BADGES: { key: keyof CompositeProvider; label: string; color: string; bgColor: string }[] = [
  { key: "hasStatFlags", label: "Statistical", color: "text-orange-400", bgColor: "bg-orange-500/15 border-orange-500/30" },
  { key: "hasML", label: "ML Model", color: "text-purple-400", bgColor: "bg-purple-500/15 border-purple-500/30" },
  { key: "hasBenford", label: "Benford's Law", color: "text-indigo-400", bgColor: "bg-indigo-500/15 border-indigo-500/30" },
  { key: "hasVelocity", label: "Velocity", color: "text-cyan-400", bgColor: "bg-cyan-500/15 border-cyan-500/30" },
  { key: "hasChangePoint", label: "Change Point", color: "text-teal-400", bgColor: "bg-teal-500/15 border-teal-500/30" },
  { key: "hasConcentration", label: "Concentration", color: "text-amber-400", bgColor: "bg-amber-500/15 border-amber-500/30" },
];

function getActiveMethodBadges(p: CompositeProvider) {
  return METHOD_BADGES.filter((m) => p[m.key]);
}

export default function HighestConfidence() {
  const topScore = providers[0].compositeScore;
  const threeOrMore = providers.filter((p) => p.components >= 3);

  // Count by method
  const methodCounts = {
    statFlags: providers.filter((p) => p.hasStatFlags).length,
    ml: providers.filter((p) => p.hasML).length,
    benford: providers.filter((p) => p.hasBenford).length,
    velocity: providers.filter((p) => p.hasVelocity).length,
    changePoint: providers.filter((p) => p.hasChangePoint).length,
    concentration: providers.filter((p) => p.hasConcentration).length,
  };

  // Most common combos
  function comboKey(p: CompositeProvider): string {
    const parts: string[] = [];
    if (p.hasStatFlags) parts.push("Statistical");
    if (p.hasML) parts.push("ML");
    if (p.hasBenford) parts.push("Benford");
    if (p.hasVelocity) parts.push("Velocity");
    if (p.hasChangePoint) parts.push("Change Point");
    if (p.hasConcentration) parts.push("Concentration");
    return parts.join(" + ");
  }
  const comboCounts: Record<string, number> = {};
  providers.forEach((p) => {
    const key = comboKey(p);
    comboCounts[key] = (comboCounts[key] || 0) + 1;
  });
  const topCombos = Object.entries(comboCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Total spending from provider lookups
  const top20 = providers.slice(0, 20);
  const top50 = providers.slice(0, 50);

  const top20WithDetails = top20.map((p) => ({
    ...p,
    ...lookupProvider(p.npi),
  }));

  const top50WithDetails = top50.map((p) => ({
    ...p,
    ...lookupProvider(p.npi),
  }));

  const totalSpending = top50WithDetails.reduce((s, p) => s + (p.totalPaid || 0), 0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Highest Confidence</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium text-red-400">Highest Confidence</span>
          <span className="text-xs text-slate-500">February 17, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">6 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Multi-Method Detection: Providers Flagged by Multiple Independent Systems
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          These providers were flagged by <span className="text-white font-semibold">multiple independent detection systems</span> &mdash;
          statistical tests, Benford&apos;s Law, billing velocity analysis, and change point detection.
          When different approaches all point to the same provider, the probability of a false positive drops dramatically.
          This is our highest-confidence list.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-red-400 tabular-nums">{providers.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Multi-method flags</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">{topScore.toFixed(1)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Top composite score</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-orange-400 tabular-nums">{threeOrMore.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Flagged by 3+ methods</p>
        </div>
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 tabular-nums">{formatMoney(totalSpending)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Top 50 spending</p>
        </div>
      </div>

      {/* Why Multi-Method Matters */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-3">Why Multi-Method Detection Matters</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Any single fraud detection method has limitations. Statistical tests can flag legitimate outliers.
          Benford&apos;s Law can misfire on providers with standardized fee schedules.
          Velocity checks may catch providers who genuinely expanded services.
          But when <span className="text-white font-medium">two or three independent methods</span> all flag the same provider,
          something unusual is almost certainly happening.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          If one test has a 10% false positive rate and another independent test also has a 10% false positive rate,
          the chance both would flag the same innocent provider is just 1%. Add a third independent method and the
          probability of a triple false positive drops to 0.1%. This is the power of multi-method detection.
        </p>

        {/* Method Distribution */}
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Detection Methods in This Dataset</h3>
        <div className="space-y-2">
          {[
            { label: "Statistical Tests", count: methodCounts.statFlags, color: "bg-orange-500/60", desc: "Code-specific outlier, billing swing, new entrant, multi-code rate outlier" },
            { label: "Change Point Detection", count: methodCounts.changePoint, color: "bg-teal-500/60", desc: "CUSUM analysis identifies sudden billing behavior shifts" },
            { label: "Billing Velocity", count: methodCounts.velocity, color: "bg-cyan-500/60", desc: "Impossible claim volumes per working day" },
            { label: "Concentration Index", count: methodCounts.concentration, color: "bg-amber-500/60", desc: "Unusual concentration of billing in few codes" },
            { label: "Benford's Law", count: methodCounts.benford, color: "bg-indigo-500/60", desc: "Leading digit distribution deviates from natural patterns" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="text-slate-300 text-xs font-medium w-36 shrink-0">{m.label}</span>
              <div className="flex-1 bg-dark-700/50 rounded-full h-5 overflow-hidden">
                <div
                  className={`${m.color} h-5 rounded-full flex items-center justify-end pr-2`}
                  style={{ width: `${(m.count / providers.length) * 100}%` }}
                >
                  <span className="text-[10px] font-semibold text-white tabular-nums">{m.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 20 Featured */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          Top 20 Highest Composite Scores
        </h2>
        <div className="space-y-3">
          {top20WithDetails.map((p, i) => {
            const badges = getActiveMethodBadges(p);
            return (
              <div key={p.npi} className="bg-dark-800 border border-dark-500/50 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-400 font-bold text-sm">#{i + 1}</span>
                      <Link href={`/providers/${p.npi}`} className="text-white font-bold text-sm hover:text-red-400 transition-colors truncate">
                        {p.name}
                      </Link>
                    </div>
                    <p className="text-xs text-slate-500">
                      NPI: {p.npi}
                      {p.specialty ? ` \u00b7 ${p.specialty}` : ""}
                      {p.city && p.state ? ` \u00b7 ${p.city}, ${p.state}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-red-400 font-extrabold text-xl tabular-nums">{p.compositeScore.toFixed(1)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">composite</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">Methods:</span>
                    <span className="text-white font-bold text-sm tabular-nums">{p.components}</span>
                  </div>
                  {p.totalPaid ? (
                    <span className="text-sm font-semibold text-white tabular-nums">{formatMoney(p.totalPaid)}</span>
                  ) : null}
                </div>

                {/* Method badges */}
                <div className="flex flex-wrap gap-1.5">
                  {badges.map((b) => (
                    <span key={b.key as string} className={`text-[10px] px-2 py-0.5 rounded border ${b.bgColor} ${b.color}`}>
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Common Combos */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Most Common Method Combinations</h2>
        <div className="space-y-3">
          {topCombos.map(([combo, count], i) => (
            <div key={combo} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-600 font-bold text-sm tabular-nums w-5">{i + 1}.</span>
                <span className="text-sm text-slate-300 truncate">{combo}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-24 bg-dark-700/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-500/60 h-2 rounded-full"
                    style={{ width: `${(count / providers.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 font-semibold tabular-nums w-12 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <p className="text-slate-300 leading-relaxed text-[15px]">
          The provider with the highest composite score of <span className="text-white font-semibold">{topScore.toFixed(1)}</span> was flagged
          by {providers[0].components} independent methods simultaneously. Of the {providers.length} multi-method providers,{" "}
          <span className="text-white font-semibold">{threeOrMore.length}</span> were flagged by 3 or more independent systems &mdash;
          these are the cases where the probability of a coincidental false positive is lowest.
        </p>

        <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The Independence Principle</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The key to this approach is that each detection method operates independently. Statistical tests look at
            cost-per-claim ratios. Change point detection analyzes billing trends over time. Benford&apos;s Law examines
            leading digit distributions. Velocity checks count daily claim volume. Because these methods use different
            features and mathematical frameworks, their errors are uncorrelated &mdash; agreement between them is highly
            meaningful.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The most common combination is <span className="text-white font-semibold">{topCombos[0][0]}</span>,
          appearing in {topCombos[0][1]} providers. This makes sense: a provider who bills at unusually high rates
          (caught by statistical tests) and whose billing behavior suddenly shifted (caught by change point detection)
          presents a consistent pattern of anomalous behavior across two different dimensions.
        </p>

        <div className="bg-dark-800 border-l-4 border-amber-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Important Caveat</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Even multi-method flags are not proof of fraud. A provider that legitimately expanded into a new service area
            might trigger both velocity and change point flags. A new clinic growing rapidly could trigger statistical
            outlier and billing swing flags simultaneously. These flags identify the cases most worth investigating &mdash;
            not cases where guilt is established. All providers are presumed innocent until proven otherwise through
            proper investigation.
          </p>
        </div>
      </div>

      {/* Top 50 Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          Top 50 Multi-Method Providers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Score</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-center">Methods</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Detection Flags</th>
              </tr>
            </thead>
            <tbody>
              {top50WithDetails.map((p, i) => {
                const badges = getActiveMethodBadges(p);
                return (
                  <tr key={p.npi} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                    <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                    <td data-label="Provider" className="py-2.5 pr-3">
                      <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-red-400 transition-colors">
                        {p.name}
                      </Link>
                      {p.totalPaid ? (
                        <span className="text-[10px] text-slate-600 ml-2 tabular-nums">{formatMoney(p.totalPaid)}</span>
                      ) : null}
                    </td>
                    <td data-label="Score" className="py-2.5 pr-3 text-right text-red-400 font-semibold tabular-nums">{p.compositeScore.toFixed(1)}</td>
                    <td data-label="Methods" className="py-2.5 pr-3 text-center text-white font-bold tabular-nums">{p.components}</td>
                    <td data-label="Flags" className="py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {badges.map((b) => (
                          <span key={b.key as string} className={`text-[9px] px-1.5 py-0.5 rounded border ${b.bgColor} ${b.color}`}>
                            {b.label}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span><span className="text-red-400 font-semibold">{providers.length} providers</span> were flagged by 2 or more independent detection systems, making them the highest-confidence anomalies in our dataset.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">&#9656;</span>
            <span><span className="text-red-400 font-semibold">{threeOrMore.length} providers</span> were flagged by 3+ methods &mdash; the probability of a triple false positive in independent tests is extremely low.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">&#9656;</span>
            <span>The most common combination is <span className="text-orange-400 font-semibold">{topCombos[0][0]}</span>, found in {topCombos[0][1]} providers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>The top 50 multi-method providers account for <span className="text-amber-400 font-semibold">{formatMoney(totalSpending)}</span> in total Medicaid spending.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>Multi-method flags are the strongest signal available, but they are still screening results &mdash; not verdicts. Each case requires individual review.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("These Medicaid providers were flagged by multiple independent fraud detection systems. When statistical tests, change point detection, and Benford's Law all agree, the probability of a false positive drops dramatically.")}&url=${encodeURIComponent("https://medicaidmoneytracker.com/insights/highest-confidence")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Insights</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link href="/insights/benford-analysis" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Benford&apos;s Law Analysis</p>
            <p className="text-xs text-slate-500 mt-1">200 providers with unnatural digit distributions &rarr;</p>
          </Link>
          <Link href="/insights/impossible-volume" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Impossible Volume</p>
            <p className="text-xs text-slate-500 mt-1">Providers filing 50+ claims per working day &rarr;</p>
          </Link>
          <Link href="/insights/change-points" className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group">
            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Change Point Detection</p>
            <p className="text-xs text-slate-500 mt-1">170 providers whose billing shifted 3x+ overnight &rarr;</p>
          </Link>
        </div>
      </div>
    </article>
  );
}
