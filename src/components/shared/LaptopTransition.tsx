import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import {
  LAPTOP,
  introLayout,
  introPose,
  lidFrameStyle,
  lidRimStyle,
  screenStyle,
  LaptopCameraNotch,
  LaptopLidBack,
  LaptopHinge,
  LaptopDeck,
  ScreenPreview,
  DeskEnvironment,
} from "./Laptop";

/* ------------------------------------------------------------------ */
/* context                                                             */
/* ------------------------------------------------------------------ */

type LaptopTransitionContextValue = {
  /** A laptop page transition is running (pages skip their own fade). */
  active: boolean;
  /** The Connect desk laptop must not render (the transition rig shows it). */
  introHidden: boolean;
  /** The Connect desk laptop should appear without its fade-in (hand-off). */
  introInstant: boolean;
  /** Called by each page when it mounts, so the transition knows it's ready. */
  notifyMounted: () => void;
  /** The Connect desk laptop reports whether it is currently showing. */
  setIntroOpen: (open: boolean) => void;
};

const noop = () => {};
const LaptopTransitionContext = createContext<LaptopTransitionContextValue>({
  active: false,
  introHidden: false,
  introInstant: false,
  notifyMounted: noop,
  setIntroOpen: noop,
});

export const useLaptopTransition = () => useContext(LaptopTransitionContext);

/* ------------------------------------------------------------------ */
/* timing                                                              */
/* ------------------------------------------------------------------ */

type Ease = (t: number) => number;

/** Cubic-bezier easing (same curve syntax as CSS). */
function bezier(x1: number, y1: number, x2: number, y2: number): Ease {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dsx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-5) return sy(t);
      const d = dsx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 24; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-5) break;
      if (v < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
}

const IO = bezier(0.65, 0, 0.35, 1); // physical moves: ease in and out
const SETTLE = bezier(0.22, 1, 0.36, 1); // the site's standard settle
const ZOOM = bezier(0.55, 0, 0.2, 1); // approach the camera, land softly

type Params = {
  outer: number; // visual lid width, px
  cx: number; // screen centre, stage px
  cy: number;
  rx: number; // camera tilt, deg
  ry: number; // turn, deg
  lid: number; // lid angle, deg
  backdrop: number;
  env: number; // Connect desk environment
  preview: number; // Connect screen glimpse
};

/** Next animation frame, with a timer fallback so a transition always
 *  completes even if the browser stops delivering frames (e.g. a backgrounded
 *  or occluded window) instead of leaving the page locked mid-transition. */
function onNextFrame(cb: (now: number) => void) {
  let done = false;
  const timer = window.setTimeout(() => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    cb(performance.now());
  }, 50);
  const raf = requestAnimationFrame(() => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    cb(performance.now());
  });
}

/** [param, target, start (0..1), end (0..1), ease]. Tracks for the same param
 *  run one after another; each starts from where the previous one ended. */
type Track = [keyof Params, number, number, number, Ease?];

function runSegment(
  seconds: number,
  tracks: Track[],
  cur: Params,
  apply: (p: Params) => void,
): Promise<void> {
  const byKey = new Map<
    keyof Params,
    { from: number; to: number; t0: number; t1: number; ease: Ease }[]
  >();
  for (const [key, to, t0, t1, ease] of tracks) {
    const list = byKey.get(key) ?? [];
    list.push({ from: 0, to, t0, t1, ease: ease ?? IO });
    byKey.set(key, list);
  }
  for (const [key, list] of byKey) {
    list.sort((a, b) => a.t0 - b.t0);
    let prev = cur[key];
    for (const tr of list) {
      tr.from = prev;
      prev = tr.to;
    }
  }
  return new Promise((resolve) => {
    let start = -1;
    const frame = (now: number) => {
      if (start < 0) start = now;
      const t = Math.min(1, (now - start) / (seconds * 1000));
      for (const [key, list] of byKey) {
        let v = list[0].from;
        for (const tr of list) {
          if (t < tr.t0) break;
          const p = tr.t1 > tr.t0 ? Math.min(1, (t - tr.t0) / (tr.t1 - tr.t0)) : 1;
          v = tr.from + (tr.to - tr.from) * tr.ease(p);
        }
        cur[key] = v;
      }
      apply(cur);
      if (t < 1) onNextFrame(frame);
      else resolve();
    };
    onNextFrame(frame);
  });
}

