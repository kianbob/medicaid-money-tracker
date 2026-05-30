import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid Spending by State: All 50 Ranked",
  description: "Compare Medicaid spending across all 50 states. NY leads at $81B, CA at $37B. See top providers, risk flags, and per-capita breakdowns from 227M records.",
  openGraph: {
    title: "Medicaid Spending by State: All 50 Ranked",
    description: "Compare Medicaid spending across all 50 states. NY leads at $81B, CA at $37B. See top providers, risk flags, and per-capita breakdowns from 227M records.",
  },
};

export default function StatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
