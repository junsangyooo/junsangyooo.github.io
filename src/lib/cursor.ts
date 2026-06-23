// A dot that TRAILS the real (native) cursor — accompanies, never replaces it.
// Pure requestAnimationFrame + manual lerp (no GSAP), so it updates every frame on
// plain mouse movement. Returns a cleanup for View Transition swaps.
export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.createElement('div');
  root.className = 'cursor is-out'; // hidden until we know the real pointer position
  root.innerHTML = '<div class="cursor__dot"></div><span class="cursor__label">Explore</span>';
  document.body.appendChild(root);
  const label = root.querySelector('.cursor__label') as HTMLElement;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx, cy = my, px = mx, py = my;
  let primed = false;
  let raf = 0;

  const onMove = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
    if (!primed) {
      primed = true;
      cx = mx; cy = my; px = mx; py = my; // spawn right under the cursor
      root.classList.remove('is-out');
    }
  };
  const onLeave = () => root.classList.add('is-out');
  const onEnter = () => { if (primed) root.classList.remove('is-out'); };
  window.addEventListener('mousemove', onMove);
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);

  const SKEW = 0.0016;
  const SKEW_MAX = 0.16;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    cx += (mx - cx) * 0.22; // follow speed (higher = snappier)
    cy += (my - cy) * 0.22;
    const dx = cx - px;
    const dy = cy - py;
    px = cx;
    py = cy;
    const dist = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const s = Math.min(dist * SKEW, SKEW_MAX); // wet-paint skew by speed
    root.style.transform = `translate(${cx}px, ${cy}px) rotate(${angle}deg) scale(${1 + s}, ${1 - s})`;
    label.style.transform = `translate(-50%, -50%) rotate(${-angle}deg) scale(${1 / (1 + s)}, ${1 / (1 - s)})`;
  };
  loop();

  document.querySelectorAll<HTMLElement>('[data-cursor="explore"]').forEach((el) => {
    el.addEventListener('mouseenter', () => root.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => root.classList.remove('is-hover'));
  });
  document.querySelectorAll<HTMLElement>('.footer, [data-cursor-light]').forEach((el) => {
    el.addEventListener('mouseenter', () => root.classList.add('is-light'));
    el.addEventListener('mouseleave', () => root.classList.remove('is-light'));
  });

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseleave', onLeave);
    document.removeEventListener('mouseenter', onEnter);
    root.remove();
  };
}
