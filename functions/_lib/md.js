import YAML from 'yaml';

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Normalize a free-form type tag to Title Case so "websites"/"Websites" collapse to one.
export const titleCase = (s) =>
  String(s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Title-case, drop blanks, dedupe (case-insensitive) → clean string[] for frontmatter.
export const normalizeTypes = (arr) => {
  const out = [];
  const seen = new Set();
  for (const t of Array.isArray(arr) ? arr : []) {
    const v = titleCase(t);
    if (!v || seen.has(v.toLowerCase())) continue;
    seen.add(v.toLowerCase());
    out.push(v);
  }
  return out;
};

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
  const fm = { title: d.title, tagline: d.tagline, types: normalizeTypes(d.types), thumbnail };
  if (d.role) fm.role = d.role;
  fm.team = Number(d.team) || 1;
  const year = Number(d.year);
  fm.year = Number.isFinite(year) ? year : new Date().getFullYear(); // never serialize .nan
  if (Array.isArray(d.stack) && d.stack.length) fm.stack = d.stack;
  if (d.repo) fm.repo = d.repo;
  const links = Array.isArray(d.links) ? d.links.filter((l) => l && l.label && l.url) : [];
  if (links.length) fm.links = links.map((l) => ({ label: l.label, url: l.url }));
  fm.featured = !!d.featured;
  fm.order = Number(d.order) || 0;
  const yaml = YAML.stringify(fm).trimEnd();
  return `---\n${yaml}\n---\n\n${String(d.body).trim()}\n`;
}
