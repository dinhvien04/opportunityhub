"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export function SignOutButton({ className = "" }: { className?: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      } catch (err) {
        console.error("Failed to sign out:", err);
      }
    });
  };

  return (
    <button
      id="sign-out-btn"
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-900/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all ${className}`}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>Sign Out</span>
    </button>
  );
}
