"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Terminal from "./Terminal";
import { AnimatePresence } from "motion/react";
import { PROJECTS } from "@/lib/config";
import ProjectCard, { type Project } from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectGallery() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);

    useEffect(() => {
        const track = trackRef.current;
        const container = scrollContainerRef.current;
        if (!track || !container) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // 💻 DESKTOP: Horizontal Scroll Matrix
            mm.add("(min-width: 768px)", () => {
                const totalScrollDistance = track.scrollWidth - window.innerWidth;

                const scrollTween = gsap.to(track, {
                    x: () => -totalScrollDistance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        pin: true,
                        scrub: 1,
                        start: "top top",
                        end: () => `+=${track.scrollWidth}`,
                        invalidateOnRefresh: true,
                    }
                });

                // Spatial distortion on individual cards
                gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel) => {
                    gsap.fromTo(panel.querySelector(".panel-content"),
                        { scale: 0.9, rotateY: 15, opacity: 0.6 },
                        {
                            scale: 1, rotateY: 0, opacity: 1, ease: "power2.out",
                            scrollTrigger: {
                                trigger: panel,
                                containerAnimation: scrollTween,
                                start: "left right-=20%",
                                end: "center center",
                                scrub: true,
                            }
                        }
                    );
                });

                // The Black Hole Footer 
                gsap.fromTo(".void-bg",
                    { scale: 0.3, borderRadius: "500px", opacity: 0 },
                    {
                        scale: 1, borderRadius: "0px", opacity: 1, ease: "none",
                        scrollTrigger: {
                            trigger: ".void-panel",
                            containerAnimation: scrollTween,
                            start: "left right",
                            end: "left left",
                            scrub: true,
                        }
                    }
                );
            });

            // 📱 MOBILE: Standard vertical flow + scroll reveals
            mm.add("(max-width: 767px)", () => {
                gsap.set(track, { width: "100%", x: 0, clearProps: "transform" });
                gsap.set(".project-panel", { width: "100%", height: "auto" });
                gsap.set(".void-panel", { width: "100%", height: "auto", minHeight: "100dvh" });
                gsap.set(".void-bg", { scale: 1, borderRadius: "0px", opacity: 1 });

                gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel) => {
                    gsap.fromTo(panel.querySelector(".panel-content"),
                        { opacity: 0, y: 48, scale: 0.97 },
                        {
                            opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out",
                            scrollTrigger: {
                                trigger: panel,
                                start: "top 88%",
                                toggleActions: "play none none reverse",
                            }
                        }
                    );
                });

                gsap.fromTo(".void-panel .relative.z-10",
                    { opacity: 0, y: 36 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".void-panel",
                            start: "top 75%",
                        }
                    }
                );
            });

        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <div id="work" className="mx-auto max-w-7xl flex flex-col items-start px-4 sm:px-6 md:px-8 py-16 md:py-20">
                <h2 className="text-[clamp(2.1rem,12vw,3.75rem)] md:text-6xl font-bold text-white tracking-tighter leading-none">
                    Selected work
                </h2>
                <p className="mt-4 max-w-2xl text-sm md:text-base text-white/45 leading-relaxed">
                    Case studies from 12th Spring LLC: CPI Business, Lottae, Time2Wash, and Shahen Express. Content matched to my resume.
                </p>
            </div>
            <div ref={scrollContainerRef} className="relative w-full md:h-screen bg-transparent overflow-hidden" style={{ "--projects-count": PROJECTS.length } as React.CSSProperties}>
                <div ref={trackRef} className="relative md:absolute top-0 left-0 h-full flex flex-col md:flex-row items-center will-change-transform md:w-[calc((var(--projects-count)+1)*100vw)] w-full">

                    {/* PROJECT LAYOUT CAPSULES */}
                    {PROJECTS.map((project) => (
                        <ProjectCard key={project.id} project={project as Project} />
                    ))}

                    {/* THE VOID / BLACK HOLE CLOSING TERMINAL FOOTER */}
                    <section className="void-panel w-full md:w-screen min-h-[100dvh] md:h-screen relative flex items-center justify-center shrink-0 overflow-hidden bg-[#0c0f0d] max-sm:mt-20">
                        <div className="void-bg absolute inset-0 bg-brand z-0" />

                        <div className="relative z-10 text-center text-[#052e1c] px-6 max-w-3xl flex flex-col items-center">
                            <h2 className="text-[clamp(2.4rem,12vw,4.5rem)] md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
                                Ready when you are
                            </h2>
                            <p className="text-sm md:text-base font-medium max-w-md mb-10 text-[#052e1c]/80">
                                Need a React or Next.js engineer who can also own Node and AWS delivery? Let&apos;s talk.
                            </p>

                            <button
                                type="button"
                                onClick={() => setIsTerminalOpen(true)}
                                className="magnetic-target bg-[#052e1c] text-brand font-mono text-xs font-bold py-4 px-9 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform duration-160 ease-out shadow-2xl tracking-wider uppercase cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#052e1c]"
                            >
                                Get in touch
                            </button>
                        </div>
                    </section>

                </div>
            </div>

            <AnimatePresence>
                {isTerminalOpen && <Terminal onClose={() => setIsTerminalOpen(false)} />}
            </AnimatePresence>
        </>
    );
}
