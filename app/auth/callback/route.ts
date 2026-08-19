import { NextRequest } from "next/server";
import { exchangeGoogleCodeForUserInfo, generateUserUuidFromId } from "@/lib/auth/google";
import { setSessionCookie } from "@/lib/auth/session";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return new Response(
      `<html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #09090b; color: #f4f4f5;">
          <h2>Authentication Error</h2>
          <p>${error || "No authorization code provided."}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error || "cancelled"}' }, '*');
              setTimeout(() => window.close(), 2000);
            }
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const origin = req.nextUrl.origin;
    const redirectUri = `${origin}/auth/callback`;

    const userInfo = await exchangeGoogleCodeForUserInfo(code, redirectUri);
    if (!userInfo || !userInfo.email) {
      throw new Error("Unable to retrieve profile from Google");
    }

    const userId = generateUserUuidFromId(userInfo.email);
    const { db } = getDb();

    // Check existing profile
    const existing = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, userId))
      .limit(1);

    let onboardingCompleted = false;

    if (existing.length === 0) {
      // Create new profile
      const username = userInfo.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").slice(0, 30);
      await db.insert(schema.userProfiles).values({
        userId,
        displayName: userInfo.name || username,
        username,
        avatarUrl: userInfo.picture || null,
        appRole: "member",
        isPublic: true,
        onboardingCompleted: false,
      });
      onboardingCompleted = false;
    } else {
      onboardingCompleted = existing[0].onboardingCompleted;
      // Optionally update avatar or name if empty
      if (!existing[0].avatarUrl && userInfo.picture) {
        await db
          .update(schema.userProfiles)
          .set({ avatarUrl: userInfo.picture, updatedAt: new Date() })
          .where(eq(schema.userProfiles.userId, userId));
      }
    }

    // Set authenticated session cookie
    await setSessionCookie({
      userId,
      email: userInfo.email,
      displayName: userInfo.name,
      avatarUrl: userInfo.picture || null,
      onboardingCompleted,
    });

    const targetPath = onboardingCompleted ? "/dashboard" : "/onboarding";

    // Return popup postMessage script as mandated by oauth skill
    return new Response(
      `<html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #09090b; color: #f4f4f5;">
          <h2 style="color: #10b981;">Authentication Successful</h2>
          <p>Redirecting back to OpportunityHub...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', target: '${targetPath}' }, '*');
              window.close();
            } else {
              window.location.href = '${targetPath}';
            }
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err: unknown) {
    const errorMsg = (err as Error).message || "Internal server error";
    return new Response(
      `<html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #09090b; color: #f4f4f5;">
          <h2>Authentication Failed</h2>
          <p>${errorMsg}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${errorMsg}' }, '*');
              setTimeout(() => window.close(), 3000);
            }
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
