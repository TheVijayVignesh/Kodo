"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAccountSyncStatus } from "@/lib/supabase/sync-status";

type Mode = "sign-in" | "sign-up";

export default function AccountPage() {
  const supabase = getSupabaseBrowserClient();
  const syncStatus = useAccountSyncStatus();
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!!supabase);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      setSession(data.session);
      if (sessionError) setError(sessionError.message);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      setError("");
      setMessage("");
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (mode === "sign-up") {
        const basePath = window.location.pathname.startsWith("/kodo") ? "/kodo" : "";
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}${basePath}/account` },
        });
        if (authError) throw authError;
        if (!data.session) {
          setMessage("Check your email for a confirmation link, then come back here to sign in.");
        } else {
          setMessage("Your account is ready. Progress on this device is being added to it.");
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        setMessage("Signed in. Your learning progress is syncing with this account.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't complete that request. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: authError } = await supabase.auth.signOut();
    if (authError) setError(authError.message);
    else setMessage("Signed out. Progress on this device remains available locally.");
    setBusy(false);
  }

  return (
    <section className="container-zen pt-16 md:pt-24 pb-24">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm text-fg-muted hover:text-fg-strong inline-flex items-center gap-2 mb-8">
          <ArrowLeft size={14} /> Back to the studio
        </Link>
        <div className="paper p-6 md:p-10">
          <div className="text-eyebrow text-fg-faint flex items-center gap-2 mb-3">
            <ShieldCheck size={13} /> Learner account
          </div>
          <h1 className="headline-display">Your progress, wherever you study</h1>
          <p className="body-prose mt-4 text-fg-muted">
            Sign in to keep lecture progress, quiz results, exercise passes, notes, bookmarks, and exam attempts in sync across devices.
          </p>

          {!supabase ? (
            <div className="mt-7 rounded-xl border border-rule bg-[var(--bg-ink)] p-4 text-sm text-fg-muted">
              Accounts are not configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the app environment, then follow the setup guide in <code>docs/account-sync-setup.md</code>.
            </div>
          ) : loading ? (
            <p className="mt-7 text-sm text-fg-muted" role="status">Checking your account…</p>
          ) : session ? (
            <div className="mt-7">
              <div className="rounded-xl border border-rule bg-[var(--bg-ink)] p-4">
                <div className="text-eyebrow text-fg-faint">Signed in as</div>
                <div className="mt-1 text-fg-strong break-all">{session.user.email}</div>
                <p className="mt-3 text-sm text-fg-muted" role="status">
                  {syncStatus.state === "syncing" && "Syncing your progress…"}
                  {syncStatus.state === "synced" && "Your progress is up to date."}
                  {syncStatus.state === "error" && (syncStatus.message || "Progress sync needs attention. Check the setup guide.")}
                  {syncStatus.state === "not_configured" && "Cloud sync is not configured on this deployment yet."}
                </p>
              </div>
              {error && <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>}
              {message && <p className="mt-4 text-sm text-fg-muted" role="status">{message}</p>}
              <button className="btn btn-ghost mt-5 inline-flex items-center gap-2" onClick={signOut} disabled={busy}>
                <LogOut size={14} /> {busy ? "Signing out…" : "Sign out"}
              </button>
            </div>
          ) : (
            <form className="mt-7 space-y-4" onSubmit={submit}>
              <div className="flex gap-2 border-b border-rule pb-3">
                <button type="button" onClick={() => { setMode("sign-in"); setMessage(""); setError(""); }} className={"btn btn-sm " + (mode === "sign-in" ? "btn-ink" : "btn-ghost")}>
                  Sign in
                </button>
                <button type="button" onClick={() => { setMode("sign-up"); setMessage(""); setError(""); }} className={"btn btn-sm " + (mode === "sign-up" ? "btn-ink" : "btn-ghost")}>
                  Create account
                </button>
              </div>
              <label className="block text-sm text-fg-muted">
                Email
                <input className="input mt-1.5" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label className="block text-sm text-fg-muted">
                Password
                <input className="input mt-1.5" type="password" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
              {message && <p className="text-sm text-fg-muted" role="status">{message}</p>}
              <button className="btn btn-primary btn-lg w-full" type="submit" disabled={busy}>
                {busy ? "Please wait…" : mode === "sign-up" ? "Create account" : "Sign in"}
              </button>
              <p className="text-xs text-fg-faint leading-relaxed">
                Your progress stays on this device if you sign out. Signing in on another device loads your account's saved progress there.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
