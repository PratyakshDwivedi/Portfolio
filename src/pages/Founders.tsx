import { PageTransition } from "@/components/shared/PageTransition";
import { FoundersHero } from "@/components/founders/FoundersHero";
import { LeadershipIntro } from "@/components/founders/LeadershipIntro";
import { EventCarousel } from "@/components/founders/EventCarousel";
import { InfiniteFounderGallery } from "@/components/founders/InfiniteFounderGallery";
import { Testimonials } from "@/components/founders/Testimonials";

/**
 * Founders page, the ONLY page carrying the navy+yellow Founders Club identity.
 * The `.theme-founders` wrapper scopes that palette so it never leaks globally.
 */
export default function Founders() {
  return (
    <PageTransition>
      <div className="theme-founders relative min-h-screen">
        {/* subtle grid texture in navy */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,204,29,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,204,29,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative">
          <FoundersHero />
          <LeadershipIntro />
          <EventCarousel />
          <InfiniteFounderGallery />
          <Testimonials />
        </div>
      </div>
    </PageTransition>
  );
}
