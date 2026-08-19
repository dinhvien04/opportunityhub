import type { ApplicationStatus } from "../types";
import { APPLICATION_STATUS_CONFIG } from "../types";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ApplicationStatusBadge({
  status,
  size = "md",
  className = "",
}: ApplicationStatusBadgeProps) {
  const config =
    APPLICATION_STATUS_CONFIG[status as ApplicationStatus] || {
      label: status,
      bgClass: "bg-zinc-500/10",
      textClass: "text-zinc-700 dark:text-zinc-300",
      borderClass: "border-zinc-500/20",
    };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses[size]} ${className} tracking-wide`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{config.label}</span>
    </span>
  );
}
