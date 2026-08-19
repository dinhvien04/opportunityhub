import { redirect } from "next/navigation";
import Image from "next/image";
import { requireUser } from "@/lib/auth/guards";
import { getSession } from "@/lib/auth/session";
import { ProfileService } from "@/features/profile/service";
import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { User, ShieldCheck, Mail } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";

export const metadata = {
  title: "My Profile - OpportunityHub",
  description: "Manage your personal profile, interests, and skills.",
};

export default async function ProfilePage() {
  const currentUser = await requireUser("/login?returnTo=/profile");
  const session = await getSession();

  const [profile, allInterests, allSkills] = await Promise.all([
    ProfileService.getCompleteProfile(currentUser.userId),
    ProfileService.getAllInterests(),
    ProfileService.getAllSkills(),
  ]);

  if (!profile) {
    redirect("/onboarding");
  }

  const userEmail = session?.email || "Authenticated User";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header / Avatar Profile Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center relative overflow-hidden flex-shrink-0">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.displayName || "User"}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-10 h-10 text-zinc-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {profile.displayName || "Builder Profile"}
              </h1>
              <span className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600" title="Verified Builder">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {userEmail}
            </p>

            {profile.university && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                {profile.university} {profile.major ? `• ${profile.major}` : ""}
              </p>
            )}
          </div>
        </div>

        <div className="self-start sm:self-auto">
          <SignOutButton />
        </div>
      </div>

      {/* Profile Form */}
      <ProfileEditForm
        profile={profile}
        allInterests={allInterests}
        allSkills={allSkills}
      />
    </div>
  );
}
