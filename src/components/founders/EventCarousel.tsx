import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { foundersEvents, type FoundersEvent } from "@/data/foundersEvents";
import { SmartImage } from "@/components/shared/SmartImage";
import { EventExpandedView } from "./EventExpandedView";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Events, a scroll-driven HORIZONTAL carousel. The stage pins to the viewport
 * and ordinary vertical scrolling (wheel / trackpad / touch swipe) drives the
 * track sideways, with spring smoothing. No arrows, no dragging.
 *
 * The card nearest the viewport centre is the "active" one: full scale, full
 * opacity, no turn. Neighbours ease back slightly in scale/opacity and take a
 * small 3D turn for depth, kept subtle so every photograph stays clearly
 * visible. The photo occupies ~75% of the card; text sits in a solid panel
 * beneath it and never covers the image.
 */

interface Metrics {
  cardW: number;
  cardH: number;
  imgH: number;
  gap: number;
  pitch: number;
}

function EventCard({
  ev,
  onOpen,
  m,
  index,
  x,
}: {
  ev: FoundersEvent;
  onOpen: () => void;
  m: Metrics;
  index: number;
  x: MotionValue<number>;
}) {
  // Signed distance (px) of this card's centre from the viewport centre.
  const offset = useTransform(x, (v) => index * m.pitch + v);
  const scale = useTransform(offset, [-m.pitch, 0, m.pitch], [0.92, 1, 0.92]);
  const opacity = useTransform(
    offset,
    [-m.pitch * 1.3, 0, m.pitch * 1.3],
    [0.62, 1, 0.62],
  );
  const rotateY = useTransform(offset, [-m.pitch, 0, m.pitch], [9, 0, -9]);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${ev.title}`}
      style={{ width: m.cardW, height: m.cardH, scale, opacity, rotateY }}
      className="group relative flex shrink-0 flex-col overflow-hidden rounded-2xl border border-founders-yellow/20 bg-founders-navy text-left shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
    >
      {/* photo, the hero of the card (very subtle hover zoom, no blur/dim) */}
      <div className="relative overflow-hidden" style={{ height: m.imgH }}>
        <SmartImage
          src={ev.coverImage}
          alt={ev.title}
          label={ev.category}
          tint="#ffcc1d"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* soft base gradient only, keeps the photo readable, never covers it */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-founders-navy/55 to-transparent" />
      </div>

      {/* solid info panel, title can never be clipped or sit on the photo */}
      <div className="flex flex-1 flex-col justify-center gap-1.5 border-t border-founders-yellow/10 bg-founders-navy px-5 pb-5 pt-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-founders-yellow">
            {ev.category}
          </span>
          {ev.date && (
            <span className="font-mono text-[0.6rem] text-[#fdf6e3]/40">
              {ev.date}
            </span>
          )}
        </div>
        <span className="text-display text-xl leading-snug text-[#fdf6e3]">
          {ev.title}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-founders-yellow/0 transition-colors duration-300 group-hover:border-founders-yellow/60" />
    </motion.button>
  );
}

function SectionHeader({ hint }: { hint: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 text-center">
      <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-founders-yellow">
        The work
      </p>
      <h2 className="text-display text-5xl text-[#fdf6e3] sm:text-7xl">Events</h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-[#fdf6e3]/50">{hint}</p>
    </div>
  );
}

export function EventCarousel() {
  const events = foundersEvents;
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const m: Metrics = isMobile
    ? { cardW: 250, cardH: 340, imgH: 250, gap: 20, pitch: 270 }
    : { cardW: 340, cardH: 450, imgH: 340, gap: 32, pitch: 372 };

  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<FoundersEvent | null>(null);

  // Vertical scroll through the runway → horizontal travel of the track.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const distance = (events.length - 1) * m.pitch;
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(xRaw, { stiffness: 110, damping: 26, restDelta: 0.5 });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const modal = (
    <AnimatePresence>
      {active && (
        <EventExpandedView event={active} onClose={() => setActive(null)} />
      )}
    </AnimatePresence>
  );

  // Reduced motion: no pinned scroll-jacking, a plain responsive grid instead.
  if (reduced) {
    return (
      <section className="relative py-24">
        <SectionHeader hint="Tap any event to open its gallery and my contribution." />
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => setActive(ev)}
              aria-label={`Open ${ev.title}`}
              className="group relative flex h-[420px] flex-col overflow-hidden rounded-2xl border border-founders-yellow/20 bg-founders-navy text-left"
            >
              <div className="relative h-[310px] overflow-hidden">
                <SmartImage
                  src={ev.coverImage}
                  alt={ev.title}
                  label={ev.category}
                  tint="#ffcc1d"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1.5 border-t border-founders-yellow/10 px-5 pb-5 pt-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-founders-yellow">
                    {ev.category}
                  </span>
                  {ev.date && (
                    <span className="font-mono text-[0.6rem] text-[#fdf6e3]/40">
                      {ev.date}
                    </span>
                  )}
                </div>
                <span className="text-display text-xl leading-snug text-[#fdf6e3]">
                  {ev.title}
                </span>
              </div>
            </button>
          ))}
        </div>
        {modal}
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative h-[400vh]">
      {/* pinned stage, vertical scrolling above drives the track sideways.
          overflow-hidden keeps the wide track from spilling into page scroll. */}
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <SectionHeader hint="Keep scrolling, the events move with you. Tap any event to open its gallery and my contribution." />

        <div className="mt-10" style={{ perspective: "1600px" }}>
          <motion.div
            className="flex items-center will-change-transform"
            style={{
              x,
              gap: m.gap,
              paddingLeft: `calc(50vw, ${m.cardW / 2}px)`,
              paddingRight: `calc(50vw, ${m.cardW / 2}px)`,
              transformStyle: "preserve-3d",
            }}
          >
            {events.map((ev, i) => (
              <EventCard
                key={ev.id}
                ev={ev}
                index={i}
                m={m}
                x={x}
                onOpen={() => setActive(ev)}
              />
            ))}
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="mt-8 flex flex-col items-center gap-1 text-founders-yellow/70"
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </div>

      {modal}
    </section>
  );
}
