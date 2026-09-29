"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { archNodes } from "@/lib/data";
import { cn } from "@/lib/utils";

type Node = (typeof archNodes)[number];

function neighborsOf(id: string): Set<string> {
  const set = new Set<string>([id]);
  for (const n of archNodes) {
    if (n.id === id) n.connects.forEach((c) => set.add(c));
    if (n.connects.includes(id)) set.add(n.id);
  }
  return set;
}

export function SignalMap() {
  const [active, setActive] = useState<string | null>("app");
  const reduce = useReducedMotion();

  const lit = useMemo(
    () => (active ? neighborsOf(active) : new Set<string>()),
    [active],
  );

  const activeNode = archNodes.find((n) => n.id === active) ?? archNodes[0];

  const edges = useMemo(() => {
    const list: { from: Node; to: Node; key: string }[] = [];
    for (const n of archNodes) {
      for (const c of n.connects) {
        const to = archNodes.find((x) => x.id === c);
        if (to) list.push({ from: n, to, key: `${n.id}-${c}` });
      }
    }
    return list;
  }, []);

  return (
    <section
      id="systems"
      className="section-pad relative overflow-hidden border-t border-line bg-void"
      aria-label="System topology"
    >
      <div
        className="pointer-events-none absolute -left-[10%] bottom-0 h-[40vmin] w-[40vmin] rounded-full bg-[radial-gradient(circle,var(--accent-glow),transparent_70%)] blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="telemetry text-accent">Systems · topology</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            How a product usually wires together
          </h2>
          <p className="measure mt-4 text-ink-soft">
            Hover a node to light its signal path — the same mental model I use
            when shaping frontend, API, and cloud boundaries.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-10">
          <div
            className="relative aspect-[16/11] overflow-hidden border border-line bg-void-panel sm:aspect-[16/10]"
            onMouseLeave={() => setActive("app")}
          >
            <svg
              viewBox="0 0 100 80"
              className="h-full w-full"
              role="img"
              aria-label="Interactive architecture diagram"
            >
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* grid ticks */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={`vx-${i}`}
                  x1={10 + i * 10}
                  y1={8}
                  x2={10 + i * 10}
                  y2={72}
                  stroke="color-mix(in srgb, var(--ink) 6%, transparent)"
                  strokeWidth="0.15"
                />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line
                  key={`hy-${i}`}
                  x1={8}
                  y1={10 + i * 10}
                  x2={92}
                  y2={10 + i * 10}
                  stroke="color-mix(in srgb, var(--ink) 6%, transparent)"
                  strokeWidth="0.15"
                />
              ))}

              {edges.map(({ from, to, key }) => {
                const on =
                  active &&
                  lit.has(from.id) &&
                  lit.has(to.id) &&
                  (from.id === active ||
                    to.id === active ||
                    from.connects.includes(active) ||
                    to.connects.includes(active));
                return (
                  <line
                    key={key}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={on ? "var(--accent)" : "color-mix(in srgb, var(--ink) 18%, transparent)"}
                    strokeWidth={on ? 0.55 : 0.28}
                    strokeOpacity={on ? 0.95 : 0.55}
                    className="transition-[stroke,stroke-width,stroke-opacity] duration-300"
                  />
                );
              })}

              {archNodes.map((n) => {
                const on = lit.has(n.id);
                const isActive = n.id === active;
                return (
                  <g
                    key={n.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setActive(n.id)}
                    onFocus={() => setActive(n.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isActive}
                    aria-label={n.label}
                    data-cursor={n.label}
                  >
                    {isActive && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={7}
                        fill="url(#nodeGlow)"
                      />
                    )}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isActive ? 2.6 : 2.1}
                      fill={on ? "var(--accent)" : "var(--void-lift)"}
                      stroke={on ? "var(--accent)" : "color-mix(in srgb, var(--ink) 35%, transparent)"}
                      strokeWidth={0.4}
                      className="transition-[fill,stroke,r] duration-300"
                    />
                    <text
                      x={n.x}
                      y={n.y + 5.8}
                      textAnchor="middle"
                      className="fill-ink-soft"
                      style={{
                        fontSize: "2.2px",
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.08em",
                        fill: on
                          ? "var(--ink)"
                          : "color-mix(in srgb, var(--ink) 45%, transparent)",
                      }}
                    >
                      {n.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            <p className="pointer-events-none absolute bottom-3 left-4 telemetry text-ink-soft">
              Pointer · trace signal paths
            </p>
          </div>

          <div className="flex flex-col justify-between border border-line bg-void-panel p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="telemetry text-accent">Active node</p>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
                  {activeNode.label}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">
                  {nodeCopy(activeNode.id)}
                </p>
              </motion.div>
            </AnimatePresence>

            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Related nodes">
              {archNodes.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => setActive(n.id)}
                    data-cursor={n.label}
                    className={cn(
                      "btn-press rounded-[var(--radius-sm)] border px-3 py-1.5 text-xs font-semibold transition-colors duration-250",
                      n.id === active
                        ? "border-accent bg-accent text-on-accent"
                        : lit.has(n.id)
                          ? "border-accent/40 bg-void text-ink"
                          : "border-line bg-void text-muted hover:border-accent/30 hover:text-ink",
                    )}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function nodeCopy(id: string): string {
  switch (id) {
    case "client":
      return "Browser and client surfaces — where performance, accessibility, and motion have to feel inevitable.";
    case "cdn":
      return "Edge delivery and caching so first paint stays fast worldwide without shipping the whole origin every time.";
    case "app":
      return "Next.js rendering, routing, and composition — the product shell that binds UI to services.";
    case "api":
      return "Node and NestJS contracts — stable endpoints, clear domain boundaries, room to grow under load.";
    case "auth":
      return "Identity and session boundaries so features stay secure without slowing the product down.";
    case "db":
      return "MongoDB and SQL models tuned for the access patterns the product actually has.";
    case "queue":
      return "Lambda and async work — offload heavy jobs so the request path stays responsive.";
    case "obs":
      return "CI/CD and release hygiene — predictable deploys so shipping stays a habit, not a risk.";
    default:
      return "A building block in the production graph.";
  }
}
