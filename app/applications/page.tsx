import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { ApplicationService } from "@/features/applications/service";
import { ApplicationCard } from "@/features/applications/components/application-card";
import type { ApplicationStatus } from "@/features/applications/types";
import {
  FolderKanban,
  Plus,
  Compass,
  Clock,
  Send,
  Trophy,
} from "lucide-react";

export const metadata = {
  title: "Application Tracker - OpportunityHub",
  description: "Track your hackathon submissions, grant deadlines, and application status.",
};

const TABS: { id: ApplicationStatus | "all"; label: string }[] = [
  { id: "all", label: "All Tracked" },
  { id: "preparing", label: "Preparing" },
  { id: "submitted", label: "Submitted" },
  { id: "reviewing", label: "Under Review" },
  { id: "interview", label: "Interview" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser("/login?returnTo=/applications");

  const statusFilter = (params.status || "all") as ApplicationStatus | "all";
  const allApplications = await ApplicationService.getApplications(user.userId);
  const filteredApplications =
    statusFilter === "all"
      ? allApplications
      : allApplications.filter((a) => a.status === statusFilter);

  // Metrics
  const totalCount = allApplications.length;
  const preparingCount = allApplications.filter((a) => a.status === "preparing").length;
  const submittedCount = allApplications.filter((a) =>
    ["submitted", "reviewing", "interview"].includes(a.status)
  ).length;
  const acceptedCount = allApplications.filter((a) => a.status === "accepted").length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
              <FolderKanban className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
              Application Tracker
            </h1>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Monitor deadlines, manage task checklists, and update your submission progress
          </p>
        </div>

        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white/90 shadow-sm transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Find New Opportunity</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Tracked</span>
            <FolderKanban className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">{totalCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Preparing</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">{preparingCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">In Review</span>
            <Send className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">{submittedCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Accepted</span>
            <Trophy className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">{acceptedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-100 dark:border-zinc-800">
        {TABS.map((tab) => {
          const isSelected = statusFilter === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.id === "all" ? "/applications" : `/applications?status=${tab.id}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="mt-6">
        {filteredApplications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400 mb-4">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              No applications in this view
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Start tracking hackathons, competitions, or grants to manage tasks and stay on top of deadlines.
            </p>
            <div className="mt-6">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white/90 transition-all shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Opportunities</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
