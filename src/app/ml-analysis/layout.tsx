import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ML Methodology",
  description: "How our random forest ML model detects Medicaid fraud: trained on 514 confirmed-excluded providers (OIG LEIE database). AUC: 0.77 under 5-fold cross-validation. 594,234 providers scored.",
  openGraph: {
    title: "ML Methodology — OpenMedicaid",
  },
};

export default function MlAnalysisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
