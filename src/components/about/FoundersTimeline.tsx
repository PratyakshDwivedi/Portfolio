import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { foundersJourney } from "@/data/education";
import { SectionHeading } from "@/components/shared/SectionHeading";

/**
 * About-page representation of the Founders Club journey, a horizontal-feel
 * progression rail that reads like a career ladder. (The /founders page keeps
 * its own navy+yellow world; here it stays in the global theme.)
 */
export function FoundersTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 70%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        eyebrow="Founders Club · Journey"
        title="A two-year climb."
        className="mb-16"
      />

      <div ref={ref} className="relative">
        {/* progress rail , shown only in the single-row (lg) layout so dots
            always sit exactly on the connector; on smaller stacked layouts the
            dots read as simple bullets above each role. */}
        <div className="absolute left-0 top-6 hidden h-px w-full bg-line lg:block" />
        <motion.div
          style={{ width: progress }}
          className="absolute left-0 top-6 hidden h-px bg-accent/70 lg:block"
        />

        <div className="grid gap-10 pt-2 sm:grid-cols-2 lg:grid-cols-4 lg:pt-8">
          {foundersJourney.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
            >
              {/* Dot: centred on the rail (top-6) in the lg row; a small bullet
                  just above the role in stacked layouts. */}
              <span className="absolute -top-3 left-0 flex h-4 w-4 items-center justify-center lg:-top-2 lg:-translate-y-1/2">
                <span
                  className={`rounded-full ${
                    i === foundersJourney.length - 1
                      ? "h-2.5 w-2.5 bg-accent"
                      : "h-2 w-2 border border-line bg-surface"
                  }`}
                />
              </span>
              <div
                className={`mb-3 font-mono text-xs ${
                  i === foundersJourney.length - 1 ? "text-accent" : "text-muted"
                }`}
              >
                {r.date}
              </div>
              <h3 className="text-display mb-2 text-xl leading-tight">{r.role}</h3>
              {r.note && (
                <p className="text-sm leading-relaxed text-muted">{r.note}</p>
              )}
              <div className="mt-4 font-mono text-5xl font-bold text-muted/15">
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
