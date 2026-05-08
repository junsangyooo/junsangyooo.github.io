"use client";

import ParticleField from "./ParticleField";

/*
  Site-wide particle background. Sits on every page below the content layer.

  Pointer handling: the wrapper KEEPS pointer events on so R3F can read
  mousemove (otherwise the hover-repulsion freezes). interactive=false on
  ParticleField disables click/keyboard advance. Page content is z-10+,
  so its links and buttons sit above and still receive clicks normally —
  empty regions of the page just fall through to the inert background.

  z-index map (see globals.css):
    body bg          — paper color
    body::before/::after — paper grain (z 1)
    BackgroundCanvas — particles (z 2)
    page content     — z 10+
*/
export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 z-[2]">
      <ParticleField className="absolute inset-0" interactive={false} />
    </div>
  );
}
