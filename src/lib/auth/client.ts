"use client";

import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

// The app is mounted at /kodo on both the portfolio and the local dev server.
// Neon Auth requests pass through Next so its session cookies stay first-party.
const authApiUrl = `${typeof window === "undefined" ? "http://localhost:3000" : window.location.origin}/kodo/api/auth`;

export const neonAuth = createAuthClient(authApiUrl, {
  adapter: BetterAuthReactAdapter(),
});
