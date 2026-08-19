import { NextRequest, NextResponse } from "next/server";
import { buildGoogleAuthUrl, isGoogleOAuthConfigured } from "@/lib/auth/google";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const configured = isGoogleOAuthConfigured();
    const searchParams = req.nextUrl.searchParams;
    const origin = searchParams.get("origin") || req.nextUrl.origin;
    const redirectUri = `${origin}/auth/callback`;

    if (!configured) {
      return NextResponse.json({
        configured: false,
        message: "Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are not configured.",
      });
    }

    const authUrl = buildGoogleAuthUrl(redirectUri);

    return NextResponse.json({
      configured: true,
      url: authUrl,
      redirectUri,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
