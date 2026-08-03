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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !body.trim()) {
      setError("お名前・メールアドレス・お問い合わせ内容を入力してください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("メールアドレスの形式が正しくありません。");
      return;
    }

    const subject = encodeURIComponent(`【お問い合わせ】${category}（${name}）`);
    const text = encodeURIComponent(
      `お名前：${name}\nメールアドレス：${email}\nカテゴリ：${category}\n\n${body}`,
    );
    window.location.href = `mailto:contact@mikko.app?subject=${subject}&body=${text}`;
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

      <button
        type="submit"
        className="w-full rounded-xl bg-[#2563EB] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#2563EB]/25 transition hover:-translate-y-0.5 hover:bg-[#1d4ed8] sm:w-auto sm:px-10"
      >
        送信する（メーラーが開きます）
      </button>

      <p className="text-xs text-ink-soft">
        送信ボタンを押すと、お使いのメールソフトが起動し、入力内容が自動入力されたメールが作成されます。そのまま送信してください。
      </p>
    </form>
  );
}
