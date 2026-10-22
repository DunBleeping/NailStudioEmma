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

De salonteksten spreken persoonlijk vanuit Emma: **ik/mijn** en in het Engels **I/my**.

1. **Header** – logo (`images/logo.jpg`), menu (Home, Prijzen, Behandelingen, Zoeken, Impressie, Contact),
   taalkeuze **Nederlands / English**, en de knoppen 👁️ grijswaarden,
   **A– A A+ A++** lettergrootte en een afbeeldingspictogram met **Foto's tonen / Foto's verbergen**.
   Op mobiel (< 768 px) wordt het menu een ☰ hamburger. Vanaf 768 px staan de zes links op één regel;
   de bedieningsknoppen mogen naar een volgende rij. Er staat geen afspraakknop in het menu.
   Op mobiel staat ☰ links direct onder het logo; de taalkeuze is direct zichtbaar rechts naast het logo.
   Alleen de lettergrootte staat in het uitklapmenu.
   Grijswaarden en foto's tonen blijven rechts zichtbaar. Het menu sluit met een link of **Esc**.
   **Zoeken** gaat naar de zoekbalk voor behandelingen en geeft deze direct toetsenbordfocus.
   Op lage, liggende schermen zoals smartphones (hoogte maximaal 500 px, breedte maximaal 1024 px)
   scrolt de bovenbalk mee in plaats van bovenaan te blijven staan.
2. **Hero** – welkomsttekst, knoppen *Bekijk behandelingen*, *📱 WhatsApp*, *Instagram*,
   *Facebook*, groot logo. Instagram is niet klikbaar zolang de profiellink ontbreekt.
   Direct onder de welkomsttitel staat een smalle horizontale nagelfoto; deze schakelt mee met foto's tonen/verbergen.
3. **Prijslijst** – tabel met alle behandelingen, duur en prijs, plus blok **Toeslagen**
   (nu: *Verwijderen oude lak/gellak +€5* bij een nieuwe set). Rechts van **Prijs** staat een aparte
   kolom **Kiezen** met **+ dit wil ik**; deze knop en de behandelkaart houden dezelfde mandjekeuze
   bij, in beide talen. Ook mobiel blijven de vier kolommen naast elkaar staan.
   Op mobiel is de tabeltekst kleiner en blijven bedragen op één regel.
   Alleen hier wordt de duur als analoge klok met wijzers en kwartiermarkeringen getoond, visueel naar boven afgerond.
   Elk heel uur krijgt een eigen volle klok; de resterende tijd krijgt een extra klok.
   Anderhalf uur wordt dus een volle en een halve klok; een + blijft zichtbaar bij een minimumduur.
   De exacte duur blijft beschikbaar voor schermlezers, bij de behandelingen, in het mandje en in berichten.
   De toeslag heeft een eigen vak over de volledige tabelbreedte, met naam en prijs boven de uitleg.
4. **Mijn Behandelingen** – onder "Categorieën" een **zoekbalk** (zoekt live in naam, categorie en
   omschrijving; hoofdletters en accenten maken niet uit), daaronder het categoriemenu met 7 categorieën
   en 27 behandelkaarten (foto, categorie, naam, omschrijving, duur, prijs, eventueel notitie en een
   knop **+ dit wil ik**, onderaan de kaart en op gelijke hoogte binnen elke rij).
5. **Impressie** – albums Cat Eye, Chrome, Custom Designs, Gellak, BIAB en Babyboom; lege albums zijn verborgen.
   De eerste foto op naam is de tegel. Klik → **album** met foto's per stijl
   (bladeren met pijlen, pijltjestoetsen of vegen).
6. **Over Emma NailStudio** – introductie en *Ik werk op afspraak, zodat je bij aankomst niet hoeft te wachten.*
7. **Contact & Openingstijden** – telefoon na klikken, adresuitleg, openingstijden en WhatsApp.
   **Toon telefoonnummer**, WhatsApp en SMS starten bij de eerste klik een Turnstile-controle.
   Na servercontrole verschijnt het nummer en een knop om bellen, WhatsApp of SMS te openen.
   Deze extra klik voorkomt geblokkeerde pop-ups na asynchrone verificatie.
   Na een geslaagde controle werken WhatsApp en SMS direct zolang de pagina openblijft.
   **Bezoek mij** toont na uitklappen alleen dat het adres na afspraakbevestiging wordt gedeeld.
   Het adres en de kaartlink staan niet in de openbare configuratie of gestructureerde paginagegevens.
   Het nummer staat uitsluitend in een Cloudflare-secret; alleen de gecontroleerde API geeft het terug.
   Het wordt niet in localStorage bewaard. Dit voorkomt geen verdere verspreiding door een geverifieerde bezoeker.
