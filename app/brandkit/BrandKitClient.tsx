"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { renderOG, renderLogo, renderFavicon, canvasToDataURL, type BrandStyle } from "@/lib/brandCanvas";

type Tool = "og" | "logo" | "favicon" | "qr";

const BK_FREE_LIMIT = 2;

const STANDARD_LINK =
  process.env.NEXT_PUBLIC_STRIPE_STANDARD_LINK ||
  "https://buy.stripe.com/test_8x2eVd8dr0vceF47oR6c000";
const PRO_LINK = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "";

const tools: { id: Tool; label: string }[] = [
  { id: "og", label: "OG画像" },
  { id: "logo", label: "ロゴ" },
  { id: "favicon", label: "ファビコン" },
  { id: "qr", label: "QRコード" },
];

function download(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand";

function BrandPreview({
  render,
  width,
  height,
}: {
  render: () => HTMLCanvasElement;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const src = render();
    const ctx = el.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, el.width, el.height);
    ctx.drawImage(src, 0, 0, el.width, el.height);
  });

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      className="w-full rounded-lg border border-line bg-zinc-100"
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
}

export default function BrandKitClient() {
  const [tool, setTool] = useState<Tool>("og");
  const [brand, setBrand] = useState("Acme");
  const [icon, setIcon] = useState("A");
  const [title, setTitle] = useState("ブランド素材を数秒で生成する");
  const [subtitle, setSubtitle] = useState("OG画像・ロゴ・ファビコン・QRコードを無料で");
  const [url, setUrl] = useState("microworks.vercel.app");
  const [fromColor, setFromColor] = useState("#8b5cf6");
  const [toColor, setToColor] = useState("#d946ef");
  const [accentColor, setAccentColor] = useState("#f0abfc");

  const [qrValue, setQrValue] = useState("https://microworks.vercel.app");
  const [qrSize, setQrSize] = useState(512);
  const [qrData, setQrData] = useState("");

  const [downloads, setDownloads] = useState<number>(() =>
    typeof window === "undefined" ? 0 : Number(localStorage.getItem("bk_downloads") || "0"),
  );
  const [showUpgrade, setShowUpgrade] = useState(false);

  const remaining = Math.max(BK_FREE_LIMIT - downloads, 0);
  const freeLocked = remaining <= 0;

  const style: BrandStyle = useMemo(
    () => ({
      brand,
      icon,
      title,
      subtitle,
      fromColor,
      toColor,
      textColor: "#ffffff",
      accent: accentColor,
      url,
    }),
    [brand, icon, title, subtitle, fromColor, toColor, accentColor, url],
  );

  useEffect(() => {
    if (freeLocked) return;
    let active = true;
    QRCode.toDataURL(qrValue || "https://example.com", {
      width: qrSize,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).then((url) => {
      if (active) setQrData(url);
    });
    return () => {
      active = false;
    };
  }, [qrValue, qrSize, freeLocked]);

  const handleDownload = useCallback(() => {
    if (freeLocked) {
      setShowUpgrade(true);
      return;
    }
    if (tool === "og") download(canvasToDataURL(renderOG(style)), "og-image.png");
    else if (tool === "logo") download(canvasToDataURL(renderLogo(style)), "logo.png");
    else if (tool === "favicon") download(canvasToDataURL(renderFavicon(style)), "favicon.png");
    else download(qrData, "qrcode.png");
    const next = downloads + 1;
    setDownloads(next);
    localStorage.setItem("bk_downloads", String(next));
  }, [tool, style, qrData, freeLocked, downloads]);

  const snippet =
    tool === "og"
      ? [
          `<meta property="og:title" content="${title}" />`,
          `<meta property="og:description" content="${subtitle}" />`,
          `<meta property="og:image" content="${url}/og-image.png" />`,
          `<meta property="og:type" content="website" />`,
        ].join("\n")
      : tool === "favicon"
        ? `<link rel="icon" type="image/png" href="${url}/favicon.png" />`
        : tool === "qr"
          ? `<!-- 生成したQRコードのPNGをアップロードしてお使いください -->`
          : `<!-- ロゴを掲載するだけです。PNGをダウンロードしてご利用ください -->`;

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await copyText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">BrandKit</h1>
        <p className="mt-2 text-ink-soft">
          ブランド素材を数秒で生成。すべてブラウザ内で完結するため無料・無制限・サーバー費用ゼロです。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
          <div className="flex flex-wrap gap-2">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  tool === t.id
                    ? "bg-brand text-white shadow-sm"
                    : "border border-line bg-white text-ink-soft hover:border-brand/30 hover:text-brand"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tool === "qr" ? (
            <div className="space-y-4">
              <Field label="QRコードにするURL">
                <input className={inputCls} value={qrValue} onChange={(e) => setQrValue(e.target.value)} />
              </Field>
              <Field label="サイズ（px）">
                <input
                  type="range"
                  min={128}
                  max={1024}
                  step={16}
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                />
                <span className="text-xs text-ink-soft">{qrSize}px</span>
              </Field>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="ブランド名">
                <input className={inputCls} value={brand} onChange={(e) => setBrand(e.target.value)} />
              </Field>
              <Field label="アイコン（文字／絵文字）">
                <input className={inputCls} value={icon} onChange={(e) => setIcon(e.target.value)} />
              </Field>
              {tool === "og" && (
                <>
                  <Field label="OGタイトル">
                    <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
                  </Field>
                  <Field label="OGサブタイトル">
                    <input className={inputCls} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                  </Field>
                </>
              )}
              <Field label="グラデーション開始色">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fromColor}
                    onChange={(e) => setFromColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-line bg-white"
                  />
                  <span className="text-xs text-ink-soft">{fromColor}</span>
                </div>
              </Field>
              <Field label="グラデーション終了色">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={toColor}
                    onChange={(e) => setToColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-line bg-white"
                  />
                  <span className="text-xs text-ink-soft">{toColor}</span>
                </div>
              </Field>
              <Field label="アクセント色">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-line bg-white"
                  />
                  <span className="text-xs text-ink-soft">{accentColor}</span>
                </div>
              </Field>
              {tool === "og" && (
                <Field label="URL（OG画像配置先）">
                  <input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} />
                </Field>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink-soft">プレビュー</h2>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                  remaining > 0
                    ? "border border-brand/30 bg-brand-soft text-brand"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-600"
                }`}
              >
                FREE枠 残り{remaining}回
              </span>
            </div>
            {tool === "qr" ? (
              freeLocked ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-zinc-50 px-6 py-14 text-center">
                  <p className="text-sm font-bold text-ink">QRコード生成は有料プランでご利用いただけます</p>
                  <button
                    type="button"
                    onClick={() => setShowUpgrade(true)}
                    className="text-sm font-bold text-brand hover:underline"
                  >
                    プランを見る →
                  </button>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrData} alt="QRコードプレビュー" className="mx-auto max-h-72" />
              )
            ) : (
              <BrandPreview
                render={
                  tool === "og" ? () => renderOG(style) : tool === "logo" ? () => renderLogo(style) : () => renderFavicon(style)
                }
                width={tool === "og" ? 1200 : 512}
                height={tool === "og" ? 630 : 512}
              />
            )}
          </div>

          <button
            onClick={handleDownload}
            className="w-full rounded-xl bg-brand px-5 py-3 font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
          >
            {freeLocked ? "ダウンロードはアップグレード対象" : "PNGをダウンロード"}
          </button>

          <div className="rounded-2xl border border-line bg-zinc-50 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">利用コード（コピー用）</h3>
              <button onClick={handleCopy} className="text-xs font-bold text-brand hover:underline">
                {copied ? "コピーしました✓" : "コピー"}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-line bg-base p-3 text-xs leading-relaxed text-emerald-700">
              {snippet}
            </pre>
            <p className="mt-3 text-xs text-ink-soft">
              ※ OG画像・ファビコンは、PNGを保存後、ホスティング（Vercel等）にアップロードしてURLを公開してください。
            </p>
          </div>
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
              BrandKitの無料ダウンロード（月{BK_FREE_LIMIT}回）を使い切りました。アップグレードするとダウンロード・QRコード生成を無制限にご利用いただけます。
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
                  <span className="block text-xs text-ink-soft">BrandKit 全機能・ダウンロード可</span>
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