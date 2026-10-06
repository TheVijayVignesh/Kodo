"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SignInButton, SignUpButton, UserProfile, useAuth, useUser } from "@clerk/nextjs";

export function ClerkAccountPanel() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [profileStatus, setProfileStatus] = useState("");

  useEffect(() => {
    if (!isSignedIn || !user) return;
    let active = true;
    void (async () => {
      setProfileStatus("Saving your profile details…");
      try {
        const token = await getToken();
        const response = await fetch("/kodo/api/account/profile", {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: "same-origin",
        });
        if (!response.ok) throw new Error("Profile details could not be saved to Neon.");
        if (active) setProfileStatus("Your profile details are saved with your account.");
      } catch (cause) {
        if (active) setProfileStatus(cause instanceof Error ? cause.message : "Profile details could not be saved.");
      }
    })();
    return () => { active = false; };
  }, [getToken, isSignedIn, user?.id, user?.firstName, user?.lastName, user?.imageUrl, user?.primaryEmailAddressId]);

  return (
    <section className="container-zen pt-16 md:pt-24 pb-4">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm text-fg-muted hover:text-fg-strong inline-flex items-center gap-2 mb-8">
          <ArrowLeft size={14} /> Back to the studio
        </Link>
        <div className="paper p-6 md:p-10">
          <div className="text-eyebrow text-fg-faint flex items-center gap-2 mb-3"><ShieldCheck size={13} /> Google learner account</div>
          <h1 className="headline-display">Your profile and progress</h1>
          <p className="body-prose mt-4 text-fg-muted">Sign in with Google to sync your learning progress across devices. Edit your display name and profile photo in your account settings below.</p>

          {!isLoaded ? (
            <p className="mt-7 text-sm text-fg-muted" role="status">Checking your account…</p>
          ) : isSignedIn ? (
            <div className="mt-7">
              <p className="mb-5 text-sm text-fg-muted">Signed in as <span className="text-fg-strong">{user.primaryEmailAddress?.emailAddress}</span></p>
              {profileStatus && <p className="mb-4 text-xs text-fg-faint" role="status">{profileStatus}</p>}
              <UserProfile routing="hash" />
            </div>
          ) : (
            <div className="mt-7 space-y-4">
              <SignInButton mode="modal" forceRedirectUrl="/account">
                <button className="btn btn-primary btn-lg w-full" type="button">Continue with Google or email</button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/account">
                <button className="btn btn-ghost w-full" type="button">Create a new account</button>
              </SignUpButton>
              <p className="text-xs text-fg-faint leading-relaxed">Choose Google in the sign-in window. Your account profile and photo are managed securely by Clerk.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
