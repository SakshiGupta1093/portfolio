import type { Metadata, Viewport } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { site } from "@/data/content";
import "./globals.css";

// Body: DM Sans, clean and very readable. Headings: Nunito, rounded and friendly at heavy weights.
// next/font self-hosts both at build time: no request to Google, no layout shift.
const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Nunito({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1916" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the head script sets data-theme before React hydrates.
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
