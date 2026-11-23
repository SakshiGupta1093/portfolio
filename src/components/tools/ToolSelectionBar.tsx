"use client";

import { useEffect } from "react";
import { XIcon } from "@/components/icons";
import { summarizeTool, toolLabel } from "@/lib/portfolio";
import { setTrack, useTrack } from "@/lib/track-store";
import { useToolSelection } from "./ToolSelection";

/** Scrolls to the first highlighted card and moves keyboard focus into it. */
function jumpToFirstMatch() {
  const card = document.querySelector<HTMLElement>('[data-highlighted="true"]');
  if (!card) return;
  card.scrollIntoView({ block: "center" });
  const link = card.querySelector<HTMLElement>("a");
  if (link) {
    link.focus({ preventScroll: true });
  } else {
    card.setAttribute("tabindex", "-1");
    card.focus({ preventScroll: true });
  }
}

/**
 * Floating bar shown while a tool is selected. It stays visible while the visitor
 * scrolls down to the highlighted cards. Leaves room on the right for the chat button.
 * Escape or the X clears the selection.
 */
export function ToolSelectionBar() {
  const track = useTrack();
  const { selected, clear } = useToolSelection();

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, clear]);

  const summary = selected ? summarizeTool(selected, track) : null;

  return (
    <>
      {/* Always mounted so screen readers announce each new selection. */}
      <p className="sr-only" role="status" aria-live="polite">
        {selected && summary ? `${toolLabel(selected)}. ${summary.text}` : ""}
      </p>

      {selected && summary && (
        <div className="fixed bottom-4 left-4 right-20 z-40 sm:right-auto sm:left-1/2 sm:w-[min(36rem,calc(100%-10rem))] sm:-translate-x-1/2">
          <div className="animate-slide-up flex items-start gap-3 rounded-card border border-line bg-surface/95 p-4 shadow-lift backdrop-blur-md">
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold text-ink">{toolLabel(selected)}</p>
              <p className="mt-0.5 text-ink-muted">{summary.text}</p>
              {(summary.visibleCount > 0 || summary.hiddenCount > 0) && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {summary.visibleCount > 0 && (
                    <button
                      type="button"
                      onClick={jumpToFirstMatch}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Show me
                    </button>
                  )}
                  {summary.hiddenCount > 0 && track !== "all" && (
                    <button
                      type="button"
                      onClick={() => setTrack("all")}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      See {summary.hiddenCount} more on All
                    </button>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={clear}
              aria-label="Clear tool highlight"
              title="Clear (Esc)"
              className="-m-1 inline-flex size-8 shrink-0 items-center justify-center rounded-pill text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <XIcon width={18} height={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
