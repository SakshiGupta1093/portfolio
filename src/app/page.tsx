import { SiteHeader, SkipLink } from "@/components/layout/SiteHeader";
import { About } from "@/components/sections/About";
import { EducationAndAwards } from "@/components/sections/EducationAndAwards";
import { Experience } from "@/components/sections/Experience";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Hero } from "@/components/sections/Hero";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { Publications } from "@/components/sections/Publications";
import { TechStack } from "@/components/sections/TechStack";
import { ToolSelectionProvider } from "@/components/tools/ToolSelection";
import { ToolSelectionBar } from "@/components/tools/ToolSelectionBar";
import { site } from "@/data/content";
import { pageMetadata } from "@/lib/seo";

// Title comes from the root layout's default. Canonical URL: https://sakshigupta.vercel.app
export const metadata = pageMetadata({ path: "/", title: site.title, description: site.description });

/*
 * Home page. Prerendered as static HTML (the "All" view) for speed and SEO.
 * After hydration, a #swe / #ml / #data hash tailors the track-aware sections
 * (hero tagline, Resume button, Tech Stack, Featured work, More projects).
 * Experience, Publications, Education, and Awards are the same on every track and
 * render as plain server HTML. The footer and the social icon rail come from the
 * root layout. Coming next: the chatbot (Round 5).
 */
export default function HomePage() {
  return (
    <ToolSelectionProvider>
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <FeaturedWork />
        <TechStack />
        <ProjectsGrid />
        <Experience />
        <Publications />
        <EducationAndAwards />
      </main>
      <ToolSelectionBar />
    </ToolSelectionProvider>
  );
}
