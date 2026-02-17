import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Medicaid Procedure Codes by Spending | OpenMedicaid",
  description: "Browse 10,881 Medicaid procedure codes ranked by total spending. See billing benchmarks, top providers, and cost analysis for each code.",
  openGraph: {
    title: "Top Medicaid Procedure Codes by Spending",
    description: "Browse 10,881 Medicaid procedure codes ranked by total spending. See billing benchmarks, top providers, and cost analysis for each code.",
  },
};

export default function ProceduresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
