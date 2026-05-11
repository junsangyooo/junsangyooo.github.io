"use client";

import ParticleField from "./ParticleField";

/*
  Site-wide particle background. Sits on every page below the content layer.

  Pointer handling: ParticleField now subscribes to window-level pointer
  events directly (see its useEffect), so click/swipe anywhere on the page
  advances the shape unless the click target is an interactive element
  (a, button, input, textarea, select, [data-no-particle]).

  z-index map (see globals.css):
    body bg          — paper color
    body::before/::after — paper grain (z 1)
    BackgroundCanvas — particles (z 2)
    page content     — z 10+
*/
export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 z-[2]">
      <ParticleField className="absolute inset-0" interactive />
    </div>
  );
}
