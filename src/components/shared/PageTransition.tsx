import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLaptopTransition } from "./LaptopTransition";
import { prepareRouteExtras, whenIdle } from "@/lib/assets";

/**
 * Wraps each route so entering/leaving pages animate intentionally.
 *
 * Scroll reset lives here rather than on a global route-change effect: with the
 * router's AnimatePresence in `mode="wait"`, the incoming page only mounts once
 * the outgoing page has finished animating out. Resetting scroll on THIS mount
 * therefore happens after the exit completes, so the outgoing page never jerks
 * to the top mid-transition, and the new page still appears from the top. Hash
 * targets (e.g. /about#sadhana) manage their own scroll and are left alone.
 *
 * When the shared laptop transition is driving a navigation, this fade steps
 * aside (the laptop is the transition) so the two never stack.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { hash, pathname } = useLocation();
  const { active: laptop, notifyMounted } = useLaptopTransition();

  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [hash]);

  // Tell a running laptop transition that the destination page is mounted.
  useLayoutEffect(() => {
    notifyMounted();
  }, [notifyMounted]);

  // Now that this page is being viewed, prepare its heavier, later-used
  // assets (expanded-event photos, galleries, the fun video) in idle time.
  useEffect(() => {
    whenIdle(() => prepareRouteExtras(pathname));
  }, [pathname]);

  return (
    <motion.main
      initial={laptop ? false : { opacity: 0, y: 12 }}
      // Quicker exit than enter so, in AnimatePresence mode="wait", the next page
      // arrives sooner (less dead gap) while still entering smoothly. Small y +
      // consistent easing keep it feeling continuous rather than jumpy.
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={
        laptop
          ? { opacity: 1, transition: { duration: 0 } }
          : {
              opacity: 0,
              y: -8,
              transition: { duration: 0.24, ease: [0.4, 0, 1, 1] },
            }
      }
    >
      {children}
    </motion.main>
  );
}
