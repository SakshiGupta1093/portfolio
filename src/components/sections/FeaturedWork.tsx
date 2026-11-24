"use client";

import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { tracks } from "@/data/content";
import { getFeatured } from "@/lib/portfolio";
import { useTrack } from "@/lib/track-store";

export function FeaturedWork() {
  const track = useTrack();
  const featured = getFeatured(track);
  const label = tracks[track].label;

  return (
    <Section id="work" labelledBy="work-title">
      <SectionHeading
        id="work-title"
        title="Top Repositories"
        description={
          track === "all"
            ? "In-depth write-ups covering the problem, my role, the architecture, and the results."
            : `Top picks for ${label} come first.`
        }
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {featured.map(({ study, isPick }) => (
          <CaseStudyCard key={study.slug} study={study} pickLabel={isPick ? `Top pick for ${label}` : null} />
        ))}
      </div>
    </Section>
  );
}
