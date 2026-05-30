import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Medicaid Providers: Side-by-Side Analysis",
  description: "Compare up to 3 Medicaid providers side by side. Spending, claims per patient, cost per claim, risk flags, and yearly trends from 227M billing records.",
  openGraph: {
    title: "Compare Medicaid Providers: Side-by-Side Analysis",
    description: "Put any 3 providers head to head. Compare spending, claims per patient, cost per claim, risk flags, and yearly billing trends.",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
