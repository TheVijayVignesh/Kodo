# Account and progress sync setup

Kōdo supports Neon Auth email/password accounts and Clerk accounts (including Google OAuth). Neon Postgres stores cross-device learner progress. Neon sign-in requests go through the app's `/kodo/api/auth` route so session cookies remain first-party. Clerk session tokens are verified by the progress route, and the database connection string stays server-only. Clerk account IDs use a separate `clerk:` namespace so they cannot collide with existing Neon account snapshots.

## Configure Neon through Vercel

1. In the Vercel project connected to Kōdo, open **Storage** and use its existing Neon integration. Confirm the integration provides a Postgres connection string (`DATABASE_URL`) and a Neon Auth endpoint (`NEON_AUTH_BASE_URL`).
2. Generate a random secret of at least 32 characters for `NEON_AUTH_COOKIE_SECRET`. Keep all three values server-side; do not prefix them with `NEXT_PUBLIC_`.
3. Copy `.env.example` to `.env.local` and fill in these values for local development. Add the same variables to Vercel's deployment environment and redeploy after the feature is ready.
4. Run [`neon/migrations/0001_learner_snapshots.sql`](../neon/migrations/0001_learner_snapshots.sql) against the connected database once. The migration is safe to re-run.
5. In Neon Auth's allowed origins/redirect configuration, allow `https://vijayvignesh.me` and `http://localhost:3000`.

For local development, configure Neon Auth's local return URL as `http://localhost:3000/kodo/account` if your project requires explicit redirect URLs.

## Optional Google sign-in and profile settings through Clerk

1. Create a Clerk application for Kōdo and enable Google in **Configure > SSO connections**. Clerk's development Google connection uses its shared OAuth credentials; production needs your own Google OAuth credentials.
2. Copy the Clerk development publishable and secret keys into `.env.local` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. Add both to the Vercel Preview environment only while validating the feature.
3. Restart the local server after adding the keys. In `/kodo/account`, use the Google option in Clerk's sign-in window. The profile panel supports editing the account name and photo. Progress sync uses Clerk's verified user ID in `learner_snapshots`.
4. Add `http://localhost:3000` and the Preview deployment origin to Clerk's allowed origins if Clerk asks for them. Google OAuth may need to open in Safari instead of an embedded in-app browser.

The existing Neon email/password flow remains available and its saved snapshots are preserved. Clerk profiles are managed by Clerk; only the namespaced account ID and learner snapshot are stored in Neon. No profile webhook is required for sign-in or progress sync.

When a learner creates a new account, existing progress on that device initializes the account snapshot. When an account already has a saved snapshot, that cloud snapshot is loaded on sign-in so an older browser cache cannot restore progress that was reset on another device. Subsequent progress changes are saved to the account automatically.
