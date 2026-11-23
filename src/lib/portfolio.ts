/**
 * Pure functions that turn content.ts into what each section shows for a track.
 * No React here, so the logic is easy to test and reuse (the chatbot will too).
 */
import {
  ALL_STACK_CATEGORIES,
  caseStudies,
  experience,
  isTodo,
  projects,
  techStack,
  toolFallbackNote,
  toolNotes,
  tools,
  type CaseStudy,
  type Experience,
  type FocusTrack,
  type OrTodo,
  type Project,
  type ToolId,
  type Track,
} from "@/data/content";

export const FOCUS_TRACKS: FocusTrack[] = ["swe", "ml", "data"];

/** A usable URL, or null if it's missing (a todo) or not applicable. Missing links are hidden, never shown broken. */
export function href(value: OrTodo<string> | null | undefined): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * The GitHub link to show, or null. Hidden when it's missing, or when content.ts marks
 * the repo as not ready yet (repoReady: false). Use this everywhere a repo link appears.
 */
export function repoHref(links: { github: OrTodo<string> | null; repoReady?: boolean }): string | null {
  return links.repoReady === false ? null : href(links.github);
}

/** The value, or null if it's still a todo. */
export function known<T>(value: OrTodo<T>): T | null {
  return isTodo(value) ? null : value;
}

/* ----------------------------- Tech stack ----------------------------- */

export interface StackGroupView {
  name: string;
  tools: ToolId[];
}

/**
 * The "All" view: every track's groups merged into shared categories, with duplicates
 * removed (first occurrence wins, in SWE, ML, Data order). Computed once at module load.
 */
const allStack: StackGroupView[] = (() => {
  const byCategory = new Map<string, ToolId[]>(ALL_STACK_CATEGORIES.map((c) => [c, []]));
  const seen = new Set<ToolId>();
  for (const track of FOCUS_TRACKS) {
    for (const group of techStack[track]) {
      for (const tool of group.tools) {
        if (seen.has(tool)) continue;
        seen.add(tool);
        byCategory.get(group.allCategory)?.push(tool);
      }
    }
  }
  return [...byCategory]
    .filter(([, list]) => list.length > 0)
    .map(([name, list]) => ({ name, tools: list }));
})();

export function getStackGroups(track: Track): StackGroupView[] {
  return track === "all" ? allStack : techStack[track].map(({ name, tools: list }) => ({ name, tools: list }));
}

export function getTrackToolIds(track: Track): Set<ToolId> {
  return new Set(getStackGroups(track).flatMap((g) => g.tools));
}

export function toolLabel(id: ToolId): string {
  return tools[id];
}

/* ------------------------- Featured and projects ------------------------- */

/** All 4 case studies; on a specific track, the relevant ones come first. */
export function getFeatured(track: Track): { study: CaseStudy; isPick: boolean }[] {
  if (track === "all") return caseStudies.map((study) => ({ study, isPick: false }));
  const picks = caseStudies.filter((s) => s.tracks.includes(track));
  const rest = caseStudies.filter((s) => !s.tracks.includes(track));
  return [
    ...picks.map((study) => ({ study, isPick: true })),
    ...rest.map((study) => ({ study, isPick: false })),
  ];
}

/** Projects tagged with the track (everything on "All"). */
export function getProjects(track: Track): Project[] {
  return track === "all" ? projects : projects.filter((p) => p.tracks.includes(track));
}

/* ------------------------------ Tool usage ------------------------------ */

export interface ToolUsage {
  caseStudies: CaseStudy[];
  projects: Project[];
  experience: Experience[];
  note: string | null;
}

/** Everything on the site that used a tool, based only on the tags in content.ts. */
export function getToolUsage(tool: ToolId): ToolUsage {
  return {
    caseStudies: caseStudies.filter((s) => s.toolIds.includes(tool)),
    projects: projects.filter((p) => p.toolIds.includes(tool)),
    experience: experience.filter((e) => e.toolIds.includes(tool)),
    note: toolNotes[tool] ?? null,
  };
}

export interface ToolSummary {
  /** One sentence for the selection bar. */
  text: string;
  /** Matching cards visible on the current track. */
  visibleCount: number;
  /** Matching projects filtered out by the current track (visible on All). */
  hiddenCount: number;
}

export function formatList(items: string[], max = 3): string {
  if (items.length > max) return `${items.slice(0, max).join(", ")}, and ${items.length - max} more`;
  if (items.length <= 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * What to say when a tool is clicked. Preference order (per Sakshi's spec):
 * matching projects, then experience entries, then a tool note (AWS), then a neutral note.
 */
export function summarizeTool(tool: ToolId, track: Track): ToolSummary {
  const usage = getToolUsage(tool);
  const onTrack = new Set(getProjects(track).map((p) => p.slug));
  const visibleTitles = [
    ...usage.caseStudies.map((s) => s.title), // featured case studies are always on the page
    ...usage.projects.filter((p) => onTrack.has(p.slug)).map((p) => p.title),
  ];
  const hiddenCount = usage.projects.filter((p) => !onTrack.has(p.slug)).length;

  let text: string;
  if (visibleTitles.length > 0) {
    text = `Highlighted: ${formatList(visibleTitles)}.`;
  } else if (hiddenCount > 0) {
    text = `Used in ${hiddenCount} project${hiddenCount === 1 ? "" : "s"} shown on the All view.`;
  } else if (usage.experience.length > 0) {
    text = `Used at work: ${formatList(usage.experience.map((e) => `${e.role} (${e.org})`))}.`;
  } else {
    text = usage.note ?? toolFallbackNote;
  }
  return { text, visibleCount: visibleTitles.length, hiddenCount };
}
