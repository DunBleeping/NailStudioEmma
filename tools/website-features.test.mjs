import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const script = await readFile(new URL('../js/script.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const english = JSON.parse(await readFile(new URL('../data/translations.json', import.meta.url), 'utf8')).en;
const functionSource = (name) => {
  const start = script.indexOf(`function ${name}(`);
  assert.ok(start >= 0);
  return script.slice(start, script.indexOf('\n}', start) + 2);
};

test('BIAB example is an existing labelled illustration; real photos take priority', async () => {
  const gallery = JSON.parse(await readFile(new URL('../data/gallery.json', import.meta.url), 'utf8'));
  const biab = gallery.images.find((album) => album.folder === 'biab');
  const getPhotos = runInNewContext(`(${functionSource('getAlbumPhotos')})`);
  assert.equal(getPhotos(biab)[0], biab.example);
  assert.equal(biab.example.caption, 'BIAB-illustratie, geen klantfoto');
  assert.equal(biab.example.alt, biab.example.caption);
  assert.ok(Object.hasOwn(english, biab.example.caption));
  const illustration = await readFile(new URL(`../${biab.example.src}`, import.meta.url), 'utf8');
  assert.ok(illustration.includes('<svg'));
  assert.ok(!/<script|<image|https?:/i.test(illustration.replace('http://www.w3.org/2000/svg', '')));
  const real = { src: './real.jpg' };
  assert.equal(getPhotos({ ...biab, photos: [null, {}, real] })[0], real);
  assert.equal(getPhotos({ photos: [] }).length, 0);
  assert.equal(getPhotos({ ...biab, photos: [{}] })[0], biab.example);
});

test('confirmed referral conditions and cart disclosure are translated and no public credit remains', () => {
  const offer = html.match(/<section id="vriendinnenactie"[\s\S]*?<\/section>/)?.[0];
  assert.ok(offer);
  const sources = [...offer.matchAll(/data-i18n>([^<]+)</g)].map(([, text]) => text);
  assert.equal(sources.length, 4);
  for (const source of sources) assert.ok(Object.hasOwn(english, source), source);
  for (const condition of ['20%', '25%', 'bestaande klant', 'hetzelfde moment', 'nieuwe sets', 'toeslagen', 'tot nader bericht', 'niet combineerbaar']) {
    assert.ok(offer.includes(condition), condition);
  }
  const disclosure = 'Het mandje toont prijzen vóór actiekorting. Emma controleert de voorwaarden en bevestigt de korting per persoon bij het samen boeken.';
  assert.ok(html.includes(disclosure));
  assert.ok(functionSource('buildBookingMessage').includes(disclosure));
  assert.ok(Object.hasOwn(english, disclosure));
  assert.ok(!html.includes('Copilot'));
  const versions = [...html.matchAll(/(?:style\.css|script\.js)\?v=(\d+)/g)].map(([, version]) => version);
  assert.deepEqual(versions, ['32', '32']);
});

test('confetti runs once on load, cleans up and respects reduced motion', () => {
  assert.equal((script.match(/initializeConfetti\(\);/g) || []).length, 1);
  for (const reduced of [false, true]) {
    const layers = [];
    let timer;
    let listener;
    const motion = {
      matches: reduced,
      addEventListener: (type, callback) => { assert.equal(type, 'change'); listener = callback; },
      removeEventListener: (type, callback) => {
        if (listener) assert.equal(callback, listener);
        listener = undefined;
      }
    };
    const createElement = () => ({
      children: [], style: { setProperty() {} },
      setAttribute(key, value) { this[key] = value; },
      appendChild(child) { this.children.push(child); },
      remove() { this.removed = true; }
    });
    const initialize = runInNewContext(`(${functionSource('initializeConfetti')})`, {
      window: {
        matchMedia: (query) => { assert.equal(query, '(prefers-reduced-motion: reduce)'); return motion; },
        setTimeout: (callback, delay) => { assert.equal(delay, 3000); timer = callback; }
      },
      document: { createElement, body: { appendChild: (layer) => layers.push(layer) } }
    });
    initialize();
    assert.equal(layers.length, reduced ? 0 : 1);
    if (!reduced) {
      assert.equal(layers[0].children.length, 36);
      assert.equal(layers[0]['aria-hidden'], 'true');
      listener();
      assert.equal(layers[0].removed, true);
      assert.equal(listener, undefined);
      timer();
    } else {
      assert.equal(timer, undefined);
    }
  }
});
