import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/case-study/CaseStudyView";
import { SiteHeader, SkipLink } from "@/components/layout/SiteHeader";
import { caseStudies, profile } from "@/data/content";
import { getCaseStudy } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/seo";

/*
 * /projects/[slug]: the 4 case studies, all prerendered as static HTML at build time.
 * Any other slug renders the 404 page (notFound below).
 *
 * ensureStatic = "navigation": the whole page must be static (the build fails if
 * something request-specific sneaks in). It also makes an unknown slug render fully
 * before responding, so it gets a real 404 status instead of a 200 with a 404 page.
 */
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const title = `${study.title} case study`;
  return {
    title, // the root layout's template adds " | Sakshi Gupta"
    ...pageMetadata({
      path: `/projects/${study.slug}`,
      title: `${title} | ${profile.name}`,
      description: study.summary,
      type: "article",
    }),
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <SkipLink />
      <SiteHeader onHome={false} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <CaseStudyView study={study} />
      </main>
    </>
  );
}
