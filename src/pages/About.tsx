import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { AboutHero } from "@/components/about/AboutHero";
import { EducationTimeline } from "@/components/about/EducationTimeline";
import { FoundersTimeline } from "@/components/about/FoundersTimeline";
import { MusicalJourney } from "@/components/about/MusicalJourney";
import { CinematicVideo } from "@/components/shared/CinematicVideo";
import { media } from "@/data/media";

export default function About() {
  // The background video provides atmosphere for the pre-tabla experience
  // (hero → education → founders). It's a sticky layer that scrolls away and
  // fades out right as the Musical/Tabla section (with its own treatment) begins.
  const preRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: preRef,
    offset: ["start start", "end end"],
  });
  const videoOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0]);

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
              volumeSignal={videoOpacity}
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
          <FoundersTimeline />
        </div>
      </div>

      {/* Musical/Tabla section keeps its own opaque world + tabla media */}
      <MusicalJourney />
    </PageTransition>
  );
}
