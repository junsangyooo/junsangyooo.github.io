// Client-side category filter for the project list. Data-driven: tabs are rendered
// from the categories present in content, each carries data-filter.
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
        const show = cat === 'all' || it.dataset.category === cat;
        it.classList.toggle('is-hidden', !show);
      });
    });
  });
}
