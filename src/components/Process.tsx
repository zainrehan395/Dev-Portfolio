"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const steps = track.querySelectorAll<HTMLElement>(".process-step");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        steps,
        {
          opacity: 0,
          y: 60,
          rotateX: 35,
          z: -100,
          transformPerspective: 900,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          z: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: track,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="relative border-t border-line/80 bg-deep py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-14 max-w-2xl">
          <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
            From brief to production
          </h2>
          <p className="mt-4 text-lg text-sage">
            Cross-functional delivery across frontend, backend, and cloud - with clean architecture and code review.
          </p>
        </div>

        <ol
          ref={trackRef}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          style={{ perspective: "1000px" }}
        >
          {processSteps.map((step, index) => (
            <li
              key={step.title}
              className="process-step liquid-glass-panel will-3d p-6 sm:p-7"
            >
              <span className="font-mono text-xs text-sage">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-cream">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-cream/70">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
