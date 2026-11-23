"use client";

import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { highlightClasses, useHighlight } from "@/components/tools/ToolSelection";
import { badge, cardBase, chip } from "@/components/ui/styles";
import type { CaseStudy } from "@/data/content";
import { cn } from "@/lib/cn";
import { href, known, toolLabel } from "@/lib/portfolio";

const MAX_CHIPS = 6;

export function CaseStudyCard({ study, pickLabel }: { study: CaseStudy; pickLabel: string | null }) {
  const { state, selected } = useHighlight(study.toolIds);
  const team = known(study.teamLabel);
  const demo = href(study.links.demo);
  const extra = study.stack.length - MAX_CHIPS;

  return (
    <article
      data-highlighted={state === "match"}
      style={{ viewTransitionName: `case-${study.slug}` }}
      className={cn(
        cardBase,
        highlightClasses[state],
        "group flex flex-col p-6 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary sm:p-7",
      )}
    >
      <div className="flex min-h-7 flex-wrap items-center gap-2">
        {pickLabel && (
          <span className="rounded-pill bg-secondary px-3 py-1 text-xs font-semibold text-canvas">{pickLabel}</span>
        )}
        {state === "match" && selected && (
          <span className="rounded-pill bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
            Uses {toolLabel(selected)}
          </span>
        )}
        {team && <span className="text-sm text-ink-muted">{team}</span>}
      </div>

      <h3 className="mt-3 text-2xl text-ink">
        {/* Stretched link: the whole card is clickable, but there's one link for screen readers. */}
        <Link
          href={`/projects/${study.slug}`}
          className="transition-colors after:absolute after:inset-0 after:rounded-card group-hover:text-primary focus-visible:outline-none"
        >
          {study.title}
        </Link>
      </h3>
      <p className="mt-2 text-ink-muted">{study.summary}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Highlights">
        {study.badges.map((b) => (
          <li key={b} className={badge}>
            {b}
          </li>
        ))}
      </ul>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tech stack">
        {study.stack.slice(0, MAX_CHIPS).map((t) => (
          <li key={t} className={chip}>
            {t}
          </li>
        ))}
        {extra > 0 && <li className="px-1 py-1 text-xs font-medium text-ink-muted">+{extra} more</li>}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 text-sm font-semibold">
        <span className="inline-flex items-center gap-1.5 text-primary" aria-hidden="true">
          Read case study
          <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
        </span>
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1 text-ink-muted transition-colors hover:text-primary"
          >
            Live demo
            <ArrowUpRightIcon width={16} height={16} />
            <span className="sr-only">for {study.title} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
