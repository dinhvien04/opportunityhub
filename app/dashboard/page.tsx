import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { DashboardService } from "@/features/dashboard/service";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import {
  Bookmark,
  ChevronRight,
  Clock,
  Compass,
  FolderKanban,
  Sparkles,
  Trophy,
  User,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "Dashboard - OpportunityHub",
  description: "Your personalized hub for tracked applications, deadlines, and recommendations.",
};

export default async function DashboardPage() {
  const user = await requireUser("/login?returnTo=/dashboard");

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  const dashboardData = await DashboardService.getSummary(user.userId);

  if (!dashboardData) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-zinc-500">Unable to load dashboard data. Please try refreshing.</p>
      </div>
    );
  }

  const {
    profile,
    stats,
    recentApplications,
    savedOpportunities,
    upcomingDeadlineApplications,
    recommendedOpportunities,
  } = dashboardData;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 text-white overflow-hidden relative">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName || "User"}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-8 h-8 text-white/80" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Builder Active
                </span>
                {profile?.university && (
                  <span className="text-xs text-zinc-300 hidden sm:inline-block">
                    • {profile.university}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome back, {profile?.displayName?.split(" ")[0] || "Builder"}!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
                Track your active applications, stay ahead of submission deadlines, and explore matches tailored to your profile.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/discover"
              className="px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-100 shadow-md transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Opportunities</span>
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link
          href="/saved"
          className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-amber-600 transition-colors">
              Saved Opportunities
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Bookmark className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-3">
            {stats.totalSaved}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block flex items-center gap-1">
            <span>View library</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          href="/applications"
          className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 transition-colors">
              Active In-Progress
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <FolderKanban className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-3">
            {stats.activeApplications}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block flex items-center gap-1">
            <span>Track checklist</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Upcoming Deadlines
            </span>
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-3">
            {stats.upcomingDeadlinesCount}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">Active closing soon</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Completed / Accepted
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <Trophy className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-3">
            {stats.completedApplications}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">Submissions finished</span>
        </div>
      </div>

      {/* Main Grid: Active Applications Workspace + Deadlines Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Tracked Applications
              </h2>
            </div>
            <Link
              href="/applications"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({stats.activeApplications + stats.completedApplications})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                You are not tracking any applications yet.
              </p>
              <Link
                href="/discover"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
              >
                Find an opportunity to track <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ApplicationStatusBadge status={app.status} size="sm" />
                      {app.opportunity.category && (
                        <span className="text-[11px] text-zinc-400">
                          {app.opportunity.category.name}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/applications/${app.id}`}
                      className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 line-clamp-1"
                    >
                      {app.opportunity.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                      <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${app.progressPercent}%` }}
                        />
                      </div>
                      <span>
                        {app.completedItems}/{app.totalItems} tasks ({app.progressPercent}%)
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/applications/${app.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 text-center transition-colors flex-shrink-0"
                  >
                    Open Workspace
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Urgent Deadline Alerts & Profile Skills */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Deadline Alerts
              </h3>
            </div>

            {upcomingDeadlineApplications.length === 0 ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 py-4 text-center">
                No immediate closing deadlines on your tracked list.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlineApplications.map((app) => {
                  const deadline = new Date(app.opportunity.deadlineAt!);
                  return (
                    <Link
                      key={app.id}
                      href={`/applications/${app.id}`}
                      className="block p-3 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                    >
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {app.opportunity.title}
                      </span>
                      <div className="flex items-center justify-between text-[11px] text-rose-700 dark:text-rose-400 mt-1 font-semibold">
                        <span>Closing date:</span>
                        <span>
                          {deadline.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile Focus Snapshot */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Your Focus Areas
              </h3>
              <Link
                href="/profile"
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Edit
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile?.interests && profile.interests.length > 0 ? (
                profile.interests.map((int) => (
                  <span
                    key={int.interestId}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {int.interest.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-400">No interests configured yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Opportunities for User */}
      <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Matched based on your target interests and verified technical profile
            </p>
          </div>

          <Link
            href="/discover"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Browse Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommendedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              initialSaved={savedOpportunities.some((s) => s.id === opp.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
