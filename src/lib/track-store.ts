/**
 * The selected track lives in the URL hash (#swe, #ml, #data; no hash means All).
 *
 * The URL is the single source of truth, so links like /#ml preselect a track,
 * the browser's own hashchange events keep it in sync, and there is no second
 * copy of the state to drift. React reads it with useSyncExternalStore.
 */
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { TRACK_IDS, tracks, type Track } from "@/data/content";

export function trackFromHash(hash: string): Track {
  const value = hash.replace(/^#/, "").toLowerCase();
  if (!value) return "all";
  return TRACK_IDS.find((id) => id !== "all" && tracks[id].hash === value) ?? "all";
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("hashchange", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("hashchange", listener);
  };
}

const getSnapshot = (): Track => trackFromHash(window.location.hash);

// The hash never reaches the server, so the prerendered HTML is the All view.
// After hydration React switches to the hash's track.
const getServerSnapshot = (): Track => "all";

export function useTrack(): Track {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setTrack(track: Track) {
  if (track === getSnapshot()) return;
  const { hash } = tracks[track];
  // replaceState (not pushState): switching tracks shouldn't fill up the Back button.
  const url = hash ? `#${hash}` : window.location.pathname + window.location.search;

  const apply = () => {
    window.history.replaceState(null, "", url);
    listeners.forEach((notify) => notify());
  };

  // A gentle cross-fade (and cards gliding to new positions) where the browser
  // supports View Transitions; an instant update otherwise or with reduced motion.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && typeof document.startViewTransition === "function") {
    document.startViewTransition(() => flushSync(apply));
  } else {
    apply();
  }
}
