import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-surface py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-ink-soft sm:flex-row">
        <p className="font-semibold text-ink">Mikko</p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/brandkit" className="hover:text-brand">BrandKit</Link>
          <Link href="/contentpilot" className="hover:text-brand">ContentPilot</Link>
          <Link href="/pricing" className="hover:text-brand">料金</Link>
          <Link href="/contact" className="hover:text-brand">お問い合わせ</Link>
          <Link href="/terms" className="hover:text-brand">利用規約</Link>
          <Link href="/privacy" className="hover:text-brand">プライバシー</Link>
        </nav>
        <p>
          <span className="inline-flex items-center gap-1">
            0円で運用できる
            <span className="text-ink">マイクロSaaS</span>
          </span>
        </p>
      </div>
    </footer>
  );
}