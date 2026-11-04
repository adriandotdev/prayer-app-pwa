import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// No DOM renderer here, so useEffect just runs its callback and remembers the cleanup.
let cleanup: (() => void) | void;
vi.mock("react", () => ({
  useEffect: (fn: () => (() => void) | void) => {
    cleanup = fn();
  },
  useSyncExternalStore: () => true,
}));

import { useWakeLock } from "@/lib/reader/use-wake-lock";

type Sentinel = { released: boolean; release: ReturnType<typeof vi.fn> };

function sentinel(): Sentinel {
  const s: Sentinel = {
    released: false,
    release: vi.fn(() => {
      s.released = true;
      return Promise.resolve();
    }),
  };
  return s;
}

/** A request() whose promises the test resolves by hand, to control timing. */
function setup() {
  const pending: { resolve: (s: Sentinel) => void; reject: (e: Error) => void }[] = [];
  const request = vi.fn(
    () =>
      new Promise<Sentinel>((resolve, reject) => {
        pending.push({ resolve, reject });
      }),
  );
  let onVisibility: (() => void) | undefined;
  const doc = {
    visibilityState: "visible",
    addEventListener: vi.fn((_: string, fn: () => void) => (onVisibility = fn)),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal("navigator", { wakeLock: { request } });
  vi.stubGlobal("document", doc);
  return { request, pending, doc, fireVisible: () => onVisibility?.() };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  cleanup = undefined;
});
afterEach(() => vi.unstubAllGlobals());

describe("useWakeLock", () => {
  it("does nothing when disabled or unsupported", () => {
    const env = setup();
    useWakeLock(false);
    expect(env.request).not.toHaveBeenCalled();

    vi.stubGlobal("navigator", {});
    useWakeLock(true);
    expect(env.request).not.toHaveBeenCalled();
  });

  it("requests a screen lock and releases it on cleanup", async () => {
    const env = setup();
    useWakeLock(true);
    expect(env.request).toHaveBeenCalledWith("screen");
    const lock = sentinel();
    env.pending[0].resolve(lock);
    await flush();
    cleanup?.();
    expect(lock.release).toHaveBeenCalledTimes(1);
    expect(env.doc.removeEventListener).toHaveBeenCalled();
  });

  it("does not start a second request while one is pending (no leaked lock)", async () => {
    const env = setup();
    useWakeLock(true);
    env.fireVisible(); // tab switch before the first request resolves
    expect(env.request).toHaveBeenCalledTimes(1);

    const lock = sentinel();
    env.pending[0].resolve(lock);
    await flush();
    cleanup?.();
    expect(lock.release).toHaveBeenCalledTimes(1);
  });

  it("re-acquires when the tab becomes visible again after the browser released the lock", async () => {
    const env = setup();
    useWakeLock(true);
    const first = sentinel();
    env.pending[0].resolve(first);
    await flush();

    env.fireVisible(); // still held: nothing to do
    expect(env.request).toHaveBeenCalledTimes(1);

    first.released = true; // the browser drops it when the tab is hidden
    env.fireVisible();
    expect(env.request).toHaveBeenCalledTimes(2);

    env.doc.visibilityState = "hidden";
    env.fireVisible();
    expect(env.request).toHaveBeenCalledTimes(2);
  });

  it("releases a lock that arrives after cleanup", async () => {
    const env = setup();
    useWakeLock(true);
    cleanup?.();
    const late = sentinel();
    env.pending[0].resolve(late);
    await flush();
    expect(late.release).toHaveBeenCalledTimes(1);
  });

  it("swallows a refused request and can try again", async () => {
    const env = setup();
    useWakeLock(true);
    env.pending[0].reject(new Error("NotAllowedError"));
    await flush();
    env.fireVisible();
    expect(env.request).toHaveBeenCalledTimes(2);
  });
});
