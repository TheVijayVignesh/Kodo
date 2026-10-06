# Account and progress sync setup

Kōdo uses Supabase Auth for email/password accounts and a row-level-security protected `learner_snapshots` table for cross-device learner data. The browser uses only the Supabase project URL and public anon/publishable key. Never put a `service_role` key in the app or in a `NEXT_PUBLIC_` variable.

## Configure Supabase

1. Create a Supabase project.
2. Run [`supabase/migrations/0001_learner_snapshots.sql`](../supabase/migrations/0001_learner_snapshots.sql) in the project's SQL editor.
3. In Supabase Auth URL configuration, set the site URL to `https://vijayvignesh.me` and allow `https://vijayvignesh.me/kodo/account` as a redirect URL. For local development, also allow `http://localhost:3000/kodo/account`.
4. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the project's API settings.
5. Add the same two variables to the production hosting environment and rebuild/redeploy the app.

Email confirmation can remain enabled. New learners will follow the confirmation link back to the Kōdo account page before signing in.
