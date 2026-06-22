// Black ink-blob cursor. A solid black dot trails the mouse (lerp) and stretches
// along its direction of motion (squash-stretch) so it reads like a smear of wet
// paint. Over a card it swells into a disc that says "Explore".
export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.createElement('div');
  root.className = 'cursor';
  root.innerHTML = '<div class="cursor__blob"></div><span class="cursor__label">Explore</span>';
  document.body.appendChild(root);
  document.body.classList.add('has-cursor');

  const blob = root.querySelector('.cursor__blob') as HTMLElement;
  const label = root.querySelector('.cursor__label') as HTMLElement;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx, cy = my, speed = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  const loop = () => {
    const dx = mx - cx;
    const dy = my - cy;
    cx += dx * 0.16;
    cy += dy * 0.16;

    const v = Math.min(Math.hypot(dx, dy), 110);
    speed += (v - speed) * 0.18; // smoothed velocity
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const s = speed / 110; // 0..1
    const sx = 1 + s * 0.55; // stretch along motion
    const sy = 1 - s * 0.3; // squash across motion

    blob.style.transform =
      `translate(${cx}px, ${cy}px) translate(-50%, -50%) rotate(${angle}deg) scale(${sx}, ${sy})`;
    label.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll<HTMLElement>('[data-cursor="explore"]').forEach((el) => {
    el.addEventListener('mouseenter', () => root.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => root.classList.remove('is-hover'));
  });
}
