import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  ExternalLink,
  FileText,
  Globe2,
  MapPin,
  Sparkles,
  Users,
  Check,
} from "lucide-react";
import { OpportunityService } from "@/features/opportunities/service";
import { CategoryIcon } from "@/components/icons/category-icon";
import { getDeadlineInfo } from "@/lib/deadline";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/guards";
import { SavedService } from "@/features/saved/service";
import { ApplicationService } from "@/features/applications/service";
import { SaveButton } from "@/features/saved/components/save-button";
import { TrackApplicationButton } from "@/features/applications/components/track-application-button";

export const dynamic = "force-dynamic";

interface OpportunityDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: OpportunityDetailPageProps) {
  const { slug } = await params;
  const opportunity = await OpportunityService.getBySlug(slug);

  if (!opportunity) {
    return {
      title: "Opportunity Not Found",
    };
  }

  return {
    title: opportunity.title,
    description: opportunity.shortDescription || opportunity.description?.slice(0, 160),
  };
}

export default async function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  const { slug } = await params;
  const opportunity = await OpportunityService.getBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  const deadline = getDeadlineInfo(opportunity.deadlineAt);
  const isFree =
    opportunity.isFree ||
    opportunity.feeAmount === "0" ||
    opportunity.feeAmount === "0.00";

  const user = await getCurrentUser();
  let isSaved = false;
  let existingApplicationId: string | null = null;
  let existingStatus: string | null = null;

  if (user) {
    isSaved = await SavedService.isSaved(user.userId, opportunity.id);
    const existingApp = await ApplicationService.getApplicationByOpportunity(
      user.userId,
      opportunity.id
    );
    if (existingApp) {
      existingApplicationId = existingApp.id;
      existingStatus = existingApp.status;
    }
  }

  const locationText = [opportunity.venue, opportunity.city, opportunity.countryCode]
    .filter(Boolean)
    .join(", ");

  const applyUrl = opportunity.registrationUrl || opportunity.sourceUrl || "#";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Back Button */}
      <div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all opportunities
        </Link>
      </div>

      {/* Header Banner */}
      <header className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Category & Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {opportunity.category && (
                <Link
                  href={`/discover?category=${opportunity.category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                >
                  <CategoryIcon
                    nameOrSlug={opportunity.category.icon || opportunity.category.slug}
                    className="h-3.5 w-3.5"
                  />
                  {opportunity.category.name}
                </Link>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                <Globe2 className="h-3.5 w-3.5 text-zinc-400" />
                {opportunity.mode ? opportunity.mode.toUpperCase() : "OPEN"}
              </span>

              {opportunity.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              {opportunity.title}
            </h1>

            {/* Organization Info */}
            <div className="flex items-center gap-3 pt-1">
              {opportunity.organization?.logoUrl ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                  <Image
                    src={opportunity.organization.logoUrl}
                    alt={opportunity.organization.name}
                    fill
                    className="object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <Building2 className="h-5 w-5" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {opportunity.organization?.name || "Verified Organizer"}
                  </span>
                  {(opportunity.organization?.verified || opportunity.verified) && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                {opportunity.organization?.city && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {opportunity.organization.city}, {opportunity.organization.countryCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Apply / Registration Action Card */}
          <div className="flex flex-col gap-2.5 min-w-[240px] md:self-center">
            {applyUrl !== "#" ? (
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all text-center"
              >
                Apply / Register Now
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 cursor-not-allowed"
              >
                Registration Closed
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <SaveButton
                opportunityId={opportunity.id}
                initialSaved={isSaved}
                showLabel={true}
                size="md"
              />
              <TrackApplicationButton
                opportunityId={opportunity.id}
                existingApplicationId={existingApplicationId}
                existingStatus={existingStatus}
                size="md"
              />
            </div>

            {opportunity.sourceUrl && (
              <a
                href={opportunity.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors pt-1"
              >
                Official Announcement
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid: Details Body + Snapshot Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Full Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview / Description */}
          <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Overview & Details
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {opportunity.description || opportunity.shortDescription || "No detailed description provided."}
            </div>
          </section>

          {/* Benefits / Prizes */}
          {opportunity.benefits && opportunity.benefits.length > 0 && (
            <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Benefits & Prizes
                </h2>
              </div>
              <ul className="space-y-3">
                {opportunity.benefits.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {b.title}
                      </h3>
                      {b.description && (
                        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {b.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Eligibility */}
          {opportunity.eligibility && opportunity.eligibility.length > 0 && (
            <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Eligibility Criteria
                </h2>
              </div>
              <div className="space-y-2.5">
                {opportunity.eligibility.map((el) => (
                  <div
                    key={el.id}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {el.criterion}
                      </span>
                      {el.details && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {el.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Requirements & Submission
                </h2>
              </div>
              <ul className="space-y-2.5">
                {opportunity.requirements.map((req) => (
                  <li
                    key={req.id}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {req.name}
                    </div>
                    {req.description && (
                      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                        {req.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills & Tags */}
          {((opportunity.skills && opportunity.skills.length > 0) ||
            (opportunity.tags && opportunity.tags.length > 0)) && (
            <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Skills & Relevant Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills?.map((s) => (
                  <span
                    key={s.skill.id}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
                  >
                    {s.skill.name}
                  </span>
                ))}
                {opportunity.tags?.map((t) => (
                  <span
                    key={t.id}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Key Facts Snapshot & Organizer Profile */}
        <div className="lg:col-span-1 space-y-6">
          {/* Key Facts Card */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Key Opportunity Facts
            </h3>

            <div className="space-y-4 text-xs">
              {/* Deadline */}
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Application Deadline
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {deadline.formattedDate}
                  </div>
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold border"
                  >
                    {deadline.text}
                  </span>
                </div>
              </div>

              {/* Cost / Fee */}
              <div className="flex items-start gap-3">
                <Coins className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Participation Fee
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {isFree ? "Free (No registration fee)" : `${opportunity.feeAmount} ${opportunity.currency}`}
                  </div>
                </div>
              </div>

              {/* Mode & Venue */}
              <div className="flex items-start gap-3">
                <Globe2 className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Format & Mode
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 mt-0.5 capitalize">
                    {opportunity.mode || "Online"}
                  </div>
                  {locationText && (
                    <div className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {locationText}
                    </div>
                  )}
                </div>
              </div>

              {/* Event Dates */}
              {(opportunity.startAt || opportunity.endAt) && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Timeline
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {formatDate(opportunity.startAt)} {opportunity.endAt && `— ${formatDate(opportunity.endAt)}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Team Size */}
              {(opportunity.teamMinSize || opportunity.teamMaxSize) && (
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Team Requirements
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {opportunity.teamMinSize === opportunity.teamMaxSize
                        ? `${opportunity.teamMinSize} members`
                        : `${opportunity.teamMinSize || 1} to ${opportunity.teamMaxSize || "any"} members`}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Apply & Tracker CTA in Snapshot */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              {applyUrl !== "#" ? (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition-colors shadow-sm"
                >
                  Go to Official Portal
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}

              <TrackApplicationButton
                opportunityId={opportunity.id}
                existingApplicationId={existingApplicationId}
                existingStatus={existingStatus}
                size="md"
                className="w-full"
              />

              <SaveButton
                opportunityId={opportunity.id}
                initialSaved={isSaved}
                showLabel={true}
                size="md"
                className="w-full"
              />
            </div>
          </div>

          {/* Organizer Profile Card */}
          {opportunity.organization && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                About the Host
              </h3>

              <div className="flex items-center gap-3">
                {opportunity.organization.logoUrl ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                    <Image
                      src={opportunity.organization.logoUrl}
                      alt={opportunity.organization.name}
                      fill
                      className="object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <Building2 className="h-6 w-6" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {opportunity.organization.name}
                    </span>
                    {opportunity.organization.verified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                    {opportunity.organizationDetail?.organizationType || "Organization"}
                  </span>
                </div>
              </div>

              {opportunity.organizationDetail?.description && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {opportunity.organizationDetail.description}
                </p>
              )}

              {opportunity.organizationDetail?.websiteUrl && (
                <a
                  href={opportunity.organizationDetail.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Visit Official Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
