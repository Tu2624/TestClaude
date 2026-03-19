import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${BASE_URL}/?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code || !returnedState) {
    return NextResponse.redirect(`${BASE_URL}/?auth_error=missing_params`);
  }

  // Read and clear the state cookie
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("oauth_state")?.value;
  cookieStore.delete("oauth_state");

  if (!rawCookie) {
    return NextResponse.redirect(`${BASE_URL}/?auth_error=missing_state`);
  }

  let savedState: { state: string; codeVerifier: string };
  try {
    savedState = JSON.parse(rawCookie);
  } catch {
    return NextResponse.redirect(`${BASE_URL}/?auth_error=invalid_state`);
  }

  if (returnedState !== savedState.state) {
    return NextResponse.redirect(`${BASE_URL}/?auth_error=state_mismatch`);
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${BASE_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
      code_verifier: savedState.codeVerifier,
    }),
  });

  if (!tokenRes.ok) {
    console.error("Token exchange failed:", await tokenRes.text());
    return NextResponse.redirect(`${BASE_URL}/?auth_error=token_exchange`);
  }

  const { id_token } = await tokenRes.json();

  // Verify and decode the ID token
  let payload: { sub: string; email: string; name?: string; picture?: string };
  try {
    const { payload: verified } = await jwtVerify(id_token, GOOGLE_JWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = verified as typeof payload;
  } catch (e) {
    console.error("ID token verification failed:", e);
    return NextResponse.redirect(`${BASE_URL}/?auth_error=token_invalid`);
  }

  const { sub: googleId, email } = payload;

  // Find or create user
  let user = await prisma.user.findUnique({ where: { googleId } });

  if (!user) {
    // Try to link to an existing account by email
    user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    } else {
      user = await prisma.user.create({ data: { email, googleId } });
    }
  }

  await createSession(user.id, user.email);

  return NextResponse.redirect(BASE_URL);
}