const nextFrames = (n: number) =>
  new Promise<void>((resolve) => {
    const step = (left: number) =>
      left <= 0 ? resolve() : onNextFrame(() => step(left - 1));
    step(n);
  });

let cachedScrollbar: number | null = null;
function scrollbarWidth() {
  if (cachedScrollbar !== null) return cachedScrollbar;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
  document.body.appendChild(probe);
  cachedScrollbar = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return cachedScrollbar;
}

/** Stop wheel / touch / keyboard scrolling while the page is inside the laptop. */
function blockUserScroll() {
  const prevent = (e: Event) => e.preventDefault();
  const keys = new Set([" ", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End"]);
  const onKey = (e: KeyboardEvent) => {
    if (keys.has(e.key)) e.preventDefault();
  };
  window.addEventListener("wheel", prevent, { passive: false });
  window.addEventListener("touchmove", prevent, { passive: false });
  window.addEventListener("keydown", onKey);
  return () => {
    window.removeEventListener("wheel", prevent);
    window.removeEventListener("touchmove", prevent);
    window.removeEventListener("keydown", onKey);
  };
}

/* ------------------------------------------------------------------ */
/* geometry                                                            */
/* ------------------------------------------------------------------ */

/**
 * The laptop screen is always 16:10 (like the Connect laptop). At full size it
 * is just large enough to cover the page viewport, which sits in it at exactly
 * the position the page occupies in normal flow, so the first and last frames
 * are pixel-identical to the plain page.
 */
type Geom = {
  W: number; // page width in flow
  H: number;
  offX: number; // page viewport offset inside the screen
  offY: number;
  outerFull: number; // lid width when the screen covers the viewport
  em: number;
};

function makeGeom(W: number, H: number): Geom {
  const Ws = Math.max(W, 1.6 * H);
  const Hs = Ws / 1.6;
  const outerFull = Ws / (LAPTOP.screenW / 100);
  return { W, H, offX: (Ws - W) / 2, offY: (Hs - H) / 2, outerFull, em: outerFull / 100 };
}

const fullPose = (g: Geom) => ({
  outer: g.outerFull,
  cx: g.W / 2,
  cy: g.H / 2,
  rx: 0,
  ry: 0,
  lid: 0,
});

/** Contact shadow of the Connect desk scene for the current viewport. */
function deskShadow() {
  const l = introLayout(window.innerWidth, window.innerHeight);
  return { shadowY: l.shadowY, shadowW: l.shadowW };
}

const BACKDROP = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(90% 70% at 50% 42%, rgb(var(--bg-surface)) 0%, rgb(var(--bg-page)) 72%)",
} as const;

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

/**
 * ONE page-transition system for every route change. The live page is the
 * screen of the portfolio's laptop (the same laptop as the Connect desk): on a
 * nav click the page zooms out onto the laptop, the lid closes, the closed
 * laptop turns, the route switches while the screen is hidden, the lid opens
 * on the new page and the laptop comes toward the viewer until the screen is
 * the viewport again (keyboard leaving the frame). Arriving at Connect, the
 * laptop settles onto the desk instead and hands over to the Connect laptop.
 *
 * In the idle state every wrapper here is a plain div, so pages behave
 * exactly as before. Direct loads and back/forward use the pages' own fade.
 */
export function LaptopTransition({
  children,
  preload,
}: {
  children: ReactNode;
  preload: (path: string) => unknown;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  locationRef.current = location;
  const preloadRef = useRef(preload);
  preloadRef.current = preload;

  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const enabled = !isMobile && !reduced;

  const [ui, setUi] = useState({ active: false, introHidden: false, introInstant: false });

  const stageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const geomRef = useRef<Geom | null>(null);
  const busyRef = useRef(false);
  const introOpenRef = useRef(false);
  const mountSeqRef = useRef(0);
  const mountWaitersRef = useRef<Array<() => void>>([]);
  const activationRef = useRef<{
    resolve: () => void;
    scrollY: number;
    docH: number;
    params: Params;
  } | null>(null);
  const finishRef = useRef<{ scrollTop: number; resolve: () => void } | null>(null);

  const notifyMounted = useCallback(() => {
    mountSeqRef.current += 1;
    const waiters = mountWaitersRef.current;
    mountWaitersRef.current = [];
    waiters.forEach((w) => w());
  }, []);

  const setIntroOpen = useCallback((open: boolean) => {
    introOpenRef.current = open;
  }, []);

  const waitForMount = (afterSeq: number, timeoutMs: number) =>
    new Promise<void>((resolve) => {
      if (mountSeqRef.current > afterSeq) return resolve();
      const timer = window.setTimeout(resolve, timeoutMs);
      mountWaitersRef.current.push(() => {
        window.clearTimeout(timer);
        resolve();
      });
    });

  /** Turn the plain wrappers into the laptop (all imperative, no re-renders). */
  const applyLayout = (g: Geom) => {
    const stage = stageRef.current!;
    Object.assign(stage.style, {
      position: "fixed",
      inset: "0",
      zIndex: "30",
      overflow: "hidden",
      perspective: "1500px",
      perspectiveOrigin: `${window.innerWidth / 2}px ${window.innerHeight / 2}px`,
      pointerEvents: "none",
      background: "rgb(var(--bg-page))",
    });
    Object.assign(rigRef.current!.style, {
      position: "absolute",
      left: `${-g.offX - LAPTOP.frame * g.em}px`,
      top: `${-g.offY - LAPTOP.frame * g.em}px`,
      width: "100em",
      fontSize: `${g.em}px`,
      transformOrigin: `50% ${LAPTOP.screenCY}em`,
      transformStyle: "preserve-3d",
    });
    Object.assign(lidRef.current!.style, {
      position: "relative",
      transformOrigin: "bottom center",
      transformStyle: "preserve-3d",
    });
    Object.assign(frameRef.current!.style, lidFrameStyle);
    Object.assign(rimRef.current!.style, lidRimStyle);
    Object.assign(screenRef.current!.style, screenStyle, {
      width: `${LAPTOP.screenW}em`,
      height: `${LAPTOP.screenH}em`,
      background: "rgb(var(--bg-page))",
    });
    Object.assign(viewRef.current!.style, {
      position: "absolute",
      left: `${g.offX}px`,
      top: `${g.offY}px`,
      width: `${g.W}px`,
      height: `${g.H}px`,
      overflow: "hidden",
      background: "rgb(var(--bg-page))",
    });
  };

  const applyFrame = (p: Params) => {
    const g = geomRef.current!;
    const k = p.outer / g.outerFull;
    // uniform 3D scale (depth too), so a smaller laptop is a true scaled copy
    // with the same perspective as the desk laptop, not a flattened one
    rigRef.current!.style.transform = `translate3d(${p.cx - g.W / 2}px, ${
      p.cy - g.H / 2
    }px, 0) scale3d(${k}, ${k}, ${k}) rotateX(${p.rx}deg) rotateY(${p.ry}deg)`;
    lidRef.current!.style.transform = `rotateX(${p.lid}deg)`;
    if (backdropRef.current) backdropRef.current.style.opacity = String(p.backdrop);
    if (envRef.current) envRef.current.style.opacity = String(p.env);
    if (previewRef.current) previewRef.current.style.opacity = String(p.preview);
    // On very wide screens the full-size deck would reach the camera plane;
    // it is below the viewport by then anyway, so just stop drawing it.
    if (deckRef.current) {
      const reach =
        LAPTOP.deckDepth * g.em * k * Math.sin((LAPTOP.deckAngle * Math.PI) / 180);
      deckRef.current.style.visibility = reach > 1350 ? "hidden" : "visible";
    }
  };

  // Activation: before the first paint, lift the page into the laptop at
  // exactly its current on-screen position (window scroll kept by a spacer so
  // scroll-linked effects don't jump).
  useLayoutEffect(() => {
    if (!ui.active) return;
    const act = activationRef.current;
    if (!act) return;
    activationRef.current = null;
    applyLayout(geomRef.current!);
    spacerRef.current!.style.height = `${act.docH}px`;
    viewRef.current!.scrollTop = act.scrollY;
    applyFrame(act.params);
    act.resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.active]);

  // Hand-off: put the page back into normal flow at the same scroll position.
  useLayoutEffect(() => {
    if (ui.active) return;
    const fin = finishRef.current;
    if (!fin) return;
    finishRef.current = null;
    [stageRef, rigRef, lidRef, frameRef, rimRef, screenRef, viewRef].forEach((r) =>
      r.current?.removeAttribute("style"),
    );
    window.scrollTo({ top: fin.scrollTop, left: 0, behavior: "instant" as ScrollBehavior });
    onNextFrame(() => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    });
    fin.resolve();
  }, [ui.active]);

  const run = useCallback(
    async (to: string) => {
      busyRef.current = true;
      const unblock = blockUserScroll();
      let navigated = false;
      try {
        const url = new URL(to, window.location.origin);
        const toPath = url.pathname;
        const fromPath = locationRef.current.pathname;
        // Destination code + first-view assets (normally already warm from the
        // background preparation; the laptop never waits on this to start).
        const destinationReady = Promise.resolve(preloadRef.current(toPath)).catch(() => {});

        const fromIntro = fromPath === "/connect" && introOpenRef.current;
        const toConnect = toPath === "/connect";
        const H = window.innerHeight;
        const g0 = makeGeom(document.documentElement.clientWidth, H);
        geomRef.current = g0;

        // turn direction: leave at r0, arrive at -r0 (arriving at Connect this
        // lands next to the desk laptop's own angle)
        const r0 = fromIntro ? 20 : -20;
        const start: Params = fromIntro
          ? { ...introPose(window.innerWidth, H), backdrop: 1, env: 1, preview: 1 }
          : { ...fullPose(g0), backdrop: 1, env: 0, preview: 0 };
        const openOuter = fromIntro
          ? Math.min(Math.max(start.outer * 1.15, 0.46 * g0.W), 0.6 * g0.W)
          : Math.min(0.46 * g0.W, 0.9 * H);
        const openCy = 0.44 * H;
        // Closed, the camera rises to look down on the folded laptop (negative
        // tilt), so the base projects down from the hinge; place the hinge so
        // the closed laptop sits in the middle of the frame.
        const closedTilt = -38;
        const closedCy = 0.5 * H - 0.593 * openOuter;

        await new Promise<void>((resolve) => {
          activationRef.current = {
            resolve,
            scrollY: window.scrollY,
            docH: document.documentElement.scrollHeight,
            params: start,
          };
          setUi({ active: true, introHidden: true, introInstant: false });
        });
        const cur: Params = { ...start };

        // 1. the current page zooms out onto the laptop, then the lid closes
        const move = fromIntro ? SETTLE : IO;
        await runSegment(
          0.95,
          [
            ["outer", openOuter, 0, 0.5, move],
            ["cx", g0.W / 2, 0, 0.5, move],
            ["cy", openCy, 0, 0.45, move],
            ["rx", 8, 0, 0.45, IO],
            ["ry", r0, 0, 0.5, move],
            ["lid", LAPTOP.lidRest, 0, 0.3, IO],
            ["env", 0, 0, 0.4, SETTLE],
            ["preview", 0, 0.05, 0.4, SETTLE],
            ["lid", LAPTOP.lidClosed, 0.42, 1, IO],
            ["cy", closedCy, 0.45, 1, IO],
            ["rx", closedTilt, 0.45, 1, IO],
          ],
          cur,
          applyFrame,
        );

        // 2. switch the page while the screen is shut: lay the screen out for
        //    the destination width, then change the route
        viewRef.current!.scrollTop = 0;
        geomRef.current = makeGeom(
          window.innerWidth - (toConnect ? 0 : scrollbarWidth()),
          H,
        );
        applyLayout(geomRef.current);
        applyFrame(cur);
        const seq = mountSeqRef.current;
        navigate(to);
        navigated = true;

        // 3. the closed laptop turns while the new page mounts behind the lid;
        //    its images are decoded before the lid opens, so nothing pops in
        await Promise.all([
          runSegment(
            0.5,
            [["ry", -r0, 0, 1, IO], ["rx", closedTilt - 6, 0, 0.6, IO]],
            cur,
            applyFrame,
          ),
          waitForMount(seq, 2500),
          Promise.race([
            destinationReady,
            new Promise<void>((r) => window.setTimeout(r, 900)),
          ]),
        ]);
        spacerRef.current!.style.height = "0px";
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        // Deep links (e.g. /about#sadhana): open the lid already at the target
        // section, so the page never jumps after it appears on the screen.
        if (url.hash) {
          const view = viewRef.current!;
          const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
          if (target && view.contains(target)) {
            let y = 0;
            let el: HTMLElement | null = target;
            while (el && el !== view) {
              y += el.offsetTop;
              el = el.offsetParent as HTMLElement | null;
            }
            if (el === view) view.scrollTop = y;
          }
        }
        await nextFrames(2);

        // 4. the lid opens on the new page and the laptop comes toward the
        //    viewer; the keyboard leaves the frame as the screen fills it
        if (toConnect) {
          const desk = introPose(window.innerWidth, H);
          await runSegment(
            1.3,
            [
              ["lid", LAPTOP.lidRest, 0, 0.45, IO],
              ["rx", desk.rx, 0, 0.45, IO],
              ["cy", openCy, 0, 0.45, IO],
              ["outer", desk.outer, 0.35, 1, SETTLE],
              ["cx", desk.cx, 0.35, 1, SETTLE],
              ["cy", desk.cy, 0.45, 1, SETTLE],
              ["ry", desk.ry, 0.35, 1, SETTLE],
              ["preview", 1, 0.3, 0.75, SETTLE],
              ["env", 1, 0.4, 0.95, SETTLE],
            ],
            cur,
            applyFrame,
          );
        } else {
          const full = fullPose(geomRef.current);
          await runSegment(
            1.2,
            [
              ["lid", LAPTOP.lidRest, 0, 0.45, IO],
              ["rx", 8, 0, 0.45, IO],
              ["cy", openCy, 0, 0.45, IO],
              ["outer", full.outer, 0.4, 1, ZOOM],
              ["cx", full.cx, 0.4, 1, ZOOM],
              ["cy", full.cy, 0.45, 1, ZOOM],
              ["rx", 0, 0.45, 1, ZOOM],
              ["ry", 0, 0.4, 1, ZOOM],
              ["lid", 0, 0.5, 1, ZOOM],
            ],
            cur,
            applyFrame,
          );
        }

        // 5. hand the page back to normal flow (or to the Connect desk laptop)
        const scrollTop = viewRef.current!.scrollTop;
        await new Promise<void>((resolve) => {
          finishRef.current = { scrollTop, resolve };
          setUi({ active: false, introHidden: false, introInstant: toConnect });
        });
      } catch {
        // never leave the site stuck mid-transition
        if (!navigated) navigate(to);
        finishRef.current = { scrollTop: 0, resolve: noop };
        setUi({ active: false, introHidden: false, introInstant: false });
      } finally {
        unblock();
        busyRef.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate],
  );

  // One shared entry point: intercept internal link clicks (nav, cards, CTAs)
  // before React Router handles them, and run the transition instead.
  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      const url = new URL(a.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page
      e.preventDefault();
      if (busyRef.current) return;
      void run(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled, run]);

  const ctx = useMemo(
    () => ({
      active: ui.active,
      introHidden: ui.introHidden,
      introInstant: ui.introInstant,
      notifyMounted,
      setIntroOpen,
    }),
    [ui, notifyMounted, setIntroOpen],
  );

  const { active } = ui;

  return (
    <LaptopTransitionContext.Provider value={ctx}>
      <div ref={stageRef}>
        {active && <div ref={backdropRef} aria-hidden style={BACKDROP} />}
        {active && (
          <div
            ref={envRef}
            aria-hidden
            style={{ position: "absolute", inset: 0, opacity: 0 }}
          >
            <DeskEnvironment {...deskShadow()} />
          </div>
        )}
        <div ref={rigRef}>
          <div ref={lidRef}>
            <div ref={frameRef}>
              {active && <LaptopCameraNotch />}
              <div ref={rimRef}>
                <div ref={screenRef}>
                  <div ref={viewRef}>{children}</div>
                  {active && (
                    <div
                      ref={previewRef}
                      aria-hidden
                      style={{ position: "absolute", inset: 0, opacity: 0 }}
                    >
                      <ScreenPreview />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.10] opacity-40" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {active && <LaptopLidBack />}
          </div>
          {active && <LaptopHinge />}
          {active && (
            <div ref={deckRef} aria-hidden style={{ transformStyle: "preserve-3d" }}>
              <LaptopDeck />
            </div>
          )}
        </div>
      </div>
      {active && <div ref={spacerRef} aria-hidden />}
    </LaptopTransitionContext.Provider>
  );
}
