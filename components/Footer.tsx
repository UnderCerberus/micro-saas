import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-zinc-950/90 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row">
        <p className="font-semibold text-zinc-300">MicroKit</p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/brandkit" className="hover:text-white">BrandKit</Link>
          <Link href="/contentpilot" className="hover:text-white">ContentPilot</Link>
          <Link href="/pricing" className="hover:text-white">料金</Link>
        </nav>
        <p>
          <span className="inline-flex items-center gap-1">
            0円で運用できる
            <span className="text-zinc-400">マイクロSaaS</span>
          </span>
        </p>
      </div>
    </footer>
  );
}