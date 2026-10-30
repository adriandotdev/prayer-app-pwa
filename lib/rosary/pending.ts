"use client";

import { recordRosarySession } from "./actions";

/**
 * Rosaries finished while the server was unreachable. They sync once we are back online,
 * so the queue is small, short-lived and dropped as soon as the visitor is found signed out
 * (it must never be credited to someone who signs in later on a shared device).
 */
type Pending = { setId: string; completedAt: string; clientId?: string };

const KEY = "ora:rosary-pending:v1";
const MAX = 20;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function read(): Pending[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value)
      ? value.filter(
          (p): p is Pending => typeof p?.setId === "string" && typeof p?.completedAt === "string",
        )
      : [];
  } catch {
    return [];
  }
}

function write(items: Pending[]) {
  try {
    if (items.length) window.localStorage.setItem(KEY, JSON.stringify(items));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: the session is simply not kept */
  }
}

export function clearPendingRosaries() {
  write([]);
}

/**
 * Records now; if the server can't be reached, queues for later. The same client id rides along either
 * way, so a request that did reach the server but lost its response is not counted again on retry.
 */
export async function recordOrQueueRosary(setId: string) {
  const completedAt = new Date().toISOString();
  const clientId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : undefined;
  try {
    await recordRosarySession(setId, completedAt, clientId);
  } catch {
    write([...read(), { setId, completedAt, clientId }].slice(-MAX));
  }
}

let flushing = false;

export async function flushPendingRosaries() {
  if (flushing || !navigator.onLine) return;
  flushing = true;
  try {
    const cutoff = Date.now() - MAX_AGE_MS;
    let items = read().filter((p) => Date.parse(p.completedAt) > cutoff);
    while (items.length) {
      const [next, ...rest] = items;
      let result;
      try {
        result = await recordRosarySession(next.setId, next.completedAt, next.clientId);
      } catch {
        break; // still unreachable: keep the rest for next time
      }
      if (result === "signed-out") {
        items = [];
        break;
      }
      items = rest;
      write(items);
    }
    write(items);
  } finally {
    flushing = false;
  }
}
