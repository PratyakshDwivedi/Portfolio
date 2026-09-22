import { useEffect, useState } from "react";

/**
 * Asset readiness. Everything an animation needs is fetched AND decoded before
 * the interaction that shows it, so animations start immediately: no image
 * pop-in, no first-click audio latency, no empty video frames.
 *
 *  - images: fetched + decoded once, then reused. `SmartImage` renders a ready
 *    image straight away (no lazy wait, no fade-in).
 *  - audio / video: one persistent, preloading element per source, reused by
 *    the components that play them (never re-created, never duplicated).
 *  - each page registers what it needs; the whole site warms up in idle time
 *    right after the first view is ready, and a page's heavier extras load as
 *    soon as that page is visited (or its nav link is hovered).
 *
 * Nothing here blocks the site for long: the first view waits only for the
 * window load event and the web fonts (capped), everything else is prepared in
 * the background, and heavy media is skipped on data-saver / 2G connections.
 */

/* ------------------------------------------------------------------ */
/* scheduling                                                          */
/* ------------------------------------------------------------------ */

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

export function whenIdle(cb: () => void) {
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 1500 });
  else window.setTimeout(cb, 120);
}

type NetInfo = { saveData?: boolean; effectiveType?: string };

/** Heavy media (videos, large galleries) is skipped on data-saver / 2G. */
export function canPrefetchHeavy() {
  const c = (navigator as Navigator & { connection?: NetInfo }).connection;
  if (!c) return true;
  if (c.saveData) return false;
  return !/2g$/.test(c.effectiveType ?? "");
}

// A small concurrency-limited queue, so background preloading never floods
// the network (or competes with what the user is looking at right now).
const MAX_PARALLEL = 4;
let running = 0;
const pending: Array<() => void> = [];

function pump() {
  while (running < MAX_PARALLEL && pending.length) {
    running += 1;
    pending.shift()!();
  }
}

function enqueue(job: () => Promise<void>, urgent: boolean) {
  return new Promise<void>((resolve) => {
    const run = () =>
      job()
        .catch(() => {})
        .finally(() => {
          running -= 1;
          resolve();
          pump();
        });
    if (urgent) pending.unshift(run);
    else pending.push(run);
    pump();
  });
}

/* ------------------------------------------------------------------ */
/* images                                                              */
/* ------------------------------------------------------------------ */

const imageJobs = new Map<string, Promise<void>>();
const readyImages = new Set<string>();

/** True once the image is in the browser cache and decoded. */
export const isImageReady = (src: string) => readyImages.has(src);

export function preloadImage(src: string, urgent = false): Promise<void> {
  const existing = imageJobs.get(src);
  if (existing) return existing;
  const job = enqueue(
    () =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        const done = () => {
          readyImages.add(src);
          resolve();
        };
        img.onload = () => {
          if (img.decode) img.decode().then(done, done);
          else done();
        };
        img.onerror = () => resolve(); // missing assets degrade in SmartImage
        img.src = src;
      }),
    urgent,
  );
  imageJobs.set(src, job);
  return job;
}

export const preloadImages = (srcs: readonly string[], urgent = false) =>
  Promise.all(srcs.map((s) => preloadImage(s, urgent))).then(() => {});

/* ------------------------------------------------------------------ */
/* audio / video                                                       */
/* ------------------------------------------------------------------ */

const audios = new Map<string, HTMLAudioElement>();

/** One persistent, fully-buffering audio element per source. */
export function getAudio(src: string): HTMLAudioElement {
  let a = audios.get(src);
  if (!a) {
    a = new Audio();
    a.preload = "auto";
    a.src = src;
    a.load();
    audios.set(src, a);
  }
  return a;
}

const videos = new Map<string, HTMLVideoElement>();

/** One persistent, buffering video element per source. Components may attach
 *  it to the DOM to play it (so the first frame is already there) or just let
 *  it warm the media cache for their own <video>. */
export function getVideo(src: string): HTMLVideoElement {
  let v = videos.get(src);
  if (!v) {
    v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.src = src;
    v.load();
    videos.set(src, v);
  }
  return v;
}

/* ------------------------------------------------------------------ */
/* routes                                                              */
/* ------------------------------------------------------------------ */

