"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { MouseTrail } from "@/components/hero/mouseTrail";
import {
  overrideFragmentShader,
  overrideVertexShader,
} from "@/components/hero/waveShader";

const CUBE_WIDTH = 0.8;
const CUBE_HEIGHT = 3;
const GAP = 0.01;

const WAVE = {
  amplitude: 0.4,
  speed: 6.0,
  frequency: 1.2,
  width: 3.0,
  jitter: 0.2,
  maxHeight: 0.4,
  colorBase: "#F8EDE3",
  colorHigh: "#BDD2B6",
};

type WaveGridProps = {
  gridSize?: number;
  enableShadows?: boolean;
  eventSource: RefObject<HTMLElement | null>;
};

export function WaveGrid({
  gridSize = 36,
  enableShadows = true,
  eventSource,
}: WaveGridProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const trailRef = useRef<MouseTrail | null>(null);
  const { camera, gl } = useThree();

  const bounds = gridSize * (CUBE_WIDTH + GAP);

  const { geometry, material, depthMaterial } = useMemo(() => {
    const count = gridSize * gridSize;
    const geo = new THREE.BoxGeometry(CUBE_WIDTH, CUBE_HEIGHT, CUBE_WIDTH);
    const offsets = new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2);
    geo.setAttribute("aOffset", offsets);

    const mat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const depth = new THREE.MeshDepthMaterial();

    return { geometry: geo, material: mat, depthMaterial: depth };
  }, [gridSize]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    const spacing = CUBE_WIDTH + GAP;
    const offset = ((gridSize - 1) * spacing) / 2;
    const offsetAttr = geometry.getAttribute("aOffset") as THREE.InstancedBufferAttribute;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = i * gridSize + j;
        const x = i * spacing - offset;
        const z = j * spacing - offset;
        dummy.position.set(x, 0, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        offsetAttr.setXY(index, x, z);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    offsetAttr.needsUpdate = true;
  }, [geometry, gridSize]);

  useEffect(() => {
    const element = eventSource.current ?? gl.domElement;
    const trail = new MouseTrail(camera, element, bounds);
    trailRef.current = trail;
    const mu = trail.uniforms;

    const attachWaveUniforms = (
      shader: THREE.WebGLProgramParametersWithUniforms,
      withColor: boolean,
    ) => {
      shader.uniforms.uTrailTexture = mu.uTrailTexture;
      shader.uniforms.uTrailCount = mu.uTrailCount;
      shader.uniforms.uFadeTime = mu.uFadeTime;
      shader.uniforms.uWaveSpeed = { value: WAVE.speed };
      shader.uniforms.uWaveFreq = { value: WAVE.frequency };
      shader.uniforms.uWaveWidth = { value: WAVE.width };
      shader.uniforms.uAmplitude = { value: WAVE.amplitude };
      shader.uniforms.uJitter = { value: WAVE.jitter };
      shader.uniforms.uMaxHeight = { value: WAVE.maxHeight };
      if (withColor) {
        shader.uniforms.uColorBase = { value: new THREE.Color(WAVE.colorBase) };
        shader.uniforms.uColorHigh = { value: new THREE.Color(WAVE.colorHigh) };
      }
      shader.vertexShader = overrideVertexShader(shader.vertexShader);
      if (withColor) {
        shader.fragmentShader = overrideFragmentShader(shader.fragmentShader);
      }
    };

    material.onBeforeCompile = (shader) => attachWaveUniforms(shader, true);
    depthMaterial.onBeforeCompile = (shader) => attachWaveUniforms(shader, false);
    material.customProgramCacheKey = () => "hero-wave-grid-v1";
    depthMaterial.customProgramCacheKey = () => "hero-wave-grid-depth-v1";
    material.needsUpdate = true;
    depthMaterial.needsUpdate = true;

    return () => {
      trail.dispose();
      trailRef.current = null;
    };
  }, [bounds, camera, depthMaterial, eventSource, gl.domElement, material]);

  useEffect(() => {
    trailRef.current?.setCamera(camera);
  }, [camera]);

  useFrame((_, delta) => {
    trailRef.current?.update(Math.min(delta, 0.05));
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      depthMaterial.dispose();
    };
  }, [depthMaterial, geometry, material]);

  const count = gridSize * gridSize;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow={enableShadows}
      receiveShadow={enableShadows}
      customDepthMaterial={depthMaterial}
    />
  );
}
