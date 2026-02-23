import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10,881 Medicaid Procedure Codes Exposed by Spending",
  description: "Every procedure Medicaid pays for, ranked by cost. See which codes drain the most money, who bills them, and how prices vary wildly across providers.",
  openGraph: {
    title: "10,881 Medicaid Procedure Codes Exposed by Spending",
    description: "Every procedure Medicaid pays for, ranked by cost. See which codes drain the most money, who bills them, and how prices vary wildly across providers.",
  },
};

export default function ProceduresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
