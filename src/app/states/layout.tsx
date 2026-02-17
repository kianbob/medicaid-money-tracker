import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid Spending by State \u2014 All 50 States | Medicaid Money Tracker",
  description: "Medicaid provider spending across all 50 states, ranked by total payments. New York leads at $81.1B. See top providers, procedures, and yearly trends for each state.",
  openGraph: {
    title: "Medicaid Spending by State \u2014 All 50 States",
    description: "State-by-state breakdown of Medicaid provider spending. New York leads with $81.1B, followed by California at $36.8B.",
  },
};

export default function StatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
