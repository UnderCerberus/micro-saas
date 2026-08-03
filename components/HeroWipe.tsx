"use client";

import { useEffect, useState } from "react";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function HeroWipe() {
  const [o, setO] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight;
      const p = clamp((window.scrollY - h * 0.15) / (h * 0.35), 0, 1);
      const eased = p * p * (3 - 2 * p);
      setO(eased);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-base"
      style={{ opacity: o }}
    />
  );
}
