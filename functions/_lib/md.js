import YAML from 'yaml';

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Real YAML parse so structured fields (links: [{label,url}]) round-trip safely.
export function parseFrontmatter(md) {
  const m = String(md).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: String(md) };
  let data = {};
  try {
    data = YAML.parse(m[1]) || {};
  } catch {
    data = {};
  }
  return { data, body: m[2].trim() };
}

export function buildMarkdown(d, thumbnail) {
  const fm = { title: d.title, tagline: d.tagline, category: d.category, thumbnail };
  if (d.role) fm.role = d.role;
  fm.team = Number(d.team) || 1;
  fm.year = Number(d.year);
  if (Array.isArray(d.stack) && d.stack.length) fm.stack = d.stack;
  if (d.repo) fm.repo = d.repo;
  const links = Array.isArray(d.links) ? d.links.filter((l) => l && l.label && l.url) : [];
  if (links.length) fm.links = links.map((l) => ({ label: l.label, url: l.url }));
  fm.featured = !!d.featured;
  fm.order = Number(d.order) || 0;
  const yaml = YAML.stringify(fm).trimEnd();
  return `---\n${yaml}\n---\n\n${String(d.body).trim()}\n`;
}
