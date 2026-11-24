"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { CaseStudySlug } from "@/data/content";
import { isPlainClick, rememberHopFromHome } from "@/lib/return-to-home";

/**
 * A link from the home page to a case study. Records the hop so the case study's
 * "All work" link can go Back to exactly where the visitor was (see return-to-home.ts).
 */
export function CaseStudyLink({ slug, className, children }: { slug: CaseStudySlug; className?: string; children: ReactNode }) {
  const path = `/projects/${slug}`;
  return (
    <Link
      href={path}
      onClick={(event) => {
        if (isPlainClick(event)) rememberHopFromHome(path);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