8. **Footer** – links, social media, copyright.
9. **Zwevende WhatsApp-knop** rechtsonder, met daarboven de knop **🛒 Mandje** zodra er behandelingen
   gekozen zijn.

**Standaardinstellingen voor nieuwe bezoekers:**
- **Foto's verborgen** – rustiger en sneller; tegels onder Impressie tonen dan titel + omschrijving.
  Ook het grote logo in het welkomstblok wordt verborgen; het kleine headerlogo blijft altijd zichtbaar.
  Een tip bovenaan en bij Impressie verwijst naar **Foto's tonen** rechtsboven.
  De knop wisselt met de fotoweergave en taal tussen tonen/verbergen en Show/Hide photos.
  De tip verdwijnt zodra foto's zichtbaar zijn; de keuze wordt onthouden.
  Bij omschakelen blijft de zichtbare tekst zo veel mogelijk op dezelfde schermhoogte staan.
  Helemaal bovenaan blijft de pagina bovenaan; bij de paginaranden kan de beschikbare scrollruimte dit beperken.
- Lettergrootte **A–** (kleinste, 87,5%), kleur aan (geen grijswaarden).
  Een eerder opgeslagen letterkeuze blijft behouden.
- Taal **Nederlands**; bezoekers kunnen **English** kiezen. De taal wordt onthouden (localStorage `language`).
  Omschakelen behoudt het mandje, toeslagen, zoekopdracht, categoriefilter en toegankelijkheidsvoorkeuren.

**Afspraken gaan via WhatsApp of SMS** naar het nummer in de serversecret. Er is geen e-mail of online agenda.
De hero-knop, de contactknop en de zwevende knop openen WhatsApp met een voorbereid bericht.
De extra SMS-optie staat uitsluitend in het mandje en gebruikt hetzelfde nummer en dezelfde inhoud.

**Behandelmandje → WhatsApp:** de bezoeker zet behandelingen met *+ dit wil ik* in het mandje. In het
mandje staan de gekozen behandelingen met duur en prijs, het totaal en (alleen bij een nieuwe set) het
vinkje *Verwijderen oude lak/gellak +€5*.
Het mandje toont ook de **opgetelde behandeltijd in minuten**, met uitleg dat dit een indicatie
voor alle gekozen behandelingen samen is en de werkelijke duur kan afwijken. Bij een behandeling
met `60+ minuten` blijft het plusteken in de totaaltijd staan (bijvoorbeeld `90+ minuten`).
De tijd wordt bij elke keuze en taalwissel bijgewerkt. Toeslagen zonder opgegeven duur tellen niet
mee in deze tijdindicatie; de bestaande individuele tijden in WhatsApp/SMS blijven ongewijzigd.

Bij een nieuwe set is deze optie **standaard aangevinkt**. Als er nog oude lak/gellak op de nagels zit,
is verwijderen verplicht. Klanten mogen uitvinken als verwijderen niet nodig is. Die keuze blijft
behouden bij taalwisselen, herladen en toevoegen van behandelingen zolang er een nieuwe set in het
mandje staat (localStorage `cartExtrasDeclined`). Zodra alle nieuwe sets verwijderd zijn of het mandje
wordt leeggemaakt, begint een volgende nieuwe set weer met de toeslag aangevinkt.
De toeslag telt eenmaal mee in het totaal en in beide taalversies van het WhatsApp-bericht.

*Afspraak aanvragen via WhatsApp* en *Afspraak aanvragen via SMS* openen de gekozen app met dezelfde
berichtinhoud. Bij taalkeuze **English** is dat bijvoorbeeld:

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
afspraakverzoek, geen betaling; Emma bevestigt via WhatsApp of SMS. Het mandje wordt in de browser onthouden
(localStorage `cart` en `cartExtras`).
Bij taalkeuze **Nederlands** is het bericht **alleen Nederlands**; bij **English** is het
**eerst Engels en daarna Nederlands**. Dit geldt voor WhatsApp én SMS. Zonder behandelingen gebruiken
WhatsApp-links het korte standaardbericht volgens dezelfde taalregel.

SMS opent een concept via `sms:`; de klant moet zelf op verzenden drukken. Een geschikte berichtenapp
is vereist; op iPad/Mac is voor gewone SMS doorgaans een gekoppelde iPhone nodig.
De provider kan kosten rekenen en lange berichten kunnen meerdere SMS'jes zijn.
Voor Apple gebruiken we `&body=`, voor Android/overige clients `?body=`, met URL-gecodeerde inhoud.
Linkopbouw en inhoud zijn getest, maar daadwerkelijk afleveren moet op een echte telefoon worden gecontroleerd.

