import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { music } from "@/data/education";
import { media } from "@/data/media";
import { SmartImage } from "@/components/shared/SmartImage";
import { CinematicVideo } from "@/components/shared/CinematicVideo";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Teental, the 16-beat classical cycle. Vibhags (measures) of 4.
const TEENTAL = [
  "Dha", "Dhin", "Dhin", "Dha",
  "Dha", "Dhin", "Dhin", "Dha",
  "Dha", "Tin", "Tin", "Ta",
  "Ta", "Dhin", "Dhin", "Dha",
];

/** Concentric tabla-face geometry (the syahi + kinar rings). */
function TablaMandala() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full">
      <defs>
        <radialGradient id="syahi" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#1B1815" />
          <stop offset="70%" stopColor="#252019" />
          <stop offset="100%" stopColor="#3A332C" />
        </radialGradient>
      </defs>
      {[190, 165, 140, 115].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke="#D68A4C"
          strokeOpacity={0.12 + i * 0.05}
          strokeWidth={i === 0 ? 2 : 1}
        />
      ))}
      <circle cx="200" cy="185" r="82" fill="url(#syahi)" stroke="#D68A4C" strokeOpacity="0.25" />
      {/* radial ticks like the rim lacing */}
      {Array.from({ length: 48 }).map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={200 + Math.cos(a) * 188}
            y1={200 + Math.sin(a) * 188}
            x2={200 + Math.cos(a) * 196}
            y2={200 + Math.sin(a) * 196}
            stroke="#D68A4C"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}

/** The 16-beat cycle, lit in sequence like a metronome of taal. */
function TaalCycle() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {TEENTAL.map((bol, i) => {
        const sam = i === 0; // the emphatic first beat
        const khali = i === 8; // the "empty" beat
        return (
          <motion.div
            key={i}
            initial={reduced ? false : { opacity: 0.35 }}
            animate={
              reduced
                ? undefined
                : { opacity: [0.35, 1, 0.35], scale: [1, 1.06, 1] }
            }
            transition={{
              duration: 16 * 0.28,
              times: undefined,
              repeat: Infinity,
              delay: i * 0.28,
              ease: "easeInOut",
            }}
            className={`flex aspect-square flex-col items-center justify-center rounded-full border text-center ${
              sam
                ? "border-[#D68A4C]/60 bg-[#D68A4C]/10"
                : khali
                  ? "border-[#3A332C] bg-transparent"
                  : "border-[#3A332C] bg-content/[0.03]"
            }`}
          >
            <span className="font-serif text-sm text-content sm:text-base">{bol}</span>
            <span className="font-mono text-[0.5rem] text-[#9C9186]">{i + 1}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function MusicalJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const spin = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const videoOpacity = useTransform(scrollYProgress, [0.4, 0.75], [0, 0.5]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, #2A231C 0%, #221D18 45%, #1B1815 100%)",
      }}
    >
      {/* Tabla video becomes dominant toward the end of the section */}
      <motion.div style={{ opacity: videoOpacity }} className="absolute inset-0">
        <CinematicVideo
          src={media.tablaVideo}
          poster={media.tablaPoster}
          label="tabla video"
          tint="#D68A4C"
          overlay={0.7}
          withSound={false}
        />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* header */}
        <div className="mb-16 text-center">
          <p className="mb-4 font-mono text-[0.7rem] tracking-[0.08em] text-[#D68A4C]">
            साधना · The Musical Self
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight text-content sm:text-6xl">
            {music.headline}
          </h2>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* left: mandala + photo */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <motion.div style={{ rotate: spin }} className="absolute inset-0">
              <TablaMandala />
            </motion.div>
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-[#D68A4C]/25 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:h-72 sm:w-72">
              <SmartImage
                src={media.tablaPhoto}
                alt="Pratyaksh Dwivedi playing the tabla"
                label="tabla photo"
                tint="#D68A4C"
                className="h-full w-full object-cover [object-position:50%_28%]"
              />
            </div>
          </div>

          {/* right: story + taal */}
          <div>
            <div className="mb-8 space-y-4">
              {music.lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-lg leading-relaxed text-[#C9BCA6]"
                >
                  {line}
                </motion.p>
              ))}
            </div>
            <p className="mb-4 font-mono text-[0.65rem] tracking-[0.08em] text-[#9C9186]">
              Teental · 16 beats
            </p>
            <TaalCycle />
          </div>
        </div>
      </div>
    </section>
  );
}
