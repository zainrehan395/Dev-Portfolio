import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import { cn } from "@/lib/utils";
import HUD from "@/components/HUD";
import Noise from "@/components/Noise";
import { SITE_CONFIG } from "@/lib/config";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s · ${SITE_CONFIG.shortName}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Zain-ul-Abideen",
    "Software Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "AWS",
    "Lahore",
    "Portfolio",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: "/",
    siteName: SITE_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_CONFIG.name,
  jobTitle: "Software Engineer",
  email: SITE_CONFIG.email,
  telephone: SITE_CONFIG.phone,
  url: SITE_CONFIG.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  sameAs: Object.values(SITE_CONFIG.socials).filter(
    (url) => typeof url === "string" && url.length > 0
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(jetbrainsMono.variable, outfit.variable, "dark")}
    >
      <body className="antialiased bg-[#0c0f0d] text-white font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-brand focus:text-[#052e1c] focus:px-4 focus:py-2 focus:rounded-md focus:font-mono focus:text-xs focus:font-bold"
        >
          Skip to content
        </a>
        <noscript>
          <div
            style={{
              padding: "2rem",
              fontFamily: "monospace",
              color: "#34d399",
              background: "#0c0f0d",
            }}
          >
            This portfolio works best with JavaScript enabled. Email{" "}
            {SITE_CONFIG.email} to get in touch.
          </div>
        </noscript>
        <SmoothScroll>
          <Noise />
          <HUD />
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
