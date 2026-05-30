import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 1,000 Medicaid Providers by Spending ($305B)",
  description: "Ranked: the 1,000 highest-paid Medicaid providers collected $305B from 2018\u20132024. Filter by specialty, risk flags, and billing totals from 227M records.",
  openGraph: {
    title: "Top 1,000 Medicaid Providers by Spending ($305B)",
    description: "Ranked: the 1,000 highest-paid Medicaid providers collected $305B from 2018\u20132024. Filter by specialty, risk flags, and billing totals from 227M records.",
  },
};

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
