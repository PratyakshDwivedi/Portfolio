import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Lightbulb,
  Rocket,
  Workflow,
  ArrowUpRight,
  ArrowLeft,
  FolderClosed,
  FolderOpen,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type FileKey = "reason" | "impact" | "pipeline" | "github";

// Four colorful files, each a distinct accent that still sits in the warm-dark
// system (used at low opacity, not neon).
const FILES: {
  key: FileKey;
  label: string;
  icon: typeof Lightbulb;
  color: string;
  blurb: string;
}[] = [
  { key: "reason", label: "Reason & Motivation", icon: Lightbulb, color: "#E5734E", blurb: "Why I built it" },
  { key: "impact", label: "Impact & Advantage", icon: Rocket, color: "#FFCC1D", blurb: "Why it matters" },
  { key: "pipeline", label: "Pipeline View", icon: Workflow, color: "#4FA9C4", blurb: "How it works" },
  { key: "github", label: "GitHub", icon: Github, color: "#9B7BD8", blurb: "See the code" },
];

// Resting fan poses (subtle rotation for the spread look); cards animate out
// from the folder and settle here.
const POSE = [-3, -1, 1, 3];

/**
 * A technical project as a folder. Hovering previews the files (folder lifts, a
 * hint of colored file edges peeks out). Clicking opens a full-screen file view:
 * four colorful cards pop out over a blurred, dimmed backdrop, with a Back
 * control on the left. Reason/Impact/Pipeline open placeholder panels; GitHub
 * opens the exact repository. In-place state, no route change.
 */
export function ProjectFolder({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<Exclude<FileKey, "github"> | null>(null);
  const reduced = usePrefersReducedMotion();

  const tags = project.stack.slice(0, 3);
  const panelText: Record<Exclude<FileKey, "github">, string> = {
    reason: "Content coming soon.",
    impact: "Content coming soon.",
    pipeline: "Pipeline visualization coming soon.",
  };

  // Lock scroll + Escape-to-close while the file view is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* ---------- CLOSED FOLDER (in the list) ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="group relative"
      >
        {/* peek: colored file edges hint at the contents on hover */}
        <div className="pointer-events-none absolute inset-x-12 top-0 z-0 flex justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-y-4 group-hover:opacity-100">
          {FILES.map((f) => (
            <span
              key={f.key}
              className="h-3 w-12 rounded-t-md"
              style={{ backgroundColor: f.color }}
            />
          ))}
        </div>

        {/* folder tab */}
        <div className="absolute -top-3 left-7 z-10 h-4 w-28 rounded-t-lg border border-b-0 border-line bg-surface" />

        {/* folder face (lifts slightly on hover to preview) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open ${project.shortTitle} project folder`}
          className="relative z-10 flex w-full items-start justify-between gap-6 rounded-2xl rounded-tl-none border border-line bg-surface/70 p-7 text-left transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-accent/40 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-8"
        >
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-3xl font-bold text-accent">
                {project.index}
              </span>
              <FolderClosed className="h-5 w-5 text-muted/70 transition-colors group-hover:hidden" />
              <FolderOpen className="hidden h-5 w-5 text-accent group-hover:block" />
            </div>
            <h3 className="text-display text-2xl leading-tight text-content sm:text-3xl">
              {project.shortTitle}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              {project.gist}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-line bg-content/5 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wide text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-widest text-muted/70">
            Open
          </span>
        </button>
      </motion.div>

      {/* ---------- OPEN: full-screen file view (portal) ---------- */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-y-auto bg-page/75 px-6 py-20 backdrop-blur-md"
              onClick={() => {
                setOpen(false);
                setFile(null);
              }}
            >
              {/* Back control (left) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  setFile(null);
                }}
                className="fixed left-5 top-6 z-10 flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-medium text-content transition hover:border-accent/50 hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to projects
              </button>

              {/* content (clicks inside do not close) */}
              <div
                className="relative w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-10 text-center">
                  <p className="eyebrow mb-2">{project.shortTitle}</p>
                  <h3 className="text-display text-3xl text-content sm:text-4xl">
                    Explore the project.
                  </h3>
                </div>

                {/* the four popped-out colorful files */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {FILES.map((f, i) => {
                    const Icon = f.icon;
                    const common =
                      "relative flex w-[42vw] max-w-[260px] flex-col justify-between rounded-2xl border p-5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:-translate-y-1.5 sm:w-56 sm:p-6";
                    const style = {
                      backgroundColor: `${f.color}1f`,
                      borderColor: `${f.color}66`,
                    };
                    const anim = {
                      initial: {
                        opacity: 0,
                        y: reduced ? 0 : 90,
                        scale: reduced ? 1 : 0.6,
                        rotate: reduced ? 0 : POSE[i] * 3,
                      },
                      animate: { opacity: 1, y: 0, scale: 1, rotate: reduced ? 0 : POSE[i] },
                      transition: { delay: 0.05 * i, type: "spring" as const, stiffness: 230, damping: 20 },
                    };
                    const inner = (
                      <>
                        <div
                          className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${f.color}2e` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: f.color }} />
                        </div>
                        <div>
                          <p
                            className="font-mono text-[0.6rem] uppercase tracking-widest"
                            style={{ color: f.color }}
                          >
                            {f.blurb}
                          </p>
                          <p className="text-display mt-1 text-lg leading-tight text-content">
                            {f.label}
                          </p>
                        </div>
                      </>
                    );

                    if (f.key === "github") {
                      return (
                        <motion.a
                          key={f.key}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...anim}
                          style={style}
                          className={cn(common, "h-[180px] sm:h-[200px]")}
                          aria-label={`Open ${project.shortTitle} on GitHub (external)`}
                        >
                          {inner}
                          <ArrowUpRight
                            className="absolute right-4 top-4 h-4 w-4"
                            style={{ color: f.color }}
                          />
                        </motion.a>
                      );
                    }
                    const active = file === f.key;
                    return (
                      <motion.button
                        key={f.key}
                        type="button"
                        onClick={() => setFile(active ? null : (f.key as Exclude<FileKey, "github">))}
                        aria-expanded={active}
                        {...anim}
                        style={{
                          ...style,
                          ...(active ? { borderColor: f.color } : {}),
                        }}
                        className={cn(common, "h-[180px] sm:h-[200px]")}
                      >
                        {inner}
                      </motion.button>
                    );
                  })}
                </div>

                {/* selected file content */}
                <AnimatePresence initial={false}>
                  {file && (
                    <motion.div
                      key={file}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mx-auto mt-8 max-h-[52vh] max-w-2xl overflow-y-auto rounded-2xl border border-line bg-surface/95 p-6"
                    >
                      <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                        {FILES.find((f) => f.key === file)?.label}
                      </p>
                      {file === "pipeline" ? (
                        project.pipelineImage ? (
                          <img
                            src={project.pipelineImage}
                            alt={`${project.shortTitle} pipeline`}
                            className="w-full rounded-lg border border-line object-contain"
                          />
                        ) : (
                          <p className="text-sm leading-relaxed text-muted">
                            {panelText.pipeline}
                          </p>
                        )
                      ) : (file === "reason" ? project.reason : project.impact)?.length ? (
                        <ul className="space-y-3">
                          {(file === "reason" ? project.reason : project.impact)!.map(
                            (point, k) => (
                              <li
                                key={k}
                                className="flex gap-3 text-sm leading-relaxed text-muted"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                <span>{point}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm leading-relaxed text-muted">
                          {panelText[file]}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
