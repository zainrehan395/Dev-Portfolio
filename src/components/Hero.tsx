"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { profile } from "@/lib/data";
import ProfileCard from "@/components/ProfileCard";
import DecryptedText from "@/components/DecryptedText";
import { HeroVectors } from "@/components/HeroVectors";

const stack = ["React.js", "Next.js", "TypeScript", "Node.js", "AWS"];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const run = () => {
      if (cancelled || !rootRef.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      ctx = gsap.context(() => {
        gsap.from(".hero-anim", {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.05,
        });
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
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-deep pb-28 pt-24 sm:pb-32 sm:pt-28"
    >
      <HeroVectors />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)] lg:gap-10 xl:gap-14">
        <div className="min-w-0">
          <h1 className="hero-anim font-display text-[clamp(3rem,12vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-cream">
            {profile.fullName}
          </h1>

          <p className="hero-anim mt-5 max-w-2xl font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
            <DecryptedText
              text="I build things for the web."
              animateOn="inViewHover"
              sequential
              speed={40}
              revealDirection="start"
              className="text-cream"
              encryptedClassName="text-cream/40"
            />
          </p>

          <p className="hero-anim mt-5 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
            I&apos;m a Full-Stack Software Engineer focused on creating scalable, performant, and
            user-focused applications with React, Next.js, Node.js, and AWS.
          </p>

          <p className="hero-anim mt-4 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
            I enjoy taking products from idea → architecture → development → deployment, while
            keeping the experience fast, clean, and intuitive.
          </p>

          <div className="hero-anim mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage">
              Currently working with
            </p>
            <p className="mt-2 max-w-2xl text-sm text-cream/85 sm:text-base">
              {stack.join(" · ")}
            </p>
          </div>

          <div className="hero-anim mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="liquid-glass-btn-solid inline-flex min-h-12 items-center rounded-xl px-6 text-base font-semibold"
            >
              Let&apos;s Work Together
            </a>
            <a
              href="#work"
              className="liquid-glass-btn inline-flex min-h-12 items-center rounded-xl px-6 text-base font-medium"
            >
              View My Work
            </a>
          </div>
        </div>

        <div className="hero-anim relative flex justify-center lg:justify-end">
          <ProfileCard
            name={profile.fullName}
            title={profile.role}
            handle="/in/zain-rehan/"
            status="Available"
            contactText="Contact Me"
            avatarUrl="/avatar.png"
            iconUrl="/assets/iconpattern.png"
            showUserInfo
            enableTilt
            enableMobileTilt={false}
            behindGlowEnabled
            behindGlowColor="rgba(102, 114, 107, 0.55)"
            innerGradient="linear-gradient(145deg,#363f3a8c 0%,#66726b55 100%)"
            className="w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px]"
          />
        </div>
      </div>
    </section>
  );
}
