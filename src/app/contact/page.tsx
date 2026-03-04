import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — OpenMedicaid",
  description: "Get in touch with the OpenMedicaid team for data corrections, media inquiries, or general questions.",
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-400">Contact</span>
      </nav>

      <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
        Contact Us
      </h1>
      <p className="text-slate-400 mb-10 max-w-xl leading-relaxed">
        Have a question, correction, or media inquiry? We&apos;d love to hear from you.
      </p>

      <div className="space-y-8">
        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">General Inquiries</h2>
          <p className="text-slate-400 text-sm mb-3">
            Questions about our data, methodology, or anything else.
          </p>
          <a href="mailto:contact@openmedicaid.org" className="text-blue-400 hover:underline font-medium">
            contact@openmedicaid.org
          </a>
        </div>

        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Data Corrections</h2>
          <p className="text-slate-400 text-sm mb-3">
            If you are a healthcare provider and believe your data is inaccurate or displayed incorrectly, please contact us.
            All data on this site comes from public government datasets (HHS, OIG, NPI Registry). We will review and correct
            any verifiable errors promptly.
          </p>
          <a href="mailto:corrections@openmedicaid.org" className="text-blue-400 hover:underline font-medium">
            corrections@openmedicaid.org
          </a>
        </div>

        <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Media &amp; Press</h2>
          <p className="text-slate-400 text-sm mb-3">
            Journalists and researchers are welcome to use our data with attribution. For press inquiries, interviews, or data requests:
          </p>
          <a href="mailto:press@openmedicaid.org" className="text-blue-400 hover:underline font-medium">
            press@openmedicaid.org
          </a>
        </div>

        <div className="bg-dark-800/50 border border-dark-600/30 rounded-xl p-5 mt-6">
          <p className="text-xs text-slate-500">
            <strong className="text-slate-400">Note:</strong> Statistical risk flags on this site indicate unusual billing patterns worth investigating —
            they are not accusations of fraud or wrongdoing. If you have concerns about a specific provider profile,
            please include the NPI number in your message for faster resolution.
          </p>
        </div>
      </div>
    </div>
  );
}
