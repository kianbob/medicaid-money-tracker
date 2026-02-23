import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Medicaid Providers Side by Side",
  description: "Put any 3 providers head to head. Compare spending, claims per patient, cost per claim, fraud flags, and yearly billing trends from 227M records.",
  openGraph: {
    title: "Compare Medicaid Providers Side by Side",
    description: "Put any 3 providers head to head. Compare spending, claims per patient, cost per claim, fraud flags, and yearly billing trends.",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
