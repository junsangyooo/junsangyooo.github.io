import { verifySession, getCookie, json } from '../_lib/auth.js';
import { parseFrontmatter, normalizeTypes } from '../_lib/md.js';
import { REPO, BRANCH, GH } from '../_lib/config.js';

// List all projects (read + parse the md files from the repo).
export const onRequestGet = async ({ request, env }) => {
  if (!(await verifySession(env.SESSION_SECRET || env.CONSOLE_PASSWORD, getCookie(request, 'console_session')))) {
    return json({ error: 'Not authenticated.' }, 401);
  }
  if (!env.GITHUB_TOKEN) return json({ error: 'Missing GITHUB_TOKEN.' }, 500);

  const headers = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    'User-Agent': 'jsyoo-console',
    Accept: 'application/vnd.github+json',
  };

  const dir = await fetch(`${GH}/repos/${REPO}/contents/src/content/projects?ref=${BRANCH}`, { headers });
  if (dir.status === 404) return json({ projects: [] });
  if (!dir.ok) return json({ error: `List failed (${dir.status}).` }, 502);

  const items = (await dir.json()).filter((f) => f.name.endsWith('.md'));
  const projects = await Promise.all(
    items.map(async (f) => {
      const raw = await (await fetch(f.download_url, { headers })).text();
      const { data, body } = parseFrontmatter(raw);
      // fold a legacy single `category` into `types` so old files open pre-filled
      const types = normalizeTypes(data.types?.length ? data.types : data.category ? [data.category] : []);
      return { ...data, types, slug: f.name.replace(/\.md$/, ''), body };
    })
  );
  projects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return json({ projects });
};
