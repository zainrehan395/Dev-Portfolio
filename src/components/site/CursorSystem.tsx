"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";

/**
 * Desktop-only magnetic ring cursor.
 * Morphs on interactive targets; disabled for touch / reduced motion.
 */
export function CursorSystem() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(Boolean(fine && !reduce));
  }, [reduce]);

  useEffect(() => {
    if (!enabled || !ring.current || !dot.current) return;

    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };
    let hovering = false;
    let labelText = "";

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.set(dot.current, { x: pos.x, y: pos.y });

      const target = (e.target as HTMLElement | null)?.closest(
        "a, button, [data-cursor], input, textarea, [role='tab'], [role='button']",
      ) as HTMLElement | null;

      const nextHover = Boolean(target);
      const nextLabel = target?.dataset.cursor ?? "";

      if (nextHover !== hovering || nextLabel !== labelText) {
        hovering = nextHover;
        labelText = nextLabel;
        if (label.current) label.current.textContent = labelText;
        gsap.to(ring.current, {
          scale: hovering ? (labelText ? 2.4 : 1.65) : 1,
          opacity: hovering ? 0.95 : 0.55,
          borderColor: hovering
            ? "color-mix(in srgb, var(--accent) 90%, transparent)"
            : "color-mix(in srgb, var(--ink) 35%, transparent)",
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(dot.current, {
          scale: hovering ? 0.35 : 1,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
        if (label.current) {
          gsap.to(label.current, {
            opacity: labelText ? 1 : 0,
            duration: 0.25,
            overwrite: "auto",
          });
        }
      }
    };

    const onLeave = () => {
      gsap.to([ring.current, dot.current], { opacity: 0, duration: 0.25 });
    };
    const onEnter = () => {
      gsap.to(ring.current, { opacity: 0.55, duration: 0.25 });
      gsap.to(dot.current, { opacity: 1, duration: 0.25 });
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      gsap.set(ring.current, { x: ringPos.x, y: ringPos.y });
    };

    gsap.ticker.add(tick);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      gsap.ticker.remove(tick);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden>
      <div
        ref={ring}
        className="absolute top-0 left-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/35 opacity-55 will-change-transform"
      >
        <span
          ref={label}
          className="telemetry max-w-[7rem] truncate px-1 text-center text-[0.55rem] text-accent opacity-0"
        />
      </div>
      <div
        ref={dot}
        className="absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent will-change-transform"
      />
    </div>
  );
}
