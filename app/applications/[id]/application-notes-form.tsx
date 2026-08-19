"use client";

import { useState, useTransition } from "react";
import { updateApplicationNotesAction } from "@/features/applications/actions";
import { Check, Edit3, Loader2, Save } from "lucide-react";

interface ApplicationNotesFormProps {
  applicationId: string;
  initialNotes: string | null;
  initialExternalUrl: string | null;
  initialExternalRef: string | null;
}

export function ApplicationNotesForm({
  applicationId,
  initialNotes,
  initialExternalUrl,
  initialExternalRef,
}: ApplicationNotesFormProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [externalUrl, setExternalUrl] = useState(initialExternalUrl || "");
  const [externalRef, setExternalRef] = useState(initialExternalRef || "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateApplicationNotesAction(
          applicationId,
          notes.trim() || null,
          externalUrl.trim() || null,
          externalRef.trim() || null
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        console.error("Failed to save application notes:", err);
      }
    });
  };

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Notes & External Reference
          </h3>
        </div>

        {saved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Official Application Portal URL
          </label>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://portal.organization.org/my-sub..."
            className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Submission / Confirmation ID
          </label>
          <input
            type="text"
            value={externalRef}
            onChange={(e) => setExternalRef(e.target.value)}
            placeholder="e.g. SUB-2026-9482"
            className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          Personal Notes & Preparation Log
        </label>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Keep track of essay drafts, team members, interview questions, pitch deck links..."
          className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white/90 shadow-sm flex items-center gap-1.5 transition-all"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>Save Notes</span>
        </button>
      </div>
    </form>
  );
}
