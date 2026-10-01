"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_PANELS, SITE_CONFIG } from "../lib/config";
import { AnimatePresence } from "motion/react";
import Terminal from "./Terminal";

const { panel1, panel2, panel3, panel4 } = HERO_PANELS;

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInitialCommand, setTerminalInitialCommand] = useState<
    string | undefined
  >(undefined);

  const openTerminalWithDm = () => {
    setTerminalInitialCommand("dm");
    setIsTerminalOpen(true);
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
    setTerminalInitialCommand(undefined);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set(".f-panel-1", {
          x: "120vw",
          y: "30vh",
          rotate: 35,
          scale: 1.25,
        });
        gsap.set(".f-panel-2", {
          x: "-120vw",
          y: "-20vh",
          rotate: -25,
          scale: 1.5,
        });
        gsap.set(".f-panel-3", { y: "150vh", rotate: -15 });
        gsap.set(".f-panel-4", { y: "60vh", rotate: 3, scale: 1.25 });

        gsap.timeline().to(".intro-mask-line", {
          y: "0%",
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.08,
        });

        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        scrollTimeline
          .to(
            titleContainerRef.current,
            {
              scale: 2.2,
              opacity: 0,
              y: -80,
              rotateX: 12,
              transformOrigin: "center center",
              ease: "none",
            },
            0
          )
          .to(
            ".f-panel-1",
            { x: "0vw", y: "0vh", rotate: -2, scale: 1, ease: "none" },
            0
          )
          .to(
            ".f-panel-2",
            { x: "0vw", y: "0vh", rotate: 1, scale: 1, ease: "none" },
            0
          )
          .to(
            ".f-panel-3",
            { x: "0vw", y: "0vh", rotate: -1, scale: 1, ease: "none" },
            0
          )
          .to(
            ".f-panel-4",
            { x: "0vw", y: "0vh", rotate: 2, scale: 1, ease: "none" },
            0
          );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(".floating-panel-initial", {
          x: 0,
          y: 36,
          rotate: 0,
          scale: 1,
          opacity: 0,
        });

        gsap
          .timeline()
          .to(".intro-mask-line", {
            y: "0%",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.07,
          })
          .to(
            ".floating-panel-initial",
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.35"
          );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="top"
        ref={containerRef}
        aria-label="Introduction"
        className="relative w-full min-h-[100dvh] md:h-screen bg-[#0c0f0d] text-[#f3f3f3] overflow-visible md:overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {/* Ambient wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(52,211,153,0.12),transparent_45%),radial-gradient(ellipse_at_80%_90%,rgba(52,211,153,0.06),transparent_40%)]"
        />

        <div
          ref={titleContainerRef}
          className="relative md:absolute md:inset-0 flex flex-col items-start md:items-center justify-start md:justify-center z-10 select-none pointer-events-none px-4 sm:px-5 pt-[4.5rem] sm:pt-20 md:p-0"
        >
          <p className="intro-mask-line mb-3 md:mb-5 font-mono text-[10px] md:text-xs tracking-[0.28em] uppercase text-brand/80 translate-y-[110%] will-change-transform">
            {SITE_CONFIG.location}
          </p>
          <h1 className="overflow-hidden w-full max-w-[min(100%,92vw)] mx-auto text-left md:text-center">
            <span
              className="intro-mask-line inline-block will-change-transform translate-y-[110%] text-[clamp(1.55rem,8.2vw,5.25rem)] md:text-[clamp(2.75rem,6.5vw,5.5rem)] font-black tracking-tight md:tracking-tighter leading-[1.08] uppercase text-transparent max-md:whitespace-normal md:whitespace-nowrap"
              style={{
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                backgroundImage:
                  "linear-gradient(110deg, #f4f4f5 0%, #f4f4f5 38%, #6ee7b7 72%, #a7f3d0 100%)",
              }}
            >
              Zain-ul-Abideen
            </span>
          </h1>
          <p className="intro-mask-line mt-4 md:mt-6 max-w-xl text-left md:text-center text-sm md:text-base text-white/55 leading-relaxed translate-y-[110%] will-change-transform">
            Software engineer building fast React and Next.js products with
            Node.js and AWS.
          </p>
        </div>

        <div className="relative md:absolute md:inset-0 w-full md:h-full pointer-events-none z-20 px-4 sm:px-5 md:px-8 pb-10 pt-6 md:py-0 flex flex-col gap-3 md:gap-9 justify-center">
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:flex md:flex-row gap-3 md:gap-6 w-full items-stretch">
            <div className="f-panel-2 floating-panel-initial order-2 md:order-0 bg-[#121816] border border-white/8 rounded-xl md:rounded-2xl p-4 md:p-8 flex-1 flex flex-col justify-between pointer-events-auto backdrop-blur-md shadow-[0_24px_80px_rgba(0,0,0,0.35)] min-h-30 md:min-h-0 will-change-transform opacity-0 md:opacity-100">
              <div className="flex justify-between items-start border-b border-white/5 pb-3 md:pb-4">
                <span className="font-mono text-[10px] md:text-xs text-brand">
                  {panel2.tag}
                </span>
                <span className="font-mono text-[10px] md:text-xs text-gray-500">
                  {panel2.meta}
                </span>
              </div>
              <div className="my-4 md:my-auto">
                <h2 className="text-lg min-[400px]:text-2xl md:text-4xl font-black tracking-tight md:tracking-tighter uppercase leading-none md:leading-[0.95] whitespace-pre-line">
                  {panel2.headline}
                </h2>
              </div>
              <p className="hidden md:block text-base font-medium max-w-xs text-gray-400">
                {panel2.subtext}
              </p>
            </div>

            <div className="f-panel-1 floating-panel-initial order-1 min-[400px]:col-span-2 md:order-0 bg-brand text-[#052e1c] rounded-xl md:rounded-2xl p-4 md:p-8 flex-[1.3] flex flex-col justify-between pointer-events-auto shadow-[0_24px_80px_rgba(52,211,153,0.25)] min-h-0 will-change-transform opacity-0 md:opacity-100">
              <div className="flex justify-between items-start border-b border-black/10 pb-3 md:pb-4">
                <span className="font-mono text-[10px] md:text-xs font-bold">
                  {panel1.tag}
                </span>
                <span className="font-mono text-[10px] md:text-xs font-bold opacity-60">
                  {panel1.meta}
                </span>
              </div>
              <div className="py-4 md:py-0">
                <h2 className="text-[1.35rem] min-[400px]:text-[1.7rem] md:text-2xl font-black tracking-tight mb-2 md:mb-3 uppercase leading-none whitespace-pre-line">
                  {panel1.title}
                </h2>
                <p className="text-[0.78rem] min-[400px]:text-[0.95rem] md:text-base text-[#052e1c]/90 leading-relaxed">
                  {panel1.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 md:gap-2 pt-0 md:pt-4">
                {panel1.stack?.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[9px] min-[400px]:text-[10px] md:text-sm bg-black/15 px-2 py-1 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="f-panel-3 floating-panel-initial order-3 md:order-0 bg-[#121816] border border-white/8 rounded-xl md:rounded-2xl p-4 md:p-6 flex-1 flex flex-col justify-between pointer-events-auto shadow-[0_24px_80px_rgba(0,0,0,0.35)] min-h-0 will-change-transform opacity-0 md:opacity-100">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-gray-500">
                  {panel3.tag}
                </span>
                <span
                  className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <span className="sr-only">Currently employed</span>
              </div>
              <div className="py-2">
                <div className="text-lg min-[400px]:text-2xl md:text-3xl font-mono tracking-tight md:tracking-tighter text-white font-bold leading-tight whitespace-pre-line">
                  {panel3.title}
                </div>
                <p className="text-xs md:text-base text-gray-400 mt-2">
                  {panel3.desc}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <div className="f-panel-4 floating-panel-initial w-full min-[400px]:w-auto bg-zinc-900/90 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-10 py-4 md:py-6 flex flex-col items-center justify-center gap-3 md:gap-4 pointer-events-auto shadow-2xl hover:border-brand/50 transition-colors duration-300 will-change-transform opacity-0 md:opacity-100">
              <p className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
                {panel4.tag}
              </p>
              <button
                type="button"
                onClick={openTerminalWithDm}
                className="text-[#052e1c] cursor-pointer font-mono text-xs font-bold py-3.5 px-8 min-h-11 rounded-full bg-brand hover:bg-brand/90 active:scale-[0.97] transition-[transform,background-color] duration-160 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand w-full min-[400px]:w-auto"
              >
                {panel4.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isTerminalOpen && (
          <Terminal
            onClose={closeTerminal}
            initialCommand={terminalInitialCommand}
          />
        )}
      </AnimatePresence>
    </>
  );
}
