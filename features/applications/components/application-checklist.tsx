"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Loader2,
  ListTodo,
} from "lucide-react";
import type { ApplicationChecklistItem } from "@/lib/db/schema";
import {
  addChecklistItemAction,
  deleteChecklistItemAction,
  toggleChecklistItemAction,
} from "../actions";

interface ApplicationChecklistProps {
  applicationId: string;
  initialItems: ApplicationChecklistItem[];
}

export function ApplicationChecklist({
  applicationId,
  initialItems,
}: ApplicationChecklistProps) {
  const [items, setItems] = useState<ApplicationChecklistItem[]>(initialItems);
  const [newTitle, setNewTitle] = useState("");
  const [newDueAt, setNewDueAt] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  const total = items.length;
  const completed = items.filter((i) => i.isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleToggle = (item: ApplicationChecklistItem) => {
    const nextCompleted = !item.isCompleted;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              isCompleted: nextCompleted,
              completedAt: nextCompleted ? new Date() : null,
            }
          : i
      )
    );

    startTransition(async () => {
      try {
        await toggleChecklistItemAction(item.id, applicationId, nextCompleted);
      } catch (err) {
        console.error("Failed to toggle checklist item:", err);
        // Revert
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isCompleted: !nextCompleted } : i))
        );
      }
    });
  };

  const handleDelete = (itemId: string) => {
    const prevItems = [...items];
    setItems((prev) => prev.filter((i) => i.id !== itemId));

    startTransition(async () => {
      try {
        await deleteChecklistItemAction(itemId, applicationId);
      } catch (err) {
        console.error("Failed to delete checklist item:", err);
        setItems(prevItems);
      }
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const title = newTitle.trim();
    const dueAtStr = newDueAt ? newDueAt : undefined;

    setNewTitle("");
    setNewDueAt("");
    setIsAdding(false);

    startTransition(async () => {
      try {
        const res = await addChecklistItemAction(
          applicationId,
          title,
          undefined,
          dueAtStr
        );
        if (res.success && res.item) {
          setItems((prev) => [...prev, res.item as ApplicationChecklistItem]);
        }
      } catch (err) {
        console.error("Failed to add checklist item:", err);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Application Checklist
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Track milestones, required materials, and submission stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {percentage}%
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1.5">
              ({completed}/{total} done)
            </span>
          </div>
          <div className="w-24 sm:w-32 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-sm">
            No checklist items yet. Add your first step below!
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                item.isCompleted
                  ? "bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/40 text-zinc-400 dark:text-zinc-500"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div
                onClick={() => handleToggle(item)}
                className="flex items-center gap-3 flex-1 cursor-pointer select-none"
              >
                <button
                  type="button"
                  className="flex-shrink-0 focus:outline-none"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium ${
                      item.isCompleted ? "line-through" : ""
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.dueAt && (
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Due: {new Date(item.dueAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                title="Delete item"
                className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 p-1.5 rounded-lg transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add item form / button */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="mt-4 p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
          <input
            type="text"
            placeholder="e.g. Request transcript from university registrar"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            className="w-full text-sm px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Due date:</label>
              <input
                type="date"
                value={newDueAt}
                onChange={(e) => setNewDueAt(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim() || isPending}
                className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1"
              >
                {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                Add Task
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full py-2.5 px-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Checklist Task
        </button>
      )}
    </div>
  );
}
