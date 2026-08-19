"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowUpDown } from "lucide-react";

export function OpportunitySort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") || "relevance";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap"
      >
        <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
        Sort:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="h-8 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-800 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
      >
        <option value="relevance">Recommended</option>
        <option value="deadline_soon">Deadline Soon</option>
        <option value="newest">Newest Published</option>
        <option value="alphabetical">Alphabetical (A-Z)</option>
      </select>
    </div>
  );
}
