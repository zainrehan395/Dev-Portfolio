"use client";

// Cover + detail modal. Cover stays lean; the modal carries the full case study.

import { useState, useEffect, useRef, useCallback, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import ProjectSchematic, { type Diagram } from "./ProjectSchematic";
import { getLenis } from "@/lib/lenis";

export interface Project {
    id: string;
    title: string;
    tagline: string;
    role?: string;
    company?: string;
    period?: string;
    hook?: string;
    problem?: string;
    desc: string;
    outcome?: string;
    highlights?: string[];
    tech: string[];
    link?: string;
    accent: string;
    diagram?: Diagram;
}

const GRID_BG: CSSProperties = {
    backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "18px 18px",
};

function TechChips({ tech }: { tech: string[] }) {
    return (
        <div className="flex flex-wrap gap-1.5 md:gap-2">
            {tech.map((t) => (
                <span key={t} className="font-mono text-[10px] md:text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-gray-300">
                    {t}
                </span>
            ))}
        </div>
    );
}

function RepoLink({ href, accent }: { href: string; accent: string }) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-target group/cta inline-flex h-11 md:h-12 px-6 md:px-7 rounded-full items-center justify-center gap-2 text-[11px] md:text-xs font-mono font-bold tracking-wider transition-all duration-300 border hover:bg-brand/10 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            style={{ color: accent, borderColor: "color-mix(in srgb, var(--color-brand) 28%, transparent)" }}
        >
            View repo
            <span className="transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true">↗</span>
        </Link>
    );
}

function ContactLink({ accent }: { accent: string }) {
    return (
        <a
            href="#contact"
            className="magnetic-target group/cta inline-flex h-11 md:h-12 px-6 md:px-7 rounded-full items-center justify-center gap-2 text-[11px] md:text-xs font-mono font-bold tracking-wider transition-all duration-300 border hover:bg-brand/10 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            style={{ color: accent, borderColor: "color-mix(in srgb, var(--color-brand) 28%, transparent)" }}
        >
            Get in touch
            <span className="transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true">→</span>
        </a>
    );
}

function CaseBlock({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <h4 className="font-mono text-[10px] md:text-[11px] tracking-wider uppercase text-brand/80 mb-2">
                {label}
            </h4>
            <div className="text-[0.95rem] md:text-base text-gray-300/90 font-light leading-relaxed">
                {children}
            </div>
        </div>
    );
}

