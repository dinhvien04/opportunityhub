import { OpportunityGridSkeleton } from "@/features/opportunities/components/opportunity-skeleton";

export default function DiscoverLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-96 rounded bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="h-12 max-w-2xl rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="h-96 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
          <OpportunityGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
