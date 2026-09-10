import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { media } from "@/data/media";
import { profile } from "@/data/profile";
import { SmartImage } from "@/components/shared/SmartImage";

/**
 * CRED-tap-inspired parallax hero: layered typography and an oversized, masked
 * profile portrait that drift at different scroll speeds for depth. The image is
 * an intentional hero element, not a boxed avatar.
 */
export function ConnectHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const backWordY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const frontWordY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden">
      {/* back layer, oversized word drifting up */}
      <motion.h1
        style={{ y: backWordY }}
        className="text-display pointer-events-none absolute left-1/2 top-[12%] w-full -translate-x-1/2 text-center text-[24vw] leading-none text-content/[0.06]"
      >
        LET'S TALK
      </motion.h1>

      {/* middle layer, masked oversized portrait */}
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute left-1/2 top-1/2 h-[62vh] w-[46vh] max-w-[85vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        // organic mask so it doesn't read as a rectangle
        // (replace profile-placeholder.jpg to swap the photo)
      >
        <div className="h-full w-full [clip-path:ellipse(48%_50%_at_50%_50%)]">
          <SmartImage
            src={media.profile}
            alt={`${profile.name} portrait`}
            label="profile photo"
            className="h-full w-full object-cover grayscale"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 [clip-path:ellipse(48%_50%_at_50%_50%)] bg-gradient-to-t from-page/70 via-transparent to-transparent" />
      </motion.div>

      {/* front layer, name overlapping the image */}
      <motion.div
        style={{ y: frontWordY }}
        className="pointer-events-none absolute inset-x-0 bottom-[14%] z-10 text-center"
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
