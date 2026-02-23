import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is My Provider Flagged? \u2014 Instant Lookup",
  description:
    "Enter any provider name or NPI to instantly see if they've been flagged for suspicious billing. Free search across 1,860 flagged Medicaid providers.",
  openGraph: {
    title: "Is My Provider Flagged? \u2014 Instant Lookup",
    description:
      "Enter any provider name or NPI to see if they've been flagged. Free instant search across 1,860 flagged Medicaid providers.",
  },
};

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
