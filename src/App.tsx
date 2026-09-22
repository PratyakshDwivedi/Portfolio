import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FloatingNavbar } from "./components/navigation/FloatingNavbar";
import { StartupLoader } from "./components/shared/StartupLoader";
import { LaptopTransition } from "./components/shared/LaptopTransition";
import { media } from "./data/media";

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

// Route prefetch helpers , call on nav hover/focus so the chunk (and, for
// About, the heavy background video) is ready before the user arrives.
let aboutVideoPreloaded = false;
export const prefetchAbout = () => {
  void import("./pages/About");
  if (!aboutVideoPreloaded && typeof document !== "undefined") {
    aboutVideoPreloaded = true;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = media.aboutBackgroundVideo;
    document.head.appendChild(link);
  }
};
export const prefetchRoute: Record<string, () => void> = {
  "/": () => void import("./pages/Home"),
  "/about": prefetchAbout,
  "/technical": () => void import("./pages/Technical"),
  "/founders": () => void import("./pages/Founders"),
  "/testimonials": () => void import("./pages/Testimonials"),
  "/connect": () => void import("./pages/Connect"),
};

/** Start loading a route (chunk + About's video) before the laptop reopens. */
const preloadRoute = (path: string) => {
  prefetchRoute[path]?.();
  return routeImporters[path as keyof typeof routeImporters]?.();
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

  return (
    <div className="grain min-h-screen bg-page text-content">
      <StartupLoader />
      <FloatingNavbar />
      {/* One shared laptop page-transition wraps the existing routes (it is a
          plain wrapper whenever no transition is running). */}
      <LaptopTransition preload={preloadRoute}>
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