### Vertalingen beheren

De Nederlandse teksten blijven in `index.html` en de bestaande JSON-bestanden staan.
`data/translations.json` bevat onder `en` de Engelse vertalingen, met de **exacte Nederlandse tekst**
als sleutel. Bij nieuwe of gewijzigde teksten voeg je daar ook de Engelse vertaling toe:

```json
"Verwijderen oude lak/gellak": "Remove old nail polish/gel polish"
```

Dit geldt ook voor namen, omschrijvingen, duur, categorieën, notities, Impressie-albumtitels, alt-teksten en
foto-onderschriften. Bij HTML-teksten worden witruimte en regeleinden samengevoegd tot enkele spaties.
Markeer nieuwe vaste teksten met `data-i18n`; vertaal attributen met bijvoorbeeld
`data-i18n-attrs="aria-label,title"`. Ontbrekende vertalingen geven een waarschuwing in de browserconsole
en tonen voorlopig de Nederlandse tekst. Controleer dus altijd beide talen na inhoudswijzigingen.
Prijzen, foto's en behandel-ID's worden gedeeld en hoeven niet vertaald te worden.
Zoeken werkt op zowel Nederlandse als Engelse behandelteksten, in beide talen.

## ✨ Functies

- ✅ Statische website zonder build-stap; een Pages Function controleert contacttoegang
- ✅ Nederlands/Engels met onthouden taalkeuze; NL- of tweetalige berichten volgens de gekozen taal
- ✅ Responsive / mobile-first (breekpunten 1024 px en 768 px)
- ✅ Alle inhoud uit JSON (`data/`) – teksten, prijzen, foto's
- ✅ Categoriefilter en zoekbalk voor behandelingen
- ✅ Behandelmandje dat een ingevuld WhatsApp- of SMS-afspraakverzoek maakt
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
│   ├── gallery.json           # 6 Impressie-albums ("folder", "photos"), automatisch bijgewerkt
│   ├── translations.json      # Engelse vertalingen van Nederlandse teksten
│   └── Prijzenlijst.csv       # Bronlijst prijzen (niet door de site gebruikt)
├── images/
│   ├── logo.jpg
│   ├── services/              # 10 behandelingsfoto's
│   └── gallery/
│       └── cateye/, chrome/, customdesigns/, gellak/, biab/, babyboom/
│                              # Albums met klantfoto's
├── tools/update-galerij.ps1   # Foto's, covers en cacheversies genereren (PowerShell 7)
├── tools/sync-website.ps1     # Optie 3 genereert de lijst en publiceert de foto's samen
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
  "email": "info@nailsalonemma.nl",
  "whatsapp": {
    "message": "Hallo Emma NailStudio, ik wil graag een afspraak maken voor een nagelbehandeling."
  }
},
"hours": { "monday": "10:00 - 18:00", "...": "...", "sunday": "Gesloten" },
"social": { "instagram": "", "facebook": "https://EmmaNagelStudio.vip/", "googleSearch": "https://www.google.com/search?q=Emma+NailStudio+Purmerend", "whatsappBusiness": true }
```

Telefoonnummer uitsluitend in Cloudflare als secret `CONTACT_PHONE`, internationaal met + en zonder spaties.
`whatsappBusiness: true` toont de beveiligde WhatsApp-link in de footer; zet hier geen directe nummerlink.
De extra hero-knoppen gebruiken `social.instagram`, `social.facebook` en `social.googleSearch`.
Vul later de Instagram-profiel-URL in om die knop te activeren. De Facebook-knop verwijst voorlopig
naar de opgegeven eigen website; vervang deze URL door de Facebook-pagina zodra die beschikbaar is.

## 📸 Foto's beheren

Kort (volledige uitleg in [FOTO-UPLOADEN.md](FOTO-UPLOADEN.md)):

- **Behandelingsfoto's:** `images/services/*.jpg`, gekoppeld via `"image"` in `services.json`.
- **Impressie-tegels:** automatisch de eerste foto op naam van elk gevuld album.
- **Klantfoto's per stijl:** zet ze in de albummap (bijv. `images/gallery/cateye/cateye-01.jpg`)
  en voer in PowerShell 7 uit:
  ```powershell
  .\tools\sync-website.ps1
  ```
  Kies optie 3: de lijst wordt automatisch bijgewerkt, inclusief verwijderingen en fotoversies.
  Alle gewijzigde albumbestanden gaan samen mee. Lege albums worden niet getoond.
  Alleen lokaal bijwerken kan met `.\tools\update-galerij.ps1`; Python is niet nodig.
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

- **CSS/JS gewijzigd?** Verhoog `?v=N` op beide regels in `index.html` (nu `?v=23`).
- **Foto vervangen met dezelfde naam?** Verhoog `?v=N` achter het pad in `services.json`/`gallery.json`.
  Albumfoto's krijgen automatisch een versie via optie 3 van `tools/sync-website.ps1`.
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

- Geen analytics of boekingsformulieren; contact loopt via WhatsApp of SMS
- Alleen `localStorage` voor weergavevoorkeuren (grijswaarden, lettergrootte, foto's) en het mandje;
  het mandje wordt niet naar de contact-API gestuurd
- Turnstile wordt pas bij een contactverzoek geladen. Cloudflare verwerkt daarbij verificatiegegevens;
  de browser stuurt alleen het tijdelijke controletoken naar `/api/contact`.
- Beveiligingsheaders in `_headers` (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, ...)
- HTML-escaping van alle JSON-inhoud in `script.js`
- HTTPS via Cloudflare

Vermeld Cloudflare Turnstile en het doel van botbescherming in de privacyinformatie.
Eerder gepubliceerde nummers kunnen nog in Git-historie of bij derden staan.

### Turnstile instellen en testen

- **Status 21 oktober 2026:** eigenaar bevestigt dat de deployment live is en Turnstile werkt.
- Beheeraccount **`ogdd....g@gm`**, inloggen via **GitHub**. De oude widget in **`emm....8@gm`**
  wordt niet gebruikt. Bewaar volledige accountgegevens alleen in de eigen wachtwoordmanager.
- Domein `emmanagelstudio.vip` is volgens de eigenaar bij Cloudflare geregistreerd;
  registratie/verlenging en Pages-hosting zijn aparte onderdelen.
  Zie [de account- en domeinhandleiding](SETUP-NEW-COMPUTER.md#domein-hosting-en-accounts-bevestigd-op-21-oktober-2026).
- Cloudflare-account voor hosting: aanmelden via GitHub; **Compute → Workers & Pages → nailstudioemma → Settings → Variables and secrets**.
- Zet `TURNSTILE_SECRET_KEY` (bijbehorende widgetsecret) en `CONTACT_PHONE` als **Secret** voor productie.
  Controleer de geselecteerde omgeving op de pagina; er hoeft geen pop-up te verschijnen.
- De openbare site key staat in `requestContactAccess()` in `js/script.js`.
  De widget moet `emmanagelstudio.vip` toelaten (en `www.emmanagelstudio.vip` als die host wordt gebruikt).
- `functions/api/contact.js` controleert POST, Origin, token, exacte hostnaam en actie `contact`.
  Alleen `/api/contact` draait via een Function (`_routes.json`); antwoorden worden niet gecachet.
  Bij ontbrekende secrets of verificatiefouten blijft het nummer afgeschermd en krijgt de bezoeker een foutmelding.
- Publiceer opnieuw na het wijzigen van secrets. Live Server/Python testen alleen de statische pagina,
  niet de contactfunctie. Daar verschijnt dus geen telefoonnummer zonder werkende API.
- Lokale Function-tests: `node --test tools/contact.test.mjs` (geen npm-pakketten nodig).
  Voor volledige lokale integratie is Wrangler Pages nodig. De productiehandler weigert bewust localhost
  en previews; gebruik daarvoor een apart testproject met testsleutels en uitsluitend lokale hostvalidatie.
  Verruim nooit de productie-allowlist met localhost en zet secrets nooit in Git.
- Controleer live: contactdialoog in NL/EN, echte challenge, nummer na succes, mandje in WhatsApp/SMS,
  annuleren/opnieuw proberen en weigering van een ongeldig token. De API ontvangt geen mandje of bericht.

## 📝 Nog te doen

- [ ] Volgende fase: Google Search Console / Business Profile, officiële Instagram-/Facebook-links
      en WhatsApp Business-profiel; daarna eventueel Google Ads met vooraf afgesproken budget.
      Zie [de stappenlijst](SETUP-NEW-COMPUTER.md#volgende-fase-vindbaarheid-en-sociale-kanalen).
- [ ] Voorbeeld-e-mailadres in `data/settings.json` beoordelen; telefoon is ingesteld, adres en Maps-link blijven bewust privé
- [ ] Domein `emmanagelstudio.vip` in Schema.org, `og:url` en `canonical` in `index.html`,
      en in `sitemap.xml`/`robots.txt` (nu `nailsalonemma.nl`)
- [ ] Echte Instagram/Facebook-links in `settings.json`
- [x] Eigen foto's in de Impressie-albums; lege albums blijven verborgen
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
