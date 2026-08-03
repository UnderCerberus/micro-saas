import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン｜Mikko",
  description: "Mikkoの料金プラン。基本無料で、Standardプランは月額¥500から。Stripeで即時決済できます。",
};

const STANDARD_LINK = process.env.NEXT_PUBLIC_STRIPE_STANDARD_LINK || "";
const PRO_LINK = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "";

const freeFeatures = [
  "BrandKit（一部制限あり）",
  "ContentPilot 月1回",
  "商用利用OK",
  "生成ファイルのダウンロード",
];

const standardFeatures = [
  "BrandKit 全機能",
  "ContentPilot 月7回",
  "商用利用OK",
  "生成ファイルのダウンロード",
];

const proFeatures = [
  "全機能無制限（BrandKit & ContentPilot）",
  "優先生成（高速モデル）",
  "全機能ロードマップを最速で利用",
];

function PlanCard({
  name,
  price,
  desc,
  features,
  cta,
  href,
  highlighted,
  badge,
  scale,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  href?: string;
  highlighted?: boolean;
  badge?: string;
  scale?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-6 transition ${
        scale ? "sm:scale-105 z-10" : ""
      } ${
        highlighted
          ? "border-brand shadow-2xl shadow-brand/20"
          : "border-line bg-surface shadow-sm"
      }`}
    >
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] px-4 py-1 text-xs font-bold tracking-wide text-white shadow-lg shadow-brand/30">
          {badge}
        </div>
      )}
      <h2 className="text-lg font-extrabold text-ink">{name}</h2>
      <p className="mt-1 text-sm text-ink-soft">{desc}</p>
      <p className="mt-4 text-3xl font-black text-ink">
        {price}
        {price !== "¥0" && <span className="text-sm font-medium text-ink-soft">（税込）</span>}
      </p>
      <ul className="mt-6 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
            <span className="mt-0.5 text-emerald-600">✓</span>
            {f}
          </li>
        ))}
      </ul>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-6 rounded-xl px-5 py-3 text-center font-bold transition ${
            highlighted
              ? "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/30 hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
              : "border border-line bg-white text-ink-soft hover:border-brand/30 hover:text-brand"
          }`}
        >
          {cta}
        </a>
      ) : (
        <button
          disabled
          className="mt-6 cursor-not-allowed rounded-xl border border-line bg-white px-5 py-3 text-center font-bold text-ink-soft/60"
        >
          {cta}
        </button>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">料金プラン</h1>
        <p className="mt-3 text-ink-soft">
          基本機能は無料。手軽に始めるならStandard、徹底的に使うならPro。あなたの使い方に合わせて選べる3プランです。
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <PlanCard
          name="Free"
          price="¥0"
          desc="個人・お試し向け。いつでも無料で使い続けられます。"
          features={freeFeatures}
          cta="今すぐ無料で使う"
          href="/"
        />
        <PlanCard
          name="Standard"
          price="¥500/月"
          desc="手軽に始めたい方に一番人気"
          features={standardFeatures}
          cta={STANDARD_LINK ? "¥500で始める" : "Stripe連携準備中"}
          href={STANDARD_LINK || undefined}
          highlighted
          scale
          badge="おすすめ・一番人気"
        />
        <PlanCard
          name="Pro"
          price="¥900/月"
          desc="ヘビーユーザー・事業者向け。上限なしで快適に。"
          features={proFeatures}
          cta={PRO_LINK ? "¥900で始める" : "Stripe連携準備中"}
          href={PRO_LINK || undefined}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-brand-soft/40 p-6 text-sm text-ink-soft">
        <h3 className="font-bold text-brand">運営方針</h3>
        <p className="mt-2">
          Freeプランの利用で収益は発生しませんが、Google
          AdSense（広告表示）とStandard/Proプラン（Stripe決済）で運営費用0円を維持します。
          あなたの生成物は商用利用・再配布自由です。
        </p>
      </div>
    </div>
  );
}
