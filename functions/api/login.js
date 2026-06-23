import { createSession, sessionCookie, safeEqual, json } from '../_lib/auth.js';

export const onRequestPost = async ({ request, env }) => {
  if (!env.CONSOLE_PASSWORD) {
    return json({ error: 'Server not configured (missing CONSOLE_PASSWORD).' }, 500);
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
  // sign with a dedicated SESSION_SECRET if provided (recommended), else fall back to
  // the password stretched through PBKDF2 (see _lib/auth.js)
  const token = await createSession(env.SESSION_SECRET || env.CONSOLE_PASSWORD);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token) });
};
