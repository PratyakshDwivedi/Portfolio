import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParticleText } from "./ParticleText";
import { profile } from "@/data/profile";

/**
 * About hero, the Particle-Text name is the primary identity, composed over
 * the page-level cinematic background video (provided by About.tsx). The hero
 * itself is transparent so that shared video shows through.
 */
export function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="relative h-[100svh]">
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6"
      >
        <p className="eyebrow mb-6">About · The person behind the work</p>
        <ParticleText
          text={profile.name}
          className="pointer-events-auto h-[26vh] w-full max-w-5xl md:h-[34vh]"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-xl text-center text-muted"
        >
          Move your cursor across the name. Then scroll, from classrooms in
          Aligarh to a founders' community and a tabla in Chennai.
        </motion.p>
      </motion.div>
    </section>
  );
}
