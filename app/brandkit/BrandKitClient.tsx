"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { renderOG, renderLogo, renderFavicon, canvasToDataURL, type BrandStyle } from "@/lib/brandCanvas";

type Tool = "og" | "logo" | "favicon" | "qr";

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
      <span className="text-xs font-semibold text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-500";

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
      className="w-full rounded-lg border border-white/10 bg-zinc-900"
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
  }, [qrValue, qrSize]);

  const handleDownload = useCallback(() => {
    if (tool === "og") download(canvasToDataURL(renderOG(style)), "og-image.png");
    else if (tool === "logo") download(canvasToDataURL(renderLogo(style)), "logo.png");
    else if (tool === "favicon") download(canvasToDataURL(renderFavicon(style)), "favicon.png");
    else download(qrData, "qrcode.png");
  }, [tool, style, qrData]);

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
        <p className="mt-2 text-zinc-400">
          ブランド素材を数秒で生成。すべてブラウザ内で完結するため無料・無制限・サーバー費用ゼロです。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap gap-2">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  tool === t.id
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                    : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/10"
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
                <span className="text-xs text-zinc-500">{qrSize}px</span>
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
                    className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-zinc-900"
                  />
                  <span className="text-xs text-zinc-400">{fromColor}</span>
                </div>
              </Field>
              <Field label="グラデーション終了色">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={toColor}
                    onChange={(e) => setToColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-zinc-900"
                  />
                  <span className="text-xs text-zinc-400">{toColor}</span>
                </div>
              </Field>
              <Field label="アクセント色">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-zinc-900"
                  />
                  <span className="text-xs text-zinc-400">{accentColor}</span>
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-sm font-bold text-zinc-400">プレビュー</h2>
            {tool === "qr" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrData} alt="QRコードプレビュー" className="mx-auto max-h-72" />
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
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
          >
            PNGをダウンロード
          </button>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-300">利用コード（コピー用）</h3>
              <button onClick={handleCopy} className="text-xs font-bold text-fuchsia-300 hover:underline">
                {copied ? "コピーしました✓" : "コピー"}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 text-xs leading-relaxed text-emerald-300">
              {snippet}
            </pre>
            <p className="mt-3 text-xs text-zinc-500">
              ※ OG画像・ファビコンは、PNGを保存後、ホスティング（Vercel等）にアップロードしてURLを公開してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}