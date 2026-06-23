import { clearCookie, json } from '../_lib/auth.js';

export const onRequestPost = async () => {
  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() });
};
