import { neon } from "@neondatabase/serverless";
import { getNeonAuthServer } from "@/lib/auth/server";

const MAX_SNAPSHOT_BYTES = 1_000_000;

type Snapshot = {
  version: 1;
  progress: Record<string, unknown>;
  bookmarks: string[];
  notes: Record<string, string>;
  examAttempts: unknown[];
};

function isSnapshot(value: unknown): value is Snapshot {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return candidate.version === 1 &&
    typeof candidate.progress === "object" && candidate.progress !== null && !Array.isArray(candidate.progress) &&
    Array.isArray(candidate.bookmarks) && candidate.bookmarks.every((item) => typeof item === "string") &&
    typeof candidate.notes === "object" && candidate.notes !== null && !Array.isArray(candidate.notes) &&
    Array.isArray(candidate.examAttempts);
}

async function authenticatedUserId() {
  if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET) return null;
  const { data, error } = await getNeonAuthServer().getSession();
  if (error) return null;
  return data?.user?.id ?? null;
}

export async function GET() {
  const userId = await authenticatedUserId();
  if (!userId) return Response.json({ error: "Sign in to sync progress." }, { status: 401 });
  if (!process.env.DATABASE_URL) return Response.json({ error: "Progress storage is not configured." }, { status: 503 });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`select snapshot from public.learner_snapshots where user_id = ${userId} limit 1`;
    return Response.json({ snapshot: rows[0]?.snapshot ?? null });
  } catch {
    return Response.json({ error: "Could not load saved progress." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = await authenticatedUserId();
  if (!userId) return Response.json({ error: "Sign in to sync progress." }, { status: 401 });
  if (!process.env.DATABASE_URL) return Response.json({ error: "Progress storage is not configured." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_SNAPSHOT_BYTES) return Response.json({ error: "Progress snapshot is too large." }, { status: 413 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid progress snapshot." }, { status: 400 });
  }
  const snapshot = typeof body === "object" && body !== null ? (body as Record<string, unknown>).snapshot : null;
  if (!isSnapshot(snapshot) || new TextEncoder().encode(JSON.stringify(snapshot)).byteLength > MAX_SNAPSHOT_BYTES) {
    return Response.json({ error: "Invalid progress snapshot." }, { status: 400 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      insert into public.learner_snapshots (user_id, snapshot, updated_at)
      values (${userId}, ${JSON.stringify(snapshot)}::jsonb, now())
      on conflict (user_id) do update
      set snapshot = excluded.snapshot, updated_at = now()
    `;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not save progress." }, { status: 500 });
  }
}
