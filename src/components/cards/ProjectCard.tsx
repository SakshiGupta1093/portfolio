"use client";

import { GithubIcon, TrendingUpIcon, UsersIcon } from "@/components/icons";
import { highlightClasses, useHighlight } from "@/components/tools/ToolSelection";
import { cardBase, chip } from "@/components/ui/styles";
import { tracks, type Project } from "@/data/content";
import { cn } from "@/lib/cn";
import { repoHref, toolLabel } from "@/lib/portfolio";

export function ProjectCard({ project, showTracks }: { project: Project; showTracks: boolean }) {
  const { state, selected } = useHighlight(project.toolIds);
  const github = repoHref(project.links);

  return (
    <article
      data-highlighted={state === "match"}
      className={cn(cardBase, highlightClasses[state], "flex h-full flex-col p-6")}
    >
      {(showTracks || state === "match") && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {state === "match" && selected && (
            <span className="rounded-pill bg-primary px-2.5 py-0.5 text-xs font-semibold text-on-primary">
              Uses {toolLabel(selected)}
            </span>
          )}
          {showTracks &&
            project.tracks.map((t) => (
              <span
                key={t}
                className="rounded-pill border border-line px-2.5 py-0.5 text-xs font-medium text-ink-muted"
              >
                {tracks[t].label}
              </span>
            ))}
        </div>
      )}

      <h3 className="text-lg text-ink">{project.title}</h3>
      {project.context && (
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-secondary">
          <UsersIcon width={15} height={15} />
          {project.context}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.summary}</p>

      {project.highlight && (
        <p className="mt-3 inline-flex items-start gap-2 text-sm font-semibold text-ink">
          <TrendingUpIcon width={16} height={16} className="mt-0.5 shrink-0 text-primary" />
          {project.highlight}
        </p>
      )}

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
        {project.stack.map((t) => (
          <li key={t} className={chip}>
            {t}
          </li>
        ))}
      </ul>

      {github && (
        <div className="mt-auto pt-5">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-primary"
          >
            <GithubIcon width={16} height={16} />
            View code
            <span className="sr-only">for {project.title} on GitHub (opens in a new tab)</span>
          </a>
        </div>
      )}
    </article>
  );
}
