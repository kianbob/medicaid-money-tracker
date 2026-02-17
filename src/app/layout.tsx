import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GlobalSearch from "@/components/GlobalSearch";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-headline" });

export const metadata: Metadata = {
  title: {
    default: "Medicaid Money Tracker \u2014 Follow the Money",
    template: "%s \u2014 Medicaid Money Tracker",
  },
  description: "Track $1.09 trillion in Medicaid provider spending across 617,000+ providers and 10,881 procedure codes. 1,860+ providers flagged by 13 fraud detection tests and ML analysis. Built from 227 million HHS records (2018\u20132024).",
  metadataBase: new URL("https://medicaidmoneytracker.com"),
  openGraph: {
    title: "Medicaid Money Tracker \u2014 $1.09 Trillion in Spending, Exposed",
    description: "We analyzed 227 million Medicaid billing records and flagged 1,860+ providers using 13 fraud detection tests and ML analysis. See where your healthcare tax dollars go.",
    type: "website",
    siteName: "Medicaid Money Tracker",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medicaid Money Tracker \u2014 $1.09T in Spending, Exposed",
    description: "227M Medicaid billing records. 1,860+ providers flagged via 13 fraud detection tests and ML analysis. See where your healthcare tax dollars go.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Medicaid Money Tracker",
              "url": "https://medicaidmoneytracker.com",
              "description": "Track $1.09 trillion in Medicaid provider spending across 617,000+ providers. 1,860+ providers flagged by 13 fraud detection tests and ML analysis.",
              "publisher": {
                "@type": "Organization",
                "name": "TheDataProject.ai",
                "url": "https://thedataproject.ai"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dataset",
              "name": "Medicaid Provider Spending Analysis (2018\u20132024)",
              "description": "Analysis of 227 million Medicaid billing records covering $1.09 trillion in payments across 617,503 providers and 10,881 procedure codes. 13 fraud detection tests and ML analysis flagging 1,860+ providers.",
              "url": "https://medicaidmoneytracker.com",
              "license": "https://creativecommons.org/publicdomain/zero/1.0/",
              "isBasedOn": {
                "@type": "Dataset",
                "name": "HHS Medicaid Provider Spending",
                "url": "https://opendata.hhs.gov/datasets/medicaid-provider-spending/",
                "creator": {
                  "@type": "Organization",
                  "name": "U.S. Department of Health and Human Services"
                }
              },
              "temporalCoverage": "2018-01/2024-12",
              "variableMeasured": ["Total Payments", "Claims Count", "Beneficiaries", "Provider Count", "Procedure Codes"]
            })
          }}
        />
      </head>
      <body className={`${inter.className} ${playfair.variable} bg-dark-900 text-slate-200 min-h-screen`}>
        {/* Disclaimer Banner */}
        <div className="bg-slate-800/50 text-center py-1.5 px-4">
          <p className="text-[11px] text-slate-500">
            Statistical flags indicate unusual patterns — not proof of fraud or wrongdoing.{" "}
            <Link href="/analysis" className="text-blue-400/70 hover:text-blue-400 underline underline-offset-2 transition-colors">Read our methodology</Link>
          </p>
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-500/50" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="flex items-center gap-2 group" aria-label="Medicaid Money Tracker \u2014 Home">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">M</div>
                <span className="font-bold text-[15px] text-white tracking-tight group-hover:text-blue-400 transition-colors hidden sm:inline">Medicaid Money Tracker</span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-0.5">
                <Link href="/watchlist" className="text-[13px] font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-all">
                  Risk Watchlist
                </Link>
                <Link href="/providers" className="text-[13px] font-medium text-slate-400 hover:text-white hover:bg-dark-600 px-3 py-1.5 rounded-md transition-all">
                  Providers
                </Link>
                <Link href="/states" className="text-[13px] font-medium text-slate-400 hover:text-white hover:bg-dark-600 px-3 py-1.5 rounded-md transition-all">
                  States
                </Link>
                <Link href="/procedures" className="text-[13px] font-medium text-slate-400 hover:text-white hover:bg-dark-600 px-3 py-1.5 rounded-md transition-all">
                  Procedures
                </Link>
                <Link href="/insights" className="text-[13px] font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-3 py-1.5 rounded-md transition-all">
                  Insights
                </Link>
                <Link href="/analysis" className="text-[13px] font-medium text-slate-400 hover:text-white hover:bg-dark-600 px-3 py-1.5 rounded-md transition-all">
                  Methodology
                </Link>
                <Link href="/ml-analysis" className="text-[13px] font-medium text-slate-400 hover:text-white hover:bg-dark-600 px-3 py-1.5 rounded-md transition-all">
                  ML Methodology
                </Link>
                <Link href="/about" className="text-[13px] font-medium text-slate-400 hover:text-white hover:bg-dark-600 px-3 py-1.5 rounded-md transition-all">
                  About
                </Link>
                <div className="ml-2">
                  <GlobalSearch />
                </div>
              </div>

              {/* Mobile: search + hamburger */}
              <div className="md:hidden flex items-center gap-1">
                <GlobalSearch />
                <details className="relative group">
                  <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-dark-600 transition-colors" aria-label="Open menu">
                    <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </summary>
                  <div className="absolute right-0 top-11 w-52 bg-dark-700 border border-dark-500 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                    <Link href="/watchlist" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-dark-600 transition-colors">
                      Risk Watchlist
                    </Link>
                    <Link href="/providers" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      Providers
                    </Link>
                    <Link href="/states" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      States
                    </Link>
                    <Link href="/procedures" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      Procedures
                    </Link>
                    <div className="border-t border-dark-500 my-1" />
                    <Link href="/insights" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-purple-400 hover:bg-dark-600 transition-colors">
                      Insights
                    </Link>
                    <Link href="/analysis" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      Methodology
                    </Link>
                    <Link href="/ml-analysis" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      ML Methodology
                    </Link>
                    <Link href="/trends" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      Trends
                    </Link>
                    <Link href="/about" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      About
                    </Link>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </nav>

        <main id="main-content">{children}</main>

        <footer className="border-t border-dark-500/50 mt-24 py-12 px-4" role="contentinfo">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
              <div>
                <p className="font-semibold text-slate-300 mb-3 text-xs uppercase tracking-wider">Explore</p>
                <div className="space-y-2">
                  <Link href="/providers" className="block text-slate-500 hover:text-blue-400 transition-colors">Top Providers</Link>
                  <Link href="/states" className="block text-slate-500 hover:text-blue-400 transition-colors">States</Link>
                  <Link href="/procedures" className="block text-slate-500 hover:text-blue-400 transition-colors">Procedures</Link>
                  <Link href="/trends" className="block text-slate-500 hover:text-blue-400 transition-colors">Trends</Link>
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-300 mb-3 text-xs uppercase tracking-wider">Investigate</p>
                <div className="space-y-2">
                  <Link href="/watchlist" className="block text-slate-500 hover:text-red-400 transition-colors">Risk Watchlist</Link>
                  <Link href="/insights" className="block text-slate-500 hover:text-purple-400 transition-colors">Insights</Link>
                  <Link href="/analysis" className="block text-slate-500 hover:text-blue-400 transition-colors">Methodology</Link>
                  <Link href="/ml-analysis" className="block text-slate-500 hover:text-blue-400 transition-colors">ML Methodology</Link>
                  <Link href="/about" className="block text-slate-500 hover:text-blue-400 transition-colors">About &amp; Methodology</Link>
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-300 mb-3 text-xs uppercase tracking-wider">Data Source</p>
                <p className="text-slate-500">
                  <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" className="text-blue-400/80 hover:text-blue-400 hover:underline transition-colors">HHS Open Data</a>
                </p>
                <p className="text-slate-600 mt-1">227M records &middot; 2018&ndash;2024</p>
                <p className="text-slate-600">$1.09T in payments</p>
              </div>
              <div>
                <p className="font-semibold text-slate-300 mb-3 text-xs uppercase tracking-wider">Built By</p>
                <p className="text-slate-500">
                  <a href="https://thedataproject.ai" className="text-blue-400/80 hover:text-blue-400 hover:underline transition-colors">TheDataProject.ai</a>
                </p>
                <p className="text-slate-600 mt-1">Data-driven transparency from public records.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-300 mb-3 text-xs uppercase tracking-wider">Help</p>
                <div className="space-y-2">
                  <a href="https://thedataproject.ai" className="block text-slate-500 hover:text-blue-400 transition-colors">Report an Issue</a>
                  <a href="https://thedataproject.ai" className="block text-slate-500 hover:text-blue-400 transition-colors">Contact Us</a>
                </div>
              </div>
            </div>
            <div className="border-t border-dark-600/50 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-slate-600">Statistical flags indicate unusual patterns worth investigating &mdash; not proof of fraud or wrongdoing.</p>
              <p className="text-xs text-slate-700">Not affiliated with HHS, DOGE, or any government agency.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
