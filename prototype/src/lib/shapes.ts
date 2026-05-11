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

// Multi-view 3D head built from two reference photos. Points sit on the
// surface of a head-shaped ellipsoid and each one borrows darkness from
// whichever photo "looks at" it: front photo for forward-facing points,
// side photo for sideways points (mirrored for the left hemisphere), and a
// hair-only fill from the front photo's crown region for back-facing points.
// As the cloud rotates, the view a particle was sampled from naturally
// rotates into camera — so the back of the head, sides, and front each show
// the appropriate texture.
export async function loadPortrait3D(
  n: number,
  frontSrc = "/portrait.jpg",
  sideSrc = "/portrait-side.png",
): Promise<PortraitData> {
  const [front, side] = await Promise.all([
    loadImageSamples(frontSrc),
    loadImageSamples(sideSrc),
  ]);

  // Head-shaped ellipsoid radii. rX is half-width (ear to ear), rY is
  // half-height (crown to upper chest in the front shot), rZ is half-depth
  // (nose tip to back of head).
  const rX = 0.42;
  const rY = 0.55;
  const rZ = 0.42;

  const positions = new Float32Array(n * 3);
  const sizes = new Float32Array(n);
  const phi = Math.PI * (Math.sqrt(5) - 1);
  const rand = RNG(101);

  for (let i = 0; i < n; i++) {
    // Fibonacci sphere — even angular distribution.
    const sy = 1 - (i / (n - 1)) * 2;
    const ringR = Math.sqrt(Math.max(0, 1 - sy * sy));
    const theta = phi * i;
    const sx = Math.cos(theta) * ringR;
    const sz = Math.sin(theta) * ringR;

    // Stretch the unit sphere into the head ellipsoid.
    let px = sx * rX;
    let py = sy * rY;
    let pz = sz * rZ;

    // View weights — additive, smoothly engaged. Sums to ~1 across the sphere
    // so transitions between views are continuous.
    const wFront = Math.max(0, sz);
    const wBack = Math.max(0, -sz - 0.2);
    const wSide = Math.max(0, Math.abs(sx) - 0.25);
    const wSum = wFront + wBack + wSide + 1e-6;

    let dark = 0;

    if (wFront > 0) {
      // Front photo: orthographic-ish projection of (sx, sy) onto the image.
      const u = (sx + 1) * 0.5;
      const v = (1 - sy) * 0.5;
      dark += wFront * sampleDarkness(front, u, v);
    }

    if (wSide > 0) {
      // Side photo: the subject faces roughly +z, so a point at the head's
      // right edge (sx>0, sz~0) lives somewhere mid-photo, and the more
      // forward it points (sz>0) the closer it sits to the photo's face
      // region. Left hemisphere mirrors horizontally so both sides reuse the
      // single side photo.
      const sideX = sx > 0 ? sz : -sz;
      const u = (sideX + 1) * 0.5;
      const v = (1 - sy) * 0.5;
      dark += wSide * sampleDarkness(side, u, v);
    }

    if (wBack > 0 && sy > -0.1) {
      // No real back-of-head photo. Re-use the top ~40% of the front photo as
      // a hair fill, and square the darkness so only the truly dark hair
      // pixels carry over — skin would look wrong on the back of the skull.
      const u = (sx + 1) * 0.5;
      const v = (1 - sy) * 0.5 * 0.4;
      const d = sampleDarkness(front, u, v);
      dark += wBack * d * d;
    }

    dark /= wSum;

    // Push very dark points outward a touch so hair reads as volumetric, not
    // a decal stuck to the skull.
    if (dark > 0.5) {
      const bump = (dark - 0.5) * 0.08;
      px += sx * bump;
      py += sy * bump;
      pz += sz * bump;
    }

    // Small radial jitter breaks the perfectly-spheroidal silhouette and
    // gives the stipple a hand-drawn feel rather than a CAD surface.
    const jitter = 0.012;
    px += (rand() - 0.5) * jitter;
    py += (rand() - 0.5) * jitter;
    pz += (rand() - 0.5) * jitter;

    positions[i * 3] = px;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = pz;

    // Base size keeps the head silhouette legible even on flat-skin points;
    // dark regions then build up dense ink stipple on top.
    sizes[i] = 0.35 + dark * 2.4;
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
