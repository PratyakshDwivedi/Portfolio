import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FloatingNavbar } from "./components/navigation/FloatingNavbar";
import { StartupLoader } from "./components/shared/StartupLoader";
import { media } from "./data/media";

// Lazy-load routes so each page's heavy animation code splits into its own chunk.
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Technical = lazy(() => import("./pages/Technical"));
const Founders = lazy(() => import("./pages/Founders"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Connect = lazy(() => import("./pages/Connect"));

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
    </div>
  );
}
