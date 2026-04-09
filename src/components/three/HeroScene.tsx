"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshDistortMaterial,
  Sphere,
} from "@react-three/drei";
import { useScroll, useTransform, MotionValue } from "framer-motion";
import * as THREE from "three";

// ── Floating sphere cluster ───────────────────────────────────────────────────

function FloatingSphere({
  position,
  scale,
  color,
  distort,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  distort: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]}
        position={position}
        scale={scale}
      >
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// ── Particle field ────────────────────────────────────────────────────────────

// Pre-computed at module level so Math.random() is never called during render
function buildParticlePositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 20;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  return arr;
}
const DEFAULT_PARTICLE_POSITIONS = buildParticlePositions(120);

function Particles({ count = 120 }: { count?: number }) {
  const positions = useMemo(
    () =>
      count === 120
        ? DEFAULT_PARTICLE_POSITIONS
        : buildParticlePositions(count),
    [count],
  );

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#c9a84c"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ── Scene contents ────────────────────────────────────────────────────────────

function SceneContents({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollProgress.get();
    groupRef.current.position.y = -p * 3;
    groupRef.current.rotation.z = p * 0.3;
  });

  return (
    <group ref={groupRef}>
      <FloatingSphere
        position={[0, 0, -2]}
        scale={2.2}
        color="#1a1a2e"
        distort={0.4}
        speed={1.5}
      />
      <FloatingSphere
        position={[-4, 1, -4]}
        scale={0.9}
        color="#c9a84c"
        distort={0.6}
        speed={2}
      />
      <FloatingSphere
        position={[4.5, -1, -3]}
        scale={1.2}
        color="#2d2d4e"
        distort={0.3}
        speed={1.2}
      />
      <FloatingSphere
        position={[-2.5, -2.5, -5]}
        scale={0.6}
        color="#c9a84c"
        distort={0.5}
        speed={2.5}
      />
      <Particles />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, 2, -2]} intensity={0.8} color="#c9a84c" />
    </group>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, 800], [0, 1]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContents scrollProgress={scrollProgress} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
