"use client";

import { useEffect, useRef } from "react";

const DRAG_THRESHOLD = 8;
const SENSITIVITY = 0.0038;
const ROT_TARGET_MAX_X = 0.7;
const ROT_TARGET_MAX_Y = 1.4;
const CAM_Z = 5.5;
const M_SCALE = 2.0;
const SCATTER = 1.7;
const CORE_DENSITY = 6000;

const PALETTES = [
  [0.0, 0.82, 0.95],
  [0.08, 0.92, 0.5],
  [0.95, 0.28, 0.82],
  [0.99, 0.74, 0.25],
];

const M_SEGMENTS: [number[], number[]][] = [
  [[-0.85, 0.85], [-0.85, -0.6]],
  [[-0.85, -0.6], [0, 0.1]],
  [[0, 0.1], [0.85, -0.6]],
  [[0.85, -0.6], [0.85, 0.85]],
];

const M_VERTICES: [number, number][] = [
  [-0.85, 0.85],
  [-0.85, -0.6],
  [0, 0.1],
  [0.85, -0.6],
  [0.85, 0.85],
];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function perspective(fov: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fov / 2);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0,
  ]);
}

const VERT = `
attribute vec3 aBase;
attribute vec3 aM;
attribute float aSeed;
attribute float aBright;
attribute float aSize;
uniform mat4 uProj;
uniform float uRotX;
uniform float uRotY;
uniform float uLag;
uniform float uMix;
uniform float uFocus;
uniform float uTime;
uniform float uPulse;
uniform float uCamZ;
varying float vSeed;
varying float vBright;
void main() {
  float mm = clamp(uMix + (aSeed - 0.5) * 0.25, 0.0, 1.0);
  vec3 pos = mix(aBase, aM, mm);
  float emphasize = 0.25 + 0.85 * mm;
  float shrink = 1.0 - uFocus * 0.32;
  float shrinkZ = 1.0 - uFocus * 0.22;
  float w1 = 0.014 * sin(uTime * 0.8 + aSeed * 47.0);
  float w2 = 0.014 * cos(uTime * 0.7 + aSeed * 31.0);
  float w3 = 0.014 * sin(uTime * 0.6 + aSeed * 23.0);
  pos += vec3(w1, w2, w3);
  pos.xy *= shrink;
  pos.z *= shrinkZ;

  float ry = uRotY + uLag * (aSeed - 0.5) * 2.2;
  float rx = uRotX + uLag * (aSeed - 0.5) * 1.6;
  float sy = sin(ry); float cy = cos(ry);
  float sx = sin(rx); float cx = cos(rx);
  vec3 p = vec3(pos.x * cy - pos.z * sy, pos.y, pos.x * sy + pos.z * cy);
  p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);

  p.z -= uCamZ;
  gl_Position = uProj * vec4(p, 1.0);
  gl_PointSize = max(1.0, aSize * uPulse * (0.7 + 0.6 * aBright * emphasize) * (1.0 - uFocus * 0.3));
  vSeed = aSeed;
  vBright = aBright * emphasize;
}
`;

