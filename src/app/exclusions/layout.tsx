import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OIG Exclusion List: 82,714 Banned Providers",
  description: "Search 82,714 providers banned by HHS OIG. 40 were found still billing Medicaid. Browse by state, specialty, and exclusion type.",
  openGraph: {
    title: "OIG Exclusion List: 82,714 Banned Providers",
    description: "Search 82,714 providers banned by HHS OIG. 40 were found still billing Medicaid.",
  },
};

export default function ExclusionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
