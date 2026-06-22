import Lenis from 'lenis';

// Inertia scroll with a "camera follow" feel: continuous lerp smoothing (eased at
// both ends as it approaches the target), slightly slow. Pure rAF, no GSAP.
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const lenis = new Lenis({
    lerp: 0.085, // lower = slower, heavier camera follow
    smoothWheel: true,
    wheelMultiplier: 1,
  });
  window.__scrollVelocity = 0;

  lenis.on('scroll', (e: { velocity: number }) => {
    window.__scrollVelocity = e.velocity;
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return lenis;
}
