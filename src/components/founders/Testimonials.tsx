import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { InfiniteGallery } from "@/components/founders/InfiniteGallery";

/**
 * Testimonials (reworked from the old "Moments in Motion" reel).
 *
 * The React Bits Pro style Infinite Gallery is the PRIMARY visual: a draggable,
 * infinitely scrolling 3D wall of people with depth and parallax. Selecting a
 * face reveals its testimonial in a SECONDARY panel beneath the gallery, so the
 * copy never covers or fights the gallery interaction.
 *
 * Real photos are wired now. Role and testimonial are clean placeholders, ready
 * to fill in from this single array later; each face will map to one person's
 * testimonial via the shared { image, name, role, testimonial } shape.
 */
interface Testimonial {
  image: string;
  name: string;
  role: string;
  testimonial: string;
}

const testimonials: Testimonial[] = [
  { name: "Aarushi", role: "Role coming soon", testimonial: "Testimonial coming soon.", image: "/assets/images/testimonials/aarushi.jpg" },
  { name: "Aryan Singh", role: "Role coming soon", testimonial: "Testimonial coming soon.", image: "/assets/images/testimonials/aryan-singh.jpg" },
  { name: "Ishan", role: "Role coming soon", testimonial: "Testimonial coming soon.", image: "/assets/images/testimonials/ishan.jpg" },
  { name: "Karthikeyan", role: "Role coming soon", testimonial: "Testimonial coming soon.", image: "/assets/images/testimonials/karthikeyan.jpg" },
  { name: "Kushagr", role: "Role coming soon", testimonial: "Testimonial coming soon.", image: "/assets/images/testimonials/kushagr.jpg" },
  { name: "Lehan", role: "Role coming soon", testimonial: "Testimonial coming soon.", image: "/assets/images/testimonials/lehan.jpg" },
  { name: "Pratibimb", role: "Role coming soon", testimonial: "Testimonial coming soon.", image: "/assets/images/testimonials/pratibimb.jpg" },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto mb-10 max-w-6xl px-6 text-center">
        <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-founders-yellow">
          Kind words
        </p>
        <h2 className="text-display text-5xl text-[#fdf6e3] sm:text-7xl">
          Testimonials
        </h2>
        <p className="mx-auto mt-4 max-w-md font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#fdf6e3]/40">
          Drag to explore · tap a face to read
        </p>
      </div>

      {/* PRIMARY: the infinite 3D gallery */}
      <InfiniteGallery
        items={testimonials}
        activeIndex={active}
        onSelect={setActive}
      />

      {/* SECONDARY: the selected person's testimonial */}
      <div className="mx-auto mt-10 max-w-2xl px-6">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-founders-yellow/15 bg-founders-navy/50 px-6 py-8 text-center backdrop-blur-sm sm:px-10"
          >
            <Quote className="mx-auto mb-4 h-7 w-7 text-founders-yellow" />
            <p className="font-serif text-xl leading-relaxed text-[#fdf6e3]/85 sm:text-2xl">
              {t.testimonial}
            </p>
            <footer className="mt-6">
              <p className="text-display text-lg text-[#fdf6e3]">{t.name}</p>
              <p className="font-mono text-[0.7rem] uppercase tracking-widest text-founders-yellow/70">
                {t.role}
              </p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </section>
  );
}
