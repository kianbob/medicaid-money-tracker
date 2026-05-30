import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid Procedure Codes: 10,881 Ranked by Cost",
  description: "Search all 10,881 Medicaid procedure codes ranked by total spending. See cost per claim, top billers, and price variation across 617K+ providers.",
  openGraph: {
    title: "Medicaid Procedure Codes: 10,881 Ranked by Cost",
    description: "Search all 10,881 Medicaid procedure codes ranked by total spending. See cost per claim, top billers, and price variation across 617K+ providers.",
  },
};

export default function ProceduresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
