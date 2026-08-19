import Link from "next/link";
import { Compass, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                <Compass className="h-4 w-4 stroke-[2.2]" />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Opportunity<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-md">
              The premier discovery platform connecting students and ambitious learners with global competitions, scholarships, fellowships, internships, and transformative tech programs.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                Verified Opportunities
              </span>
              <span>&bull;</span>
              <span>AI Riser Vietnam 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 tracking-wider uppercase">
              Explore
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/discover" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  All Opportunities
                </Link>
              </li>
              <li>
                <Link href="/discover?category=competition" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Competitions & Hackathons
                </Link>
              </li>
              <li>
                <Link href="/discover?category=scholarship" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Scholarships & Grants
                </Link>
              </li>
              <li>
                <Link href="/discover?category=internship" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Internships & Fellowships
                </Link>
              </li>
              <li>
                <Link href="/discover?category=program" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Training Programs & Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 tracking-wider uppercase">
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/discover?price=free" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Free Opportunities
                </Link>
              </li>
              <li>
                <Link href="/discover?mode=online" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Online & Remote Events
                </Link>
              </li>
              <li>
                <Link href="/discover?deadline=this_month" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Closing This Month
                </Link>
              </li>
              <li>
                <a href="/api/health/db" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  System Health & Diagnostics
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} OpportunityHub. Built for ambitious talent.</p>
          <p className="flex items-center gap-1">
            Empowering next-generation builders and scholars
          </p>
        </div>
      </div>
    </footer>
  );
}
