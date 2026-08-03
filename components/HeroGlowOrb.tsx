"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; r: number; maxR: number; alpha: number };

const DRAG_THRESHOLD = 8;

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
    let last = performance.now();

    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const dragPointer = { x: 0, y: 0 };
    let prevDragX = 0;
    let dragging = false;
    let downActive = false;
    const downPos = { x: 0, y: 0 };
    let pulse = 1;
    let dragScale = 1;
    let dragAngle = 0;
    const ripples: Ripple[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pos.x = width / 2;
      pos.y = height / 2;
      vel.x = 0;
      vel.y = 0;
    };
    resize();
    window.addEventListener("resize", resize);

    const isInteractive = (e: PointerEvent) => {
      const target = e.target as Element | null;
      return Boolean(target?.closest?.("a, button, input, textarea, select, [role='button']"));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isInteractive(e)) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      downPos.x = x;
      downPos.y = y;
      downActive = true;
      dragging = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!downActive) return;
      if (isInteractive(e)) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const dx = x - downPos.x;
      const dy = y - downPos.y;
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragging = true;
        dragPointer.x = x;
        dragPointer.y = y;
        prevDragX = x;
      }
      if (dragging) {
        dragPointer.x = x;
        dragPointer.y = y;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      void e;
      if (dragging) {
        vel.x = (pos.x - prevDragX) * 0.06;
        vel.y *= 0.2;
        dragging = false;
      } else if (downActive) {
        pulse = 1.5;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
          ripples.push({ x, y, r: 6, maxR: Math.max(width, height) * 0.5, alpha: 0.5 });
          if (ripples.length > 8) ripples.shift();
        }
      }
      downActive = false;
      dragging = false;
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const drawCrystal = (ox: number, oy: number, s: number, rot: number, pulseScale: number) => {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(rot);

      const glow = ctx.createRadialGradient(0, 0, s * 0.1, 0, 0, s * 1.9);
      glow.addColorStop(0, "rgba(96, 165, 250, 0.35)");
      glow.addColorStop(0.6, "rgba(99, 102, 241, 0.12)");
      glow.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, s * 1.9, 0, Math.PI * 2);
      ctx.fill();

      const top = [0, -s * 1.15];
      const right = [s * 0.78, 0];
      const bottom = [0, s * 1.15];
      const left = [-s * 0.78, 0];
      const face = [0, -s * 0.22];

      const body = ctx.createLinearGradient(0, -s * 1.2, 0, s * 1.2);
      body.addColorStop(0, "#dbeafe");
      body.addColorStop(0.35, "#a5b4fc");
      body.addColorStop(0.7, "#6366f1");
      body.addColorStop(1, "#312e81");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(right[0], right[1]);
      ctx.lineTo(bottom[0], bottom[1]);
      ctx.lineTo(left[0], left[1]);
      ctx.closePath();
      ctx.fill();

      const facet = (a: number[], b: number[], c: number[], alpha: number) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.closePath();
        ctx.fill();
      };
      facet(top, right, face, 0.2);
      facet(top, left, face, 0.12);
      facet(bottom, right, face, 0.05);
      facet(bottom, left, face, 0.08);

      ctx.strokeStyle = "rgba(219, 234, 254, 0.55)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(right[0], right[1]);
      ctx.lineTo(bottom[0], bottom[1]);
      ctx.lineTo(left[0], left[1]);
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
      ctx.lineWidth = 1;
      [[face, top], [face, right], [face, bottom], [face, left]].forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo((a as number[])[0], (a as number[])[1]);
        ctx.lineTo((b as number[])[0], (b as number[])[1]);
        ctx.stroke();
      });

      const m = s * 0.42 * pulseScale;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(-m * 0.9, m * 0.5);
      ctx.lineTo(-m * 0.35, -m * 0.5);
      ctx.lineTo(0, -m * 0.05);
      ctx.lineTo(m * 0.35, -m * 0.5);
      ctx.lineTo(m * 0.9, m * 0.5);
      ctx.stroke();

      ctx.restore();
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      t += 0.012 * dt;

      const cx = width / 2;
      const cy = height / 2;

      if (dragging) {
        const px = pos.x;
        pos.x += (dragPointer.x - pos.x) * 0.32;
        pos.y += (dragPointer.y - pos.y) * 0.32;
        vel.x = (pos.x - px) * 0.5;
        dragAngle += (dragPointer.x - prevDragX) * 0.012;
        prevDragX = dragPointer.x;
        dragScale += (1.12 - dragScale) * 0.18;
      } else {
        dragScale += (1 - dragScale) * 0.08;
        dragAngle *= Math.pow(0.92, dt);
        const floatX = Math.cos(t * 1.25) * 12;
        const floatY = Math.sin(t * 1.7) * 9;
        const tx = cx + floatX;
        const ty = cy + floatY;
        vel.x += (-0.016 * (pos.x - tx) - 0.16 * vel.x) * dt;
        vel.y += (-0.016 * (pos.y - ty) - 0.16 * vel.y) * dt;
        pos.x += vel.x * dt;
        pos.y += vel.y * dt;
      }

      pulse += (1 - pulse) * 0.1;
      if (pulse <= 1.02) pulse = 1;

      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += (rp.maxR - rp.r) * 0.05 + 1.4;
        rp.alpha *= 0.96;
        if (rp.alpha < 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(147, 197, 253, ${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const baseR = Math.min(width, height) * 0.22;
      drawCrystal(pos.x, pos.y, baseR * pulse * dragScale, dragAngle, pulse);
    };
    draw(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
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