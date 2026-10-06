"use client";

import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { useAppStore, type ExamAttempt, type LectureProgress } from "@/lib/store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { setAccountSyncStatus } from "@/lib/supabase/sync-status";

type LearnerSnapshot = {
  version: 1;
  progress: Record<string, LectureProgress>;
  bookmarks: string[];
  notes: Record<string, string>;
  examAttempts: ExamAttempt[];
};

function snapshotFromStore(state: ReturnType<typeof useAppStore.getState>): LearnerSnapshot {
  return {
    version: 1,
    progress: state.progress,
    bookmarks: state.bookmarks,
    notes: state.notes,
    examAttempts: state.examAttempts,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSnapshot(value: unknown): LearnerSnapshot | null {
  if (!isRecord(value) || value.version !== 1) return null;
  if (!isRecord(value.progress) || !Array.isArray(value.bookmarks) || !isRecord(value.notes) || !Array.isArray(value.examAttempts)) return null;
  return value as unknown as LearnerSnapshot;
}

export function AccountSync() {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAccountSyncStatus({ state: "not_configured" });
      return;
    }

    let generation = 0;
    let activeUserId: string | null = null;
    let processingUserId: string | null = null;
    let writesReady = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pendingSnapshot: { userId: string; snapshot: LearnerSnapshot } | undefined;
    let saving = false;

    const flush = async () => {
      if (saving || !pendingSnapshot) return;
      saving = true;
      while (pendingSnapshot) {
        const pending = pendingSnapshot;
        pendingSnapshot = undefined;
        if (activeUserId !== pending.userId) continue;
        setAccountSyncStatus({ state: "syncing" });
        const { error } = await supabase
          .from("learner_snapshots")
          .upsert({ user_id: pending.userId, snapshot: pending.snapshot });
        if (activeUserId !== pending.userId) continue;
        if (error) {
          setAccountSyncStatus({ state: "error", message: error.message });
        } else if (!pendingSnapshot) {
          setAccountSyncStatus({ state: "synced" });
        }
      }
      saving = false;
    };

    const startSync = async (user: User | null) => {
      const userId = user?.id ?? null;
      if (userId === activeUserId && (writesReady || processingUserId === userId)) return;
      const requestGeneration = ++generation;
      activeUserId = userId;
      writesReady = false;
      pendingSnapshot = undefined;
      if (timer) clearTimeout(timer);

      if (!userId) {
        processingUserId = null;
        setAccountSyncStatus({ state: "signed_out" });
        return;
      }

      processingUserId = userId;
      setAccountSyncStatus({ state: "syncing" });
      const { data, error } = await supabase
        .from("learner_snapshots")
        .select("snapshot")
        .eq("user_id", userId)
        .maybeSingle();
      if (requestGeneration !== generation) return;
      if (error) {
        processingUserId = null;
        writesReady = true;
        setAccountSyncStatus({ state: "error", message: error.message });
        return;
      }

      const local = snapshotFromStore(useAppStore.getState());
      const cloud = parseSnapshot(data?.snapshot);
      // A saved account snapshot is canonical on returning devices. This keeps
      // an older local cache from restoring progress the learner reset elsewhere.
      const merged = cloud ?? local;
      useAppStore.setState({
        progress: merged.progress as ReturnType<typeof useAppStore.getState>["progress"],
        bookmarks: merged.bookmarks as ReturnType<typeof useAppStore.getState>["bookmarks"],
        notes: merged.notes,
        examAttempts: merged.examAttempts,
      });

      const { error: saveError } = await supabase
        .from("learner_snapshots")
        .upsert({ user_id: userId, snapshot: merged });
      if (requestGeneration !== generation) return;
      processingUserId = null;
      writesReady = true;
      setAccountSyncStatus(saveError
        ? { state: "error", message: saveError.message }
        : { state: "synced" });
    };

    const unsubscribe = useAppStore.subscribe((state, previous) => {
      if (!writesReady || !activeUserId) return;
      if (state.progress === previous.progress && state.bookmarks === previous.bookmarks && state.notes === previous.notes && state.examAttempts === previous.examAttempts) return;
      pendingSnapshot = { userId: activeUserId, snapshot: snapshotFromStore(state) };
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void flush(), 700);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => void startSync(session?.user ?? null));
    });
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) setAccountSyncStatus({ state: "error", message: error.message });
      else void startSync(data.session?.user ?? null);
    });

    return () => {
      generation += 1;
      unsubscribe();
      subscription.unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
