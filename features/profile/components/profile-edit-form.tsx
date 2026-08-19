"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Globe,
  GitBranch,
  Briefcase,
  GraduationCap,
  Loader2,
  Save,
  User,
} from "lucide-react";
import type { Interest, Skill } from "@/lib/db/schema";
import type { SkillLevel, UserProfileComplete } from "../types";
import { updateProfileAction } from "../actions";

interface ProfileEditFormProps {
  profile: UserProfileComplete;
  allInterests: Interest[];
  allSkills: Skill[];
}

export function ProfileEditForm({
  profile,
  allInterests,
  allSkills,
}: ProfileEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [university, setUniversity] = useState(profile.university || "");
  const [major, setMajor] = useState(profile.major || "");
  const [graduationYear, setGraduationYear] = useState<string>(
    profile.graduationYear ? String(profile.graduationYear) : ""
  );
  const [city, setCity] = useState(profile.city || "");
  const [websiteUrl, setWebsiteUrl] = useState(profile.websiteUrl || "");
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || "");
  const [isPublic, setIsPublic] = useState(profile.isPublic);

  // Interests & Skills
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile.interests.map((i) => i.interestId)
  );
  const [selectedSkills, setSelectedSkills] = useState<
    { skillId: string; level: SkillLevel }[]
  >(
    profile.skills.map((s) => ({
      skillId: s.skillId,
      level: s.level as SkillLevel,
    }))
  );

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) => {
      const exists = prev.find((s) => s.skillId === skillId);
      if (exists) {
        return prev.filter((s) => s.skillId !== skillId);
      } else {
        return [...prev, { skillId, level: "intermediate" }];
      }
    });
  };

  const setSkillLevel = (skillId: string, level: SkillLevel) => {
    setSelectedSkills((prev) =>
      prev.map((s) => (s.skillId === skillId ? { ...s, level } : s))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(false);

    startTransition(async () => {
      try {
        await updateProfileAction(
          {
            displayName: displayName.trim(),
            bio: bio.trim() || undefined,
            university: university.trim() || undefined,
            major: major.trim() || undefined,
            graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
            city: city.trim() || undefined,
            websiteUrl: websiteUrl.trim() || undefined,
            githubUrl: githubUrl.trim() || undefined,
            linkedinUrl: linkedinUrl.trim() || undefined,
            isPublic,
          },
          selectedInterests,
          selectedSkills
        );

        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
        router.refresh();
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMsg(error.message || "Failed to update profile");
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          Profile updated successfully!
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Basic Info Section */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Location / City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Ho Chi Minh City"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Bio / Summary
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other builders and organizers about yourself, your hackathon goals, and research interests..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Education & Background
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              University / School
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. VNU-HCM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Major / Field
            </label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Graduation Year
            </label>
            <input
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="2027"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Social & Portfolio Links */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Links & Profiles
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourportfolio.dev"
              className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0">
              <GitBranch className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/yourhandle"
              className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourhandle"
              className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Interests Selection */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Interests & Domains
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Select areas you want prioritized on your home feed and deadline reminders.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allInterests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                }`}
              >
                <span className="truncate block">{interest.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Selection */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Technical Skills & Strengths
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Highlight your tech stack for team matching and competition eligibility.
        </p>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {allSkills.map((skill) => {
            const selected = selectedSkills.find((s) => s.skillId === skill.id);
            const isSelected = Boolean(selected);

            return (
              <div
                key={skill.id}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800"
                    : "bg-zinc-50/30 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{skill.name}</span>
                </button>

                {isSelected && (
                  <div className="flex items-center gap-1">
                    {(["beginner", "intermediate", "advanced", "expert"] as SkillLevel[]).map(
                      (lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSkillLevel(skill.id, lvl)}
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors ${
                            selected?.level === lvl
                              ? "bg-indigo-600 text-white"
                              : "bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700"
                          }`}
                        >
                          {lvl[0]}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
          />
          <div>
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Public Profile
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Allow organizers and other builders to view your public profile and skills.
            </p>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-white/90 shadow-md flex items-center gap-2 transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
