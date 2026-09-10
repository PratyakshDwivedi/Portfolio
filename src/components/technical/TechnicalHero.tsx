import { motion } from "framer-motion";
import { LiquidASCII } from "./LiquidASCII";

/**
 * Technical hero, the Liquid ASCII simulation is the full-bleed background;
 * the word "Technical" is layered above it with depth (not inside a card).
 */
export function TechnicalHero() {
  return (
    <section className="relative flex h-[100svh] items-center justify-center overflow-hidden">
      {/* layer 1, ASCII fluid */}
      <div className="absolute inset-0 opacity-70">
        <LiquidASCII />
      </div>

      {/* layer 2, vignette for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_20%,rgba(8,8,10,0.85)_100%)]" />

      {/* layer 3, foreground type */}
      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="eyebrow mb-6"
        >
          Systems · Pipelines · Infrastructure
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "-0.05em" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-display text-[18vw] leading-none text-content md:text-[13rem]"
        >
          Technical
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-4 max-w-lg text-muted"
        >
          Case studies in building systems that are efficient, observable,
          and built to scale.
        </motion.p>
      </div>

      {/* subtle scanline texture for a terminal feel */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #EDE6DB 0 1px, transparent 1px 3px)",
        }}
      />
    </section>
  );
}
