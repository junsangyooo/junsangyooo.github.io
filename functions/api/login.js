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
  // the password itself signs the session cookie — no separate secret needed
  const token = await createSession(env.CONSOLE_PASSWORD);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token) });
};
