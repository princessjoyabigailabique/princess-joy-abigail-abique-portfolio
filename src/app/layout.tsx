import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeScript from "@/components/ThemeScript";
import MagicCursor from "@/components/MagicCursor";
import AmbientGarden from "@/components/AmbientGarden";
import LoadingIntro from "@/components/LoadingIntro";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.shortName}` },
  description: SITE.description,
  icons: { icon: "/images/abique-emblem.png", apple: "/images/abique-emblem.png" },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
  },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = { themeColor: "#0a0714", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <AmbientGarden />
        <LoadingIntro />
        <MagicCursor />
        <a href="#main" className="intro-skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent2 focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
