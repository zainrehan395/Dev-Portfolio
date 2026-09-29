import type { Metadata } from "next";
import { Archivo, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Zain-Ul-Abideen - Full Stack Software Engineer",
  description:
    "Full Stack Software Engineer shipping SaaS, logistics, and marketplace platforms with React, Next.js, Node.js, and AWS. Book a 30-minute discovery call.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      {/*
        THESIS: Nocturne Systems — cinematic full-stack craft under amber registration light.
        OWN-WORLD: Near-black void, molten amber accent, dense typographic collision; Archivo + Sora.
        STORY: Expensive first 10s → case chapters → interactive skills.glb systems → book a call.
        FIRST VIEWPORT: Full-bleed atmosphere; oversized ZAIN wordmark; role + line + magnetic CTAs; ≥3 parallax layers.
        FORM: Nocturne Systems · seed: brief-committed (user mission override).
      */}
      <body className="relative min-h-full flex flex-col bg-void text-ink">
        <div className="site-grain" aria-hidden />
        <div className="site-vignette" aria-hidden />
        {children}
      </body>
    </html>
  );
}
