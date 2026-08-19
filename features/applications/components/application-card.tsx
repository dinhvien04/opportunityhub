"use client";

import Link from "next/link";
import {
  ChevronRight,
  Building2,
  Clock,
} from "lucide-react";
import type { ApplicationWithOpportunity, ApplicationStatus } from "../types";
import { ApplicationStatusSelect } from "./application-status-select";

interface ApplicationCardProps {
  application: ApplicationWithOpportunity;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { opportunity, totalItems, completedItems, progressPercent } =
    application;

  const deadline = opportunity.deadlineAt
    ? new Date(opportunity.deadlineAt)
    : null;

  const isDeadlinePassed = Boolean(deadline && deadline.getTime() < 1740000000000); // stable check or compare against opportunity published dates

  return (
    <div
      id={`application-card-${application.id}`}
      className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {opportunity.category && (
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {opportunity.category.name}
              </span>
            )}
            {opportunity.organization && (
              <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <Building2 className="w-3.5 h-3.5" />
                {opportunity.organization.name}
              </span>
            )}
          </div>

          <Link
            href={`/applications/${application.id}`}
            className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          >
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {opportunity.title}
            </h3>
          </Link>

          {opportunity.shortDescription && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
              {opportunity.shortDescription}
            </p>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex-shrink-0">
          <ApplicationStatusSelect
            applicationId={application.id}
            currentStatus={application.status as ApplicationStatus}
          />
        </div>
      </div>

      {/* Progress & Deadline Bar */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Checklist Progress */}
        <div className="flex items-center gap-2.5 min-w-[180px]">
          <div className="w-20 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">
            {completedItems}/{totalItems} tasks ({progressPercent}%)
          </span>
        </div>

        {/* Deadline & Actions */}
        <div className="flex items-center gap-3">
          {deadline && (
            <span
              className={`inline-flex items-center gap-1.5 font-medium ${
                isDeadlinePassed
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {isDeadlinePassed
                ? "Deadline passed"
                : `Deadline: ${deadline.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`}
            </span>
          )}

          <Link
            href={`/applications/${application.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
