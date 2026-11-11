const HOSTNAMES = new Set(['emmanagelstudio.vip', 'www.emmanagelstudio.vip']);
const CONTACT_CHANNELS = new Set(['phone', 'sms']);
const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;

function reply(status, body) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, private',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return reply(405, { error: 'method_not_allowed' });
  const url = new URL(request.url);
  if (!HOSTNAMES.has(url.hostname) || request.headers.get('Origin') !== url.origin) {
    return reply(403, { error: 'origin_not_allowed' });
  }
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('Contact endpoint: missing Turnstile configuration');
    return reply(503, { error: 'contact_unavailable' });
  }
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
    return reply(415, { error: 'json_required' });
  }

  let payload;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: 'token_required' });
    const chunks = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 4096) {
        await reader.cancel();
        return reply(413, { error: 'request_too_large' });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return reply(400, { error: 'invalid_json' });
  }
  const token = payload?.token;
  const channel = payload?.channel;
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    return reply(400, { error: 'invalid_token' });
  }
  if (typeof channel !== 'string' || !CONTACT_CHANNELS.has(channel)) {
    return reply(400, { error: 'invalid_channel' });
  }
  const phone = env.CONTACT_PHONE;
  if (!PHONE_PATTERN.test(phone || '')) {
    console.error('Contact endpoint: missing or invalid phone configuration for requested channel');
    return reply(503, { error: 'contact_unavailable' });
  }

  let result;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) {
      console.error('Contact endpoint: verification service HTTP failure', response.status);
      return reply(503, { error: 'verification_unavailable' });
    }
    result = await response.json();
  } catch {
    console.error('Contact endpoint: verification service network or response failure');
    return reply(503, { error: 'verification_unavailable' });
  }
  if (result?.success !== true || result.hostname !== url.hostname || result.action !== 'contact') {
    return reply(403, { error: 'verification_failed' });
  }
  return reply(200, { phone });
}
