import Link from "next/link";
import { UserRound } from "lucide-react";

export function AccountButton() {
  return (
    <Link
      href="/account"
      aria-label="Open account"
      title="Account"
      className="h-9 w-9 grid place-items-center rounded-full border border-rule text-fg-base hover:border-accent transition-colors"
    >
      <UserRound size={16} aria-hidden="true" />
    </Link>
  );
}
