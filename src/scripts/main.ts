import 'lenis/dist/lenis.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from '../lib/smoothScroll';
import { initReveal, initContentReveal } from '../lib/reveal';
import { initCursor } from '../lib/cursor';
import { initFilters } from '../lib/filters';

// Always begin at the top; never restore prior scroll across navigations.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Effects are torn down before each View Transition swap and re-created after,
// so nothing (Lenis, ScrollTriggers, ticker callbacks, listeners) leaks or stacks.
let cleanups: Array<() => void> = [];

const safe = (label: string, fn: () => unknown) => {
  try {
    const c = fn();
    if (typeof c === 'function') cleanups.push(c as () => void);
  } catch (err) {
    console.error(`[effects] ${label} failed:`, err);
  }
};

const boot = () => {
  window.scrollTo(0, 0);
  safe('smoothScroll', initSmoothScroll);
  safe('reveal', initReveal);
  safe('contentReveal', initContentReveal);
  safe('cursor', initCursor);
  safe('filters', initFilters);
};

const teardown = () => {
  cleanups.forEach((c) => c());
  cleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
};

// astro:page-load fires on the initial load AND after every navigation.
document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', teardown);
