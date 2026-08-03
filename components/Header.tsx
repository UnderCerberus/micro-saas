import Link from "next/link";

const nav = [
  { href: "/brandkit", label: "BrandKit", desc: "素材生成" },
  { href: "/contentpilot", label: "ContentPilot", desc: "AI文章生成" },
  { href: "/pricing", label: "料金" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 text-sm font-black text-white">
            M
          </span>
          <span className="text-lg">MicroKit</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-ink-soft">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-1.5 transition hover:bg-brand-soft hover:text-brand"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}