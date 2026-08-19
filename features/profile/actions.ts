"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/guards";
import { ProfileService } from "./service";
import type { OnboardingInput, SkillLevel, UpdateProfileInput } from "./types";
import { z } from "zod";

const updateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100).optional(),
  username: z.string().max(50).optional(),
  bio: z.string().max(1000).optional(),
  university: z.string().max(255).optional(),
  major: z.string().max(255).optional(),
  graduationYear: z.number().int().min(2000).max(2100).nullable().optional(),
  city: z.string().max(100).optional(),
  countryCode: z.string().max(2).optional(),
  websiteUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  linkedinUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  isPublic: z.boolean().optional(),
});

export async function submitOnboardingAction(data: OnboardingInput) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized. Please sign in.");
  }

  if (!data.displayName || data.displayName.trim().length === 0) {
    throw new Error("Display name is required.");
  }

  await ProfileService.completeOnboarding(user.userId, data);

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  revalidatePath("/onboarding");

  return { success: true };
}

export async function updateProfileAction(
  data: UpdateProfileInput,
  interestIds?: string[],
  skills?: { skillId: string; level: SkillLevel }[]
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized. Please sign in.");
  }

  const validated = updateProfileSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message || "Validation error");
  }

  await ProfileService.updateProfile(user.userId, validated.data);

  if (interestIds !== undefined) {
    await ProfileService.updateInterests(user.userId, interestIds);
  }

  if (skills !== undefined) {
    await ProfileService.updateSkills(user.userId, skills);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: true };
}
