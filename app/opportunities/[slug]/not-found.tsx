import Link from "next/link";
import { ArrowLeft, Compass, Search } from "lucide-react";

export default function OpportunityNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 mb-6">
        <Compass className="h-8 w-8 stroke-[1.8]" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        Opportunity Not Found
      </h1>

      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
        The opportunity you are looking for might have been closed, expired, removed, or the link may be invalid.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          Explore Other Opportunities
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
