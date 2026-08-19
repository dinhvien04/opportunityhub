"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/guards";
import { ApplicationService } from "./service";
import type { ApplicationStatus } from "./types";

export async function createOrTrackApplicationAction(
  opportunityId: string,
  status: ApplicationStatus = "preparing"
) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, unauthorized: true, message: "Please sign in to track applications" };
  }

  if (!opportunityId) {
    return { success: false, message: "Opportunity ID is required" };
  }

  const applicationId = await ApplicationService.create(
    user.userId,
    opportunityId,
    status
  );

  revalidatePath("/applications");
  revalidatePath("/dashboard");
  revalidatePath(`/applications/${applicationId}`);

  return { success: true, applicationId };
}

export async function updateApplicationStatusAction(
  applicationId: string,
  status: ApplicationStatus
) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  await ApplicationService.updateStatus(applicationId, user.userId, status);

  revalidatePath("/applications");
  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateApplicationNotesAction(
  applicationId: string,
  notes: string | null,
  externalApplicationUrl: string | null,
  externalReference: string | null
) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  await ApplicationService.updateNotes(
    applicationId,
    user.userId,
    notes,
    externalApplicationUrl,
    externalReference
  );

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/applications");

  return { success: true };
}

export async function deleteApplicationAction(applicationId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  await ApplicationService.delete(applicationId, user.userId);

  revalidatePath("/applications");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function addChecklistItemAction(
  applicationId: string,
  title: string,
  description?: string,
  dueAtString?: string
) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  if (!title || title.trim().length === 0) {
    return { success: false, message: "Title is required" };
  }

  const dueAt = dueAtString ? new Date(dueAtString) : undefined;

  const item = await ApplicationService.addChecklistItem(
    applicationId,
    user.userId,
    title.trim(),
    description?.trim(),
    dueAt
  );

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/applications");

  return { success: true, item };
}

export async function toggleChecklistItemAction(
  itemId: string,
  applicationId: string,
  isCompleted: boolean
) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  await ApplicationService.toggleChecklistItem(itemId, user.userId, isCompleted);

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/applications");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteChecklistItemAction(
  itemId: string,
  applicationId: string
) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  await ApplicationService.deleteChecklistItem(itemId, user.userId);

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/applications");

  return { success: true };
}
