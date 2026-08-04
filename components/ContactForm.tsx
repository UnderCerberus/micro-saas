"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("ご質問・ご相談");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim() || !email.trim() || !body.trim()) {
      setError("お名前・メールアドレス・お問い合わせ内容を入力してください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("メールアドレスの形式が正しくありません。");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, text: body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "送信に失敗しました。時間をおいてお試しください。");
        return;
      }
      setSuccess(true);
      setName("");
      setEmail("");
      setCategory("ご質問・ご相談");
      setBody("");
    } catch {
      setError("送信に失敗しました。時間をおいてお試しください。");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft">お名前 *</span>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：山田 太郎"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink-soft">メールアドレス *</span>
          <input
            type="email"
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例：taro@example.com"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-ink-soft">お問い合わせ種別</span>
        <select
          className={inputCls}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>ご質問・ご相談</option>
          <option>不具合の報告</option>
          <option>プラン・決済について</option>
          <option>その他</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-ink-soft">お問い合わせ内容 *</span>
        <textarea
          className={`${inputCls} min-h-40 resize-y`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="お問い合わせ内容をご記入ください。"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
          お問い合わせを受け付けました。ご返信をお待ちください。
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-xl bg-[#2563EB] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#2563EB]/25 transition hover:-translate-y-0.5 hover:bg-[#1d4ed8] disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {sending ? "送信中..." : "送信する"}
      </button>

      <p className="text-xs text-ink-soft">
        送信ボタンを押すと、運営者宛にメールが届きます。ご返信まで数日かかる場合があります。
      </p>
    </form>
  );
}
