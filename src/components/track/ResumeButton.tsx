"use client";

import { FileTextIcon } from "@/components/icons";
import { buttonPrimary } from "@/components/ui/styles";
import { tracks } from "@/data/content";
import { useTrack } from "@/lib/track-store";

/**
 * Opens the resume that matches the selected track in a new tab, using the browser's
 * own PDF viewer (visitors can still save it from there). noopener keeps the new tab
 * from reaching back into this page through window.opener.
 */
export function ResumeButton() {
  const track = useTrack();
  const { resume, label } = tracks[track];
  const text = track === "all" ? "Resume" : `${label} resume`;
  return (
    <a href={resume.href} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
      <FileTextIcon width={18} height={18} />
      {text}
      <span className="sr-only">(PDF, opens in a new tab)</span>
    </a>
  );
}
