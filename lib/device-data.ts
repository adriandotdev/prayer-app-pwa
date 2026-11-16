import { clearPendingRosaries } from "@/lib/rosary/pending";
import { clearProgress } from "@/lib/sequence/progress";

/**
 * Forgets what this device kept for the account: signed-in pages cached by the service worker, the
 * offline library copy, unsynced Rosary sessions and the saved prayer position. Call from client
 * code on sign-out or after the account is deleted, and wait for it before leaving the page.
 */
export async function clearDeviceData(): Promise<void> {
  clearPendingRosaries();
  clearProgress();
  navigator.serviceWorker?.controller?.postMessage({ type: "clear-private-pages" });
  try {
    // Loaded on demand so the IndexedDB code stays out of the main bundle.
    const { wipeLibrary } = await import("@/lib/library/sync");
    await wipeLibrary();
  } catch {
    /* storage unavailable: nothing was kept */
  }
}
