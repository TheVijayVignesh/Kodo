"use client";

import { useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { neonAuth } from "@/lib/auth/client";
import { AccountSyncForIdentity } from "@/components/account/AccountSync";

export function ClerkAccountSync() {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const { data: neonSession, isPending: neonPending } = neonAuth.useSession();
  const clerkUserId = user?.id ?? null;
  const tokenProvider = useCallback(() => getToken(), [getToken]);

  return (
    <AccountSyncForIdentity
      userId={clerkUserId ? `clerk:${clerkUserId}` : neonSession?.user?.id ?? null}
      pending={!isLoaded || neonPending}
      getToken={clerkUserId ? tokenProvider : undefined}
    />
  );
}
