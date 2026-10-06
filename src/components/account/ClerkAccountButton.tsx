"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { UserRound } from "lucide-react";

export function ClerkAccountButton() {
  return (
    <>
      <Show when="signed-in">
        <UserButton />
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            aria-label="Sign in or open account"
            title="Sign in or open account"
            className="h-9 w-9 grid place-items-center rounded-full border border-rule text-fg-base hover:border-accent transition-colors"
          >
            <UserRound size={16} aria-hidden="true" />
          </button>
        </SignInButton>
      </Show>
    </>
  );
}
