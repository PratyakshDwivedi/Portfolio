import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Lightweight syntax coloring for the identity object (no heavy highlighter dep).
 * Uses CSS token classes (not inline `color:`) so later passes never re-match
 * markup that earlier passes inserted.
 */
function colorize(line: string) {
  const esc = line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="tok-str">$1</span>')
    .replace(/\b(const|true|false)\b/g, '<span class="tok-key">$1</span>')
    .replace(/([A-Za-z_$][\w$]*)(\s*:)/g, '<span class="tok-prop">$1</span>$2');
}

/**
 * Types out the identity object line-by-line, like a developer writing it live.
 * Under reduced-motion it renders fully immediately.
 */
export function CodeReveal({ start }: { start: boolean }) {
  const lines = profile.identityObject.split("\n");
  const [visible, setVisible] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setVisible(lines.length);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= lines.length) clearInterval(id);
    }, 220);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reduced]);

  return (
    <div className="glass mx-auto w-full max-w-md overflow-hidden rounded-xl text-left">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-muted/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted/35" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted/25" />
        <span className="ml-2 font-mono text-[0.65rem] text-muted/60">
          identity.ts
        </span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed">
        <code>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: i < visible ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-pre"
              dangerouslySetInnerHTML={{ __html: colorize(line) || "&nbsp;" }}
            />
          ))}
          {visible < lines.length && !reduced && (
            <span className="inline-block h-4 w-2 animate-pulse bg-accent align-middle" />
          )}
        </code>
      </pre>
    </div>
  );
}
