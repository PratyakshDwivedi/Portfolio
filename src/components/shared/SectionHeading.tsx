import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  className?: string;
  align?: "left" | "center";
}

/** Reusable editorial section header with a reveal-on-scroll eyebrow + title. */
export function SectionHeading({
  eyebrow,
  title,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="eyebrow mb-4 flex items-center gap-3"
          style={{ justifyContent: align === "center" ? "center" : "flex-start" }}
        >
          <span className="h-px w-8 bg-content/25" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-display text-balance text-4xl sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h2>
    </div>
  );
}
