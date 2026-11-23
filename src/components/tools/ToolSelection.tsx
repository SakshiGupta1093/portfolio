"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ToolId } from "@/data/content";
import { getTrackToolIds, summarizeTool } from "@/lib/portfolio";
import { useTrack } from "@/lib/track-store";

interface ToolSelection {
  selected: ToolId | null;
  /** True when at least one card on the page used the selected tool. */
  hasVisibleMatch: boolean;
  toggle: (tool: ToolId) => void;
  clear: () => void;
}

const ToolSelectionContext = createContext<ToolSelection | null>(null);

/** Holds the tool clicked in the Tech Stack section, shared with every card on the page. */
export function ToolSelectionProvider({ children }: { children: ReactNode }) {
  const track = useTrack();
  const [selected, setSelected] = useState<ToolId | null>(null);
  const [prevTrack, setPrevTrack] = useState(track);

  // Switching to a track whose stack doesn't list the selected tool clears it for good.
  // This is React's "adjust state when an input changes" pattern: it runs during render,
  // so there's no effect and no flash of stale highlights.
  if (track !== prevTrack) {
    setPrevTrack(track);
    if (selected && !getTrackToolIds(track).has(selected)) setSelected(null);
  }

  const hasVisibleMatch = selected ? summarizeTool(selected, track).visibleCount > 0 : false;
  const toggle = useCallback((tool: ToolId) => setSelected((c) => (c === tool ? null : tool)), []);
  const clear = useCallback(() => setSelected(null), []);
  const value = useMemo(
    () => ({ selected, hasVisibleMatch, toggle, clear }),
    [selected, hasVisibleMatch, toggle, clear],
  );

  return <ToolSelectionContext.Provider value={value}>{children}</ToolSelectionContext.Provider>;
}

export function useToolSelection(): ToolSelection {
  const ctx = useContext(ToolSelectionContext);
  if (!ctx) throw new Error("useToolSelection must be used inside ToolSelectionProvider");
  return ctx;
}

export type HighlightState = "none" | "match" | "dim";

/** How a card should look given the selected tool and the tools that card used. */
export function useHighlight(toolIds: ToolId[]): { state: HighlightState; selected: ToolId | null } {
  const { selected, hasVisibleMatch } = useToolSelection();
  // Nothing on the page used this tool (e.g. Power BI): leave every card as is and let
  // the selection bar explain, instead of fading out the whole page.
  if (!selected || !hasVisibleMatch) return { state: "none", selected };
  return { state: toolIds.includes(selected) ? "match" : "dim", selected };
}

export const highlightClasses: Record<HighlightState, string> = {
  none: "border-line hover:-translate-y-1 hover:shadow-lift",
  match: "border-primary shadow-lift ring-2 ring-primary/35",
  dim: "border-line opacity-60",
};
