import type { Metadata, Viewport } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialRail } from "@/components/layout/SocialLinks";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { profile, site } from "@/data/content";
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

/*
 * Site-wide defaults. metadataBase turns every relative URL in page metadata
 * (canonical links, og:url) into an absolute https://sakshigupta.vercel.app/... URL.
 * Pages add their own canonical link and Open Graph tags (see src/lib/seo.ts).
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${profile.name}` },
  description: site.description,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: "en_US",
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary", title: site.title, description: site.description },
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
      <body className="min-h-dvh antialiased">
        {children}
        <SocialRail />
        <SiteFooter />
      </body>
    </html>
  );
}
