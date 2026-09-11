import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { media } from "@/data/media";
import { SmartImage } from "@/components/shared/SmartImage";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Real stack only, positioned around the figure (avoiding the centre/face).
const LABELS: { name: string; x: number; y: number; depth: number }[] = [
  { name: "Python", x: 6, y: 20, depth: 1 },
  { name: "TypeScript", x: 13, y: 40, depth: 1.6 },
  { name: "C++", x: 4, y: 60, depth: 0.7 },
  { name: "React", x: 15, y: 78, depth: 1.3 },
  { name: "Java", x: 22, y: 30, depth: 2 },
  { name: "FastAPI", x: 18, y: 90, depth: 0.9 },
  { name: "Docker", x: 80, y: 18, depth: 1.4 },
  { name: "Kubernetes", x: 84, y: 38, depth: 0.8 },
  { name: "Redis", x: 88, y: 58, depth: 1.7 },
  { name: "TailwindCSS", x: 78, y: 76, depth: 1.1 },
  { name: "Machine Learning", x: 72, y: 90, depth: 0.7 },
  { name: "NLP", x: 86, y: 26, depth: 2 },
];

function FloatingLabel({
  label,
  progress,
  reduced,
}: {
  label: (typeof LABELS)[number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Gentle scroll parallax + fade. `progress` tracks the opening screen's own
  // scroll (0 = filling the viewport, 1 = fully scrolled away), so the tokens
  // stay visible for essentially the whole time the hero photo is on screen and
  // only fade as it leaves, rather than disappearing prematurely.
  const y = useTransform(progress, [0, 1], [0, label.depth * -70]);
  const opacity = useTransform(progress, [0, 0.1, 0.72, 0.95], [0, 1, 1, 0]);
  return (
    <motion.div
      style={{
        left: `${label.x}%`,
        top: `${label.y}%`,
        y: reduced ? 0 : y,
        opacity: reduced ? undefined : opacity,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <span className="glass flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium text-content shadow-[0_8px_26px_rgba(0,0,0,0.4)] sm:gap-3 sm:px-6 sm:py-3.5 sm:text-lg">
        <span className="h-2 w-2 rounded-full bg-accent sm:h-2.5 sm:w-2.5" />
        {label.name}
      </span>
    </motion.div>
  );
}

/**
 * Technical scene: ONE persistent background portrait behind the whole Technical
 * storytelling area. The image is a single sticky layer (never duplicated) that
 * progressively blurs + dims as you scroll, while the foreground content (opening
 * title, floating tech chips, and the project folders passed as `children`)
 * scrolls above it and stays sharp.
 */
export function TechStackScene({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Separate tracker for JUST the opening screen, so the tech chips + heading
  // time against the hero's own scroll (independent of how tall the project
  // list below happens to be).
  const { scrollYProgress: openingProgress } = useScroll({
    target: openingRef,
    offset: ["start start", "end start"],
  });

  const blurPx = useTransform(scrollYProgress, [0.05, 0.4], [0, 14]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const imgOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.9, 0.5, 0.38]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const headingOpacity = useTransform(openingProgress, [0, 0.45], [1, 0]);

  return (
    <section ref={ref} className="relative">
      {/* single persistent, sticky background layer for the entire section */}
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
      </div>

      {/* foreground content, above the persistent background */}
      <div className="relative z-10">
        {/* opening screen: large title + floating tech chips */}
        <div
          ref={openingRef}
          className="relative flex h-[100svh] items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            {LABELS.map((l) => (
              <FloatingLabel
                key={l.name}
                label={l}
                progress={openingProgress}
                reduced={reduced}
              />
            ))}
          </div>

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
