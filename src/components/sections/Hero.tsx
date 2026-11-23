import Image from "next/image";
import {
  AwardIcon,
  BookOpenIcon,
  BriefcaseIcon,
  GithubIcon,
  GraduationCapIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
} from "@/components/icons";
import { ResumeButton } from "@/components/track/ResumeButton";
import { TrackSwitcher } from "@/components/track/TrackSwitcher";
import { TrackTagline } from "@/components/track/TrackTagline";
import { buttonSecondary } from "@/components/ui/styles";
import { profile } from "@/data/content";
import { cn } from "@/lib/cn";

const highlightIcons = {
  education: GraduationCapIcon,
  award: AwardIcon,
  work: BriefcaseIcon,
  publication: BookOpenIcon,
};

/**
 * Server component: only the small interactive pieces (tagline, switcher, resume
 * button) ship as client JavaScript.
 *
 * Layout with a photo:
 *   phones:  round avatar, then name and buttons, then the "At a glance" card
 *   desktop: text on the left; photo on the right with the card overlapping its bottom
 * It's one <Image> styled per breakpoint, so the photo is only downloaded once.
 * Without a photo (headshot: null) the card simply fills the right column.
 */
export function Hero() {
  const { headshot } = profile;

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      tabIndex={-1}
      className="hero-glow relative scroll-mt-20 focus:outline-none"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 pt-10 pb-16 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-0 lg:pb-24">
        <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <p className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface/80 px-3 py-1.5 text-sm font-medium text-ink-muted shadow-soft">
            <span className="size-2 rounded-full bg-secondary" aria-hidden="true" />
            {profile.openTo}
          </p>
          <h1 id="hero-title" className="mt-5 text-5xl text-ink sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <TrackTagline />
          <p className="mt-2 max-w-xl text-ink-muted">{profile.headline}</p>

          <TrackSwitcher className="mt-8" />

          <div className="mt-6 flex flex-wrap gap-3">
            <ResumeButton />
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
              <GithubIcon width={18} height={18} />
              GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
              <LinkedinIcon width={18} height={18} />
              LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href={profile.links.email} className={buttonSecondary}>
              <MailIcon width={18} height={18} />
              Email
            </a>
          </div>
        </div>

        {headshot && (
          <div className="order-first lg:order-none lg:col-start-2 lg:row-start-1">
            <div className="relative size-28 overflow-hidden rounded-full border-4 border-surface shadow-lift sm:size-32 lg:aspect-[3/2] lg:size-auto lg:w-full lg:rounded-card">
              <Image
                src={headshot.src}
                alt={headshot.alt}
                fill
                preload
                sizes="(min-width: 1024px) 440px, 128px"
                // Phones: zoom toward the face for a head-and-shoulders avatar. Desktop: full photo.
                className="origin-[48%_30%] scale-150 object-cover object-[48%_30%] lg:scale-100"
              />
            </div>
          </div>
        )}

        <aside
          aria-labelledby="glance-title"
          className={cn(
            "relative rounded-card border border-line bg-surface/90 p-6 shadow-soft backdrop-blur-sm sm:p-7 lg:col-start-2",
            headshot ? "lg:row-start-2 lg:mx-6 lg:-mt-12 lg:shadow-lift" : "lg:row-span-2 lg:row-start-1",
          )}
        >
          <h2 id="glance-title" className="text-lg text-ink">
            At a glance
          </h2>
          <ul className="mt-5 space-y-4">
            {profile.highlights.map((item) => {
              const Icon = highlightIcons[item.icon];
              return (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-on-primary-soft">
                    <Icon width={18} height={18} />
                  </span>
                  <span className="pt-1.5 text-sm leading-snug text-ink">{item.text}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-sm text-ink-muted">
            <MapPinIcon width={16} height={16} className="text-secondary" />
            Based in {profile.location}
          </p>
        </aside>
      </div>
    </section>
  );
}
