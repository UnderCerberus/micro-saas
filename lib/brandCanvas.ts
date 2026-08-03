export interface BrandStyle {
  brand: string;
  icon: string;
  title: string;
  subtitle: string;
  fromColor: string;
  toColor: string;
  textColor: string;
  accent: string;
  url: string;
}

export const CANVAS_FONT =
  '"Hiragino Sans", "Yu Gothic UI", "Meiryo", "Noto Sans JP", sans-serif';

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const ch of text) {
    const candidate = current + ch;
    if (ctx.measureText(candidate).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = ch;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");
  return [canvas, ctx];
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function renderOG(style: BrandStyle): HTMLCanvasElement {
  const w = 1200;
  const h = 630;
  const [canvas, ctx] = makeCanvas(w, h);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, style.fromColor);
  grad.addColorStop(1, style.toColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = hexToRgba(style.accent, 0.18);
  ctx.beginPath();
  ctx.arc(w - 140, 120, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = hexToRgba("#ffffff", 0.12);
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.arc(180, h + 140, 300, 0, Math.PI * 2);
  ctx.stroke();

  const chipX = 80;
  const chipY = 80;
  ctx.fillStyle = style.accent;
  roundedRect(ctx, chipX, chipY, 92, 92, 22);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 52px ${CANVAS_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(style.icon.slice(0, 2) || "M", chipX + 46, chipY + 50, 80);

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = `700 40px ${CANVAS_FONT}`;
  ctx.fillText(style.brand || "MicroKit", chipX + 118, chipY + 60, 700);

  ctx.fillStyle = style.textColor;
  ctx.font = `800 76px ${CANVAS_FONT}`;
  const titleLines = wrapText(ctx, style.title || "ブランド素材を数秒で生成", w - 160);
  const titleMax = 3;
  const shown = titleLines.slice(0, titleMax);
  const titleStart = 360;
  const lineGap = 100;
  shown.forEach((line, i) => {
    ctx.fillText(line, 80, titleStart + i * lineGap, w - 160);
  });

  if (style.subtitle) {
    ctx.fillStyle = hexToRgba(style.textColor, 0.82);
    ctx.font = `500 34px ${CANVAS_FONT}`;
    const subLines = wrapText(ctx, style.subtitle, w - 200).slice(0, 2);
    const subStart = titleStart + shown.length * lineGap + 40;
    subLines.forEach((line, i) => {
      ctx.fillText(line, 80, subStart + i * 52, w - 200);
    });
  }

  ctx.fillStyle = hexToRgba(style.textColor, 0.7);
  ctx.font = `600 30px ${CANVAS_FONT}`;
  ctx.textAlign = "left";
  ctx.fillText("MicroKit", 80, h - 70);
  ctx.textAlign = "right";
  ctx.fillText(style.url || "microworks.vercel.app", w - 80, h - 70, 500);

  return canvas;
}

export function renderLogo(style: BrandStyle): HTMLCanvasElement {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size, size);

  const pad = 12;
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 40;
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, style.fromColor);
  grad.addColorStop(1, style.toColor);
  ctx.fillStyle = grad;
  roundedRect(ctx, pad, pad, size - pad * 2, size - pad * 2, 112);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 260px ${CANVAS_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(style.icon.slice(0, 1) || "M", size / 2, size / 2 + 20, size - 160);

  return canvas;
}

export function renderFavicon(style: BrandStyle): HTMLCanvasElement {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size, size);

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, style.fromColor);
  grad.addColorStop(1, style.toColor);
  ctx.fillStyle = grad;
  roundedRect(ctx, 8, 8, size - 16, size - 16, 128);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 320px ${CANVAS_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(style.icon.slice(0, 1) || "M", size / 2, size / 2 + 20, size - 120);

  return canvas;
}

export function canvasToDataURL(canvas: HTMLCanvasElement, mime = "image/png"): string {
  return canvas.toDataURL(mime);
}
