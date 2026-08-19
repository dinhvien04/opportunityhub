import { NextRequest, NextResponse } from "next/server";
import { generateUserUuidFromId } from "@/lib/auth/google";
import { setSessionCookie } from "@/lib/auth/session";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || "student.builder@opportunityhub.edu.vn";
    const name = body.name || "Alex Nguyen";
    const avatarUrl =
      body.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    const userId = generateUserUuidFromId(email);
    const { db } = getDb();

    // Check existing profile in Neon PostgreSQL
    const existing = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, userId))
      .limit(1);

    let onboardingCompleted = false;

    if (existing.length === 0) {
      const username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").slice(0, 30);
      await db.insert(schema.userProfiles).values({
        userId,
        displayName: name,
        username,
        avatarUrl,
        appRole: "member",
        isPublic: true,
        onboardingCompleted: false,
      });
      onboardingCompleted = false;
    } else {
      onboardingCompleted = existing[0].onboardingCompleted;
    }

    await setSessionCookie({
      userId,
      email,
      displayName: name,
      avatarUrl,
      onboardingCompleted,
    });

    return NextResponse.json({
      success: true,
      userId,
      onboardingCompleted,
      redirectTo: onboardingCompleted ? "/dashboard" : "/onboarding",
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Demo login error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sign in" },
      { status: 500 }
    );
  }
}
