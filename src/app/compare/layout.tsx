import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Medicaid Providers",
  description: "Compare up to 3 Medicaid providers side by side. View total spending, claims, beneficiaries, cost per claim, fraud flags, and yearly trends.",
  openGraph: {
    title: "Compare Medicaid Providers \u2014 OpenMedicaid",
    description: "Compare up to 3 Medicaid providers side by side. View spending, claims, and fraud risk data.",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
