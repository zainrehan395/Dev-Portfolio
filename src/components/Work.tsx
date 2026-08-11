"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const [openId, setOpenId] = useState(projects[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const items = list.querySelectorAll<HTMLElement>(".work-item");
    const ctx = gsap.context(() => {
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: i % 2 === 0 ? -40 : 40,
            rotateY: i % 2 === 0 ? 18 : -18,
            z: -60,
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            z: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, list);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="relative border-t border-line/80 bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-14 max-w-2xl">
          <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
            Building production systems end to end
          </h2>
          <p className="mt-4 text-lg text-sage">
            Roles where I shipped across frontend, backend, and cloud - from intern to full-stack engineer.
          </p>
        </div>

        <ul ref={listRef} className="flex flex-col gap-3" style={{ perspective: "1000px" }}>
          {projects.map((project, index) => {
            const open = openId === project.id;
            return (
              <li key={project.id} className="work-item will-3d group">
                <button
                  type="button"
                  className={`liquid-glass-panel flex w-full items-start justify-between gap-6 px-5 py-6 text-left transition-[border-color,background] duration-200 sm:items-center sm:px-7 sm:py-7 ${
                    open ? "border-cream/35" : "hover:border-cream/30"
                  }`}
                  onClick={() => setOpenId(open ? "" : project.id)}
                  aria-expanded={open}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
                    <span className="font-mono text-xs text-sage">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                          {project.title}
                        </h3>
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage">
                          {project.category}
                        </span>
                      </div>
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-2xl text-base leading-relaxed text-cream/75">
                            {project.summary}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.stack.map((tech) => (
                              <span
                                key={tech}
                                className="liquid-glass-item rounded-lg px-2.5 py-1 font-mono text-[11px] text-cream"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <p className="mt-4 text-sm font-medium text-cream">
                            {project.outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-sage">{project.year}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
