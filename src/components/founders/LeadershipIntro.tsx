import { motion } from "framer-motion";

/**
 * Leadership & Community intro, a short, factual framing of the role and the
 * club, sitting between the hero and the Events carousel.
 */
export function LeadershipIntro() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 py-28">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-founders-yellow"
      >
        Leadership &amp; Community
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-display text-balance text-2xl leading-[1.3] text-[#fdf6e3] sm:text-3xl md:text-4xl"
      >
        I served as{" "}
        <span className="text-founders-yellow">Vice President</span> of the
        Founders Club at SRM Institute of Science and Technology, Kattankulathur
       , the student entrepreneurship body operating under SRM's Directorate of
        Entrepreneurship and Innovation (DEI).
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 max-w-2xl text-base leading-relaxed text-[#fdf6e3]/55"
      >
        The club runs workshops, hackathons, bootcamps and founder talks, and
        maintains a workspace in the BEL Lab. Its mission is to give students the
        resources, mentorship and practical exposure to turn ideas into ventures.
      </motion.p>
    </section>
  );
}
