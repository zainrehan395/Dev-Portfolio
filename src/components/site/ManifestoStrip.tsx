"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";

const LINE =
  "I ship SaaS, logistics, and marketplace systems — from interface architecture to AWS deployment.";

export function ManifestoStrip() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!root.current) return;
    const words = gsap.utils.toArray<HTMLElement>("[data-manifesto-word]");

    if (reduce) {
      gsap.set(words, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.12, y: 28, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "center 35%",
            scrub: 0.9,
          },
        },
      );

      gsap.fromTo(
        "[data-manifesto-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            end: "center 40%",
            scrub: true,
          },
          transformOrigin: "left center",
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduce]);

  const parts = LINE.split(/(\s+)/);

  return (
    <section
      ref={root}
      className="relative border-t border-line bg-void"
      aria-label="Positioning"
    >
      <div className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-center px-5 py-24 sm:px-8 sm:py-32 md:min-h-[85vh]">
        <p className="telemetry text-accent">01 · Positioning</p>
        <div
          data-manifesto-rule
          className="mt-6 h-px w-24 origin-left bg-accent"
          aria-hidden
        />
        <p
          className="mt-10 max-w-[18ch] font-display text-[clamp(2.25rem,6.5vw,5.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink sm:max-w-[22ch]"
          aria-label={LINE}
        >
          {parts.map((part, i) => {
            if (!part.trim()) {
              return <span key={`sp-${i}`}> </span>;
            }
            return (
              <span
                key={`${part}-${i}`}
                data-manifesto-word
                className="mr-[0.22em] inline-block will-change-transform"
                aria-hidden
              >
                {part}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
