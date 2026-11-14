import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../data/', import.meta.url);
const english = JSON.parse(await readFile(new URL('translations.json', root), 'utf8')).en;
const locales = ['fr', 'es', 'tr', 'ar', 'uk', 'pl', 'vi'];
const placeholders = (value) => [...value.matchAll(/\{[^}]+\}/g)].map(([match]) => match).sort();

for (const locale of locales) {
  test(`${locale} translation covers all Dutch source strings and placeholders`, async () => {
    const translations = JSON.parse(await readFile(new URL(`translations/${locale}.json`, root), 'utf8'));
    assert.deepEqual(Object.keys(translations).sort(), Object.keys(english).sort());
    for (const [source, translated] of Object.entries(translations)) {
      assert.equal(typeof translated, 'string', `${locale}: ${source}`);
      assert.ok(translated.trim(), `${locale}: ${source} must not be empty`);
      assert.deepEqual(placeholders(translated), placeholders(source), `${locale}: ${source}`);
    }
  });
}

test('language selector and locale catalogs stay in sync', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const configured = [...html.matchAll(/<option value="([a-z]{2})"/g)].map(([, locale]) => locale);
  assert.deepEqual(configured, ['nl', 'en', 'fr', 'es', 'tr', 'ar', 'uk', 'pl', 'vi']);
});

test('pricing list label is consistent in the page and every translation catalog', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/>Prijzenlijst<\/(?:a|h2)>/g) ?? []).length, 2);
  assert.doesNotMatch(html, />Prijslijst<\/(?:a|h2)>/);
  assert.ok(Object.hasOwn(english, 'Prijzenlijst'));
  assert.ok(!Object.hasOwn(english, 'Prijslijst'));
  for (const locale of locales) {
    const catalog = JSON.parse(await readFile(new URL(`translations/${locale}.json`, root), 'utf8'));
    assert.ok(Object.hasOwn(catalog, 'Prijzenlijst'), `${locale}: missing Prijzenlijst`);
    assert.ok(!Object.hasOwn(catalog, 'Prijslijst'), `${locale}: old label remains`);
  }
});

test('local and seasonal landing copy is translated in every language', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const settings = JSON.parse(await readFile(new URL('settings.json', root), 'utf8'));
  const section = html.match(/<section id="custom-nail-art"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'custom nail art section exists');
  const sources = [
    settings.site.title, settings.site.description, settings.salon.tagline, settings.salon.description,
    ...[...section.matchAll(/<(?:h2|p)\b[^>]*data-i18n[^>]*>([^<]+)<\/(?:h2|p)>/g)]
      .map(([, text]) => text.replace(/\s+/g, ' ').trim()),
  ];
  assert.equal(sources.length, 7);
  for (const source of sources) {
    assert.ok(Object.hasOwn(english, source), `Missing English landing translation: ${source}`);
  }
  assert.ok(section.includes('Halloween'));
  assert.ok(section.includes('kerstnagels (Xmas)'));
  assert.ok(section.includes('Nieuwstraat, Weidevenne'));
  assert.ok(section.includes('href="#gallery"'));
  assert.ok(section.includes('href="#pricing"'));
});

test('SEO uses the live domain and existing assets without exposing the salon address', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const settings = JSON.parse(await readFile(new URL('settings.json', root), 'utf8'));
  const canonical = `https://${settings.site.domain}/`;
  assert.equal(canonical, 'https://emmanagelstudio.vip/');
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`));
  assert.ok(html.includes(`<title>${settings.site.title.replaceAll('&', '&amp;')}</title>`));
  assert.ok(html.includes(`<meta name="description" content="${settings.site.description}">`));
  const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(structured['@type'], 'NailSalon');
  assert.equal(structured.url, canonical);
  assert.equal(structured.areaServed, 'Purmerend');
  assert.equal(structured.description, settings.site.description);
  assert.equal(structured.address, undefined);
  assert.equal(structured.telephone, undefined);
  assert.deepEqual(structured.sameAs, [settings.social.instagram, settings.social.facebook]);
  await readFile(new URL(`../${new URL(structured.image).pathname.slice(1)}`, import.meta.url));
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url), [
    canonical,
    `${canonical}biab-purmerend/`,
    `${canonical}gellak-purmerend/`,
    `${canonical}pedicure-purmerend/`,
    `${canonical}babyboom-purmerend/`,
    `${canonical}nail-art-purmerend/`,
  ]);
  const robots = await readFile(new URL('../robots.txt', import.meta.url), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
});

test('Google can fetch rendering data without indexing data files or crawling the API', async () => {
  const robots = await readFile(new URL('../robots.txt', import.meta.url), 'utf8');
  const rules = [...robots.matchAll(/^(Allow|Disallow):\s*(\S+)/gm)].map(([, action, pattern]) => {
    const anchored = pattern.endsWith('$');
    const body = anchored ? pattern.slice(0, -1) : pattern;
    const expression = body.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    return { action, length: body.replaceAll('*', '').length, regex: new RegExp(`^${expression}${anchored ? '$' : ''}`) };
  });
  const allowed = (path) => {
    const matches = rules.filter((rule) => rule.regex.test(path))
      .sort((a, b) => b.length - a.length || (a.action === 'Allow' ? -1 : 1));
    return matches.length === 0 || matches[0].action === 'Allow';
  };
  for (const path of ['/data/settings.json', '/data/services.json', '/data/gallery.json',
    '/data/translations.json', '/data/translations/fr.json', '/data/treatment-translations.json']) {
    assert.ok(allowed(path), path);
  }
  for (const path of ['/api/contact', '/data/private.txt', '/other.json']) {
    assert.ok(!allowed(path), path);
  }
  const headers = await readFile(new URL('../_headers', import.meta.url), 'utf8');
  assert.match(headers, /\/data\/\*\r?\n(?:[ \t]+[^\r\n]+\r?\n)*[ \t]+X-Robots-Tag:\s*noindex/i);
});
