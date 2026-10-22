import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../data/', import.meta.url);
const english = JSON.parse(await readFile(new URL('translations.json', root), 'utf8')).en;
const locales = ['fr', 'es', 'tr', 'ar', 'uk', 'pl'];
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
  assert.deepEqual(configured, ['nl', 'en', ...locales]);
});
