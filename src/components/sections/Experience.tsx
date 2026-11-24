import { DraftBlock } from "@/components/ui/Draft";
import { Section, SectionHeading } from "@/components/ui/Section";
import { chip } from "@/components/ui/styles";
import { isTodo } from "@/data/content";
import { getExperience, known, toolLabel } from "@/lib/portfolio";

/**
 * Experience: jobs and campus roles, the same on every track, newest first. Projects
 * (AOWA included) live in Featured work and More projects instead. Server component.
 * A draft() entry (none right now) only renders in `npm run dev`, outlined, with
 * any missing fields shown as TODO placeholders.
 */
export function Experience() {
  const entries = getExperience();

  return (
    <Section id="experience" labelledBy="experience-title">
      <SectionHeading id="experience-title" title="Experience" />
      <ol className="relative mt-10 space-y-6 sm:ml-3 sm:border-l sm:border-line sm:pl-9">
        {entries.map(({ value: job, isDraft }) => {
          const period = known(job.period);
          const bullets = known(job.bullets);
          return (
            <li key={`${job.role}-${job.org}`} className="relative">
              {/* Timeline dot, centered on the line (sm and up). */}
              <span
                aria-hidden="true"
                className="absolute top-8 -left-[2.65rem] hidden size-3 rounded-full bg-primary ring-4 ring-canvas sm:block"
              />
              <DraftBlock active={isDraft}>
                <article className="rounded-card border border-line bg-surface p-6 shadow-soft sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-xl text-ink">{job.role}</h3>
                    {period ? (
                      <p className="text-sm font-medium text-ink-muted">{period}</p>
                    ) : (
                      isDraft && isTodo(job.period) && <TodoNote text={job.period.todo} />
                    )}
                  </div>
                  <p className="mt-1 font-semibold text-secondary">{job.org}</p>

                  {bullets ? (
                    <ul className="mt-4 space-y-2.5">
                      {bullets.map((b) => (
                        <li key={b} className="flex gap-3 leading-relaxed text-ink">
                          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    isDraft && isTodo(job.bullets) && <TodoNote text={job.bullets.todo} className="mt-4" />
                  )}

                  {job.toolIds.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tools">
                      {job.toolIds.map((id) => (
                        <li key={id} className={chip}>
                          {toolLabel(id)}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </DraftBlock>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

/** Dev-only placeholder for a missing field inside a draft entry. */
function TodoNote({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`rounded-lg border border-dashed border-primary px-2.5 py-1 text-xs font-semibold text-primary ${className}`}>
      TODO: {text}
    </p>
  );
}
