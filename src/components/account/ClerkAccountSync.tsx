"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
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
      pending={!isLoaded || (!clerkUserId && neonPending)}
      getToken={clerkUserId ? tokenProvider : undefined}
    />
  );
}
