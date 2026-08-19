"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Check, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryWithCount } from "../types";

interface OpportunityFiltersProps {
  categories: CategoryWithCount[];
}

export function OpportunityFilters({ categories }: OpportunityFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const selectedCategory = searchParams.get("category") || "all";
  const selectedMode = searchParams.get("mode") || "all";
  const selectedPrice = searchParams.get("price") || "all";
  const selectedDeadline = searchParams.get("deadline") || "any";

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedMode !== "all" ||
    selectedPrice !== "all" ||
    selectedDeadline !== "any" ||
    searchParams.has("q");

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "any" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset page when filter changes

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <aside className="w-full space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <Filter className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Category
        </label>
        <div className="flex flex-col space-y-1">
          <button
            type="button"
            onClick={() => updateParam("category", "all")}
            className={cn(
              "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors",
              selectedCategory === "all"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
            )}
          >
            <span>All Categories</span>
            {selectedCategory === "all" && <Check className="h-3.5 w-3.5" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateParam("category", cat.slug)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors",
                  isSelected
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
                )}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Mode Filter */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "all", label: "All Modes" },
            { id: "online", label: "Online" },
            { id: "offline", label: "In-Person" },
            { id: "hybrid", label: "Hybrid" },
          ].map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateParam("mode", mode.id)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium text-center border transition-colors",
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
                )}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Filter */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Cost / Fee
        </label>
        <div className="flex flex-col space-y-1">
          {[
            { id: "all", label: "All Opportunities" },
            { id: "free", label: "Free Only" },
            { id: "paid", label: "Paid / Fee Required" },
          ].map((price) => {
            const isSelected = selectedPrice === price.id;
            return (
              <button
                key={price.id}
                type="button"
                onClick={() => updateParam("price", price.id)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors",
                  isSelected
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
                )}
              >
                <span>{price.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Deadline Filter */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Deadline
        </label>
        <div className="flex flex-col space-y-1">
          {[
            { id: "any", label: "Any time" },
            { id: "this_week", label: "Closing this week" },
            { id: "this_month", label: "Closing this month" },
            { id: "next_3_months", label: "Next 3 months" },
          ].map((dl) => {
            const isSelected = selectedDeadline === dl.id;
            return (
              <button
                key={dl.id}
                type="button"
                onClick={() => updateParam("deadline", dl.id)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors",
                  isSelected
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
                )}
              >
                <span>{dl.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
