import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Short label shown on the fallback tile (e.g. "Event photo"). */
  label?: string;
  /** Optional accent color for the placeholder gradient. */
  tint?: string;
}

/**
 * An <img> that degrades gracefully. If the real asset hasn't been
 * dropped in yet, it renders a clean, labeled placeholder tile instead
 * of a broken image, so the layout always looks intentional.
 */
export function SmartImage({ src, alt, className, label, tint = "#FFCC1D" }: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden",
          className,
        )}
        style={{
          background: `radial-gradient(120% 120% at 30% 20%, ${tint}14, transparent 60%), linear-gradient(135deg,#0A1A3F,#050D24)`,
        }}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 12px, transparent 12px 24px)",
          }}
        />
        <ImageIcon className="relative mb-2 h-5 w-5 opacity-40" style={{ color: tint }} />
        <span className="relative font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted/80">
          {label ?? "placeholder"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={cn(
        "transition-opacity duration-700",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
