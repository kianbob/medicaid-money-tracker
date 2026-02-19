import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provider Report",
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
