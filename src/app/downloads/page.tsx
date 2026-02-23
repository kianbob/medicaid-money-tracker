import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Medicaid Data Downloads (JSON)",
  description:
    "Download 880 flagged providers, ML fraud scores, 10K+ procedure benchmarks, and 50-state summaries free. Built from 227M billing records.",
  openGraph: {
    title: "Free Medicaid Data Downloads (JSON)",
    description:
      "Download 880 flagged providers, ML fraud scores, 10K+ procedure benchmarks, and 50-state summaries free. Built from 227M billing records.",
  },
};

interface DatasetCard {
  title: string;
  description: string;
  file: string;
  fileSize: string;
  recordCount: string;
  color: string;
}

const datasets: DatasetCard[] = [
  {
    title: "Risk Watchlist (Statistical)",
    description:
      "880 providers flagged by 4 code-specific fraud detection tests. Includes flag types, flag details with specific codes and ratios, provider demographics, and total spending.",
    file: "/data/smart-watchlist.json",
    fileSize: "682 KB",
    recordCount: "880 providers",
    color: "red",
  },
  {
    title: "Risk Watchlist (Legacy)",
    description:
      "788 providers flagged by 9 legacy fraud detection tests including outlier spending, explosive growth, beneficiary stuffing, and billing consistency anomalies.",
    file: "/data/expanded-watchlist.json",
    fileSize: "356 KB",
    recordCount: "788 providers",
    color: "orange",
  },
  {
    title: "ML Fraud Scores",
    description:
      "Machine learning fraud similarity scores for top providers. Random Forest model trained on 514 OIG-excluded providers. Includes feature values like cost per claim, code concentration, and self-billing ratio.",
    file: "/data/ml-scores.json",
    fileSize: "235 KB",
    recordCount: "700 scored providers",
    color: "purple",
  },
  {
    title: "Top 1,000 Providers",
    description:
      "The 1,000 highest-spending Medicaid providers ranked by total payments. Includes NPI, name, specialty, city, state, total paid, claims, beneficiaries, and flag counts.",
    file: "/data/top-providers-1000.json",
    fileSize: "265 KB",
    recordCount: "1,000 providers",
    color: "blue",
  },
  {
    title: "State Summaries",
    description:
      "Aggregated Medicaid spending data for all 50 states. Includes total payments, claims, beneficiaries, provider counts, and top procedures by state.",
    file: "/data/states-summary.json",
    fileSize: "6 KB",
    recordCount: "50 states",
    color: "green",
  },
  {
    title: "Procedure Codes",
    description:
      "All 10,881 HCPCS procedure codes billed to Medicaid with total payments, claim counts, provider counts, and average cost per claim.",
    file: "/data/all-procedures.json",
    fileSize: "1.1 MB",
    recordCount: "10,881 codes",
    color: "cyan",
  },
  {
    title: "Code Benchmarks",
    description:
      "National cost-per-claim benchmarks for 9,578 procedure codes. Includes average, median, standard deviation, and percentile distributions (p10 through p99).",
    file: "/data/code-benchmarks.json",
    fileSize: "2.7 MB",
    recordCount: "9,578 codes",
    color: "yellow",
  },
  {
    title: "Yearly Trends",
    description:
      "Annual Medicaid spending totals from 2018 to 2024. Includes total payments, claims, beneficiaries, and provider counts per year.",
    file: "/data/yearly-trends.json",
    fileSize: "1 KB",
    recordCount: "7 years",
    color: "slate",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  red: { border: "border-red-500/30", bg: "bg-red-500/10", text: "text-red-400", icon: "bg-red-500/20" },
  orange: { border: "border-orange-500/30", bg: "bg-orange-500/10", text: "text-orange-400", icon: "bg-orange-500/20" },
  purple: { border: "border-purple-500/30", bg: "bg-purple-500/10", text: "text-purple-400", icon: "bg-purple-500/20" },
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-400", icon: "bg-blue-500/20" },
  green: { border: "border-green-500/30", bg: "bg-green-500/10", text: "text-green-400", icon: "bg-green-500/20" },
  cyan: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", icon: "bg-cyan-500/20" },
  yellow: { border: "border-yellow-500/30", bg: "bg-yellow-500/10", text: "text-yellow-400", icon: "bg-yellow-500/20" },
  slate: { border: "border-slate-500/30", bg: "bg-slate-500/10", text: "text-slate-400", icon: "bg-slate-500/20" },
};

export default function DownloadsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">Downloads</span>
      </nav>

      <h1 className="font-headline text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
        Download Data
      </h1>
      <p className="text-sm text-slate-400 mb-8 max-w-2xl">
        All datasets are derived from{" "}
        <a
          href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/"
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          HHS Open Data
        </a>{" "}
        (227 million Medicaid billing records, 2018&ndash;2024). Files are in JSON format and can be opened with any text editor, Python, R, or data analysis tool.
      </p>

      {/* Unified Risk Card */}
      <div className="bg-dark-800 border border-amber-500/30 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.007H12v-.007z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">Unified Risk Watchlist</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Combine both datasets below to build a unified view of all flagged providers. The statistical watchlist
              contains 880 providers flagged by code-specific billing tests, while the ML scores file contains
              fraud-similarity scores from a model trained on 514 confirmed fraud cases. Join on the <code className="text-amber-400/80 text-[11px]">npi</code> field
              to merge statistical flags with ML scores for a complete risk picture.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <a href="/data/smart-watchlist.json" download className="flex items-center justify-between bg-red-500/8 border border-red-500/20 rounded-lg px-4 py-3 hover:bg-red-500/15 transition-colors group">
            <div>
              <p className="text-xs font-semibold text-red-400">Statistical Watchlist</p>
              <p className="text-[10px] text-slate-500 mt-0.5">880 providers &middot; 682 KB &middot; JSON</p>
            </div>
            <svg className="w-4 h-4 text-red-400 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <a href="/data/ml-scores.json" download className="flex items-center justify-between bg-purple-500/8 border border-purple-500/20 rounded-lg px-4 py-3 hover:bg-purple-500/15 transition-colors group">
            <div>
              <p className="text-xs font-semibold text-purple-400">ML Fraud Scores</p>
              <p className="text-[10px] text-slate-500 mt-0.5">700 scored providers &middot; 235 KB &middot; JSON</p>
            </div>
            <svg className="w-4 h-4 text-purple-400 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      </div>

      {/* Dataset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {datasets.map((ds) => {
          const c = colorMap[ds.color];
          return (
            <div
              key={ds.file}
              className={`bg-dark-800 border ${c.border} rounded-xl p-5 flex flex-col`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.icon} flex items-center justify-center shrink-0`}>
                  <svg className={`w-5 h-5 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white">{ds.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ds.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-auto pt-3 border-t border-dark-600/50">
                <span className="text-[10px] text-slate-500">
                  {ds.fileSize} &middot; {ds.recordCount}
                </span>
                <span className="text-[10px] text-slate-600">JSON</span>
                <a
                  href={ds.file}
                  download
                  className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${c.bg} ${c.text} border ${c.border} hover:opacity-80 transition-opacity`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Usage section */}
      <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-bold text-white mb-4">Data Usage &amp; Citation</h2>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            This data is derived from publicly available{" "}
            <a
              href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/"
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              U.S. Department of Health &amp; Human Services Medicaid provider spending records
            </a>
            . The underlying data is in the public domain. Our analysis, risk scores, and derived datasets may be freely used with attribution.
          </p>
          <p>
            <strong className="text-white">Suggested citation:</strong>{" "}
            OpenMedicaid by TheDataProject.ai. Analysis of HHS Medicaid Provider Spending data (2018&ndash;2024). Available at openmedicaid.org.
          </p>
          <p>
            <strong className="text-white">Important caveats:</strong>{" "}
            Statistical flags and ML scores indicate unusual billing patterns worth investigating &mdash; they are <strong className="text-white">not</strong> proof of fraud or wrongdoing. Government entities, home care programs, hospitals, and large care organizations may legitimately bill at high rates. See our{" "}
            <Link href="/analysis" className="text-blue-400 hover:underline">
              methodology page
            </Link>{" "}
            for details on how flags are calculated.
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/analysis" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          Methodology &rarr;
        </Link>
        <Link href="/about" className="text-slate-400 hover:text-slate-300 text-xs font-medium transition-colors">
          About this project &rarr;
        </Link>
      </div>
    </div>
  );
}
