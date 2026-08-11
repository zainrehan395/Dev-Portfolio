"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

type HeroCameraProps = {
  radius?: number;
};

/**
 * Top-down orbit camera with soft mouse parallax.
 * Adapted from franky-adl/3d-wave-grid Camera (MIT).
 */
export function HeroCamera({ radius = 14 }: HeroCameraProps) {
  const { camera, pointer } = useThree();
  const lerped = useRef(new THREE.Vector2(0, 0));
  const alphaRange = Math.PI * 0.03;
  const betaRange = Math.PI * 0.05;

  useFrame(() => {
    lerped.current.x += (pointer.x - lerped.current.x) * 0.04;
    lerped.current.y += (pointer.y - lerped.current.y) * 0.04;

    const alpha = lerped.current.y * alphaRange;
    const beta = lerped.current.x * betaRange;

    camera.position.set(
      -radius * Math.cos(alpha) * Math.sin(beta),
      radius * Math.cos(alpha) * Math.cos(beta),
      radius * Math.sin(alpha),
    );
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
