import { useEffect, useState } from "react";

/** Reactive media-query hook (SSR-safe defaults, no layout thrash). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Viewport size, updated at most once per frame on resize / rotation. */
export function useViewportSize() {
  const [size, setSize] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1280,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  }));

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setSize((s) =>
          s.w === window.innerWidth && s.h === window.innerHeight
            ? s
            : { w: window.innerWidth, h: window.innerHeight },
        ),
      );
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}

/** True on phones / small tablets, used to disable expensive effects. */
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");

/** Respects the OS "reduce motion" setting. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
