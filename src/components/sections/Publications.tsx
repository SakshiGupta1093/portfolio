import { ArrowUpRightIcon, TrendingUpIcon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { publications } from "@/data/content";
import { cn } from "@/lib/cn";
import { href } from "@/lib/portfolio";

/** Publications: the same on every track, newest first, each linking to the paper. */
export function Publications() {
  return (
    <Section id="publications" labelledBy="publications-title">
      <SectionHeading id="publications-title" title="Publications" />
      <ul className="mt-10 grid gap-5 lg:grid-cols-3">
        {publications.map((pub) => {
          const link = href(pub.href);
          return (
            <li key={pub.title}>
              <article className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-soft sm:p-7">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span
                    className={cn(
                      "rounded-pill px-2.5 py-1",
                      pub.authorRole === "First author"
                        ? "bg-primary-soft text-on-primary-soft"
                        : "bg-surface-2 text-ink-muted",
                    )}
                  >
                    {pub.authorRole}
                  </span>
                  <span className="text-ink-muted">{pub.year}</span>
                </div>
                <h3 className="mt-4 text-lg leading-snug text-ink">{pub.title}</h3>
                <p className="mt-2 text-sm font-medium text-secondary">{pub.venue}</p>
                {pub.highlight && (
                  <p className="mt-3 inline-flex items-start gap-2 text-sm font-semibold text-ink">
                    <TrendingUpIcon width={16} height={16} className="mt-0.5 shrink-0 text-primary" />
                    {pub.highlight}
                  </p>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Read the paper
                      <ArrowUpRightIcon width={16} height={16} />
                      <span className="sr-only">: {pub.title} (opens in a new tab)</span>
                    </a>
                  )}
                  {pub.doi && <span className="font-mono text-xs text-ink-muted">DOI {pub.doi}</span>}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
