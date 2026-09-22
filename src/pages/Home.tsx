import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { HomeHero } from "@/components/home/HomeHero";
import { PixelatedCanvas } from "@/components/home/PixelatedCanvas";
import { IdentityCards } from "@/components/home/IdentityCards";
import { media } from "@/data/media";
import { registerRouteAssets } from "@/lib/assets";

// The portrait canvas + identity-card art must be decoded before the user
// scrolls to them / hovers a card (so the flip never reveals a blank card).
registerRouteAssets("/", {
  images: [
    media.pixelated,
    media.technicalBg,
    media.fcLogo,
    media.tablaCard,
    media.tablaPhoto,
    "/assets/images/events/foundathon-3/thumbnail.jpg",
  ],
});

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <PageTransition>
      <HomeHero />

      {/* Who I am, big editorial statement with parallax word */}
      <section ref={ref} className="relative mx-auto max-w-5xl px-6 py-32 md:py-48">
        <motion.p
          style={{ y }}
          className="pointer-events-none absolute -top-4 right-6 text-[22vw] font-bold leading-none text-content/[0.03] md:text-[16rem]"
        >
          PD
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-display relative text-balance text-3xl leading-[1.15] sm:text-4xl md:text-5xl"
        >
          I'm a fourth-year engineer at{" "}
          <span className="text-muted/80">SRM IST, Chennai</span>, building
          software, leading a founders' community, and playing classical tabla.{" "}
          <span className="text-accent">Three disciplines, one way of thinking.</span>
        </motion.p>
      </section>

      {/* Pixelated canvas, interactive portrait */}
      <section className="mx-auto max-w-6xl px-6 pb-32">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="max-w-md text-base leading-relaxed text-muted">
              I like building things that feel considered, in code, in
              community, and in rhythm. Move your cursor across the portrait.
            </p>
            <p className="mt-4 font-mono text-[0.7rem] tracking-[0.08em] text-muted/60">
              hover to interact
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface/60"
          >
            <PixelatedCanvas
              src={media.pixelated}
              className="aspect-[3/2] w-full"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-line" />
          </motion.div>
        </div>
      </section>

      {/* Three identity cards (flip + focus-one, fade-the-rest) */}
      <section className="mx-auto max-w-6xl px-6 pb-32">
        <IdentityCards />
      </section>

      {/* Invitation */}
      <section className="relative mx-auto max-w-4xl px-6 pb-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow mb-6">The full story</p>
          <h2 className="text-display mb-10 text-balance text-4xl sm:text-6xl">
            Explore the portfolio.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/about"
              className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition hover:bg-accent-soft"
            >
              Read my story
            </Link>
            <Link
              to="/connect"
              className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-content transition hover:border-muted/50"
            >
              Connect with me
            </Link>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
