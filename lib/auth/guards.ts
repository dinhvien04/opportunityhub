import { redirect } from "next/navigation";
import { getSession } from "./session";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { UserProfile } from "@/lib/db/schema";

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return null;
    }

    const { db } = getDb();
    const rows = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, session.userId))
      .limit(1);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error in getCurrentUser guard:", error);
    return null;
  }
}

export async function requireUser(returnTo: string = "/login"): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(returnTo);
  }
  return user;
}
