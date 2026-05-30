import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid Provider Lookup: Search by NPI or Name",
  description: "Look up any of 617,000+ Medicaid providers by NPI or name. View billing totals, risk flags, specialty, and procedure breakdowns from 227M records.",
};

export default function LookupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
