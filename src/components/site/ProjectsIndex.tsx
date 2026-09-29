"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/lib/data";

export function ProjectsIndex() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-project-row]");
      rows.forEach((row) => {
        const media = row.querySelector("[data-project-index]");
        const body = row.querySelector("[data-project-body]");

        gsap.fromTo(
          media,
          { y: 36, opacity: 0.2 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              end: "top 48%",
              scrub: 0.85,
            },
          },
        );

        gsap.fromTo(
          body,
          { y: 48, opacity: 0.25 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              end: "top 45%",
              scrub: 0.9,
            },
          },
        );

        gsap.fromTo(
          row.querySelector("[data-project-rule]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              end: "top 50%",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="projects"
      ref={root}
      className="relative border-t border-line bg-void"
      aria-label="Key projects"
    >
      <div className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 sm:pt-20">
        <p className="telemetry text-accent">02 · Projects</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
          Key builds
        </h2>
        <p className="measure mt-3 text-ink-soft">
          SaaS, logistics, and marketplace systems shipped for clients in the
          United States and the Middle East.
        </p>
      </div>

      <ul className="mx-auto mt-12 max-w-[1400px] list-none px-5 pb-20 sm:px-8 sm:pb-28 md:mt-16">
        {projects.map((project, i) => (
          <li
            key={project.id}
            data-project-row
            data-cursor={project.name}
            className="border-t border-line py-10 first:border-t-0 sm:py-14 md:py-16"
          >
            <div className="grid gap-6 md:grid-cols-[minmax(0,0.28fr)_minmax(0,0.72fr)] md:items-start md:gap-10 lg:gap-16">
              <div data-project-index className="flex items-baseline gap-4 md:flex-col md:gap-3">
                <span className="font-display text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-none tracking-[-0.05em] text-ink/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="telemetry text-accent">{project.region}</span>
              </div>

              <div data-project-body>
                <div
                  data-project-rule
                  className="mb-6 h-px w-16 origin-left bg-accent md:w-24"
                  aria-hidden
                />
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                  {project.name}
                </h3>
                <p className="mt-1 text-base font-medium text-accent sm:text-lg">
                  {project.label}
                </p>
                <p className="measure mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {project.summary}
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {project.stack.map((s) => (
                    <li key={s} className="telemetry text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
