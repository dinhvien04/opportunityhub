import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { CategoryIcon } from "@/components/icons/category-icon";
import { getDeadlineInfo } from "@/lib/deadline";
import { cn } from "@/lib/utils";
import type { OpportunitySummary } from "../types";
import { SaveButton } from "@/features/saved/components/save-button";

interface OpportunityCardProps {
  opportunity: OpportunitySummary;
  priority?: boolean;
  initialSaved?: boolean;
}

export function OpportunityCard({
  opportunity,
  initialSaved = false,
}: OpportunityCardProps) {
  const deadline = getDeadlineInfo(opportunity.deadlineAt);

  const isFree =
    opportunity.isFree ||
    opportunity.feeAmount === "0" ||
    opportunity.feeAmount === "0.00";

  const modeLabel =
    opportunity.mode === "online"
      ? "Online"
      : opportunity.mode === "offline"
      ? "In-Person"
      : opportunity.mode === "hybrid"
      ? "Hybrid"
      : "Open";

  const locationText = [opportunity.city, opportunity.countryCode]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:border-zinc-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:border-zinc-800/90 dark:bg-zinc-900/70 dark:hover:border-zinc-700 dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-all duration-200">
      <div className="flex flex-col gap-3.5">
        {/* Top Header: Organization & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {opportunity.organization?.logoUrl ? (
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 bg-zinc-50 dark:border-zinc-700/80 dark:bg-zinc-800">
                <Image
                  src={opportunity.organization.logoUrl}
                  alt={opportunity.organization.name}
                  fill
                  className="object-contain p-1"
                  referrerPolicy="no-referrer"
                  sizes="32px"
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Building2 className="h-4 w-4" />
              </div>
            )}

            <div className="flex items-center gap-1 min-w-0">
              <span className="truncate text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {opportunity.organization?.name || "Verified Organizer"}
              </span>
              {(opportunity.organization?.verified || opportunity.verified) && (
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                  aria-label="Verified Organization"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {opportunity.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                <Sparkles className="h-2.5 w-2.5" />
                Featured
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border",
                isFree
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
              )}
            >
              {isFree ? "Free" : `${opportunity.feeAmount} ${opportunity.currency}`}
            </span>
            <SaveButton
              opportunityId={opportunity.id}
              initialSaved={initialSaved}
              size="sm"
              variant="ghost"
            />
          </div>
        </div>

        {/* Opportunity Title & Link */}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold leading-snug text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            <Link
              href={`/opportunities/${opportunity.slug}`}
              className="focus:outline-none focus-visible:underline"
            >
              {opportunity.title}
            </Link>
          </h3>

          {opportunity.shortDescription && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {opportunity.shortDescription}
            </p>
          )}
        </div>

        {/* Tags / Metadata Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {opportunity.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
              <CategoryIcon
                nameOrSlug={opportunity.category.icon || opportunity.category.slug}
                className="h-3 w-3 text-zinc-500"
              />
              {opportunity.category.name}
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400">
            <Globe2 className="h-3 w-3 text-zinc-500" />
            {modeLabel}
          </span>

          {locationText && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400 truncate max-w-[150px]">
              <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
              <span className="truncate">{locationText}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Deadline & Action */}
      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-3.5">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-400" />
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[11px] font-medium border",
              deadline.badgeClass
            )}
          >
            {deadline.text}
          </span>
        </div>

        <Link
          href={`/opportunities/${opportunity.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-emerald-300 transition-colors"
        >
          View details
          <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
