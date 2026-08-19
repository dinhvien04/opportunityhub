import { getDb, schema } from "@/lib/db";
import { asc, eq } from "drizzle-orm";
import type {
  Interest,
  Skill,
  UserProfile,
} from "@/lib/db/schema";
import type {
  OnboardingInput,
  SkillLevel,
  UpdateProfileInput,
  UserProfileComplete,
  UserSkillWithDetail,
  UserInterestWithDetail,
} from "./types";

/**
 * Fetch all available interests ordered alphabetically
 */
export async function getAllInterests(): Promise<Interest[]> {
  try {
    const { db } = getDb();
    return await db.select().from(schema.interests).orderBy(asc(schema.interests.name));
  } catch (error) {
    console.error("Error fetching all interests:", error);
    return [];
  }
}

/**
 * Fetch all available skills ordered alphabetically
 */
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const { db } = getDb();
    return await db.select().from(schema.skills).orderBy(asc(schema.skills.name));
  } catch (error) {
    console.error("Error fetching all skills:", error);
    return [];
  }
}

/**
 * Fetch a complete user profile with skills and interests
 */
export async function getUserProfileComplete(
  userId: string
): Promise<UserProfileComplete | null> {
  if (!userId) return null;

  try {
    const { db } = getDb();

    // 1. Fetch base profile
    const profileRows = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, userId))
      .limit(1);

    if (profileRows.length === 0) {
      return null;
    }

    const profile = profileRows[0];

    // 2. Fetch user skills & interests in parallel
    const [userSkillsResult, userInterestsResult] = await Promise.all([
      db
        .select({
          userId: schema.userSkills.userId,
          skillId: schema.userSkills.skillId,
          level: schema.userSkills.level,
          yearsExperience: schema.userSkills.yearsExperience,
          skill: schema.skills,
        })
        .from(schema.userSkills)
        .innerJoin(schema.skills, eq(schema.userSkills.skillId, schema.skills.id))
        .where(eq(schema.userSkills.userId, userId)),
      db
        .select({
          userId: schema.userInterests.userId,
          interestId: schema.userInterests.interestId,
          weight: schema.userInterests.weight,
          interest: schema.interests,
        })
        .from(schema.userInterests)
        .innerJoin(
          schema.interests,
          eq(schema.userInterests.interestId, schema.interests.id)
        )
        .where(eq(schema.userInterests.userId, userId)),
    ]);

    return {
      ...profile,
      skills: userSkillsResult as UserSkillWithDetail[],
      interests: userInterestsResult as UserInterestWithDetail[],
    };
  } catch (error) {
    console.error(`Error fetching complete profile for user (${userId}):`, error);
    return null;
  }
}

/**
 * Update user profile details
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateProfileInput
): Promise<UserProfile | null> {
  try {
    const { db } = getDb();

    const [updated] = await db
      .update(schema.userProfiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.userProfiles.userId, userId))
      .returning();

    return updated || null;
  } catch (error) {
    console.error(`Error updating user profile (${userId}):`, error);
    throw error;
  }
}

/**
 * Set user interests (clears old ones and inserts new ones)
 */
export async function setUserInterests(
  userId: string,
  interestIds: string[]
): Promise<void> {
  try {
    const { db } = getDb();

    // Remove existing
    await db.delete(schema.userInterests).where(eq(schema.userInterests.userId, userId));

    if (interestIds.length > 0) {
      await db.insert(schema.userInterests).values(
        interestIds.map((interestId) => ({
          userId,
          interestId,
          weight: 3,
        }))
      );
    }
  } catch (error) {
    console.error(`Error setting user interests (${userId}):`, error);
    throw error;
  }
}

/**
 * Set user skills (clears old ones and inserts new ones)
 */
export async function setUserSkills(
  userId: string,
  skillList: { skillId: string; level: SkillLevel }[]
): Promise<void> {
  try {
    const { db } = getDb();

    // Remove existing
    await db.delete(schema.userSkills).where(eq(schema.userSkills.userId, userId));

    if (skillList.length > 0) {
      await db.insert(schema.userSkills).values(
        skillList.map((s) => ({
          userId,
          skillId: s.skillId,
          level: s.level,
        }))
      );
    }
  } catch (error) {
    console.error(`Error setting user skills (${userId}):`, error);
    throw error;
  }
}

/**
 * Complete onboarding wizard
 */
export async function completeOnboarding(
  userId: string,
  data: OnboardingInput
): Promise<UserProfileComplete | null> {
  try {
    const { db } = getDb();

    // 1. Update basic profile fields and mark onboarding completed
    await db
      .update(schema.userProfiles)
      .set({
        displayName: data.displayName,
        university: data.university || null,
        major: data.major || null,
        graduationYear: data.graduationYear || null,
        city: data.city || null,
        countryCode: data.countryCode || "VN",
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.userProfiles.userId, userId));

    // 2. Set interests
    await setUserInterests(userId, data.interestIds);

    // 3. Set skills
    await setUserSkills(userId, data.skills);

    return await getUserProfileComplete(userId);
  } catch (error) {
    console.error(`Error completing onboarding (${userId}):`, error);
    throw error;
  }
}
