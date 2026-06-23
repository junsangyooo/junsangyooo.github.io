import { verifySession, getCookie, json } from '../_lib/auth.js';

export const onRequestGet = async ({ request, env }) => {
  const authed = await verifySession(env.CONSOLE_PASSWORD, getCookie(request, 'console_session'));
  return json({ authed });
};
