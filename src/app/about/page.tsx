import Link from "next/link";

export const metadata = {
  title: "About — Medicaid Money Tracker",
  description: "How we built the Medicaid Money Tracker, our methodology, data sources, and important disclaimers.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">About This Project</h1>

      <div className="prose prose-invert prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">What is Medicaid Money Tracker?</h2>
          <p className="text-slate-300 leading-relaxed">
            Medicaid Money Tracker is a public transparency tool that makes it easy to explore how 
            Medicaid dollars are spent. We take raw government data — over 227 million billing records — 
            and make it searchable, visual, and understandable.
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            Our fraud detection analysis uses statistical methods to flag providers whose billing patterns 
            look unusual. These flags are starting points for investigation, not accusations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Data Source</h2>
          <p className="text-slate-300 leading-relaxed">
            All data comes from the{" "}
            <a href="https://opendata.hhs.gov/datasets/medicaid-provider-spending/" className="text-blue-400 hover:underline">
              HHS Open Data Platform — Medicaid Provider Spending
            </a>{" "}
            dataset, published by the U.S. Department of Health and Human Services.
          </p>
          <ul className="text-slate-300 mt-3 space-y-1 list-disc list-inside">
            <li>Provider-level Medicaid spending from T-MSIS claims data</li>
            <li>Covers fee-for-service, managed care, and CHIP claims</li>
            <li>Date range: January 2018 through December 2024</li>
            <li>227 million records across 617,503 billing providers</li>
            <li>$1.09 trillion in total payments</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Fraud Detection Methodology</h2>
          <p className="text-slate-300 leading-relaxed">
            We apply four statistical lenses to identify anomalies:
          </p>
          <div className="mt-4 space-y-4">
            <div className="bg-dark-700 border border-dark-500 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-1">1. Spending Outliers</h3>
              <p className="text-slate-400 text-sm">Providers whose total spending is more than 3 standard deviations above the mean. These are statistically in the top fraction of a percent.</p>
            </div>
            <div className="bg-dark-700 border border-dark-500 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-1">2. Unusual Cost Per Claim</h3>
              <p className="text-slate-400 text-sm">For each procedure code, we calculate what providers typically charge. We flag those charging 3x or more the median — possible upcoding or inflated billing.</p>
            </div>
            <div className="bg-dark-700 border border-dark-500 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-1">3. Beneficiary Stuffing</h3>
              <p className="text-slate-400 text-sm">Providers filing far more claims per patient than peers for the same procedure. May indicate billing for services not actually provided.</p>
            </div>
            <div className="bg-dark-700 border border-dark-500 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-1">4. Spending Spikes</h3>
              <p className="text-slate-400 text-sm">Month-over-month spending increases of 500% or more. Sudden surges can indicate new fraudulent billing schemes.</p>
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed mt-4">
            Providers flagged in <strong className="text-white">multiple analyses</strong> receive the highest risk ratings, 
            as multiple independent anomalies are harder to explain by legitimate factors alone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">⚠️ Important Disclaimers</h2>
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-6">
            <ul className="text-slate-300 space-y-3">
              <li><strong className="text-amber-400">Not proof of fraud.</strong> Statistical flags identify unusual patterns that <em>may</em> warrant investigation. Many flagged providers have legitimate reasons for unusual billing.</li>
              <li><strong className="text-amber-400">State agencies differ.</strong> Government providers (state health departments, county agencies) often have different cost structures than private providers.</li>
              <li><strong className="text-amber-400">Aggregated data.</strong> This dataset shows billing totals, not individual claims. Full investigation requires claims-level review.</li>
              <li><strong className="text-amber-400">No medical judgment.</strong> We don&apos;t evaluate whether services were medically necessary or appropriately coded.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Built By</h2>
          <p className="text-slate-300 leading-relaxed">
            Medicaid Money Tracker is a project of{" "}
            <a href="https://thedataproject.ai" className="text-blue-400 hover:underline">TheDataProject.ai</a>, 
            which builds data-driven transparency tools from public records.
          </p>
        </section>
      </div>
    </div>
  );
}
