import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ---- main listing page -------------------------------------------------------
// LOAD: header + above-the-fold cards slide in from the LEFT (staggered).
// SCROLL: each lower card springs up. Content is visible by default (CSS), so if
// this never runs nothing stays hidden.
export function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = gsap.utils.toArray<HTMLElement>('.reveal');
  const fold = window.innerHeight * 0.95;
  const above = cards.filter((c) => c.getBoundingClientRect().top < fold);
  const below = cards.filter((c) => !above.includes(c));

  const loadEls = [...gsap.utils.toArray<HTMLElement>('[data-intro]'), ...above];
  if (loadEls.length) {
    gsap.fromTo(loadEls,
      { autoAlpha: 0, x: -52 },
      { autoAlpha: 1, x: 0, duration: 1.15, ease: 'power3.out', stagger: 0.09, delay: 0.15 },
    );
  }

  below.forEach((el) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 90 },
      { autoAlpha: 1, y: 0, duration: 1.05, ease: 'back.out(1.3)',
        scrollTrigger: { trigger: el, start: 'top 90%' } },
    );
  });

  ScrollTrigger.refresh();
}

// ---- detail page -------------------------------------------------------------
// Normalized, content-type-aware reveal. Header rises up on load; prose blocks
// reveal on scroll — paragraphs split into LINES (top→bottom stagger), everything
// else fades up as a whole block. No per-page authoring needed.
export function initContentReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rise = gsap.utils.toArray<HTMLElement>('[data-rise]');
  if (rise.length) {
    gsap.fromTo(rise,
      { autoAlpha: 0, y: 44 },
      { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.08, delay: 0.1 },
    );
  }

  const prose = document.querySelector<HTMLElement>('.prose');
  if (!prose) return;

  // split into lines only after fonts load, or line breaks would be wrong
  const run = () => {
    Array.from(prose.children).forEach((node) => {
      const el = node as HTMLElement;
      if (el.tagName === 'P') {
        // CSS pre-hides the <p>; reveal the container, then hide+animate its lines.
        gsap.set(el, { autoAlpha: 1 });
        const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'line' });
        gsap.fromTo(split.lines,
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 86%' } },
        );
      } else {
        gsap.fromTo(el,
          { autoAlpha: 0, y: 44 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' } },
        );
      }
    });
    ScrollTrigger.refresh();
  };

  if (document.fonts?.ready) document.fonts.ready.then(run);
  else run();
}
