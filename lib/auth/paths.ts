/** Routes that require a signed-in user. The Rosary and sign-in stay public. */
const PROTECTED_PREFIXES = ["/prayers", "/intentions", "/profile"];

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Only allow same-site relative redirects (blocks `//evil.com` and absolute URLs). */
export function safeNext(next: string | null | undefined, fallback = "/profile") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
