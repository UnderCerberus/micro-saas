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

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ===== 1. HERO ===== */}
      <section className="relative flex min-h-[92svh] flex-col justify-center">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[42%] h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-600/35 via-fuchsia-500/20 to-cyan-500/25 blur-[140px]" />
          <svg
            className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 text-white/[0.04]"
            viewBox="0 0 800 800"
            fill="none"
          >
            <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="1" />
            <circle cx="400" cy="400" r="390" stroke="currentColor" strokeWidth="0.75" />
            <path d="M400 100 C 620 200, 620 600, 400 700 C 180 600, 180 200, 400 100 Z" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-28 text-center">
          <Reveal>
            <p className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-light tracking-widest text-zinc-300">
              <span className="h-1 w-1 rounded-full bg-fuchsia-400" />
              無料で使えるWebツールスイート
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-light leading-[1.15] tracking-tight sm:text-7xl">
              ブランドを
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text font-semibold text-transparent">
                ゼロコスト
              </span>
              で、
              <br />
              武器に変える。
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mx-auto mt-8 max-w-xl text-sm font-light leading-relaxed text-zinc-400 sm:text-base">
              OG画像・ロゴ・AI記事生成。サーバー費用0円で、あなたのサービスを誰よりも早く形に。
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/brandkit"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 shadow-[0_8px_40px_rgba(255,255,255,0.25)] transition-all duration-300 hover:shadow-[0_8px_60px_rgba(217,70,239,0.4)]"
              >
                無料で使い始める
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-20 flex flex-col items-center gap-2 text-zinc-500">
              <span className="text-[10px] font-light tracking-[0.3em]">SCROLL</span>
              <span className="flex h-10 w-6 items-start justify-center rounded-full border border-zinc-600 p-1.5">
                <span className="h-2 w-1 animate-bounce rounded-full bg-zinc-400" />
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 2. FEATURES ===== */}
      <section className="relative py-28 sm:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <p className="mb-4 text-xs font-light tracking-[0.35em] text-fuchsia-300">FEATURES</p>
              <h2 className="font-display text-3xl font-medium tracking-tight sm:text-5xl">
                必要なものを、すべてここに。
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="group relative h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-fuchsia-400/40 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_-15px_rgba(217,70,239,0.35)]">
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-fuchsia-200 transition-colors duration-500 group-hover:text-fuchsia-300">
                    <Icon className="h-6 w-6">{f.icon}</Icon>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-zinc-400">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. TRUST ===== */}
      <section className="relative py-24">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 py-32" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="mb-14 text-center text-xs font-light tracking-[0.35em] text-zinc-400">
              WHY MICROKIT
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="text-center">
                  <div className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                    {s.value}
                  </div>
                  <div className="mt-3 text-sm font-light text-zinc-400">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. VISUAL / MOCKUP ===== */}
      <section className="relative py-28 sm:py-36">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <p className="mb-4 text-xs font-light tracking-[0.35em] text-fuchsia-300">PRODUCT</p>
              <h2 className="font-display text-3xl font-medium tracking-tight sm:text-5xl">
                数秒で、ここまで仕上がる。
              </h2>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="group relative" style={{ perspective: "1600px" }}>
              <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-tr from-violet-600/30 via-fuchsia-500/20 to-cyan-500/25 opacity-60 blur-3xl transition-opacity duration-700 group-hover:opacity-90" aria-hidden />
              <div className="relative rounded-3xl border border-white/10 bg-zinc-900/90 shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:[transform:rotateX(4deg)] [transform:rotateX(6deg)_rotateZ(-4deg)]">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
                  <span className="h-3 w-3 rounded-full bg-zinc-600" />
                  <span className="h-3 w-3 rounded-full bg-zinc-600" />
                  <span className="h-3 w-3 rounded-full bg-zinc-600" />
                  <span className="ml-4 hidden flex-1 rounded-md bg-white/5 px-3 py-1 text-[11px] font-light text-zinc-500 sm:block">
                    microkit.app/brandkit
                  </span>
                </div>
                <div className="flex">
                  <div className="hidden w-44 space-y-3 border-r border-white/10 p-5 sm:block">
                    <div className="h-7 rounded-lg bg-white/10" />
                    <div className="h-7 rounded-lg bg-white/5" />
                    <div className="h-7 rounded-lg bg-white/5" />
                    <div className="h-7 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-70" />
                  </div>
                  <div className="flex-1 p-5 sm:p-7">
                    <div className="flex aspect-[1200/630] flex-col items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 px-8 text-center text-white shadow-inner">
                      <div className="text-sm font-light tracking-widest">MICROKIT</div>
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
      <section className="relative rounded-t-[3rem] bg-white py-28 text-zinc-950 sm:py-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className="mb-6 text-xs font-light tracking-[0.35em] text-zinc-500">START NOW</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              今すぐ、無料で始める。
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm font-light text-zinc-500">
              登録も費用も不要。あなたのブランドを、今日から。
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/contentpilot"
                className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 px-10 py-5 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
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