"use client";

import { tracks } from "@/data/content";
import { useTrack } from "@/lib/track-store";

/** Hero tagline for the selected track. Reserves two lines so the layout doesn't jump. */
export function TrackTagline() {
  const track = useTrack();
  return (
    <p
      className="mt-4 min-h-[2lh] max-w-xl font-display text-xl font-bold text-ink sm:text-2xl"
      style={{ viewTransitionName: "hero-tagline" }}
    >
      {tracks[track].tagline}
    </p>
  );
}
