import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_KEY = "pd_booted";
const BARS = 7;

/**
 * Startup skeleton loader (adapted from the Uiverse "tall fish" concept:
 * a row of tall bars pulsing at staggered heights). Shows ONCE per browser
 * session on first load, then fades out. Navigation between sections never
 * replays it. Respects prefers-reduced-motion.
 */
export function StartupLoader() {
  // Only boot on the very first load of the session.
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(BOOT_KEY) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = () => {
      try {
        sessionStorage.setItem(BOOT_KEY, "1");
      } catch {
        /* ignore */
      }
      setShow(false);
    };
    // Short, sensible duration; leave slightly longer if the page is still busy.
    const t = setTimeout(done, reduced ? 350 : 1500);
    return () => clearTimeout(t);
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
