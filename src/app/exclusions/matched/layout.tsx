import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banned But Still Billing: 40 Excluded Providers in Medicaid Data",
  description: "40 providers on the HHS OIG Exclusion List were found in Medicaid billing data. View their names, NPIs, exclusion reasons, and dates.",
  openGraph: {
    title: "Banned But Still Billing: 40 Excluded Providers in Medicaid Data",
    description: "40 providers banned by the OIG were found in Medicaid billing records. Convicted of fraud, licenses revoked — yet still in the system.",
  },
};

export default function MatchedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
