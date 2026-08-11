"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import StrokeText from "@/components/StrokeText";
import { profile } from "@/lib/data";

const DRAW_DURATION = 2.8;
const FILL_DELAY = 0.35;
const HOLD_MS = 480;
const EXIT_DURATION = 0.75;

function splashDurationMs(reduced: boolean) {
  if (reduced) return 320;
  const fillDuration = Math.max(0.4, DRAW_DURATION * 0.5);
  return Math.round((DRAW_DURATION + FILL_DELAY + fillDuration) * 1000) + HOLD_MS;
}

export function SplashScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    html.dataset.splash = "pending";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = splashDurationMs(reduced);

    const exitTween = gsap.delayedCall(delay / 1000, () => {
      gsap.to(root, {
        opacity: 0,
        duration: reduced ? 0.15 : EXIT_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          html.dataset.splash = "done";
          html.style.overflow = prevOverflow;
          window.dispatchEvent(new Event("splash:done"));
          setMounted(false);
        },
      });
    });

    return () => {
      exitTween.kill();
      gsap.killTweensOf(root);
      html.style.overflow = prevOverflow;
      if (html.dataset.splash !== "done") {
        html.dataset.splash = "done";
        window.dispatchEvent(new Event("splash:done"));
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-deep"
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 50% 45%, color-mix(in srgb, var(--sage) 45%, transparent), transparent 70%)",
        }}
      />
      <div className="relative w-[min(92vw,720px)] px-4">
        <StrokeText
          text={profile.fullName}
          strokeColor="#BDD2B6"
          fillColor="#F8EDE3"
          strokeWidth={1.4}
          drawDuration={DRAW_DURATION}
          fillDelay={FILL_DELAY}
          stagger={0.08}
          ease="power2.out"
          trigger="mount"
          fillMode="wipe"
          fontSize={128}
          fontWeight={800}
          letterSpacing={-4}
          reverse={false}
          className="font-display"
        />
      </div>
    </div>
  );
}
