import { getNeonAuthServer } from "@/lib/auth/server";

type Context = { params: Promise<{ path: string[] }> };

function unavailable() {
  return Response.json({ error: "Accounts are not configured." }, { status: 503 });
}

async function handle(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", request: Request, context: Context) {
  if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET) return unavailable();
  return getNeonAuthServer().handler()[method](request, context);
}

export const GET = (request: Request, context: Context) => handle("GET", request, context);
export const POST = (request: Request, context: Context) => handle("POST", request, context);
export const PUT = (request: Request, context: Context) => handle("PUT", request, context);
export const DELETE = (request: Request, context: Context) => handle("DELETE", request, context);
export const PATCH = (request: Request, context: Context) => handle("PATCH", request, context);
