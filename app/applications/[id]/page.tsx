import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/auth/guards";
import { ApplicationService } from "@/features/applications/service";
import { ApplicationStatusSelect } from "@/features/applications/components/application-status-select";
import { ApplicationChecklist } from "@/features/applications/components/application-checklist";
import { ApplicationNotesForm } from "./application-notes-form";
import { DeleteApplicationButton } from "./delete-application-button";
import type { ApplicationStatus } from "@/features/applications/types";
import {
  ChevronLeft,
  ExternalLink,
  Building2,
  Clock,
  MapPin,
  Tag,
  DollarSign,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return {
    title: "Application Workspace - OpportunityHub",
    description: "Manage your checklist, notes, and deadlines for this opportunity.",
  };
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser(`/login?returnTo=/applications/${id}`);

  const application = await ApplicationService.getApplicationById(id, user.userId);

  if (!application) {
    notFound();
  }

  const { opportunity } = application;
  const now = new Date();
  const deadline = opportunity.deadlineAt ? new Date(opportunity.deadlineAt) : null;
  const isDeadlinePassed = Boolean(deadline && deadline < now);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb / Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/applications"
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">Application Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {opportunity.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <ApplicationStatusSelect
            applicationId={application.id}
            currentStatus={application.status as ApplicationStatus}
          />
          <DeleteApplicationButton applicationId={application.id} />
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left 2 Columns: Tasks & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Checklist Component */}
          <ApplicationChecklist
            applicationId={application.id}
            initialItems={application.checklistItems}
          />

          {/* Notes & Submission Link Form */}
          <ApplicationNotesForm
            applicationId={application.id}
            initialNotes={application.notes}
            initialExternalUrl={application.externalApplicationUrl}
            initialExternalRef={application.externalReference}
          />
        </div>

        {/* Right 1 Column: Opportunity Snapshot & Direct Link */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Opportunity Details
            </h3>

            {opportunity.coverImageUrl && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={opportunity.coverImageUrl}
                  alt={opportunity.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="space-y-3 text-xs">
              {opportunity.organization && (
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Building2 className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <span className="font-semibold">{opportunity.organization.name}</span>
                </div>
              )}

              {opportunity.category && (
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Tag className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <span>{opportunity.category.name}</span>
                </div>
              )}

              {opportunity.mode && (
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 capitalize">
                  <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <span>
                    {opportunity.mode} {opportunity.city ? `(${opportunity.city})` : ""}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <DollarSign className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span>
                  {opportunity.isFree
                    ? "Free / No Entry Fee"
                    : `${opportunity.feeAmount} ${opportunity.currency}`}
                </span>
              </div>

              {deadline && (
                <div
                  className={`p-3 rounded-xl border ${
                    isDeadlinePassed
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                      : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {isDeadlinePassed ? "Deadline Expired" : "Application Deadline"}
                    </span>
                  </div>
                  <p className="mt-1 font-bold">
                    {deadline.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <Link
                href={`/opportunities/${opportunity.slug}`}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 text-center block transition-colors"
              >
                View Full Opportunity Post
              </Link>

              {opportunity.registrationUrl && (
                <a
                  href={opportunity.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Open Official Registration</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
