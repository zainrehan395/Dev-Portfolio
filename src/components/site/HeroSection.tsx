"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { Magnetic } from "./Magnetic";
import { profile } from "@/lib/data";

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const spotlight = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!root.current) return;

    const chars = gsap.utils.toArray<HTMLElement>("[data-hero-char]");

    if (reduce) {
      gsap.set(chars, { clearProps: "all" });
      gsap.set("[data-hero-line]", { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(chars, {
        yPercent: 115,
        duration: 1.1,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.15,
        overwrite: "auto",
      });

      gsap.fromTo(
        "[data-hero-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.05,
          ease: "power3.inOut",
          delay: 0.65,
          transformOrigin: "left center",
        },
      );

      gsap.to("[data-hero-layer='deep']", {
        yPercent: 26,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to("[data-hero-layer='mid']", {
        yPercent: 14,
        xPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to("[data-hero-layer='near']", {
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    const el = root.current;
    const onMove = (e: MouseEvent) => {
      if (!spotlight.current) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      spotlight.current.style.setProperty("--sx", `${x}%`);
      spotlight.current.style.setProperty("--sy", `${y}%`);
    };
    el.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mousemove", onMove);
      ctx.revert();
      gsap.set(chars, { clearProps: "transform" });
    };
  }, [reduce]);

  const brand = profile.name.toUpperCase();

  return (
    <section
      id="top"
      ref={root}
      className="nocturne-field relative min-h-[100dvh] overflow-hidden pt-[var(--nav-h)]"
      aria-label="Introduction"
    >
      {/* Layer 1 — volumetric atmosphere + pointer spotlight */}
      <div
        data-hero-layer="deep"
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -left-[18%] top-[0%] h-[75vmin] w-[75vmin] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_26%,transparent),transparent_68%)] blur-2xl" />
        <div className="absolute -right-[8%] bottom-[-10%] h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,#3d4f78_32%,transparent),transparent_70%)] blur-3xl" />
        <div className="absolute left-[40%] top-[35%] h-[45vmin] w-[45vmin] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--ink)_8%,transparent),transparent_70%)] blur-xl" />
        {!reduce && (
          <div
            ref={spotlight}
            className="hero-spotlight absolute inset-0 opacity-70"
          />
        )}
      </div>

      {/* Layer 2 — ghost type collision through the stage */}
      <div
        data-hero-layer="mid"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <p className="absolute left-[-4%] top-[18%] font-display text-[clamp(5.5rem,18vw,14rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-stroke select-none whitespace-nowrap opacity-50">
          FULL&nbsp;STACK
        </p>
        <p className="absolute bottom-[6%] right-[-6%] font-display text-[clamp(4rem,14vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-ink/[0.06] select-none whitespace-nowrap">
          SYSTEMS
        </p>
        <div className="absolute left-[8%] top-[42%] h-px w-[28vw] bg-line-strong" />
        <div className="absolute left-[8%] top-[42%] h-[18vh] w-px bg-line-strong" />
      </div>

      {/* Layer 3 — telemetry chrome */}
      <div
        data-hero-layer="near"
        className="pointer-events-none absolute inset-x-0 top-[var(--nav-h)] hidden h-[calc(100%-var(--nav-h))] lg:block"
        aria-hidden
      >
        <div className="absolute right-[5%] top-[10%] w-[min(36vw,400px)] border border-line bg-void-panel/55 p-5 shadow-[0_0_60px_color-mix(in_srgb,var(--accent)_12%,transparent)]">
          <div className="flex items-center justify-between">
            <p className="telemetry text-accent">SYS / LIVE</p>
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
          </div>
          <p className="mt-5 font-display text-3xl font-bold tracking-tight text-ink">
            {profile.years} years
          </p>
          <p className="mt-1 text-sm text-ink-soft">shipping production systems</p>
          <div
            data-hero-line
            className="mt-6 h-px w-full origin-left bg-accent"
          />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            React · Next.js · Node · NestJS · AWS · AI tooling
          </p>
          <p className="mt-4 telemetry">{profile.location}</p>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-var(--nav-h))] max-w-[1400px] flex-col justify-start px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:justify-center lg:pt-8">
        <div className="w-full max-w-4xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 text-sm font-semibold tracking-wide text-accent sm:mb-4"
          >
            {profile.role}
          </motion.p>

          <h1 className="font-display text-[clamp(5rem,18vw,10.5rem)] font-extrabold leading-[0.8] tracking-[-0.055em] text-ink">
            <span className="sr-only">{profile.fullName}</span>
            <span aria-hidden className="flex flex-wrap gap-x-[0.02em]">
              {brand.split("").map((ch, i) => (
                <span key={`${ch}-${i}`} className="mask-reveal">
                  <span data-hero-char className="inline-block">
                    {ch}
                  </span>
                </span>
              ))}
            </span>
            <span
              aria-hidden
              className="mt-3 block font-display text-[clamp(1.1rem,2.3vw,1.65rem)] font-semibold tracking-[-0.02em] text-ink-soft"
            >
              {profile.fullName}
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-[40ch] text-base leading-relaxed text-ink-soft sm:mt-8 sm:text-lg"
          >
            Scalable SaaS, logistics, and marketplace systems — React to AWS,
            with AI-assisted velocity.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic as="a" href="#book" strength={0.32}>
              <span
                data-cursor="Book"
                className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-sm font-semibold text-on-accent shadow-[0_0_40px_var(--accent-glow)] transition-[background,transform] duration-300 hover:bg-accent-deep"
              >
                Book a call
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-on-accent/15 text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  ↗
                </span>
              </span>
            </Magnetic>
            <Magnetic as="a" href="#projects" strength={0.26}>
              <span
                data-cursor="Projects"
                className="inline-flex rounded-[var(--radius-pill)] border border-line-strong bg-void-panel/70 px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-300 hover:border-accent/50 hover:text-accent"
              >
                See key projects
              </span>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-5 telemetry sm:left-8"
        aria-hidden
      >
        Scroll · systems ahead
      </div>
    </section>
  );
}
