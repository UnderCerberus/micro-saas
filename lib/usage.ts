/** 現在の年月キー。例: "2026-08" */
export function monthKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** 匿名ユーザーID（ブラウザに永続化）。初回は生成して保存する。 */
export function anonymousId(): string {
  if (typeof window === "undefined") return "ssr";
  const KEY = "mikko_anon_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
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
