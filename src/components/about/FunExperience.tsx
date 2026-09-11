import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Lock,
  LockOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";
import { media } from "@/data/media";

// The unlock combination. Deliberately NOT surfaced anywhere in the UI beyond
// the birthday hint (18 May → 1 8 0 5).
const CODE = [1, 8, 0, 5];

/**
 * Hidden "Click for Fun" experience for the About page. A combination-lock card
 * (adapted from the uiverse "good-pig-77" lock effect into the site's warm-dark
 * theme) gates a full-screen playback of the ORIGINAL About background video.
 *
 * The overlay is a portal on document.body, so it sits above the page's
 * pointer-events-none content wrappers. It locks page scroll while open and
 * restores the exact scroll position on close, so Back returns the visitor to
 * where they opened it, never the top.
 */
export function FunExperience({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return createPortal(
    <AnimatePresence>{open && <FunOverlay onClose={onClose} />}</AnimatePresence>,
    document.body,
  );
}

function FunOverlay({ onClose }: { onClose: () => void }) {
  const [digits, setDigits] = useState<number[]>([0, 0, 0, 0]);
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);

  // Lock scroll while open; restore the exact position on unmount so Back
  // returns the visitor to where they were on the About page.
  useEffect(() => {
    const y = window.scrollY;
    const de = document.documentElement;
    const prevOverflow = de.style.overflow;
    de.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      de.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    };
  }, [onClose]);

  const bump = (i: number, delta: number) =>
    setDigits((d) => d.map((x, idx) => (idx === i ? (x + delta + 10) % 10 : x)));

  const tryOpen = () => {
    if (digits.every((d, i) => d === CODE[i])) setUnlocked(true);
    else setWrong(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-page/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Fun experience"
    >
      {/* Back, always top-left */}
      <button
        type="button"
        onClick={onClose}
        className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2.5 text-sm font-medium text-content transition hover:border-muted/50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="lock"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md px-6 text-center"
          >
            <motion.div
              animate={wrong ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onAnimationComplete={() => wrong && setWrong(false)}
              className="rounded-3xl border border-line bg-surface/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-page/60 text-accent">
                <Lock className="h-6 w-6" />
              </div>
              <p className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-accent">
                Locked
              </p>
              <h3 className="text-display mb-6 text-2xl text-content">
                Crack the code.
              </h3>
              <p className="mb-6 font-mono text-xs tracking-wide text-muted">
                Hint: My birthday is 18 May
              </p>

              {/* four digit dials */}
              <div className="mb-8 flex items-center justify-center gap-3 sm:gap-4">
                {digits.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => bump(i, +1)}
                      aria-label={`Increase digit ${i + 1}`}
                      className="text-muted transition hover:text-accent"
                    >
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <div className="relative h-16 w-12 overflow-hidden rounded-xl border border-line bg-page">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                          key={d}
                          initial={{ y: 22, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -22, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-content"
                        >
                          {d}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      onClick={() => bump(i, -1)}
                      aria-label={`Decrease digit ${i + 1}`}
                      className="text-muted transition hover:text-accent"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={tryOpen}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition hover:bg-accent-soft"
              >
                <LockOpen className="h-4 w-4" />
                Open
              </button>
              {wrong && (
                <p className="mt-4 font-mono text-xs text-muted/70">
                  Not quite. Try again.
                </p>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <FunVideo key="video" />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Full-screen playback of the original About background video, opened only
 *  after the correct code. Autoplay with sound is allowed here because it
 *  follows the user's Open click (a genuine gesture). */
function FunVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Fall back to muted autoplay if the browser still blocks sound.
        v.muted = true;
        setMuted(true);
        v.play().catch(() => setPlaying(false));
      });
  }, []);

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    setMuted(v.muted);
  };
  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-video max-h-[82vh] w-[92vw] max-w-6xl overflow-hidden rounded-2xl border border-line shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
    >
      <video
        ref={ref}
        src={media.funVideo}
        className="h-full w-full object-cover"
        autoPlay
        loop
        playsInline
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-page/50 via-transparent to-page/20" />

      {/* top-right controls: mute + pause/play */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause video" : "Play video"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/80 text-content/80 transition hover:text-content"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/80 text-content/80 transition hover:text-content"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
}
