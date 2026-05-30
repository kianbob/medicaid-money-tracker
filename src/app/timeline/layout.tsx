import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid Provider Billing Timeline (2018\u20132024)",
  description: "Interactive timeline showing when flagged Medicaid providers were actively billing. Spot suspicious patterns, sudden spikes, and billing gaps across 7 years.",
};

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
