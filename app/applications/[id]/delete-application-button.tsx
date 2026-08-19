"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteApplicationAction } from "@/features/applications/actions";

export function DeleteApplicationButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteApplicationAction(applicationId);
        router.push("/applications");
      } catch (err) {
        console.error("Failed to delete application:", err);
      }
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
          Remove tracking?
        </span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors flex items-center gap-1"
        >
          {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
          Yes, Delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded-lg text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      title="Delete application"
      className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
