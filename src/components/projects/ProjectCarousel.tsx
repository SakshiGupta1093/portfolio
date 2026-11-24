"use client";

import {
  memo,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from "@/components/icons";
import { useToolSelection } from "@/components/tools/ToolSelection";
import type { Project } from "@/data/content";
import { cn } from "@/lib/cn";

/*
 * 3D card carousel for the "All" view of More projects.
 *
 * Every card sits in the same grid cell, so the stage is exactly as tall as the
 * tallest card (no fixed heights to clip text), and each card is moved into place
 * with a CSS 3D transform: the center card flat and full size, neighbors smaller,
 * angled toward the center, and faded. It loops.
 *
 * Movement:
 *   - Auto-rotates one card every few seconds. It pauses while the mouse is over it,
 *     while anything inside has keyboard focus, while the tab is hidden, while it's
 *     mostly scrolled off screen, and while a Tech Stack tool is selected (so the
 *     highlighted project stays in view). The pause button stops it for good.
 *   - Drag (mouse) or swipe (touch): cards follow the pointer, then snap to the
 *     nearest card, carried further by a fast flick. Auto-rotation resumes shortly after.
 *   - Arrow buttons, left/right arrow keys, and clicking a side card.
 *   Visitors who prefer reduced motion never see this component (CSS swaps in
 *   ProjectRow), and it also refuses to auto-rotate for them as a second guard.
 *
 * Accessibility (WAI-ARIA carousel pattern): only the center card is exposed to
 * assistive tech and the keyboard; side cards are inert. The live region announces
 * each new project, except while auto-rotating, so screen readers aren't interrupted
 * every few seconds.
 */

const AUTO_ADVANCE_MS = 4000;
const RESUME_AFTER_DRAG_MS = 2500;
/** Pixels of sideways movement before a press becomes a drag (smaller stays a click). */
const DRAG_START_PX = 6;
/** Dragging this share of a card's width moves one card (matches SPOTS[1].x). */
const STEP = 0.66;
/** How far ahead a flick carries, in milliseconds of its release speed... */
const FLING_MS = 120;
/** ...but never more than this many extra cards, so a quick swipe doesn't fly past several. */
const MAX_FLING = 1;
const MAX_TRAVEL = 3;

/**
 * Where a card sits by its distance from the center (0 = center, 3 = parked out of view).
 * In-between distances (mid-drag) are blended. Side cards stay opaque so the card behind
 * never shows through; a page-colored veil fades them instead, which also works in dark mode.
 */
const SPOTS = [
  { x: 0, z: 0, rotate: 0, scale: 1, veil: 0, veilHover: 0 },
  { x: 66, z: -150, rotate: 30, scale: 0.86, veil: 0.45, veilHover: 0.2 },
  { x: 116, z: -300, rotate: 40, scale: 0.74, veil: 0.7, veilHover: 0.5 },
  { x: 150, z: -380, rotate: 44, scale: 0.66, veil: 0.7, veilHover: 0.7 },
];
const LAST = SPOTS.length - 1;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number, max: number) => Math.max(-max, Math.min(max, n));

function spotAt(distance: number) {
  const d = Math.min(distance, LAST);
  const i = Math.min(Math.floor(d), LAST - 1);
  const t = d - i;
  const [a, b] = [SPOTS[i], SPOTS[i + 1]];
  return {
    x: lerp(a.x, b.x, t),
    z: lerp(a.z, b.z, t),
    rotate: lerp(a.rotate, b.rotate, t),
    scale: lerp(a.scale, b.scale, t),
    veil: lerp(a.veil, b.veil, t),
    veilHover: lerp(a.veilHover, b.veilHover, t),
    // Fully opaque up to 2 cards out, fading to invisible at 3.
    opacity: Math.max(0, Math.min(1, LAST - d)),
  };
}

/** Signed distance around the loop, the shorter way (works for fractions too). */
function wrap(x: number, count: number): number {
  let d = ((x % count) + count) % count;
  if (d > count / 2) d -= count;
  return d;
}

const pad = (n: number) => String(n).padStart(2, "0");

// Browser state the carousel reacts to. The server snapshots mean "don't rotate" until hydrated.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const navButton =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-pill border border-line bg-surface text-ink shadow-soft transition-colors duration-200 hover:border-primary hover:text-primary";
const pauseButton =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-pill border border-line text-ink-muted transition-colors duration-200 hover:border-primary hover:text-primary";

