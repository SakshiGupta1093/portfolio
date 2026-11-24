import type { MetadataRoute } from "next";
import { site } from "@/data/content";

/** /robots.txt: everything is public; points crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
