const HOSTNAMES = new Set(['emmanagelstudio.vip', 'www.emmanagelstudio.vip']);

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
  if (!env.TURNSTILE_SECRET_KEY || !/^\+[1-9]\d{7,14}$/.test(env.CONTACT_PHONE || '')) {
    console.error('Contact endpoint: missing or invalid server configuration');
    return reply(503, { error: 'contact_unavailable' });
  }
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
    return reply(415, { error: 'json_required' });
  }

  let token;
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
    ({ token } = JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return reply(400, { error: 'invalid_json' });
  }
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    return reply(400, { error: 'invalid_token' });
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
  return reply(200, { phone: env.CONTACT_PHONE });
}
