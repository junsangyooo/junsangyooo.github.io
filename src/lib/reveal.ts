// Progressive enhancement: content is visible by DEFAULT (see global.css). We only
// hide + reveal items that start BELOW the fold, via IntersectionObserver. If this
// script never runs, the whole list still shows — the list is never held hostage.
export function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );

  const fold = window.innerHeight * 0.92;
  els.forEach((el) => {
    // Above the fold → leave visible (no flash). Below → arm the reveal.
    if (el.getBoundingClientRect().top > fold) {
      el.classList.add('will-reveal');
      io.observe(el);
    }
  });
}
