"use client";

import { useEffect, useRef } from "react";

export default function ScrollGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const y = window.scrollY;
        el.style.setProperty("--glow1", `${y * 0.1}px`);
        el.style.setProperty("--glow2", `${y * -0.06}px`);
        el.style.setProperty("--glow3", `${y * 0.04}px`);
        el.style.setProperty("--glow-opacity", String(Math.min(0.5, 0.18 + y / 9000)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-0 h-[580px] w-[880px] -translate-x-1/2 rounded-full bg-brand/12 blur-[130px]"
        style={{ transform: "translateX(-50%) translateY(var(--glow1, 0px))" }}
      />
      <div className="absolute left-[-180px] top-[30%] h-[460px] w-[460px] rounded-full bg-brand-2/12 blur-[130px] animate-drift"
        style={{ transform: "translateY(var(--glow2, 0px))" }}
      />
      <div className="absolute bottom-[-120px] right-[-160px] h-[480px] w-[480px] rounded-full bg-brand/8 blur-[130px]"
        style={{ transform: "translateY(var(--glow3, 0px))" }}
      />
    </div>
  );
}