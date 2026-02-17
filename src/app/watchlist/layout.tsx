import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Watchlist — 1,860 Flagged Medicaid Providers | Medicaid Money Tracker",
  description: "1,860 Medicaid providers flagged by 13 statistical fraud tests and ML analysis. Search by name, state, or risk tier. Updated February 2026.",
  openGraph: {
    title: "Risk Watchlist — 1,860 Flagged Medicaid Providers",
    description: "1,860 Medicaid providers flagged by 13 statistical fraud tests and ML analysis. Search by name, state, or risk tier.",
  },
};

export default function WatchlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
