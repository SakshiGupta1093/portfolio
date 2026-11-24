import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { profile } from "@/data/content";
import { SectionLink } from "./SectionLink";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#projects", label: "Projects" },
  // Hidden on small tablets, where five links don't fit beside the name.
  { href: "#experience", label: "Experience", className: "hidden md:block" },
] as const;

const brandClass = "font-display text-lg font-extrabold text-ink transition-colors hover:text-primary";
const navClass =
  "rounded-pill px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink";

/**
 * On the home page, links scroll to sections without touching the URL hash (it holds
 * the selected track). On other pages (case studies), they go to the home page and
 * jump to the section, e.g. /#work.
 */
export function SiteHeader({ onHome = true }: { onHome?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        {onHome ? (
          <SectionLink href="#top" className={brandClass}>
            {profile.name}
          </SectionLink>
        ) : (
          <Link href="/" className={brandClass}>
            {profile.name}
          </Link>
        )}
        <div className="flex items-center gap-2">
          <nav aria-label="Sections" className="hidden sm:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href} className={"className" in item ? item.className : undefined}>
                  {onHome ? (
                    <SectionLink href={item.href} className={navClass}>
                      {item.label}
                    </SectionLink>
                  ) : (
                    <Link href={`/${item.href}`} className={navClass}>
                      {item.label}
                    </Link>
                  )}
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
