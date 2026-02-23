import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GlobalSearch from "@/components/GlobalSearch";
import NavLinks from "@/components/NavLinks";
import BackToTop from "@/components/BackToTop";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-headline" });

export const metadata: Metadata = {
  title: {
    default: "OpenMedicaid \u2014 $1.09 Trillion Exposed",
    template: "%s \u2014 OpenMedicaid",
  },
  description: "We analyzed 227M Medicaid billing records and flagged 1,860 providers for suspicious patterns. Search any provider, procedure, or state to see where your tax dollars went.",
  metadataBase: new URL("https://www.openmedicaid.org"),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "OpenMedicaid \u2014 $1.09 Trillion in Spending, Exposed",
    description: "227M billing records. 1,860 providers flagged. 13 fraud tests + ML analysis reveal where $1.09T in Medicaid money actually went.",
    type: "website",
    siteName: "OpenMedicaid",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenMedicaid \u2014 $1.09T in Spending, Exposed",
    description: "227M billing records. 1,860 providers flagged. 13 fraud tests + ML analysis reveal where $1.09T in Medicaid money actually went.",
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
        <link rel="alternate" type="application/rss+xml" title="OpenMedicaid" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "OpenMedicaid",
              "url": "https://www.openmedicaid.org",
              "description": "Track $1.09 trillion in Medicaid provider spending across 617,000+ providers. 1,860+ providers flagged by 13 fraud detection tests and ML analysis.",
              "publisher": {
                "@type": "Organization",
                "name": "TheDataProject.ai",
                "url": "https://thedataproject.ai"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://openmedicaid.org/providers?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
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
              "url": "https://www.openmedicaid.org",
              "license": "https://creativecommons.org/publicdomain/zero/1.0/",
              "creator": {
                "@type": "Organization",
                "name": "TheDataProject.ai",
                "url": "https://thedataproject.ai"
              },
              "isBasedOn": {
                "@type": "Dataset",
                "name": "HHS Medicaid Provider Spending",
                "description": "Federal dataset of Medicaid provider billing records published by the U.S. Department of Health and Human Services, covering fee-for-service claims from 2018 to 2024.",
                "url": "https://opendata.hhs.gov/datasets/medicaid-provider-spending/",
                "license": "https://creativecommons.org/publicdomain/zero/1.0/",
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HXEHT6SJLF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HXEHT6SJLF');
            `,
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
              <Link href="/" className="flex items-center gap-2 group" aria-label="OpenMedicaid \u2014 Home">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">M</div>
                <span className="font-bold text-[15px] text-white tracking-tight group-hover:text-blue-400 transition-colors hidden sm:inline">OpenMedicaid</span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-0.5">
                <NavLinks />
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
                    <Link href="/lookup" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      Provider Lookup
                    </Link>
                    <Link href="/compare" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      Compare
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
                    <Link href="/downloads" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-dark-600 hover:text-white transition-colors">
                      Downloads
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
        <BackToTop />

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
                  <Link href="/compare" className="block text-slate-500 hover:text-blue-400 transition-colors">Compare</Link>
                  <Link href="/lookup" className="block text-slate-500 hover:text-blue-400 transition-colors">Provider Lookup</Link>
                  <Link href="/downloads" className="block text-slate-500 hover:text-blue-400 transition-colors">Downloads</Link>
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-300 mb-3 text-xs uppercase tracking-wider">Investigate</p>
                <div className="space-y-2">
                  <Link href="/watchlist" className="block text-slate-500 hover:text-red-400 transition-colors">Risk Watchlist</Link>
                  <Link href="/insights" className="block text-slate-500 hover:text-purple-400 transition-colors">Insights</Link>
                  <Link href="/timeline" className="block text-slate-500 hover:text-blue-400 transition-colors">Timeline</Link>
                  <Link href="/analysis" className="block text-slate-500 hover:text-blue-400 transition-colors">Methodology</Link>
                  <Link href="/ml-analysis" className="block text-slate-500 hover:text-blue-400 transition-colors">ML Methodology</Link>
                  <Link href="/about" className="block text-slate-500 hover:text-blue-400 transition-colors">About</Link>
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
                <p className="font-semibold text-slate-300 mb-3 text-xs uppercase tracking-wider">Sister Sites</p>
                <div className="space-y-2">
                  <a href="https://www.openmedicare.us" target="_blank" rel="noopener noreferrer" className="block text-slate-500 hover:text-blue-400 transition-colors">OpenMedicare — Medicare Spending ↗</a>
                  <a href="https://www.openfeds.org" target="_blank" rel="noopener noreferrer" className="block text-slate-500 hover:text-blue-400 transition-colors">OpenFeds — Federal Workforce ↗</a>
                  <a href="https://www.openspending.us" target="_blank" rel="noopener noreferrer" className="block text-slate-500 hover:text-blue-400 transition-colors">OpenSpending — Federal Spending ↗</a>
                </div>
                <p className="font-semibold text-slate-300 mb-3 mt-5 text-xs uppercase tracking-wider">Help</p>
                <div className="space-y-2">
                  <a href="mailto:kian@thedataproject.ai" className="block text-slate-500 hover:text-blue-400 transition-colors">Contact Us</a>
                  <a href="/feed.xml" className="block text-slate-500 hover:text-blue-400 transition-colors">RSS Feed</a>
                </div>
              </div>
            </div>
            <div className="border-t border-dark-600/50 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-slate-600">Statistical flags indicate unusual patterns worth investigating &mdash; not proof of fraud or wrongdoing.</p>
              <div className="flex items-center gap-4">
                <p className="text-xs text-slate-700">Not affiliated with HHS, DOGE, or any government agency.</p>
                <div className="flex items-center gap-3">
                  <a href="https://x.com/thedataproject0" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="Follow us on X">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/thedataproject-ai" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="Follow us on LinkedIn">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
