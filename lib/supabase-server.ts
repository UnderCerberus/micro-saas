import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function supabaseServerEnabled(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * APIリクエストのSupabaseセッションを検証し、ログイン中ならユーザーIDを返す。
 * 未ログイン・未設定時は null。
 */
export async function getAuthedUserId(req: NextRequest): Promise<string | null> {
  if (!supabaseServerEnabled()) return null;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: () => {},
    },
  });
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}
