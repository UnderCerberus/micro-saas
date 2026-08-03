import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン｜MicroKit",
  description: "MicroKitの料金プラン。基本無料で、Proプランは月額¥500から。Stripeで即時決済できます。",
};

const PRO_LINK = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "";
const PRO_PRICE = process.env.NEXT_PUBLIC_PRO_PRICE || "¥500/月";

const freeFeatures = [
  "BrandKit 全機能（無制限）",
  "ContentPilot 月10回",
  "商用利用OK",
  "生成ファイルのダウンロード",
];

const proFeatures = [
  "ContentPilot 無制限",
  "優先生成（高速モデル）",
  "一括生成・API連携（予定）",
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
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  href?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 ${
        highlighted
          ? "border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-transparent shadow-xl shadow-violet-500/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <h2 className="text-lg font-extrabold text-white">{name}</h2>
      <p className="mt-1 text-sm text-zinc-400">{desc}</p>
      <p className="mt-4 text-3xl font-black text-white">
        {price}
        {price !== "¥0" && <span className="text-sm font-medium text-zinc-400">（税込）</span>}
      </p>
      <ul className="mt-6 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
            <span className="mt-0.5 text-emerald-400">✓</span>
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
              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:brightness-110"
              : "border border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10"
          }`}
        >
          {cta}
        </a>
      ) : (
        <button
          disabled
          className="mt-6 cursor-not-allowed rounded-xl border border-white/10 bg-zinc-900 px-5 py-3 text-center font-bold text-zinc-500"
        >
          {cta}
        </button>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">料金プラン</h1>
        <p className="mt-3 text-zinc-400">
          基本機能はすべて無料。プロフェッショナル向けの追加機能だけをお支払いいただく、シンプルな2プランです。
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <PlanCard
          name="Free"
          price="¥0"
          desc="個人・お試し向け。いつでも無料で使い続けられます。"
          features={freeFeatures}
          cta="今すぐ無料で使う"
          href="/"
        />
        <PlanCard
          name="Pro"
          price={PRO_PRICE}
          desc="ヘビーユーザー・事業者向け。上限なしで快適に。"
          features={proFeatures}
          cta={PRO_LINK ? "Stripeで購入する" : "Stripe連携準備中"}
          href={PRO_LINK || undefined}
          highlighted
        />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
        <h3 className="font-bold text-white">運営方針</h3>
        <p className="mt-2">
          Freeプランの利用で収益は発生しませんが、Google
          AdSense（広告表示）とProプラン（Stripe決済）で運営費用0円を維持します。
          あなたの生成物は商用利用・再配布自由です。
        </p>
      </div>
    </div>
  );
}