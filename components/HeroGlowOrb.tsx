"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  phase: number;
  sway: number;
  size: number;
  alpha: number;
};

type Ripple = { x: number; y: number; r: number; maxR: number; alpha: number };

const DRAG_THRESHOLD = 8;

const M_SEGMENTS: [number[], number[]][] = [
  [[-0.85, 0.85], [-0.85, -0.6]],
  [[-0.85, -0.6], [0, 0.1]],
  [[0, 0.1], [0.85, -0.6]],
  [[0.85, -0.6], [0.85, 0.85]],
];

function genParticles(): Particle[] {
  const pts: Particle[] = [];
  const thickness = 0.17;
  const density = 240;

  for (const [a, b] of M_SEGMENTS) {
    const [ax, ay] = a;
    const [bx, by] = b;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    const n = Math.round(len * density);
    for (let i = 0; i < n; i++) {
      const t = Math.random();
      const along = (Math.random() - 0.5) * 0.3;
      const perp = (Math.random() * 2 - 1) * thickness;
      const edge = 1 + Math.min(1, Math.abs(perp) / thickness) * 0.6;
      pts.push({
        x: ax + dx * (t + along) + nx * perp,
        y: ay + dy * (t + along) + ny * perp,
        z: (Math.random() - 0.5) * 1.1,
        phase: Math.random() * Math.PI * 2,
        sway: 0.5 + Math.random() * 0.5,
        size: (2.2 + Math.random() * 3.2) * edge,
        alpha: (0.55 + Math.random() * 0.45) * edge,
      });
    }
  }

  for (let i = 0; i < 140; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.6) * 1.7;
    pts.push({
      x: Math.cos(ang) * r,
      y: Math.sin(ang) * r * 0.8,
      z: (Math.random() - 0.5) * 1.4,
      phase: Math.random() * Math.PI * 2,
      sway: 0.3 + Math.random() * 0.4,
      size: 1.2 + Math.random() * 1.8,
      alpha: 0.18 + Math.random() * 0.22,
    });
  }

  return pts;
}

