# Account and progress sync setup

Kōdo uses Neon Auth for email/password accounts and Neon Postgres for cross-device learner progress. Sign-in requests go through the app's `/kodo/api/auth` route so session cookies remain first-party. Progress is read and written by authenticated server routes; the database connection string stays server-only.

## Configure Neon through Vercel

1. In the Vercel project connected to Kōdo, open **Storage** and use its existing Neon integration. Confirm the integration provides a Postgres connection string (`DATABASE_URL`) and a Neon Auth endpoint (`NEON_AUTH_BASE_URL`).
2. Generate a random secret of at least 32 characters for `NEON_AUTH_COOKIE_SECRET`. Keep all three values server-side; do not prefix them with `NEXT_PUBLIC_`.
3. Copy `.env.example` to `.env.local` and fill in these values for local development. Add the same variables to Vercel's deployment environment and redeploy after the feature is ready.
4. Run [`neon/migrations/0001_learner_snapshots.sql`](../neon/migrations/0001_learner_snapshots.sql) against the connected database once. The migration is safe to re-run.
5. In Neon Auth's allowed origins/redirect configuration, allow `https://vijayvignesh.me` and `http://localhost:3000`.

For local development, configure Neon Auth's local return URL as `http://localhost:3000/kodo/account` if your project requires explicit redirect URLs.

When a learner creates a new account, existing progress on that device initializes the account snapshot. When an account already has a saved snapshot, that cloud snapshot is loaded on sign-in so an older browser cache cannot restore progress that was reset on another device. Subsequent progress changes are saved to the account automatically.
