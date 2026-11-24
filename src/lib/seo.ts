import type { Metadata } from "next";
import { profile } from "@/data/content";

/*
 * Per-page SEO. Next.js merges metadata shallowly, so a page that sets openGraph
 * replaces the layout's openGraph completely. Every page therefore builds its own full
 * set here. Paths are relative; metadataBase (the site URL, set in the root layout)
 * turns them into absolute URLs.
 */
export function pageMetadata({
  path,
  title,
  description,
  type = "website",
}: {
  path: string;
  /** Full title for link previews, e.g. "EDGARQuery case study | Sakshi Gupta". */
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  return {
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: profile.name,
      locale: "en_US",
      title,
      description,
    },
    // "summary" until the Open Graph image exists (Round 6), then "summary_large_image".
    twitter: { card: "summary", title, description },
  };
}
