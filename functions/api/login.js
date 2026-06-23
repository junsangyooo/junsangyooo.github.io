import { createSession, sessionCookie, safeEqual, json } from '../_lib/auth.js';

export const onRequestPost = async ({ request, env }) => {
  if (!env.CONSOLE_PASSWORD || !env.SESSION_SECRET) {
    return json({ error: 'Server not configured (missing env vars).' }, 500);
  }
  let password = '';
  try {
    ({ password } = await request.json());
  } catch {
    return json({ error: 'Bad request.' }, 400);
  }
  if (!safeEqual(String(password), env.CONSOLE_PASSWORD)) {
    return json({ error: 'Wrong password.' }, 401);
  }
  const token = await createSession(env.SESSION_SECRET);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token) });
};
