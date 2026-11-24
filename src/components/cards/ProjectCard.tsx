"use client";

import { GithubIcon, TrendingUpIcon, UsersIcon } from "@/components/icons";
import { highlightClasses, useHighlight } from "@/components/tools/ToolSelection";
import { cardBase, chip } from "@/components/ui/styles";
import { tracks, type Project } from "@/data/content";
import { cn } from "@/lib/cn";
import { repoHref, toolLabel } from "@/lib/portfolio";

const statColumns = ["grid-cols-1", "grid-cols-1", "grid-cols-2", "grid-cols-3"];
/** Fewer than the Featured cards (6), since these cards are narrower. */
const MAX_CHIPS = 4;

/**
 * One project, used by the carousel (All), the grid (a track), and the scrolling row
 * (reduced motion). The bottom of the card has the stat row (only real numbers from
 * content.ts, skipped when a project has none), then the tools, capped like Featured.
 */
export function ProjectCard({ project, showTracks }: { project: Project; showTracks: boolean }) {
  const { state, selected } = useHighlight(project.toolIds);
  const github = repoHref(project.links);
  const stats = (project.stats ?? []).slice(0, 3);
  const extra = project.stack.length - MAX_CHIPS;

  return (
    <article
      data-highlighted={state === "match"}
      className={cn(cardBase, highlightClasses[state], "flex h-full flex-col p-6 sm:p-7")}
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

      <h3 className="text-xl text-ink">{project.title}</h3>
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

      <div className="mt-auto pt-5">
        {stats.length > 0 && (
          <ul
            aria-label="Key numbers"
            className={cn("mb-4 grid gap-3 border-y border-line py-4", statColumns[stats.length])}
          >
            {stats.map((s) => (
              <li key={s.label} className="min-w-0">
                <span className="block font-display text-2xl leading-none font-extrabold text-primary">{s.value}</span>
                <span className="mt-1.5 block text-xs leading-snug text-ink-muted">{s.label}</span>
              </li>
            ))}
          </ul>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.stack.slice(0, MAX_CHIPS).map((t) => (
            <li key={t} className={chip}>
              {t}
            </li>
          ))}
          {extra > 0 && <li className="px-1 py-1 text-xs font-medium text-ink-muted">+{extra} more</li>}
        </ul>

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-primary"
          >
            <GithubIcon width={16} height={16} />
            View code
            <span className="sr-only">for {project.title} on GitHub (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
