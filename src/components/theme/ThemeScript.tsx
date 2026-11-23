"use client";

import { themeInitScript } from "@/lib/theme";

/**
 * Renders the no-flash theme script into <head>.
 * Pattern from the Next.js "Preventing flash before hydration" guide: the script is
 * real JavaScript in the server HTML (so it runs before paint), and inert text/plain
 * on the client (so React doesn't warn about rendering a script tag).
 */
export function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
