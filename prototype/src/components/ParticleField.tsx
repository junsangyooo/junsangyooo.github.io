"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  generate,
  loadPortrait3D,
  type PortraitData,
  type ShapeName,
} from "@/lib/shapes";

const PARTICLE_COUNT = 5200;
// Portrait sits at index 0 — it is the default landing form. The remaining
// frames are placeholders until the rest of the design is decided. Forms
// advance only on explicit user input (click, drag, or keyboard).
const SHAPE_ORDER: ShapeName[] = ["portrait", "silhouette", "sphere", "text"];

function Particles({
  shape,
  scrollPower,
  inkColor,
  portraitData,
}: {
  shape: ShapeName;
  scrollPower: number;
  inkColor: string;
  portraitData: PortraitData | null;
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

  // Default per-particle sizes used by every non-portrait shape. The portrait
  // shape overrides these from portraitData.sizes so dark facial regions read
  // as denser stipple.
  const defaultSizes = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i] = 0.6 + Math.random() * 1.6;
    }
    return arr;
  }, []);

  const initialTargets = useMemo(() => {
    if (shape === "portrait" && portraitData) return portraitData.positions;
    return generate(shape, PARTICLE_COUNT);
    // initialTargets is a first-render seed only; subsequent changes are
    // handled by the effect below, so the eslint exhaustive-deps complaint
    // about portraitData is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const targets = useRef<Float32Array>(initialTargets);

  useEffect(() => {
    if (shape === "portrait") {
      // Wait for the async portrait load to complete; once available, the
      // morph happens through the usual lerp toward the new targets.
      if (portraitData) targets.current = portraitData.positions;
      else targets.current = generate("sphere", PARTICLE_COUNT);
    } else {
      targets.current = generate(shape, PARTICLE_COUNT);
    }

    // Swap the per-particle size attribute so portrait darkness shows up only
    // while we're displaying the portrait shape.
    if (!ref.current) return;
    const sizeAttr = ref.current.geometry.attributes.size as
      | THREE.BufferAttribute
      | undefined;
    if (!sizeAttr) return;
    const target =
      shape === "portrait" && portraitData
        ? portraitData.sizes
        : defaultSizes;
    (sizeAttr.array as Float32Array).set(target);
    sizeAttr.needsUpdate = true;
  }, [shape, portraitData, defaultSizes]);

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
    // Slow ambient rotation keeps the portrait alive even when idle.
    // Scroll dials the rotation up; portrait is intentionally a bit slower.
    const idleRate = shape === "portrait" ? 0.045 : 0.06;
    ref.current.rotation.y += delta * (idleRate + scrollPower * 1.2);
    ref.current.rotation.x = scrollPower * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[defaultSizes, 1]} />
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
  const [portraitData, setPortraitData] = useState<PortraitData | null>(null);
  const shape = SHAPE_ORDER[shapeIdx];

  const advance = useCallback(() => {
    setShapeIdx((i) => {
      const next = (i + 1) % SHAPE_ORDER.length;
      onCycle?.(SHAPE_ORDER[next]);
      return next;
    });
  }, [onCycle]);

  // Load the multi-view 3D portrait once on mount.
  useEffect(() => {
    let cancelled = false;
    loadPortrait3D(PARTICLE_COUNT)
      .then((data) => {
        if (!cancelled) setPortraitData(data);
      })
      .catch((err) => {
        // Non-fatal: portrait simply falls back to a sphere.
        console.warn("[ParticleField] portrait load failed", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll dial.
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      setScrollPower(Math.min(1, window.scrollY / max));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Window-level pointer interaction: click or swipe advances the shape.
  // Listening on window means users can interact from anywhere on the page,
  // not just from inside this component's box. Interactive page elements
  // (links, buttons, form fields) are skipped so they keep working normally.
  useEffect(() => {
    if (!interactive) return;
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let moved = false;

    const isFormTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      return !!el.closest(
        "a, button, input, textarea, select, [data-no-particle]",
      );
    };

    const onDown = (e: PointerEvent) => {
      if (isFormTarget(e.target)) return;
      startX = e.clientX;
      startY = e.clientY;
      isDragging = true;
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
    };
    const onUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dist = Math.hypot(dx, dy);
      // Pure click counts; a swipe past the threshold counts.
      if (!moved || dist > 50) advance();
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [interactive, advance]);

  return (
    <div className={className} aria-hidden={!interactive}>
      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Particles
          shape={shape}
          scrollPower={scrollPower}
          inkColor={inkColor}
          portraitData={portraitData}
        />
      </Canvas>
    </div>
  );
}
