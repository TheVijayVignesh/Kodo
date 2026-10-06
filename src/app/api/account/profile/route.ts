import { neon } from "@neondatabase/serverless";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function PUT() {
  const { userId: clerkUserId } = await auth();
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