export default function ProjectCard({ project }: { project: Project }) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => setMounted(true), []);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;
        const lenis = getLenis();
        lenis?.stop();
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtnRef.current?.focus();
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            lenis?.start();
        };
    }, [open, close]);

    const meta = [project.role, project.company, project.period].filter(Boolean).join(" · ");

    return (
        <section className="project-panel w-full md:w-screen md:h-screen flex items-center justify-center px-4 sm:px-5 md:px-24 py-8 shrink-0 perspective-[1000px] select-none">
            <div
                className="panel-content group relative overflow-hidden w-full max-w-5xl h-auto md:h-[min(78vh,720px)] md:min-h-[540px] bg-[#121816] border border-white/8 hover:border-brand/30 rounded-2xl md:rounded-3xl shadow-2xl backdrop-blur-sm transform-3d flex flex-col cursor-pointer transition-colors duration-300"
                onClick={() => setOpen(true)}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`${project.title} - view details`}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
            >
                <span className="pointer-events-none absolute -bottom-10 md:-bottom-16 right-2 md:right-4 font-black text-white/[0.025] text-[9rem] md:text-[16rem] leading-none select-none">
                    {project.id}
                </span>

                <div className="relative flex items-center justify-between gap-3 px-5 sm:px-6 md:px-8 py-4 border-b border-white/8 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <span className="font-mono text-sm text-gray-500 shrink-0">[{project.id}]</span>
                        <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase truncate" style={{ color: project.accent }}>
                            {project.tagline}
                        </span>
                    </div>
                    <span className="hidden sm:block font-mono text-[10px] sm:text-xs text-white/35 tracking-wider shrink-0 truncate max-w-[40%]">
                        {project.company ?? "Production work"}
                    </span>
                </div>

                <div className="relative flex-1 min-h-0 flex flex-col justify-start gap-4 md:gap-5 px-5 sm:px-6 md:px-8 py-6 md:py-7 overflow-hidden">
                    <div className="shrink-0">
                        <h3 className="text-[clamp(1.75rem,6vw,3rem)] md:text-[clamp(2.25rem,3.5vw,3.25rem)] font-black tracking-tighter text-white leading-[0.95] break-words">
                            {project.title}
                        </h3>
                        {meta && (
                            <p className="mt-2 font-mono text-[10px] md:text-xs text-white/40 tracking-wide">
                                {meta}
                            </p>
                        )}
                    </div>

                    {project.hook && (
                        <p className="max-w-3xl text-sm md:text-[0.95rem] text-white/60 font-light leading-relaxed">
                            {project.hook}
                        </p>
                    )}

                    {project.highlights && project.highlights.length > 0 && (
                        <ul className="space-y-2 max-w-3xl">
                            {project.highlights.slice(0, 3).map((item) => (
                                <li key={item} className="flex gap-2.5 text-[0.8rem] md:text-sm text-white/50 leading-snug">
                                    <span className="text-brand/80 font-mono text-[10px] mt-0.5 shrink-0" aria-hidden="true">▸</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-auto pt-2">
                        <p className="font-mono text-[9px] tracking-wider uppercase text-white/30 mb-2.5">Technologies</p>
                        <TechChips tech={project.tech} />
                    </div>
                </div>

                <div className="relative border-t border-white/8 px-5 sm:px-6 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4 shrink-0">
                    <span className="hidden sm:inline font-mono text-[10px] text-white/30 tracking-wide">
                        {project.highlights?.length ?? 0} contributions in case study
                    </span>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                        className="inline-flex h-11 md:h-12 px-6 md:px-7 rounded-full items-center justify-center gap-2 text-[11px] md:text-xs font-mono font-bold tracking-wider text-[#052e1c] bg-brand hover:bg-brand/90 active:scale-[0.97] transition-[transform,background-color] duration-160 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ml-auto"
                    >
                        Read case study
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>

            {mounted && createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            data-lenis-prevent
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={close}
                        >
                            <motion.div
                                role="dialog"
                                aria-modal="true"
                                aria-label={`${project.title} details`}
                                className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto scrollbar-ide bg-[#121816] border border-white/12 rounded-2xl md:rounded-3xl shadow-2xl"
                                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 md:px-9 py-5 border-b border-white/10 bg-[#121816]/95 backdrop-blur">
                                    <div className="min-w-0">
                                        <div className="font-mono text-[10px] md:text-xs tracking-widest uppercase mb-1" style={{ color: project.accent }}>
                                            {project.tagline}
                                        </div>
                                        <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-white leading-none break-words">
                                            {project.title}
                                        </h3>
                                        {meta && (
                                            <p className="mt-2 font-mono text-[11px] text-white/40 tracking-wide">
                                                {meta}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        ref={closeBtnRef}
                                        type="button"
                                        onClick={close}
                                        aria-label="Close details"
                                        className="shrink-0 grid place-items-center h-9 w-9 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors font-mono"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-6 md:p-9 flex flex-col gap-8 md:gap-10">
                                    {project.hook && (
                                        <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-3xl">
                                            {project.hook}
                                        </p>
                                    )}

                                    {project.diagram && (
                                        <div className="rounded-xl border border-white/10 overflow-hidden" style={GRID_BG}>
                                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-[#121816]/70">
                                                <span className="font-mono text-[9px] md:text-[10px] tracking-wider text-white/35 uppercase">
                                                    Architecture
                                                </span>
                                                <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-brand/50 uppercase">
                                                    {project.diagram.kind}
                                                </span>
                                            </div>
                                            <div className="px-4 py-8 sm:px-8 md:px-12 md:py-10">
                                                <ProjectSchematic diagram={project.diagram} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {project.problem && (
                                            <CaseBlock label="The problem">
                                                <p>{project.problem}</p>
                                            </CaseBlock>
                                        )}
                                        {project.outcome && (
                                            <CaseBlock label="The outcome">
                                                <p>{project.outcome}</p>
                                            </CaseBlock>
                                        )}
                                    </div>

                                    <CaseBlock label="What I built">
                                        <p className="max-w-3xl">{project.desc}</p>
                                    </CaseBlock>

                                    {project.highlights && project.highlights.length > 0 && (
                                        <CaseBlock label="Key contributions">
                                            <ul className="space-y-3">
                                                {project.highlights.map((item) => (
                                                    <li key={item} className="flex gap-3">
                                                        <span className="text-brand/70 font-mono text-xs mt-1 shrink-0" aria-hidden="true">▸</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CaseBlock>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-white/8 pt-6">
                                        <div>
                                            <p className="font-mono text-[10px] tracking-wider uppercase text-white/35 mb-3">Stack</p>
                                            <TechChips tech={project.tech} />
                                        </div>
                                        {project.link ? (
                                            <RepoLink href={project.link} accent={project.accent} />
                                        ) : (
                                            <ContactLink accent={project.accent} />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
}
