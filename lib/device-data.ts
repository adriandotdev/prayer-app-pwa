import { clearPendingRosaries } from "@/lib/rosary/pending";
import { clearProgress } from "@/lib/sequence/progress";

/**
 * Forgets what this device kept for the account: signed-in pages cached by the service worker,
 * unsynced Rosary sessions and the saved prayer position. Call from client code on sign-out or
 * after the account is deleted.
 */
export function clearDeviceData() {
  clearPendingRosaries();
  clearProgress();
  navigator.serviceWorker?.controller?.postMessage({ type: "clear-private-pages" });
}
