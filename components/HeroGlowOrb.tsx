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
  tint: number;
};

type Ripple = { x: number; y: number; r: number; maxR: number; alpha: number };

const DRAG_THRESHOLD = 8;
const SENSITIVITY = 0.00028;
const ROT_TARGET_MAX_X = 0.7;
const ROT_TARGET_MAX_Y = 1.5;
const COLOR_STEPS = 24;

const KEY = [
  { r: 59, g: 150, b: 246 },
  { r: 139, g: 92, b: 246 },
  { r: 16, g: 185, b: 129 },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function colorAt(u: number) {
  const k = ((u % 1) + 1) % 1;
  let a: { r: number; g: number; b: number };
  let b: { r: number; g: number; b: number };
  let t: number;
  if (k < 0.4) {
    a = KEY[0];
    b = KEY[1];
    t = k / 0.4;
  } else {
    a = KEY[1];
    b = KEY[2];
    t = (k - 0.4) / 0.6;
  }
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

const M_SEGMENTS: [number[], number[]][] = [
  [[-0.85, 0.85], [-0.85, -0.6]],
  [[-0.85, -0.6], [0, 0.1]],
  [[0, 0.1], [0.85, -0.6]],
  [[0.85, -0.6], [0.85, 0.85]],
];

function genParticles(): Particle[] {
  const pts: Particle[] = [];
  const thickness = 0.17;
  const density = 200;

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
      const tt = Math.random();
      const along = (Math.random() - 0.5) * 0.3;
      const perp = (Math.random() * 2 - 1) * thickness;
      const edge = 1 + Math.min(1, Math.abs(perp) / thickness) * 0.7;
      pts.push({
        x: ax + dx * (tt + along) + nx * perp,
        y: ay + dy * (tt + along) + ny * perp,
        z: (Math.random() - 0.5) * 1.1,
        phase: Math.random() * Math.PI * 2,
        sway: 0.5 + Math.random() * 0.5,
        size: (2.0 + Math.random() * 5.4) * edge,
        alpha: (0.5 + Math.random() * 0.5) * edge,
        tint: (Math.random() - 0.5) * 5,
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
      size: 1.3 + Math.random() * 2.6,
      alpha: 0.16 + Math.random() * 0.2,
      tint: (Math.random() - 0.5) * 8,
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

    const sprites: HTMLCanvasElement[] = [];
    for (let i = 0; i < COLOR_STEPS; i++) {
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 32;
      const s = c.getContext("2d");
      if (!s) continue;
      const col = colorAt(i / COLOR_STEPS);
      const g2 = s.createRadialGradient(16, 16, 0, 16, 16, 16);
      g2.addColorStop(0, "rgba(255,255,255,1)");
      g2.addColorStop(0.25, `rgba(${col.r},${col.g},${col.b},0.95)`);
      g2.addColorStop(0.6, `rgba(${col.r},${col.g},${col.b},0.4)`);
      g2.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
      s.fillStyle = g2;
      s.fillRect(0, 0, 32, 32);
      sprites.push(c);
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
    let rotTargetX = 0.16;
    let rotTargetY = 0.28;
    let scaleX = 1;
    let scaleY = 1;
    let pulse = 1;
    let speed = 0;
    let color = 0.8;
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
        rotTargetY = clamp(rotTargetY + mvx * SENSITIVITY, -ROT_TARGET_MAX_Y, ROT_TARGET_MAX_Y);
        rotTargetX = clamp(rotTargetX + mvy * SENSITIVITY, -ROT_TARGET_MAX_X, ROT_TARGET_MAX_X);
        prevClient.x = e.clientX;
        prevClient.y = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (dragging) {
        dragging = false;
      } else if (downActive && !isInteractive(e)) {
        pulse = 1.3;
        const rect = canvas.getBoundingClientRect();
        ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 6, maxR: Math.max(width, height) * 0.5, alpha: 0.45 });
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
        rotY += (rotTargetY - rotY) * 0.11;
        rotX += (rotTargetX - rotX) * 0.11;
        speed = Math.min(1, Math.abs(rotTargetY - rotY) * 1.4);
        scaleX += (1.06 - scaleX) * 0.1;
        scaleY += (0.95 - scaleY) * 0.1;
      } else {
        const baseY = 0.28 + Math.sin(t * 0.3) * 0.12;
        const baseX = 0.16 + Math.cos(t * 0.24) * 0.1;
        rotTargetY += (baseY - rotTargetY) * 0.035;
        rotTargetX += (baseX - rotTargetX) * 0.035;
        rotY += (rotTargetY - rotY) * 0.1;
        rotX += (rotTargetX - rotX) * 0.1;
        speed *= 0.94;
        scaleX += (1 - scaleX) * 0.1;
        scaleY += (1 - scaleY) * 0.1;
      }

      pulse += (1 - pulse) * 0.1;
      if (pulse <= 1.02) pulse = 1;
      color = (((t * 0.045 + rotY * 0.05) % 1) + 1) % 1;
      const cur = colorAt(color);

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
        ctx.strokeStyle = `rgba(${cur.r},${cur.g},${cur.b},${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      const scale = Math.min(width, height) * 0.5 * pulse;
      const focal = Math.max(width, height) * 1.4;
      const swayAmp = scale * 0.03;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const trailAlpha = dragging ? Math.min(0.24, speed * 0.18) : 0;
      const attractR = Math.min(170, Math.max(width, height) * 0.24);

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
            const pull = f * f * 14;
            const ang = Math.atan2(sy - cursorLocal.y, sx - cursorLocal.x);
            sx += Math.cos(ang) * pull;
            sy += Math.sin(ang) * pull;
            glow = 1 + f * 1.1;
          }
        }

        const frame = (((Math.floor(color * COLOR_STEPS) + Math.round(p.tint)) % COLOR_STEPS) + COLOR_STEPS) % COLOR_STEPS;
        const spr = sprites[frame] ?? sprites[0];
        const size = p.size * persp * Math.sqrt(glow);
        const alpha = Math.min(1, p.alpha * glow * (0.55 + 0.5 * persp));

        if (trailAlpha > 0.02 && i < prevSX.length) {
          ctx.strokeStyle = `rgba(${cur.r},${cur.g},${cur.b},${trailAlpha * alpha})`;
          ctx.lineWidth = Math.max(0.5, size * 0.3);
          ctx.beginPath();
          ctx.moveTo(prevSX[i], prevSY[i]);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }

        ctx.globalAlpha = alpha * 0.35;
        ctx.drawImage(spr, sx - size * 1.5, sy - size * 1.5, size * 3, size * 3);
        ctx.globalAlpha = alpha;
        ctx.drawImage(spr, sx - size, sy - size, size * 2, size * 2);
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