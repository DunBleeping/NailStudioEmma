# Emma NailStudio - Nagelsalon Website

Statische website voor Emma NailStudio (HTML5, CSS3, JavaScript en JSON), gehost op **Cloudflare Pages**.

- **Live:** https://emmanagelstudio.vip (ook https://nailstudioemma.pages.dev)
- **Broncode:** https://github.com/DunBleeping/NailStudioEmma (branch `main`)
- **Publiceren:** elke push naar `main` wordt binnen ±1 minuut automatisch live gezet

## 📋 Inhoudsopgave

- [Design & opbouw van de pagina](#-design--opbouw-van-de-pagina)
- [Functies](#-functies)
- [Projectstructuur](#-projectstructuur)
- [Inhoud aanpassen](#-inhoud-aanpassen)
- [Foto's beheren](#-fotos-beheren)
- [Lokaal testen](#-lokaal-testen)
- [Publiceren (Git → Cloudflare)](#-publiceren-git--cloudflare)
- [Caching & versienummers](#-caching--versienummers)
- [SEO](#-seo)
- [Privacy & beveiliging](#-privacy--beveiliging)
- [Nog te doen](#-nog-te-doen)
- [Problemen oplossen](#-problemen-oplossen)

Meer documentatie:
[PRIJZEN-BEHEER.md](PRIJZEN-BEHEER.md) · [FOTO-UPLOADEN.md](FOTO-UPLOADEN.md) ·
[QUICK-REFERENCE.md](QUICK-REFERENCE.md) · [ACCESSIBILITY.md](ACCESSIBILITY.md) · [MANIFEST.md](MANIFEST.md)

## 🎨 Design & opbouw van de pagina

**Uitstraling:** luxe en minimalistisch, warme goud/crème-tinten, veel witruimte, afgeronde kaarten
met zachte schaduw. Lettertype: systeemfont *Segoe UI* (geen externe fonts → snel).

| Kleur | Code | Gebruik |
|---|---|---|
| Goud (primary) | `#d4a574` | Knoppen, accenten, lijnen, tegels |
| Crème (secondary) | `#f5f0eb` | Achtergronden |
| Bruin (accent) | `#8b7355` | Hover/accenten |
| Tekst | `#333333` / `#666666` | Tekst / subtekst |

De kleuren staan als CSS-variabelen bovenaan `css/style.css` (`:root { --primary: ... }`).
Het blok `colors` in `settings.json` wordt door de site niet gebruikt.

**Pagina van boven naar beneden:**

1. **Header** – logo (`images/logo.jpg`), menu (Home, Behandelingen, Prijzen, Galerij, Contact,
   **Afspraak maken**), taalkeuze **Nederlands / English**, en de knoppen 👁️ grijswaarden,
   **A– A A+ A++** lettergrootte en 🖼️ foto's tonen/verbergen.
   Op mobiel (≤ 768 px) wordt het menu een ☰ hamburger.
2. **Hero** – welkomsttekst, knoppen *Bekijk behandelingen*, *📱 WhatsApp*, *Instagram*,
   *Facebook* en *Google Search*, groot logo. Instagram is niet klikbaar zolang de profiellink ontbreekt.
3. **Onze Behandelingen** – onder "Categorieën" een **zoekbalk** (zoekt live in naam, categorie en
   omschrijving; hoofdletters en accenten maken niet uit), daaronder het categoriemenu met 7 categorieën
   en 27 behandelkaarten (foto, categorie, naam, omschrijving, duur, prijs, eventueel notitie en een
   knop **+ dit wil ik**, onderaan de kaart en op gelijke hoogte binnen elke rij).
4. **Prijslijst** – tabel met alle behandelingen, duur en prijs, plus blok **Toeslagen**
   (nu: *Verwijderen oude lak/gellak +€5* bij een nieuwe set). Onder elke behandelnaam staat ook
   **+ dit wil ik**; deze knop en de behandelkaart houden dezelfde mandjekeuze bij, in beide talen.
5. **Impressie** – 6 tegels met een stijl (Klassieke Rode Nagels, BIAB Nude, Floral Nail Art,
   Ombre Effect, Glitter Glamour, Minimalistisch Design). Klik → **album** met foto's van echte
   klantresultaten (bladeren met pijlen, pijltjestoetsen of vegen).
6. **Over Emma NailStudio** – introductie.
7. **Contact & Openingstijden** – telefoon, adres, openingstijden, WhatsApp, Google Maps.
8. **Footer** – links, social media, copyright.
9. **Zwevende WhatsApp-knop** rechtsonder, met daarboven de knop **🛒 Mandje** zodra er behandelingen
   gekozen zijn.

**Standaardinstellingen voor nieuwe bezoekers:**
- **Foto's verborgen** – rustiger en sneller; tegels onder Impressie tonen dan titel + omschrijving.
  Een tip bovenaan en bij Impressie verwijst naar het foto-icoontje 🖼️ rechtsboven om foto's te tonen.
  De tip verdwijnt zodra foto's zichtbaar zijn; de keuze wordt onthouden.
- Lettergrootte **A**, kleur aan (geen grijswaarden).
- Taal **Nederlands**; bezoekers kunnen **English** kiezen. De taal wordt onthouden (localStorage `language`).
  Omschakelen behoudt het mandje, toeslagen, zoekopdracht, categoriefilter en toegankelijkheidsvoorkeuren.

**Afspraken gaan via WhatsApp** (+31 6 4571 5179). Er is geen e-mail of online agenda: *Afspraak maken*,
de hero-knop, de contactknop en de zwevende knop openen allemaal WhatsApp met een voorbereid bericht.

**Behandelmandje → WhatsApp:** de bezoeker zet behandelingen met *+ dit wil ik* in het mandje. In het
mandje staan de gekozen behandelingen met duur en prijs, het totaal en (alleen bij een nieuwe set) het
vinkje *Verwijderen oude lak/gellak +€5*.

Bij een nieuwe set is deze optie **standaard aangevinkt**. Als er nog oude lak/gellak op de nagels zit,
is verwijderen verplicht. Klanten mogen uitvinken als verwijderen niet nodig is. Die keuze blijft
behouden bij taalwisselen, herladen en toevoegen van behandelingen zolang er een nieuwe set in het
mandje staat (localStorage `cartExtrasDeclined`). Zodra alle nieuwe sets verwijderd zijn of het mandje
wordt leeggemaakt, begint een volgende nieuwe set weer met de toeslag aangevinkt.
De toeslag telt eenmaal mee in het totaal en in beide taalversies van het WhatsApp-bericht.

*Afspraak aanvragen via WhatsApp* opent WhatsApp met een ingevuld bericht, bijvoorbeeld:

```
English
Hello Emma NailStudio, I would like to book an appointment for:
- New Nail Set (€40.00, 60 minutes)
- Surcharge: Remove old nail polish/gel polish (+€5.00)
Total: €45.00

My preferred date and time:

---

Nederlands
Hallo Emma NailStudio, ik wil graag een afspraak maken voor:
- New Set Nagels (€40.00, 60 minuten)
- Toeslag: Verwijderen oude lak/gellak (+€5.00)
Totaal: €45.00

Mijn voorkeur voor datum en tijd:
```

Zolang er iets in het mandje zit, sturen ook alle andere WhatsApp-knoppen dit bericht. Het is een
afspraakverzoek, geen betaling; Emma bevestigt via WhatsApp. Het mandje wordt in de browser onthouden
(localStorage `cart` en `cartExtras`).
Het mandjebericht is **altijd eerst Engels en daarna Nederlands**, ongeacht de gekozen sitetaal.
Zonder behandelingen gebruikt WhatsApp het korte standaardbericht in de gekozen taal.

### Vertalingen beheren

De Nederlandse teksten blijven in `index.html` en de bestaande JSON-bestanden staan.
`data/translations.json` bevat onder `en` de Engelse vertalingen, met de **exacte Nederlandse tekst**
als sleutel. Bij nieuwe of gewijzigde teksten voeg je daar ook de Engelse vertaling toe:

```json
"Verwijderen oude lak/gellak": "Remove old nail polish/gel polish"
```

Dit geldt ook voor namen, omschrijvingen, duur, categorieën, notities, galerijtitels, alt-teksten en
foto-onderschriften. Bij HTML-teksten worden witruimte en regeleinden samengevoegd tot enkele spaties.
Markeer nieuwe vaste teksten met `data-i18n`; vertaal attributen met bijvoorbeeld
`data-i18n-attrs="aria-label,title"`. Ontbrekende vertalingen geven een waarschuwing in de browserconsole
en tonen voorlopig de Nederlandse tekst. Controleer dus altijd beide talen na inhoudswijzigingen.
Prijzen, foto's en behandel-ID's worden gedeeld en hoeven niet vertaald te worden.
Zoeken werkt op zowel Nederlandse als Engelse behandelteksten, in beide talen.

## ✨ Functies

- ✅ Volledig statisch, geen backend of build-stap
- ✅ Nederlands/Engels met onthouden taalkeuze en tweetalige WhatsApp-mandjeberichten
- ✅ Responsive / mobile-first (breekpunten 1024 px en 768 px)
- ✅ Alle inhoud uit JSON (`data/`) – teksten, prijzen, foto's
- ✅ Categoriefilter en zoekbalk voor behandelingen
- ✅ Behandelmandje dat een ingevuld WhatsApp-afspraakverzoek maakt
- ✅ Impressie-albums met modal, toetsenbord- en swipe-navigatie
- ✅ Toegankelijkheid: grijswaarden, lettergrootte, foto's uit, ARIA-labels, `prefers-reduced-motion`
  (zie [ACCESSIBILITY.md](ACCESSIBILITY.md))
- ✅ SEO: meta tags, Open Graph, Schema.org (LocalBusiness), sitemap.xml, robots.txt
- ✅ Beveiligingsheaders en cache-instellingen via `_headers`

## 📁 Projectstructuur

```
EmStudio/
├── index.html                 # De pagina (laadt CSS/JS met ?v=N)
├── css/style.css              # Alle opmaak (kleuren als CSS-variabelen)
├── js/script.js               # Laadt de JSON en bouwt de inhoud op
├── data/
│   ├── settings.json          # Salon, contact, WhatsApp, openingstijden, social
│   ├── services.json          # 27 behandelingen + "extras" (toeslagen)
│   ├── gallery.json           # 6 Impressie-tegels + albums ("folder", "photos")
│   ├── translations.json      # Engelse vertalingen van Nederlandse teksten
│   └── Prijzenlijst.csv       # Bronlijst prijzen (niet door de site gebruikt)
├── images/
│   ├── logo.jpg
│   ├── services/              # 10 behandelingsfoto's
│   └── gallery/
│       ├── nails-1..6.jpg     # Voorbeeldfoto's (Pexels) op de tegels
│       ├── descript.ion       # Omschrijving/bron per foto
│       └── rode-nagels/, biab-nude/, floral/, ombre/, glitter/, minimalistisch/
│                              # Albums met klantfoto's (elk met LEESMIJ.txt)
├── tools/update_galerij.py    # Zet foto's uit de albummappen in gallery.json
├── _headers                   # Cloudflare: beveiliging + caching
├── sitemap.xml, robots.txt    # SEO
├── start-server.py            # Lokale testserver
└── *.md                       # Documentatie
```

## 🔧 Inhoud aanpassen

| Wat | Bestand | Uitleg |
|---|---|---|
| Prijzen, behandelingen, toeslagen | `data/services.json` | [PRIJZEN-BEHEER.md](PRIJZEN-BEHEER.md) |
| Contact, WhatsApp, openingstijden, social | `data/settings.json` | hieronder |
| Engelse teksten | `data/translations.json` | Zie "Vertalingen beheren" hierboven |
| Impressie-tegels en albums | `data/gallery.json` + `images/gallery/` | [FOTO-UPLOADEN.md](FOTO-UPLOADEN.md) |
| Teksten hero/over ons, SEO | `index.html` | |
| Kleuren en opmaak | `css/style.css` | |

### settings.json (belangrijkste velden)

```json
"contact": {
  "phone": "+31 6 12345678",
  "email": "info@nailsalonemma.nl",
  "address": "Hoofdstraat 123, 1234 AB Amsterdam",
  "mapLink": "https://www.google.com/maps/search/...",
  "whatsapp": {
    "number": "+31645715179",
    "message": "Hallo Emma NailStudio, ik wil graag een afspraak maken voor een nagelbehandeling."
  }
},
"hours": { "monday": "10:00 - 18:00", "...": "...", "sunday": "Gesloten" },
"social": { "instagram": "", "facebook": "https://EmmaNagelStudio.vip/", "googleSearch": "https://www.google.com/search?q=Emma+NailStudio+Purmerend", "whatsappBusiness": "https://wa.me/31645715179" }
```

WhatsApp-nummer altijd internationaal en zonder spaties (`+31645715179`).
De extra hero-knoppen gebruiken `social.instagram`, `social.facebook` en `social.googleSearch`.
Vul later de Instagram-profiel-URL in om die knop te activeren. De Facebook-knop verwijst voorlopig
naar de opgegeven eigen website; vervang deze URL door de Facebook-pagina zodra die beschikbaar is.

## 📸 Foto's beheren

Kort (volledige uitleg in [FOTO-UPLOADEN.md](FOTO-UPLOADEN.md)):

- **Behandelingsfoto's:** `images/services/*.jpg`, gekoppeld via `"image"` in `services.json`.
- **Impressie-tegels:** `images/gallery/nails-1..6.jpg` (nu Pexels-stockfoto's, vrije licentie).
- **Klantfoto's per stijl:** zet ze in de albummap (bijv. `images/gallery/rode-nagels/rode-nagels-01.jpg`)
  en voer uit:
  ```
  python tools/update_galerij.py
  ```
  Onderschriften kunnen in een `descript.ion` in de albummap.
- Bestandsnamen: **kleine letters, geen spaties** (Cloudflare is hoofdlettergevoelig).
- Vraag klanten toestemming voor foto's van hun nagels (AVG).

## 🚀 Lokaal testen

```bash
cd C:\MyDocs\DEVOPS\EmStudio
python -m http.server 8000
```

Open http://localhost:8000 (niet via `file://` – dan kunnen de JSON-bestanden niet laden).
Tip: wis in DevTools de *Local Storage* om de site te zien zoals een nieuwe bezoeker.

## 📤 Publiceren (Git → Cloudflare)

De repository is gekoppeld: Cloudflare Pages bouwt automatisch vanaf GitHub `main`
(geen build command, output directory `/`).

```bash
git add -A
git commit -m "Omschrijving van de wijziging"
git push
```

Na ±1 minuut staat het live. In GitKraken: *Stage all* → commit → *Push*.

## 🗄️ Caching & versienummers

Ingesteld in `_headers`:

| Bestand | Cache |
|---|---|
| `index.html`, `data/*`, `*.js`, `*.css` | altijd hervalideren (`max-age=0`) |
| `images/*` | 30 dagen |

Omdat Cloudflare op het eigen domein CSS/JS toch enkele uren kan bewaren, en foto's 30 dagen
gecachet worden, gebruiken we **versienummers** in de URL:

- **CSS/JS gewijzigd?** Verhoog `?v=N` op beide regels in `index.html` (nu `?v=10`).
- **Foto vervangen met dezelfde naam?** Verhoog `?v=N` achter het pad in `services.json`/`gallery.json`.
  Albumfoto's krijgen automatisch een versie via `tools/update_galerij.py`.
- **Prijzen/teksten in `data/`** zijn direct zichtbaar (geen versienummer nodig).

Aanbevolen in het Cloudflare-dashboard (domein → Caching → Configuration):
*Browser Cache TTL* = **Respect Existing Headers**.

> Verwijs nooit naar een bestand dat niet bestaat: Cloudflare geeft dan de homepage terug
> (status 200) en bewaart dat 30 dagen, waardoor bezoekers een kapotte foto zien.

## 🔍 SEO

- Meta title/description en Open Graph in `index.html`
- Schema.org `LocalBusiness` (JSON-LD) in `index.html`, `priceRange` **€10 - €60**
- `sitemap.xml` en `robots.txt`

## 🔐 Privacy & beveiliging

- Geen cookies, geen tracking, geen formulieren – contact loopt via WhatsApp
- Alleen `localStorage` voor weergavevoorkeuren (grijswaarden, lettergrootte, foto's) en het mandje;
  er wordt niets naar een server gestuurd
- Beveiligingsheaders in `_headers` (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, ...)
- HTML-escaping van alle JSON-inhoud in `script.js`
- HTTPS via Cloudflare

Voeg je later analytics of een formulier toe, dan zijn een cookiebanner en privacyverklaring nodig.

## 📝 Nog te doen

- [ ] Echte **telefoon**, **e-mail**, **adres** en **Maps-link** in `data/settings.json` (nu voorbeeldwaarden)
- [ ] Dezelfde gegevens + domein `emmanagelstudio.vip` in Schema.org, `og:url` en `canonical` in `index.html`,
      en in `sitemap.xml`/`robots.txt` (nu `nailsalonemma.nl`)
- [ ] Echte Instagram/Facebook-links in `settings.json`
- [ ] Klantfoto's in de Impressie-albums; eigen foto's i.p.v. stockfoto's op de tegels
- [ ] Eigen foto's per behandeling (nu 10 gedeelde foto's)

## ❓ Problemen oplossen

| Probleem | Oplossing |
|---|---|
| Wijziging niet zichtbaar online | Gepusht? Wacht 1 minuut, Ctrl+F5. CSS/JS: `?v=N` verhoogd? |
| Foto laadt niet | Bestandsnaam exact (kleine letters)? Bestand gecommit? Pad in JSON klopt? |
| Oude foto blijft zichtbaar | Versie verhogen (`?v=N`) in de JSON |
| Prijzen/behandelingen leeg | JSON-fout → controleer op https://jsonlint.com of F12 → Console |
| WhatsApp opent niet goed | Nummer in `settings.json` met landcode, zonder spaties |
| Lokaal leeg scherm | Gebruik een HTTP-server, niet `file://` |
