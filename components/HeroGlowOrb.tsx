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
  const thickness = 0.15;
  const density = 150;

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
      pts.push({
        x: ax + dx * (t + along) + nx * perp,
        y: ay + dy * (t + along) + ny * perp,
        z: (Math.random() - 0.5) * 1.1,
        phase: Math.random() * Math.PI * 2,
        sway: 0.5 + Math.random() * 0.5,
        size: 1.6 + Math.random() * 2.6,
        alpha: 0.4 + Math.random() * 0.6,
      });
    }
  }

  for (let i = 0; i < 130; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.6) * 1.6;
    pts.push({
      x: Math.cos(ang) * r,
      y: Math.sin(ang) * r * 0.8,
      z: (Math.random() - 0.5) * 1.4,
      phase: Math.random() * Math.PI * 2,
      sway: 0.3 + Math.random() * 0.4,
      size: 1 + Math.random() * 1.6,
      alpha: 0.15 + Math.random() * 0.2,
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
      g.addColorStop(0.3, "rgba(191,219,254,0.85)");
      g.addColorStop(0.7, "rgba(99,102,241,0.3)");
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

    const group = { x: 0, y: 0 };
    const groupVel = { x: 0, y: 0 };
    const dragTarget = { x: 0, y: 0 };
    let dragging = false;
    let downActive = false;
    const downPos = { x: 0, y: 0 };
    let rotX = 0.16;
    let rotY = 0.28;
    let rotVelX = 0;
    let rotVelY = 0;
    let scaleX = 1;
    let scaleY = 1;
    let pulse = 1;
    let speed = 0;
    const ripples: Ripple[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      group.x = width / 2;
      group.y = height / 2;
      dragTarget.x = width / 2;
      dragTarget.y = height / 2;
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
      downActive = true;
      dragging = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!downActive) return;
      if (isInteractive(e)) return;
      const dx = e.clientX - downPos.x;
      const dy = e.clientY - downPos.y;
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragging = true;
      }
      if (dragging) {
        dragTarget.x = e.clientX;
        dragTarget.y = e.clientY;
        rotVelY += dx * 0.0045;
        rotVelX += dy * 0.003;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (dragging) {
        dragging = false;
      } else if (downActive && !isInteractive(e)) {
        pulse = 1.35;
        const x = e.clientX;
        const y = e.clientY;
        ripples.push({ x, y, r: 6, maxR: Math.max(width, height) * 0.5, alpha: 0.5 });
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
        const px = group.x;
        group.x += (dragTarget.x - group.x) * 0.14;
        group.y += (dragTarget.y - group.y) * 0.14;
        groupVel.x = (group.x - px) * 0.4;
        groupVel.y = 0;
        const v = Math.hypot(rotVelX, rotVelY);
        speed += (Math.min(v * 2.5, 2) - speed) * 0.1;
        scaleX += (1.16 - scaleX) * 0.15;
        scaleY += (0.88 - scaleY) * 0.15;
      } else {
        speed *= 0.93;
        scaleX += (1 - scaleX) * 0.08;
        scaleY += (1 - scaleY) * 0.08;
        rotVelX *= Math.pow(0.9, dt);
        rotVelY *= Math.pow(0.9, dt);
        const baseY = 0.28 + Math.sin(t * 0.32) * 0.14;
        const baseX = 0.16 + Math.cos(t * 0.26) * 0.1;
        rotX += (baseX - rotX + rotVelX * 0.4) * 0.06;
        rotY += (baseY - rotY + rotVelY * 0.4) * 0.06;
        groupVel.x += (-0.02 * (group.x - cx) - 0.18 * groupVel.x) * dt;
        groupVel.y += (-0.02 * (group.y - cy) - 0.18 * groupVel.y) * dt;
        group.x += groupVel.x * dt;
        group.y += groupVel.y * dt;
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

      const scale = Math.min(width, height) * 0.3 * pulse;
      const focal = Math.max(width, height) * 1.4;
      const swayAmp = scale * 0.035;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const trailAlpha = Math.min(0.4, speed * 0.18);

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
        const sx = group.x + x1 * persp;
        const sy = group.y + y1 * persp;
        const size = p.size * persp;
        const alpha = Math.min(1, p.alpha * (0.55 + 0.5 * persp));

        if (dragging && trailAlpha > 0.02 && i < prevSX.length) {
          ctx.strokeStyle = `rgba(147, 197, 253, ${trailAlpha * alpha})`;
          ctx.lineWidth = Math.max(0.5, size * 0.35);
          ctx.beginPath();
          ctx.moveTo(prevSX[i], prevSY[i]);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }

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