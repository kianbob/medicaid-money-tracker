import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 1,000 Medicaid Providers by Spending | Medicaid Money Tracker",
  description: "The 1,000 highest-spending Medicaid providers from 2018–2024. Search by name, state, or specialty. Filter by fraud flags. Detailed spending profiles for each provider.",
  openGraph: {
    title: "Top 1,000 Medicaid Providers by Spending",
    description: "The highest-spending Medicaid providers from 2018–2024, with fraud risk flags and detailed billing profiles.",
  },
};

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
