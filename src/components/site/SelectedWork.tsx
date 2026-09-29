"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { experience } from "@/lib/data";

export function SelectedWork() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const distance = () =>
        Math.max(0, track.current!.scrollWidth - window.innerWidth);

      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance() * 1.15}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      const panels = gsap.utils.toArray<HTMLElement>("[data-work-panel]");
      panels.forEach((panel) => {
        const media = panel.querySelector("[data-work-media]");
        const copy = panel.querySelector("[data-work-copy]");
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.12, opacity: 0.55 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 80%",
                end: "left 30%",
                scrub: true,
              },
            },
          );
        }
        if (copy) {
          gsap.fromTo(
            copy,
            { y: 40, opacity: 0.35 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 75%",
                end: "left 35%",
                scrub: true,
              },
            },
          );
        }
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [reduce]);

  return (
    <section
      id="work"
      ref={wrap}
      className="relative overflow-hidden border-t border-line bg-void-lift"
      aria-label="Experience"
    >
      <div className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 sm:pt-20 md:absolute md:inset-x-0 md:top-0 md:z-10 md:pt-16">
        <p className="telemetry text-accent">01 · Experience</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
          Roles that shipped
        </h2>
        <p className="measure mt-3 text-ink-soft">
          Production delivery across frontend, backend, and cloud — scrubbed as
          frames, not a quiet list.
        </p>
      </div>

      <div
        ref={track}
        className="flex flex-col gap-12 px-5 pb-20 pt-10 sm:px-8 md:h-[100dvh] md:flex-row md:items-stretch md:gap-0 md:px-0 md:pb-20 md:pt-40"
      >
        {experience.map((job, i) => (
          <article
            key={job.id}
            data-work-panel
            data-cursor={job.title}
            className="relative w-full shrink-0 md:h-full md:w-[78vw] md:max-w-[900px] md:px-10 lg:w-[62vw]"
          >
            <div className="flex h-full flex-col justify-end gap-0 overflow-hidden border border-line bg-void-panel md:min-h-[62vh]">
              <div
                data-work-media
                className="relative min-h-[180px] flex-1 overflow-hidden bg-[linear-gradient(145deg,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_55%),radial-gradient(ellipse_at_70%_20%,color-mix(in_srgb,#4a5d8a_35%,transparent),transparent_60%)] md:min-h-0"
              >
                <div className="absolute inset-0 flex items-end justify-between p-5 sm:p-6">
                  <span className="font-display text-[clamp(4rem,10vw,7rem)] font-extrabold leading-none tracking-[-0.05em] text-ink/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="telemetry text-accent">{job.year}</span>
                </div>
                <div className="absolute right-0 top-0 h-full w-1 bg-accent/80" />
              </div>

              <div
                data-work-copy
                className="border-t border-line bg-void/80 p-6 sm:p-8"
              >
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                  {job.title}
                </h3>
                <p className="mt-1 text-base font-medium text-accent sm:text-lg">
                  {job.category}
                </p>
                <p className="measure mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {job.summary}
                </p>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <p className="text-sm font-medium text-ink">{job.outcome}</p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {job.stack.map((s) => (
                      <li key={s} className="telemetry text-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
        <div className="hidden w-[10vw] shrink-0 md:block" aria-hidden />
      </div>
    </section>
  );
}
