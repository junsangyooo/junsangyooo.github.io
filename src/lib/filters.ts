import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Client-side type filter. Tabs carry data-filter; cards carry a '|'-joined
// data-types list (a project can match several tabs).
export function initFilters() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.filters button');
  const items = document.querySelectorAll<HTMLElement>('.project');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach((it) => {
        const tags = (it.dataset.types || '').split('|');
        const show = cat === 'all' || tags.includes(cat as string);
        it.classList.toggle('is-hidden', !show);
      });
      ScrollTrigger.refresh(); // layout changed → recompute trigger positions
    });
  });
}
