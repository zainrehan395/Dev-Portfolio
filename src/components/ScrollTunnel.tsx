"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CardSwap, { Card } from "@/components/CardSwap";

const panels = [
  {
    title: "Frontend",
    copy: "React, Next.js, and Nuxt.js — SSR, SSG, and interfaces built for performance and SEO.",
    tag: "UI",
    focus: "Interfaces that stay fast under real traffic",
    detail:
      "Component systems, typed UI contracts, and rendering strategies chosen for the product — not the trend.",
    points: [
      "SSR / SSG for SEO and first paint",
      "State with Redux, Zustand, and Context",
      "Accessible, responsive product UI",
    ],
    stack: ["React", "Next.js", "Nuxt.js", "TypeScript", "Tailwind"],
  },
  {
    title: "Backend",
    copy: "Node.js, NestJS, Express, and Python services with REST, GraphQL, and tRPC APIs.",
    tag: "API",
    focus: "APIs and services that stay predictable",
    detail:
      "Clear boundaries between UI and domain logic, with contracts that make refactors safer across the stack.",
    points: [
      "REST, GraphQL, and tRPC endpoints",
      "NestJS / Express service architecture",
      "SQL and MongoDB data modeling",
    ],
    stack: ["Node.js", "NestJS", "Express", "Python", "GraphQL"],
  },
  {
    title: "Cloud",
    copy: "AWS S3, Lambda, and CloudFront architectures for high availability and scale.",
    tag: "AWS",
    focus: "Infrastructure that matches product load",
    detail:
      "Cloud pieces wired for delivery and availability — storage, compute, and edge caching as one system.",
    points: [
      "S3 for durable asset delivery",
      "Lambda for event-driven work",
      "CloudFront for global edge cache",
    ],
    stack: ["AWS S3", "Lambda", "CloudFront", "Docker", "Vercel"],
  },
  {
    title: "Ship",
    copy: "CI/CD with GitHub Actions and AWS Pipelines — faster, more consistent releases.",
    tag: "DevOps",
    focus: "Release paths that stay boring (on purpose)",
    detail:
      "Automation that shortens the loop from merge to production without sacrificing consistency.",
    points: [
      "GitHub Actions and AWS Pipelines",
      "Dockerized, repeatable deploys",
      "Reviewable, Agile delivery cadence",
    ],
    stack: ["GitHub Actions", "AWS Pipelines", "Docker", "CircleCI"],
  },
];

function scrollToPanel(section: HTMLElement, index: number) {
  const total = section.offsetHeight - window.innerHeight;
  const target = section.offsetTop + (total * (index + 0.35)) / panels.length;
  window.scrollTo({ top: target, behavior: "smooth" });
}

export function ScrollTunnel() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const rafRef = useRef(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const measure = () => {
      const el = sectionRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(
        Math.max(-el.getBoundingClientRect().top, 0),
        total,
      );
      const next = total > 0 ? scrolled / total : 0;
      setProgress(next);

      // Hysteresis around panel boundaries so index doesn't flicker
      const raw = next * panels.length;
      const current = activeRef.current;
      let idx = current;
      if (raw >= current + 0.62) {
        idx = Math.min(panels.length - 1, Math.floor(raw));
      } else if (raw < current - 0.38) {
        idx = Math.max(0, Math.floor(raw));
      }

      if (idx !== current) {
        activeRef.current = idx;
        setActiveIndex(idx);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const active = panels[activeIndex];
  const stepLabel = useMemo(
    () =>
      `${String(activeIndex + 1).padStart(2, "0")} / ${String(panels.length).padStart(2, "0")}`,
    [activeIndex],
  );

  if (reduceMotion) {
    return (
      <section
        id="depth"
        className="relative border-t border-line bg-deep py-24 sm:py-32"
        aria-label="Stack layers"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Capabilities
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            The stack in depth
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/70">
            Frontend to delivery — the layers I own when shipping production
            systems.
          </p>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2">
            {panels.map((panel) => (
              <li
                key={panel.title}
                className="liquid-glass-panel flex flex-col justify-between p-6"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage">
                  {panel.tag}
                </span>
                <div className="mt-6">
                  <h3 className="font-display text-3xl font-bold tracking-tight text-cream">
                    {panel.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/75">
                    {panel.copy}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      id="depth"
      ref={sectionRef}
      className="relative border-t border-line bg-deep"
      style={{ height: `${panels.length * 120}vh` }}
      aria-label="Scroll through the stack"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="absolute left-[58%] top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/12"
              style={{ width: `${22 + n * 14}vmin` }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 45% 50% at 62% 50%, color-mix(in srgb, var(--sage) 22%, transparent), transparent 68%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-6 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:py-16 xl:gap-12">
          {/* Left narrative — tighter, one job */}
          <div className="relative z-20 flex max-w-lg flex-col justify-center lg:max-w-none lg:pr-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Scroll through · {stepLabel}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-cream sm:text-4xl">
              The stack in depth
            </h2>

            <div
              className="mt-4 h-px w-full max-w-xs bg-cream/15"
              aria-hidden="true"
            >
              <div
                className="h-px bg-sage transition-[width] duration-500 ease-out"
                style={{ width: `${Math.max(10, progress * 100)}%` }}
              />
            </div>

            <div
              key={active.title}
              className="mt-7 animate-[skillIn_0.45s_var(--ease-out)_both]"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage">
                {active.tag} · Layer {stepLabel}
              </p>
              <h3 className="mt-2 font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                {active.title}
              </h3>
              <p className="mt-2 text-base font-medium text-cream/90">
                {active.focus}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
                {active.detail}
              </p>

              <ul className="mt-5 space-y-2">
                {active.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed text-cream/75"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {active.stack.map((item) => (
                  <span
                    key={item}
                    className="liquid-glass-item rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/90"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <nav
              className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-cream/15 pt-5"
              aria-label="Stack layers"
            >
              {panels.map((panel, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={panel.title}
                    type="button"
                    onClick={() => {
                      const el = sectionRef.current;
                      if (el) scrollToPanel(el, i);
                    }}
                    className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                      isActive
                        ? "text-cream"
                        : "text-cream/40 hover:text-cream/70"
                    }`}
                  >
                    <span className={isActive ? "text-sage" : ""}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mx-1.5 text-cream/25">·</span>
                    {panel.title}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right card stack — centered in column */}
          <div className="relative flex h-[340px] items-center justify-center sm:h-[400px] lg:h-[min(72vh,520px)]">
            <CardSwap
              align="center"
              width={460}
              height={340}
              cardDistance={42}
              verticalDistance={48}
              activeIndex={activeIndex}
              skewAmount={4}
              easing="linear"
              className="origin-center scale-[0.92] sm:scale-100"
              onCardClick={(idx) => {
                const el = sectionRef.current;
                if (el) scrollToPanel(el, idx);
              }}
            >
              {panels.map((panel) => (
                <Card
                  key={panel.title}
                  customClass="flex cursor-pointer flex-col justify-between p-7 sm:p-9"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage">
                    {panel.tag}
                  </span>
                  <div>
                    <h3 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                      {panel.title}
                    </h3>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-cream/75">
                      {panel.copy}
                    </p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
}
