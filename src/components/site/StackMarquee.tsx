"use client";

import { skillGroups } from "@/lib/data";

const items = skillGroups.flatMap((g) => g.items);

export function StackMarquee() {
  const loop = [...items, ...items];

  return (
    <section
      className="relative overflow-hidden border-y border-line bg-void-lift py-5"
      aria-label="Technology stack"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-void-lift to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-void-lift to-transparent sm:w-24" />

      <div className="marquee-track flex w-max gap-10 whitespace-nowrap will-change-transform">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-10 font-display text-sm font-semibold tracking-wide text-ink-soft sm:text-base"
          >
            <span className="text-ink">{item}</span>
            <span className="text-accent" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
