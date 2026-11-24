import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Review markers for draft() wording (see editing rule 5 in content.ts).
 * These only ever render in `npm run dev`: production builds drop drafts before
 * they reach these components, so none of this styling can appear on the live site.
 */

const pill = "rounded-pill bg-primary px-2 py-0.5 text-[11px] font-bold tracking-wider text-on-primary uppercase";

/** A highlighted run of text, such as a drafted "why" sentence or paragraph. */
export function DraftText({ children }: { children: ReactNode }) {
  return (
    <mark
      data-draft=""
      className="rounded-md bg-primary-soft px-1 text-on-primary-soft box-decoration-clone"
    >
      <span className={cn(pill, "mr-1.5 align-[0.1em] text-[10px]")}>Draft</span>
      {children}
    </mark>
  );
}

/** A dashed outline around a whole block, such as a drafted decision card. */
export function DraftBlock({ active, className, children }: { active: boolean; className?: string; children: ReactNode }) {
  if (!active) return <div className={className}>{children}</div>;
  return (
    <div
      data-draft=""
      className={cn("relative rounded-card outline-2 outline-offset-4 outline-primary outline-dashed", className)}
    >
      <span className={cn(pill, "absolute -top-3 right-5 z-10")}>Draft</span>
      {children}
    </div>
  );
}

/** Dev-only note at the top of a case study that has drafts waiting. */
export function DraftBanner({ count }: { count: number }) {
  return (
    <aside className="rounded-card border-2 border-dashed border-primary bg-primary-soft/60 p-5 text-sm text-ink">
      <p className="font-semibold">
        Review mode: {count} {count === 1 ? "draft" : "drafts"} on this page
      </p>
      <p className="mt-1 text-ink-muted">
        Wording marked Draft was written by Claude, not taken from your notes. It shows only in{" "}
        <code className="font-mono text-xs">npm run dev</code> and stays off the live site until you approve it in{" "}
        <code className="font-mono text-xs">src/data/content.ts</code>: remove the{" "}
        <code className="font-mono text-xs">draft( )</code> wrapper to approve, or delete the line.
      </p>
    </aside>
  );
}
