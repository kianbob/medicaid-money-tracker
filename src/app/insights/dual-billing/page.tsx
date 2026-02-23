import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, formatNumber, hcpcsDescription } from "@/lib/format";
import RelatedInsights from "@/components/RelatedInsights";
import dualData from "../../../../public/data/dual-billing.json";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "82,639 vs 82,963 Claims — The Dual-Billing Pattern",
  description: "When two procedure codes have a 0.4% claim count difference across 82K+ services, every encounter is billed twice. We found dozens of matches worth billions.",
  openGraph: {
    title: "82,639 vs 82,963 Claims — The Dual-Billing Pattern",
    description: "Two codes, 0.4% difference, $958M in combined billing. When claim counts match this perfectly, something is wrong.",
  },
};

function titleCase(s: string): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function lookupName(npi: string, fallbackName: string): string {
  if (fallbackName) return titleCase(fallbackName);
  try {
    const filePath = path.join(process.cwd(), "public", "data", "providers", `${npi}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return titleCase(data.name || data.providerName || "") || `NPI: ${npi}`;
  } catch {
    return `NPI: ${npi}`;
  }
}

function codeLabel(code: string): string {
  const desc = hcpcsDescription(code);
  return desc ? `${code} — ${desc}` : code;
}

const pairs = dualData as any[];
const topPair = pairs[0];

export default function DualBilling() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Dual-Billing Pattern</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 text-xs font-medium text-orange-400">Original Analysis</span>
          <span className="text-xs text-slate-500">February 16, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">5 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          When Two Codes Have the Same Number of Claims, Something May Be Wrong
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          When a provider bills two different procedure codes with nearly identical claim counts across
          tens of thousands of services, it suggests every single encounter is being billed twice &mdash;
          once under each code.
        </p>
      </div>

      {/* Featured Example */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/providers/${topPair.npi}`} className="text-white font-bold hover:text-orange-400 transition-colors">
            {lookupName(topPair.npi, topPair.name)}
          </Link>
          <span className="text-xs text-slate-500">NPI: {topPair.npi}</span>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-dark-700/50 rounded-xl p-4 border border-dark-500/30">
            <p className="text-xs text-slate-500 mb-1">Code 1</p>
            <p className="text-white font-bold text-sm mb-2">{topPair.code1}</p>
            <p className="text-[11px] text-slate-500 mb-3">{hcpcsDescription(topPair.code1) || "Habilitation waiver service"}</p>
            <p className="text-2xl font-extrabold text-orange-400 tabular-nums">{topPair.claims1.toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mt-1">claims</p>
            <p className="text-sm text-slate-400 mt-2 tabular-nums">{formatMoney(topPair.paid1)}</p>
          </div>
          <div className="bg-dark-700/50 rounded-xl p-4 border border-dark-500/30">
            <p className="text-xs text-slate-500 mb-1">Code 2</p>
            <p className="text-white font-bold text-sm mb-2">{topPair.code2}</p>
            <p className="text-[11px] text-slate-500 mb-3">{hcpcsDescription(topPair.code2) || "Community transition waiver"}</p>
            <p className="text-2xl font-extrabold text-orange-400 tabular-nums">{topPair.claims2.toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mt-1">claims</p>
            <p className="text-sm text-slate-400 mt-2 tabular-nums">{formatMoney(topPair.paid2)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-dark-700/30 rounded-lg p-3">
          <div>
            <span className="text-xs text-slate-500">Claim count difference</span>
            <span className="text-orange-400 font-bold text-sm ml-2">{topPair.claimDiffPct}%</span>
          </div>
          <div>
            <span className="text-xs text-slate-500">Combined spending</span>
            <span className="text-white font-bold text-sm ml-2">{formatMoney(topPair.combinedPaid)}</span>
          </div>
        </div>
      </div>

      {/* Visual: Top 5 pairs with bar comparison */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          The Closest Matches
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          These providers have the lowest percentage difference between claim counts for two different procedure codes.
          A 0.01% difference across 800,000+ claims is statistically extraordinary.
        </p>
        <div className="space-y-4">
          {pairs
            .sort((a: any, b: any) => a.claimDiffPct - b.claimDiffPct)
            .slice(0, 8)
            .map((p: any, i: number) => {
              const maxClaims = Math.max(p.claims1, p.claims2);
              const w1 = (p.claims1 / maxClaims) * 100;
              const w2 = (p.claims2 / maxClaims) * 100;
              return (
                <div key={`${p.npi}-${p.code1}-${p.code2}`} className="bg-dark-800 border border-dark-500/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Link href={`/providers/${p.npi}`} className="text-sm text-white font-semibold hover:text-orange-400 transition-colors truncate">
                      {lookupName(p.npi, p.name)}
                    </Link>
                    <span className="text-xs text-orange-400 font-bold ml-2 whitespace-nowrap">{p.claimDiffPct}% diff</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 w-14 shrink-0 font-mono">{p.code1}</span>
                      <div className="flex-1 h-5 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500/60 to-orange-500/30 rounded-full" style={{ width: `${w1}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 tabular-nums w-20 text-right">{formatNumber(p.claims1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 w-14 shrink-0 font-mono">{p.code2}</span>
                      <div className="flex-1 h-5 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500/60 to-amber-500/30 rounded-full" style={{ width: `${w2}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 tabular-nums w-20 text-right">{formatNumber(p.claims2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Combined: {formatMoney(p.combinedPaid)}</p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Narrative */}
      <div className="prose prose-invert max-w-none mb-12 space-y-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 !mb-4">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          What Is Dual-Billing?
        </h2>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Dual-billing occurs when a provider systematically bills two procedure codes for the same service encounter.
          In legitimate medicine, some services do naturally pair together &mdash; a residential care per-diem (T2016)
          might always include a community transition service (T2023). But when the claim counts for two codes match
          within 0.4% across <em>82,000+ claims</em>, it indicates that virtually every single encounter generates two bills.
        </p>

        <div className="bg-dark-800 border-l-4 border-orange-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">The NEMT Connection</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            This exact pattern was documented in confirmed NEMT (Non-Emergency Medical Transportation) fraud cases.
            In the Pedro Denga case, investigators found near-equal claim counts for A0130 (wheelchair van) and A0380
            (mileage), indicating every single trip was billed for both vehicle dispatch <em>and</em> mileage &mdash;
            a common fraud scheme in transportation billing.
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          The data shows this pattern at massive scale. <span className="text-white font-semibold">County of Riverside</span> bills
          H0034 (targeted case management) and T1017 (case management, 15 min) with 865,462 vs 865,575 claims &mdash;
          a <span className="text-orange-400 font-semibold">0.01% difference</span> across nearly a million claims, totaling {formatMoney(370172394.13)}.
        </p>

        <p className="text-slate-300 leading-relaxed text-[15px]">
          Lab companies show particularly striking patterns. <span className="text-white font-semibold">Laboratory Corporation of America</span> appears
          multiple times, billing STI test codes 87491 and 87591 with near-identical counts (3.98M vs 3.97M, 0.26% difference).
          This is more likely legitimate &mdash; chlamydia and gonorrhea tests are typically ordered together &mdash;
          but it shows how the pattern can appear in both suspicious and routine contexts.
        </p>

        <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-xl p-5">
          <p className="text-white font-semibold mb-1">Context matters</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Some dual-billing is legitimate &mdash; a provider may always perform two services together, or a lab may always
            run two tests as a panel. But when claim counts match within 1-3% across hundreds of thousands of claims
            worth hundreds of millions of dollars, it suggests systematic pairing that deserves scrutiny &mdash; especially
            when the two codes represent conceptually different services.
          </p>
        </div>
      </div>

      {/* Full Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          Top Dual-Billing Pairs by Combined Spending
        </h2>
        <div className="table-wrapper">
          <table className="w-full text-sm responsive-table">
            <thead>
              <tr className="border-b border-dark-500 text-left">
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold w-8">#</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Provider</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Code 1</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims 1</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Code 2</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Claims 2</th>
                <th className="py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Diff</th>
                <th className="py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-right">Combined $</th>
              </tr>
            </thead>
            <tbody>
              {pairs.slice(0, 60).map((p: any, i: number) => (
                <tr key={`${p.npi}-${p.code1}-${p.code2}-${i}`} className="border-b border-dark-600/30 hover:bg-dark-700/50 transition-colors">
                  <td data-label="Rank" className="py-2.5 pr-3 text-slate-600 tabular-nums">{i + 1}</td>
                  <td data-label="Provider" className="py-2.5 pr-3">
                    <Link href={`/providers/${p.npi}`} className="text-slate-300 hover:text-orange-400 transition-colors">
                      {lookupName(p.npi, p.name)}
                    </Link>
                  </td>
                  <td data-label="Code 1" className="py-2.5 pr-3 text-slate-400 font-mono text-xs">{p.code1}</td>
                  <td data-label="Claims 1" className="py-2.5 pr-3 text-right text-slate-300 tabular-nums">{formatNumber(p.claims1)}</td>
                  <td data-label="Code 2" className="py-2.5 pr-3 text-slate-400 font-mono text-xs">{p.code2}</td>
                  <td data-label="Claims 2" className="py-2.5 pr-3 text-right text-slate-300 tabular-nums">{formatNumber(p.claims2)}</td>
                  <td data-label="Diff" className="py-2.5 pr-3 text-right text-orange-400 font-semibold tabular-nums">{p.claimDiffPct}%</td>
                  <td data-label="Combined" className="py-2.5 text-right text-white font-semibold tabular-nums">{formatMoney(p.combinedPaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">Key Takeaways</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">&#9656;</span>
            <span>The top dual-billing pair bills {topPair.code1} and {topPair.code2} with a <span className="text-orange-400 font-semibold">{topPair.claimDiffPct}%</span> difference across {formatNumber(topPair.claims1)} claims, worth <span className="text-white font-semibold">{formatMoney(topPair.combinedPaid)}</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">&#9656;</span>
            <span>Some matches as close as <span className="text-orange-400 font-semibold">0.01%</span> across hundreds of thousands of claims &mdash; meaning virtually every encounter generates exactly two bills.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">&#9656;</span>
            <span>Lab companies (LabCorp) show legitimate dual-billing from paired tests, but home care and behavioral health providers show patterns that merit investigation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">&#9656;</span>
            <span>This pattern has been documented in confirmed NEMT fraud cases, where every trip generated matched ambulance and mileage claims.</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-500/50 pt-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-slate-500">Source: HHS T-MSIS Other Services File (2018&ndash;2024) &middot; 227M records</p>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("When two procedure codes have nearly identical claim counts across 80,000+ services, every encounter is being billed twice. See the data.")}&url=${encodeURIComponent("https://openmedicaid.org/insights/dual-billing")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Share on X</a>
          </div>
        </div>
        <RelatedInsights currentSlug="dual-billing" relatedSlugs={["billing-networks", "self-billers", "billing-similarity"]} />
      </div>
    </article>
  );
}
