"use client";

import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Terminal } from "@/components/Terminal";
import { profile } from "@/lib/data";

type IntroStage = "terminal" | "splash";

const PROJECT = profile.fullName;

const SETUP_COMMANDS = [
  `mkdir ${PROJECT}`,
  `cd ${PROJECT}`,
  "npm init -y",
  "npx create-next-app@latest . --ts --tailwind --app",
  "npm install gsap three motion",
  "npm run dev",
];

const SETUP_OUTPUTS: Record<number, string[]> = {
  0: [],
  1: [],
  2: [
    "Wrote to package.json:",
    `  name: "${PROJECT.toLowerCase()}"`,
    '  version: "0.1.0"',
  ],
  3: [
    "✔ Creating a new Next.js app in ./" + PROJECT,
    "✔ Initializing project with TypeScript",
    "✔ Installing dependencies",
    "✔ Success! Created " + PROJECT,
  ],
  4: [
    "added 48 packages in 2.1s",
    "found 0 vulnerabilities",
  ],
  5: [
    "",
    "  ▲ Next.js 16.3.0",
    "  - Local:   http://localhost:3000",
    "",
    "✓ Ready in 1.2s",
    "✓ Compiling / ...",
    "✓ Booting portfolio — " + profile.role,
  ],
};

export function Intro() {
  const [stage, setStage] = useState<IntroStage>("terminal");

  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    html.dataset.splash = "pending";

    return () => {
      if (html.dataset.splash !== "done") {
        html.style.overflow = prevOverflow;
      }
    };
  }, []);

  if (stage === "terminal") {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-deep"
        aria-hidden="true"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 55% at 50% 45%, color-mix(in srgb, var(--sage) 40%, transparent), transparent 70%)",
          }}
        />
        <Terminal
          commands={SETUP_COMMANDS}
          outputs={SETUP_OUTPUTS}
          username="zain"
          typingSpeed={36}
          delayBetweenCommands={520}
          initialDelay={500}
          completeDelay={1100}
          onComplete={() => setStage("splash")}
        />
      </div>
    );
  }

  return <SplashScreen />;
}
