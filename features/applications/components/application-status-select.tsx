"use client";

import { useState, useTransition } from "react";
import { updateApplicationStatusAction } from "../actions";
import type { ApplicationStatus } from "../types";
import { APPLICATION_STATUS_CONFIG } from "../types";
import { Check, ChevronDown, Loader2 } from "lucide-react";

interface ApplicationStatusSelectProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  onStatusChange?: (newStatus: ApplicationStatus) => void;
  className?: string;
}

const ALL_STATUSES: ApplicationStatus[] = [
  "interested",
  "preparing",
  "submitted",
  "reviewing",
  "interview",
  "waitlisted",
  "accepted",
  "rejected",
  "withdrawn",
];

export function ApplicationStatusSelect({
  applicationId,
  currentStatus,
  onStatusChange,
  className = "",
}: ApplicationStatusSelectProps) {
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (newStatus: ApplicationStatus) => {
    if (newStatus === status) {
      setIsOpen(false);
      return;
    }

    setStatus(newStatus);
    setIsOpen(false);
    onStatusChange?.(newStatus);

    startTransition(async () => {
      try {
        await updateApplicationStatusAction(applicationId, newStatus);
      } catch (err) {
        console.error("Failed to update application status:", err);
        setStatus(currentStatus);
      }
    });
  };

  const currentConfig = APPLICATION_STATUS_CONFIG[status] || {
    label: status,
    bgClass: "bg-zinc-100 dark:bg-zinc-800",
    textClass: "text-zinc-800 dark:text-zinc-200",
    borderClass: "border-zinc-300 dark:border-zinc-700",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        id={`status-select-btn-${applicationId}`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all duration-150 ${currentConfig.bgClass} ${currentConfig.textClass} ${currentConfig.borderClass} hover:opacity-90 active:scale-95`}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-current" />
        )}
        <span>{currentConfig.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Update Status
            </div>
            {ALL_STATUSES.map((s) => {
              const cfg = APPLICATION_STATUS_CONFIG[s];
              const isSelected = s === status;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                    isSelected
                      ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${cfg.bgClass.replace(
                        "/10",
                        ""
                      )} bg-current`}
                    />
                    <span>{cfg.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
