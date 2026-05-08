"use client";

import { useEffect, useState } from "react";
import CenteredEditorial from "@/components/templates/CenteredEditorial";
import AsymmetricManifesto from "@/components/templates/AsymmetricManifesto";
import TwoColumnSticky from "@/components/templates/TwoColumnSticky";
import PrintFrontPage from "@/components/templates/PrintFrontPage";

const TEMPLATES = [
  {
    id: "centered",
    name: "Centered Editorial",
    mood: "book body, calm reading flow",
    reference: "Substack / Robin Rendle",
    Component: CenteredEditorial,
  },
  {
    id: "asymmetric",
    name: "Asymmetric Manifesto",
    mood: "magazine cover, statement-driven",
    reference: "Foundation / BPM print",
    Component: AsymmetricManifesto,
  },
  {
    id: "two-column",
    name: "Two-Column Sticky",
    mood: "academic archive, navigable",
    reference: "Maggie Appleton / Robin Sloan",
    Component: TwoColumnSticky,
  },
  {
    id: "print",
    name: "Print Front-Page",
    mood: "newspaper grid, dense",
    reference: "Reuters / NYT print",
    Component: PrintFrontPage,
  },
];

export default function TemplatesPage() {
  const [idx, setIdx] = useState(0);
  const [showSheet, setShowSheet] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing into a form field, just in case.
      if (
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(e.target.tagName)
      ) {
        return;
      }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= TEMPLATES.length) {
        setIdx(n - 1);
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (e.key === "ArrowRight" || e.key === " ") {
        setIdx((i) => (i + 1) % TEMPLATES.length);
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (e.key === "ArrowLeft") {
        setIdx((i) => (i - 1 + TEMPLATES.length) % TEMPLATES.length);
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (e.key === "h" || e.key === "H") {
        setShowSheet((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const t = TEMPLATES[idx];
  const Active = t.Component;

  return (
    <>
      <Active />

      {/* Top-right meta */}
      <div className="pointer-events-none fixed right-4 top-4 z-30 max-w-[220px] text-right md:right-6 md:top-6">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          Template study — pick one
        </div>
        <div className="mt-2 serif text-xl leading-tight">{t.name}</div>
        <div className="mt-1 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft opacity-70">
          {t.mood}
        </div>
        <div className="mono text-[10px] uppercase tracking-[0.15em] text-ink-soft opacity-60">
          ref: {t.reference}
        </div>
      </div>

      {/* Bottom swatch sheet */}
      {showSheet && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-4 md:p-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {TEMPLATES.map((tpl, i) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setIdx(i);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                  className={`pointer-events-auto rounded-sm border px-3 py-3 text-left transition ${
                    i === idx
                      ? "border-ink/40 bg-paper/85"
                      : "border-ink/15 bg-paper/55 hover:border-ink/30"
                  }`}
                  style={{ backdropFilter: "blur(6px)" }}
                >
                  <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                    {i + 1} · {tpl.id}
                  </div>
                  <div className="serif mt-1 text-base leading-tight text-ink">
                    {tpl.name}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 text-center mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
              press 1–{TEMPLATES.length} · ←/→ · h to hide
            </div>
          </div>
        </div>
      )}
    </>
  );
}
