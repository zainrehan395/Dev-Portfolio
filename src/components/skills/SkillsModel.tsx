"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useAnimations, useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/skills.glb";
const BASE = new THREE.Color("#66726b");
const HOT = new THREE.Color("#e6eae7");
const IDLE = new THREE.Color("#40423b");

type SkillsModelProps = {
  scroll: MutableRefObject<number>;
};

export function SkillsModel({ scroll, ...props }: SkillsModelProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const action = actions["CameraAction.005"];
    if (!action) return;
    action.play();
    action.paused = true;
  }, [actions]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame((state) => {
    const action = actions["CameraAction.005"];
    if (action) {
      const duration = action.getClip().duration;
      action.time = THREE.MathUtils.lerp(
        action.time,
        duration * scroll.current,
        0.05,
      );
    }

    const cluster = group.current?.children[0] as THREE.Group | undefined;
    if (!cluster) return;

    cluster.children.forEach((child, index) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const mat = child.material as THREE.MeshStandardMaterial;
      if (!mat.color) return;

      const target =
        hovered === child.name ? HOT : scroll.current > 0.02 ? BASE : IDLE;
      mat.color.lerp(target, hovered === child.name ? 0.12 : 0.05);

      const et = state.clock.elapsedTime;
      child.position.y = Math.sin((et + index * 2) / 2) * 0.35;
      child.rotation.x = Math.sin((et + index * 2) / 3) / 12;
      child.rotation.y = Math.cos((et + index * 2) / 2) / 12;
      child.rotation.z = Math.sin((et + index * 2) / 3) / 12;
    });
  });

  const extras = {
    receiveShadow: true,
    castShadow: true,
    "material-envMapIntensity": 0.35,
  } as const;

  return (
    <group ref={group} {...props} dispose={null}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(e.object.name);
        }}
        onPointerOut={() => setHovered(null)}
        position={[0.06, 4.04, 0.35]}
        scale={[0.25, 0.25, 0.25]}
      >
        <mesh
          name="Headphones"
          geometry={(nodes.Headphones as THREE.Mesh).geometry}
          material={materials.M_Headphone}
          {...extras}
        />
        <mesh
          name="Notebook"
          geometry={(nodes.Notebook as THREE.Mesh).geometry}
          material={materials.M_Notebook}
          {...extras}
        />
        <mesh
          name="Rocket003"
          geometry={(nodes.Rocket003 as THREE.Mesh).geometry}
          material={materials.M_Rocket}
          {...extras}
        />
        <mesh
          name="Roundcube001"
          geometry={(nodes.Roundcube001 as THREE.Mesh).geometry}
          material={materials.M_Roundcube}
          {...extras}
        />
        <mesh
          name="Table"
          geometry={(nodes.Table as THREE.Mesh).geometry}
          material={materials.M_Table}
          {...extras}
        />
        <mesh
          name="VR_Headset"
          geometry={(nodes.VR_Headset as THREE.Mesh).geometry}
          material={materials.M_Headset}
          {...extras}
        />
        <mesh
          name="Zeppelin"
          geometry={(nodes.Zeppelin as THREE.Mesh).geometry}
          material={materials.M_Zeppelin}
          {...extras}
        />
      </group>

      <group
        name="Camera"
        position={[-1.78, 2.04, 23.58]}
        rotation={[1.62, 0.01, 0.11]}
      >
        <PerspectiveCamera makeDefault far={100} near={0.1} fov={28} rotation={[-Math.PI / 2, 0, 0]}>
          <directionalLight
            castShadow
            position={[10, 20, 15]}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-left={-8}
            shadow-camera-bottom={-8}
            shadow-mapSize={[1024, 1024]}
            intensity={2 * Math.PI}
            shadow-bias={-0.0001}
          />
        </PerspectiveCamera>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
