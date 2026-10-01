"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsComplete(true);
                    // Dispatch a custom event so page components know it's safe to animate
                    window.dispatchEvent(new Event("bootComplete"));
                }
            });

            // Fake terminal boot sequence counter
            tl.to(counterRef.current, {
                innerHTML: 100,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power4.inOut",
            })
                // The split screen shatter effect
                .to(".preloader-split-top", {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut"
                }, "+=0.2")
                .to(".preloader-split-bottom", {
                    yPercent: 100,
                    duration: 0.8,
                    ease: "power4.inOut"
                }, "<")
                .to(containerRef.current, {
                    autoAlpha: 0,
                    duration: 0.1
                });
        });

        return () => ctx.revert();
    }, []);

    if (isComplete) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-100 pointer-events-none flex flex-col uppercase font-mono text-xs tracking-widest text-brand">
            {/* Top Half */}
            <div className="preloader-split-top absolute top-0 left-0 w-full h-1/2 bg-[#0a0a0c] border-b border-white/5 flex items-end px-8 pb-4">
                <span>INITIALIZING SYSTEM_</span>
            </div>

            {/* Bottom Half with Counter */}
            <div className="preloader-split-bottom absolute bottom-0 left-0 w-full h-1/2 bg-[#0a0a0c] flex items-start px-8 pt-4 justify-between">
                <span>LOADING DOM MATRIX</span>
                <div className="text-6xl font-black tracking-tighter text-[#f3f3f3]">
                    <span ref={counterRef}>0</span>%
                </div>
            </div>
        </div>
    );
}
