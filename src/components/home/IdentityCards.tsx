import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { prefetchRoute } from "@/App";
import { media } from "@/data/media";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface Identity {
  to: string;
  label: string;
  hook: string;
  back: string;
  iconText?: string;
  iconImg?: string;
  bg: string;
}

const identities: Identity[] = [
  {
    to: "/technical",
    label: "Technical",
    hook: "Where systems meet scale.",
    back: "AST-based ML middleware, cloud-native distributed systems and sentiment-driven ML.",
    iconText: "C++",
    bg: media.technicalBg,
  },
  {
    to: "/founders",
    label: "Leadership",
    hook: "Building communities that ship ideas.",
    back: "From Vice President to Advisor at Founders Club, SRMIST.",
    iconImg: media.fcLogo,
    bg: "/assets/images/events/foundathon-3/thumbnail.jpg",
  },
  {
    to: "/about",
    label: "Music",
    hook: "Logic by day, rhythm by heart.",
    back: "A trained classical tabla player. Discipline you can hear.",
    iconImg: media.tablaCard,
    bg: media.tablaPhoto,
  },
];

/** Small card badge: C++ text for Technical, image for Leadership/Music. */
function CardIcon({ id }: { id: Identity }) {
  if (id.iconImg) {
    return (
      <img
        src={id.iconImg}
        alt=""
        aria-hidden
        className="h-12 w-12 rounded-xl border border-line object-cover"
      />
    );
  }
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-page/60 font-mono text-base font-bold text-accent">
      {id.iconText}
    </span>
  );
}

/**
 * Three identity cards. Hovering/focusing one flips it and highlights it while
 * the siblings de-emphasize (dim + slight blur + scale down). Inspired by the
 * Uiverse flip + "focus one, fade the rest" patterns, adapted to the site
 * theme. Fully keyboard accessible; flip is disabled under reduced motion.
 */
export function IdentityCards() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className="grid gap-5 md:grid-cols-3"
      onMouseLeave={() => setActiveIdx(null)}
    >
      {identities.map((id, i) => {
        const isActive = activeIdx === i;
        const dimmed = activeIdx !== null && !isActive;
        const flipped = isActive && !reduced;

        return (
          <Link
            key={id.to}
            to={id.to}
            aria-label={`${id.label}: ${id.hook}`}
            onMouseEnter={() => {
              setActiveIdx(i);
              prefetchRoute[id.to]?.();
            }}
            onFocus={() => {
              setActiveIdx(i);
              prefetchRoute[id.to]?.();
            }}
            onBlur={() => setActiveIdx(null)}
            className={cn(
              "group relative block h-64 rounded-2xl outline-none transition-all duration-500 [perspective:1200px]",
              dimmed ? "scale-[0.97] opacity-50 blur-[1.5px]" : "scale-100 opacity-100 blur-0",
            )}
          >
            <div
              className="relative h-full w-full transition-transform duration-[600ms] [transform-style:preserve-3d]"
              style={flipped ? { transform: "rotateY(180deg)" } : undefined}
            >
              {/* FRONT */}
              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-8 [backface-visibility:hidden]">
                {/* subtle themed photo background + readability overlay */}
                <div className="pointer-events-none absolute inset-0 z-0">
                  <img
                    src={id.bg}
                    alt=""
                    aria-hidden
                    className="h-full w-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-page via-page/70 to-page/35" />
                </div>
                <div className="relative z-10 flex items-start justify-between">
                  <CardIcon id={id} />
                  <ArrowUpRight className="h-5 w-5 text-muted/50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
                </div>
                <div className="relative z-10">
                  <p className="eyebrow mb-2">{id.label}</p>
                  <h3 className="text-display text-3xl leading-tight text-content">
                    {id.hook}
                  </h3>
                </div>
              </div>

              {/* BACK */}
              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-accent/40 bg-surface p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="flex items-start justify-between">
                  <CardIcon id={id} />
                  <p className="eyebrow text-accent">{id.label}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted">{id.back}</p>
                <span className="flex items-center gap-1.5 text-sm font-medium text-accent">
                  Explore <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
