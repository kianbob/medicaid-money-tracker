import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is My Provider Flagged? — Check Any Medicaid Provider — OpenMedicaid",
  description:
    "Enter a provider name or NPI number to instantly check if they've been flagged for unusual Medicaid billing patterns. Free lookup across 1,860 flagged providers.",
  openGraph: {
    title: "Is My Provider Flagged? — OpenMedicaid",
    description:
      "Check if your Medicaid provider has been flagged for unusual billing patterns. Instant lookup across 227M records.",
  },
};

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
