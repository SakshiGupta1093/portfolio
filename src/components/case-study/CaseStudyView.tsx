import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon, GithubIcon, UsersIcon } from "@/components/icons";
import { badge, buttonPrimary, buttonSecondary } from "@/components/ui/styles";
import { caseStudies, tracks, type CaseStudy, type Result } from "@/data/content";
import { cn } from "@/lib/cn";
import { countDrafts, href, known, repoHref, reviewed, reviewedList, SHOW_DRAFTS } from "@/lib/portfolio";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { BackLink } from "./BackLink";
import { DraftBanner, DraftBlock, DraftText } from "@/components/ui/Draft";

/*
 * One layout for all 4 case studies (Sakshi's template):
 *   1. Problem  2. My role  3. Architecture  4. Key technical decisions
 *   5. Results (only when there are real numbers)  6. What I'd do next  7. Stack and links
 * A section with nothing to show is left out rather than shown empty.
 */

function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t border-line pt-10 sm:pt-12">
      <h2 id={`${id}-title`} className="text-2xl text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

const RESULT_GROUPS: { scope: Result["scope"]; title: string | null }[] = [
  { scope: "team", title: "Team results" },
  { scope: "mine", title: "My contributions" },
  { scope: undefined, title: null },
];

export function CaseStudyView({ study }: { study: CaseStudy }) {
  const casePath = `/projects/${study.slug}`;
  const team = known(study.teamLabel);
  const role = known(study.role);
  const next = known(study.next) ?? [];
  const problem = reviewedList(study.problem);
  const decisions = reviewedList(study.decisions);
  const github = repoHref(study.links);
  const demo = href(study.links.demo);
  const drafts = SHOW_DRAFTS ? countDrafts(study) : 0;
  const resultGroups = RESULT_GROUPS.map((g) => ({ ...g, items: study.results.filter((r) => r.scope === g.scope) })).filter(
    (g) => g.items.length > 0,
  );
  const others = caseStudies.filter((s) => s.slug !== study.slug);

  return (
    <>
      <article aria-labelledby="case-title">
        <header className="hero-glow">
          <div className="mx-auto max-w-6xl px-5 pt-8 pb-12 sm:px-8 sm:pt-10 sm:pb-16">
            <BackLink casePath={casePath} />
            <p className="mt-8 text-sm font-semibold tracking-wider text-secondary uppercase">
              Case study · {study.tracks.map((t) => tracks[t].label).join(" · ")}
            </p>
            <h1 id="case-title" className="mt-2 text-4xl text-ink sm:text-5xl lg:text-6xl">
              {study.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-muted">{study.summary}</p>
            <ul className="mt-6 flex flex-wrap items-center gap-2" aria-label="At a glance">
              {team && (
                <li className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-3 py-1 text-sm font-medium text-ink shadow-soft">
                  <UsersIcon width={15} height={15} className="text-secondary" />
                  {team}
                </li>
              )}
              {study.badges.map((b) => (
                <li key={b} className={badge}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-14 px-5 pb-16 sm:space-y-16 sm:px-8">
          {drafts > 0 && <DraftBanner count={drafts} />}

          {problem.length > 0 && (
            <CaseSection id="problem" title="Problem">
              <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-ink">
                {problem.map(({ value, isDraft }) => (
                  <p key={value}>{isDraft ? <DraftText>{value}</DraftText> : value}</p>
                ))}
              </div>
            </CaseSection>
          )}

          {role && (
            <CaseSection id="role" title="My role">
              <p className="max-w-3xl text-lg leading-relaxed text-ink">{role.summary}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
                {role.groups.map((group) => (
                  <div key={group.heading} className="rounded-card border border-line bg-surface p-6 shadow-soft">
                    <h3 className="text-base text-ink">{group.heading}</h3>
                    <ul className="mt-4 space-y-3">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                          <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-secondary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CaseSection>
          )}

          <CaseSection id="architecture" title="Architecture">
            <figure className="rounded-card border border-line bg-surface p-4 shadow-soft sm:p-6 lg:p-8">
              <ArchitectureDiagram architecture={study.architecture} />
              {study.architecture.note && (
                <figcaption className="mt-5 text-center text-sm text-ink-muted">{study.architecture.note}</figcaption>
              )}
            </figure>
          </CaseSection>

          {/* Hidden until screenshots are added in content.ts (see the note on `screenshots` there). */}
          {study.screenshots.length > 0 && (
            <CaseSection id="screenshots" title="Screenshots">
              <div className={cn("grid gap-6", study.screenshots.length > 1 && "md:grid-cols-2")}>
                {study.screenshots.map((shot) => (
                  <figure key={shot.src}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line bg-surface-2 shadow-soft">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        fill
                        sizes={study.screenshots.length > 1 ? "(min-width: 768px) 544px, 100vw" : "(min-width: 1152px) 1088px, 100vw"}
                        className="object-contain"
                      />
                    </div>
                    {shot.caption && <figcaption className="mt-2 text-sm text-ink-muted">{shot.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </CaseSection>
          )}

          {decisions.length > 0 && (
            <CaseSection id="decisions" title="Key technical decisions">
              <ol className="grid gap-5 md:grid-cols-2">
                {decisions.map(({ value: decision, isDraft }, i) => {
                  const why = reviewed(decision.why);
                  return (
                    <li key={decision.title}>
                      <DraftBlock active={isDraft} className="h-full">
                        <div className="h-full rounded-card border border-line bg-surface p-6 shadow-soft">
                          <div className="flex items-start gap-3">
                            <span
                              aria-hidden="true"
                              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-on-primary-soft"
                            >
                              {i + 1}
                            </span>
                            <h3 className="pt-0.5 text-lg leading-snug text-ink">{decision.title}</h3>
                          </div>
                          <p className="mt-3 leading-relaxed text-ink-muted">
                            {decision.detail}
                            {why && (
                              <>
                                {" "}
                                {why.isDraft ? <DraftText>{why.value}</DraftText> : why.value}
                              </>
                            )}
                          </p>
                        </div>
                      </DraftBlock>
                    </li>
                  );
                })}
              </ol>
            </CaseSection>
          )}

          {resultGroups.length > 0 && (
            <CaseSection id="results" title="Results">
              <div className="space-y-8">
                {resultGroups.map((group) => (
                  <div key={group.title ?? "results"}>
                    {group.title && <h3 className="mb-4 text-base text-ink-muted">{group.title}</h3>}
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.items.map((r) => (
                        <li key={r.label} className="rounded-card border border-line bg-surface p-6 shadow-soft">
                          <p className="font-display text-3xl font-extrabold text-primary">{r.value}</p>
                          <p className="mt-2 text-sm leading-snug text-ink">{r.label}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CaseSection>
          )}

          {next.length > 0 && (
            <CaseSection id="next" title="What I'd do next">
              <ul className="max-w-3xl space-y-3">
                {next.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-lg leading-relaxed text-ink">
                    <ArrowRightIcon width={18} height={18} className="mt-1.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CaseSection>
          )}

          <CaseSection id="stack" title={demo || github ? "Stack and links" : "Stack"}>
            <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
              {study.stack.map((t) => (
                <li
                  key={t}
                  className="rounded-pill bg-secondary-soft px-3 py-1.5 text-sm font-medium text-on-secondary-soft"
                >
                  {t}
                </li>
              ))}
            </ul>
            {(demo || github) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {demo && (
                  <a href={demo} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                    Live demo
                    <ArrowUpRightIcon width={18} height={18} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
                {github && (
                  <a href={github} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
                    <GithubIcon width={18} height={18} />
                    View code on GitHub
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            )}
          </CaseSection>
        </div>
      </article>

      <nav aria-labelledby="more-title" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="border-t border-line pt-10 sm:pt-12">
          <h2 id="more-title" className="text-2xl text-ink sm:text-3xl">
            More case studies
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/projects/${s.slug}`}
                  className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lift"
                >
                  <span className="text-xs font-semibold tracking-wider text-secondary uppercase">
                    {s.tracks.map((t) => tracks[t].label).join(" · ")}
                  </span>
                  <span className="mt-1 font-display text-lg font-extrabold text-ink transition-colors group-hover:text-primary">
                    {s.title}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
                    Read case study
                    <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
