import {
  getSavedOpportunities,
  getSavedOpportunityIds,
  isOpportunitySaved,
  saveOpportunity,
  unsaveOpportunity,
} from "./repository";

export const SavedService = {
  isSaved: async (userId: string, opportunityId: string) => {
    return isOpportunitySaved(userId, opportunityId);
  },

  getSavedIds: async (userId: string) => {
    return getSavedOpportunityIds(userId);
  },

  save: async (userId: string, opportunityId: string) => {
    return saveOpportunity(userId, opportunityId);
  },

  unsave: async (userId: string, opportunityId: string) => {
    return unsaveOpportunity(userId, opportunityId);
  },

  getSavedList: async (userId: string, query?: string) => {
    return getSavedOpportunities(userId, query);
  },
};
