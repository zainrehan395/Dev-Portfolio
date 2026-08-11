"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const HeroCanvas = dynamic(() => import("@/components/hero/HeroCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-deep" aria-hidden="true" />,
});

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const run = () => {
      if (cancelled || !rootRef.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        gsap.from(".hero-anim", {
          y: 36,
          opacity: 0,
          rotateX: 24,
          transformPerspective: 800,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.08,
        });

        if (reduce) return;

        if (contentRef.current) {
          gsap.to(contentRef.current, {
            yPercent: -18,
            rotateX: 12,
            scale: 0.94,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        }

        if (boardRef.current) {
          gsap.to(boardRef.current, {
            yPercent: 8,
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }, root);
    };

    if (document.documentElement.dataset.splash === "done") {
      run();
    } else {
      window.addEventListener("splash:done", run, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("splash:done", run);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-deep pb-28 pt-20 sm:pb-32 sm:pt-24"
      style={{ perspective: "1200px" }}
    >
      <div ref={boardRef} className="absolute inset-0 will-3d">
        <HeroCanvas eventSource={rootRef} />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep via-deep/35 to-deep/15"
          aria-hidden="true"
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 will-3d sm:px-8"
        style={{ transformOrigin: "50% 100%" }}
      >
        <p className="hero-anim font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {profile.role} · {profile.years} years
        </p>

        <h1 className="hero-anim mt-4 font-display text-[clamp(3.5rem,14vw,8.5rem)] font-extrabold leading-[0.88] tracking-[-0.04em] text-cream">
          {profile.name}
        </h1>

        <p className="hero-anim mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          {profile.tagline}
        </p>

        <div className="hero-anim mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#book"
            className="inline-flex min-h-12 items-center bg-cream px-6 text-base font-semibold text-deep transition-colors duration-200 hover:bg-sage"
          >
            Book a discovery call
          </a>
          <a
            href="#work"
            className="inline-flex min-h-12 items-center border border-cream/40 bg-deep/20 px-6 text-base font-medium text-cream backdrop-blur-sm transition-colors duration-200 hover:border-cream hover:bg-cream hover:text-deep"
          >
            View experience
          </a>
        </div>
      </div>
    </section>
  );
}
