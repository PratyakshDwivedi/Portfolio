import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FloatingNavbar } from "./components/navigation/FloatingNavbar";
import { StartupLoader } from "./components/shared/StartupLoader";
import { LaptopTransition } from "./components/shared/LaptopTransition";
import { prepareRoute, prepareSite } from "./lib/assets";

// Route chunk loaders (shared by lazy() and the laptop transition's preload).
const routeImporters = {
  "/": () => import("./pages/Home"),
  "/about": () => import("./pages/About"),
  "/technical": () => import("./pages/Technical"),
  "/founders": () => import("./pages/Founders"),
  "/testimonials": () => import("./pages/Testimonials"),
  "/connect": () => import("./pages/Connect"),
};

// Lazy-load routes so each page's heavy animation code splits into its own chunk.
const Home = lazy(routeImporters["/"]);
const About = lazy(routeImporters["/about"]);
const Technical = lazy(routeImporters["/technical"]);
const Founders = lazy(routeImporters["/founders"]);
const Testimonials = lazy(routeImporters["/testimonials"]);
const Connect = lazy(routeImporters["/connect"]);

type RoutePath = keyof typeof routeImporters;

/** Load a route's code, then prepare what its first view and first
 *  interactions need (images decoded, audio + video buffering). */
const loadRoute = (path: string) =>
  (routeImporters[path as RoutePath]?.() ?? Promise.resolve())
    .then(() => prepareRoute(path, true))
    .catch(() => {});

// Route prefetch helpers: call on nav hover/focus so the chunk AND the page's
// assets (for About: the background video) are ready before the user arrives.
const warm = (path: string) => () => {
  void loadRoute(path);
};
export const prefetchAbout = warm("/about");
export const prefetchRoute: Record<string, () => void> = {
  "/": warm("/"),
  "/about": prefetchAbout,
  "/technical": warm("/technical"),
  "/founders": warm("/founders"),
  "/testimonials": warm("/testimonials"),
  "/connect": warm("/connect"),
};

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // Prepare the first view, then warm every page's code + assets in the
  // background so navigations and interactions never wait on the network.
  useEffect(() => {
    prepareSite(location.pathname, routeImporters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grain min-h-screen bg-page text-content">
      <StartupLoader />
      <FloatingNavbar />
      {/* One shared laptop page-transition wraps the existing routes (it is a
          plain wrapper whenever no transition is running). */}
      <LaptopTransition preload={loadRoute}>
        <Suspense fallback={<RouteFallback />}>
          {/* Scroll reset is handled per-page in PageTransition (on the incoming
              page's mount, after the outgoing page finishes exiting), so the
              transition never jumps to the top mid-animation. */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/technical" element={<Technical />} />
              <Route path="/founders" element={<Founders />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </LaptopTransition>
    </div>
  );
}
