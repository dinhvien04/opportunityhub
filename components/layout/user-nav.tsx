"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

interface UserData {
  userId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
}

export function UserNav() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition-all active:scale-95"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        id="user-nav-dropdown-btn"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pl-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 transition-all"
      >
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hidden sm:inline-block max-w-[120px] truncate">
          {user.displayName?.split(" ")[0] || "Account"}
        </span>
        <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 overflow-hidden relative border border-indigo-100 dark:border-indigo-900">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.displayName || "User"}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-1" />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            {/* User Info Header */}
            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {user.displayName || "Builder"}
              </p>
              <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
            </div>

            {/* Links */}
            <div className="py-1.5 space-y-0.5">
              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/applications"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
              >
                <FolderKanban className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Application Tracker</span>
              </Link>

              <Link
                href="/saved"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
              >
                <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Saved Opportunities</span>
              </Link>

              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>Profile & Skills</span>
              </Link>
            </div>

            {/* Sign Out */}
            <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
