// Tonal palettes for the visual identity. Selecting one becomes the project default.
// Each palette is calibrated to feel like real printed paper, not generic CSS beige.

export type Palette = {
  id: string;
  name: string;
  mood: string;
  reference: string;
  paper: string;
  paperDeep: string;
  ink: string;
  inkSoft: string;
  accent: string;
};

export const PALETTES: Palette[] = [
  {
    id: "gallery-bone",
    name: "Gallery Bone",
    mood: "white-cube museum, calmly off-white",
    reference: "Kettle’s Yard / Phaidon monographs",
    paper: "#EDE7DA",
    paperDeep: "#E2DBC9",
    ink: "#1C1B17",
    inkSoft: "#4A453D",
    accent: "#8C3A22",
  },
  {
    id: "bone-gray",
    name: "Bone Gray",
    mood: "Japanese minimalism, near-neutral",
    reference: "Idea magazine / Kenya Hara works",
    paper: "#E5E0D2",
    paperDeep: "#D8D3C5",
    ink: "#1A1A1A",
    inkSoft: "#4A4A47",
    accent: "#2F4F46",
  },
];

export function applyPalette(p: Palette) {
  if (typeof document === "undefined") return;
  const r = document.documentElement.style;
  r.setProperty("--paper", p.paper);
  r.setProperty("--paper-deep", p.paperDeep);
  r.setProperty("--ink", p.ink);
  r.setProperty("--ink-soft", p.inkSoft);
  r.setProperty("--accent", p.accent);
}
