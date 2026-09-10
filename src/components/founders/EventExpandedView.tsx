import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { FoundersEvent } from "@/data/foundersEvents";
import { SmartImage } from "@/components/shared/SmartImage";
import { cn } from "@/lib/utils";

/**
 * Cinematic inline/modal expansion of an event card. Accessible dialog:
 * Escape closes, focus is trapped to the close button on open, backdrop
 * click closes, body scroll locked. No route change.
 */
export function EventExpandedView({
  event,
  onClose,
}: {
  event: FoundersEvent;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Photo-focus hover applies HERE (the four expanded photos), not on the
  // front carousel thumbnail.
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-founders-navy-deep/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${event.title} details`}
        layoutId={`event-${event.id}`}
        className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-founders-yellow/20 bg-founders-navy"
      >
        {/* cover */}
        <div className="relative h-48 shrink-0 sm:h-60">
          <SmartImage
            src={event.coverImage}
            alt={`${event.title} cover`}
            label={`${event.title} · cover`}
            tint="#ffcc1d"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-founders-navy via-founders-navy/40 to-transparent" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close event"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-founders-navy-deep/70 text-founders-yellow transition hover:bg-founders-yellow hover:text-founders-navy-deep"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-founders-yellow">
                {event.category}
              </span>
              {event.date && (
                <span className="font-mono text-[0.65rem] text-[#fdf6e3]/50">
                  {event.date}
                </span>
              )}
            </div>
            <h3 className="text-display text-3xl text-[#fdf6e3] sm:text-4xl">
              {event.title}
            </h3>
            {event.tagline && (
              <p className="mt-1 font-serif text-sm italic text-founders-yellow/80">
                “{event.tagline}”
              </p>
            )}
          </div>
        </div>

        {/* scrollable body */}
        <div className="no-scrollbar overflow-y-auto p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-founders-yellow/70">
                About the event
              </h4>
              <p className="text-sm leading-relaxed text-[#fdf6e3]/70">
                {event.description}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-founders-yellow/70">
                My contribution
              </h4>
              {Array.isArray(event.contribution) ? (
                <ul className="space-y-2.5">
                  {event.contribution.map((c, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-sm leading-relaxed text-[#fdf6e3]/70"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-founders-yellow" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-[#fdf6e3]/70">
                  {event.contribution}
                </p>
              )}
            </div>
          </div>

          {/* outcomes / results, when supplied */}
          {event.outcomes && (
            <div className="mt-8">
              <h4 className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-founders-yellow/70">
                Outcome
              </h4>
              <p className="text-sm leading-relaxed text-[#fdf6e3]/70">
                {event.outcomes}
              </p>
            </div>
          )}

          {/* photo gallery */}
          <h4 className="mb-3 mt-8 font-mono text-[0.65rem] uppercase tracking-widest text-founders-yellow/70">
            Gallery
          </h4>
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            onMouseLeave={() => setHover(null)}
          >
            {event.photos.map((p, i) => (
              <div
                key={i}
                tabIndex={0}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border border-founders-yellow/10 outline-none transition duration-300 will-change-transform",
                  hover === i && "z-10 scale-[1.06] border-founders-yellow/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
                  hover !== null && hover !== i && "opacity-60 blur-[2px]",
                )}
              >
                <SmartImage
                  src={p}
                  alt={`${event.title} photo ${i + 1}`}
                  label="photo"
                  tint="#ffcc1d"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
