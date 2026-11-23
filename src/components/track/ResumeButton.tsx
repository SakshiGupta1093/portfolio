"use client";

import { DownloadIcon } from "@/components/icons";
import { buttonPrimary } from "@/components/ui/styles";
import { tracks } from "@/data/content";
import { useTrack } from "@/lib/track-store";

/** Downloads the resume that matches the selected track. */
export function ResumeButton() {
  const track = useTrack();
  const { resume, label } = tracks[track];
  const text = track === "all" ? "Resume" : `${label} resume`;
  return (
    <a href={resume.href} download={resume.downloadName} className={buttonPrimary}>
      <DownloadIcon width={18} height={18} />
      {text}
      <span className="sr-only">(PDF)</span>
    </a>
  );
}
