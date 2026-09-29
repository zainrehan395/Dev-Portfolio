"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !bar.current) return;

    const tween = gsap.fromTo(
      bar.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.vars?.id === "scroll-progress")
        .forEach((st) => st.kill());
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <div
      className="pointer-events-none fixed top-[20vh] right-3 z-[45] hidden h-[60vh] w-px bg-line md:block lg:right-5"
      aria-hidden
    >
      <div
        ref={bar}
        className="h-full w-full origin-top bg-accent shadow-[0_0_12px_var(--accent-glow)]"
      />
    </div>
  );
}