const FRAG = `
precision mediump float;
uniform vec3 uColA;
uniform vec3 uColB;
uniform float uMixCol;
varying float vSeed;
varying float vBright;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.06, d);
  vec3 col = mix(uColA, uColB, uMixCol);
  col *= 0.6 + 0.75 * vSeed;
  col = mix(vec3(1.0), col, 0.5 + 0.5 * vBright);
  gl_FragColor = vec4(col, alpha * (0.3 + 0.7 * vBright));
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function HeroGlowOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const parts: { mx: number; my: number; mz: number; sx: number; sy: number; sz: number; seed: number; bright: number; size: number }[] = [];

    const thickness = 0.09;
    for (const [a, b] of M_SEGMENTS) {
      const [ax, ay] = a;
      const [bx, by] = b;
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy);
      const nx = -dy / len;
      const ny = dx / len;
      const n = Math.round(len * CORE_DENSITY);
      for (let i = 0; i < n; i++) {
        const tt = Math.random();
        const along = (Math.random() - 0.5) * 0.12;
        const perp = (Math.random() * 2 - 1) * thickness;
        const edge = 1 + Math.min(1, Math.abs(perp) / thickness) * 0.8;
        parts.push({
          mx: (ax + dx * (tt + along) + nx * perp) * M_SCALE,
          my: (ay + dy * (tt + along) + ny * perp) * M_SCALE,
          mz: (Math.random() - 0.5) * 0.8 * M_SCALE,
          sx: (Math.random() * 2 - 1) * SCATTER,
          sy: (Math.random() * 2 - 1) * SCATTER,
          sz: (Math.random() * 2 - 1) * SCATTER,
          seed: Math.random(),
          bright: (0.5 + Math.random() * 0.5) * edge,
          size: (0.8 + Math.random() * 1.6) * dpr,
        });
      }
    }

    for (const [vx, vy] of M_VERTICES) {
      for (let i = 0; i < 260; i++) {
        parts.push({
          mx: (vx + (Math.random() - 0.5) * 0.1) * M_SCALE,
          my: (vy + (Math.random() - 0.5) * 0.1) * M_SCALE,
          mz: (Math.random() - 0.5) * 0.14 * M_SCALE,
          sx: (Math.random() * 2 - 1) * SCATTER,
          sy: (Math.random() * 2 - 1) * SCATTER,
          sz: (Math.random() * 2 - 1) * SCATTER,
          seed: Math.random(),
          bright: 0.92 + Math.random() * 0.08,
          size: (0.9 + Math.random() * 1.4) * dpr,
        });
      }
    }

    for (let i = 0; i < 1500; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * SCATTER * 0.85;
      const bx = Math.cos(ang) * r;
      const by = Math.sin(ang) * r * 0.8;
      const bz = (Math.random() - 0.5) * SCATTER;
      parts.push({
        mx: bx * 0.55,
        my: by * 0.55,
        mz: bz * 0.55,
        sx: bx,
        sy: by,
        sz: bz,
        seed: Math.random(),
        bright: Math.random() * 0.28,
        size: (0.5 + Math.random() * 1.0) * dpr,
      });
    }

    const count = parts.length;
    const data = new Float32Array(count * 9);
    parts.forEach((p, i) => {
      const o = i * 9;
      data[o + 0] = p.sx;
      data[o + 1] = p.sy;
      data[o + 2] = p.sz;
      data[o + 3] = p.mx;
      data[o + 4] = p.my;
      data[o + 5] = p.mz;
      data[o + 6] = p.seed;
      data[o + 7] = p.bright;
      data[o + 8] = p.size;
    });

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const stride = 9 * 4;
    const locBase = gl.getAttribLocation(program, "aBase");
    const locM = gl.getAttribLocation(program, "aM");
    const locSeed = gl.getAttribLocation(program, "aSeed");
    const locBright = gl.getAttribLocation(program, "aBright");
    const locSize = gl.getAttribLocation(program, "aSize");
    const uProj = gl.getUniformLocation(program, "uProj");
    const uRotX = gl.getUniformLocation(program, "uRotX");
    const uRotY = gl.getUniformLocation(program, "uRotY");
    const uLag = gl.getUniformLocation(program, "uLag");
    const uMix = gl.getUniformLocation(program, "uMix");
    const uFocus = gl.getUniformLocation(program, "uFocus");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPulse = gl.getUniformLocation(program, "uPulse");
    const uCamZ = gl.getUniformLocation(program, "uCamZ");
    const uColA = gl.getUniformLocation(program, "uColA");
    const uColB = gl.getUniformLocation(program, "uColB");
    const uMixCol = gl.getUniformLocation(program, "uMixCol");

    gl.enableVertexAttribArray(locBase);
    gl.vertexAttribPointer(locBase, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(locM);
    gl.vertexAttribPointer(locM, 3, gl.FLOAT, false, stride, 12);
    gl.enableVertexAttribArray(locSeed);
    gl.vertexAttribPointer(locSeed, 1, gl.FLOAT, false, stride, 24);
    gl.enableVertexAttribArray(locBright);
    gl.vertexAttribPointer(locBright, 1, gl.FLOAT, false, stride, 28);
    gl.enableVertexAttribArray(locSize);
    gl.vertexAttribPointer(locSize, 1, gl.FLOAT, false, stride, 32);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uProj) gl.uniformMatrix4fv(uProj, false, perspective((48 * Math.PI) / 180, width / Math.max(1, height), 1, 20));
    };
    resize();
    window.addEventListener("resize", resize);

    let rotX = 0.1;
    let rotY = 0.25;
    let rotTargetX = 0.1;
    let rotTargetY = 0.25;
    let lag = 0;
    const mixCur = 1.0;
    let focusCur = 0;
    let pulse = 1;
    let colorT = 0;
    let curPal = 0;
    let nextPal = 1;
    let dragging = false;
    let downActive = false;
    const downPos = { x: 0, y: 0 };
    const prevClient = { x: 0, y: 0 };
    let t = 0;
    let raf = 0;
    let last = performance.now();

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
      if (!downActive) return;
      if (isInteractive(e)) return;
      const dx = e.clientX - downPos.x;
      const dy = e.clientY - downPos.y;
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) dragging = true;
      if (dragging) {
        const mvx = e.clientX - prevClient.x;
        const mvy = e.clientY - prevClient.y;
        rotTargetY = clamp(rotTargetY + mvx * SENSITIVITY, -ROT_TARGET_MAX_Y, ROT_TARGET_MAX_Y);
        rotTargetX = clamp(rotTargetX + mvy * SENSITIVITY, -ROT_TARGET_MAX_X, ROT_TARGET_MAX_X);
        prevClient.x = e.clientX;
        prevClient.y = e.clientY;
      }
    };

    const onPointerUp = () => {
      if (dragging) {
        dragging = false;
      } else if (downActive) {
        pulse = 1.28;
        nextPal = (curPal + 1) % PALETTES.length;
        colorT = 0;
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

      if (dragging) {
        rotY += (rotTargetY - rotY) * 0.06;
        rotX += (rotTargetX - rotX) * 0.06;
      } else {
        const baseY = 0.25 + Math.sin(t * 0.3) * 0.12;
        const baseX = 0.1 + Math.cos(t * 0.24) * 0.08;
        rotTargetY += (baseY - rotTargetY) * 0.035;
        rotTargetX += (baseX - rotTargetX) * 0.035;
        rotY += (rotTargetY - rotY) * 0.08;
        rotX += (rotTargetX - rotX) * 0.08;
      }

      const lagTarget = Math.min(0.9, Math.abs(rotTargetY - rotY) * 3 + Math.abs(rotTargetX - rotX) * 2);
      lag += (lagTarget - lag) * 0.1;

      const sy = window.scrollY;
      const raw = clamp(sy / Math.max(1, height * 0.5), 0, 1);
      const eased = raw * raw * (3 - 2 * raw);
      focusCur += (eased - focusCur) * 0.1;

      pulse += (1 - pulse) * 0.08;
      if (pulse <= 1.02) pulse = 1;

      colorT += (1 - colorT) * 0.06;
      if (colorT > 0.98) {
        curPal = nextPal;
        colorT = 0;
      }

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (uTime) gl.uniform1f(uTime, t);
      if (uRotX) gl.uniform1f(uRotX, rotX);
      if (uRotY) gl.uniform1f(uRotY, rotY);
      if (uLag) gl.uniform1f(uLag, lag);
      if (uMix) gl.uniform1f(uMix, mixCur);
      if (uFocus) gl.uniform1f(uFocus, focusCur);
      if (uPulse) gl.uniform1f(uPulse, pulse);
      if (uCamZ) gl.uniform1f(uCamZ, CAM_Z);
      if (uColA) gl.uniform3f(uColA, PALETTES[curPal][0], PALETTES[curPal][1], PALETTES[curPal][2]);
      if (uColB) gl.uniform3f(uColB, PALETTES[nextPal][0], PALETTES[nextPal][1], PALETTES[nextPal][2]);
      if (uMixCol) gl.uniform1f(uMixCol, colorT);

      gl.drawArrays(gl.POINTS, 0, count);
    };
    draw(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
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