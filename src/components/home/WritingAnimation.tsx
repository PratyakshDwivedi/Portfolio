import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Single <path> with two subpaths (P then D). getPointAtLength walks them
// continuously; the tiny jump between letters reads like lifting the pen.
const PD_PATH =
  "M120 200 L120 50 C 190 40 205 118 120 118 M300 50 L300 200 C 395 195 395 55 300 50";

interface WritingAnimationProps {
  /** Fires once the stroke finishes drawing. */
  onDone?: () => void;
}

/**
 * Auto-playing "finger writing" of the initials **PD**.
 * Starts immediately on mount, no tap/click/hold required.
 * A glowing nib traces the letterforms as the ink is revealed.
 */
export function WritingAnimation({ onDone }: WritingAnimationProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const [nib, setNib] = useState({ x: 120, y: 200, show: false });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const measure = measureRef.current;
    const path = pathRef.current;
    if (!measure || !path) return;

    const total = measure.getTotalLength();
    setLen(total);
    path.style.strokeDasharray = `${total}`;

    if (reduced) {
      path.style.strokeDashoffset = "0";
      onDone?.();
      return;
    }

    path.style.strokeDashoffset = `${total}`;
    setNib({ ...measure.getPointAtLength(0), show: true });

    const duration = 2400;
    const start = performance.now();
    let raf = 0;
    // easeInOutCubic
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const e = ease(p);
      path.style.strokeDashoffset = `${total * (1 - e)}`;
      const pt = measure.getPointAtLength(total * e);
      setNib({ x: pt.x, y: pt.y, show: p < 1 });
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <svg
      viewBox="0 0 500 240"
      className="h-full w-full"
      role="img"
      aria-label="Handwritten initials P D"
    >
      <defs>
        <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDF6E3" />
          <stop offset="100%" stopColor="#FFCC1D" />
        </linearGradient>
      </defs>

      {/* Hidden measurement twin */}
      <path ref={measureRef} d={PD_PATH} fill="none" stroke="none" />

      {/* Faint guide so the letters have presence before ink lands */}
      <path
        d={PD_PATH}
        fill="none"
        stroke="rgba(253,246,227,0.07)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Drawn ink */}
      <path
        ref={pathRef}
        d={PD_PATH}
        fill="none"
        stroke="url(#ink)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pen nib */}
      {nib.show && len > 0 && (
        <circle
          cx={nib.x}
          cy={nib.y}
          r={7}
          fill="#FFCC1D"
        />
      )}
    </svg>
  );
}
