# Emma NailStudio - Project Manifest

Laatst bijgewerkt: oktober 2026 · Status: **live**

## Projectinformatie

| | |
|---|---|
| Naam | Emma NailStudio website |
| Type | Statische site (HTML5 / CSS3 / JavaScript / JSON) |
| Hosting | Cloudflare Pages, auto-deploy vanaf GitHub `main` |
| Domein | https://emmanagelstudio.vip (ook https://nailstudioemma.pages.dev) |
| Repository | https://github.com/DunBleeping/NailStudioEmma |
| Lokale map | `C:\MyDocs\DEVOPS\EmStudio` |

## Bestanden

### Root
- `index.html` – de pagina; CSS/JS geladen met `?v=6`
- `_headers` – Cloudflare beveiligings- en cache-headers
- `sitemap.xml`, `robots.txt` – SEO
- `.gitignore`, `.gitattributes` – Git (afbeeldingen als binair)
- `start-server.py` – lokale testserver
- Documentatie: `README.md`, `QUICK-REFERENCE.md`, `PRIJZEN-BEHEER.md`, `FOTO-UPLOADEN.md`,
  `ACCESSIBILITY.md`, `MANIFEST.md`

### css/style.css
- CSS-variabelen voor het kleurenpalet (goud `#d4a574`, crème `#f5f0eb`, bruin `#8b7355`)
- Mobile-first, breekpunten 1024 px en 768 px
- Grijswaarden-, lettergrootte- en foto's-verborgen-modus
- Impressie-tegels, album-modal, `prefers-reduced-motion`, print-stylesheet

### js/script.js
- Laadt `settings.json`, `services.json`, `gallery.json` (altijd vers: `cache: 'no-cache'`)
- Bouwt behandelkaarten, categoriemenu, prijstabel en "Optionele toeslagen"
- Impressie: tegels + album-modal (pijlen, toetsenbord, swipe)
- Zoekbalk (live, accent- en hoofdletterongevoelig) gecombineerd met het categoriefilter
- Behandelmandje: WhatsApp-bericht met gekozen behandelingen, toeslag en totaal
- WhatsApp-links op alle elementen met `data-whatsapp` (volgen de mandje-inhoud)
- Voorkeuren in localStorage: `emstudio-grayscale`, `fontSize`, `imagesHidden` (standaard verborgen),
  `cart`, `cartExtras`
- HTML-escaping van alle JSON-inhoud

### data/
- `settings.json` – salon, contact, WhatsApp (+31645715179), openingstijden, social
- `services.json` – 27 behandelingen in 7 categorieën (€10 – €60), 11 met notitie over de toeslag,
  `extras`: verwijderen oude lak/gellak +€5
- `gallery.json` – 6 Impressie-stijlen met voorbeeldfoto (`src`), albummap (`folder`) en klantfoto's (`photos`)
- `Prijzenlijst.csv` – bronprijslijst van de salon (naam, prijs, duur); niet door de site gebruikt

### images/
- `logo.jpg`
- `services/` – 10 behandelingsfoto's
- `gallery/nails-1..6.jpg` – voorbeeldfoto's (Pexels, vrije licentie; bron in `descript.ion`)
- `gallery/<album>/` – `rode-nagels`, `biab-nude`, `floral`, `ombre`, `glitter`, `minimalistisch`
  (elk met `LEESMIJ.txt`, nog zonder klantfoto's)
- `gallery/biab.jpg`, `gellak.jpg`, `manicure.jpg`, `nailart.jpg`, `nailhealth.jpg`, `pedicure.jpg`,
  `removal.jpg` – oude placeholders, niet in gebruik

### tools/
- `update_galerij.py` – scant de albummappen en vult `photos` in `gallery.json`
  (met versiecode tegen caching en onderschriften uit `descript.ion`)

## Functies

- Header met menu, *Afspraak maken* (WhatsApp) en toegankelijkheidsknoppen
- Hero, behandelingen met zoekbalk, categoriefilter en mandje, prijslijst + toeslagen,
  Impressie-albums, over ons, contact
- Zwevende WhatsApp-knop; alle afspraken via WhatsApp (geen e-mail/agenda)
- Nieuwe bezoekers zien standaard geen foto's
- Responsive, toetsenbord- en schermlezer-vriendelijk
- SEO: meta, Open Graph, Schema.org LocalBusiness, sitemap, robots

## Caching (`_headers`)

| Pad | Cache-Control |
|---|---|
| `/index.html`, `/data/*`, `/*.js`, `/*.css` | `public, max-age=0, must-revalidate` |
| `/images/*` | `public, max-age=2592000` (30 dagen) |
| `/sitemap.xml`, `/robots.txt` | 1 dag |

Wijzigingen in CSS/JS → `?v=N` verhogen in `index.html`; vervangen foto's → `?v=N` in de JSON.

## Openstaande punten

- Telefoon, e-mail, adres en Maps-link in `settings.json` zijn nog voorbeeldwaarden
- Schema.org, `og:url`, `canonical`, `sitemap.xml` en `robots.txt` verwijzen nog naar `nailsalonemma.nl`
  met voorbeeldadres/e-mail
- Social-links verwijzen nog naar de algemene Instagram/Facebook-homepage
- Impressie-albums nog leeg; tegels gebruiken stockfoto's

## Historie (belangrijkste commits)

| Commit | Wijziging |
|---|---|
| `7055156` | Eerste commit, Git-repository met branch `main` |
| `86070bd` | Logo als `images/logo.jpg` (hoofdletterprobleem op Cloudflare opgelost) |
| `e1ec215` | Behandelingen en prijzen volgens `Prijzenlijst.csv` (27 + BIAB-categorie) |
| `50313fb` | Toeslag verwijderen oude lak/gellak +€5 voor alle nieuwe sets |
| `c62df0b` | Caching: data/JS/CSS altijd hervalideren, versienummers |
| `d857489` | Stockfoto's Impressie, foto's standaard verborgen, afspraak via WhatsApp |
| `dff1358` | Impressie-albums met klantfoto's |
| `6cfb572` | Albummappen, `update_galerij.py`, swipen |
