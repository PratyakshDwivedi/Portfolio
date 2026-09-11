import { useLayoutEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Wraps each route so entering/leaving pages animate intentionally.
 *
 * Scroll reset lives here rather than on a global route-change effect: with the
 * router's AnimatePresence in `mode="wait"`, the incoming page only mounts once
 * the outgoing page has finished animating out. Resetting scroll on THIS mount
 * therefore happens after the exit completes, so the outgoing page never jerks
 * to the top mid-transition, and the new page still appears from the top. Hash
 * targets (e.g. /about#sadhana) manage their own scroll and are left alone.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [hash]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
