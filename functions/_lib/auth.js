// Shared auth helpers for the console (Cloudflare Pages Functions / Workers runtime).
const enc = new TextEncoder();

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// session token = base64(payload) "." base64(hmac(payload))
export async function createSession(secret, days = 14) {
  const payload = btoa(JSON.stringify({ exp: Date.now() + days * 864e5 }));
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifySession(secret, token) {
  if (!secret || !token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  if (sig !== (await hmac(secret, payload))) return false;
  try {
    return Date.now() < JSON.parse(atob(payload)).exp;
  } catch {
    return false;
  }
}

export function getCookie(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function sessionCookie(token, days = 14) {
  return `console_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${days * 86400}`;
}

export function clearCookie() {
  return 'console_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
}

// length-leaking but constant-time within equal lengths
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}
