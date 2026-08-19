import type {
  Application,
  ApplicationChecklistItem,
  Opportunity,
  Organization,
  Category,
} from "@/lib/db/schema";

export type ApplicationStatus =
  | "interested"
  | "preparing"
  | "submitted"
  | "reviewing"
  | "interview"
  | "waitlisted"
  | "accepted"
  | "rejected"
  | "withdrawn";

export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; bgClass: string; textClass: string; borderClass: string }
> = {
  interested: {
    label: "Interested",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-500/20",
  },
  preparing: {
    label: "Preparing",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-500/20",
  },
  submitted: {
    label: "Submitted",
    bgClass: "bg-indigo-500/10",
    textClass: "text-indigo-700 dark:text-indigo-300",
    borderClass: "border-indigo-500/20",
  },
  reviewing: {
    label: "Under Review",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-700 dark:text-purple-300",
    borderClass: "border-purple-500/20",
  },
  interview: {
    label: "Interview",
    bgClass: "bg-cyan-500/10",
    textClass: "text-cyan-700 dark:text-cyan-300",
    borderClass: "border-cyan-500/20",
  },
  waitlisted: {
    label: "Waitlisted",
    bgClass: "bg-orange-500/10",
    textClass: "text-orange-700 dark:text-orange-300",
    borderClass: "border-orange-500/20",
  },
  accepted: {
    label: "Accepted 🎉",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-500/20",
  },
  rejected: {
    label: "Rejected",
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-700 dark:text-rose-300",
    borderClass: "border-rose-500/20",
  },
  withdrawn: {
    label: "Withdrawn",
    bgClass: "bg-zinc-500/10",
    textClass: "text-zinc-700 dark:text-zinc-300",
    borderClass: "border-zinc-500/20",
  },
};

export interface ApplicationWithOpportunity extends Omit<Application, "status"> {
  status: ApplicationStatus;
  opportunity: Opportunity & {
    category: Category | null;
    organization: Organization | null;
  };
  checklistItems: ApplicationChecklistItem[];
  totalItems: number;
  completedItems: number;
  progressPercent: number;
}
