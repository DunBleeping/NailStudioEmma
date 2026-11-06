const HOSTNAMES = new Set(['emmanagelstudio.vip', 'www.emmanagelstudio.vip']);
const EVENTS = { dit_wil_ik: 'Dit wil ik', whatsapp: 'WhatsApp', sms: 'SMS', bel: 'Bel mij' };
const KEEP_SECONDS = 90 * 24 * 60 * 60;
const SHOW_ROWS = 500;

function reply(status, body, type = 'application/json') {
  return new Response(body === null ? null : (type === 'application/json' ? JSON.stringify(body) : body), {
    status,
    headers: {
      'Content-Type': `${type}; charset=utf-8`,
      'Cache-Control': 'no-store, private',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex'
    }
  });
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

async function record(request, env, url) {
  if (!HOSTNAMES.has(url.hostname) || request.headers.get('Origin') !== url.origin) {
    return reply(403, { error: 'origin_not_allowed' });
  }
  // Zonder gekoppelde opslag doet meten niets; de website werkt gewoon door.
  if (!env.EVENTS_KV) return reply(204, null);
  let data;
  try {
    const text = await request.text();
    if (text.length > 1024) return reply(413, { error: 'request_too_large' });
    data = JSON.parse(text);
  } catch {
    return reply(400, { error: 'invalid_json' });
  }
  if (!Object.hasOwn(EVENTS, data?.event)) return reply(400, { error: 'invalid_event' });
  const clean = (v, n) => (typeof v === 'string' ? v.replace(/[^\w .,;:()/\-+]/g, '').slice(0, n) : '');
  const entry = {
    t: new Date().toISOString(),
    e: data.event,
    s: clean(data.service, 60),
    sid: clean(data.session, 16),
    ua: clean(request.headers.get('User-Agent') || '', 200)
  };
  const key = `e:${entry.t}:${crypto.randomUUID().slice(0, 8)}`;
  await env.EVENTS_KV.put(key, '1', { expirationTtl: KEEP_SECONDS, metadata: entry });
  return reply(204, null);
}

async function overview(url, env) {
  const token = env.STATS_TOKEN || '';
  if (!env.EVENTS_KV || token.length < 16 || url.searchParams.get('token') !== token) {
    return reply(404, 'Niet gevonden', 'text/plain');
  }
  const rows = [];
  let cursor;
  for (let page = 0; page < 10; page++) {
    const list = await env.EVENTS_KV.list({ prefix: 'e:', cursor });
    for (const k of list.keys) if (k.metadata) rows.push(k.metadata);
    if (list.list_complete) break;
    cursor = list.cursor;
  }
  rows.sort((a, b) => b.t.localeCompare(a.t));
  const fmt = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam', dateStyle: 'short', timeStyle: 'medium'
  });
  const body = rows.slice(0, SHOW_ROWS).map((r) => `<tr><td>${esc(fmt.format(new Date(r.t)))}</td>`
    + `<td>${esc(EVENTS[r.e] || r.e)}</td><td>${esc(r.s)}</td><td>${esc(r.sid.slice(0, 6))}</td>`
    + `<td>${esc(r.ua)}</td></tr>`).join('');
  const sessions = new Set(rows.map((r) => r.sid)).size;
  const html = `<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Klikken</title>
<style>body{font:15px system-ui;margin:1rem}table{border-collapse:collapse;width:100%}
td,th{border-bottom:1px solid #ddd;padding:.4rem;text-align:left;vertical-align:top}td:last-child{font-size:12px;color:#555}</style>
<h1>Klikken op de website</h1>
<p>${rows.length} klikken door ${sessions} sessies (laatste 90 dagen, nieuwste bovenaan).</p>
<table><tr><th>Tijdstip</th><th>Klik</th><th>Behandeling</th><th>Sessie</th><th>Apparaat</th></tr>${body}</table></html>`;
  return reply(200, html, 'text/html');
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  if (request.method === 'POST') return record(request, env, url);
  if (request.method === 'GET') return overview(url, env);
  return reply(405, { error: 'method_not_allowed' });
}
