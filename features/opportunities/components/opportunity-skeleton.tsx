export function OpportunityCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 animate-pulse">
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-5 w-14 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="space-y-2 pt-1">
          <div className="h-5 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3.5 w-full rounded bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-3.5 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/60" />
        </div>

        <div className="flex gap-2 pt-2">
          <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3.5">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export function OpportunityGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <OpportunityCardSkeleton key={i} />
      ))}
    </div>
  );
}
