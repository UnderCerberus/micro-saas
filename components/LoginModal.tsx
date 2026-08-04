"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function LoginModal({
  onClose,
  onLoggedIn,
}: {
  onClose: () => void;
  onLoggedIn?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  async function handleMagicLink() {
    setStatus("sending");
    setMessage("");
    const client = supabase;
    if (!client) {
      setStatus("error");
      setMessage("認証機能が設定されていません。");
      return;
    }
    try {
      const { error } = await client.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${SITE_URL}/`,
        },
      });
      if (error) throw error;
      setStatus("sent");
      setMessage("ログイン用のメールを送信しました。メール内のリンクからログインしてください。");
      onLoggedIn?.();
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "メール送信に失敗しました。");
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#09090b] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">ログイン / 新規登録</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-0.5 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-white/70">
          ログインすると、購入したプランや利用履歴が複数のデバイスで共有できます。
        </p>

        {status === "sent" ? (
          <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-300">
            {message}
            <button type="button" onClick={onClose} className="mt-3 block w-full rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20">
              閉じる
            </button>
          </div>
        ) : (
          <>
            <label className="mb-1 block text-xs font-semibold text-white/60">メールアドレス</label>
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#6366F1]"
            />
            {status === "error" && (
              <p className="mt-2 text-xs text-rose-400">{message}</p>
            )}
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={status === "sending" || !email.trim()}
              className="mt-4 w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {status === "sending" ? "送信中..." : "ログインリンクを送信"}
            </button>
            <p className="mt-3 text-center text-xs text-white/40">
              パスワード不要。届いたメールのリンクをクリックするだけです。
            </p>
          </>
        )}
      </div>
    </div>
  );
}
