import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OIG Excluded Providers: 82,714 Banned From Medicaid",
  description: "Search 82,714 providers banned by HHS OIG from federal healthcare. 40 found still billing Medicaid. Browse by state, specialty, and exclusion type.",
  openGraph: {
    title: "OIG Excluded Providers: 82,714 Banned From Medicaid",
    description: "Search 82,714 providers banned by HHS OIG. 40 were found still billing Medicaid.",
  },
};

export default function ExclusionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
