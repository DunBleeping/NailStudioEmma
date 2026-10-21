import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const source = await readFile(new URL('../functions/api/contact.js', import.meta.url), 'utf8');
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const env = { TURNSTILE_SECRET_KEY: 'test-only-secret', CONTACT_PHONE: '+3197000000000' };
const origin = 'https://emmanagelstudio.vip';

function request(body = { token: 'test-token' }, options = {}) {
  return new Request(`${origin}/api/contact`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json', ...options.headers },
    body: JSON.stringify(body)
  });
}

test('contact endpoint denies unverified requests without returning contact data', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Verification must not be called'); };
  try {
    const cases = [
      [new Request(`${origin}/api/contact`), env, 405],
      [request({}, { headers: { Origin: 'https://other.example' } }), env, 403],
      [request({}, { headers: { Origin: '' } }), env, 403],
      [request({}, { headers: { 'Content-Type': 'text/plain' } }), env, 415],
      [request(), {}, 503],
      [request(), { ...env, CONTACT_PHONE: 'invalid' }, 503],
      [request({}), env, 400],
      [request({ token: '' }), env, 400],
      [request({ token: 12 }), env, 400],
      [request({ token: 'x'.repeat(2049) }), env, 400],
      [request({ token: 'x'.repeat(5000) }), env, 413],
      [request(null), env, 400],
      [new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{' }), env, 400],
      [new Request('https://preview.pages.dev/api/contact', { method: 'POST', headers: { Origin: 'https://preview.pages.dev' } }), env, 403],
      [new Request('http://localhost/api/contact', { method: 'POST', headers: { Origin: 'http://localhost' } }), env, 403]
    ];
    for (const [input, secrets, status] of cases) {
      const result = await onRequest({ request: input, env: secrets });
      assert.equal(result.status, status);
      assert.match(result.headers.get('Cache-Control'), /no-store/);
      const body = await result.text();
      assert(!body.includes(env.CONTACT_PHONE));
      assert(!body.includes(env.TURNSTILE_SECRET_KEY));
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('only a successful exact-hostname contact-action verification releases the phone', async () => {
  const originalFetch = globalThis.fetch;
  try {
    for (const verification of [
      { success: false, 'error-codes': ['timeout-or-duplicate'] },
      { success: true, hostname: 'localhost', action: 'contact' },
      { success: true, hostname: 'other.example', action: 'contact' },
      { success: true, hostname: 'www.emmanagelstudio.vip', action: 'contact' },
      { success: true, hostname: 'emmanagelstudio.vip', action: 'login' },
      null
    ]) {
      globalThis.fetch = async () => Response.json(verification);
      const response = await onRequest({ request: request(), env });
      assert.equal(response.status, 403);
      assert(!(await response.text()).includes(env.CONTACT_PHONE));
    }
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
      assert.equal(options.method, 'POST');
      assert.equal(options.body.get('secret'), env.TURNSTILE_SECRET_KEY);
      assert.equal(options.body.get('response'), 'test-token');
      assert(options.signal instanceof AbortSignal);
      return Response.json({ success: true, hostname: 'emmanagelstudio.vip', action: 'contact' });
    };
    const result = await onRequest({ request: request(), env });
    assert.equal(result.status, 200);
    assert.deepEqual(await result.json(), { phone: env.CONTACT_PHONE });
    assert.match(result.headers.get('Cache-Control'), /no-store/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('verification service failures fail closed', async () => {
  const originalFetch = globalThis.fetch;
  try {
    for (const implementation of [
      async () => { throw new Error('network unavailable'); },
      async () => new Response('unavailable', { status: 503 }),
      async () => new Response('not JSON')
    ]) {
      globalThis.fetch = implementation;
      const response = await onRequest({ request: request(), env });
      assert.equal(response.status, 503);
      assert(!(await response.text()).includes(env.CONTACT_PHONE));
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});
