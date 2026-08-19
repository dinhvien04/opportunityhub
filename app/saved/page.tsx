import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { SavedService } from "@/features/saved/service";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";
import { Bookmark, Compass } from "lucide-react";
import { SavedSearchInput } from "./saved-search-input";

export const metadata = {
  title: "Saved Opportunities - OpportunityHub",
  description: "Your bookmarked hackathons, grants, scholarships, and fellowships.",
};

export default async function SavedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser("/login?returnTo=/saved");

  const savedList = await SavedService.getSavedList(user.userId, params.q);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
              <Bookmark className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
              Saved Opportunities
            </h1>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {savedList.length} {savedList.length === 1 ? "opportunity" : "opportunities"} saved in your personal library
          </p>
        </div>

        {/* Search inside saved */}
        <div className="w-full md:w-80">
          <SavedSearchInput defaultValue={params.q || ""} />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {savedList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400 mb-4">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {params.q ? "No matching saved opportunities" : "No saved opportunities yet"}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              {params.q
                ? "Try searching for a different keyword or clear your filter."
                : "Bookmark hackathons, grants, and internships while exploring to track them here."}
            </p>
            <div className="mt-6">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white/90 transition-all shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Discover Opportunities</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedList.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                initialSaved={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
