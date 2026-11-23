/** Shared class strings so buttons and chips look identical everywhere. */

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98]";

export const buttonPrimary = `${buttonBase} bg-primary text-on-primary shadow-soft hover:bg-primary-hover hover:shadow-lift`;

export const buttonSecondary = `${buttonBase} border border-line bg-surface text-ink shadow-soft hover:border-primary hover:text-primary`;

/** Small, non-interactive tag (stack chips on cards). */
export const chip = "rounded-pill bg-secondary-soft px-2.5 py-1 text-xs font-medium text-on-secondary-soft";

/** Peach highlight pill (badges on cards). */
export const badge = "rounded-pill bg-primary-soft px-3 py-1 text-xs font-semibold text-on-primary-soft";

/** Shared card shell. Highlight states are layered on top (see highlightClasses). */
export const cardBase = "relative rounded-card border bg-surface shadow-soft transition duration-300";
