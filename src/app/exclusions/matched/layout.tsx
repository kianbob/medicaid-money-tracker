import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banned But Still Billing: 40 Excluded Providers",
  description: "40 OIG-banned providers were found in Medicaid billing data. See names, NPIs, exclusion reasons — fraud convictions and more.",
  openGraph: {
    title: "Banned But Still Billing: 40 Excluded Providers",
    description: "40 OIG-banned providers were found in Medicaid billing data. Fraud convictions, revoked licenses — still in the system.",
  },
};

export default function MatchedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
