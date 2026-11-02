import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PREFS, READER_STORAGE_KEY } from "@/lib/reader/preferences";

// The module keeps a fallback copy at module level, so each test loads a fresh one.
async function load(storage: Partial<Storage>) {
  vi.resetModules();
  vi.stubGlobal("window", { localStorage: storage, addEventListener: () => {}, removeEventListener: () => {} });
  return import("@/lib/reader/use-reader-prefs");
}

function memoryStorage(initial?: string) {
  let value: string | null = initial ?? null;
  return {
    getItem: vi.fn(() => value),
    setItem: vi.fn((_: string, v: string) => {
      value = v;
    }),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("setReaderPrefs", () => {
  it("merges a patch into the stored preferences and persists it", async () => {
    const storage = memoryStorage('{"scale":1.2,"leading":1.75,"theme":"sepia","keepAwake":true}');
    const { setReaderPrefs, getReaderPrefs } = await load(storage);
    setReaderPrefs({ keepAwake: false });
    expect(getReaderPrefs()).toEqual({ scale: 1.2, leading: 1.75, theme: "sepia", keepAwake: false });
    expect(storage.setItem).toHaveBeenCalledWith(READER_STORAGE_KEY, expect.stringContaining('"keepAwake":false'));
  });

  it("clamps what it writes", async () => {
    const { setReaderPrefs, getReaderPrefs } = await load(memoryStorage());
    setReaderPrefs({ scale: 9 });
    expect(getReaderPrefs().scale).toBe(1.5);
  });

  describe("when storage refuses writes", () => {
    let storage: ReturnType<typeof memoryStorage>;
    beforeEach(() => {
      // An older value is still readable, as in quota-exceeded.
      storage = memoryStorage('{"theme":"sepia"}');
      storage.setItem.mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
    });

    it("keeps the change for this visit, winning over the older stored value", async () => {
      const { setReaderPrefs, getReaderPrefs } = await load(storage);
      setReaderPrefs({ theme: "night" });
      expect(getReaderPrefs().theme).toBe("night");
    });

    it("stops using the fallback once a write succeeds", async () => {
      const { setReaderPrefs, getReaderPrefs } = await load(storage);
      setReaderPrefs({ theme: "night" });
      storage.setItem.mockImplementation((_k: string, v: string) => {
        storage.getItem.mockReturnValue(v);
      });
      setReaderPrefs({ scale: 1.25 });
      storage.getItem.mockReturnValue(null); // key cleared elsewhere
      expect(getReaderPrefs()).toEqual(DEFAULT_PREFS);
    });
  });

  it("falls back to the in-memory copy when reading storage throws", async () => {
    const storage = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    };
    const { setReaderPrefs, getReaderPrefs } = await load(storage);
    expect(getReaderPrefs()).toEqual(DEFAULT_PREFS);
    setReaderPrefs({ theme: "sepia" });
    expect(getReaderPrefs().theme).toBe("sepia");
  });
});
