// Markdown / frontmatter helpers shared by the console functions.

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Minimal frontmatter parser for OUR known schema (we control the format).
export function parseFrontmatter(md) {
  const m = String(md).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: md };
  const data = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (/^-?\d+$/.test(val)) val = Number(val);
    else val = val.replace(/^["']|["']$/g, '');
    data[key] = val;
  }
  return { data, body: m[2].trim() };
}

const q = (v) => JSON.stringify(v);

export function buildMarkdown(d, thumbnail) {
  const fm = [
    `title: ${q(d.title)}`,
    `tagline: ${q(d.tagline)}`,
    `category: ${q(d.category)}`,
    `thumbnail: ${q(thumbnail)}`,
  ];
  if (d.role) fm.push(`role: ${q(d.role)}`);
  fm.push(`team: ${Number(d.team) || 1}`);
  fm.push(`year: ${Number(d.year)}`);
  if (Array.isArray(d.stack) && d.stack.length) fm.push(`stack: [${d.stack.map(q).join(', ')}]`);
  if (d.repo) fm.push(`repo: ${q(d.repo)}`);
  if (d.demo) fm.push(`demo: ${q(d.demo)}`);
  fm.push(`featured: ${d.featured ? 'true' : 'false'}`);
  fm.push(`order: ${Number(d.order) || 0}`);
  return `---\n${fm.join('\n')}\n---\n\n${String(d.body).trim()}\n`;
}
