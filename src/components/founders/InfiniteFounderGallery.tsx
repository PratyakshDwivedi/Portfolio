import { funGallery } from "@/data/media";
import { SmartImage } from "@/components/shared/SmartImage";

/**
 * "Fun at Founders", a three-row photographic memory wall (custom recreation of
 * the React Bits Pro `infinite-gallery`). Each row glides continuously at its own
 * speed and direction on a slightly tilted plane for depth, loops seamlessly, and
 * pauses on hover.
 *
 * Deliberately NOT a grid: image heights are consistent within a row, but widths
 * follow a repeating editorial rhythm and each row is phase-offset, so items
 * never line up into columns.
 */

// Repeating width rhythm. Indexed modulo the row length (see below) so the
// duplicated half matches the first exactly → the marquee loop is seamless
// for any photo count.
const WIDTHS = [
  "w-56 sm:w-72",
  "w-72 sm:w-96",
  "w-64 sm:w-80",
  "w-52 sm:w-64",
];

interface RowProps {
  images: string[];
  /** Reverse = travels right; default = travels left. */
  reverse?: boolean;
  duration: string;
  heightClass: string;
  /** Phase offset so rows don't align into columns. */
  offset: number;
}

function Row({ images, reverse, duration, heightClass, offset }: RowProps) {
  const doubled = [...images, ...images];
  return (
    <div className="group flex w-max" style={{ marginLeft: offset }}>
      <div
        className={`flex ${
          reverse
            ? "animate-marquee [animation-direction:reverse]"
            : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: duration }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            // mr-4 (not gap) keeps each item's advance uniform, so translating
            // -50% lands exactly on the seam.
            className={`${heightClass} ${WIDTHS[(i % images.length) % WIDTHS.length]} mr-4 shrink-0 overflow-hidden rounded-xl border border-founders-yellow/10`}
          >
            <SmartImage
              src={src}
              alt="Founders Club moment"
              label="fun photo"
              tint="#ffcc1d"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.06]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InfiniteFounderGallery() {
  // Two rows, splitting the full set of Fun photos between them.
  const per = Math.ceil(funGallery.length / 2);
  const rows = [funGallery.slice(0, per), funGallery.slice(per)];

  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto mb-14 max-w-6xl px-6 text-center">
        <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-founders-yellow">
          Behind the scenes
        </p>
        <h2 className="text-display text-5xl text-[#fdf6e3] sm:text-7xl">
          Fun At Founders
        </h2>
      </div>

      <div
        className="mask-fade-x flex flex-col gap-5"
        style={{ perspective: "1200px" }}
      >
        {/* row 1, travels right */}
        <div style={{ transform: "rotateX(6deg)" }}>
          <Row
            images={rows[0]}
            reverse
            duration="80s"
            heightClass="h-44 sm:h-56"
            offset={0}
          />
        </div>

        {/* row 2, travels left, slightly slower */}
        <div style={{ transform: "rotateX(-6deg)" }}>
          <Row
            images={rows[1]}
            duration="95s"
            heightClass="h-44 sm:h-56"
            offset={-140}
          />
        </div>
      </div>
    </section>
  );
}
