import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Medicaid Procedure Codes by Spending | Medicaid Money Tracker",
  description: "All 10,881 Medicaid procedure codes ranked by total spending. Search by code or description. See national cost benchmarks, provider counts, and per-claim averages for each HCPCS code.",
  openGraph: {
    title: "Top Medicaid Procedure Codes by Spending",
    description: "10,881 Medicaid procedure codes ranked by spending, with national cost benchmarks and top providers for each code.",
  },
};

export default function ProceduresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
