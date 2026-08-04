/** 現在の年月キー。例: "2026-08" */
export function monthKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

declare global {
  interface Window {
    __mikko_user_id?: string | null;
  }
}

/**
 * ユーザーID（ブラウザに永続化）。
 * ログイン中は Supabase の user.id を使い（複数デバイスで共通）、
 * 未ログイン時はローカル生成の匿名IDを使う。
 */
export function anonymousId(): string {
  if (typeof window === "undefined") return "ssr";
  const loggedInId = window.__mikko_user_id;
  if (loggedInId) return loggedInId;
  const KEY = "mikko_anon_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** ログイン状態をブラウザのグローバルに反映する（ログイン/ログアウト時に呼ぶ）。 */
export function setLoggedInUserId(id: string | null): void {
  if (typeof window === "undefined") return;
  window.__mikko_user_id = id ?? null;
}

/** ローカルに保存された匿名IDを直接読む（ログイン中でも基礎IDを取得したい時に使う）。 */
export function rawAnonymousId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "mikko_anon_id";
  return localStorage.getItem(KEY) || "";
}

/** 月別ローカル利用回数（クライアント表示用）。 */
export function getMonthlyUsage(storageKey: string): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(`${storageKey}:${monthKey()}`) || "0");
}

export function incrementMonthlyUsage(storageKey: string): number {
  const key = `${storageKey}:${monthKey()}`;
  const next = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(next));
  return next;
}
