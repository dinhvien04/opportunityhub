import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { OpportunityService } from "@/features/opportunities/service";
import { OpportunityGrid } from "@/features/opportunities/components/opportunity-grid";
import { OpportunityEmpty } from "@/features/opportunities/components/opportunity-empty";
import { CategoryQuickAccess } from "@/features/opportunities/components/category-quick-access";
import { OpportunitySearch } from "@/features/opportunities/components/opportunity-search";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredOpportunities] = await Promise.all([
    OpportunityService.getCategories(),
    OpportunityService.getFeatured(6),
  ]);

  return (
    <div className="flex flex-col flex-1">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 py-16 sm:py-24 lg:py-28">
        {/* Subtle geometric background decoration */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20">
          <div className="h-[450px] w-[700px] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Empowering Next-Gen Talent & Builders
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-3xl leading-[1.12]">
            Find opportunities <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              that move you forward.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Discover competitions, scholarships, internships, programs, and events matched to your ambitions.
          </p>

          {/* Search Box */}
          <div className="mt-8 w-full max-w-2xl">
            <Suspense fallback={<div className="h-12 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
              <OpportunitySearch
                placeholder="Search opportunities, organizations, skills, hackathons..."
              />
            </Suspense>
          </div>

          {/* Quick CTA Actions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Popular:</span>
            <Link
              href="/discover?category=competition"
              className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors"
            >
              🏆 Competitions
            </Link>
            <Link
              href="/discover?category=scholarship"
              className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors"
            >
              🎓 Scholarships
            </Link>
            <Link
              href="/discover?price=free"
              className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors"
            >
              ✨ Free Only
            </Link>
            <Link
              href="/discover?mode=online"
              className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors"
            >
              🌐 Online Events
            </Link>
          </div>

          {/* Trust Highlights Bar */}
          <div className="mt-12 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left w-full max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Verified Hosts
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Authentic listings only
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Global & Local
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Online, hybrid & offline
                </div>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Deadline Alerts
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Never miss closing dates
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Category Quick Access */}
        <CategoryQuickAccess categories={categories} />

        {/* Featured Opportunities Section */}
        <section className="w-full pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                Curated Selection
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                Featured Opportunities
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Explore all opportunities
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {featuredOpportunities.length > 0 ? (
            <OpportunityGrid opportunities={featuredOpportunities} />
          ) : (
            <OpportunityEmpty type="no_data" />
          )}
        </section>

        {/* Platform Value Proposition Banner */}
        <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900 text-white p-8 sm:p-12 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              OpportunityHub Mission
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2 text-zinc-50">
              One platform for every ambitious step in your tech & academic journey.
            </h3>
            <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
              Whether you are looking for your first hackathon, funding for your university degree, or international exchange fellowship programs, OpportunityHub organizes and verifies every opportunity so you can focus on applying and winning.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
              >
                Browse All Opportunities
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="/api/health/db"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors border border-zinc-700/50"
              >
                Check System Health
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
