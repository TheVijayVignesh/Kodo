"use client";

import { useEffect } from "react";
import { neonAuth } from "@/lib/auth/client";
import { useAppStore, type ExamAttempt, type LectureProgress } from "@/lib/store";
import { setAccountSyncStatus } from "@/lib/auth/sync-status";

type LearnerSnapshot = {
  version: 1;
  progress: Record<string, LectureProgress>;
  bookmarks: string[];
  notes: Record<string, string>;
  examAttempts: ExamAttempt[];
};

function snapshotFromStore(state: ReturnType<typeof useAppStore.getState>): LearnerSnapshot {
  return { version: 1, progress: state.progress, bookmarks: state.bookmarks, notes: state.notes, examAttempts: state.examAttempts };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSnapshot(value: unknown): LearnerSnapshot | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.progress) || !Array.isArray(value.bookmarks) || !isRecord(value.notes) || !Array.isArray(value.examAttempts)) return null;
  return value as unknown as LearnerSnapshot;
}

async function requestSnapshot(method: "GET" | "PUT", snapshot?: LearnerSnapshot) {
  const response = await fetch("/kodo/api/progress", {
    method,
    headers: {
      ...(method === "PUT" ? { "Content-Type": "application/json" } : {}),
    },
    body: method === "PUT" ? JSON.stringify({ snapshot }) : undefined,
    credentials: "same-origin",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "Progress sync failed.");
  return payload as { snapshot?: unknown };
}

export function AccountSync() {
  const { data: session, isPending } = neonAuth.useSession();
  const userId = session?.user?.id ?? null;
  return <AccountSyncForIdentity userId={userId} pending={isPending} />;
}

export function AccountSyncForIdentity({ userId, pending }: {
  userId: string | null;
  pending: boolean;
}) {
  useEffect(() => {
    if (pending) return;
    if (!userId) {
      setAccountSyncStatus({ state: "signed_out" });
      return;
    }

    let active = true;
    let writesReady = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pendingSnapshot: LearnerSnapshot | undefined;
    let saving = false;

    const flush = async () => {
      if (saving || !pendingSnapshot) return;
      saving = true;
      while (pendingSnapshot && active) {
        const pending = pendingSnapshot;
        pendingSnapshot = undefined;
        setAccountSyncStatus({ state: "syncing" });
        try {
          await requestSnapshot("PUT", pending);
          if (active && !pendingSnapshot) setAccountSyncStatus({ state: "synced" });
        } catch (cause) {
          if (active) setAccountSyncStatus({ state: "error", message: cause instanceof Error ? cause.message : "Progress sync failed." });
        }
      }
      saving = false;
    };

    setAccountSyncStatus({ state: "syncing" });
    void requestSnapshot("GET").then(async ({ snapshot }) => {
      if (!active) return;
      const cloud = snapshot == null ? null : parseSnapshot(snapshot);
      if (snapshot != null && !cloud) throw new Error("The saved progress format is not supported by this version of Kōdo. Update the app before syncing.");

      const local = snapshotFromStore(useAppStore.getState());
      const merged = cloud ?? local;
      useAppStore.setState({
        progress: merged.progress as ReturnType<typeof useAppStore.getState>["progress"],
        bookmarks: merged.bookmarks as ReturnType<typeof useAppStore.getState>["bookmarks"],
        notes: merged.notes,
        examAttempts: merged.examAttempts,
      });
      await requestSnapshot("PUT", merged);
      if (!active) return;
      writesReady = true;
      setAccountSyncStatus({ state: "synced" });
    }).catch((cause) => {
      if (active) setAccountSyncStatus({ state: "error", message: cause instanceof Error ? cause.message : "Progress sync failed." });
    });

    const unsubscribe = useAppStore.subscribe((state, previous) => {
      if (!writesReady) return;
      if (state.progress === previous.progress && state.bookmarks === previous.bookmarks && state.notes === previous.notes && state.examAttempts === previous.examAttempts) return;
      pendingSnapshot = snapshotFromStore(state);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void flush(), 700);
    });

    return () => {
      active = false;
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [pending, userId]);

  return null;
}
