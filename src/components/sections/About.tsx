import { Section, SectionHeading } from "@/components/ui/Section";
import { profile } from "@/data/content";

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
        <SectionHeading id="about-title" eyebrow="About" title={`Hi, I'm ${profile.firstName}.`} />
        <div className="space-y-4 text-lg leading-relaxed text-ink lg:pt-8">
          {profile.about.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}
