import Link from "next/link";
import Reveal from "@/components/Reveal";

function Icon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const features = [
  {
    title: "ブランド素材",
    desc: "OG画像・ロゴ・ファビコン・QRを、ブラウザ内で無制限に。",
    icon: (
      <>
        <path d="M12 2 2 7l10 5 10-5-10-5z" />
        <path d="M2 12l10 5 10-5" />
        <path d="M2 17l10 5 10-5" />
      </>
    ),
  },
  {
    title: "AIコンテンツ",
    desc: "ブログ記事・Xスレッド・キャッチコピーを、日本語最適化で即生成。",
    icon: (
      <>
        <path d="M12 3l1.8 4.8L18.6 9.6l-4.8 1.8L12 16.2l-1.8-4.8L5.4 9.6l4.8-1.8L12 3z" />
        <path d="M19 14l.7 1.8L21.5 16.5l-1.8.7L19 19l-.7-1.8-1.8-.7 1.8-.7L19 14z" />
      </>
    ),
  },
  {
    title: "コスト0円",
    desc: "サーバー費用ゼロ。広告とサブスクで、収益だけが残る設計。",
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.6-3 7.7-7 9.2C8 18.7 5 15.6 5 11V6l7-3z" />
        <path d="M9 11.5l2 2 4-4" />
      </>
    ),
  },
  {
    title: "即公開・自動運営",
    desc: "セルフサービスで完結。申請も承認も不要で、すぐ使えます。",
    icon: (
      <>
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
      </>
    ),
  },
];

const stats = [
  { value: "¥0", label: "月額運用費用" },
  { value: "30秒", label: "でAI記事生成" },
  { value: "無制限", label: "ブランド素材作成" },
  { value: "24/7", label: "自動で稼働" },
];

const btnPrimary =
  "group inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white shadow-[0_10px_36px_-8px_rgba(74,69,145,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_14px_44px_-8px_rgba(74,69,145,0.6)]";

export default function Home() {
  return (
    <div className="overflow-hidden bg-base">
      {/* ===== 1. HERO ===== */}
      <section className="relative flex min-h-[90svh] flex-col justify-center">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[40%] h-[480px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[130px]" />
          <svg
            className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 text-ink/5"
            viewBox="0 0 800 800"
            fill="none"
          >
            <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="1" />
            <circle cx="400" cy="400" r="390" stroke="currentColor" strokeWidth="0.75" />
            <path d="M400 100 C 620 200, 620 600, 400 700 C 180 600, 180 200, 400 100 Z" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-28 text-center">
          <Reveal>
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-light leading-[1.15] tracking-tight text-ink sm:text-7xl">
              ブランドを
              <br />
              <span className="bg-gradient-to-r from-brand via-brand-2 to-brand bg-clip-text font-semibold text-transparent">
                ゼロコスト
              </span>
              で、
              <br />
              武器に変える。
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mx-auto mt-8 max-w-xl text-sm font-light leading-relaxed text-ink-soft sm:text-base">
              OG画像・ロゴ・AI記事生成。サーバー費用0円で、あなたのサービスを誰よりも早く形に。
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/brandkit" className={btnPrimary}>
                無料で使い始める
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-7 py-4 text-sm font-medium text-ink-soft transition-colors duration-300 hover:border-brand/30 hover:text-brand"
              >
                機能を見る
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 2. FEATURES ===== */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <p className="mb-4 text-xs font-light tracking-[0.35em] text-brand">FEATURES</p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
                必要なものを、すべてここに。
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="group relative h-full rounded-3xl border border-line bg-surface p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-brand/25 hover:shadow-[0_20px_50px_-18px_rgba(74,69,145,0.25)]">
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-soft to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/10 bg-brand-soft text-brand">
                    <Icon className="h-6 w-6">{f.icon}</Icon>
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-ink-soft">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. TRUST ===== */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-brand/5 via-brand-soft to-brand/5 py-28" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="mb-14 text-center text-xs font-light tracking-[0.35em] text-brand">
              WHY MICROKIT
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="text-center">
                  <div className="font-display text-5xl font-semibold tracking-tight text-brand sm:text-6xl">
                    {s.value}
                  </div>
                  <div className="mt-3 text-sm font-light text-ink-soft">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. VISUAL / MOCKUP ===== */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <p className="mb-4 text-xs font-light tracking-[0.35em] text-brand">PRODUCT</p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
                数秒で、ここまで仕上がる。
              </h2>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="group relative" style={{ perspective: "1600px" }}>
              <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-tr from-brand/15 via-brand-soft to-brand-2/15 opacity-60 blur-3xl transition-opacity duration-700 group-hover:opacity-90" aria-hidden />
              <div className="relative rounded-3xl border border-line bg-surface shadow-2xl shadow-brand/10 transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:[transform:rotateX(4deg)] [transform:rotateX(6deg)_rotateZ(-4deg)]">
                <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
                  <span className="h-3 w-3 rounded-full bg-ink/15" />
                  <span className="h-3 w-3 rounded-full bg-ink/15" />
                  <span className="h-3 w-3 rounded-full bg-ink/15" />
                  <span className="ml-4 hidden flex-1 rounded-md bg-base px-3 py-1 text-[11px] font-light text-ink-soft sm:block">
                    microkit.app/brandkit
                  </span>
                </div>
                <div className="flex">
                  <div className="hidden w-44 space-y-3 border-r border-line p-5 sm:block">
                    <div className="h-7 rounded-lg bg-ink/5" />
                    <div className="h-7 rounded-lg bg-ink/5" />
                    <div className="h-7 rounded-lg bg-ink/5" />
                    <div className="h-7 rounded-lg bg-gradient-to-r from-brand to-brand-2 opacity-80" />
                  </div>
                  <div className="flex-1 p-5 sm:p-7">
                    <div className="flex aspect-[1200/630] flex-col items-center justify-center rounded-xl bg-gradient-to-br from-brand via-brand-deep to-brand-2 px-8 text-center text-white shadow-inner">
                      <div className="text-sm font-light tracking-widest text-white/80">MICROKIT</div>
                      <div className="mt-3 font-display text-xl font-semibold sm:text-2xl">
                        ブランド素材を数秒で生成する
                      </div>
                      <div className="mt-2 text-xs font-light text-white/85">
                        OG画像・ロゴ・QRコードを無料で
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 5. CTA ===== */}
      <section className="relative rounded-t-[3rem] bg-brand py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[3rem]" aria-hidden>
          <div className="absolute -top-24 left-1/2 h-72 w-[60%] -translate-x-1/2 rounded-full bg-white/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className="mb-6 text-xs font-light tracking-[0.35em] text-white/70">START NOW</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              今すぐ、無料で始める。
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm font-light text-white/80">
              登録も費用も不要。あなたのブランドを、今日から。
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/contentpilot"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-sm font-semibold text-brand shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                無料で使い始める
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}