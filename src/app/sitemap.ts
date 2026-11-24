import type { MetadataRoute } from "next";
import { caseStudies, site } from "@/data/content";

/** /sitemap.xml: the home page and every case study, so search engines find them all. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((study) => ({
      url: `${site.url}/projects/${study.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
