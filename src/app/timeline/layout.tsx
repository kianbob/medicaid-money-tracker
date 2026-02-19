import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provider Activity Timeline",
  description: "Visual timeline of when flagged Medicaid providers were actively billing.",
};

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
