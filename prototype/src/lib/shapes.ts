// Each generator returns Float32Array of length N*3 (x, y, z) in roughly [-1, 1].
// Coordinates feed into a points cloud — order matters because particles morph by index.

export type ShapeName = "silhouette" | "text" | "sphere" | "wave";

const RNG = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};

// Pick a uniformly random point inside an ellipse described by center + radii.
function ellipsePoint(rand: () => number, cx: number, cy: number, rx: number, ry: number) {
  const u = rand();
  const v = rand();
  const r = Math.sqrt(u);
  const theta = v * Math.PI * 2;
  return [cx + Math.cos(theta) * r * rx, cy + Math.sin(theta) * r * ry];
}

// Procedural side-profile silhouette (mirrors the reference dotted figure).
// Body parts are stacked ellipses in normalized [-1, 1] space.
export function silhouette(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = RNG(7);

  const parts = [
    { cx: 0.04, cy: 0.82, rx: 0.13, ry: 0.14, weight: 11 },   // head
    { cx: -0.05, cy: 0.74, rx: 0.07, ry: 0.05, weight: 3 },   // ponytail behind head
    { cx: 0.0, cy: 0.65, rx: 0.05, ry: 0.05, weight: 3 },     // neck
    { cx: 0.0, cy: 0.46, rx: 0.18, ry: 0.16, weight: 18 },    // torso/chest
    { cx: 0.06, cy: 0.42, rx: 0.10, ry: 0.08, weight: 6 },    // arm front (folded)
    { cx: -0.04, cy: 0.20, rx: 0.16, ry: 0.12, weight: 14 },  // hips
    { cx: -0.02, cy: -0.05, rx: 0.12, ry: 0.16, weight: 14 }, // upper leg
    { cx: 0.02, cy: -0.30, rx: 0.05, ry: 0.07, weight: 4 },   // knee
    { cx: 0.02, cy: -0.55, rx: 0.10, ry: 0.18, weight: 14 },  // calf
    { cx: 0.10, cy: -0.85, rx: 0.13, ry: 0.05, weight: 8 },   // foot
  ];

  const totalWeight = parts.reduce((s, p) => s + p.weight, 0);

  let i = 0;
  while (i < n) {
    const target = rand() * totalWeight;
    let acc = 0;
    let chosen = parts[0];
    for (const p of parts) {
      acc += p.weight;
      if (target <= acc) {
        chosen = p;
        break;
      }
    }
    const [x, y] = ellipsePoint(rand, chosen.cx, chosen.cy, chosen.rx, chosen.ry);
    // Light depth jitter so the cloud feels three-dimensional.
    const z = (rand() - 0.5) * 0.15;
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
    i++;
  }
  return out;
}

// Sample pixels of rendered text, then map to normalized space.
export function textShape(n: number, label = "JUNSANG"): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = RNG(31);

  const W = 800;
  const H = 240;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 180px 'Cormorant Garamond', Georgia, serif";
  ctx.fillText(label, W / 2, H / 2);

  const pixels = ctx.getImageData(0, 0, W, H).data;
  const dark: [number, number][] = [];
  // Stride keeps the sampling cost predictable for any text size.
  const stride = 3;
  for (let y = 0; y < H; y += stride) {
    for (let x = 0; x < W; x += stride) {
      const idx = (y * W + x) * 4;
      if (pixels[idx] < 90) dark.push([x, y]);
    }
  }

  if (dark.length === 0) {
    // Fallback: distribute on a horizontal line.
    for (let i = 0; i < n; i++) {
      out[i * 3] = (i / n) * 2 - 1;
      out[i * 3 + 1] = 0;
      out[i * 3 + 2] = 0;
    }
    return out;
  }

  for (let i = 0; i < n; i++) {
    const [px, py] = dark[Math.floor(rand() * dark.length)];
    const nx = (px / W - 0.5) * 2.0;
    const ny = -(py / H - 0.5) * 0.6;
    const jitter = 0.008;
    out[i * 3] = nx + (rand() - 0.5) * jitter;
    out[i * 3 + 1] = ny + (rand() - 0.5) * jitter;
    out[i * 3 + 2] = (rand() - 0.5) * 0.05;
  }
  return out;
}

// Fibonacci sphere — gives an even distribution without clumping at the poles.
export function sphere(n: number, radius = 0.85): Float32Array {
  const out = new Float32Array(n * 3);
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
}

// Sine wave on a square grid — playful, geometric counterpoint to the figure.
export function wave(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const rand = RNG(91);
  let i = 0;
  for (let r = 0; r < rows && i < n; r++) {
    for (let c = 0; c < cols && i < n; c++) {
      const u = c / (cols - 1);
      const v = r / (rows - 1);
      const x = u * 2 - 1;
      const z = v * 2 - 1;
      const y = Math.sin(x * 4) * 0.18 + Math.cos(z * 4) * 0.18;
      const j = 0.01;
      out[i * 3] = x * 0.95 + (rand() - 0.5) * j;
      out[i * 3 + 1] = y + (rand() - 0.5) * j;
      out[i * 3 + 2] = z * 0.6 + (rand() - 0.5) * j;
      i++;
    }
  }
  return out;
}

export function generate(name: ShapeName, n: number): Float32Array {
  switch (name) {
    case "silhouette":
      return silhouette(n);
    case "text":
      return textShape(n);
    case "sphere":
      return sphere(n);
    case "wave":
      return wave(n);
  }
}
