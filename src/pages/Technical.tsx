import { PageTransition } from "@/components/shared/PageTransition";
import { TechnicalHero } from "@/components/technical/TechnicalHero";
import { TechStackScene } from "@/components/technical/TechStackScene";
import { ProjectFolder } from "@/components/technical/ProjectFolder";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { projects } from "@/data/projects";
import { media } from "@/data/media";
import { registerRouteAssets } from "@/lib/assets";

// Background portrait behind the stack scene, plus each project's pipeline
// image (shown inside the opened folder).
registerRouteAssets("/technical", {
  images: [media.technicalBg],
  extras: projects.flatMap((p) => (p.pipelineImage ? [p.pipelineImage] : [])),
});

export default function Technical() {
  return (
    <PageTransition>
      <TechnicalHero />

      {/* One persistent background portrait behind the whole Technical scene;
          the opening title, tech chips and project folders scroll above it. */}
      <TechStackScene>
        <section className="mx-auto max-w-4xl px-6 pb-32 pt-8">
          <SectionHeading
            eyebrow="Selected work"
            title="Open a project."
            className="mb-16"
          />
          <div className="space-y-10">
            {projects.map((p, i) => (
              <ProjectFolder key={p.id} project={p} index={i} />
            ))}
          </div>

          <p className="mt-16 text-center font-mono text-xs text-muted/60">
            Open a folder, then a file. GitHub links open the exact repositories.
          </p>
        </section>
      </TechStackScene>
    </PageTransition>
  );
}
