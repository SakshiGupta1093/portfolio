"use client";

import { ProjectCard } from "@/components/cards/ProjectCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { projects, tracks } from "@/data/content";
import { getProjects } from "@/lib/portfolio";
import { useTrack } from "@/lib/track-store";

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
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((project) => (
          // A stable view-transition-name lets each card glide to its new spot when the filter changes.
          <li key={project.slug} style={{ viewTransitionName: `project-${project.slug}` }}>
            <ProjectCard project={project} showTracks={track === "all"} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
