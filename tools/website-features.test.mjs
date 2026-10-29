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

test('confirmed referral conditions and cart disclosure are translated and no public credit remains', async () => {
  const offer = html.match(/<section id="vriendinnenactie"[\s\S]*?<\/section>/)?.[0];
  assert.ok(offer);
  const sources = [...offer.matchAll(/data-i18n>([^<]+)</g)].map(([, text]) => text);
  assert.equal(sources.length, 4);
  for (const source of sources) assert.ok(Object.hasOwn(english, source), source);
  for (const condition of ['allebei 15%', '15% korting op een nieuwe set', 'hetzelfde moment', 'positieve review op Google', '€3 extra korting', 'Je vriendin mag al klant zijn', 'designs en toeslagen', 'Bijlakken en andere behandelingen zijn uitgesloten', 'tot nader bericht', 'niet combineerbaar']) {
    assert.ok(offer.includes(condition), condition);
  }
  assert.ok(!offer.includes('25%'));
  assert.match(offer, /<details class="offer-details">\s*<summary data-i18n>Goed om te weten<\/summary>/);
  assert.ok(offer.includes('friend-offer-card'));
  assert.ok(offer.includes('friend-offer'));
  assert.ok(offer.includes('15%'));
  assert.ok(!/<a\b[^>]*class="cta-button"[^>]*>Afspraak maken<\/a>/.test(offer));
  const css = await readFile(new URL('../css/style.css', import.meta.url), 'utf8');
  assert.ok(css.includes('.friend-offer-card::before'));
  assert.ok(css.includes('.friend-offer-card::after'));
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.friend-offer-card::before,[\s\S]*?animation: none;/);
  const disclosure = 'Prijzen vóór actiekorting. Emma bevestigt jullie korting bij het samen boeken.';
  assert.ok(html.includes(disclosure));
  assert.ok(functionSource('buildBookingMessage').includes(disclosure));
  assert.ok(Object.hasOwn(english, disclosure));
  assert.ok(!html.includes('Copilot'));
  const versions = [...html.matchAll(/(?:style\.css|script\.js)\?v=(\d+)/g)].map(([, version]) => version);
  assert.deepEqual(versions, ['38', '38']);
});

test('custom nail art links to pricing and has a non-cart quote option', async () => {
  const section = html.match(/<section id="custom-nail-art"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.match(section, /<a href="#pricing" class="cta-button" data-i18n>Afspraak maken<\/a>/);
  const pricing = functionSource('initializePricing');
  for (const text of ['Custom designs (op aanvraag)', 'In overleg', 'Op aanvraag', 'Vraag prijs aan']) {
    assert.ok(pricing.includes(text));
    assert.ok(Object.hasOwn(english, text));
  }
  assert.match(pricing, /customDesignRow\.className = 'pricing-custom-design'/);
  assert.match(pricing, /<a href="#contact" class="secondary-button">/);
  const customRow = pricing.slice(
    pricing.indexOf('customDesignRow.innerHTML'),
    pricing.indexOf('tableBody.appendChild(customDesignRow)')
  );
  assert.ok(!customRow.includes('add-to-cart-btn'));
  assert.ok(!customRow.includes('formatPrice'));
  const services = JSON.parse(await readFile(new URL('../data/services.json', import.meta.url), 'utf8'));
  assert.ok(!services.services.some((service) => service.id === 'custom-designs-op-aanvraag'));
  const docs = await readFile(new URL('../PRIJZEN-BEHEER.md', import.meta.url), 'utf8');
  assert.ok(docs.includes('vaste regel in `js/script.js`'));
});

test('services are collapsed by default and navigation opens only relevant targets', () => {
  assert.match(html, /<details id="services-details">/);
  assert.match(html, /<summary class="services-summary"><h2 data-i18n>Klik hier voor mijn behandelingen<\/h2><\/summary>/);
  assert.ok(Object.hasOwn(english, 'Klik hier voor mijn behandelingen'));
  let details = { open: false, contains: (target) => target.id === 'service-search' };
  const openTarget = runInNewContext(`(${functionSource('openServicesForTarget')})`, {
    document: { getElementById: () => details }
  });
  openTarget({ id: 'contact' });
  assert.equal(details.open, false);
  openTarget({ id: 'services' });
  assert.equal(details.open, true);
  details.open = false;
  openTarget({ id: 'service-search' });
  assert.equal(details.open, true);
  assert.ok(script.includes("window.addEventListener('hashchange', openServicesForHash)"));
});

test('phone contact follows WhatsApp without removing contact verification', async () => {
  const contact = html.match(/<div class="contact-grid">[\s\S]*?<\/section>/)[0];
  assert.match(contact, /data-type="whatsapp"[\s\S]*?data-type="phone"/);
  assert.ok(contact.includes('id="show-phone"'));
  assert.ok(contact.includes('id="contact-phone" hidden'));
  const address = contact.match(/<div class="contact-item" data-type="address">([\s\S]*?)<\/details>/)[1];
  assert.ok(address.includes('<p>Piraeushaven, Purmerend</p>'));
  assert.ok(address.includes('Je ontvangt het adres na bevestiging van je afspraak.'));
  const privacy = 'Om ongewenste reclame te beperken en mijn privacy en veiligheid te beschermen, publiceer ik hier niet mijn volledige adres.';
  assert.ok(address.includes(privacy));
  assert.ok(Object.hasOwn(english, privacy));
  assert.ok(!/Piraeushaven\s+\d/i.test(address));
  const css = await readFile(new URL('../css/style.css', import.meta.url), 'utf8');
  assert.match(css, /"whatsapp hours"\s*"phone hours"\s*"address hours"/);
  assert.match(css, /"hours"\s*"whatsapp"\s*"phone"\s*"address"/);
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
