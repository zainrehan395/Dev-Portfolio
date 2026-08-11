"use client";

import { type RefObject, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { HeroCamera } from "@/components/hero/HeroCamera";
import { WaveGrid } from "@/components/hero/WaveGrid";

type HeroCanvasProps = {
  eventSource: RefObject<HTMLElement | null>;
};

export default function HeroCanvas({ eventSource }: HeroCanvasProps) {
  const [gridSize, setGridSize] = useState(36);
  const [shadows, setShadows] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      const mobile = mq.matches;
      setGridSize(mobile ? 24 : 36);
      setShadows(!mobile);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <Canvas
      className="!absolute inset-0 h-full w-full"
      shadows={shadows}
      dpr={[1, 1.5]}
      camera={{ fov: 40, near: 0.1, far: 200, position: [0, 14, 0] }}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#5f6d5e"]} />
      <ambientLight intensity={0.55} color="#ffffff" />
      <directionalLight
        castShadow={shadows}
        intensity={3.2}
        position={[-20, 10, 6]}
        color="#ffffff"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={60}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={0.0001}
        shadow-radius={6}
      />
      <directionalLight intensity={0.9} position={[10, 5, -3]} color="#ffffff" />
      <HeroCamera radius={14} />
      <WaveGrid
        gridSize={gridSize}
        enableShadows={shadows}
        eventSource={eventSource}
      />
    </Canvas>
  );
}
