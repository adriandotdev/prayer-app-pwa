import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/** Supabase auth cookies are named sb-<project>-auth-token (optionally chunked as .0, .1). */
const hasAuthCookie = (request: NextRequest) => request.cookies.getAll().some(({ name }) => name.startsWith("sb-"));

export async function proxy(request: NextRequest) {
  // A visitor with no auth cookie cannot be signed in, so serve the prerendered landing page and skip the
  // session round trip. Anyone with a cookie falls through to the dynamic "/".
  if (request.nextUrl.pathname === "/" && request.method === "GET" && !hasAuthCookie(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/guest-home";
    const response = NextResponse.rewrite(url);
    // The rewrite alone leaves "/" as no-store; ask the CDN to hold the guest page for an hour.
    response.headers.set("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    return response;
  }
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    // Skip static assets, the service worker and the manifest.
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|robots.txt|sitemap.xml|\\.well-known|opengraph-image|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
