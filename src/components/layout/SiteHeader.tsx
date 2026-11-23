import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { profile } from "@/data/content";
import { SectionLink } from "./SectionLink";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#projects", label: "Projects" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <SectionLink
          href="#top"
          className="font-display text-lg font-extrabold text-ink transition-colors hover:text-primary"
        >
          {profile.name}
        </SectionLink>
        <div className="flex items-center gap-2">
          <nav aria-label="Sections" className="hidden sm:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <SectionLink
                    href={item.href}
                    className="rounded-pill px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** First focusable element on the page: lets keyboard users jump past the header. */
export function SkipLink() {
  return (
    <SectionLink
      href="#main"
      className="sr-only rounded-pill bg-primary px-4 py-2 font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to content
    </SectionLink>
  );
}
