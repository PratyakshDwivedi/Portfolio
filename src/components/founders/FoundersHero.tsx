import { motion } from "framer-motion";

const line1 = "Former Vice President".split(" ");
const line2 = "Current Advisor".split(" ");

const themes = ["leadership", "progression", "community", "execution", "entrepreneurship"];

/**
 * Founders Club monogram badge. Placeholder mark (no official logo asset was
 * supplied), drop the real logo into public/assets and swap this <img> in.
 */
function ClubBadge() {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-founders-yellow/40 bg-founders-navy"
      aria-label="Founders Club"
      title="Founders Club"
    >
      <span className="font-display text-sm font-bold tracking-tight text-founders-yellow">
        FC
      </span>
    </span>
  );
}

/** Kinetic typography hero for the Leadership page (navy + yellow world). */
export function FoundersHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* decorative oversized yellow orbit */}
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[70vmin] w-[70vmin] rounded-full border border-founders-yellow/20" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-[45vmin] w-[45vmin] rounded-full border border-founders-yellow/10" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* eyebrow with club badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3"
        >
          <ClubBadge />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-founders-yellow">
            Founders Club · SRMIST
          </span>
        </motion.div>

        <h1 className="text-display text-[12vw] leading-[0.9] text-[#fdf6e3] sm:text-[8rem] md:text-[10rem]">
          {[line1, line2].map((words, li) => (
            <span key={li} className="block overflow-hidden">
              {words.map((word, wi) => (
                <span key={wi} className="mr-[0.25em] inline-block overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.15 + li * 0.2 + wi * 0.08,
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`inline-block ${word === "President" || word === "Advisor" ? "text-founders-yellow" : ""}`}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* animated underline accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 h-1 w-40 origin-left bg-founders-yellow"
        />

        {/* concise Founders Club explanation */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-[#fdf6e3]/60"
        >
          Founders Club is SRMIST's student entrepreneurship community under the
          Directorate of Entrepreneurship and Innovation, creating opportunities
          through workshops, hackathons, bootcamps, founder talks and practical
          startup experiences.
        </motion.p>

        {/* rotating theme words */}
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          {themes.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="font-mono text-xs uppercase tracking-widest text-[#fdf6e3]/50"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
