import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Medicaid Money Tracker — Follow $1.09T in Spending",
    template: "%s — Medicaid Money Tracker",
  },
  description: "Track $1.09 trillion in Medicaid provider spending across 617,000+ providers. Explore billing anomalies, fraud risk flags, and see where taxpayer healthcare dollars actually go. Built from 227 million HHS records (2018–2024).",
  metadataBase: new URL("https://medicaidmoneytracker.com"),
  openGraph: {
    title: "Medicaid Money Tracker — Follow $1.09T in Spending",
    description: "We analyzed 227 million Medicaid billing records. See where taxpayer healthcare dollars go — and which providers raised red flags.",
    type: "website",
    siteName: "Medicaid Money Tracker",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medicaid Money Tracker — Follow $1.09T in Spending",
    description: "We analyzed 227 million Medicaid billing records. See where taxpayer healthcare dollars go — and which providers raised red flags.",
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
              "description": "Track $1.09 trillion in Medicaid provider spending across 617,000+ providers.",
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
              "name": "Medicaid Provider Spending Analysis (2018–2024)",
              "description": "Analysis of 227 million Medicaid billing records covering $1.09 trillion in payments across 617,503 providers and 10,881 procedure codes.",
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
      <body className={`${inter.className} bg-dark-900 text-slate-200 min-h-screen`}>
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-dark-800/95 backdrop-blur-md border-b border-dark-500" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2.5 group" aria-label="Medicaid Money Tracker — Home">
                <span className="text-xl" aria-hidden="true">💊</span>
                <span className="font-bold text-lg text-white tracking-tight group-hover:text-blue-400 transition-colors">Medicaid Money Tracker</span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                <Link href="/watchlist" className="text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all">
                  Fraud Watchlist
                </Link>
                <Link href="/providers" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-600 px-3 py-2 rounded-lg transition-all">
                  Providers
                </Link>
                <Link href="/procedures" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-600 px-3 py-2 rounded-lg transition-all">
                  Procedures
                </Link>
                <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-600 px-3 py-2 rounded-lg transition-all">
                  About
                </Link>
              </div>

              {/* Mobile hamburger nav - uses CSS-only toggle */}
              <div className="md:hidden">
                <details className="relative group">
                  <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-dark-600 transition-colors" aria-label="Open menu">
                    <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </summary>
                  <div className="absolute right-0 top-12 w-56 bg-dark-700 border border-dark-500 rounded-xl shadow-2xl shadow-black/50 py-2 z-50">
                    <Link href="/watchlist" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-dark-600 transition-colors">
                      <span aria-hidden="true">🚩</span> Fraud Watchlist
                    </Link>
                    <Link href="/providers" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      <span aria-hidden="true">🏥</span> Providers
                    </Link>
                    <Link href="/procedures" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      <span aria-hidden="true">💊</span> Procedures
                    </Link>
                    <div className="border-t border-dark-500 my-1" />
                    <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      <span aria-hidden="true">📖</span> About & Methodology
                    </Link>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </nav>

        <main id="main-content">{children}</main>

        <footer className="border-t border-dark-500 mt-20 py-10 px-4" role="contentinfo">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-sm text-slate-500">
              <div>
                <p className="font-semibold text-slate-400 mb-2">Data Source</p>
                <p>
                  <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" className="text-blue-400 hover:underline">HHS Open Data</a> — Medicaid Provider Spending
                </p>
                <p className="mt-1">227M records · 2018–2024 · $1.09T in payments</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400 mb-2">Disclaimer</p>
                <p>Statistical flags indicate unusual patterns worth investigating — not proof of fraud or wrongdoing.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400 mb-2">Built By</p>
                <p>
                  <a href="https://thedataproject.ai" className="text-blue-400 hover:underline">TheDataProject.ai</a>
                </p>
                <p className="mt-1">Data-driven transparency from public records.</p>
              </div>
            </div>
            <div className="border-t border-dark-600 mt-8 pt-6 text-center text-xs text-slate-600">
              <p>Released under the public interest. Not affiliated with HHS, DOGE, or any government agency.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
