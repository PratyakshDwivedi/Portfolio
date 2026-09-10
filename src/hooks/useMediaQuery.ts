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

/** True on phones / small tablets, used to disable expensive effects. */
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");

/** Respects the OS "reduce motion" setting. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
