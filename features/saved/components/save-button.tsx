"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleSaveOpportunityAction } from "../actions";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  opportunityId: string;
  initialSaved?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  variant?: "default" | "ghost" | "floating";
}

export function SaveButton({
  opportunityId,
  initialSaved = false,
  size = "md",
  showLabel = false,
  className = "",
  variant = "default",
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic toggle
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    startTransition(async () => {
      try {
        const res = await toggleSaveOpportunityAction(opportunityId);
        if (res.unauthorized) {
          setIsSaved(false);
          router.push(`/login?returnTo=/opportunities/${opportunityId}`);
          return;
        }
        if (res.success && res.saved !== undefined) {
          setIsSaved(res.saved);
        } else {
          // Revert if error
          setIsSaved(!nextSaved);
        }
      } catch (err) {
        console.error("Failed to toggle save:", err);
        setIsSaved(!nextSaved);
      }
    });
  };

  const sizeClasses = {
    sm: "p-1.5 text-xs gap-1.5",
    md: "p-2 text-sm gap-2",
    lg: "px-4 py-2.5 text-sm gap-2 font-medium",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (variant === "floating") {
    return (
      <button
        id={`save-btn-${opportunityId}`}
        onClick={handleToggle}
        disabled={isPending}
        title={isSaved ? "Remove from saved" : "Save opportunity"}
        className={`inline-flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 ${
          isSaved
            ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 hover:bg-amber-600"
            : "bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm"
        } ${sizeClasses[size]} ${className}`}
      >
        <Bookmark
          className={`${iconSizes[size]} ${
            isSaved ? "fill-current" : ""
          } transition-transform active:scale-90`}
        />
        {showLabel && (
          <span className="font-medium">{isSaved ? "Saved" : "Save"}</span>
        )}
      </button>
    );
  }

  return (
    <button
      id={`save-btn-${opportunityId}`}
      onClick={handleToggle}
      disabled={isPending}
      title={isSaved ? "Saved to your list" : "Bookmark this opportunity"}
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ${
        isSaved
          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50"
          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent"
      } ${sizeClasses[size]} ${className}`}
    >
      <Bookmark
        className={`${iconSizes[size]} ${
          isSaved ? "fill-amber-500 text-amber-500" : ""
        } transition-transform active:scale-90`}
      />
      {showLabel && <span>{isSaved ? "Saved" : "Save Opportunity"}</span>}
    </button>
  );
}
