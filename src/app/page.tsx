import { SiteHeader, SkipLink } from "@/components/layout/SiteHeader";
import { About } from "@/components/sections/About";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Hero } from "@/components/sections/Hero";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { TechStack } from "@/components/sections/TechStack";
import { ToolSelectionProvider } from "@/components/tools/ToolSelection";
import { ToolSelectionBar } from "@/components/tools/ToolSelectionBar";
import { site } from "@/data/content";
import { pageMetadata } from "@/lib/seo";

// Title comes from the root layout's default. Canonical URL: https://sakshigupta.vercel.app
export const metadata = pageMetadata({ path: "/", title: site.title, description: site.description });

/*
 * Home page. Prerendered as static HTML (the "All" view) for speed and SEO.
 * After hydration, a #swe / #ml / #data hash tailors every section.
 * The footer and the social icon rail come from the root layout.
 * Coming next: Experience, Publications, Education, Awards, full footer (Round 4)
 * and the chatbot (Round 5).
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
      </main>
      <ToolSelectionBar />
    </ToolSelectionProvider>
  );
}
