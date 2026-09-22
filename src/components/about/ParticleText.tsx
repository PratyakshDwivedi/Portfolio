import { useEffect, useRef } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface ParticleTextProps {
  text: string;
  className?: string;
  color?: string;
}

interface P {
  x: number; // current
  y: number;
  sx: number; // start (random)
  sy: number;
  hx: number; // home (target letter pixel)
  hy: number;
  ox: number; // transient pointer offset
  oy: number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Particle Text, a custom recreation of the React Bits Pro `particle-text`
 * component (its registry needs a paid license key). Text is sampled into
 * particles that tween from a random scatter onto the exact letterforms, then
 * scatter away from the pointer and ease back. Deterministic assembly = crisp,
 * always-legible letters. Pauses offscreen; static heading under reduced-motion.
 */
export function ParticleText({
  text,
  className,
  color = "#FDF6E3",
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: P[] = [];
    let raf = 0;
    let visible = true;
    let disposed = false;
    let startTime = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -9999, y: -9999, active: false };
    const gap = isMobile ? 4 : 3;
    const ASSEMBLE_MS = 1600;

    const build = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d")!;
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      let fontSize = Math.min(h * 0.62, 200);
      octx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`;
      const measured = octx.measureText(text).width;
      const maxW = w * 0.9;
      if (measured > maxW) {
        fontSize = Math.max(24, fontSize * (maxW / measured));
        octx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`;
      }
      octx.fillText(text, w / 2, h / 2);

      const data = octx.getImageData(0, 0, w, h).data;
      const next: P[] = [];
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            next.push({
              x: Math.random() * w,
              y: Math.random() * h,
              sx: Math.random() * w,
              sy: Math.random() * h,
              hx: x,
              hy: y,
              ox: 0,
              oy: 0,
            });
          }
        }
      }
      // Re-seed start from the freshly generated random x/y.
      for (const p of next) {
        p.sx = p.x;
        p.sy = p.y;
      }
      particles = next;
      startTime = 0; // set on the first visible frame so assembly plays on view
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (!visible || particles.length === 0) return;
      if (startTime === 0) startTime = now;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;

      const t = Math.min((now - startTime) / ASSEMBLE_MS, 1);
      const e = easeOutCubic(t);

      for (const p of particles) {
        // deterministic assembly toward the exact letter pixel
        const baseX = p.sx + (p.hx - p.sx) * e;
        const baseY = p.sy + (p.hy - p.sy) * e;

        // pointer repulsion, a transient offset that eases back to 0
        if (pointer.active) {
          const dx = baseX - pointer.x;
          const dy = baseY - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 3200) {
            const d = Math.sqrt(d2) || 1;
            const force = (1 - d2 / 3200) * 26;
            p.ox += (dx / d) * force;
            p.oy += (dy / d) * force;
          }
        }
        p.ox *= 0.82;
        p.oy *= 0.82;

        p.x = baseX + p.ox;
        p.y = baseY + p.oy;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
    };

    const fontsReady =
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ??
      Promise.resolve();
    fontsReady.then(() => {
      if (!disposed) build();
    });
    raf = requestAnimationFrame(step);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onResize = () => build();

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [text, color, reduced, isMobile]);

  return (
    <div ref={wrapRef} className={className} aria-label={text} role="img">
      {reduced ? (
        <div className="flex h-full w-full items-center justify-center">
          <span
            className="text-display text-center text-[13vw] leading-none md:text-[9rem]"
            style={{ color }}
          >
            {text}
          </span>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          // phones must be able to scroll past the hero; pointer devices keep the
          // canvas capturing the pointer for the particle interaction
          className={`h-full w-full ${isMobile ? "touch-auto" : "touch-none"}`}
        />
      )}
    </div>
  );
}
