export function GET() {
  const configured = Boolean(
    process.env.NEON_AUTH_BASE_URL &&
      process.env.NEON_AUTH_COOKIE_SECRET &&
      process.env.DATABASE_URL,
  );
  return Response.json({ configured });
}
