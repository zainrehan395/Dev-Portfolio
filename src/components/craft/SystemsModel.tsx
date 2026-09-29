"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  PerspectiveCamera,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { skillStops } from "@/lib/data";

const MODEL_URL = "/models/skills.glb";

const MESH_TO_GROUP: Record<string, "frontend" | "backend" | "systems"> = {
  VR_Headset: "frontend",
  Headphones: "frontend",
  Rocket003: "frontend",
  Roundcube001: "backend",
  Table: "backend",
  Notebook: "systems",
  Zeppelin: "systems",
};

const PALETTE = {
  idle: new THREE.Color("#2a3140"),
  base: new THREE.Color("#5c6578"),
  hot: new THREE.Color("#f5a524"),
  dim: new THREE.Color("#1a1f2a"),
};

type SystemsModelProps = {
  scroll: MutableRefObject<number>;
  activeGroup: string | null;
  onHoverGroup: (groupId: string | null, meshName: string | null) => void;
  reducedMotion?: boolean;
};

export function SystemsModel({
  scroll,
  activeGroup,
  onHoverGroup,
  reducedMotion = false,
  ...props
}: SystemsModelProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const [hovered, setHovered] = useState<string | null>(null);
  const basePositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const scaleScratch = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useEffect(() => {
    const action = actions["CameraAction.005"];
    if (!action) return;
    action.play();
    action.paused = true;
    if (reducedMotion) {
      action.time = action.getClip().duration * 0.35;
    }
  }, [actions, reducedMotion]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useEffect(() => {
    const cluster = group.current?.children[0] as THREE.Group | undefined;
    if (!cluster || basePositions.current.size) return;
    cluster.children.forEach((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      basePositions.current.set(child.name, child.position.clone());
      const mat = child.material as THREE.MeshStandardMaterial;
      if (!mat?.clone) return;
      const cloned = mat.clone();
      cloned.metalness = 0.62;
      cloned.roughness = 0.32;
      cloned.envMapIntensity = 0.85;
      cloned.emissive = new THREE.Color("#000000");
      cloned.emissiveIntensity = 0.02;
      child.material = cloned;
    });
  }, [nodes]);

  useFrame((state) => {
    const action = actions["CameraAction.005"];
    if (action && !reducedMotion) {
      const duration = action.getClip().duration;
      action.time = THREE.MathUtils.lerp(
        action.time,
        duration * scroll.current,
        0.06,
      );
    }

    const cluster = group.current?.children[0] as THREE.Group | undefined;
    if (!cluster) return;

    const et = state.clock.elapsedTime;
    cluster.children.forEach((child, index) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const mat = child.material as THREE.MeshStandardMaterial;
      if (!mat.color) return;

      const groupId = MESH_TO_GROUP[child.name];
      const isHot =
        hovered === child.name ||
        (activeGroup !== null && groupId === activeGroup);
      const isDim =
        activeGroup !== null && groupId !== activeGroup && hovered !== child.name;

      const target = isHot
        ? PALETTE.hot
        : isDim
          ? PALETTE.dim
          : scroll.current > 0.02
            ? PALETTE.base
            : PALETTE.idle;
      mat.color.lerp(target, isHot ? 0.14 : 0.06);
      if (mat.emissive) {
        mat.emissive.lerp(
          isHot ? PALETTE.hot : PALETTE.idle,
          0.1,
        );
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          isHot ? 0.45 : 0.02,
          0.1,
        );
      }

      if (!reducedMotion) {
        const base = basePositions.current.get(child.name);
        const floatY = Math.sin((et + index * 2) / 2) * 0.28;
        if (base) {
          child.position.y = base.y + floatY;
        }
        child.rotation.x = Math.sin((et + index * 2) / 3) / 14;
        child.rotation.y = Math.cos((et + index * 2) / 2) / 14;
        child.rotation.z = Math.sin((et + index * 2) / 3) / 14;
        const scale = isHot ? 1.08 : 1;
        scaleScratch.set(scale, scale, scale);
        child.scale.lerp(scaleScratch, 0.08);
      }
    });
  });

  const extras = {
    receiveShadow: true,
    castShadow: true,
  } as const;

  function handleOver(name: string) {
    setHovered(name);
    onHoverGroup(MESH_TO_GROUP[name] ?? null, name);
  }

  function handleOut() {
    setHovered(null);
    onHoverGroup(null, null);
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          handleOver(e.object.name);
        }}
        onPointerOut={handleOut}
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
        <PerspectiveCamera
          makeDefault
          far={100}
          near={0.1}
          fov={28}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <directionalLight
            castShadow
            position={[10, 20, 15]}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-left={-8}
            shadow-camera-bottom={-8}
            shadow-mapSize={[1024, 1024]}
            intensity={2.2 * Math.PI}
            color="#fff4e0"
            shadow-bias={-0.0001}
          />
        </PerspectiveCamera>
      </group>

      <ContactShadows
        position={[0, 0.2, 0]}
        opacity={0.55}
        scale={28}
        blur={2.8}
        far={12}
        color="#000000"
      />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export { MESH_TO_GROUP, skillStops };
