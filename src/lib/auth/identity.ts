import { verifyToken } from "@clerk/nextjs/server";
import { getNeonAuthServer } from "@/lib/auth/server";

function getClerkSessionToken(request: Request) {
  const bearerToken = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearerToken) return bearerToken;

  const sessionCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("__session="))
    ?.slice("__session=".length);

  if (!sessionCookie) return null;
  try {
    return decodeURIComponent(sessionCookie);
  } catch {
    return sessionCookie;
  }
}

export async function getClerkUserId(request: Request) {
  const token = getClerkSessionToken(request);
  if (!token || !process.env.CLERK_SECRET_KEY) return null;

  try {
    const claims = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: [new URL(request.url).origin],
    });
    return typeof claims.sub === "string" ? claims.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentLearnerId(request: Request) {
  const clerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );

  if (clerkConfigured) {
    const clerkUserId = await getClerkUserId(request);
    if (clerkUserId) return `clerk:${clerkUserId}`;
    if (getClerkSessionToken(request)) return null;
  }

  if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET) return null;
  const { data, error } = await getNeonAuthServer().getSession();
  if (error) return null;
  return data?.user?.id ?? null;
}
