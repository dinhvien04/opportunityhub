import Link from "next/link";
import { Suspense } from "react";
import { OpportunityService } from "@/features/opportunities/service";
import { OpportunityGrid } from "@/features/opportunities/components/opportunity-grid";
import { OpportunityEmpty } from "@/features/opportunities/components/opportunity-empty";
import { OpportunitySearch } from "@/features/opportunities/components/opportunity-search";
import { OpportunityFilters } from "@/features/opportunities/components/opportunity-filters";
import { OpportunitySort } from "@/features/opportunities/components/opportunity-sort";
import type {
  DeadlineFilterOption,
  OpportunityMode,
  PriceFilterOption,
  SortOption,
} from "@/features/opportunities/types";
import { CategoryIcon } from "@/components/icons/category-icon";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface DiscoverPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    mode?: OpportunityMode | "all";
    price?: PriceFilterOption;
    deadline?: DeadlineFilterOption;
    sort?: SortOption;
    page?: string;
  }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;

  const q = params.q || "";
  const category = params.category || "all";
  const mode = params.mode || "all";
  const price = params.price || "all";
  const deadline = params.deadline || "any";
  const sort = params.sort || "relevance";
  const page = Math.max(1, Number(params.page) || 1);

  // Fetch data in parallel
  const [categories, searchResult] = await Promise.all([
    OpportunityService.getCategories(),
    OpportunityService.search({
      q,
      category,
      mode,
      price,
      deadline,
      sort,
      page,
      limit: 12,
    }),
  ]);

  const activeCategoryObj = categories.find((c) => c.slug === category);

  const hasActiveFilters =
    category !== "all" ||
    mode !== "all" ||
    price !== "all" ||
    deadline !== "any" ||
    Boolean(q);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* 1. Header & Search Bar */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Discover Opportunities
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Explore hackathons, scholarships, grants, and tech programs worldwide.
          </p>
        </div>

        <div className="max-w-2xl">
          <Suspense fallback={<div className="h-12 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
            <OpportunitySearch
              placeholder="Search by keywords, organizer, or field of interest..."
              defaultValue={q}
            />
          </Suspense>
        </div>

        {/* Category Horizontal Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/discover"
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              category === "all"
                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800"
            )}
          >
            All
          </Link>
          {categories.map((cat) => {
            const isSelected = category === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/discover?category=${cat.slug}${mode !== "all" ? `&mode=${mode}` : ""}${price !== "all" ? `&price=${price}` : ""}`}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                    : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800"
                )}
              >
                <CategoryIcon
                  nameOrSlug={cat.icon || cat.slug}
                  className="h-3.5 w-3.5 opacity-80"
                />
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Main Layout: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <Suspense fallback={<div className="h-64 animate-pulse" />}>
              <OpportunityFilters categories={categories} />
            </Suspense>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {searchResult.total} {searchResult.total === 1 ? "opportunity" : "opportunities"}
              </span>
              {activeCategoryObj && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  in <span className="font-medium text-emerald-600 dark:text-emerald-400">{activeCategoryObj.name}</span>
                </span>
              )}
              {q && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  for &quot;<span className="font-medium text-zinc-800 dark:text-zinc-200">{q}</span>&quot;
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Suspense fallback={<div className="h-8 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />}>
                <OpportunitySort />
              </Suspense>
            </div>
          </div>

          {/* Grid / Empty State */}
          {searchResult.items.length > 0 ? (
            <OpportunityGrid opportunities={searchResult.items} />
          ) : (
            <OpportunityEmpty
              type={hasActiveFilters ? "no_results" : "no_data"}
              searchQuery={q}
            />
          )}

          {/* Pagination Controls */}
          {searchResult.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              {Array.from({ length: searchResult.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === searchResult.page;
                return (
                  <Link
                    key={pageNum}
                    href={`/discover?page=${pageNum}${q ? `&q=${encodeURIComponent(q)}` : ""}${category !== "all" ? `&category=${category}` : ""}${mode !== "all" ? `&mode=${mode}` : ""}${price !== "all" ? `&price=${price}` : ""}${deadline !== "any" ? `&deadline=${deadline}` : ""}${sort !== "relevance" ? `&sort=${sort}` : ""}`}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                      isCurrent
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
                    )}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
