"use client";

import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 8,
  containerClassName = '',
  textClassName = '',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    if (typeof children !== "string") {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ScrollReveal] children must be a plain string. Received:", typeof children);
      }
      return children; 
    }

    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span
          key={index}
          className="word inline-block origin-center will-change-[transform,opacity,filter]"
          style={{ opacity: baseOpacity }}
        >
          {word}
        </span>
      );
    });
  }, [children, baseOpacity]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.word');
    if (!words.length) return;

    // Use GSAP contextual scope for clean component unmounting
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          opacity: baseOpacity,
          rotateX: baseRotation,
          scale: 0.96,
          filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
          y: 20,
        },
        {
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.02,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: wordAnimationEnd || 'bottom 45%',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [baseOpacity, baseRotation, enableBlur, blurStrength, wordAnimationEnd]);

  return (
    <h2 ref={containerRef} className={`my-5 select-none ${containerClassName}`}>
      <p className={`text-[clamp(1.5rem,3.8vw,3.2rem)] font-bold tracking-tight uppercase leading-relaxed font-mono text-white ${textClassName}`}>
        {splitText}
      </p>
    </h2>
  );
};

export default ScrollReveal;