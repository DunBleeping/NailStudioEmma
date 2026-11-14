import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { renderPages } from './update-behandelpaginas.mjs';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const treatments = JSON.parse(await read('data/treatments.json'));
const translations = JSON.parse(await read('data/treatment-translations.json'));
const services = JSON.parse(await read('data/services.json')).services;
const script = await read('js/script.js');
const homepage = await read('index.html');
const locales = ['nl', 'en', 'fr', 'es', 'tr', 'ar', 'uk', 'pl', 'vi'];
const decode = (text) => text.replace(/&(amp|lt|gt|quot|#039);/g, (_, entity) =>
  ({ amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'" })[entity]);

test('generated treatment pages are committed-ready and exactly match their sources', async () => {
  const pages = renderPages();
  assert.equal(pages.size, Object.keys(treatments).length);
  for (const [path, expected] of pages) {
    assert.equal(await readFile(path, 'utf8'), expected, path);
    assert.doesNotMatch(expected, /[ \t]+(?=\r?$)/m, `${path}: trailing whitespace`);
  }
});

for (const [slug, treatment] of Object.entries(treatments)) {
  test(`${slug} has indexable unique HTML, SEO, working root assets and internal links`, async () => {
    const page = await read(`${slug}/index.html`);
    const url = `https://emmanagelstudio.vip/${slug}/`;
    assert.ok(page.includes(`<link rel="canonical" href="${url}">`));
    assert.equal((page.match(/<h1\b/g) || []).length, 1);
    assert.ok(page.includes(treatment.heading));
    assert.ok(page.includes(treatment.intro));
    for (const paragraph of treatment.paragraphs) assert.ok(page.includes(paragraph));
    assert.ok(page.includes(`<title>${treatment.title}</title>`));
    assert.ok(page.includes(`property="og:url" content="${url}"`));
    assert.ok(page.includes(`property="og:title" content="${treatment.title}"`));
    assert.ok(page.includes(`name="description" content="${treatment.description}"`));
    assert.ok(page.includes(`property="og:description" content="${treatment.description}"`));
    assert.doesNotMatch(page, /noindex|http-equiv="refresh"|<base\b/);
    assert.ok(page.includes('href="/"'));
    assert.ok(homepage.includes(`href="/${slug}/"`));
    for (const other of Object.keys(treatments)) assert.ok(page.includes(`href="/${other}/"`));
    assert.ok(page.includes('data-whatsapp'));
    assert.ok(page.includes('id="cart-panel"') || page.includes('id="cart-sidebar"'));
    for (const [, path] of page.matchAll(/(?:src|href)="\/([^"#?]+)(?:\?[^"]*)?"/g)) {
      if (path.endsWith('/')) continue;
      await read(path);
    }
    const versions = [...page.matchAll(/(?:style\.css|script\.js)\?v=(\d+)/g)].map(([, value]) => value);
    assert.deepEqual(versions, [...homepage.matchAll(/(?:style\.css|script\.js)\?v=(\d+)/g)].map(([, value]) => value));
    const article = page.match(/<section id="treatment-information"[\s\S]*?<\/section>/)[0];
    for (const id of treatment.services) {
      const service = services.find((item) => item.id === id);
      assert.ok(service, id);
      assert.ok(article.includes(service.name));
      assert.ok(article.includes(new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(service.price)));
      assert.ok(article.includes(`href="#behandeling-${id}"`));
      if (service.note) assert.ok(article.includes(service.note));
    }
  });
}

test('every treatment source, metadata and visible translated string has all nine languages', async () => {
  const sources = new Set();
  for (const treatment of Object.values(treatments)) {
    for (const key of ['title', 'description', 'heading', 'intro']) sources.add(treatment[key]);
    treatment.paragraphs.forEach((text) => sources.add(text));
  }
  for (const text of sources) assert.ok(translations.some((row) => row.nl === text), text);
  assert.equal(new Set(translations.map((row) => row.nl)).size, translations.length);
  for (const row of translations) {
    assert.deepEqual(Object.keys(row).sort(), [...locales].sort());
    for (const locale of locales) assert.ok(row[locale]?.trim(), `${locale}: ${row.nl}`);
  }
  const base = JSON.parse(await read('data/translations.json')).en;
  for (const [, page] of renderPages()) {
    const visible = [...page.matchAll(/<[^>]+\bdata-i18n(?:\s[^>]*)?>([^<]+)<\//g)]
      .map(([, text]) => decode(text.replace(/\s+/g, ' ').trim()));
    for (const source of visible) {
      assert.ok(Object.hasOwn(base, source) || translations.some((row) => row.nl === source), source);
    }
  }
  assert.ok(script.includes("fetchJSON('./data/treatment-translations.json')"));
  assert.ok(script.includes('appData.translations[language][row.nl] = row[language]'));
});

test('nested pages load JSON and image paths from the root without rewriting contact routes', async () => {
  const start = script.indexOf('function resolveImagePaths(');
  const normalize = runInNewContext(`(${script.slice(start, script.indexOf('\n}', start) + 2)})`);
  const data = normalize({ image: './images/a.jpg?v=1', nested: [{ src: './images/b.jpg' }], url: '/api/contact', price: 45 });
  assert.equal(data.image, '/images/a.jpg?v=1');
  assert.equal(data.nested[0].src, '/images/b.jpg');
  assert.equal(data.url, '/api/contact');
  assert.equal(data.price, 45);
  assert.match(script, /fetch\(url\.replace\(\/\^\\\.\\\/\/, '\/'\)/);
  assert.match(script, /if \(heroTitle && !document\.body\.dataset\.treatmentPage\)/);
  assert.match(script, /if \(heroDesc && !document\.body\.dataset\.treatmentPage\)/);
});

test('nail art keeps the custom quote distinct from the existing starting-price service', async () => {
  const page = await read('nail-art-purmerend/index.html');
  assert.ok(page.includes('er is geen vaste prijs of standaardduur'));
  assert.ok(page.includes('een vanafprijs, geen offerte voor jouw maatwerk'));
  assert.deepEqual(treatments['nail-art-purmerend'].services, ['nails-design-vanaf']);
  const sync = await read('tools/sync-website.ps1');
  assert.ok(sync.includes("'update-behandelpaginas.ps1') -Check"));
  assert.ok(sync.includes("Selecteer de gewijzigde behandelpagina's en hun bronnen samen"));
});
