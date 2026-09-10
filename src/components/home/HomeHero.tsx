import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { WritingAnimation } from "./WritingAnimation";
import { CodeReveal } from "./CodeReveal";
import { profile } from "@/data/profile";

type Phase = "writing" | "reveal";

const INTRO_KEY = "pd_intro_done";
const nameWords = profile.name.split(" ");
// Home intro no longer surfaces "Tabla" beneath the name (Music stays its own
// identity card + the About tabla section). Keep the other identities.
const introIdentities = profile.identities.filter((id) => id.key !== "music");

const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
};
const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* ignore */
  }
};

// Parent/child variants for the name reveal.
const charParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};
const charChild: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function HomeHero() {
  // The PD writing intro plays only on the first visit of a browser session;
  // navigating back to Home later in the session does not replay it.
  const [skipIntro] = useState(introSeen);
  const [phase, setPhase] = useState<Phase>(skipIntro ? "reveal" : "writing");
  const [showExtras, setShowExtras] = useState(skipIntro);

  const handleWritten = () => {
    setTimeout(() => setPhase("reveal"), 450);
    setTimeout(() => {
      setShowExtras(true);
      markIntroSeen();
    }, 1350);
  };

  // Safety net: if the writing callback is ever missed, still reveal.
  useEffect(() => {
    if (skipIntro) return;
    const t = setTimeout(() => {
      setPhase((p) => (p === "writing" ? "reveal" : p));
      setShowExtras(true);
      markIntroSeen();
    }, 4200);
    return () => clearTimeout(t);
  }, [skipIntro]);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[140px]" />
      </div>

      {/* Stage: PD handwriting (first session load only) */}
      <AnimatePresence>
        {phase === "writing" && (
          <motion.div
            key="writing"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            transition={{ duration: 0.6 }}
            className="relative h-48 w-72 sm:h-56 sm:w-96"
          >
            <WritingAnimation onDone={handleWritten} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage: name + identities + code */}
      {phase === "reveal" && (
        <div className="relative flex flex-col items-center text-center">
          <motion.p
            initial={skipIntro ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="eyebrow mb-6"
          >
            Engineer · Leader
          </motion.p>

          <motion.h1
            variants={charParent}
            initial={skipIntro ? false : "hidden"}
            animate="show"
            className="text-display text-balance text-5xl leading-[0.95] sm:text-7xl md:text-8xl"
          >
            {nameWords.map((word, wi) => (
              <span key={wi} className="mr-4 inline-block overflow-hidden pb-[0.1em]">
                {word.split("").map((ch, ci) => (
                  <span key={ci} className="inline-block overflow-hidden">
                    <motion.span variants={charChild} className="inline-block">
                      {ch}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </motion.h1>

          <AnimatePresence>
            {showExtras && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10 flex flex-col items-center gap-10"
              >
                {/* identities (Tabla intentionally omitted from the intro) */}
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm sm:text-base">
                  {introIdentities.map((id, i) => (
                    <motion.span
                      key={id.key}
                      initial={skipIntro ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 * i }}
                      className="flex items-center gap-3"
                    >
                      {i > 0 && <span className="text-accent/50">/</span>}
                      <span className="font-medium text-content">{id.label}</span>
                    </motion.span>
                  ))}
                </div>

                {/* animated identity code */}
                <motion.div
                  initial={skipIntro ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full"
                >
                  <CodeReveal start={showExtras} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* scroll cue */}
      {showExtras && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="flex flex-col items-center gap-2 text-muted/80"
          >
            <span className="eyebrow">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
