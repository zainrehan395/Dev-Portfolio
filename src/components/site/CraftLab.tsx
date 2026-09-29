"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type RefObject,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { skillGroups, skillStops } from "@/lib/data";
import { SystemsModel, MESH_TO_GROUP } from "@/components/craft/SystemsModel";
import { cn } from "@/lib/utils";

type PtrSceneProps = {
  scroll: MutableRefObject<number>;
  eventSource: RefObject<HTMLElement | null>;
  activeGroup: string | null;
  onHoverGroup: (groupId: string | null, meshName: string | null) => void;
  reducedMotion: boolean;
  inView: boolean;
};

function CraftCanvas({
  scroll,
  eventSource,
  activeGroup,
  onHoverGroup,
  reducedMotion,
  inView,
}: PtrSceneProps) {
  return (
    <Canvas
      className="!absolute inset-0 h-full w-full"
      shadows
      dpr={inView ? [1, 1.6] : [1, 1]}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      frameloop={inView ? "always" : "demand"}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#0a0c12"]} />
      <fog attach="fog" args={["#07080c", 18, 48]} />
      <ambientLight intensity={0.35 * Math.PI} color="#8a90a0" />
      <directionalLight
        position={[-8, 6, -4]}
        intensity={0.55 * Math.PI}
        color="#f5a524"
      />
      <Suspense fallback={null}>
        <SystemsModel
          scroll={scroll}
          activeGroup={activeGroup}
          onHoverGroup={onHoverGroup}
          reducedMotion={reducedMotion}
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

function StageFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-void-lift">
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 animate-pulse rounded-full border border-accent/40" />
        <div className="absolute inset-6 rounded-full border border-line-strong" />
        <p className="absolute inset-0 flex items-center justify-center telemetry text-accent">
          Loading systems
        </p>
      </div>
    </div>
  );
}

export function CraftLab() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const inView = useInView(section, { amount: 0.15, once: false });
  const reduce = useReducedMotion();
  const [activeGroup, setActiveGroup] = useState<string | null>("frontend");
  const [hoveredMesh, setHoveredMesh] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduce || !section.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          scroll.current = self.progress;
        },
      });
    }, section);
    return () => ctx.revert();
  }, [reduce]);

  const onHoverGroup = useCallback(
    (groupId: string | null, meshName: string | null) => {
      setHoveredMesh(meshName);
      if (groupId) setActiveGroup(groupId);
    },
    [],
  );

  const activeStop = useMemo(() => {
    if (hoveredMesh) {
      return skillStops.find((s) => s.mesh === hoveredMesh) ?? null;
    }
    const groupStops = skillStops.filter(
      (s) => MESH_TO_GROUP[s.mesh] === activeGroup,
    );
    return groupStops[0] ?? skillStops[0];
  }, [hoveredMesh, activeGroup]);

  const activeMeta = skillGroups.find((g) => g.id === activeGroup) ?? skillGroups[0];

  return (
    <section
      id="craft"
      ref={section}
      className="relative border-t border-line bg-void"
      aria-label="Craft and stack"
      style={{ minHeight: reduce ? undefined : "220vh" }}
    >
      <div
        className={cn(
          "relative mx-auto grid max-w-[1400px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-10 lg:py-0",
          !reduce && "lg:sticky lg:top-0 lg:h-[100dvh] lg:items-center",
        )}
      >
        <div className="relative z-10 max-w-xl">
          <p className="telemetry text-accent">Craft · interactive systems</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Systems I build with
          </h2>
          <p className="measure mt-4 text-ink-soft">
            Hover nodes in the assembly — frontend, backend, and cloud light up
            together. Scroll to orbit the camera through the stack.
          </p>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Skill groups">
            {skillGroups.map((g) => {
              const on = g.id === activeGroup;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveGroup(g.id)}
                  className={cn(
                    "btn-press rounded-[var(--radius-sm)] border px-4 py-2 text-sm font-semibold transition-colors duration-250",
                    on
                      ? "border-accent bg-accent text-on-accent"
                      : "border-line bg-void-panel text-ink-soft hover:border-accent/40 hover:text-ink",
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStop?.id ?? activeMeta.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 border-l-2 border-accent pl-5"
            >
              <p className="telemetry">{activeMeta.label}</p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {activeStop?.title ?? activeMeta.label}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                {activeStop?.copy ??
                  `${activeMeta.label} tools I use to ship production systems.`}
              </p>
              <ul className="mt-5 space-y-1.5">
                {activeMeta.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-ink-soft"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          ref={stage}
          className="relative aspect-[4/5] w-full overflow-hidden border border-line bg-void-lift sm:aspect-square lg:aspect-auto lg:h-[min(78vh,720px)]"
        >
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,color-mix(in_srgb,var(--void)_55%,transparent)_100%)]" />
          {ready ? (
            <CraftCanvas
              scroll={scroll}
              eventSource={stage}
              activeGroup={activeGroup}
              onHoverGroup={onHoverGroup}
              reducedMotion={Boolean(reduce)}
              inView={Boolean(inView || reduce)}
            />
          ) : (
            <StageFallback />
          )}
          <p className="pointer-events-none absolute bottom-4 left-4 z-[2] telemetry text-ink-soft">
            {hoveredMesh
              ? `Node · ${hoveredMesh.replace(/\d+/g, "")}`
              : "Pointer · explore nodes · scroll · orbit"}
          </p>
        </div>
      </div>
    </section>
  );
}
