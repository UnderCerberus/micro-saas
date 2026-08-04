import { createClient } from "@supabase/supabase-js";
import type { Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function supabaseEnabled(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

let _client: ReturnType<typeof createClient> | null = null;

/** ブラウザ専用のSupabaseクライアント（未設定時は null）。 */
export function getSupabase(): ReturnType<typeof createClient> | null {
  if (!supabaseEnabled()) return null;
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

export function supabaseUserId(session: Session | null): string {
  return session?.user?.id ?? "";
}
