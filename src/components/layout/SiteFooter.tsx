import { profile } from "@/data/content";
import { SocialLinks } from "./SocialLinks";

/**
 * Minimal by design: name, location, and (below 1280px, where the fixed desktop rail
 * isn't shown) the social icons. The "Built with Next.js, Tailwind, and Groq" line
 * (site.builtWith) is added in Round 5, once the Groq chatbot actually exists.
 * The bottom padding keeps footer content clear of the floating chat button
 * (bottom right, coming in Round 5) when the page is scrolled all the way down.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 pt-8 pb-24 sm:flex-row sm:justify-between sm:px-8 xl:pb-10">
        <p className="text-sm text-ink-muted">
          {profile.name}, {profile.location}
        </p>
        <SocialLinks className="sm:-mr-2.5 xl:hidden" />
      </div>
    </footer>
  );
}
