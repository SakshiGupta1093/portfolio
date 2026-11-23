export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** The visitor's explicit choice from the toggle, or null if they never picked one. */
export function getSavedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null; // localStorage can throw in private mode or when blocked
  }
}

/** Saved choice wins; otherwise follow the operating system setting. */
export function resolveTheme(): Theme {
  return (
    getSavedTheme() ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Not fatal: the theme still applies for this visit.
  }
}

/**
 * Inline script that runs in <head> while the HTML is parsed, before first paint,
 * so there is no flash of the wrong theme. It mirrors resolveTheme() above and
 * keeps following OS theme changes until the visitor picks a theme with the toggle.
 */
export const themeInitScript = `(function(){var d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");function s(){try{var v=localStorage.getItem("${THEME_STORAGE_KEY}");return v==="light"||v==="dark"?v:null}catch(e){return null}}function a(){d.setAttribute("data-theme",s()||(m.matches?"dark":"light"))}a();m.addEventListener("change",function(){if(!s())a()})})()`;
