import { ClerkAccountPanel } from "@/components/account/ClerkAccountPanel";
import { NeonAccountPanel } from "@/components/account/NeonAccountPanel";

const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

export default function AccountPage() {
  return (
    <>
      {clerkConfigured && <ClerkAccountPanel />}
      <NeonAccountPanel />
    </>
  );
}
