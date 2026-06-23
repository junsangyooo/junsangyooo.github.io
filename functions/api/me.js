import { verifySession, getCookie, json } from '../_lib/auth.js';

export const onRequestGet = async ({ request, env }) => {
  const authed = await verifySession(env.SESSION_SECRET, getCookie(request, 'console_session'));
  return json({ authed });
};
