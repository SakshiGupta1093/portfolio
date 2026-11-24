import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/icons";
import { profile } from "@/data/content";
import { cn } from "@/lib/cn";

const LINKS = [
  { label: "GitHub", href: profile.links.github, Icon: GithubIcon, external: true },
  { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedinIcon, external: true },
  { label: "Email", href: profile.links.email, Icon: MailIcon, external: false },
] as const;

/**
 * GitHub, LinkedIn, and Email as plain icons: no visible text, the same 20px glyph in
 * the same 40px tap target, muted until hover or keyboard focus turns it terracotta.
 * The screen reader label lives in sr-only text inside each link.
 */
export function SocialLinks({
  direction = "row",
  className,
}: {
  direction?: "row" | "column";
  className?: string;
}) {
  return (
    <ul aria-label="Social links" className={cn("flex gap-1", direction === "column" && "flex-col", className)}>
      {LINKS.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex size-10 items-center justify-center rounded-pill text-ink-muted transition-colors duration-200 hover:text-primary focus-visible:text-primary"
          >
            <Icon width={20} height={20} />
            <span className="sr-only">{external ? `${label} (opens in a new tab)` : label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Desktop: the icons stay fixed in the bottom-left corner while scrolling.
 *
 * It only appears from 1280px (xl). Below that there is no empty margin beside the
 * max-w-6xl content column, so a fixed element would sit on top of text; those widths
 * get the in-flow icons in the hero and footer instead. At 1280px the content starts
 * about 88px from the left edge, and the rail ends at 64px. Stacked vertically, it stays
 * far from the chat button (bottom right) and the tool bar (bottom center).
 */
export function SocialRail() {
  return (
    <div className="fixed bottom-6 left-6 z-20 hidden xl:block">
      <SocialLinks direction="column" />
    </div>
  );
}
