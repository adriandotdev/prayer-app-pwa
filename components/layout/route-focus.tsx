"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * After a client-side navigation, keyboard and screen-reader focus would otherwise stay on the link that
 * was activated. Move it to <main> so the new page is read from the top. Skips the first load, and only
 * reacts to pathname changes (not search params).
 */
export function RouteFocus() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
