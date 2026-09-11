import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BARS = 7;

/**
 * Startup skeleton loader (a row of tall bars pulsing at staggered heights).
 *
 * It is shown ONLY while the browser is genuinely still loading initial
 * resources — its lifetime is bound to the real `window` load event, not an
 * arbitrary timer. Once the page has finished loading it hides, handing off
 * directly to the Home PD intro animation.
 *
 * Because this component mounts once at the app root and never unmounts,
 * client-side navigation between sections never re-shows it. On a genuine
 * page refresh the document reloads, so it briefly appears again only if
 * resources actually need fetching (cached loads resolve instantly with no
 * flash, since `document.readyState` is already "complete").
 */
export function StartupLoader() {
  const [show, setShow] = useState(() => {
    try {
      return document.readyState !== "complete";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show) return;
    if (document.readyState === "complete") {
      setShow(false);
      return;
    }
    const done = () => setShow(false);
    window.addEventListener("load", done, { once: true });
    return () => window.removeEventListener("load", done);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="startup-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-page"
          aria-hidden
        >
          {/* tall bars */}
          <div className="flex h-16 items-end gap-1.5">
            {Array.from({ length: BARS }).map((_, i) => (
              <motion.span
                key={i}
                className="w-1.5 rounded-full bg-accent"
                initial={{ height: "20%", opacity: 0.4 }}
                animate={{
                  height: ["20%", "100%", "20%"],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.09,
                }}
                style={{ transformOrigin: "bottom" }}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 font-mono text-[0.65rem] tracking-[0.4em] text-muted"
          >
            PD
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
