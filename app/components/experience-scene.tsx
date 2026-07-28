"use client";

import { Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import * as THREE from "three";

type SceneMode = "siteops" | "roof" | "glass";

function SiteOpsObject({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);

  useFrame(({ clock, pointer }) => {
    if (!group.current || reduced) return;
    const time = clock.getElapsedTime();
    group.current.rotation.y = time * 0.18 + pointer.x * 0.18;
    group.current.rotation.x = Math.sin(time * 0.22) * 0.12 + pointer.y * 0.08;
    const scale = THREE.MathUtils.lerp(
      group.current.scale.x,
      active ? 1.12 : 1,
      0.06,
    );
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group} onClick={() => setActive((value) => !value)}>
      <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.25} floatIntensity={0.5}>
        <mesh>
          <icosahedronGeometry args={[1.42, 3]} />
          <meshPhysicalMaterial
            color="#081424"
            emissive="#062448"
            emissiveIntensity={0.55}
            metalness={0.82}
            roughness={0.22}
            clearcoat={1}
            wireframe
          />
        </mesh>
        <mesh scale={0.67}>
          <icosahedronGeometry args={[1.42, 2]} />
          <meshPhysicalMaterial
            color="#0f85ff"
            emissive="#0a3f8c"
            emissiveIntensity={0.65}
            metalness={0.62}
            roughness={0.18}
            clearcoat={1}
          />
        </mesh>
      </Float>
      {[1.78, 2.05, 2.35].map((radius, index) => (
        <mesh
          key={radius}
          rotation={[
            Math.PI / (2.2 + index * 0.35),
            index * 0.76,
            index * 0.44,
          ]}
        >
          <torusGeometry args={[radius, 0.008 + index * 0.003, 8, 160]} />
          <meshBasicMaterial
            color={index === 1 ? "#ff6a2a" : "#36c7ff"}
            transparent
            opacity={0.5 - index * 0.08}
          />
        </mesh>
      ))}
      <Sparkles count={reduced ? 25 : 80} scale={5.8} size={1.3} color="#80dfff" />
    </group>
  );
}

function RoofObject({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current || reduced) return;
    group.current.rotation.y =
      -0.45 + Math.sin(clock.getElapsedTime() * 0.2) * 0.05 + pointer.x * 0.08;
    group.current.rotation.x = -0.18 + pointer.y * 0.04;
  });

  return (
    <group ref={group} rotation={[-0.18, -0.45, 0]} scale={1.05}>
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[2.5, 1.45, 2.2]} />
        <meshStandardMaterial color="#07131e" roughness={0.52} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.38, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.08, 1.2, 4]} />
        <meshStandardMaterial color="#15344a" roughness={0.27} metalness={0.72} />
      </mesh>
      {[-0.66, 0, 0.66].map((x) => (
        <mesh key={x} position={[x, 0.18, 1.23]} rotation={[0, 0, -0.78]}>
          <boxGeometry args={[0.04, 1.65, 0.05]} />
          <meshBasicMaterial color="#ff9a43" />
        </mesh>
      ))}
      <mesh position={[0, -1.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 1.94, 96]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function GlassObject({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current || reduced) return;
    group.current.rotation.y =
      -0.24 + Math.sin(clock.getElapsedTime() * 0.16) * 0.08 + pointer.x * 0.1;
    group.current.position.y = pointer.y * 0.08;
  });

  return (
    <group ref={group} rotation={[0.03, -0.24, -0.04]}>
      <mesh>
        <boxGeometry args={[2.8, 3.8, 0.16]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          resolution={256}
          transmission={1}
          thickness={0.4}
          roughness={0.08}
          chromaticAberration={0.035}
          anisotropy={0.18}
          color="#d7f7ff"
        />
      </mesh>
      <mesh position={[-1.48, 0, 0]}>
        <boxGeometry args={[0.06, 4.15, 0.23]} />
        <meshStandardMaterial color="#14181d" metalness={0.94} roughness={0.18} />
      </mesh>
      <mesh position={[1.48, 0, 0]}>
        <boxGeometry args={[0.06, 4.15, 0.23]} />
        <meshStandardMaterial color="#14181d" metalness={0.94} roughness={0.18} />
      </mesh>
      <mesh position={[0, -2.05, 0]}>
        <boxGeometry args={[3.02, 0.06, 0.23]} />
        <meshStandardMaterial color="#14181d" metalness={0.94} roughness={0.18} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[3.02, 0.06, 0.23]} />
        <meshStandardMaterial color="#14181d" metalness={0.94} roughness={0.18} />
      </mesh>
    </group>
  );
}

export function ExperienceScene({
  mode,
  className,
}: {
  mode: SceneMode;
  className?: string;
}) {
  const reduced = Boolean(useReducedMotion());

  return (
    <div className={["experience-scene", className].filter(Boolean).join(" ")}>
      <div className={`scene-fallback scene-fallback-${mode}`} aria-hidden="true" />
      <Canvas
        dpr={[1, 1.5]}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{
          position: mode === "glass" ? [0, 0, 6] : [0, 0, 5.8],
          fov: mode === "roof" ? 42 : 38,
        }}
      >
        <ambientLight intensity={mode === "glass" ? 1.5 : 0.62} />
        <directionalLight
          position={[3.5, 5, 4]}
          intensity={mode === "glass" ? 3.2 : 2.6}
          color={mode === "roof" ? "#9edfff" : "#ffffff"}
        />
        <pointLight
          position={[-3, -2, 3]}
          intensity={2.2}
          color={mode === "roof" ? "#ff8634" : "#198cff"}
        />
        {mode === "siteops" && <SiteOpsObject reduced={reduced} />}
        {mode === "roof" && <RoofObject reduced={reduced} />}
        {mode === "glass" && <GlassObject reduced={reduced} />}
      </Canvas>
    </div>
  );
}
