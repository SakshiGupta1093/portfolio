"use client";

import type { ReactNode } from "react";

/**
 * In-page link that scrolls to a section WITHOUT changing the URL hash.
 * The hash holds the selected track (#swe, #ml, #data), so a plain <a href="#about">
 * would wipe it out. The href stays real so it still works without JavaScript.
 */
export function SectionLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView(); // smooth via CSS scroll-behavior, instant with reduced motion
        target.focus({ preventScroll: true }); // keyboard and screen reader users land in the section
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}
