import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — OpenMedicaid",
  description: "Privacy policy for OpenMedicaid. Learn how we handle data and protect your privacy.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-400">Privacy Policy</span>
      </nav>

      <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-8">
        Privacy Policy
      </h1>

      <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300 text-sm leading-relaxed">
        <p className="text-slate-400 text-xs">Last updated: March 4, 2026</p>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">What We Collect</h2>
          <p>
            OpenMedicaid does not collect personal information from visitors. We do not require account creation,
            login credentials, or any form of user registration. We do not use cookies for tracking or advertising purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Analytics</h2>
          <p>
            We use Google Analytics to understand how visitors interact with the site — including page views, session duration,
            and general geographic region. Google Analytics collects anonymous usage data through cookies. You can opt out
            by installing the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Data Sources</h2>
          <p>
            All provider and billing data on this site comes from publicly available government datasets, including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 mt-2">
            <li><a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">HHS Open Data — Medicaid Provider Spending</a></li>
            <li>OIG List of Excluded Individuals/Entities (LEIE)</li>
            <li>CMS National Provider Identifier (NPI) Registry</li>
          </ul>
          <p className="mt-3">
            Provider names, NPIs, billing amounts, and procedure codes are all public record. Our statistical analysis
            and risk flags are derived from this public data using the methodology described on our{" "}
            <Link href="/analysis" className="text-blue-400 hover:underline">Analysis</Link> page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Important Disclaimer</h2>
          <p>
            Statistical risk flags indicate unusual billing patterns worth investigating — they are <strong className="text-white">not</strong> accusations
            of fraud or wrongdoing. Many flagged patterns may have legitimate explanations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Data Correction Requests</h2>
          <p>
            If you are a healthcare provider and believe your data is displayed inaccurately, please{" "}
            <Link href="/contact" className="text-blue-400 hover:underline">contact us</Link>.
            We will review and correct any verifiable errors promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be reflected on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
          <p>
            Questions about this policy? Reach us at{" "}
            <a href="mailto:contact@openmedicaid.org" className="text-blue-400 hover:underline">contact@openmedicaid.org</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
