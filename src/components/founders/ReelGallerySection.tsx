import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { reelGallery } from "@/data/media";
import { SmartImage } from "@/components/shared/SmartImage";

/**
 * Closing "Reel Gallery", tilted reels that glide as you scroll (custom
 * recreation of the React Bits Pro `reel-gallery`). Two staggered columns of
 * tilted cards move at different scroll speeds for a cinematic sign-off.
 */
export function ReelGallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yA = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const yB = useTransform(scrollYProgress, [0, 1], [-80, 160]);

  const half = Math.ceil(reelGallery.length / 2);
  const colA = reelGallery.slice(0, half);
  const colB = reelGallery.slice(half);

  return (
    <section ref={ref} className="relative overflow-hidden py-32">
      <div className="mx-auto mb-16 max-w-6xl px-6 text-center">
        <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-founders-yellow">
          The reel
        </p>
        <h2 className="text-display text-5xl text-[#fdf6e3] sm:text-7xl">
          Moments in motion
        </h2>
      </div>

      <div
        className="mx-auto flex max-w-5xl justify-center gap-6 px-6"
        style={{ perspective: "1200px" }}
      >
        <motion.div style={{ y: yA }} className="flex flex-1 flex-col gap-6">
          {colA.map((src, i) => (
            <div
              key={i}
              className="aspect-[9/14] overflow-hidden rounded-2xl border border-founders-yellow/15 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              style={{ transform: "rotate(-4deg)" }}
            >
              <SmartImage
                src={src}
                alt="Founders reel"
                label="reel"
                tint="#ffcc1d"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </motion.div>
        <motion.div style={{ y: yB }} className="mt-16 flex flex-1 flex-col gap-6">
          {colB.map((src, i) => (
            <div
              key={i}
              className="aspect-[9/14] overflow-hidden rounded-2xl border border-founders-yellow/15 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              style={{ transform: "rotate(4deg)" }}
            >
              <SmartImage
                src={src}
                alt="Founders reel"
                label="reel"
                tint="#ffcc1d"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
