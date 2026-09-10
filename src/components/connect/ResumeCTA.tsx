import { FileText, ArrowRight } from "lucide-react";
import { socialLinks, isPlaceholder } from "@/data/socialLinks";
import { MagneticButton } from "@/components/shared/MagneticButton";

/**
 * Prominent "View Resume" CTA. Opens the configured Google Drive URL.
 * Swap `resume` in socialLinks.ts to update, no UI change needed.
 */
export function ResumeCTA() {
  const placeholder = isPlaceholder(socialLinks.resume);
  return (
    <div className="flex flex-col items-center gap-3">
      <MagneticButton
        href={placeholder ? undefined : socialLinks.resume}
        external
        ariaLabel="View resume"
        className="bg-accent text-accent-ink hover:bg-accent-soft"
      >
        <FileText className="h-4 w-4" />
        View Resume
        <ArrowRight className="h-4 w-4" />
      </MagneticButton>
      {placeholder && (
        <span className="font-mono text-[0.65rem] text-muted/60">
          Add your Drive link to <code>resume</code> in socialLinks.ts
        </span>
      )}
    </div>
  );
}
