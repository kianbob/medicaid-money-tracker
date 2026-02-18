import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provider Lookup — OpenMedicaid",
  description: "Search for any Medicaid provider by NPI number or name.",
};

export default function LookupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
