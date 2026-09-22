import { useEffect, useRef } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface PixelatedCanvasProps {
  src: string;
  className?: string;
  /** Pixel cell size in CSS px (smaller = finer). */
  cellSize?: number;
  /** Fraction of the cell each dot fills (0–1). */
  dotScale?: number;
  shape?: "square" | "circle";
  /** Cursor influence radius (CSS px). */
  distortionRadius?: number;
  /** How far cells push away from the cursor (CSS px). */
  distortionStrength?: number;
  /** Easing toward target (0–1). */
  followSpeed?: number;
  /** Base brightness of the image when idle (0–1). */
  baseBrightness?: number;
}

interface Cell {
  cx: number;
  cy: number;
  r: number;
  g: number;
  b: number;
  ox: number;
  oy: number;
  lit: number;
}

/**
 * Pixelated Canvas, a recreation of the Aceternity UI `pixelated-canvas`
 * component. An image is sampled into a grid of pixel cells; near the cursor
 * the cells brighten, scale up, and push outward (a soft ripple), easing back
 * on leave. Renders a static pixelated image under reduced-motion / on mobile.
 */
export function PixelatedCanvas({
  src,
  className,
  cellSize = 6,
  dotScale = 0.9,
  shape = "square",
  distortionRadius = 95,
  distortionStrength = 16,
  followSpeed = 0.14,
  baseBrightness = 0.82,
}: PixelatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cells: Cell[] = [];
    let raf = 0;
    let visible = true;
    let disposed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cell = isMobile ? Math.max(cellSize, 8) : cellSize;
    const interactive = !isMobile && !reduced;
    const pointer = { x: -9999, y: -9999, active: false };
    const img = new Image();
    img.crossOrigin = "anonymous";

    const build = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0 || !img.complete || img.naturalWidth === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw the image "cover" into an offscreen buffer, then sample cells.
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      octx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const data = octx.getImageData(0, 0, w, h).data;

      const next: Cell[] = [];
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          // sample the cell centre
          const sx = Math.min(w - 1, x + (cell >> 1));
          const sy = Math.min(h - 1, y + (cell >> 1));
          const idx = (sy * w + sx) * 4;
          next.push({
            cx: x + cell / 2,
            cy: y + cell / 2,
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2],
            ox: 0,
            oy: 0,
            lit: 0,
          });
        }
      }
      cells = next;
    };

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      const R = distortionRadius;
      const size = cell * dotScale;
      for (const c of cells) {
        let tox = 0;
        let toy = 0;
        let tlit = 0;
        if (interactive && pointer.active) {
          const dx = c.cx - pointer.x;
          const dy = c.cy - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R) {
            const f = 1 - dist / R;
            const d = dist || 1;
            tox = (dx / d) * f * distortionStrength;
            toy = (dy / d) * f * distortionStrength;
            tlit = f;
          }
        }
        c.ox += (tox - c.ox) * followSpeed;
        c.oy += (toy - c.oy) * followSpeed;
        c.lit += (tlit - c.lit) * followSpeed;

        const bright = baseBrightness + c.lit * (1 - baseBrightness) + c.lit * 0.15;
        const r = Math.min(255, c.r * bright);
        const g = Math.min(255, c.g * bright);
        const b = Math.min(255, c.b * bright);
        const s = size * (1 + c.lit * 0.6);
        const px = c.cx + c.ox - s / 2;
        const py = c.cy + c.oy - s / 2;
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        if (shape === "circle") {
          ctx.beginPath();
          ctx.arc(px + s / 2, py + s / 2, s / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(px, py, s, s);
        }
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || cells.length === 0) return;
      draw();
    };

    img.onload = () => {
      if (disposed) return;
      build();
      draw(); // paint once immediately (in case rAF is throttled)
    };
    img.src = src;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    // Rebuild whenever the element is actually sized/resized (robust against
    // measuring before the grid has laid out).
    let lastW = 0;
    let lastH = 0;
    const ro = new ResizeObserver(() => {
      const w = Math.round(wrap.clientWidth);
      const h = Math.round(wrap.clientHeight);
      if (w === 0 || h === 0) return;
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      build();
      draw();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => (visible = entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(wrap);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, cellSize, dotScale, shape, reduced, isMobile]);

  return (
    <div ref={wrapRef} className={className} role="img" aria-label="Pratyaksh Dwivedi">
      <canvas
        ref={canvasRef}
        className={`h-full w-full ${isMobile ? "touch-auto" : "touch-none"}`}
      />
    </div>
  );
}
