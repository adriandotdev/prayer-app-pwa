import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";
import { isProtectedPath } from "@/lib/auth/paths";
import { getSupabaseEnv } from "@/lib/env";

/**
 * Refreshes the Supabase auth session on every matched request and forwards the
 * refreshed cookies, and sends signed-out visitors away from protected routes.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const env = getSupabaseEnv();
  const { pathname } = request.nextUrl;

  const redirectToLogin = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  };

  if (!env) return { response: isProtectedPath(pathname) ? redirectToLogin() : response, user: null };

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(pathname)) {
    // Carry over any refreshed auth cookies onto the redirect.
    const redirect = redirectToLogin();
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return { response: redirect, user };
  }

  return { response, user };
}
