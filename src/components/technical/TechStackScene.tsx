import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { media } from "@/data/media";
import { SmartImage } from "@/components/shared/SmartImage";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Real stack only, positioned around the figure (avoiding the centre/face).
const LABELS: { name: string; x: number; y: number }[] = [
  { name: "Python", x: 9, y: 20 },
  { name: "TypeScript", x: 13, y: 40 },
  { name: "C++", x: 7, y: 60 },
  { name: "React", x: 15, y: 78 },
  { name: "Java", x: 22, y: 30 },
  { name: "FastAPI", x: 18, y: 90 },
  { name: "Docker", x: 80, y: 18 },
  { name: "Kubernetes", x: 84, y: 38 },
  { name: "Redis", x: 88, y: 58 },
  { name: "TailwindCSS", x: 78, y: 76 },
  { name: "Machine Learning", x: 72, y: 90 },
  { name: "NLP", x: 86, y: 26 },
];

/** A single anchored tech pod. Position is fixed at x%/y% of the sticky layer;
 *  its fade + blur are driven by the parent motion layer, so pods stay put
 *  (anchored) rather than drifting with every scroll tick.
 *
 *  `compact` (phones/small tablets): a pod centred on its x% anchor is wider
 *  than the gutter it sits in, so it would be cut off by the screen edge.
 *  There the pod hugs the matching edge instead, keeping the same two columns
 *  flanking the figure with every label fully readable. */
function FloatingLabel({
  label,
  compact,
}: {
  label: (typeof LABELS)[number];
  compact: boolean;
}) {
  const top = `${label.y}%`;
  const pos: CSSProperties = compact
    ? label.x < 50
      ? { left: "0.5rem", top }
      : { right: "0.5rem", top }
    : { left: `${label.x}%`, top };

  return (
    <div
      style={pos}
      className={`absolute -translate-y-1/2 ${compact ? "" : "-translate-x-1/2"}`}
    >
      <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-content shadow-[0_8px_26px_rgba(0,0,0,0.4)] sm:gap-3 sm:px-6 sm:py-3.5 sm:text-lg">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent sm:h-2.5 sm:w-2.5" />
        {label.name}
      </span>
    </div>
  );
}

/**
 * Technical scene: ONE persistent background portrait behind the whole Technical
 * storytelling area. The portrait AND the tech pods live together in a single
 * sticky layer, so the pods are anchored around the figure (they don't drift with
 * the scroll). As you scroll on, that whole layer, photo and pods, progressively
 * blurs + dims into the background, while the foreground content (opening title
 * and the project folders passed as `children`) scrolls above it and stays sharp.
 */
export function TechStackScene({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const compact = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Separate tracker for JUST the opening screen, so the heading times against
  // the hero's own scroll (independent of how tall the project list below is).
  const { scrollYProgress: openingProgress } = useScroll({
    target: openingRef,
    offset: ["start start", "end start"],
  });

  // Blur/dim/pod fade start later and ease out more gradually, so the photo and
  // its tech pods stay clearly visible for much longer while scrolling before
  // receding into the background (they still recede; they're never fixed).
  const blurPx = useTransform(scrollYProgress, [0.2, 0.6], [0, 14]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const imgOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [0.9, 0.6, 0.38]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  // Pods read clearly over the hero and hold full opacity well into the scroll,
  // then recede with the photo as projects arrive (they never fully vanish,
  // staying as faint background texture).
  const podsOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.6, 0.85],
    [0, 1, 1, 0.12],
  );
  const headingOpacity = useTransform(openingProgress, [0, 0.45], [1, 0]);

  return (
    <section ref={ref} className="relative">
      {/* single persistent, sticky background layer (photo + anchored pods) */}
      <div className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden">
        <motion.div
          style={{
            filter: reduced ? undefined : filter,
            opacity: imgOpacity,
            scale: imgScale,
          }}
          className="absolute inset-0"
        >
          <SmartImage
            src={media.technicalBg}
            alt="Pratyaksh Dwivedi"
            label="technical background"
            className="h-full w-full object-cover object-center"
          />
          {/* navy wash so the portrait reads as part of the scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-page/70 via-page/45 to-page/90" />
          <div className="absolute inset-0 bg-page/25" />
        </motion.div>

        {/* tech pods, anchored around the figure; they blur + fade with the
            photo as the section scrolls (kept behind the foreground content). */}
        <motion.div
          style={{
            filter: reduced ? undefined : filter,
            opacity: reduced ? undefined : podsOpacity,
          }}
          className="absolute inset-0"
        >
          {LABELS.map((l) => (
            <FloatingLabel key={l.name} label={l} compact={compact} />
          ))}
        </motion.div>
      </div>

      {/* foreground content, above the persistent background */}
      <div className="relative z-10">
        {/* opening screen: large title (pods now live in the anchored bg layer) */}
        <div
          ref={openingRef}
          className="relative flex h-[100svh] items-center justify-center overflow-hidden"
        >
          <motion.div
            style={{ opacity: reduced ? undefined : headingOpacity }}
            className="relative z-10 px-6 text-center"
          >
            <p className="eyebrow mb-4 text-sm sm:text-base">The stack</p>
            <h2 className="text-display text-6xl leading-[0.95] text-content sm:text-8xl md:text-[9rem]">
              Tools of the trade.
            </h2>
            <p className="mx-auto mt-6 max-w-md text-base text-muted sm:text-lg">
              Languages, frameworks and infrastructure I build with. Scroll on to
              the work.
            </p>
          </motion.div>
        </div>

        {children}
      </div>
    </section>
  );
}
