import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who Got $305B? Top 1,000 Medicaid Providers",
  description: "These 1,000 providers received $305 billion in Medicaid payments from 2018\u20132024. See who billed the most, their specialties, and which ones got flagged.",
  openGraph: {
    title: "Who Got $305B? Top 1,000 Medicaid Providers",
    description: "These 1,000 providers received $305 billion in Medicaid payments from 2018\u20132024. See who billed the most, their specialties, and which ones got flagged.",
  },
};

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
