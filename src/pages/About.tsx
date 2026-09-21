import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { AboutHero } from "@/components/about/AboutHero";
import { EducationTimeline } from "@/components/about/EducationTimeline";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MusicalJourney } from "@/components/about/MusicalJourney";
import { FunExperience } from "@/components/about/FunExperience";
import { CinematicVideo } from "@/components/shared/CinematicVideo";
import { media } from "@/data/media";

export default function About() {
  const [funOpen, setFunOpen] = useState(false);
  // The background video provides atmosphere for the pre-tabla experience
  // (hero → education → founders). It's a sticky layer that scrolls away and
  // fades out right as the Musical/Tabla section (with its own treatment) begins.
  const preRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: preRef,
    offset: ["start start", "end end"],
  });
  const videoOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0]);
  // Audio peaks at exactly 55% and fades to silence as the video scrolls away
  // (kept separate from videoOpacity so the visual fade stays full-strength).
  const videoVolume = useTransform(scrollYProgress, [0, 0.82, 1], [0.55, 0.55, 0]);

  // When the Music card deep-links here (/about#sadhana), jump straight to the
  // Sadhana / Tabla section instead of the top of the page. A double rAF lets
  // the lazy-loaded layout settle before we measure the target's position.
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== "#sadhana") return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        document
          .getElementById("sadhana")
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [hash]);

  return (
    <PageTransition>
      <div ref={preRef} className="relative">
        {/* sticky cinematic atmosphere (behind content) */}
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ opacity: videoOpacity }} className="absolute inset-0">
            <CinematicVideo
              src={media.aboutBackgroundVideo}
              poster={media.aboutBackgroundPoster}
              label="about background video"
              overlay={0.72}
              preferSound
              preload="auto"
              volumeSignal={videoVolume}
              objectPosition="center 10%"
            />
            {/* extra readability scrim: darken center + edges for text */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 45%, rgba(8,8,10,0.35) 0%, rgba(8,8,10,0.55) 55%, rgba(8,8,10,0.8) 100%)",
              }}
            />
          </motion.div>
        </div>

        {/* pre-tabla content, pulled up over the sticky video.
            pointer-events-none lets the video's sound/pause controls (which
            live in the sticky layer beneath) stay clickable; interactive
            children re-enable events on themselves. */}
        <div className="pointer-events-none relative z-10 -mt-[100svh]">
          <AboutHero />
          <EducationTimeline />

          {/* Concise leadership note (the full Founders Club timeline and events
              live on the dedicated Leadership page, not duplicated here). */}
          <section className="relative mx-auto max-w-4xl px-6 py-28">
            <SectionHeading
              eyebrow="Founders Club · Leadership"
              title="I led the founders' community."
              className="mb-8"
            />
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              I headed Founders Club as a leader, from Vice President to Advisor,
              organizing and contributing to a range of entrepreneurship events
              and initiatives across hackathons, bootcamps, and ideation and
              pitch platforms.
            </p>
            <Link
              to="/founders"
              className="pointer-events-auto mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition hover:bg-accent-soft"
            >
              Know More About Founders &amp; Leadership
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>

      {/* Hidden "Click for Fun" easter egg. Sits after the About content and
          BEFORE the Tabla / Sadhana section. */}
      <section className="relative mx-auto max-w-4xl px-6 pb-28 text-center">
        <motion.button
          type="button"
          onClick={() => setFunOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 rounded-full bg-accent px-9 py-4 text-base font-semibold text-accent-ink shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition hover:bg-accent-soft"
        >
          Click for Fun
        </motion.button>
      </section>

      {/* Musical/Tabla section keeps its own opaque world + tabla media */}
      <MusicalJourney />

      <FunExperience open={funOpen} onClose={() => setFunOpen(false)} />
    </PageTransition>
  );
}
