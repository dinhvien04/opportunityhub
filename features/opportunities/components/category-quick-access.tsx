import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/icons/category-icon";
import type { CategoryWithCount } from "../types";

interface CategoryQuickAccessProps {
  categories: CategoryWithCount[];
}

export function CategoryQuickAccess({ categories }: CategoryQuickAccessProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
            Browse by Domain
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Opportunity Categories
          </h2>
        </div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          View all opportunities
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/discover?category=${cat.slug}`}
            className="group relative flex flex-col items-start p-4 rounded-xl border border-zinc-200/80 bg-white/70 hover:bg-white hover:border-emerald-500/40 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 dark:hover:border-emerald-500/30 transition-all duration-150"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
              <CategoryIcon
                nameOrSlug={cat.icon || cat.slug}
                className="h-5 w-5 stroke-[2.2]"
              />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {cat.name}
            </h3>
            {cat.description && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-1 leading-normal">
                {cat.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
