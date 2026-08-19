"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/guards";
import { SavedService } from "./service";

export async function toggleSaveOpportunityAction(opportunityId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, unauthorized: true, message: "Please sign in to save opportunities" };
  }

  if (!opportunityId) {
    return { success: false, message: "Invalid opportunity ID" };
  }

  const isSaved = await SavedService.isSaved(user.userId, opportunityId);

  if (isSaved) {
    await SavedService.unsave(user.userId, opportunityId);
  } else {
    await SavedService.save(user.userId, opportunityId);
  }

  revalidatePath("/saved");
  revalidatePath("/dashboard");
  revalidatePath("/discover");

  return {
    success: true,
    saved: !isSaved,
  };
}
