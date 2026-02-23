import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid Provider Lookup by NPI or Name",
  description: "Search any Medicaid provider by NPI number or name. View billing totals, fraud flags, specialty, and procedure breakdowns instantly.",
};

export default function LookupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
