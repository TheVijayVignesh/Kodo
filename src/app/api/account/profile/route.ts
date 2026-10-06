import { neon } from "@neondatabase/serverless";
import { clerkClient, verifyToken } from "@clerk/nextjs/server";

async function authenticatedClerkUserId(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token || !process.env.CLERK_SECRET_KEY) return null;
  try {
    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: [new URL(request.url).origin],
    });
    const subject = (verified.data as { sub?: unknown } | undefined)?.sub;
    return typeof subject === "string" ? subject : null;
  } catch {
    return null;
  }
}

export async function PUT(request: Request) {
  const clerkUserId = await authenticatedClerkUserId(request);
  if (!clerkUserId) return Response.json({ error: "Sign in to save account details." }, { status: 401 });
  if (!process.env.DATABASE_URL) return Response.json({ error: "Account storage is not configured." }, { status: 503 });

  try {
    const user = await (await clerkClient()).users.getUser(clerkUserId);
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return Response.json({ error: "Add an email address to your Clerk account first." }, { status: 422 });
    const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || email.split("@")[0];
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      insert into public.learner_profiles (user_id, auth_provider, email, display_name, image_url, updated_at)
      values (${`clerk:${clerkUserId}`}, 'clerk', ${email}, ${displayName}, ${user.imageUrl}, now())
      on conflict (user_id) do update
      set email = excluded.email,
          display_name = excluded.display_name,
          image_url = excluded.image_url,
          updated_at = now()
    `;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not save account details." }, { status: 500 });
  }
}
