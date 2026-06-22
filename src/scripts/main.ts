import 'lenis/dist/lenis.css';
import { initSmoothScroll } from '../lib/smoothScroll';
import { initReveal } from '../lib/reveal';
import { initCursor } from '../lib/cursor';
import { initFilters } from '../lib/filters';

// Each effect is isolated: if one throws, the others (and the content) survive.
const safe = (label: string, fn: () => void) => {
  try {
    fn();
  } catch (err) {
    console.error(`[effects] ${label} failed:`, err);
  }
};

const boot = () => {
  safe('smoothScroll', initSmoothScroll);
  safe('reveal', initReveal);
  safe('cursor', initCursor);
  safe('filters', initFilters);
};

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
