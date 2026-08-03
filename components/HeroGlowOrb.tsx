"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; r: number; maxR: number; alpha: number };

export default function HeroGlowOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;

    const pointer = { x: 0, y: 0, active: false };
    const mouse = { x: 0, y: 0 };
    let pulse = 1;
    let pulseTarget = 1;
    const ripples: Ripple[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      pulseTarget = 1.9;
      ripples.push({ x, y, r: 8, maxR: Math.max(width, height) * 0.55, alpha: 0.5 });
      if (ripples.length > 12) ripples.shift();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.008;

      mouse.x += (pointer.x - mouse.x) * 0.06;
      mouse.y += (pointer.y - mouse.y) * 0.06;
      pulse += (pulseTarget - pulse) * 0.08;
      if (pulseTarget > 1.02 && pulse < 1.06) pulseTarget = 1;
      if (pulse <= 1.02 && pulseTarget > 1) pulseTarget = 1;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ripples.forEach((rp) => {
        rp.r += (rp.maxR - rp.r) * 0.05 + 1.2;
        rp.alpha *= 0.965;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(147, 197, 253, ${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (ripples[i].alpha < 0.02) ripples.splice(i, 1);
      }

      const floatY = Math.sin(t * 1.4) * 16;
      const floatX = Math.cos(t * 1.1) * 12;
      const followX = pointer.active ? (mouse.x - cx) * 0.12 : 0;
      const followY = pointer.active ? (mouse.y - cy) * 0.12 : 0;
      const ox = cx + floatX + followX;
      const oy = cy + floatY + followY;
      const baseR = Math.min(width, height) * 0.34 * pulse;

      const grad = ctx.createRadialGradient(ox, oy, baseR * 0.1, ox, oy, baseR);
      grad.addColorStop(0, "rgba(219, 234, 254, 0.95)");
      grad.addColorStop(0.25, "rgba(96, 165, 250, 0.75)");
      grad.addColorStop(0.55, "rgba(99, 102, 241, 0.45)");
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ox, oy, baseR, 0, Math.PI * 2);
      ctx.fill();

      const grad2 = ctx.createRadialGradient(ox - baseR * 0.2, oy - baseR * 0.25, 0, ox, oy, baseR * 0.8);
      grad2.addColorStop(0, "rgba(255, 255, 255, 0.5)");
      grad2.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(ox, oy, baseR * 0.8, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 3; i++) {
        const ringR = baseR * (0.45 + i * 0.16);
        ctx.beginPath();
        ctx.arc(ox, oy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(191, 219, 254, ${0.22 - i * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(ox, oy, baseR * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(30, 64, 175, 0.55)";
      ctx.filter = "blur(24px)";
      ctx.fill();
      ctx.filter = "none";
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full touch-none"
    />
  );
}