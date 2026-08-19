import {
  addChecklistItem,
  createApplication,
  deleteApplication,
  deleteChecklistItem,
  getApplicationById,
  getApplicationByOpportunity,
  getUserApplications,
  toggleChecklistItem,
  updateApplicationNotes,
  updateApplicationStatus,
} from "./repository";
import type { ApplicationStatus } from "./types";

export const ApplicationService = {
  getApplications: async (
    userId: string,
    statusFilter?: ApplicationStatus | "all"
  ) => {
    return getUserApplications(userId, statusFilter);
  },

  getApplicationById: async (applicationId: string, userId: string) => {
    return getApplicationById(applicationId, userId);
  },

  getApplicationByOpportunity: async (userId: string, opportunityId: string) => {
    return getApplicationByOpportunity(userId, opportunityId);
  },

  create: async (
    userId: string,
    opportunityId: string,
    status: ApplicationStatus = "preparing"
  ) => {
    return createApplication(userId, opportunityId, status);
  },

  updateStatus: async (
    applicationId: string,
    userId: string,
    status: ApplicationStatus
  ) => {
    return updateApplicationStatus(applicationId, userId, status);
  },

  updateNotes: async (
    applicationId: string,
    userId: string,
    notes: string | null,
    externalUrl: string | null,
    externalRef: string | null
  ) => {
    return updateApplicationNotes(
      applicationId,
      userId,
      notes,
      externalUrl,
      externalRef
    );
  },

  delete: async (applicationId: string, userId: string) => {
    return deleteApplication(applicationId, userId);
  },

  addChecklistItem: async (
    applicationId: string,
    userId: string,
    title: string,
    description?: string,
    dueAt?: Date
  ) => {
    return addChecklistItem(applicationId, userId, title, description, dueAt);
  },

  toggleChecklistItem: async (
    itemId: string,
    userId: string,
    isCompleted: boolean
  ) => {
    return toggleChecklistItem(itemId, userId, isCompleted);
  },

  deleteChecklistItem: async (itemId: string, userId: string) => {
    return deleteChecklistItem(itemId, userId);
  },
};
