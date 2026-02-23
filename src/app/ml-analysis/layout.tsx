import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ML Fraud Detection: 594K Providers Scored",
  description: "How our random forest model detects Medicaid fraud. Trained on 514 OIG-excluded providers, 594K scored. AUC 0.77 under 5-fold CV.",
  openGraph: {
    title: "ML Fraud Detection: 594K Providers Scored",
  },
};

export default function MlAnalysisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
