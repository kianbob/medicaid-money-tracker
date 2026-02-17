import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-8xl font-extrabold text-dark-500 mb-4">404</p>
      <h1 className="font-headline text-2xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist. Try searching for a provider, procedure, or state instead.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/providers" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
          Browse Providers
        </Link>
        <Link href="/procedures" className="px-5 py-2.5 bg-dark-700 hover:bg-dark-600 text-slate-300 text-sm font-semibold rounded-lg border border-dark-500 transition-colors">
          Browse Procedures
        </Link>
        <Link href="/states" className="px-5 py-2.5 bg-dark-700 hover:bg-dark-600 text-slate-300 text-sm font-semibold rounded-lg border border-dark-500 transition-colors">
          Browse States
        </Link>
      </div>
      <div className="mt-12 border-t border-dark-600/50 pt-8">
        <p className="text-xs text-slate-600">
          Looking for a specific provider? Try the <Link href="/providers" className="text-blue-400 hover:underline">provider directory</Link> or use the search bar above.
        </p>
      </div>
    </div>
  );
}
