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
        title="More projects"
        description={
          track === "all" ? (
            <AllViewHint />
          ) : (
            `Showing ${list.length} of ${projects.length} projects tagged ${tracks[track].label}.`
          )
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

/**
 * How to use the carousel, worded for how it actually works on this device: mouse
 * (drag, hover pauses), touch (swipe, the pause button stops it), or reduced motion
 * (a plain scrolling row). CSS picks the sentence, so it's right on first paint.
 * Not every card has numbers or a public repo yet, hence "when available".
 */
function AllViewHint() {
  return (
    <>
      <span className="motion-reduce:hidden">
        <span className="pointer-coarse:hidden">Drag to spin or use the arrows, and hover to pause.</span>
        <span className="hidden pointer-coarse:inline">Swipe to spin or use the arrows, and tap pause to stop it.</span>
      </span>
      <span className="hidden motion-reduce:inline">Scroll sideways to browse.</span> Each card shows what the
      project does and its tools, plus key numbers and a link to the code when available.
    </>
  );
}
