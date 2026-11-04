import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";
import { requireServiceRoleEnv } from "@/lib/env";

/**
 * Service-role client that bypasses RLS. Use only in server actions that must act on an account
 * as a whole (deleting it) and only after the caller's identity was verified with getUser().
 */
export function createAdminClient() {
  const { url, serviceRoleKey } = requireServiceRoleEnv();
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
