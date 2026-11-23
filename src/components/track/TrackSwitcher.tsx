"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { TRACK_IDS, tracks, type Track } from "@/data/content";
import { cn } from "@/lib/cn";
import { getProjects } from "@/lib/portfolio";
import { setTrack, useTrack } from "@/lib/track-store";

/**
 * Segmented control for All | SWE | ML/AI | Data.
 * Accessibility: a WAI-ARIA radio group. Tab reaches the selected option, arrow keys
 * (and Home/End) move between options, and a polite live region announces the result.
 */
export function TrackSwitcher({ className }: { className?: string }) {
  const track = useTrack();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [announcement, setAnnouncement] = useState("");

  function choose(next: Track) {
    setTrack(next);
    const count = getProjects(next).length;
    setAnnouncement(
      next === "all"
        ? "Showing everything."
        : `Page tailored for ${tracks[next].label}. ${count} more projects shown.`,
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = TRACK_IDS.indexOf(track);
    const last = TRACK_IDS.length - 1;
    const nextIndex =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last ? 0 : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0 ? last : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    choose(TRACK_IDS[nextIndex]);
    buttons.current[nextIndex]?.focus();
  }

  return (
    <div className={className}>
      <p id="track-label" className="text-sm font-medium text-ink-muted">
        Tailor this page to a role
      </p>
      <div
        role="radiogroup"
        aria-labelledby="track-label"
        onKeyDown={onKeyDown}
        className="mt-2 inline-flex rounded-pill border border-line bg-surface p-1 shadow-soft"
      >
        {TRACK_IDS.map((id, i) => {
          const checked = id === track;
          return (
            <button
              key={id}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => choose(id)}
              className={cn(
                "rounded-pill px-4 py-2 text-sm font-semibold transition-colors duration-200 sm:px-5",
                checked
                  ? "bg-primary text-on-primary shadow-soft"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              {tracks[id].label}
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
