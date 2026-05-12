// Each generator returns Float32Array of length N*3 (x, y, z) in roughly [-1, 1].
// Coordinates feed into a points cloud — order matters because particles morph by index.

export type ShapeName = "portrait" | "silhouette" | "text" | "sphere" | "wave";

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
    case "portrait":
      // Portrait must be loaded asynchronously — caller should use loadPortrait()
      // and cache the result. Until that resolves, fall back to a sphere so the
      // morph target is well-formed.
      return sphere(n);
  }
}

// PortraitData carries both the morph target positions AND a per-point size
// array. The size array communicates per-particle darkness picked up from the
// photos, so hair / brows / shirt seams read as dense regions while flat skin
// stays sparse. ParticleField swaps the size attribute when entering /
// leaving the portrait shape.
export type PortraitData = {
  positions: Float32Array;
  sizes: Float32Array;
};

type ImageSamples = {
  W: number;
  H: number;
  data: Uint8ClampedArray; // RGBA
  hasAlpha: boolean;
};

async function loadImageSamples(src: string): Promise<ImageSamples> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        // Working canvas — 256px wide is plenty for normalized (u, v) sampling
        // and keeps the per-particle lookup cost negligible.
        const W = 256;
        const H = Math.max(1, Math.round((img.height / img.width) * W));
        const canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2D canvas context unavailable");
        ctx.drawImage(img, 0, 0, W, H);
        const imgData = ctx.getImageData(0, 0, W, H);
        // Probe alpha channel — PNGs with a cut-out subject report alpha < 255
        // on the background pixels.
        let hasAlpha = false;
        for (let i = 3; i < imgData.data.length; i += 4) {
          if (imgData.data[i] < 250) {
            hasAlpha = true;
            break;
          }
        }
        resolve({ W, H, data: imgData.data, hasAlpha });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

// Returns darkness in [0, 1] at the normalized image coordinate (u, v).
// Out-of-bounds / transparent / near-white pixels return 0 so they contribute
// nothing to the weighted sum.
function sampleDarkness(img: ImageSamples, u: number, v: number): number {
  if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
  const x = Math.min(img.W - 1, Math.floor(u * img.W));
  const y = Math.min(img.H - 1, Math.floor(v * img.H));
  const i = (y * img.W + x) * 4;
  if (img.hasAlpha && img.data[i + 3] < 16) return 0;
  const r = img.data[i];
  const g = img.data[i + 1];
  const b = img.data[i + 2];
  const lum = (r + g + b) / 3;
  // For JPEGs (no alpha), the white studio background reads as bright;
  // treat near-white pixels as background.
  if (!img.hasAlpha && lum > 235) return 0;
  const t = 1 - lum / 255;
  return Math.max(0, Math.min(1, t));
}

// Build a cumulative-weight table over the dark pixels of an image so we can
// draw weighted samples cheaply. Each entry is (x, y, weight^3) where weight
// is darkness in [0, 1]; cubing emphasizes the truly dark regions (hair,
// brows, eyes, lips, shirt seams) and demotes mid-tones (skin) so the cloud
// reads as stipple rather than a flat density wash.
type WeightedPool = {
  xs: number[];
  ys: number[];
  cum: number[];
  total: number;
  W: number;
  H: number;
};

function buildWeightedPool(
  img: ImageSamples,
  region?: { u0: number; u1: number; v0: number; v1: number },
  emphasis = 3,
): WeightedPool {
  const xs: number[] = [];
  const ys: number[] = [];
  const cum: number[] = [];
  let total = 0;
  const stride = 2;

  const x0 = Math.floor((region?.u0 ?? 0) * img.W);
  const x1 = Math.ceil((region?.u1 ?? 1) * img.W);
  const y0 = Math.floor((region?.v0 ?? 0) * img.H);
  const y1 = Math.ceil((region?.v1 ?? 1) * img.H);

  for (let y = y0; y < y1; y += stride) {
    for (let x = x0; x < x1; x += stride) {
      const i = (y * img.W + x) * 4;
      if (img.hasAlpha && img.data[i + 3] < 16) continue;
      const lum = (img.data[i] + img.data[i + 1] + img.data[i + 2]) / 3;
      if (!img.hasAlpha && lum > 235) continue;
      const t = 1 - lum / 255;
      if (t < 0.05) continue;
      let w = t;
      for (let k = 1; k < emphasis; k++) w *= t;
      if (w < 0.001) continue;
      total += w;
      xs.push(x);
      ys.push(y);
      cum.push(total);
    }
  }
  return { xs, ys, cum, total, W: img.W, H: img.H };
}

