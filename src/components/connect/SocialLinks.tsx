import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { socialLinks, telHref, isPlaceholder } from "@/data/socialLinks";

// Text-based links only (no platform logos). Email sits directly before Phone
// and uses the address already configured in socialLinks.
const items = [
  { key: "linkedin", label: "LinkedIn", handle: "Professional", href: socialLinks.linkedin },
  { key: "github", label: "GitHub", handle: "Code & projects", href: socialLinks.github },
  { key: "instagram", label: "Instagram", handle: "The everyday", href: socialLinks.instagram },
  { key: "email", label: "Email", handle: socialLinks.email, href: `mailto:${socialLinks.email}` },
  { key: "phone", label: "Phone", handle: socialLinks.phone, href: telHref },
] as const;

// mailto: / tel: links open in the same context (no new tab, no external arrow).
const isDirect = (key: string) => key === "phone" || key === "email";

/** Big, tappable social rows, links come from the central config only. */
export function SocialLinks() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const direct = isDirect(item.key);
        const placeholder = !direct && isPlaceholder(item.href);
        return (
          <motion.a
            key={item.key}
            href={placeholder ? undefined : item.href}
            {...(!placeholder && !direct
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            aria-disabled={placeholder}
            className={`group flex items-center justify-between py-6 transition-colors ${
              placeholder ? "cursor-not-allowed opacity-50" : "hover:pl-3"
            } duration-300`}
            onClick={(e) => placeholder && e.preventDefault()}
          >
            <div>
              <span className="text-display block text-2xl sm:text-3xl">
                {item.label}
              </span>
              <span className="text-xs text-muted/80">
                {placeholder ? "Link coming soon, add it in socialLinks.ts" : item.handle}
              </span>
            </div>
            {/* Email intentionally has no icon; other rows keep the external arrow. */}
            {item.key !== "email" && (
              <ArrowUpRight className="h-6 w-6 text-muted/55 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
            )}
          </motion.a>
        );
      })}
    </div>
  );
}
