export interface DeadlineInfo {
  status: "none" | "active" | "closing_soon" | "tomorrow" | "today" | "closed";
  text: string;
  daysLeft: number | null;
  isClosed: boolean;
  formattedDate: string;
  badgeClass: string;
}

export function getDeadlineInfo(
  deadlineInput: string | Date | null | undefined,
  nowInput?: Date
): DeadlineInfo {
  if (!deadlineInput) {
    return {
      status: "none",
      text: "No deadline specified",
      daysLeft: null,
      isClosed: false,
      formattedDate: "Flexible",
      badgeClass: "bg-zinc-800/60 text-zinc-400 border-zinc-700/50",
    };
  }

  const deadline =
    typeof deadlineInput === "string" ? new Date(deadlineInput) : deadlineInput;

  if (isNaN(deadline.getTime())) {
    return {
      status: "none",
      text: "Invalid deadline",
      daysLeft: null,
      isClosed: false,
      formattedDate: "Invalid date",
      badgeClass: "bg-zinc-800/60 text-zinc-400 border-zinc-700/50",
    };
  }

  const now = nowInput || new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(deadline);

  if (diffMs <= 0) {
    return {
      status: "closed",
      text: "Closed",
      daysLeft: 0,
      isClosed: true,
      formattedDate,
      badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };
  }

  // Closes today (less than 24 hours and on same calendar day or under 24h)
  if (diffHours <= 24) {
    return {
      status: "today",
      text: "Closes today",
      daysLeft: 0,
      isClosed: false,
      formattedDate,
      badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse",
    };
  }

  if (diffHours <= 48) {
    return {
      status: "tomorrow",
      text: "Closes tomorrow",
      daysLeft: 1,
      isClosed: false,
      formattedDate,
      badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    };
  }

  if (diffDays <= 7) {
    return {
      status: "closing_soon",
      text: `${diffDays} days left`,
      daysLeft: diffDays,
      isClosed: false,
      formattedDate,
      badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    };
  }

  return {
    status: "active",
    text: `${diffDays} days left`,
    daysLeft: diffDays,
    isClosed: false,
    formattedDate,
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
}