type RouteAssets = {
  /** Shown when the page first appears (e.g. a gallery that is the hero). */
  aboveFold?: string[];
  /** Needed by the page's first interactions (cards, hovers, sections). */
  images?: string[];
  audio?: string[];
  /** Media shown when the page first appears (buffered ahead of time). */
  video?: string[];
  /** Heavier extras used later on the page (expanded views, galleries, the
   *  fun video); prepared as soon as the page is visited or its link hovered. */
  extras?: string[];
  extraVideo?: string[];
};

const routes = new Map<string, RouteAssets>();

export function registerRouteAssets(path: string, assets: RouteAssets) {
  routes.set(path, assets);
}

/** Resolves when a route's first-view images are ready (audio / video start
 *  buffering in parallel). Safe to call repeatedly. */
export function prepareRoute(path: string, urgent = false): Promise<void> {
  const r = routes.get(path);
  if (!r) return Promise.resolve();
  r.audio?.forEach(getAudio);
  if (canPrefetchHeavy()) r.video?.forEach(getVideo);
  return preloadImages([...(r.aboveFold ?? []), ...(r.images ?? [])], urgent);
}

/** Heavier, later-used assets of a route (only on decent connections). */
export function prepareRouteExtras(path: string) {
  const r = routes.get(path);
  if (!r || !canPrefetchHeavy()) return;
  r.extraVideo?.forEach(getVideo);
  if (r.extras) void preloadImages(r.extras);
}

/* ------------------------------------------------------------------ */
/* first view + background warm-up                                     */
/* ------------------------------------------------------------------ */

let siteIsReady = false;
let resolveSiteReady: () => void = () => {};
const siteReady = new Promise<void>((r) => {
  resolveSiteReady = r;
});

export const isSiteReady = () => siteIsReady;

/** True once the first view is prepared (fonts, load event, above-the-fold
 *  assets). The startup loader and the Home intro both wait for this. */
export function useSiteReady() {
  const [ready, setReady] = useState(siteIsReady);
  useEffect(() => {
    if (ready) return;
    let alive = true;
    void siteReady.then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [ready]);
  return ready;
}

// The faces the design actually renders (see tailwind.config / index.css).
const FONT_FACES = [
  '400 1em "Space Grotesk"',
  '500 1em "Space Grotesk"',
  '600 1em "Space Grotesk"',
  '700 1em "Space Grotesk"',
  '400 1em "JetBrains Mono"',
  '500 1em "JetBrains Mono"',
  '400 1em "Fraunces"',
];

function fontsReady(): Promise<void> {
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (!fonts) return Promise.resolve();
  return Promise.all(FONT_FACES.map((f) => fonts.load(f).catch(() => [])))
    .then(() => fonts.ready)
    .then(() => {});
}

const windowLoaded = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));

let started = false;

/**
 * Called once at startup. Marks the site ready when the first view is
 * prepared (never later than a few seconds, so the site is never held
 * hostage), then warms every page's code and assets in the background so
 * navigation and interactions never wait on the network.
 */
export function prepareSite(
  currentPath: string,
  importers: Record<string, () => Promise<unknown>>,
) {
  if (started) return;
  started = true;

  const route = (importers[currentPath] ?? (() => Promise.resolve()))()
    .then(() => {
      const r = routes.get(currentPath);
      return preloadImages(r?.aboveFold ?? [], true);
    })
    .catch(() => {});

  const firstView = Promise.all([windowLoaded(), fontsReady(), route]);
  const cap = new Promise<void>((r) => window.setTimeout(r, 4000));

  void Promise.race([firstView, cap]).then(() => {
    siteIsReady = true;
    resolveSiteReady();
    whenIdle(() => void warmSite(currentPath, importers));
  });
}

async function warmSite(
  currentPath: string,
  importers: Record<string, () => Promise<unknown>>,
) {
  // 1. every page's code, so a navigation never waits for a chunk (pages
  //    register their assets as their modules load)
  await Promise.all(Object.values(importers).map((load) => load().catch(() => {})));

  // 2. what each page needs for its first view + first interactions, the
  //    current page first (these also start the tabla audio buffering)
  const paths = [currentPath, ...Object.keys(importers).filter((p) => p !== currentPath)];
  await prepareRoute(currentPath);
  await Promise.all(paths.slice(1).map((p) => prepareRoute(p)));

  // 3. the current page's heavier extras
  whenIdle(() => prepareRouteExtras(currentPath));
}
