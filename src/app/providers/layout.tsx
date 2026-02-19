import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 1,000 Medicaid Providers by Spending",
  description: "The 1,000 highest-spending Medicaid providers from 2018-2024, representing $305B in payments. Search and filter by name, state, or specialty.",
  openGraph: {
    title: "Top 1,000 Medicaid Providers by Spending",
    description: "The 1,000 highest-spending Medicaid providers from 2018-2024, representing $305B in payments. Search and filter by name, state, or specialty.",
  },
};

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
