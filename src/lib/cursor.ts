// A dot that TRAILS the real (native) cursor — accompanies, never replaces it.
// Pure requestAnimationFrame + manual lerp (no GSAP), so it updates every frame on
// plain pointer movement. Returns a cleanup for View Transition swaps.

// Last known pointer position, kept at MODULE scope so it survives View Transition
// re-inits. After a page swap the dot spawns already-visible under the pointer instead
// of going invisible until the next move — that gap was the "it only shows when I
// click" bug (a click merely happened to carry an incidental move that woke it).
let lastX = -1;
let lastY = -1;
let hasPos = false;

export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.createElement('div');
  root.className = 'cursor is-out'; // hidden until we know the real pointer position
  root.innerHTML = '<div class="cursor__dot"></div><span class="cursor__label">Explore</span>';
  document.body.appendChild(root);
  const label = root.querySelector('.cursor__label') as HTMLElement;

  let mx = hasPos ? lastX : window.innerWidth / 2;
  let my = hasPos ? lastY : window.innerHeight / 2;
  let cx = mx, cy = my, px = mx, py = my;
  let primed = false;
  let raf = 0;

  // Reveal + lock onto a known point. Runs on the first pointer signal, or right away
  // if we already knew the position from a previous page.
  const prime = (x: number, y: number) => {
    mx = x; my = y;
    if (!primed) {
      primed = true;
      cx = x; cy = y; px = x; py = y; // spawn right under the cursor
      root.classList.remove('is-out');
    }
  };

  const onPoint = (e: PointerEvent | MouseEvent) => {
    lastX = e.clientX; lastY = e.clientY; hasPos = true;
    prime(e.clientX, e.clientY);
  };

  // pointermove wakes it on hover; pointerdown wakes it on a click that didn't move,
  // so it can never get stuck invisible. Both keep mx/my fresh.
  window.addEventListener('pointermove', onPoint);
  window.addEventListener('pointerdown', onPoint);

  const onLeave = () => root.classList.add('is-out');
  const onEnter = () => { if (primed) root.classList.remove('is-out'); };
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);

  // Returning via a page transition: we already know where the pointer is — show now.
  if (hasPos) prime(lastX, lastY);

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
    window.removeEventListener('pointermove', onPoint);
    window.removeEventListener('pointerdown', onPoint);
    document.removeEventListener('mouseleave', onLeave);
    document.removeEventListener('mouseenter', onEnter);
    root.remove();
  };
}
