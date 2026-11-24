/**
 * Remembers the last hop from a home page card to a case study, in memory only.
 *
 * Why: the case study's "All work" link can then use the browser's Back, which
 * returns the visitor to the home page with their track (#ml...) and scroll
 * position intact. Without a recorded hop (someone opened the case study link
 * directly, or reloaded), it falls back to a normal link to /#work.
 *
 * Module state survives client-side navigation and resets on a full page load,
 * which is exactly the lifetime we want. No storage, nothing persisted.
 */
let lastHop: string | null = null;

/** Call when a visitor follows a home page card to a case study. */
export function rememberHopFromHome(casePath: string) {
  lastHop = casePath;
}

/** True when the page before this case study (in history) is the home page. */
export function cameFromHome(casePath: string): boolean {
  return lastHop === casePath;
}

/** A plain left click: no new tab, no new window, no download. */
export function isPlainClick(event: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
