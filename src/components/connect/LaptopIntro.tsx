import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks/useMediaQuery";

/**
 * A glimpse of the Connect hero shown "on the laptop screen": the real
 * ConnectHero content (oversized back word + name) so the hand-off from the zoom
 * into the actual page reads as continuous. Sized in container-query units so it
 * scales from the small on-desk size up to full-screen.
 */
function ScreenPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-page [container-type:size]">
      <div className="pointer-events-none absolute inset-x-0 top-[8%] text-center text-[22cqw] font-bold leading-none text-content/[0.06]">
        LET'S TALK
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[4cqw] text-center">
        <p className="mb-[1.5cqw] font-mono text-[3cqw] uppercase tracking-[0.3em] text-muted">
          Connect with me
        </p>
        <h2 className="text-display text-[18cqw] leading-[0.85] text-content">
          Pratyaksh
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.05]" />
    </div>
  );
}

/**
 * Initial presentation for the Connect page: the existing silver laptop sits in a
 * custom-built (CSS-only) desk environment, soft daylight wall, a light tabletop
 * with a receding surface, gentle out-of-focus greenery, and a grounding shadow,
 * inspired by (not copied from) the supplied reference. The laptop, its hover,
 * and the click-to-zoom transition are unchanged. Clicking brings the screen
 * forward until it fills the viewport, then `onEnter` reveals the real Connect
 * section and scrolls to its contacts. Reduced-motion enters immediately.
 */
export function LaptopIntro({
  open,
  onEnter,
}: {
  open: boolean;
  onEnter: () => void;
}) {
  // Portal to <body> so the fixed overlay escapes PageTransition's transformed
  // <main> (a transformed ancestor would otherwise become the containing block
  // for position:fixed, sizing the scene to the page instead of the viewport).
  return createPortal(
    <AnimatePresence>
      {open && <LaptopScene onEnter={onEnter} />}
    </AnimatePresence>,
    document.body,
  );
}

