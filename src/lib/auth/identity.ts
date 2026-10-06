import { auth } from "@clerk/nextjs/server";
import { getNeonAuthServer } from "@/lib/auth/server";

export async function getCurrentLearnerId() {
  const clerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );

  if (clerkConfigured) {
    const { userId } = await auth();
    if (userId) return `clerk:${userId}`;
  }

  if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET) return null;
  const { data, error } = await getNeonAuthServer().getSession();
  if (error) return null;
  return data?.user?.id ?? null;
}
