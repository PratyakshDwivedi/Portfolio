import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Plus, Minus, Terminal, Cpu } from "lucide-react";
import type { Project } from "@/data/projects";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A project as an interactive case study. Cursor-follow spotlight, animated
 * border, stack badges, and inline expand/collapse (no route change). The
 * GitHub button opens the EXACT supplied URL in a new tab.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const reduced = usePrefersReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      ref={cardRef}
      onMouseMove={onMove}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface/60"
    >
      {/* cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, ${project.accent}12, transparent 45%)`,
        }}
      />
      {/* top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
        }}
      />

      <div className="relative p-7 sm:p-9">
        {/* header row */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-4xl font-bold"
              style={{ color: `${project.accent}` }}
            >
              {project.index}
            </span>
            <Cpu className="h-5 w-5 text-muted/60" />
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.shortTitle} on GitHub`}
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-medium text-content/80 transition hover:border-muted/50 hover:text-content"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>

        {/* title */}
        <h3 className="text-display mb-5 max-w-2xl text-2xl leading-tight sm:text-3xl">
          {project.title}
        </h3>

        {/* stack badges */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-line bg-content/5 px-2.5 py-1 font-mono text-[0.7rem] text-muted"
            >
              {s}
            </span>
          ))}
        </div>

        {/* first paragraph always visible */}
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {project.description[0]}
        </p>

        {/* expand toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-6 flex items-center gap-2 text-sm font-medium transition-colors hover:text-content"
          style={{ color: project.accent }}
        >
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {open ? "Close case study" : "Read the case study"}
        </button>

        {/* expandable body */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-[1.4fr_1fr]">
                <div className="space-y-4">
                  {project.description.slice(1).map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>

                {/* terminal-style achievements */}
                <div className="rounded-xl border border-line bg-page/60 p-4">
                  <div className="mb-3 flex items-center gap-2 text-muted/80">
                    <Terminal className="h-3.5 w-3.5" />
                    <span className="font-mono text-[0.65rem] tracking-wide">
                      key achievements
                    </span>
                  </div>
                  <ul className="space-y-2.5 font-mono text-[0.75rem]">
                    {project.achievements.map((a) => (
                      <li key={a} className="flex gap-2 text-muted">
                        <span style={{ color: project.accent }}>▹</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
