import { PageTransition } from "@/components/shared/PageTransition";
import { Testimonials } from "@/components/founders/Testimonials";

/**
 * Top-level Testimonials page. The Infinite Gallery testimonial effect (formerly
 * living inside the Leadership page) is reused here verbatim. The `.theme-founders`
 * wrapper supplies the same navy ground + cream text it had before, so the visual
 * effect is preserved exactly. Real photos and quotes are added later in the
 * Testimonials component's data array.
 */
export default function TestimonialsPage() {
  return (
    <PageTransition>
      <div className="theme-founders relative min-h-screen">
        {/* subtle grid texture in navy, matching the Leadership backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,204,29,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,204,29,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative">
          <Testimonials />
        </div>
      </div>
    </PageTransition>
  );
}
