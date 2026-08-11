"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { skillStops } from "@/lib/data";

const SkillsCanvas = dynamic(() => import("@/components/skills/SkillsCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-surface">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-deep/70">
        Loading skills scene…
      </p>
    </div>
  ),
});

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      const next = total > 0 ? scrolled / total : 0;
      scroll.current = next;
      setProgress(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = useMemo(() => {
    const i = Math.floor(progress * skillStops.length);
    return Math.min(skillStops.length - 1, Math.max(0, i));
  }, [progress]);

  const active = skillStops[activeIndex];

  if (reduceMotion) {
    return (
      <section id="skills" className="relative border-t border-line/80 bg-surface py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-deep/70">
            Capabilities
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-deep sm:text-5xl">
            Tools I ship with every day
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillStops.map((stop) => (
              <li key={stop.id} className="border border-deep/15 bg-sage/40 p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-deep/65">
                  {stop.group}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-deep">
                  {stop.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-deep/75">{stop.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative border-t border-line/80 bg-surface"
      style={{ height: `${skillStops.length * 100}vh` }}
      aria-label="Skills camera scroll"
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <SkillsCanvas scroll={scroll} eventSource={stageRef} />

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-between px-5 py-24 sm:px-8 sm:py-28">
            <div className=" flex flex-col gap-8 items-start">
              <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-deep/70">
                Capabilities · Scroll to explore
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-deep sm:text-5xl">
                Tools I ship with every day
              </h2>
              </div>
              <div className="max-w-lg transition-opacity duration-300">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-deep/70">
                {active.group}
              </p>
              <h3 className="mt-2 font-display text-5xl font-bold tracking-tight text-deep sm:text-6xl">
                {active.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-deep/80 sm:text-lg">
                {active.copy}
              </p>
            </div>
            </div>

            {/* <div className="max-w-lg transition-opacity duration-300">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-deep/70">
                {active.group}
              </p>
              <h3 className="mt-2 font-display text-5xl font-bold tracking-tight text-deep sm:text-6xl">
                {active.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-deep/80 sm:text-lg">
                {active.copy}
              </p>
            </div> */}
          </div>

          {/* <span
            className="absolute right-5 top-24 font-display text-5xl font-thin tabular-nums text-deep/20 sm:right-8 sm:top-28 sm:text-7xl md:text-8xl"
            aria-hidden="true"
          >
            {progress.toFixed(2)}
          </span> */}
        </div>
      </div>
    </section>
  );
}
