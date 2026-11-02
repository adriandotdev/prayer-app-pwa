import { cookies } from "next/headers";

import type { ToastKind } from "@/lib/toast";

export const FLASH_COOKIE = "ora-flash";

/**
 * Queues a toast for the next page. Server actions mostly end in redirect(), so the message
 * rides a short-lived cookie that ToastFlash reads and clears after navigation.
 */
export async function flash(message: string, kind: ToastKind = "success") {
  (await cookies()).set(FLASH_COOKIE, `${kind}:${message}`, { path: "/", maxAge: 30, sameSite: "lax", httpOnly: false });
}
