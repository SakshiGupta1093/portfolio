"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { useToolSelection } from "@/components/tools/ToolSelection";
import type { Project } from "@/data/content";
import { cn } from "@/lib/cn";

/*
 * 3D card carousel for the "All" view of More projects.
 *
 * Every card sits in the same grid cell, so the stage is exactly as tall as the
 * tallest card (no fixed heights to clip text), and each card is moved into place
 * with a CSS 3D transform: the center card flat and full size, neighbors smaller,
 * angled toward the center, and faded. It loops, and it only moves when the visitor
 * acts (buttons, arrow keys, swipe, or clicking a side card). Never on a timer.
 *
 * Accessibility (WAI-ARIA carousel pattern): only the center card is exposed to
 * assistive tech and the keyboard; side cards are inert. A polite live region
 * announces the new project after each move.
 */

/**
 * Position of a card by its distance from the center. Index 3 is "parked out of view".
 * Side cards stay opaque (so the card behind never shows through) and are faded by a
 * page-colored veil on top instead, which also works in dark mode.
 */
const SPOTS = [
  { x: 0, z: 0, rotate: 0, scale: 1, slide: "opacity-100", veil: "pointer-events-none opacity-0" },
  { x: 66, z: -150, rotate: 30, scale: 0.86, slide: "opacity-100", veil: "cursor-pointer opacity-45 hover:opacity-20" },
  { x: 116, z: -300, rotate: 40, scale: 0.74, slide: "opacity-100", veil: "cursor-pointer opacity-70 hover:opacity-50" },
  { x: 150, z: -380, rotate: 44, scale: 0.66, slide: "invisible opacity-0", veil: "pointer-events-none opacity-70" },
];

/** Shortest signed distance from the center card, wrapping around the loop. */
function offsetOf(index: number, active: number, count: number): number {
  let d = (index - active) % count;
  if (d < 0) d += count;
  if (d > count / 2) d -= count;
  return d;
}

const pad = (n: number) => String(n).padStart(2, "0");

const navButton =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-pill border border-line bg-surface text-ink shadow-soft transition-colors duration-200 hover:border-primary hover:text-primary";

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const count = projects.length;
  const [active, setActive] = useState(0);
  const stageId = useId();
  const hintId = useId();
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const focusAfterMove = useRef(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const justSwiped = useRef(false);

  // Picking a tool in Tech Stack brings the first project that used it to the center,
  // so the selection bar's "Show me" lands on a card that's actually in view. (React's
  // "adjust state when an input changes" pattern: runs during render, no effect.)
  const { selected } = useToolSelection();
  const [prevSelected, setPrevSelected] = useState(selected);
  if (selected !== prevSelected) {
    setPrevSelected(selected);
    if (selected && !projects[active].toolIds.includes(selected)) {
      const first = projects.findIndex((p) => p.toolIds.includes(selected));
      if (first >= 0) setActive(first);
    }
  }

  const go = (index: number) => setActive(((index % count) + count) % count);

  // Keyboard users who were inside the old center card follow it to the new one,
  // instead of losing focus when that card turns inert.
  useEffect(() => {
    if (!focusAfterMove.current) return;
    focusAfterMove.current = false;
    slides.current[active]?.focus({ preventScroll: true });
  }, [active]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const focused = document.activeElement;
    focusAfterMove.current = slides.current.some((slide) => slide?.contains(focused));
    go(active + (event.key === "ArrowRight" ? 1 : -1));
  }

  // Swipe on touch screens. touch-action: pan-y keeps vertical page scrolling native.
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      justSwiped.current = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  }

  const current = projects[active];

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Projects" aria-describedby={hintId} onKeyDown={onKeyDown}>
      <p id={hintId} className="sr-only">
        One project at a time. Use the previous and next buttons, or the left and right arrow keys, to browse.
      </p>

      <div
        id={stageId}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
        className="grid touch-pan-y overflow-x-clip py-6 [perspective:1400px]"
      >
        {projects.map((project, i) => {
          const d = offsetOf(i, active, count);
          const spot = SPOTS[Math.min(Math.abs(d), SPOTS.length - 1)];
          const side = Math.sign(d);
          const isCenter = d === 0;
          return (
            <div
              key={project.slug}
              ref={(el) => {
                slides.current[i] = el;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${project.title}`}
              aria-hidden={isCenter ? undefined : true}
              tabIndex={isCenter ? -1 : undefined}
              style={{
                transform: `translateX(${side * spot.x}%) translateZ(${spot.z}px) rotateY(${-side * spot.rotate}deg) scale(${spot.scale})`,
                zIndex: 10 - Math.abs(d),
              }}
              className={cn(
                "relative col-start-1 row-start-1 w-[82%] justify-self-center rounded-card transition-[transform,opacity,visibility] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:w-[22rem] lg:w-[25rem]",
                spot.slide,
              )}
            >
              <div inert={!isCenter} className="h-full">
                <ProjectCard project={project} showTracks />
              </div>
              {/* The veil fades side cards and is their click target: clicking one brings it to
                  the center. Mouse and touch only; keyboard and screen reader users have the
                  buttons and arrow keys. Always rendered so the fade animates both ways. */}
              <div
                aria-hidden="true"
                className={cn("absolute inset-0 z-10 rounded-card bg-canvas transition-opacity duration-500", spot.veil)}
                onClick={() => {
                  if (isCenter) return;
                  if (justSwiped.current) {
                    justSwiped.current = false;
                    return;
                  }
                  go(i);
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-3 sm:gap-5">
        <button type="button" onClick={() => go(active - 1)} aria-controls={stageId} aria-label="Previous project" className={navButton}>
          <ArrowLeftIcon width={20} height={20} />
        </button>
        <p aria-hidden="true" className="min-w-0 flex-1 text-center text-sm text-ink-muted sm:max-w-sm sm:flex-none">
          <span className="font-semibold text-ink tabular-nums">
            {pad(active + 1)} / {pad(count)}
          </span>
          <span className="mx-1.5">·</span>
          <span className="font-medium">{current.title}</span>
        </p>
        <button type="button" onClick={() => go(active + 1)} aria-controls={stageId} aria-label="Next project" className={navButton}>
          <ArrowRightIcon width={20} height={20} />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Project {active + 1} of {count}: {current.title}
      </p>
    </div>
  );
}

/**
 * Shown instead of the carousel when the visitor prefers reduced motion: a plain row
 * of cards that scrolls sideways (focusable, so it scrolls with the keyboard too).
 */
export function ProjectRow({ projects }: { projects: Project[] }) {
  return (
    <ul
      tabIndex={0}
      aria-label="Projects (scrolls sideways)"
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
    >
      {projects.map((project) => (
        // Slightly narrower than a third of the row, so the next card peeks in and signals "scroll".
        <li key={project.slug} className="w-[82%] shrink-0 snap-start sm:w-[20rem]">
          <ProjectCard project={project} showTracks />
        </li>
      ))}
    </ul>
  );
}
