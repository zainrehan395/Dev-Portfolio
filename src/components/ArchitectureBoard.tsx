"use client";

import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { archNodes } from "@/lib/data";

type Point = { x: number; y: number };

function pathBetween(a: Point, b: Point) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 6;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export function ArchitectureBoard() {
  const [active, setActive] = useState<string | null>("api");
  const [cursor, setCursor] = useState({ x: 50, y: 40 });

  const nodeMap = useMemo(
    () => Object.fromEntries(archNodes.map((n) => [n.id, n])),
    [],
  );

  const lit = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active]);
    const node = nodeMap[active];
    node?.connects.forEach((id) => set.add(id));
    archNodes.forEach((n) => {
      if (n.connects.includes(active)) set.add(n.id);
    });
    return set;
  }, [active, nodeMap]);

  const edges = useMemo(() => {
    const list: { id: string; d: string; hot: boolean }[] = [];
    archNodes.forEach((from) => {
      from.connects.forEach((toId) => {
        const to = nodeMap[toId];
        if (!to) return;
        const hot = lit.has(from.id) && lit.has(to.id);
        list.push({
          id: `${from.id}-${toId}`,
          d: pathBetween({ x: from.x, y: from.y }, { x: to.x, y: to.y }),
          hot,
        });
      });
    });
    return list;
  }, [lit, nodeMap]);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const activeLabel = active ? nodeMap[active]?.label : null;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseMove={onMove}
      onMouseLeave={() => setActive("api")}
    >
      <div className="grid-mesh absolute inset-0 opacity-80" aria-hidden="true" />
      <div
        className="pointer-events-none absolute h-[42vmin] w-[42vmin] rounded-full opacity-50 blur-3xl transition-transform duration-500 ease-out"
        style={{
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(189,210,182,0.45) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {edges.map((edge) => (
          <path
            key={edge.id}
            d={edge.d}
            fill="none"
            stroke={edge.hot ? "var(--cream)" : "var(--line)"}
            strokeWidth={edge.hot ? 0.45 : 0.22}
            strokeOpacity={edge.hot ? 0.9 : 0.45}
            className="transition-all duration-300"
            strokeDasharray={edge.hot ? "1.2 0.8" : "0"}
          >
            {edge.hot && (
              <animate
                attributeName="stroke-dashoffset"
                from="4"
                to="0"
                dur="1.2s"
                repeatCount="indefinite"
              />
            )}
          </path>
        ))}

        {archNodes.map((node) => {
          const isLit = lit.has(node.id);
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isLit ? 1.8 : 1.15}
                fill={isLit ? "var(--cream)" : "var(--muted)"}
                fillOpacity={isLit ? 0.95 : 0.45}
                className="transition-all duration-300"
              />
              {isLit && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={3.2}
                  fill="none"
                  stroke="var(--cream)"
                  strokeOpacity={0.35}
                  strokeWidth={0.35}
                />
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0" role="group" aria-label="Interactive system architecture">
        {archNodes.map((node) => (
          <button
            key={node.id}
            type="button"
            className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onMouseEnter={() => setActive(node.id)}
            onFocus={() => setActive(node.id)}
            aria-pressed={active === node.id}
            aria-label={`Highlight ${node.label}`}
          />
        ))}
      </div>

      {activeLabel && (
        <p
          className="pointer-events-none absolute bottom-[38%] right-5 hidden max-w-[10rem] text-right font-mono text-[11px] uppercase tracking-[0.16em] text-cream sm:block md:right-8"
          aria-live="polite"
        >
          {activeLabel}
        </p>
      )}
    </div>
  );
}
