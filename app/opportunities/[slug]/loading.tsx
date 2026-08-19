export default function OpportunityDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 animate-pulse">
      <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />

      {/* Header Skeleton */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 space-y-6">
        <div className="flex gap-2">
          <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-10 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        </div>
      </div>

      {/* Body Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 space-y-4">
            <div className="h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800/60" />
            <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800/60" />
            <div className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4">
            <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-12 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
            <div className="h-12 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
