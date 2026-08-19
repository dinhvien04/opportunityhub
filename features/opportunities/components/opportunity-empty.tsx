import Link from "next/link";
import { Compass, RotateCcw, SearchX, Sparkles } from "lucide-react";

interface OpportunityEmptyProps {
  type?: "no_data" | "no_results";
  searchQuery?: string;
}

export function OpportunityEmpty({
  type = "no_results",
  searchQuery,
}: OpportunityEmptyProps) {
  if (type === "no_data") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-12 text-center my-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-500/20">
          <Compass className="h-7 w-7 stroke-[1.8]" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          No opportunities published yet
        </h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
          New hackathons, scholarships, and fellowships will appear here as soon as they are published by organizers.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Refresh Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-12 text-center my-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mb-4">
        <SearchX className="h-7 w-7 stroke-[1.8]" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        No opportunities found
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
        {searchQuery
          ? `We couldn't find any opportunities matching "${searchQuery}". Try adjusting your keywords or filters.`
          : "No opportunities match the selected filters. Try broadening your criteria."}
      </p>
      <div className="mt-6">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear All Filters
        </Link>
      </div>
    </div>
  );
}
