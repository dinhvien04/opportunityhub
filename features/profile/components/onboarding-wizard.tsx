"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  Heart,
  Wrench,
  Rocket,
  Loader2,
} from "lucide-react";
import type { Interest, Skill, UserProfile } from "@/lib/db/schema";
import type { SkillLevel } from "../types";
import { submitOnboardingAction } from "../actions";

interface OnboardingWizardProps {
  user: UserProfile;
  interests: Interest[];
  skills: Skill[];
}

export function OnboardingWizard({
  user,
  interests,
  skills,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [university, setUniversity] = useState(user.university || "");
  const [major, setMajor] = useState(user.major || "");
  const [graduationYear, setGraduationYear] = useState<string>(
    user.graduationYear ? String(user.graduationYear) : "2027"
  );
  const [city, setCity] = useState(user.city || "Ho Chi Minh City");

  // Selected Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Selected Skills
  const [selectedSkills, setSelectedSkills] = useState<
    { skillId: string; level: SkillLevel }[]
  >([]);

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

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!displayName.trim()) {
        setErrorMsg("Please enter your display name.");
        return;
      }
    }
    if (step === 2) {
      if (selectedInterests.length === 0) {
        setErrorMsg("Please select at least 1 interest to receive personalized recommendations.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await submitOnboardingAction({
          displayName: displayName.trim(),
          university: university.trim() || undefined,
          major: major.trim() || undefined,
          graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
          city: city.trim() || undefined,
          interestIds: selectedInterests,
          skills: selectedSkills,
        });

        router.push("/dashboard");
        router.refresh();
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMsg(error.message || "Failed to save profile. Please try again.");
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
          <span>Step {step} of 4</span>
          <span>
            {step === 1 && "Profile Essentials"}
            {step === 2 && "Areas of Interest"}
            {step === 3 && "Key Skills & Strengths"}
            {step === 4 && "Review & Launch"}
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Welcome to OpportunityHub
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Let’s set up your builder profile to find high-impact competitions, grants & internships.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name / Display Name *
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Nguyen"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  University / Institution
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. VNU University of Technology"
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
                  placeholder="e.g. Computer Science / AI"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Expected Graduation Year
                </label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Ho Chi Minh City, Hanoi, Da Nang"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interests */}
      {step === 2 && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                What fields excite you most?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Select your focus areas to customize match scoring and deadline alerts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {interests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all duration-150 flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm"
                      : "bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <span className="truncate">{interest.name}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Skills */}
      {step === 3 && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Skills & Tech Stack
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose the tools and skills you bring to hackathons, research, and teams.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {skills.map((skill) => {
              const selected = selectedSkills.find((s) => s.skillId === skill.id);
              const isSelected = Boolean(selected);

              return (
                <div
                  key={skill.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800"
                      : "bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300"
                  }`}
                >
                  <div
                    onClick={() => toggleSkill(skill.id)}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {skill.name}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {(["beginner", "intermediate", "advanced", "expert"] as SkillLevel[]).map(
                        (lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSkillLevel(skill.id, lvl)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider capitalize transition-colors ${
                              selected?.level === lvl
                                ? "bg-indigo-600 text-white"
                                : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            {lvl}
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
      )}

      {/* STEP 4: Review & Complete */}
      {step === 4 && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                You’re all set!
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Confirm your summary to unlock your personalized OpportunityHub dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px] block mb-1">
                Profile Summary
              </span>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {displayName}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                {[university, major, graduationYear ? `Class of ${graduationYear}` : null, city]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px] block mb-2">
                Selected Interests ({selectedInterests.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedInterests.map((id) => {
                  const intObj = interests.find((i) => i.id === id);
                  return (
                    <span
                      key={id}
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {intObj?.name || id}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px] block mb-2">
                Skills & Experience ({selectedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSkills.map((s) => {
                  const skillObj = skills.find((sk) => sk.id === s.skillId);
                  return (
                    <span
                      key={s.skillId}
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {skillObj?.name} <span className="opacity-60 font-normal">({s.level})</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white/90 flex items-center gap-1.5 transition-all shadow-sm"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-xs font-semibold hover:opacity-95 flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Launching Dashboard...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                Complete & Launch
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
