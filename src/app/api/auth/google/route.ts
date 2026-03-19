import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function base64url(buffer: ArrayBuffer) {
  return Buffer.from(buffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env" },
      { status: 500 }
    );
  }

  const state = base64url(crypto.getRandomValues(new Uint8Array(32)).buffer);
  const codeVerifier = base64url(
    crypto.getRandomValues(new Uint8Array(32)).buffer
  );

  const codeChallenge = base64url(
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(codeVerifier)
    )
  );

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", JSON.stringify({ state, codeVerifier }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}
