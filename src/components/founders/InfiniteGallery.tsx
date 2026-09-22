import { useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/shared/SmartImage";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * InfiniteGallery, a faithful recreation of the React Bits Pro `infinite-gallery`
 * component. The Pro registry requires a license key (see components.json +
 * .env.example); the same pattern the rest of this project already follows for
 * ParticleText and LiquidASCII, once REACTBITS_LICENSE_KEY is supplied you may
 * instead run `npx shadcn@latest add @reactbits-starter/infinite-gallery-tw`.
 *
 * A 2D grid of image tiles that tiles infinitely in every direction. The plane
 * lives inside a shared CSS perspective, so tiles further from the centre are
 * pushed back in Z and tilted toward the middle, giving real depth and parallax.
 * Drag to pan with momentum on release, and a gentle diagonal drift keeps it
 * alive while idle. Pauses when scrolled offscreen and honours reduced motion.
 */
interface GalleryItem {
  image: string;
  name: string;
}

interface Geom {
  tileW: number;
  tileH: number;
  pitchX: number;
  pitchY: number;
  depth: number;
}

/** Deterministic, non-linear image mapping so the same face never lines up. */
const imageIndex = (gx: number, gy: number, n: number) =>
  (((gx * 3 + gy * 5) % n) + n) % n;

/** Pure tile placement shared by the initial render and the rAF paint pass. */
function tileStyle(
  gx: number,
  gy: number,
  W: number,
  H: number,
  ox: number,
  oy: number,
  g: Geom,
) {
  const sx = W / 2 + ox + gx * g.pitchX;
  const sy = H / 2 + oy + gy * g.pitchY;
  const ndx = (sx - W / 2) / (W / 2 || 1);
  const ndy = (sy - H / 2) / (H / 2 || 1);
  const dist = Math.min(Math.hypot(ndx, ndy), 2.2);
  const z = -dist * g.depth;
  const rotY = -ndx * 9;
  const rotX = ndy * 9;
  const scale = Math.max(0.5, 1.06 - dist * 0.12);
  const opacity = Math.max(0.1, Math.min(1, 1.18 - dist * 0.52));
  return {
    transform: `translate3d(${sx - g.tileW / 2}px, ${sy - g.tileH / 2}px, 0) translateZ(${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
    opacity,
    zIndex: Math.round(1000 - dist * 200),
  };
}

export function InfiniteGallery({
  items,
  activeIndex,
  onSelect,
}: {
  items: GalleryItem[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const n = items.length;
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const g: Geom = isMobile
    ? { tileW: 128, tileH: 162, pitchX: 128 + 24, pitchY: 162 + 24, depth: 130 }
    : { tileW: 190, tileH: 240, pitchX: 190 + 44, pitchY: 240 + 44, depth: 230 };

  const wrapRef = useRef<HTMLDivElement>(null);
  const tileEls = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [cells, setCells] = useState<{ gx: number; gy: number }[]>([]);
  const rangeRef = useRef("");

  const offset = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const moved = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const lastInteract = useRef(0);
  const onScreen = useRef(true);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    let running = true;

    const io = new IntersectionObserver(
      ([e]) => (onScreen.current = e.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(wrap);

    const computeCells = (W: number, H: number) => {
      const ox = offset.current.x;
      const oy = offset.current.y;
      const mx = g.tileW;
      const my = g.tileH;
      const gxMin = Math.floor((-mx - W / 2 - ox) / g.pitchX);
      const gxMax = Math.ceil((W + mx - W / 2 - ox) / g.pitchX);
      const gyMin = Math.floor((-my - H / 2 - oy) / g.pitchY);
      const gyMax = Math.ceil((H + my - H / 2 - oy) / g.pitchY);
      const key = `${gxMin},${gxMax},${gyMin},${gyMax}`;
      if (key !== rangeRef.current) {
        rangeRef.current = key;
        const list: { gx: number; gy: number }[] = [];
        for (let gy2 = gyMin; gy2 <= gyMax; gy2++)
          for (let gx2 = gxMin; gx2 <= gxMax; gx2++)
            list.push({ gx: gx2, gy: gy2 });
        setCells(list);
      }
    };

    const paint = (W: number, H: number) => {
      const ox = offset.current.x;
      const oy = offset.current.y;
      tileEls.current.forEach((el, k) => {
        const [gx, gy] = k.split(",").map(Number);
        const s = tileStyle(gx, gy, W, H, ox, oy, g);
        el.style.transform = s.transform;
        el.style.opacity = String(s.opacity);
        el.style.zIndex = String(s.zIndex);
      });
    };

    const loop = () => {
      if (!running) return;
      if (onScreen.current) {
        const W = wrap.clientWidth;
        const H = wrap.clientHeight;
        const now = performance.now();
        if (!dragging.current && !reduced) {
          offset.current.x += vel.current.x;
          offset.current.y += vel.current.y;
          vel.current.x *= 0.93;
          vel.current.y *= 0.93;
          if (Math.abs(vel.current.x) < 0.01) vel.current.x = 0;
          if (Math.abs(vel.current.y) < 0.01) vel.current.y = 0;
          if (now - lastInteract.current > 1200) {
            offset.current.x += 0.18;
            offset.current.y -= 0.11;
          }
        }
        computeCells(W, H);
        paint(W, H);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [g.tileW, g.tileH, g.pitchX, g.pitchY, g.depth, reduced]);

  // Drag is tracked via window listeners (not pointer capture) so a plain tap
  // still dispatches a native `click` to the tile button underneath it.
  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    last.current = { x: e.clientX, y: e.clientY };
    vel.current = { x: 0, y: 0 };
    lastInteract.current = performance.now();

    const move = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const dx = ev.clientX - last.current.x;
      const dy = ev.clientY - last.current.y;
      offset.current.x += dx;
      offset.current.y += dy;
      vel.current = { x: dx, y: dy };
      last.current = { x: ev.clientX, y: ev.clientY };
      if (Math.hypot(dx, dy) > 2) moved.current = true;
      lastInteract.current = performance.now();
    };
    const up = () => {
      dragging.current = false;
      if (reduced) vel.current = { x: 0, y: 0 };
      lastInteract.current = performance.now();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const W0 = wrapRef.current?.clientWidth ?? 1200;
  const H0 = wrapRef.current?.clientHeight ?? 560;

  return (
    <div
      ref={wrapRef}
      onPointerDown={onDown}
      className="relative h-[62vh] min-h-[440px] w-full cursor-grab overflow-hidden select-none active:cursor-grabbing"
      style={{
        perspective: "1100px",
        perspectiveOrigin: "50% 50%",
        // Phones: let vertical swipes scroll the page (the wall still drags
        // sideways and keeps drifting); pointer devices keep full 2D dragging.
        touchAction: isMobile ? "pan-y" : "none",
        WebkitMaskImage:
          "radial-gradient(130% 130% at 50% 50%, #000 55%, transparent 100%)",
        maskImage:
          "radial-gradient(130% 130% at 50% 50%, #000 55%, transparent 100%)",
      }}
      aria-label="Draggable 3D testimonial gallery"
    >
      {cells.map(({ gx, gy }) => {
        const idx = imageIndex(gx, gy, n);
        const item = items[idx];
        const s = tileStyle(gx, gy, W0, H0, offset.current.x, offset.current.y, g);
        const isActive = idx === activeIndex;
        return (
          <button
            key={`${gx},${gy}`}
            type="button"
            ref={(el) => {
              const k = `${gx},${gy}`;
              if (el) tileEls.current.set(k, el);
              else tileEls.current.delete(k);
            }}
            onClick={() => {
              if (moved.current) return;
              onSelect(idx);
            }}
            aria-label={`Testimonial from ${item.name}`}
            className={cn(
              "absolute left-0 top-0 overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-300 will-change-transform",
              isActive
                ? "border-founders-yellow shadow-[0_0_0_2px_rgba(255,204,29,0.5),0_30px_70px_rgba(0,0,0,0.6)]"
                : "border-founders-yellow/12 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:border-founders-yellow/40",
            )}
            style={{
              width: g.tileW,
              height: g.tileH,
              transformOrigin: "center",
              transform: s.transform,
              opacity: s.opacity,
              zIndex: s.zIndex,
            }}
          >
            <SmartImage
              src={item.image}
              alt={item.name}
              label={item.name}
              tint="#ffcc1d"
              className="pointer-events-none h-full w-full object-cover object-top"
            />
            <span
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-founders-navy-deep/85 to-transparent px-3 pb-2 pt-6 text-left font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-opacity duration-300",
                isActive
                  ? "text-founders-yellow opacity-100"
                  : "text-[#fdf6e3]/70 opacity-0",
              )}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
