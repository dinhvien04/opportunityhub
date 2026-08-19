import { v5 as uuidv5, v4 as uuidv4 } from "uuid";

// Stable namespace for deterministic user UUIDs from email/OAuth ID
const OAUTH_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

export function generateUserUuidFromId(identifier: string): string {
  try {
    return uuidv5(identifier, OAUTH_NAMESPACE);
  } catch {
    return uuidv4();
  }
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    (process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID) &&
    (process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET)
  );
}

export function getGoogleOAuthClientConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || "";
  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET || "";
  return { clientId, clientSecret };
}

export function buildGoogleAuthUrl(redirectUri: string, state?: string): string {
  const { clientId } = getGoogleOAuthClientConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    access_type: "online",
    prompt: "select_account",
  });

  if (state) {
    params.set("state", state);
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export async function exchangeGoogleCodeForUserInfo(
  code: string,
  redirectUri: string
): Promise<GoogleUserInfo | null> {
  const { clientId, clientSecret } = getGoogleOAuthClientConfig();
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials are not configured");
  }

  // 1. Exchange authorization code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Failed to exchange Google OAuth code:", errorText);
    return null;
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return null;
  }

  // 2. Fetch user profile from Google UserInfo endpoint
  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!userResponse.ok) {
    console.error("Failed to fetch Google user info:", await userResponse.text());
    return null;
  }

  return (await userResponse.json()) as GoogleUserInfo;
}
