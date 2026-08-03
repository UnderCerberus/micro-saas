import Link from "next/link";

const tools = [
  {
    href: "/brandkit",
    tag: "BrandKit",
    title: "ブランド素材を数秒で一括生成",
    desc: "OG画像・ロゴ・ファビコン・QRコード。すべてブラウザ内で完結するので無料・無制限。",
    icon: "🎨",
    points: ["OG画像（1200×630）", "ロゴ／ファビコン", "QRコード", "無料・無制限"],
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    href: "/contentpilot",
    tag: "ContentPilot",
    title: "AIで記事・SNS投稿を自動生成",
    desc: "テーマを入力するだけで、SEOブログ記事・Xスレッド・キャッチコピーを生成。",
    icon: "✍️",
    points: ["SEOブログ記事", "X（Twitter）スレッド", "キャッチコピー", "日本語最適化"],
    accent: "from-sky-500 to-cyan-400",
  },
];

const features = [
  { title: "運用費用 0円", desc: "Vercel・Supabase等の無料枠のみで構成。サーバー費用が一切かかりません。" },
  { title: "完全自動運営", desc: "ユーザーがセルフサービスで完結。バックオフィス作業は不要です。" },
  { title: "マネタイズ設計済み", desc: "広告（AdSense）＋ プレミアム課金（Stripe）の2軸で収益化できます。" },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 30rem at 50% -10%, rgba(139,92,246,0.25), transparent 60%), radial-gradient(40rem 20rem at 85% 10%, rgba(34,211,238,0.15), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:pt-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            完全無料のWebツールスイート
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              作る・稼ぐ・自動化
            </span>
            <br />
            を1つの場所に。
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
            ブランド素材の生成からAIによるコンテンツ制作まで。月額費用0円で始められる、無人運営マイクロSaaSです。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/brandkit"
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
            >
              ツールを試す
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-zinc-200 transition hover:bg-white/10"
            >
              料金プラン
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/25 hover:bg-white/10"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${t.accent} text-2xl`}>
                {t.icon}
              </div>
              <h2 className="text-xl font-extrabold text-white">{t.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{t.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {t.points.map((p) => (
                  <li key={p} className="rounded-full border border-white/10 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-fuchsia-300">
                {t.tag}を開く
                <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.03] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">なぜ MicroKit なのか</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
                <h3 className="font-extrabold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}