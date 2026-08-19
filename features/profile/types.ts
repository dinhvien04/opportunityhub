import type {
  Interest,
  Skill,
  UserProfile,
} from "@/lib/db/schema";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface UserSkillWithDetail {
  userId: string;
  skillId: string;
  level: SkillLevel | string;
  yearsExperience: string | null;
  skill: Skill;
}

export interface UserInterestWithDetail {
  userId: string;
  interestId: string;
  weight: number;
  interest: Interest;
}

export interface UserProfileComplete extends UserProfile {
  skills: UserSkillWithDetail[];
  interests: UserInterestWithDetail[];
}

export interface UpdateProfileInput {
  displayName?: string;
  username?: string;
  bio?: string;
  university?: string;
  major?: string;
  graduationYear?: number | null;
  city?: string;
  countryCode?: string;
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  isPublic?: boolean;
}

export interface OnboardingInput {
  displayName: string;
  university?: string;
  major?: string;
  graduationYear?: number | null;
  city?: string;
  countryCode?: string;
  interestIds: string[];
  skills: {
    skillId: string;
    level: SkillLevel;
  }[];
}
