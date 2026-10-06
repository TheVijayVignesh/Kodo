"use client";

import { useUser } from "@clerk/nextjs";
import { neonAuth } from "@/lib/auth/client";
import { AccountSyncForIdentity } from "@/components/account/AccountSync";

export function ClerkAccountSync() {
  const { isLoaded, user } = useUser();
  const { data: neonSession, isPending: neonPending } = neonAuth.useSession();
  const clerkUserId = user?.id ?? null;

  return (
    <AccountSyncForIdentity
      userId={clerkUserId ? `clerk:${clerkUserId}` : neonSession?.user?.id ?? null}
      pending={!isLoaded || neonPending}
    />
  );
}
