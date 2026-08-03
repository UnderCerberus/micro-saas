"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/components/Workspace";

export default function Header() {
  const { open } = useWorkspace();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        dark
          ? "border-b border-white/10 bg-black/80 backdrop-blur"
          : "border-b border-line bg-white/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#6366F1] text-sm font-black text-white`}
            >
              M
            </span>
            <span className={`text-lg transition-colors duration-300 ${dark ? "text-white" : "text-ink"}`}>
              Mikko
            </span>
          </Link>
          <nav className="flex items-center gap-8 text-sm font-semibold">
            <Link
              href="/pricing"
              className={`transition-colors duration-300 ${dark ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-brand"}`}
            >
              料金
            </Link>
            <Link
              href="mailto:contact@mikko.app"
              className={`transition-colors duration-300 ${dark ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-brand"}`}
            >
              お問い合わせ
            </Link>
          </nav>
        </div>
        <button
          type="button"
          onClick={() => open("brandkit")}
          className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_-6px_rgba(37,99,235,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
        >
          Mikkoを試す
        </button>
      </div>
    </header>
  );
}