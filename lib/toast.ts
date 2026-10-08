import { useSyncExternalStore } from "react";

export type ToastKind = "success" | "error";
export type ToastItem = { id: number; message: string; kind: ToastKind };

const MAX_VISIBLE = 3;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const EMPTY: ToastItem[] = [];

function emit(next: ToastItem[]) {
  toasts = next;
  listeners.forEach((l) => l());
}

function show(kind: ToastKind, message: string) {
  // A double fire (e.g. effect re-run) must not stack the same message.
  if (toasts.some((t) => t.kind === kind && t.message === message)) return;
  emit([...toasts, { id: nextId++, message, kind }].slice(-MAX_VISIBLE));
}

export const toast = {
  success: (message: string) => show("success", message),
  error: (message: string) => show("error", message),
  dismiss: (id: number) => emit(toasts.filter((t) => t.id !== id)),
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useToasts() {
  return useSyncExternalStore(subscribe, () => toasts, () => EMPTY);
}
