import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provider Activity Timeline",
  description: "See when flagged Medicaid providers were actively billing. Interactive timeline reveals suspicious billing patterns and activity gaps.",
};

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
