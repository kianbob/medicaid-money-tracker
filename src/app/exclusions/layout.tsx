import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OIG Exclusion List: 82,714 Banned Healthcare Providers",
  description: "Explore the HHS OIG Exclusion List: 82,714 banned healthcare providers, 8,473 with NPIs, and 40 found still billing Medicaid. Search by NPI, browse by state, specialty, and exclusion type.",
  openGraph: {
    title: "OIG Exclusion List: 82,714 Banned Healthcare Providers",
    description: "82,714 healthcare providers banned by the HHS Office of Inspector General. 40 found still billing Medicaid.",
  },
};

export default function ExclusionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