// Cards only re-render when their own props change, not on every drag frame.
const Card = memo(ProjectCard);

interface Gesture {
  pointerId: number;
  startX: number;
  startY: number;
  /** Pixels of drag per card. */
  step: number;
  dragging: boolean;
  samples: { x: number; t: number }[];
}

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const count = projects.length;
  const [active, setActive] = useState(0);
  /** Cards of travel while a drag is in progress (positive = toward the next card); null otherwise. */
  const [drag, setDrag] = useState<number | null>(null);

  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [inView, setInView] = useState(false);
  const [cooling, setCooling] = useState(false);
  const [dragEnds, setDragEnds] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );
  const tabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => false,
  );

  const regionRef = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const focusAfterMove = useRef(false);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);
  const stageId = useId();
  const hintId = useId();

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
  const holdForTool = selected !== null && projects.some((p) => p.toolIds.includes(selected));

  /** What the pause/play button shows: the visitor's choice. */
  const autoplayOn = !userPaused && !reducedMotion;
  /** Whether it's actually moving right now. */
  const rotating =
    autoplayOn && !hovered && !keyboardFocus && drag === null && !cooling && inView && tabVisible && !holdForTool;

  const go = (index: number) => setActive(((index % count) + count) % count);

  // One card every few seconds. Any move (auto or manual) restarts the countdown.
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setActive((a) => (a + 1) % count), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [rotating, active, count]);

  // After a drag, wait a moment before rotating again (restarts on every drag).
  useEffect(() => {
    if (!cooling) return;
    const timer = window.setTimeout(() => setCooling(false), RESUME_AFTER_DRAG_MS);
    return () => window.clearTimeout(timer);
  }, [cooling, dragEnds]);

  // Pause when it's mostly scrolled off screen.
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.35), {
      threshold: [0, 0.35, 0.7],
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard users who were inside the old center card follow it to the new one,
  // instead of losing focus when that card turns inert.
  useEffect(() => {
    if (!focusAfterMove.current) return;
    focusAfterMove.current = false;
    slides.current[active]?.focus({ preventScroll: true });
  }, [active]);

  function toggleAutoplay() {
    if (autoplayOn) {
      setUserPaused(true);
      return;
    }
    // "Play" means play now, even though the pointer or focus is on the button.
    setUserPaused(false);
    setHovered(false);
    setKeyboardFocus(false);
    setCooling(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const focused = document.activeElement;
    focusAfterMove.current = slides.current.some((slide) => slide?.contains(focused));
    go(active + (event.key === "ArrowRight" ? 1 : -1));
  }

  // Only keyboard focus pauses: a mouse click also focuses a button, and that
  // shouldn't keep the carousel stopped after the mouse moves away.
  function onFocus(event: FocusEvent<HTMLDivElement>) {
    setKeyboardFocus(event.target.matches(":focus-visible"));
  }
  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
  }

  /* ---------------- Drag (mouse) and swipe (touch) ---------------- */

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") {
      if (event.button !== 0) return;
      // No text selection or native link dragging while spinning with the mouse.
      // (Clicks still work: preventing pointerdown doesn't cancel click.)
      event.preventDefault();
    }
    const width = slides.current[active]?.offsetWidth ?? 320;
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      step: width * STEP,
      dragging: false,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.pointerId !== event.pointerId) return;
    const dx = event.clientX - g.startX;
    if (!g.dragging) {
      if (Math.abs(dx) < DRAG_START_PX || Math.abs(dx) < Math.abs(event.clientY - g.startY)) return;
      g.dragging = true;
      // Keep receiving moves even if the pointer leaves the stage.
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    g.samples.push({ x: event.clientX, t: event.timeStamp });
    if (g.samples.length > 8) g.samples.shift();
    setDrag(clamp(-dx / g.step, MAX_TRAVEL));
  }

  function endGesture(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.pointerId !== event.pointerId) return;
    gesture.current = null;
    if (!g.dragging) return;

    // pointercancel (the browser took over to scroll) can report odd coordinates.
    const x = event.type === "pointercancel" ? g.samples[g.samples.length - 1].x : event.clientX;
    const travel = clamp(-(x - g.startX) / g.step, MAX_TRAVEL);
    // Release speed over the last ~120ms, in cards per millisecond.
    const recent = g.samples.find((s) => event.timeStamp - s.t < 120) ?? g.samples[0];
    const dt = event.timeStamp - recent.t;
    const velocity = dt > 0 ? -(x - recent.x) / g.step / dt : 0;

    let moveBy = Math.round(travel + clamp(velocity * FLING_MS, MAX_FLING));
    // A short but deliberate drag still moves one card.
    if (moveBy === 0 && Math.abs(travel) > 0.2) moveBy = Math.sign(travel);
    moveBy = clamp(moveBy, MAX_TRAVEL);

    setDrag(null);
    go(active + moveBy);
    setCooling(true);
    setDragEnds((n) => n + 1);
    // The click that follows a drag must not open a link or center a side card.
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 0);
  }

  const dragging = drag !== null;
  const shown = dragging ? (((active + Math.round(drag)) % count) + count) % count : active;

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      aria-describedby={hintId}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
    >
      <p id={hintId} className="sr-only">
        One project at a time. It moves to the next project every few seconds and pauses while you hover over it or
        while keyboard focus is inside it; the pause button stops it. Use the previous and next buttons, or the left
        and right arrow keys, to browse.
      </p>

      <div
        id={stageId}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (!suppressClick.current) return;
          suppressClick.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          // touch-action: pan-y keeps vertical page scrolling native on phones.
          "grid cursor-grab touch-pan-y overflow-x-clip py-6 [perspective:1400px]",
          dragging && "cursor-grabbing select-none [&_*]:cursor-grabbing",
        )}
      >
        {projects.map((project, i) => {
          // Where the card will rest; decides which card is "the" center card.
          const slot = wrap(i - active, count);
          // Where it is drawn right now (follows the pointer mid-drag).
          const offset = dragging ? wrap(i - active - drag, count) : slot;
          const distance = Math.abs(offset);
          const spot = spotAt(distance);
          const side = Math.sign(offset);
          const isCenter = slot === 0;
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
                opacity: spot.opacity,
                visibility: spot.opacity === 0 ? "hidden" : undefined,
                zIndex: 100 - Math.round(distance * 10),
              }}
              className={cn(
                "relative col-start-1 row-start-1 w-[82%] justify-self-center rounded-card sm:w-[22rem] lg:w-[25rem]",
                // No easing mid-drag: the cards track the pointer directly.
                !dragging && "transition-[transform,opacity,visibility] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              )}
            >
              <div inert={!isCenter} className="h-full">
                <Card project={project} showTracks />
              </div>
              {/* The veil fades side cards and is their click target: clicking one brings it to
                  the center. Mouse and touch only; keyboard and screen reader users have the
                  buttons and arrow keys. Always rendered so the fade animates both ways. */}
              <div
                aria-hidden="true"
                style={{ "--veil": spot.veil, "--veil-hover": spot.veilHover } as CSSProperties}
                className={cn(
                  "absolute inset-0 z-10 rounded-card bg-canvas opacity-(--veil)",
                  !dragging && "transition-opacity duration-700",
                  isCenter ? "pointer-events-none" : "cursor-pointer hover:opacity-(--veil-hover)",
                )}
                onClick={() => {
                  if (!isCenter) go(i);
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={toggleAutoplay}
          aria-label={autoplayOn ? "Pause carousel" : "Play carousel"}
          className={pauseButton}
        >
          {autoplayOn ? <PauseIcon width={15} height={15} /> : <PlayIcon width={15} height={15} />}
        </button>
        <button type="button" onClick={() => go(active - 1)} aria-controls={stageId} aria-label="Previous project" className={navButton}>
          <ArrowLeftIcon width={20} height={20} />
        </button>
        <p aria-hidden="true" className="min-w-0 flex-1 text-center text-sm text-ink-muted sm:max-w-sm sm:flex-none">
          <span className="font-semibold text-ink tabular-nums">
            {pad(shown + 1)} / {pad(count)}
          </span>
          <span className="mx-1.5">·</span>
          <span className="font-medium">{projects[shown].title}</span>
        </p>
        <button type="button" onClick={() => go(active + 1)} aria-controls={stageId} aria-label="Next project" className={navButton}>
          <ArrowRightIcon width={20} height={20} />
        </button>
      </div>

      <p className="sr-only" aria-live={rotating ? "off" : "polite"}>
        Project {active + 1} of {count}: {projects[active].title}
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
