import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import {
  usePrefersReducedMotion,
  useIsMobile,
  useViewportSize,
} from "@/hooks/useMediaQuery";
import { useLaptopTransition } from "@/components/shared/LaptopTransition";
import {
  LAPTOP,
  introLayout,
  DESK_WALL,
  lidFrameStyle,
  lidRimStyle,
  screenStyle,
  LaptopCameraNotch,
  LaptopLidBack,
  LaptopHinge,
  LaptopDeck,
  ScreenPreview,
  DeskEnvironment,
} from "@/components/shared/Laptop";

/**
 * Initial presentation for the Connect page: the portfolio's silver laptop sits
 * in a custom-built (CSS-only) desk environment. Hovering lifts it subtly.
 * Clicking brings the WHOLE laptop toward the viewer, scaling from the screen's
 * centre so the keyboard scales out of frame while the screen grows to fill the
 * viewport, then hands off to the real Connect section (revealed underneath)
 * and scrolls to its contacts. Reduced-motion enters immediately.
 *
 * The laptop is the shared one (components/shared/Laptop), the same laptop the
 * page-transition system uses; when a navigation lands on Connect it settles
 * onto this desk and this scene takes over without a fade.
 */
export function LaptopIntro({
  open,
  onEnter,
}: {
  open: boolean;
  onEnter: () => void;
}) {
  const { introHidden, introInstant, setIntroOpen } = useLaptopTransition();

  useEffect(() => {
    setIntroOpen(open);
    return () => setIntroOpen(false);
  }, [open, setIntroOpen]);

  // While a page transition shows this laptop itself, don't draw a second one.
  if (introHidden) return null;

  // Portal to <body> so the fixed overlay escapes PageTransition's transformed
  // <main> (a transformed ancestor would otherwise become the containing block
  // for position:fixed, sizing the scene to the page instead of the viewport).
  return createPortal(
    <AnimatePresence>
      {open && <LaptopScene onEnter={onEnter} instant={introInstant} />}
    </AnimatePresence>,
    document.body,
  );
}

function LaptopScene({ onEnter, instant }: { onEnter: () => void; instant: boolean }) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const [entering, setEntering] = useState(false);

  // Size / placement / resting 3/4 pose for this viewport (shared with the page
  // transition so its landing matches exactly). Gentler turn on small screens
  // so the screen stays readable.
  const { w, h } = useViewportSize();
  const layout = introLayout(w, h);
  const restX = layout.rx;
  const restY = layout.ry;

  // How far the whole laptop scales toward the viewer, large enough that the
  // screen grows past the viewport edges while the keyboard scales out of frame.
  const ENTER_SCALE = 3.2;

  const enter = () => {
    if (reduced) {
      onEnter();
      return;
    }
    setEntering(true);
  };

  return (
    <motion.div
      initial={instant ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-6"
      style={{ perspective: 1500, background: DESK_WALL }}
    >
      {/* desk environment (fades as the laptop comes forward) */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ opacity: entering ? 0 : 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <DeskEnvironment shadowY={layout.shadowY} shadowW={layout.shadowW} />
      </motion.div>

      {/* THE LAPTOP. On click the whole laptop scales toward the viewer from the
          screen's centre, so the keyboard scales down out of frame while the
          screen grows to fill the view. onAnimationComplete hands off to the
          real Connect page. */}
      <motion.div
        className="relative"
        style={{
          marginTop: layout.marginTop,
          transformOrigin: `50% ${LAPTOP.screenCY * layout.em}px`,
          transformStyle: "preserve-3d",
        }}
        initial={false}
        animate={{ scale: entering ? ENTER_SCALE : 1 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (entering) onEnter();
        }}
      >
        <button
          type="button"
          onClick={enter}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          aria-label="Enter the Connect page"
          className="group relative block cursor-pointer outline-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Hover detection lives on the (stationary) button above; the lift and
              the flatten-on-enter are applied here on an inner element, so the
              pointer target never moves out from under the cursor (no flicker). */}
          <motion.div
            initial={false}
            animate={
              entering
                ? { rotateX: 0, rotateY: 0, y: 0, scale: 1 }
                : hovered && !reduced
                  ? { rotateX: 6, rotateY: restY - 5, y: -10, scale: 1.015 }
                  : { rotateX: restX, rotateY: restY, y: 0, scale: 1 }
            }
            transition={
              entering
                ? { duration: 1.05, ease: [0.22, 1, 0.36, 1] }
                : { type: "spring", stiffness: 210, damping: 26 }
            }
            style={{
              position: "relative",
              width: "100em",
              fontSize: `${layout.em}px`,
              transformOrigin: `50% ${LAPTOP.screenCY}em`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* LID (slight recline) */}
            <div
              style={{
                position: "relative",
                transformOrigin: "bottom center",
                transform: `rotateX(${LAPTOP.lidRest}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div style={lidFrameStyle}>
                <LaptopCameraNotch />
                <div style={lidRimStyle}>
                  <div style={{ ...screenStyle, width: "100%", aspectRatio: "16 / 10" }}>
                    <ScreenPreview />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.10] opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </div>
              </div>
              <LaptopLidBack />
            </div>
            <LaptopHinge />
            <LaptopDeck />
          </motion.div>
        </button>
      </motion.div>

      {/* clickable hint (fades out as the laptop comes forward) */}
      <motion.div
        initial={instant ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: instant ? 0.15 : 0 }}
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={entering ? { opacity: 0 } : { opacity: [0.55, 1, 0.55] }}
          transition={
            entering
              ? { duration: 0.3 }
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex items-center gap-2 font-mono text-xs tracking-wide text-[#5a6472]"
        >
          <MousePointerClick className="h-4 w-4" />
          {isMobile ? "Tap the laptop to enter" : "Click the laptop to enter"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
