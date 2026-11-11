import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const escape = (text) => String(text).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
})[character]);
const translated = (tag, text, attributes = '') =>
  `<${tag}${attributes} data-i18n>${escape(text)}</${tag}>`;

export function renderPages() {
  const template = read('index.html');
  const treatments = JSON.parse(read('data\\treatments.json'));
  const services = new Map(JSON.parse(read('data\\services.json')).services.map((item) => [item.id, item]));
  const pages = new Map();
  for (const [slug, treatment] of Object.entries(treatments)) {
    let page = template.replace('<body>', `<body data-treatment-page="${slug}">`).replaceAll('="./', '="/');
    const url = `https://emmanagelstudio.vip/${slug}/`;
    page = page.replaceAll('content="https://emmanagelstudio.vip/"', `content="${url}"`)
      .replace('<link rel="canonical" href="https://emmanagelstudio.vip/">', `<link rel="canonical" href="${url}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escape(treatment.title)}</title>`);
    for (const [attribute, value] of [
      ['name="description"', treatment.description],
      ['property="og:title"', treatment.title],
      ['property="og:description"', treatment.description],
      ['property="twitter:title"', treatment.title],
      ['property="twitter:description"', treatment.description]
    ]) {
      page = page.replace(new RegExp(`(<meta ${attribute} content=")[^"]*`), (_, prefix) => prefix + escape(value));
    }
    page = page.replace(/<h1>.*?<\/h1>/, translated('h1', treatment.heading))
      .replace(/<p class="hero-description">[\s\S]*?<\/p>/, translated('p', treatment.intro, ' class="hero-description"'));
    const article = [
      '    <section id="treatment-information" class="section section-light">',
      '      <div class="container">',
      translated('h2', treatment.heading),
      ...treatment.paragraphs.map((paragraph) => translated('p', paragraph)),
      translated('p', 'Ik werk alleen op afspraak in Purmerend. Bekijk mijn werk bij Impressie en vraag jouw afspraak aan via de bestaande contactknoppen.'),
      translated('h3', 'Behandelingen en prijzen'),
      '<ul>'
    ];
    for (const id of treatment.services) {
      const service = services.get(id);
      if (!service) throw new Error(`Onbekende behandeling: ${id}`);
      const price = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(service.price);
      article.push(`<li><a href="#behandeling-${id}" data-i18n>${escape(service.name)}</a>: ${price} — `
        + `<span data-i18n>${escape(service.duration)}</span>`
        + (service.note ? ` <span data-i18n>${escape(service.note)}</span>` : '') + '</li>');
    }
    article.push(
      '</ul>',
      translated('p', 'Dit zijn de gewone lijstprijzen, vóór eventuele actiekorting. Bekijk de prijzenlijst voor alle opties en toeslagen.'),
      '<div class="hero-buttons">',
      '<a href="#pricing" class="secondary-button" data-i18n>Prijzenlijst</a>',
      '<a href="#gallery" class="secondary-button" data-i18n>Impressie</a>',
      '<a href="#contact" class="cta-button" data-i18n>Afspraak maken</a>',
      '<a href="/" class="secondary-button" data-i18n>Home</a>',
      '</div></div></section>'
    );
    // De homepage blijft de enige bron voor alle bestaande UI, voorkeuren en contactbediening.
    page = page.replace('    <!-- Treatment information -->', article.join('\n'));
    pages.set(join(root, slug, 'index.html'),
      '<!-- Gegenereerd met tools/update-behandelpaginas.mjs; bewerk de bronnen, niet dit bestand. -->\n' + page.replace(/[ \t]+(?=\r?$)/gm, ''));
  }
  return pages;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  const stale = [];
  for (const [path, content] of renderPages()) {
    if (check) {
      if (!existsSync(path) || readFileSync(path, 'utf8') !== content) stale.push(path);
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
  }
  if (stale.length) {
    console.error("Behandelpagina's zijn verouderd. Voer .\\tools\\update-behandelpaginas.ps1 uit.\n" + stale.join('\n'));
    process.exitCode = 1;
  }
}