function LaptopScene({ onEnter }: { onEnter: () => void }) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const screenRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Resting 3/4 pose (unchanged laptop): turned so the right side recedes, seen
  // slightly from above. Gentler on small screens so the screen stays readable.
  const restX = 8;
  const restY = isMobile ? 14 : 26;

  const enter = () => {
    const el = screenRef.current;
    if (reduced || !el) {
      onEnter();
      return;
    }
    const r = el.getBoundingClientRect();
    setZoom({ top: r.top, left: r.left, width: r.width, height: r.height });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-6"
      style={{
        perspective: 1500,
        // custom "room" wall, soft daylight (our own gradient, not a photo)
        background:
          "radial-gradient(120% 100% at 68% 2%, #f3f5f8 0%, #e7ebf0 50%, #dde2e9 100%)",
      }}
    >
      {/* soft window light from the upper right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[15%] h-[70%] w-[55%] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.75), transparent 70%)" }}
      />
      {/* gentle out-of-focus greenery atmosphere (abstract, not a plant photo) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[6%] top-[2%] h-[42%] w-[26%] rounded-full blur-[46px]"
        style={{ background: "radial-gradient(closest-side, rgba(120,168,104,0.22), transparent 72%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[1%] h-[36%] w-[22%] rounded-full blur-[48px]"
        style={{ background: "radial-gradient(closest-side, rgba(132,176,118,0.18), transparent 72%)" }}
      />

      {/* custom tabletop: a light surface the laptop rests on, with a soft back
          edge (ambient shadow where wall meets desk) for depth. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%]"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #eef1f5 100%)",
          boxShadow:
            "inset 0 2px 3px rgba(120,132,150,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      />

      {/* laptop (fades as the screen zoom takes over) */}
      <motion.div
        animate={{ opacity: zoom ? 0 : 1 }}
        transition={{ duration: 0.45 }}
        className="relative mt-[8vh]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* grounding contact shadow on the tabletop */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[90%] h-14 w-[72vw] max-w-[640px] -translate-x-1/2 rounded-[50%] bg-black/30 blur-2xl"
        />

        <motion.div
          initial={false}
          animate={{ rotateX: restX, rotateY: restY, y: 0, scale: 1 }}
          whileHover={
            reduced ? undefined : { rotateX: 5, rotateY: restY - 6, y: -12, scale: 1.02 }
          }
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <button
            type="button"
            onClick={enter}
            aria-label="Enter the Connect page"
            className="group relative block cursor-pointer outline-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="w-[58vw] max-w-[600px]" style={{ transformStyle: "preserve-3d" }}>
              {/* LID + SCREEN (aluminum bezel, slight recline) */}
              <div
                style={{
                  transformOrigin: "bottom center",
                  transform: "rotateX(-5deg)",
                  transformStyle: "preserve-3d",
                  background: "linear-gradient(155deg,#f4f6f9 0%,#ccd1d9 55%,#b3b9c3 100%)",
                  boxShadow: "0 30px 60px rgba(60,70,90,0.35)",
                }}
                className="relative rounded-[16px] p-[10px]"
              >
                {/* camera notch */}
                <div className="absolute left-1/2 top-[5px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#3a3f47]" />
                {/* black inner rim */}
                <div className="rounded-[9px] bg-[#08080a] p-[7px]">
                  <div
                    ref={screenRef}
                    className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px]"
                  >
                    <ScreenPreview />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.10] opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </div>
              </div>

              {/* HINGE */}
              <div
                className="mx-auto h-[4px] w-[86%] rounded-b-[3px]"
                style={{ background: "linear-gradient(180deg,#aeb4be,#8f96a2)" }}
              />

              {/* KEYBOARD DECK (folded flat toward the viewer) */}
              <div
                style={{
                  transformOrigin: "top center",
                  transform: "rotateX(74deg)",
                  background: "linear-gradient(180deg,#eceff3 0%,#d3d8df 55%,#c0c6d0 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                }}
                className="relative mx-auto h-[15vh] max-h-[150px] w-[99%] rounded-b-[10px]"
              >
                <div
                  className="absolute inset-x-[6%] top-[10%] h-[52%] rounded-[4px]"
                  style={{
                    background: "#c6ccd4",
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 6.5%), repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 25%)",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
                  }}
                />
                <div
                  className="absolute bottom-[10%] left-1/2 h-[28%] w-[34%] -translate-x-1/2 rounded-[5px]"
                  style={{
                    background: "linear-gradient(180deg,#e2e6eb,#d1d6dd)",
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                />
                <div className="absolute -top-[1px] left-1/2 h-[3px] w-[16%] -translate-x-1/2 rounded-b-[4px] bg-[#b7bdc7]" />
              </div>
            </div>
          </button>
        </motion.div>

        {/* clickable hint */}
        <motion.div
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-[10vh] flex items-center justify-center gap-2 font-mono text-xs tracking-wide text-[#5a6472]"
        >
          <MousePointerClick className="h-4 w-4" />
          {isMobile ? "Tap the laptop to enter" : "Click the laptop to enter"}
        </motion.div>
      </motion.div>

      {/* cinematic zoom (unchanged): the screen lifts off the desk, straightens
          out of its angle and grows to fill the viewport, then hands off to the
          real Connect page via onEnter. */}
      {zoom && (
        <motion.div
          initial={{
            top: zoom.top,
            left: zoom.left,
            width: zoom.width,
            height: zoom.height,
            borderRadius: 4,
            rotateX: restX,
            rotateY: restY,
          }}
          animate={{
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            borderRadius: 0,
            rotateX: 0,
            rotateY: 0,
          }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={onEnter}
          style={{
            position: "fixed",
            zIndex: 70,
            overflow: "hidden",
            transformPerspective: 1500,
          }}
        >
          <ScreenPreview />
        </motion.div>
      )}
    </motion.div>
  );
}
