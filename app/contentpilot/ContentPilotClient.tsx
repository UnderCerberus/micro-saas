"use client";

import { useMemo, useState } from "react";

type Mode = "blog" | "thread" | "catchcopy";

const FREE_LIMIT = 1;

const STANDARD_LINK =
  process.env.NEXT_PUBLIC_STRIPE_STANDARD_LINK ||
  "https://buy.stripe.com/test_8x2eVd8dr0vceF47oR6c000";
const PRO_LINK = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "";

const modeOptions: { id: Mode; label: string; desc: string }[] = [
  { id: "blog", label: "ブログ記事", desc: "SEOに強い構成の記事" },
  { id: "thread", label: "Xスレッド", desc: "連番の投稿連載" },
  { id: "catchcopy", label: "キャッチコピー", desc: "商品・サービスの文言" },
];

const toneOptions = [
  { id: "丁寧で読みやすい", label: "丁寧・読みやすい" },
  { id: "カジュアルで親しみやすい", label: "カジュアル" },
  { id: "プロフェッショナルで格調高い", label: "プロフェッショナル" },
  { id: "元気で明るい", label: "元気・明るい" },
];

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand";

function getUsage(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("cp_usage") || "0");
}

export default function ContentPilotClient() {
  const [mode, setMode] = useState<Mode>("blog");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState(toneOptions[0].id);
  const [length, setLength] = useState(800);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState(getUsage);
  const [copied, setCopied] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const remaining = Math.max(FREE_LIMIT - usage, 0);
  const lengthLabel =
    mode === "blog" ? `想定文字数（${length}字）` : mode === "thread" ? `ツイート数（${length}本）` : `コピー個数（${length}個）`;

  const lengthOptions = useMemo(() => {
    if (mode === "blog") return [300, 800, 1500];
    if (mode === "thread") return [5, 10, 15];
    return [5, 10, 20];
  }, [mode]);

  async function handleGenerate() {
    if (!topic.trim()) {
      setError("テーマを入力してください");
      return;
    }
    if (remaining <= 0) {
      setError("無料回数の上限に達しました。");
      setShowUpgrade(true);
      return;
    }
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          topic,
          keywords,
          style: tone,
          length,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }
      setOutput(data.text || "");
      setIsDemo(Boolean(data.demo));
      localStorage.setItem("cp_usage", String(usage + 1));
      setUsage(usage + 1);
    } catch {
      setError("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">ContentPilot</h1>
        <p className="mt-2 text-ink-soft">
          テーマを入力するだけで、ブログ記事・Xスレッド・キャッチコピーをAIが自動生成します。
        </p>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1 text-xs text-ink-soft">
          無料枠：残り <span className="font-bold text-brand">{remaining}</span> 回 / {FREE_LIMIT}回
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
          <div className="flex flex-wrap gap-2">
            {modeOptions.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  setLength(m.id === "blog" ? 800 : m.id === "thread" ? 10 : 10);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  mode === m.id
                    ? "bg-brand text-white shadow-sm"
                    : "border border-line bg-white text-ink-soft hover:border-brand/30 hover:text-brand"
                }`}
              >
                {m.label}
                <span className="ml-1 text-[10px] font-normal opacity-80">{m.desc}</span>
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink-soft">
              {mode === "blog"
                ? "記事のテーマ"
                : mode === "thread"
                  ? "スレッドのテーマ"
                  : "商品名・サービス・テーマ"}
            </span>
            <input
              className={inputCls}
              placeholder={
                mode === "blog"
                  ? "例：初心者向けの在宅ワーク術"
                  : mode === "thread"
                    ? "例：1年間で月10万を稼ぐまでにやったこと"
                    : "例：AI英会話アプリ「TalkMate」"
              }
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink-soft">追加キーワード・要件（任意）</span>
            <input
              className={inputCls}
              placeholder="例：時短, 体験談, 失敗しない方法"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-soft">トーン</span>
              <select className={inputCls} value={tone} onChange={(e) => setTone(e.target.value)}>
                {toneOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-soft">{lengthLabel}</span>
              <select
                className={inputCls}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              >
                {lengthOptions.map((n) => (
                  <option key={n} value={n}>
                    {mode === "blog" ? `${n}字` : mode === "thread" ? `${n}本` : `${n}個`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-xl bg-brand px-5 py-3 font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "生成中..." : "AIで生成する"}
          </button>
        </div>

        <div className="flex flex-col rounded-2xl border border-line bg-surface p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-soft">生成結果</h2>
            <div className="flex items-center gap-2">
              {isDemo && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs text-amber-600">
                  デモ出力
                </span>
              )}
              {output && (
                <button
                  onClick={handleCopy}
                  className="rounded-lg border border-line bg-white px-3 py-1 text-xs font-bold text-ink-soft transition hover:border-brand/30 hover:text-brand"
                >
                  {copied ? "コピーしました✓" : "コピー"}
                </button>
              )}
            </div>
          </div>
          <pre className="min-h-[320px] flex-1 whitespace-pre-wrap rounded-lg border border-line bg-base p-4 text-sm leading-relaxed text-ink">
            {output ||
              (loading
                ? "生成しています..."
                : "生成結果がここに表示されます。テーマを入力して「AIで生成する」を押してください。")}
          </pre>
          {output && (
            <p className="mt-3 text-right text-xs text-ink-soft">
              約 {output.length} 文字
            </p>
          )}
        </div>
      </div>

      {showUpgrade && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowUpgrade(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black tracking-tight text-ink">
              無料枠の上限に達しました
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              今月のContentPilot無料枠（月{FREE_LIMIT}回）を使い切りました。アップグレードすると今すぐ生成を再開できます。
            </p>

            <a
              href={STANDARD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 block rounded-2xl border-2 border-brand bg-brand-soft/60 p-5 transition hover:border-brand-dark"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] px-3 py-0.5 text-[11px] font-bold text-white">
                おすすめ・一番人気
              </span>
              <span className="mt-2 flex items-center justify-between">
                <span>
                  <span className="block text-lg font-black text-ink">Standard</span>
                  <span className="block text-xs text-ink-soft">ContentPilot 月7回</span>
                </span>
                <span className="block text-xl font-black text-brand">¥500/月</span>
              </span>
              <span className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#2563EB]/30 transition group-hover:-translate-y-0.5 group-hover:bg-[#1d4ed8]">
                今すぐアップグレード
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </a>

            <a
              href={PRO_LINK || "#"}
              target={PRO_LINK ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-between rounded-xl border border-line bg-white px-5 py-3 text-sm transition hover:border-brand/30"
            >
              <span className="font-bold text-ink">Pro（全機能無制限）</span>
              <span className="font-bold text-ink-soft">{PRO_LINK ? "¥900/月" : "準備中"}</span>
            </a>

            <button
              type="button"
              onClick={() => setShowUpgrade(false)}
              className="mt-4 w-full rounded-xl px-5 py-2.5 text-sm font-bold text-ink-soft transition hover:bg-white hover:text-ink"
            >
              あとで検討する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}