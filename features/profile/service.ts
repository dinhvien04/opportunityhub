import {
  completeOnboarding,
  getAllInterests,
  getAllSkills,
  getUserProfileComplete,
  setUserInterests,
  setUserSkills,
  updateUserProfile,
} from "./repository";
import type {
  OnboardingInput,
  SkillLevel,
  UpdateProfileInput,
  UserProfileComplete,
} from "./types";

export const ProfileService = {
  getCompleteProfile: async (userId: string): Promise<UserProfileComplete | null> => {
    return getUserProfileComplete(userId);
  },

  getAllInterests: async () => {
    return getAllInterests();
  },

  getAllSkills: async () => {
    return getAllSkills();
  },

  updateProfile: async (userId: string, data: UpdateProfileInput) => {
    return updateUserProfile(userId, data);
  },

  updateInterests: async (userId: string, interestIds: string[]) => {
    return setUserInterests(userId, interestIds);
  },

  updateSkills: async (
    userId: string,
    skills: { skillId: string; level: SkillLevel }[]
  ) => {
    return setUserSkills(userId, skills);
  },

  completeOnboarding: async (userId: string, data: OnboardingInput) => {
    return completeOnboarding(userId, data);
  },
};
