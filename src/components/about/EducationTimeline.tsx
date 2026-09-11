import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { education } from "@/data/education";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function EducationTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative mx-auto max-w-5xl overflow-x-clip px-6 py-28">
      <SectionHeading eyebrow="Education" title="Where it was built." className="mb-20" />

      <div ref={ref} className="relative pl-8 md:pl-0">
        {/* center rail (desktop) / left rail (mobile) */}
        <div className="absolute left-[7px] top-2 h-full w-px bg-content/10 md:left-1/2 md:-translate-x-1/2" />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-[7px] top-2 h-full w-px origin-top bg-gradient-to-b from-accent/80 via-line to-transparent md:left-1/2 md:-translate-x-1/2"
        />

        <div className="space-y-16 md:space-y-24">
          {education.map((e, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={e.id}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${
                  left ? "" : "md:[&>*:first-child]:col-start-2"
                }`}
              >
                {/* node */}
                <span className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                  <span
                    className={`rounded-full ${
                      i === education.length - 1
                        ? "h-2.5 w-2.5 bg-accent"
                        : "h-2 w-2 border border-line bg-surface"
                    }`}
                  />
                </span>

                <motion.div
                  initial={{ opacity: 0, x: left ? -30 : 30, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`${left ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}
                >
                  <div className="mb-2 flex items-center gap-2 md:justify-start">
                    <span className="font-mono text-3xl font-bold text-muted/35">
                      {e.year}
                    </span>
                    {e.status && (
                      <span className="rounded-full border border-sage/40 bg-sage/10 px-2.5 py-0.5 text-[0.65rem] tracking-wide text-sage">
                        {e.status}
                      </span>
                    )}
                  </div>
                  <div className="mb-1 flex items-center gap-2 text-muted/80 md:justify-start">
                    <GraduationCap className="h-4 w-4" />
                    <span className="eyebrow">{e.level}</span>
                  </div>
                  <h3 className="text-display text-xl leading-tight md:text-2xl">
                    {e.institution}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{e.detail}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
