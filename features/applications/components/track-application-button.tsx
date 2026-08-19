"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, FolderCheck, Plus } from "lucide-react";
import { createOrTrackApplicationAction } from "../actions";

interface TrackApplicationButtonProps {
  opportunityId: string;
  existingApplicationId?: string | null;
  existingStatus?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TrackApplicationButton({
  opportunityId,
  existingApplicationId,
  size = "md",
  className = "",
}: TrackApplicationButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [trackedId, setTrackedId] = useState<string | null>(
    existingApplicationId || null
  );
  const router = useRouter();

  const handleTrack = () => {
    if (trackedId) {
      router.push(`/applications/${trackedId}`);
      return;
    }

    startTransition(async () => {
      try {
        const res = await createOrTrackApplicationAction(opportunityId, "preparing");
        if (res.unauthorized) {
          router.push(`/login?returnTo=/opportunities/${opportunityId}`);
          return;
        }
        if (res.success && res.applicationId) {
          setTrackedId(res.applicationId);
          router.push(`/applications/${res.applicationId}`);
        }
      } catch (err) {
        console.error("Failed to start application tracking:", err);
      }
    });
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-semibold",
  };

  if (trackedId) {
    return (
      <button
        id={`track-app-btn-${opportunityId}`}
        onClick={handleTrack}
        className={`inline-flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all ${sizeClasses[size]} ${className}`}
      >
        <FolderCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>View In Tracker</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
      </button>
    );
  }

  return (
    <button
      id={`track-app-btn-${opportunityId}`}
      onClick={handleTrack}
      disabled={isPending}
      className={`inline-flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white/90 font-medium transition-all shadow-sm active:scale-[0.98] ${sizeClasses[size]} ${className}`}
    >
      <Plus className="w-4 h-4" />
      <span>{isPending ? "Starting Tracker..." : "Track Application"}</span>
    </button>
  );
}
