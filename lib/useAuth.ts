"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { setLoggedInUserId } from "@/lib/usage";

export type AuthState = {
  isLoggedIn: boolean;
  userId: string;
  email: string;
  unavailable: boolean;
  loading: boolean;
};

const EMPTY: AuthState = {
  isLoggedIn: false,
  userId: "",
  email: "",
  unavailable: false,
  loading: true,
};

/** ログイン状態を管理するフック。Supabase未設定時は常に未ログイン扱い。 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(EMPTY);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    const sb = client;

    let active = true;

    async function refresh() {
      const { data } = await sb.auth.getSession();
      if (!active) return;
      const session = data.session;
      setLoggedInUserId(session?.user?.id ?? null);
      setState({
        isLoggedIn: Boolean(session),
        userId: session?.user?.id ?? "",
        email: session?.user?.email ?? "",
        unavailable: false,
        loading: false,
      });
    }

    refresh();

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setLoggedInUserId(session?.user?.id ?? null);
      setState({
        isLoggedIn: Boolean(session),
        userId: session?.user?.id ?? "",
        email: session?.user?.email ?? "",
        unavailable: false,
        loading: false,
      });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state.unavailable || !getSupabase()) {
    return { ...EMPTY, unavailable: true, loading: false };
  }

  return state;
}