export default function HeroGlowOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprite = document.createElement("canvas");
    sprite.width = 32;
    sprite.height = 32;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.25, "rgba(224,236,255,0.95)");
      g.addColorStop(0.6, "rgba(129,140,248,0.45)");
      g.addColorStop(1, "rgba(99,102,241,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 32, 32);
    }

    const particles = genParticles();
    const prevSX = new Float32Array(particles.length);
    const prevSY = new Float32Array(particles.length);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;
    let last = performance.now();

    let rotX = 0.16;
    let rotY = 0.28;
    let rotVelX = 0;
    let rotVelY = 0;
    let scaleX = 1;
    let scaleY = 1;
    let pulse = 1;
    let speed = 0;
    let dragging = false;
    let downActive = false;
    const downPos = { x: 0, y: 0 };
    const prevClient = { x: 0, y: 0 };
    const cursorLocal = { x: 0, y: 0 };
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

    const isInteractive = (e: PointerEvent) => {
      const target = e.target as Element | null;
      return Boolean(target?.closest?.("a, button, input, textarea, select, [role='button']"));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isInteractive(e)) return;
      downPos.x = e.clientX;
      downPos.y = e.clientY;
      prevClient.x = e.clientX;
      prevClient.y = e.clientY;
      downActive = true;
      dragging = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorLocal.x = e.clientX - rect.left;
      cursorLocal.y = e.clientY - rect.top;
      if (!downActive) return;
      if (isInteractive(e)) return;
      const dx = e.clientX - downPos.x;
      const dy = e.clientY - downPos.y;
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragging = true;
      }
      if (dragging) {
        const mvx = e.clientX - prevClient.x;
        const mvy = e.clientY - prevClient.y;
        rotVelY += mvx * 0.005;
        rotVelX += mvy * 0.004;
        prevClient.x = e.clientX;
        prevClient.y = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (dragging) {
        dragging = false;
      } else if (downActive && !isInteractive(e)) {
        pulse = 1.35;
        const rect = canvas.getBoundingClientRect();
        ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 6, maxR: Math.max(width, height) * 0.5, alpha: 0.5 });
        if (ripples.length > 6) ripples.shift();
      }
      downActive = false;
      dragging = false;
    };

    const onPointerCancel = () => {
      downActive = false;
      dragging = false;
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      t += 0.012 * dt;

      const cx = width / 2;
      const cy = height / 2;

      if (dragging) {
        rotX += rotVelX;
        rotY += rotVelY;
        rotVelX *= 0.93;
        rotVelY *= 0.93;
        speed += (Math.min(Math.hypot(rotVelX, rotVelY) * 3, 1.6) - speed) * 0.12;
        scaleX += (1.1 - scaleX) * 0.12;
        scaleY += (0.92 - scaleY) * 0.12;
      } else {
        speed *= 0.94;
        rotVelX *= 0.94;
        rotVelY *= 0.94;
        scaleX += (1 - scaleX) * 0.1;
        scaleY += (1 - scaleY) * 0.1;
        const baseX = 0.16 + Math.cos(t * 0.26) * 0.1;
        const baseY = 0.28 + Math.sin(t * 0.32) * 0.14;
        rotX += (baseX - rotX) * 0.045;
        rotY += (baseY - rotY) * 0.045;
      }

      pulse += (1 - pulse) * 0.1;
      if (pulse <= 1.02) pulse = 1;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += (rp.maxR - rp.r) * 0.05 + 1.4;
        rp.alpha *= 0.96;
        if (rp.alpha < 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(147, 197, 253, ${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      const scale = Math.min(width, height) * 0.34 * pulse;
      const focal = Math.max(width, height) * 1.4;
      const swayAmp = scale * 0.03;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const trailAlpha = dragging ? Math.min(0.35, speed * 0.2) : 0;
      const attractR = Math.min(160, Math.max(width, height) * 0.22);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const swayX = Math.sin(t * 0.5 + p.phase) * p.sway * swayAmp;
        const swayY = Math.cos(t * 0.62 + p.phase * 1.3) * p.sway * swayAmp;
        const swayZ = Math.sin(t * 0.42 + p.phase * 0.7) * p.sway * swayAmp;

        const lx = (p.x * scale + swayX) * scaleX;
        const ly = (p.y * scale + swayY) * scaleY;
        const lz = p.z * scale + swayZ;

        const x1 = lx * cosY - lz * sinY;
        const z1 = lx * sinY + lz * cosY;
        const y1 = ly * cosX - z1 * sinX;
        const z2 = ly * sinX + z1 * cosX;

        const persp = focal / (focal + z2);
        let sx = cx + x1 * persp;
        let sy = cy + y1 * persp;

        let glow = 1;
        if (dragging) {
          const d = Math.hypot(sx - cursorLocal.x, sy - cursorLocal.y);
          if (d < attractR) {
            const f = 1 - d / attractR;
            const pull = f * f * 16;
            const ang = Math.atan2(sy - cursorLocal.y, sx - cursorLocal.x);
            sx += Math.cos(ang) * pull;
            sy += Math.sin(ang) * pull;
            glow = 1 + f * 1.4;
          }
        }

        const size = p.size * persp * Math.sqrt(glow);
        const alpha = Math.min(1, p.alpha * glow * (0.55 + 0.5 * persp));

        if (trailAlpha > 0.02 && i < prevSX.length) {
          ctx.strokeStyle = `rgba(147, 197, 253, ${trailAlpha * alpha})`;
          ctx.lineWidth = Math.max(0.5, size * 0.35);
          ctx.beginPath();
          ctx.moveTo(prevSX[i], prevSY[i]);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }

        ctx.globalAlpha = alpha * 0.35;
        ctx.drawImage(sprite, sx - size * 1.6, sy - size * 1.6, size * 3.2, size * 3.2);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, sx - size, sy - size, size * 2, size * 2);
        prevSX[i] = sx;
        prevSY[i] = sy;
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };
    draw(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}