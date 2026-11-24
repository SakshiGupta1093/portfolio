"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { cameFromHome, isPlainClick } from "@/lib/return-to-home";

/**
 * "All work": goes Back when the visitor came from a home page card (keeping their
 * track and scroll position), otherwise links to the Work section on the home page.
 */
export function BackLink({ casePath }: { casePath: string }) {
  const router = useRouter();
  return (
    <Link
      href="/#work"
      onClick={(event) => {
        if (isPlainClick(event) && cameFromHome(casePath)) {
          event.preventDefault();
          router.back();
        }
      }}
      className="group inline-flex items-center gap-1.5 rounded-pill text-sm font-semibold text-ink-muted transition-colors hover:text-primary"
    >
      <ArrowLeftIcon width={16} height={16} className="transition-transform group-hover:-translate-x-0.5" />
      All work
    </Link>
  );
}
