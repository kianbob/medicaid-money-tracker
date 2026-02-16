import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medicaid Money Tracker — Follow the Spending",
  description: "Track $1.09 trillion in Medicaid provider spending. Explore 617,000+ providers, detect billing anomalies, and see where taxpayer healthcare dollars actually go.",
  openGraph: {
    title: "Medicaid Money Tracker",
    description: "Track $1.09 trillion in Medicaid provider spending across 617,000+ providers.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-900 text-slate-200 min-h-screen`}>
        <nav className="sticky top-0 z-50 bg-dark-800/95 backdrop-blur border-b border-dark-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <span className="text-2xl">💊</span>
                <div>
                  <span className="font-bold text-lg text-white">Medicaid Money Tracker</span>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-8">
                <Link href="/watchlist" className="text-sm font-medium text-slate-300 hover:text-red-400 transition-colors">
                  🚩 Fraud Watchlist
                </Link>
                <Link href="/providers" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
                  Providers
                </Link>
                <Link href="/procedures" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
                  Procedures
                </Link>
                <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
                  About
                </Link>
              </div>
              <div className="md:hidden">
                <Link href="/watchlist" className="text-sm font-medium text-red-400">
                  🚩 Watchlist
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-dark-500 mt-20 py-8 px-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
            <p>Data source: <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" className="text-blue-400 hover:underline">HHS Open Data</a> · Medicaid Provider Spending (2018–2024)</p>
            <p className="mt-2">Statistical flags indicate where to look — not proof of wrongdoing.</p>
            <p className="mt-2">Built by <a href="https://thedataproject.ai" className="text-blue-400 hover:underline">TheDataProject.ai</a></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
