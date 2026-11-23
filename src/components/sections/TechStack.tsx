"use client";

import { useToolSelection } from "@/components/tools/ToolSelection";
import { Section, SectionHeading } from "@/components/ui/Section";
import { tracks } from "@/data/content";
import { cn } from "@/lib/cn";
import { getStackGroups, toolLabel } from "@/lib/portfolio";
import { useTrack } from "@/lib/track-store";

export function TechStack() {
  const track = useTrack();
  const groups = getStackGroups(track);
  const { selected, toggle } = useToolSelection();

  return (
    <Section id="stack" labelledBy="stack-title">
      <SectionHeading
        id="stack-title"
        eyebrow="Tech stack"
        title={track === "all" ? "Tools I work with" : `My ${tracks[track].label} toolkit`}
        description="Click a tool to highlight the work that used it."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.name} className="rounded-card border border-line bg-surface p-5 shadow-soft">
            <h3 className="text-sm tracking-wide text-ink-muted uppercase">{group.name}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.tools.map((id) => {
                const pressed = selected === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => toggle(id)}
                      className={cn(
                        "rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                        pressed
                          ? "border-primary bg-primary text-on-primary shadow-soft"
                          : "border-line bg-surface-2 text-ink hover:border-primary hover:text-primary",
                      )}
                    >
                      {toolLabel(id)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
