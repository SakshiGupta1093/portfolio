import { CaseStudyLink } from "@/components/case-study/CaseStudyLink";
import { ArrowRightIcon, AwardIcon, GraduationCapIcon, UsersIcon } from "@/components/icons";
import { SectionHeading } from "@/components/ui/Section";
import { education, recognition } from "@/data/content";

/**
 * Education and Awards and involvement: two short sections, side by side on wide
 * screens and stacked on phones. Each is still its own <section> with its own heading.
 */
export function EducationAndAwards() {
  return (
    <div className="mx-auto grid max-w-6xl gap-16 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-14">
      <section id="education" aria-labelledby="education-title" tabIndex={-1} className="scroll-mt-20 focus:outline-none">
        <SectionHeading id="education-title" title="Education" />
        <ul className="mt-8 space-y-4">
          {education.map((ed) => (
            <li key={ed.school} className="flex gap-4 rounded-card border border-line bg-surface p-6 shadow-soft">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-on-primary-soft">
                <GraduationCapIcon width={20} height={20} />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg leading-snug text-ink">{ed.school}</h3>
                <p className="mt-1 text-ink">{ed.degree}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {ed.location} · {ed.period}
                </p>
                <p className="mt-3 inline-flex rounded-pill bg-secondary-soft px-3 py-1 text-xs font-semibold text-on-secondary-soft">
                  {ed.grade}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="awards" aria-labelledby="awards-title" tabIndex={-1} className="scroll-mt-20 focus:outline-none">
        <SectionHeading id="awards-title" title="Awards and involvement" />
        <ul className="mt-8 space-y-4">
          {recognition.map((item) => {
            const Icon = item.kind === "award" ? AwardIcon : UsersIcon;
            return (
              <li key={item.title} className="flex gap-4 rounded-card border border-line bg-surface p-6 shadow-soft">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary-soft text-on-secondary-soft">
                  <Icon width={20} height={20} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg leading-snug text-ink">{item.title}</h3>
                  <p className="mt-1 text-ink-muted">{item.detail}</p>
                  {item.caseStudy && (
                    <CaseStudyLink
                      slug={item.caseStudy}
                      className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                    >
                      Read the case study
                      <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                    </CaseStudyLink>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
