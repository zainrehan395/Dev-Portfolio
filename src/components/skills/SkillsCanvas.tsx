"use client";

import { Suspense, type MutableRefObject, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { SkillsModel } from "@/components/skills/SkillsModel";

type SkillsCanvasProps = {
  scroll: MutableRefObject<number>;
  eventSource: RefObject<HTMLElement | null>;
};

export default function SkillsCanvas({ scroll, eventSource }: SkillsCanvasProps) {
  return (
    <Canvas
      className="!absolute inset-0 h-full w-full"
      shadows
      dpr={[1, 1.75]}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#F8EDE3"]} />
      <fog attach="fog" args={["#BDD2B6", 12, 42]} />
      <ambientLight intensity={Math.PI * 0.7} />
      <Suspense fallback={null}>
        <SkillsModel scroll={scroll} />
        {/* <Environment preset="city" /> */}
      </Suspense>
    </Canvas>
  );
}
