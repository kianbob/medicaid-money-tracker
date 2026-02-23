import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid by State \u2014 NY Leads at $81B",
  description: "New York spent $81B, California $37B. See how all 50 states rank in Medicaid payments, who their top providers are, and where the money actually goes.",
  openGraph: {
    title: "Medicaid by State \u2014 NY Leads at $81B",
    description: "New York spent $81B, California $37B. See how all 50 states rank in Medicaid payments, who their top providers are, and where the money actually goes.",
  },
};

export default function StatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
