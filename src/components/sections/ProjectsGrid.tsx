"use client";

import { ProjectCard } from "@/components/cards/ProjectCard";
import { ProjectCarousel, ProjectRow } from "@/components/projects/ProjectCarousel";
import { Section, SectionHeading } from "@/components/ui/Section";
import { projects, tracks } from "@/data/content";
import { getProjects } from "@/lib/portfolio";
import { useTrack } from "@/lib/track-store";

/**
 * More projects.
 *   All:     the 3D carousel (or, for visitors who prefer reduced motion, a plain
 *            sideways-scrolling row; CSS picks one, so there's no flash on load).
 *   A track: the regular card grid, filtered to that track, laid out like Featured work.
 *
 * Switching tracks already runs inside a View Transition (see setTrack). The wrapper's
 * view-transition-name makes the carousel and the grid morph into each other, and each
 * grid card has its own name so cards glide to their new spots between tracks.
 */
export function ProjectsGrid() {
  const track = useTrack();
  const list = getProjects(track);

  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading
        id="projects-title"
        eyebrow="More projects"
        title="Other things I've built"
        description={
          track === "all"
            ? `All ${projects.length} projects across software, ML/AI, and data.`
            : `Showing ${list.length} of ${projects.length} projects tagged ${tracks[track].label}.`
        }
      />
      <div className="mt-8" style={{ viewTransitionName: "more-projects" }}>
        {track === "all" ? (
          <>
            <div className="motion-reduce:hidden">
              <ProjectCarousel projects={list} />
            </div>
            <div className="hidden motion-reduce:block">
              <ProjectRow projects={list} />
            </div>
          </>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {list.map((project) => (
              <li key={project.slug} style={{ viewTransitionName: `project-${project.slug}` }}>
                <ProjectCard project={project} showTracks={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
