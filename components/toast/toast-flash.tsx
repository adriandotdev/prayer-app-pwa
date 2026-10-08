"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { toast } from "@/lib/toast";

const COOKIE = "ora-flash";

/** Shows (once) the toast a server action queued before redirecting. */
export function ToastFlash() {
  const pathname = usePathname();

  useEffect(() => {
    const entry = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
    if (!entry) return;
    document.cookie = `${COOKIE}=; path=/; max-age=0`;
    const value = decodeURIComponent(entry.slice(COOKIE.length + 1));
    const split = value.indexOf(":");
    const kind = value.slice(0, split);
    const message = value.slice(split + 1);
    if (!message) return;
    if (kind === "error") toast.error(message);
    else toast.success(message);
  }, [pathname]);

  return null;
}
