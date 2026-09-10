import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { prefetchRoute } from "@/App";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Me" },
  { to: "/technical", label: "Technical" },
  { to: "/founders", label: "Leadership" },
  { to: "/connect", label: "Connect" },
];

/** Warm up a route's chunk (and About's video) on hover/focus intent. */
const warm = (to: string) => prefetchRoute[to]?.();

export function FloatingNavbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const isFounders = pathname === "/founders";

  // Close mobile menu on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Accent adapts to the Founders theme only on that route; everywhere else
  // it uses the global warm accent token.
  const accent = isFounders ? "#ffcc1d" : "rgb(var(--accent))";
  const activeText = isFounders ? "text-founders-navy-deep" : "text-accent-ink";

  return (
    <>
      {/* Desktop / tablet floating pill, anchored to the right edge */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed right-4 top-5 z-50 hidden md:block lg:right-6"
        aria-label="Primary"
      >
        <div className="glass flex items-center gap-1 rounded-full p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.35)]">
          {links.map((link) => {
            const active = link.to === pathname;
            return (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => warm(link.to)}
                onFocus={() => warm(link.to)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[0.8rem] font-medium transition-colors duration-300",
                  active ? activeText : "text-muted hover:text-content",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: accent }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile trigger */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="glass flex h-11 w-11 items-center justify-center rounded-full text-content"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-page/95 backdrop-blur-xl md:hidden"
          >
            {links.map((link, i) => {
              const active = link.to === pathname;
              return (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={cn(
                      "text-display text-4xl transition-colors",
                      active ? "text-content" : "text-muted",
                    )}
                    style={active ? { color: accent } : undefined}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
