import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid Fraud ML Model: 594K Providers Scored",
  description: "How machine learning detects Medicaid fraud: random forest trained on 514 OIG-excluded providers, scoring 594K. AUC 0.77, fully transparent methodology.",
  openGraph: {
    title: "Medicaid Fraud ML Model: 594K Providers Scored",
  },
};

export default function MlAnalysisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
