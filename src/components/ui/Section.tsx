import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Page section with consistent width and spacing. tabIndex={-1} lets the header's
 * section links move keyboard and screen reader focus here after scrolling.
 */
export function Section({
  id,
  labelledBy,
  className,
  children,
}: {
  id: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={cn("mx-auto max-w-6xl scroll-mt-20 px-5 py-16 focus:outline-none sm:px-8 sm:py-20", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-sm font-semibold tracking-wider text-secondary uppercase">{eyebrow}</p>}
      <h2 id={id} className="mt-2 text-3xl text-ink sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-ink-muted">{description}</p>}
    </div>
  );
}
