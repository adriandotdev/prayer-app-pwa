import { beforeEach, describe, expect, it, vi } from "vitest";

const record = vi.fn();
vi.mock("@/lib/rosary/actions", () => ({ recordRosarySession: (...args: unknown[]) => record(...args) }));

const store = new Map<string, string>();
const KEY = "ora:rosary-pending:v1";

beforeEach(() => {
  store.clear();
  record.mockReset();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
  });
  vi.stubGlobal("navigator", { onLine: true });
});

describe("rosary pending queue", () => {
  it("passes the intention to the action when online", async () => {
    record.mockResolvedValue("recorded");
    const { recordOrQueueRosary } = await import("@/lib/rosary/pending");
    await recordOrQueueRosary("joyful", "11111111-1111-4111-8111-111111111111");
    expect(record.mock.calls[0][3]).toBe("11111111-1111-4111-8111-111111111111");
    expect(store.has(KEY)).toBe(false);
  });

  it("queues with the intention when offline, then flushes it", async () => {
    record.mockRejectedValueOnce(new Error("offline"));
    const { recordOrQueueRosary, flushPendingRosaries } = await import("@/lib/rosary/pending");
    await recordOrQueueRosary("joyful", "11111111-1111-4111-8111-111111111111");
    expect(JSON.parse(store.get(KEY)!)[0].intentionId).toBe("11111111-1111-4111-8111-111111111111");

    record.mockResolvedValue("recorded");
    await flushPendingRosaries();
    expect(record).toHaveBeenLastCalledWith("joyful", expect.any(String), expect.anything(), "11111111-1111-4111-8111-111111111111");
    expect(store.has(KEY)).toBe(false);
  });

  it("still flushes old queued entries that have no intention", async () => {
    store.set(KEY, JSON.stringify([{ setId: "glorious", completedAt: new Date().toISOString() }]));
    record.mockResolvedValue("recorded");
    const { flushPendingRosaries } = await import("@/lib/rosary/pending");
    await flushPendingRosaries();
    expect(record).toHaveBeenCalledWith("glorious", expect.any(String), undefined, undefined);
  });
});
