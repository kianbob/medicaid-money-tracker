import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fraud Watchlist \u2014 1,860 Providers Flagged",
  description: "These 1,860 Medicaid providers triggered our fraud detection system. 13 statistical tests + ML analysis exposed suspicious billing across all 50 states.",
  openGraph: {
    title: "Fraud Watchlist \u2014 1,860 Providers Flagged",
    description: "These 1,860 Medicaid providers triggered our fraud detection system. 13 statistical tests + ML analysis exposed suspicious billing across all 50 states.",
  },
};

export default function WatchlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
