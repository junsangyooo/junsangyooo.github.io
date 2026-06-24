import { verifySession, getCookie, json } from '../_lib/auth.js';
import { slugify, buildMarkdown, normalizeTypes } from '../_lib/md.js';
import { REPO, BRANCH, GH } from '../_lib/config.js';

// Commit a whole changeset (creates/edits/deletes/reorders) as ONE atomic commit
// via the Git Data API: blobs → tree → commit → move ref.
export const onRequestPost = async ({ request, env }) => {
  if (!(await verifySession(env.SESSION_SECRET || env.CONSOLE_PASSWORD, getCookie(request, 'console_session')))) {
    return json({ error: 'Not authenticated.' }, 401);
  }
  if (!env.GITHUB_TOKEN) return json({ error: 'Missing GITHUB_TOKEN.' }, 500);

  let cs;
  try {
    cs = await request.json();
  } catch {
    return json({ error: 'Bad request.' }, 400);
  }
  const upserts = cs.upserts || [];
  const deletes = cs.deletes || [];
  if (!upserts.length && !deletes.length) return json({ error: 'Nothing to deploy.' }, 400);

  const H = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    'User-Agent': 'jsyoo-console',
    Accept: 'application/vnd.github+json',
  };
  const api = (path, init) => fetch(`${GH}/repos/${REPO}${path}`, { ...init, headers: { ...H, ...(init?.headers || {}) } });

  const createBlob = async (content, encoding) => {
    const r = await api('/git/blobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, encoding }),
    });
    if (!r.ok) throw new Error(`blob ${r.status} ${await r.text()}`);
    return (await r.json()).sha;
  };

  // hardening: only allow image files into a fixed prefix, and sniff magic bytes
  const IMG_EXT = /^(png|jpe?g|gif|webp|svg)$/;
  const SAFE_UPLOAD = /^\/uploads\/[a-z0-9._-]+\.(png|jpe?g|gif|webp|svg)$/i;
  const SAFE_THUMB = /^\/thumbnails\/[a-z0-9._-]+\.(png|jpe?g|gif|webp|svg)$/i;
  const looksLikeImage = (b64) => {
    let bin;
    try { bin = atob(String(b64).slice(0, 16)); } catch { return false; }
    const b = (i) => bin.charCodeAt(i);
    if (b(0) === 0x89 && b(1) === 0x50) return true; // PNG
    if (b(0) === 0xff && b(1) === 0xd8) return true; // JPEG
    if (b(0) === 0x47 && b(1) === 0x49 && b(2) === 0x46) return true; // GIF
    if (b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46) return true; // RIFF (WEBP)
    if (bin.trimStart().startsWith('<')) return true; // SVG / XML
    return false;
  };

  try {
    // 1) base ref / commit / tree (status-checked so an auth/rate-limit/404 surfaces
    //    a clear message instead of a cryptic "cannot read properties of undefined")
    const refRes = await api(`/git/ref/heads/${BRANCH}`);
    if (!refRes.ok) throw new Error(`base ref ${refRes.status} ${await refRes.text()}`);
    const baseCommitSha = (await refRes.json()).object.sha;
    const commitRes = await api(`/git/commits/${baseCommitSha}`);
    if (!commitRes.ok) throw new Error(`base commit ${commitRes.status} ${await commitRes.text()}`);
    const baseTreeSha = (await commitRes.json()).tree.sha;

    // 2) tree entries
    const tree = [];
    for (const u of upserts) {
      const slug = slugify(u.slug || u.title);
      if (!slug) throw new Error('empty slug');
      // server-side validation: never commit a file the build will reject
      if (!u.title || !u.tagline) throw new Error(`"${slug}" is missing title or tagline`);
      if (!normalizeTypes(u.types).length) throw new Error(`"${slug}" needs at least one type`);
      if (!Number.isFinite(Number(u.year))) throw new Error(`"${slug}" has an invalid year`);
      let thumbnailRef = u.thumbnail; // keep existing if no new upload
      if (u.thumbnailData) {
        if (!looksLikeImage(u.thumbnailData)) throw new Error('thumbnail is not a valid image');
        let ext = (String(u.thumbnailName).split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!IMG_EXT.test(ext)) ext = 'png';
        const sha = await createBlob(u.thumbnailData, 'base64');
        thumbnailRef = `/thumbnails/${slug}.${ext}`; // slug is sanitized via slugify
        tree.push({ path: `public/thumbnails/${slug}.${ext}`, mode: '100644', type: 'blob', sha });
      }
      if (!thumbnailRef) throw new Error(`"${slug}" has no thumbnail`);
      // images embedded in the body (uploaded in the editor) — path strictly validated
      if (Array.isArray(u.bodyImages)) {
        for (const img of u.bodyImages) {
          if (!img.path || !img.data) continue;
          if (img.path.includes('..') || !SAFE_UPLOAD.test(img.path)) throw new Error(`unsafe image path: ${img.path}`);
          if (!looksLikeImage(img.data)) throw new Error('body image is not a valid image');
          const sha = await createBlob(img.data, 'base64');
          tree.push({ path: `public${img.path}`, mode: '100644', type: 'blob', sha });
        }
      }
      const md = buildMarkdown(u, thumbnailRef);
      const mdSha = await createBlob(md, 'utf-8');
      tree.push({ path: `src/content/projects/${slug}.md`, mode: '100644', type: 'blob', sha: mdSha });
    }
    for (const del of deletes) {
      const slug = slugify(del.slug);
      tree.push({ path: `src/content/projects/${slug}.md`, mode: '100644', type: 'blob', sha: null });
      // same path-traversal guard as uploads — reject '..' and anything off the prefix
      if (del.thumbnail && !del.thumbnail.includes('..') && SAFE_THUMB.test(del.thumbnail)) {
        tree.push({ path: `public${del.thumbnail}`, mode: '100644', type: 'blob', sha: null });
      }
    }

    // 3) tree → commit → move ref
    const newTree = await (
      await api('/git/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_tree: baseTreeSha, tree }),
      })
    ).json();
    if (!newTree.sha) throw new Error(`tree ${JSON.stringify(newTree).slice(0, 200)}`);

    const parts = [];
    if (upserts.length) parts.push(`${upserts.length} upsert`);
    if (deletes.length) parts.push(`${deletes.length} delete`);
    const commit = await (
      await api('/git/commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `console: ${parts.join(', ')}`, tree: newTree.sha, parents: [baseCommitSha] }),
      })
    ).json();
    if (!commit.sha) throw new Error(`commit ${JSON.stringify(commit).slice(0, 200)}`);

    const move = await api(`/git/refs/heads/${BRANCH}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha: commit.sha }),
    });
    if (!move.ok) throw new Error(`ref ${move.status} ${await move.text()}`);

    return json({ ok: true, commit: commit.sha });
  } catch (err) {
    return json({ error: `Deploy failed — ${err.message}` }, 502);
  }
};
