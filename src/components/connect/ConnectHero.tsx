import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * CRED-tap-inspired parallax hero: layered typography that drifts at different
 * scroll speeds for depth.
 */
export function ConnectHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backWordY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const frontWordY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden">
      {/* back layer, oversized word drifting up */}
      <motion.h1
        style={{ y: backWordY }}
        className="text-display pointer-events-none absolute inset-x-0 top-[12%] text-center text-[24vw] leading-none text-content/[0.06]"
      >
        LET'S TALK
      </motion.h1>

      {/* front layer, name. Positioned near vertical
          centre (via `top`, not a transform — Framer's inline `y` owns the
          transform) so the hero content sits where the other pages' heroes do,
          instead of leaving a large empty band at the top of the page. */}
      <motion.div
        style={{ y: frontWordY }}
        className="pointer-events-none absolute inset-x-0 top-[40%] z-10 text-center"
      >
        <p className="eyebrow mb-4">Connect with me</p>
        <h2 className="text-display text-[13vw] leading-[0.85] sm:text-[8rem]">
          Pratyaksh
        </h2>
      </motion.div>

      {/* scroll cue */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-mono text-[0.65rem] tracking-[0.08em] text-muted/80"
      >
        Scroll to reach me
      </motion.p>
    </section>
  );
}
