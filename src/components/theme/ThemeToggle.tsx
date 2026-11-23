"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { applyTheme, resolveTheme, saveTheme, type Theme } from "@/lib/theme";

/*
 * The source of truth for the current theme is the data-theme attribute on <html>
 * (the head script sets it before paint). useSyncExternalStore subscribes to that
 * attribute, so the icon always matches what's on screen, with no hydration mismatch.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme | null =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

// The server can't know the visitor's theme, so it renders a neutral button.
const getServerSnapshot = (): Theme | null => null;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // In development, React Strict Mode remounts and resets <html> attributes,
  // clearing data-theme. Re-apply before paint. This is a no-op in production.
  useLayoutEffect(() => {
    applyTheme(resolveTheme());
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        saveTheme(next);
        applyTheme(next);
      }}
      aria-label={theme ? `Switch to ${next} mode` : "Toggle color theme"}
      title={theme ? `Switch to ${next} mode` : "Toggle color theme"}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-pill border border-line bg-surface text-ink-muted shadow-soft transition-colors duration-200 hover:border-primary hover:text-primary ${className}`}
    >
      {theme === "dark" ? <SunIcon /> : theme === "light" ? <MoonIcon /> : null}
    </button>
  );
}
