import { useEffect, useRef } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const RAMP = " .:-=+*#%@";

/**
 * Liquid ASCII, a custom recreation of the React Bits Pro `liquid-ascii`
 * component (Pro registry requires a license key). A flowing fluid field is
 * sampled and rendered as ASCII glyphs on a canvas; the pointer pushes ripples
 * through the fluid. Pauses offscreen and degrades to a static field under
 * reduced-motion.
 */
export function LiquidASCII({ color = "#FFCC1D" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cell = isMobile ? 12 : 10; // glyph cell size in px
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let visible = true;
    let t = 0;
    const pointer = { x: -999, y: -999, active: false };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
      ctx.font = `${cell}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";
    };

    const render = () => {
      raf = requestAnimationFrame(render); // never stop scheduling
      if (!visible) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const px = pointer.x / cell;
      const py = pointer.y / cell;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // layered sinusoidal flow field → "liquid"
          let v =
            Math.sin(x * 0.18 + t) * 0.5 +
            Math.sin(y * 0.22 - t * 0.8) * 0.5 +
            Math.sin((x + y) * 0.12 + t * 1.3) * 0.5 +
            Math.sin(Math.hypot(x - cols / 2, y - rows / 2) * 0.16 - t) * 0.5;

          // pointer ripple
          if (pointer.active) {
            const d = Math.hypot(x - px, y - py);
            v += Math.sin(d * 0.4 - t * 4) * Math.max(0, 1 - d / 22) * 2.2;
          }

          const n = (v + 3) / 6; // normalize ~0..1
          const idx = Math.max(
            0,
            Math.min(RAMP.length - 1, Math.floor(n * RAMP.length)),
          );
          const ch = RAMP[idx];
          if (ch === " ") continue;
          const alpha = 0.15 + n * 0.85;
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.fillText(ch, x * cell, y * cell);
        }
      }
      ctx.globalAlpha = 1;

      if (!reduced) t += 0.035;
    };

    resize();
    raf = requestAnimationFrame(render);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      io.disconnect();
    };
  }, [color, reduced, isMobile]);

  return <canvas ref={canvasRef} className="h-full w-full touch-none" aria-hidden />;
}
