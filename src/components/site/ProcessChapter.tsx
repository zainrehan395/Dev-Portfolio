"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { processSteps } from "@/lib/data";

export function ProcessChapter() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-process-panel]");
      const ctx = gsap.context(() => {
        panels.forEach((panel, i) => {
          if (i === panels.length - 1) return;

          ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            endTrigger: panels[panels.length - 1],
            end: "top top",
            pin: true,
            pinSpacing: false,
          });

          gsap.to(panel, {
            scale: 0.92,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });

          const title = panel.querySelector("[data-process-title]");
          if (title) {
            gsap.fromTo(
              title,
              { xPercent: -8, opacity: 0.4 },
              {
                xPercent: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 80%",
                  end: "top 30%",
                  scrub: true,
                },
              },
            );
          }
        });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reduce]);

  return (
    <section
      id="process"
      ref={root}
      className="relative border-t border-line bg-void text-ink"
      aria-label="How I work"
    >
      <div className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 sm:pt-20">
        <p className="telemetry text-accent">Process</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          How I work
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          Discover, architect, build, optimize — pinned beats, not a checklist.
        </p>
      </div>

      <div className="relative mt-10 md:mt-8">
        {processSteps.map((step, i) => (
          <div
            key={step.title}
            data-process-panel
            className="relative flex min-h-[72vh] items-center border-t border-line bg-void md:min-h-[100dvh]"
            style={{
              backgroundImage: `radial-gradient(ellipse 50% 40% at ${20 + i * 18}% 30%, color-mix(in srgb, var(--accent) ${8 + i * 2}%, transparent), transparent 70%)`,
            }}
          >
            <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 py-16 sm:px-8 md:grid-cols-[0.28fr_0.72fr] md:items-end md:py-24">
              <p className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(processSteps.length).padStart(2, "0")}
              </p>
              <div>
                <h3
                  data-process-title
                  className="font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em]"
                >
                  {step.title}
                </h3>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                  {step.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
