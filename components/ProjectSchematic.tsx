"use client";

// Architecture schematics in HTML/flexbox: a horizontal flow on desktop that reflows to
// a vertical stack on mobile. Real text (never shrinks to unreadable), equal-width nodes
// (flex-1), and connectors that switch → / ↓ with the axis. Short on desktop, so it fits
// an auto-height card without any internal scroll.

import { Fragment } from "react";

type Node = { label: string; sub?: string };

export type Diagram =
    | { kind: "pipeline"; caption: string; nodes: Node[] }
    | { kind: "stack"; caption: string; nodes: Node[] }
    | { kind: "loop"; caption: string; nodes: Node[] }
    | { kind: "graph"; caption: string; nodes: Node[] }
    | { kind: "fanout"; caption: string; source: Node; agents: Node[]; sink: Node; out: Node }
    | { kind: "secure"; caption: string; left: Node; right: Node; tunnel: string };

function Node({ label, sub, accent = false, className = "" }: { label: string; sub?: string; accent?: boolean; className?: string }) {
    return (
        <div
            className={`rounded-lg border px-3 py-2.5 text-center ${accent ? "border-brand/60 bg-brand/10" : "border-white/12 bg-white/[0.05]"} ${className}`}
        >
            <div className={`font-mono text-[12px] md:text-[13px] font-bold leading-tight break-words ${accent ? "text-brand" : "text-white/90"}`}>
                {label}
            </div>
            {sub && <div className="font-mono text-[9px] md:text-[10px] text-white/40 mt-0.5 tracking-wide">{sub}</div>}
        </div>
    );
}

// Connector arrow that follows the layout axis (↓ stacked, → in a row). Pulses gently.
function Conn() {
    return (
        <div className="flex items-center justify-center shrink-0 text-brand/60 leading-none py-0.5 md:py-0 md:px-1.5" aria-hidden="true">
            <span className="sch-pulse md:hidden text-sm">↓</span>
            <span className="sch-pulse hidden md:inline text-sm">→</span>
        </div>
    );
}

function Caption({ text }: { text: string }) {
    return (
        <div className="mt-4 md:mt-5 text-center font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-brand/70 uppercase">
            {text}
        </div>
    );
}

const ROW = "flex flex-col md:flex-row md:items-stretch gap-1.5 md:gap-1 w-full";

export default function ProjectSchematic({ diagram }: { diagram: Diagram }) {
    if (diagram.kind === "pipeline" || diagram.kind === "stack" || diagram.kind === "graph" || diagram.kind === "loop") {
        const nodes = diagram.nodes;
        const accentIdx = Math.floor((nodes.length - 1) / 2);
        return (
            <div className="w-full" role="img" aria-label={`${diagram.kind} architecture: ${nodes.map((n) => n.label).join(" then ")}`}>
                <div className={ROW}>
                    {nodes.map((n, i) => (
                        <Fragment key={i}>
                            <Node label={n.label} sub={n.sub} accent={i === accentIdx} className="flex-1 min-w-0 flex flex-col justify-center" />
                            {i < nodes.length - 1 && <Conn />}
                        </Fragment>
                    ))}
                </div>
                {diagram.kind === "stack" && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10px] text-white/45 tracking-widest uppercase">
                        <span className="sch-pulse text-brand/60">↻</span> attention + FFN repeat × N
                    </div>
                )}
                {diagram.kind === "loop" && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10px] text-brand/60 tracking-widest uppercase">
                        <span className="sch-pulse">↻</span> runs on a loop
                    </div>
                )}
                <Caption text={diagram.caption} />
            </div>
        );
    }

    if (diagram.kind === "fanout") {
        return (
            <div className="w-full" role="img" aria-label={`Fan-out: ${diagram.source.label} to ${diagram.agents.map((a) => a.label).join(", ")} to ${diagram.out.label}`}>
                <div className={ROW}>
                    <Node label={diagram.source.label} sub={diagram.source.sub} className="flex-1 min-w-0 flex flex-col justify-center" />
                    <Conn />
                    <div className="flex-1 min-w-0 rounded-xl border border-brand/25 bg-brand/[0.03] p-2 flex flex-col gap-1.5">
                        <span className="font-mono text-[9px] text-white/35 tracking-[0.25em] uppercase text-center">agents</span>
                        {diagram.agents.map((a, i) => (
                            <Node key={i} label={a.label} sub={a.sub} accent />
                        ))}
                    </div>
                    <Conn />
                    <Node label={diagram.sink.label} sub={diagram.sink.sub} className="flex-1 min-w-0 flex flex-col justify-center" />
                    <Conn />
                    <Node label={diagram.out.label} sub={diagram.out.sub} className="flex-1 min-w-0 flex flex-col justify-center" />
                </div>
                <Caption text={diagram.caption} />
            </div>
        );
    }

    // secure
    const d = diagram;
    return (
        <div className="w-full" role="img" aria-label={`Encrypted channel between ${d.left.label} and ${d.right.label}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-2 w-full">
                <Node label={d.left.label} sub={d.left.sub} accent className="flex-1 min-w-0" />
                <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-2" aria-hidden="true">
                    <span className="font-mono text-[9px] text-white/35 tracking-widest">{d.tunnel}</span>
                    <div className="rounded-full border border-brand/50 bg-brand/10 px-3.5 py-1 text-brand font-mono text-[11px] font-bold tracking-wide">⬡ SEALED</div>
                    <span className="sch-pulse text-brand/60 text-sm leading-none">
                        <span className="md:hidden">↕</span>
                        <span className="hidden md:inline">↔</span>
                    </span>
                </div>
                <Node label={d.right.label} sub={d.right.sub} className="flex-1 min-w-0" />
            </div>
            <Caption text={d.caption} />
        </div>
    );
}