function drawSample(pool: WeightedPool, rand: () => number) {
  const target = rand() * pool.total;
  let lo = 0;
  let hi = pool.cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (pool.cum[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return { x: pool.xs[lo], y: pool.ys[lo] };
}

// Multi-view 3D head built from two reference photos.
//
// Unlike a uniformly-distributed ellipsoid (which reads as a smooth egg), this
// version draws points wherever the source photos are DARK — hair, brows,
// eyes, lips, shirt seams — and wraps those (u, v) coordinates onto the front
// / side / back of a head-shaped ellipsoid. Light-skin regions and the
// background contribute essentially no points, so the cloud is empty there
// and the dark ink stipple reads as a real face whose density carries the
// likeness instead of a uniform shell with size-varying dots.
//
// Point budget:
//   front  55%  — front photo dark pixels projected onto the front hemisphere
//   right  18%  — side photo dark pixels projected onto the right hemisphere
//   left   18%  — same side photo mirrored onto the left hemisphere
//   back    9%  — front photo's crown region wrapped onto the back hemisphere
export async function loadPortrait3D(
  n: number,
  frontSrc = "/portrait.jpg",
  sideSrc = "/portrait-side.png",
): Promise<PortraitData> {
  const [front, side] = await Promise.all([
    loadImageSamples(frontSrc),
    loadImageSamples(sideSrc),
  ]);

  // Head ellipsoid half-axes (in scene units).
  // rX: ear-to-ear width, rY: crown-to-chest height, rZ: nose-to-back depth.
  const rX = 0.42;
  const rY = 0.6;
  const rZ = 0.42;

  // Image-to-ellipsoid framing. "Spread" controls how much of the photo
  // maps inside the unit sphere — values > 1 zoom in. "FaceCenter" lets us
  // shift the photo so the model's face center lands on the ellipsoid
  // equator instead of the literal pixel center (which would put the
  // forehead at the equator and the chin off-frame).
  const frontSpread = 1.05;
  const frontFaceCenterU = 0.5; // horizontal face center in front photo
  const frontFaceCenterV = 0.45; // slightly above the literal photo center
  const sideSpread = 1.15;
  const sideFaceCenterU = 0.7; // model faces toward the right of the side photo
  const sideFaceCenterV = 0.35; // and his eyes sit in the upper third

  const nFront = Math.round(n * 0.55);
  const nSide = Math.round(n * 0.18);
  const nBack = n - nFront - nSide * 2;

  const positions = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const frontPool = buildWeightedPool(front);
  const sidePool = buildWeightedPool(side);
  const hairPool = buildWeightedPool(front, {
    u0: 0.15,
    u1: 0.85,
    v0: 0.0,
    v1: 0.35,
  });

  const rand = RNG(101);
  let idx = 0;

  const writePoint = (
    px: number,
    py: number,
    pz: number,
    dark: number,
  ) => {
    // Tiny radial jitter — keeps the stipple from looking computer-rendered.
    const j = 0.01;
    positions[idx * 3] = px + (rand() - 0.5) * j;
    positions[idx * 3 + 1] = py + (rand() - 0.5) * j;
    positions[idx * 3 + 2] = pz + (rand() - 0.5) * j;
    sizes[idx] = 0.6 + dark * 1.6;
    idx++;
  };

  // --- Front hemisphere ---
  // (u, v) ∈ [0, 1] from the front photo, normalized to (sx, sy) ∈ [-1, 1]
  // after applying spread. Points whose (sx, sy) falls inside the unit disk
  // get projected onto the front of a unit sphere then stretched to the head
  // ellipsoid; points outside the disk fall back to a flat plane near the
  // equator so torso pixels (shirt collar) stay visible without inflating
  // the ellipsoid.
  for (let i = 0; i < nFront; i++) {
    const { x, y } = drawSample(frontPool, rand);
    const u = x / front.W;
    const v = y / front.H;
    const sx = (u - frontFaceCenterU) * 2 * frontSpread;
    const sy = -(v - frontFaceCenterV) * 2 * frontSpread;
    const r2 = sx * sx + sy * sy;

    const dark = sampleDarkness(front, u, v);

    if (r2 < 0.98) {
      const sz = Math.sqrt(1 - r2);
      writePoint(sx * rX, sy * rY, sz * rZ, dark);
    } else {
      // Outside the head ellipsoid → flatten onto the equator (z=0). Shirt
      // and shoulders typically live here.
      const inv = 1 / Math.sqrt(r2);
      writePoint(sx * rX * inv * 1.05, sy * rY * inv * 1.05, 0, dark);
    }
  }

  // --- Right hemisphere ---
  // Side photo's u-axis maps to the model's z (depth, +z = front of face),
  // and v-axis maps to model's y (height). Pixels project onto the right
  // hemisphere of the head ellipsoid; left hemisphere reuses the same pool.
  for (let i = 0; i < nSide; i++) {
    const { x, y } = drawSample(sidePool, rand);
    const u = x / side.W;
    const v = y / side.H;
    const sz = (u - sideFaceCenterU) * 2 * sideSpread;
    const sy = -(v - sideFaceCenterV) * 2 * sideSpread;
    const r2 = sz * sz + sy * sy;
    const dark = sampleDarkness(side, u, v);

    if (r2 < 0.98) {
      const sx = Math.sqrt(1 - r2);
      writePoint(sx * rX, sy * rY, sz * rZ, dark);
    } else {
      const inv = 1 / Math.sqrt(r2);
      writePoint(0, sy * rY * inv * 1.05, sz * rZ * inv * 1.05, dark);
    }
  }

  // --- Left hemisphere (mirror of right) ---
  for (let i = 0; i < nSide; i++) {
    const { x, y } = drawSample(sidePool, rand);
    const u = x / side.W;
    const v = y / side.H;
    const sz = (u - sideFaceCenterU) * 2 * sideSpread;
    const sy = -(v - sideFaceCenterV) * 2 * sideSpread;
    const r2 = sz * sz + sy * sy;
    const dark = sampleDarkness(side, u, v);

    if (r2 < 0.98) {
      const sx = -Math.sqrt(1 - r2);
      writePoint(sx * rX, sy * rY, sz * rZ, dark);
    } else {
      const inv = 1 / Math.sqrt(r2);
      writePoint(0, sy * rY * inv * 1.05, sz * rZ * inv * 1.05, dark);
    }
  }

  // --- Back of head (hair fill) ---
  // Sample the crown of the front photo and wrap it onto the back hemisphere.
  // The hair pool was built from v ∈ [0, 0.35], so v inside the pool maps
  // back to the upper portion of the head model.
  for (let i = 0; i < nBack; i++) {
    const { x, y } = drawSample(hairPool, rand);
    const u = x / front.W;
    const v = y / front.H;
    // Re-stretch the cropped v ∈ [0, 0.35] back into [0, 1] so hair pixels
    // span the full upper hemisphere of the head, not just a thin band.
    const vStretched = v / 0.35;
    const sx = (u - frontFaceCenterU) * 2 * frontSpread;
    const sy = -(vStretched - 0.5) * 2 * frontSpread * 0.85;
    const r2 = sx * sx + sy * sy;
    const dark = sampleDarkness(front, u, v);

    if (r2 < 0.95) {
      const sz = -Math.sqrt(1 - r2); // negative z → behind the head
      writePoint(sx * rX, sy * rY, sz * rZ, dark);
    } else {
      // Edge of crown → push to ellipsoid rim with slight negative z.
      const inv = 1 / Math.sqrt(r2);
      writePoint(sx * rX * inv * 0.95, sy * rY * inv * 0.95, -0.05, dark);
    }
  }

  return { positions, sizes };
}

// Legacy 2D portrait loader kept for callers that only need a flat target.
// New code should prefer loadPortrait3D.
export function loadPortrait(
  n: number,
  src = "/portrait.jpg",
): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        resolve(samplePortrait(img, n));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load portrait: ${src}`));
    img.src = src;
  });
}

function samplePortrait(img: HTMLImageElement, n: number): Float32Array {
  // Downsample to a working canvas — 400px wide is plenty for 5k particles
  // and keeps the image data scan under a few ms.
  const W = 400;
  const H = Math.max(1, Math.round((img.height / img.width) * W));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas context unavailable");
  ctx.drawImage(img, 0, 0, W, H);
  const pixels = ctx.getImageData(0, 0, W, H).data;

  // Collect candidate pixels with a darkness weight. Stride trades resolution
  // for memory — at stride 2 we get ~40k candidates from a 400x500 image.
  const stride = 2;
  const xs: number[] = [];
  const ys: number[] = [];
  const cum: number[] = [];
  let total = 0;
  const whiteCutoff = 235;

  for (let y = 0; y < H; y += stride) {
    for (let x = 0; x < W; x += stride) {
      const idx = (y * W + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const lum = (r + g + b) / 3;
      if (lum >= whiteCutoff) continue;
      // Bias weight cubically so true black hair dominates while mid-tone skin
      // still contributes occasional dots.
      const t = 1 - lum / whiteCutoff;
      const w = t * t * t;
      if (w < 0.001) continue;
      total += w;
      xs.push(x);
      ys.push(y);
      cum.push(total);
    }
  }

  if (cum.length === 0) {
    // Image was entirely white — bail to a sphere fallback.
    return sphere(n);
  }

  // Preserve aspect ratio. Map height to [-targetH/2, targetH/2] and let width
  // follow from the image aspect, capped so portraits fit comfortably alongside
  // the other shapes' [-1, 1] envelopes.
  const targetHeight = 1.7;
  const targetWidth = (W / H) * targetHeight;

  const rand = RNG(53);
  const out = new Float32Array(n * 3);
  const jitter = stride * 0.5;

  for (let i = 0; i < n; i++) {
    const target = rand() * total;
    // Binary search the cumulative weight table.
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const px = xs[lo] + (rand() - 0.5) * jitter;
    const py = ys[lo] + (rand() - 0.5) * jitter;
    const nx = (px / W - 0.5) * targetWidth;
    const ny = -(py / H - 0.5) * targetHeight;
    out[i * 3] = nx;
    out[i * 3 + 1] = ny;
    // Subtle depth so the cloud doesn't read as a perfectly flat decal.
    out[i * 3 + 2] = (rand() - 0.5) * 0.12;
  }
  return out;
}
