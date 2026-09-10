import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { ConnectHero } from "@/components/connect/ConnectHero";
import { SocialLinks } from "@/components/connect/SocialLinks";
import { ResumeCTA } from "@/components/connect/ResumeCTA";
import { socialLinks } from "@/data/socialLinks";

export default function Connect() {
  return (
    <PageTransition>
      <ConnectHero />

      {/* big statement */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-display text-balance text-4xl leading-tight sm:text-6xl"
        >
          Building something, hiring, or just want to talk{" "}
          <span className="text-accent">systems, startups or taal</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-lg text-muted"
        >
          I'm always up for a good conversation. Reach out through any of these.
        </motion.p>
      </section>

      {/* links */}
      <section className="px-6 pb-16">
        <SocialLinks />
      </section>

      {/* resume + email */}
      <section className="flex flex-col items-center gap-6 px-6 pb-40">
        <ResumeCTA />
        <a
          href={`mailto:${socialLinks.email}`}
          className="text-sm text-muted/80 underline-offset-4 transition hover:text-content hover:underline"
        >
          {socialLinks.email}
        </a>
      </section>

      <footer className="border-t border-line px-6 py-10 text-center">
        <p className="font-mono text-[0.7rem] tracking-[0.08em] text-muted/60">
          Pratyaksh Dwivedi · Engineer · Leader · Tabla · {new Date().getFullYear()}
        </p>
      </footer>
    </PageTransition>
  );
}
