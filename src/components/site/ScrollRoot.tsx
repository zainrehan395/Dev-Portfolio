"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function ScrollRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => {
        window.removeEventListener("resize", onResize);
        window.clearTimeout(t);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 280);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
