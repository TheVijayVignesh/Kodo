"use client";

import { useSyncExternalStore } from "react";

export type AccountSyncStatus = {
  state: "not_configured" | "signed_out" | "syncing" | "synced" | "error";
  message?: string;
};

let currentStatus: AccountSyncStatus = { state: "not_configured" };
const listeners = new Set<() => void>();

export function setAccountSyncStatus(status: AccountSyncStatus) {
  currentStatus = status;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() { return currentStatus; }

export function useAccountSyncStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
