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
  X,
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
  const [hover, setHover] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const tags = project.stack.slice(0, 3);
  const panelText: Record<Exclude<FileKey, "github">, string> = {
    reason: "Content coming soon.",
    impact: "Content coming soon.",
    pipeline: "Pipeline visualization coming soon.",
  };

  const closeAll = () => {
    setOpen(false);
    setFile(null);
    setHover(null);
  };

  // Lock body scroll while the folder view is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape steps back one level: a focused file modal closes first, then the
  // folder itself, so the Technical section is never reset in one jump.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (file) setFile(null);
      else setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, file]);

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

      {/* ---------- OPEN: file view (portal) ---------- */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="folder-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-y-auto bg-page/75 px-6 py-20 backdrop-blur-md"
              onClick={closeAll}
            >
              {/* Back control (left) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeAll();
                }}
                className="fixed left-5 top-6 z-10 flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-medium text-content transition hover:border-accent/50 hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to projects
              </button>

              {/* level 1: the popped-out files. Dims + blurs while a file modal
                  is focused so attention stays on the open card. */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative w-full max-w-5xl transition-[filter,opacity,transform] duration-300",
                  file && "pointer-events-none scale-[0.98] opacity-40 blur-sm",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-10 text-center">
                  <p className="eyebrow mb-2">{project.shortTitle}</p>
                  <h3 className="text-display text-3xl text-content sm:text-4xl">
                    Explore the project.
                  </h3>
                  <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted/60">
                    Hover a card, click to open
                  </p>
                </div>

                {/* the four popped-out colorful files */}
                <div
                  className="flex flex-wrap justify-center gap-4 sm:gap-6"
                  onMouseLeave={() => setHover(null)}
                >
                  {FILES.map((f, i) => {
                    const Icon = f.icon;
                    const emphasized = hover === i;
                    const dimmed = hover !== null && hover !== i;
                    // Entrance pop-out (spring from the folder); hover feedback
                    // is CSS on the inner element so it never fights the spring.
                    const anim = {
                      initial: {
                        opacity: 0,
                        y: reduced ? 0 : 110,
                        scale: reduced ? 1 : 0.55,
                        rotate: reduced ? 0 : POSE[i] * 3,
                      },
                      animate: { opacity: 1, y: 0, scale: 1, rotate: reduced ? 0 : POSE[i] },
                      // Gentler spring + a small lead delay and wider stagger, so the
                      // cards visibly emerge from the folder one after another rather
                      // than snapping in all at once.
                      transition: {
                        delay: 0.14 + 0.1 * i,
                        type: "spring" as const,
                        stiffness: 160,
                        damping: 24,
                        mass: 0.9,
                      },
                    };
                    const inner = cn(
                      "relative flex h-[180px] w-[42vw] max-w-[260px] flex-col justify-between rounded-2xl border p-5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.5)] outline-none transition-all duration-300 will-change-transform sm:h-[200px] sm:w-56 sm:p-6",
                      emphasized && "-translate-y-2 scale-[1.05] shadow-[0_30px_70px_rgba(0,0,0,0.6)]",
                      dimmed && "scale-[0.97] opacity-45 blur-[2px]",
                    );
                    const style = {
                      backgroundColor: `${f.color}1f`,
                      borderColor: emphasized ? f.color : `${f.color}66`,
                    };
                    const body = (
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
                          onMouseEnter={() => setHover(i)}
                          onFocus={() => setHover(i)}
                          style={style}
                          className={inner}
                          aria-label={`Open ${project.shortTitle} on GitHub (external)`}
                        >
                          {body}
                          <ArrowUpRight
                            className="absolute right-4 top-4 h-4 w-4"
                            style={{ color: f.color }}
                          />
                        </motion.a>
                      );
                    }
                    return (
                      <motion.button
                        key={f.key}
                        type="button"
                        onClick={() => setFile(f.key as Exclude<FileKey, "github">)}
                        onMouseEnter={() => setHover(i)}
                        onFocus={() => setHover(i)}
                        {...anim}
                        style={style}
                        className={inner}
                      >
                        {body}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* level 2: the selected file as a large focused modal over a
                  blurred/dimmed backdrop. Closing returns to the folder view. */}
              <AnimatePresence>
                {file && (
                  <motion.div
                    key="file-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <div className="absolute inset-0 bg-page/70 backdrop-blur-lg" />
                    <motion.div
                      role="dialog"
                      aria-modal="true"
                      aria-label={FILES.find((f) => f.key === file)?.label}
                      initial={{ opacity: 0, scale: 0.94, y: 24 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 16 }}
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-10 flex h-[86vh] w-[94vw] max-w-5xl flex-col overflow-hidden rounded-2xl border bg-surface shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
                      style={{
                        borderColor: `${FILES.find((f) => f.key === file)?.color}66`,
                      }}
                    >
                      {/* header */}
                      <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-4 sm:px-8">
                        <div>
                          <p
                            className="font-mono text-[0.6rem] uppercase tracking-widest"
                            style={{ color: FILES.find((f) => f.key === file)?.color }}
                          >
                            {project.shortTitle}
                          </p>
                          <h4 className="text-display text-xl leading-tight text-content sm:text-2xl">
                            {FILES.find((f) => f.key === file)?.label}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          aria-label="Close file"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-page/60 text-content transition hover:border-accent/50 hover:text-accent"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* content, maximizing usable space */}
                      <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                        {file === "pipeline" ? (
                          project.pipelineImage ? (
                            <div className="flex h-full items-center justify-center">
                              <img
                                src={project.pipelineImage}
                                alt={`${project.shortTitle} pipeline`}
                                className="mx-auto max-h-full w-auto max-w-full rounded-lg border border-line object-contain"
                              />
                            </div>
                          ) : (
                            <p className="text-base leading-relaxed text-muted">
                              {panelText.pipeline}
                            </p>
                          )
                        ) : (file === "reason" ? project.reason : project.impact)?.length ? (
                          <ul className="mx-auto max-w-2xl space-y-5">
                            {(file === "reason" ? project.reason : project.impact)!.map(
                              (point, k) => (
                                <li
                                  key={k}
                                  className="flex gap-3.5 text-base leading-relaxed text-content/85"
                                >
                                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                  <span>{point}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <p className="text-base leading-relaxed text-muted">
                            {panelText[file]}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
