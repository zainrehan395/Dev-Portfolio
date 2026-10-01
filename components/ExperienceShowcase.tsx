"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCE_DATA } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger);

interface ClientEngagement {
  name: string;
  role: string;
  signature: string;
}

interface ProofMetric {
  value: string;
  label: string;
}

interface WorkExperience {
  role: string;
  company: string;
  location: string;
  period: string;
  techStack: string[];
  highlights: string[];
  /** Headline numbers, rendered large — proof rather than prose. */
  metrics?: ProofMetric[];
  /** Enterprise accounts, rendered as a name wall with a one-line caption each. */
  clients?: ClientEngagement[];
}

const ExperienceCard = ({ exp }: { exp: WorkExperience; }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Spotlight follows pointer (mouse + touch) outside React render.
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  // 2. Local Node Entry Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        pinRef.current,
        { scale: 0.85, backgroundColor: "#0c0f0d", borderColor: "#333" },
        { scale: 1, backgroundColor: "#34d399", borderColor: "#34d399", duration: 0.35, ease: "power3.out" }
      ).fromTo(
        contentRef.current,
        { opacity: 0, x: -30, filter: "blur(8px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-full group"
      onPointerMove={handlePointerMove}
      style={{ ["--mouse-x" as string]: "50%", ["--mouse-y" as string]: "30%" }}
    >
      {/* Node Junction Pin */}
      <div
        ref={pinRef}
        className="absolute -left-8 md:-left-16 top-4 w-3 h-3 md:w-4 md:h-4 rounded-full border-[3px] z-20 will-change-transform shadow-[0_0_18px_rgba(52,211,153,0.45)]"
      />

      {/* Main Content Layout */}
      <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-start will-change-[transform,opacity,filter]">

        {/* Timestamp & Meta Panel */}
        <div className="lg:col-span-4 flex flex-col pt-3">
          <span className="text-xs font-mono text-white/40 font-bold tracking-[0.2em] uppercase mb-2">
            {exp.period}
          </span>
          <h3 className="text-lg md:text-xl font-bold font-mono text-white leading-tight uppercase tracking-tight">
            {exp.role}
          </h3>
          <span className="text-sm font-sans text-white/70 mt-1.5 font-medium">
            {exp.company}
          </span>
          <span className="text-xs font-mono text-white/30 tracking-wide mt-1">
            {"// "}{exp.location}
          </span>
        </div>

        {/* Spotlight Interactive Terminal Panel */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-xl border border-white/8 bg-[#121816] backdrop-blur-md transition-colors duration-500 group-hover:border-brand/25 group-active:border-brand/25">

          <div
            className="pointer-events-none absolute inset-0 opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(min(520px, 90vw) circle at var(--mouse-x) var(--mouse-y), rgba(52,211,153,0.1), transparent 42%)`
            }}
          />

          <div className="relative p-4 sm:p-5 md:p-8">
            <ul className="space-y-3 md:space-y-4 mb-7 md:mb-8">
              {exp.highlights.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-3 md:gap-4 text-[0.84rem] md:text-[0.9rem] text-neutral-400 leading-relaxed font-sans group-hover:text-neutral-300 transition-colors duration-300">
                  <span className="text-white/20 font-mono text-xs mt-1 select-none">►</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Proof Numbers — the visual anchor of the card */}
            {exp.metrics && exp.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-5 mb-7 md:mb-8 -mt-2">
                {exp.metrics.map((metric) => (
                  <div key={metric.label} className="flex flex-col min-w-0">
                    <span className="text-[1.5rem] min-[380px]:text-[2.1rem] md:text-[2.75rem] font-black font-mono text-brand leading-none tracking-tighter tabular-nums">
                      {metric.value}
                    </span>
                    <span className="mt-1.5 text-[8px] md:text-[9px] font-mono text-white/35 uppercase tracking-[0.16em] leading-tight">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Hardware Architecture Badges */}
            <div className="flex flex-wrap gap-1.5 md:gap-2 pt-5 border-t border-white/4">
              {exp.techStack.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[9px] md:text-[10px] font-mono px-2 md:px-2.5 py-1.5 rounded bg-white/3 text-white/60 uppercase tracking-widest border border-white/3 group-hover:bg-white/8 group-hover:border-white/10 group-hover:text-white/90 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Client Account Wall — the set is the proof, not the per-account detail */}
            {exp.clients && exp.clients.length > 0 && (
              <div className="mt-7 md:mt-8 pt-6 border-t border-white/8">
                <span className="block text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-wider mb-5">
                  Shipped for
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 md:gap-y-6">
                  {exp.clients.map((client) => (
                    <div key={client.name} className="group/client">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h4 className="text-[0.95rem] md:text-[1.05rem] font-bold font-mono text-white/90 tracking-tight leading-tight transition-colors duration-300 group-hover/client:text-white">
                          {client.name}
                        </h4>
                        <span className="text-[9px] md:text-[10px] font-mono text-brand/60 uppercase tracking-[0.15em] shrink-0">
                          {client.role}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[0.78rem] md:text-[0.82rem] text-neutral-500 leading-snug font-sans transition-colors duration-300 group-hover/client:text-neutral-400">
                        {client.signature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Pipeline Parent ---
export default function ExperienceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circuitLineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggerBase = {
        trigger: containerRef.current,
        start: "top 40%",
        end: "bottom 80%",
        scrub: 0.5, // Added slight scrub delay for buttery smooth physics
      };

      // 1. Paint the wire down the screen
      gsap.fromTo(
        circuitLineRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: scrollTriggerBase }
      );

      // 2. Sync the glowing playhead to the end of the line
      gsap.fromTo(
        playheadRef.current,
        { top: "0%" },
        { top: "100%", ease: "none", scrollTrigger: scrollTriggerBase }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={containerRef}
      aria-labelledby="experience-heading"
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-40 bg-transparent"
    >
      <div className="mb-16 md:mb-28 flex flex-col items-start">
        <h2
          id="experience-heading"
          className="text-[clamp(2.1rem,12vw,3.75rem)] md:text-6xl font-bold text-white tracking-tighter leading-none"
        >
          Experience
        </h2>
        <p className="mt-4 max-w-xl text-sm md:text-base text-white/45 leading-relaxed">
          Two years of product engineering across React, Next.js, Node.js, and AWS.
        </p>
      </div>

      <div className="relative pl-8.5 md:pl-16">
        {/* Background Inactive Track */}
        <div className="absolute left-1.5 md:left-1.75 top-4 bottom-0 w-0.5 bg-white/2" />

        {/* Active Draw Track */}
        <div className="absolute left-1.5 md:left-1.75 top-4 bottom-0 w-0.5 origin-top">
          <div
            ref={circuitLineRef}
            className="w-full h-full bg-linear-to-b from-brand/80 via-brand/40 to-transparent origin-top scale-y-0 will-change-transform"
          />

          {/* Glowing Playhead Orb */}
          <div
            ref={playheadRef}
            className="absolute -left-1 w-2.5 h-7.5 rounded-full bg-white blur-[2px] shadow-[0_0_20px_rgba(255,255,255,0.8)] will-change-transform"
            style={{ top: "0%" }}
          />
        </div>

        {/* Render Dynamic Nodes */}
        <div className="space-y-14 md:space-y-32">
          {EXPERIENCE_DATA.map((exp, idx) => (
            <ExperienceCard key={idx} exp={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
