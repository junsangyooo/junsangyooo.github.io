"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { generate, type ShapeName } from "@/lib/shapes";

const PARTICLE_COUNT = 5200;
const SHAPE_ORDER: ShapeName[] = ["silhouette", "sphere", "text", "wave"];
const CYCLE_MS = 5400;

function Particles({
  shape,
  scrollPower,
  inkColor,
}: {
  shape: ShapeName;
  scrollPower: number;
  inkColor: string;
}) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const colorObj = useMemo(() => new THREE.Color(inkColor), [inkColor]);

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);

  const sizes = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i] = 0.6 + Math.random() * 1.6;
    }
    return arr;
  }, []);

  const targets = useRef<Float32Array>(generate(shape, PARTICLE_COUNT));

  useEffect(() => {
    targets.current = generate(shape, PARTICLE_COUNT);
  }, [shape]);

  // Re-used vector to avoid per-frame allocations.
  const tmp = useMemo(() => new THREE.Vector2(), []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const target = targets.current;

    const mx = (state.pointer.x * viewport.width) / 2;
    const my = (state.pointer.y * viewport.height) / 2;

    const ease = 1 - Math.pow(0.001, delta);
    const repelRadius = 0.18;
    const repelStrength = 0.55;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      arr[ix] += (target[ix] - arr[ix]) * ease * 0.6;
      arr[iy] += (target[iy] - arr[iy]) * ease * 0.6;
      arr[iz] += (target[iz] - arr[iz]) * ease * 0.6;

      const dx = arr[ix] - mx;
      const dy = arr[iy] - my;
      tmp.set(dx, dy);
      const dist = tmp.length();
      if (dist < repelRadius && dist > 0.0001) {
        const force = (1 - dist / repelRadius) * repelStrength * delta;
        arr[ix] += (dx / dist) * force;
        arr[iy] += (dy / dist) * force;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    // Slow ambient rotation; scroll dial accelerates it.
    ref.current.rotation.y += delta * (0.06 + scrollPower * 1.2);
    ref.current.rotation.x = scrollPower * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{
          uColor: { value: colorObj },
          uPixelRatio: {
            value: typeof window !== "undefined" ? window.devicePixelRatio : 1,
          },
        }}
        vertexShader={`
          attribute float size;
          uniform float uPixelRatio;
          varying float vSize;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * uPixelRatio * (1.4 / -mvPosition.z);
            gl_PointSize *= 1.2;
            vSize = size;
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vSize;
          void main() {
            vec2 c = gl_PointCoord - vec2(0.5);
            float d = length(c);
            // Hard-edged dot, but slightly soft at the rim, like ink stipple.
            float alpha = smoothstep(0.5, 0.42, d);
            if (alpha < 0.02) discard;
            gl_FragColor = vec4(uColor, alpha * (0.7 + vSize * 0.18));
          }
        `}
      />
    </points>
  );
}

export default function ParticleField({
  className,
  onCycle,
  inkColor = "#1a1a1a",
  interactive = true,
}: {
  className?: string;
  onCycle?: (next: ShapeName) => void;
  inkColor?: string;
  interactive?: boolean;
}) {
  const [shapeIdx, setShapeIdx] = useState(0);
  const [scrollPower, setScrollPower] = useState(0);
  const shape = SHAPE_ORDER[shapeIdx];

  const advance = useCallback(() => {
    setShapeIdx((i) => {
      const next = (i + 1) % SHAPE_ORDER.length;
      onCycle?.(SHAPE_ORDER[next]);
      return next;
    });
  }, [onCycle]);

  useEffect(() => {
    const id = setInterval(advance, CYCLE_MS);
    return () => clearInterval(id);
  }, [advance]);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      setScrollPower(Math.min(1, window.scrollY / max));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const interactiveProps = interactive
    ? {
        onClick: advance,
        role: "button" as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") advance();
        },
        "aria-label": "Click to morph the figure",
      }
    : { "aria-hidden": true };

  return (
    <div className={className} {...interactiveProps}>
      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Particles shape={shape} scrollPower={scrollPower} inkColor={inkColor} />
      </Canvas>
    </div>
  );
}
