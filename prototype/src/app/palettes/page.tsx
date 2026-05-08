"use client";

import { useEffect, useState, useCallback } from "react";
import ParticleField from "@/components/ParticleField";
import { PALETTES, applyPalette, type Palette } from "@/lib/palettes";

export default function PalettesPage() {
  const [idx, setIdx] = useState(0);
  const [showSheet, setShowSheet] = useState(true);

  const palette: Palette = PALETTES[idx];

  useEffect(() => {
    applyPalette(palette);
  }, [palette]);

  const next = useCallback(() => setIdx((i) => (i + 1) % PALETTES.length), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= PALETTES.length) {
        setIdx(n - 1);
      } else if (e.key === "ArrowRight" || e.key === " ") {
        next();
      } else if (e.key === "ArrowLeft") {
        setIdx((i) => (i - 1 + PALETTES.length) % PALETTES.length);
      } else if (e.key === "h" || e.key === "H") {
        setShowSheet((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <ParticleField
        className="absolute inset-0 cursor-pointer"
        inkColor={palette.ink}
      />

      {/* Top: title + current palette name */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-6 md:p-10">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
            Palette study — pick one
          </div>
          <h1 className="serif mt-3 text-4xl leading-none md:text-6xl">
            {palette.name}
          </h1>
          <p className="mono mt-3 max-w-sm text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            {palette.mood}
          </p>
          <p className="mono mt-1 max-w-sm text-[10px] tracking-[0.15em] text-ink-soft opacity-60">
            ref: {palette.reference}
          </p>
        </div>

        <div className="mono text-right text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          <div>{idx + 1} / {PALETTES.length}</div>
          <div className="mt-1 opacity-70">press 1–{PALETTES.length} · ←/→ · h to hide</div>
        </div>
      </div>

      {/* Bottom: swatch sheet */}
      {showSheet && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
            {PALETTES.map((p, i) => {
              const active = i === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setIdx(i)}
                  className={`pointer-events-auto group rounded-sm border text-left transition ${
                    active
                      ? "border-ink/40 bg-paper-deep/30"
                      : "border-ink/10 hover:border-ink/30"
                  }`}
                  style={{ backdropFilter: "blur(4px)" }}
                >
                  <div className="flex h-12 overflow-hidden">
                    <div className="flex-1" style={{ background: p.paper }} />
                    <div className="flex-1" style={{ background: p.paperDeep }} />
                    <div className="flex-1" style={{ background: p.ink }} />
                    <div className="flex-1" style={{ background: p.inkSoft }} />
                    <div className="w-6" style={{ background: p.accent }} />
                  </div>
                  <div className="px-3 py-2">
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                      {i + 1} · {p.id}
                    </div>
                    <div className="serif mt-1 text-lg leading-tight text-ink">
                      {p.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sample mid-content card so the body+headline+caption can be judged */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 max-w-md p-6 text-center">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          sample copy block
        </div>
        <p className="serif mt-4 text-2xl leading-snug md:text-3xl">
          A small &amp; <em className="text-accent">positive action</em>, repeated.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Body copy at this scale tells you whether the paper feels alive
          or flat — read this paragraph, then switch palettes and read it again.
        </p>
      </div>
    </div>
  );
}
