import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { SiteHeader, SkipLink } from "@/components/layout/SiteHeader";
import { buttonPrimary } from "@/components/ui/styles";

// Next.js adds a noindex robots tag to 404 responses automatically.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <SiteHeader onHome={false} />
      <main id="main" tabIndex={-1} className="hero-glow focus:outline-none">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <p className="text-sm font-semibold tracking-wider text-secondary uppercase">404</p>
          <h1 className="mt-2 text-4xl text-ink sm:text-5xl">Page not found</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted">
            This page doesn&apos;t exist. It may have moved, or the link may have a typo.
          </p>
          <Link href="/" className={`${buttonPrimary} mt-8`}>
            <ArrowLeftIcon width={18} height={18} />
            Back to the home page
          </Link>
        </div>
      </main>
    </>
  );
}
