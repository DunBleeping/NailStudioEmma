# Emma NailStudio - Nagelsalon Website

Een moderne, professionele en gebruiksvriendelijke website voor Emma NailStudio, een luxe nagelsalon. Dit is een volledig statische website met HTML5, CSS3, JavaScript en JSON, geschikt voor gratis hosting op Cloudflare Pages.

## 📋 Inhoudsopgave

- [Functies](#functies)
- [Projectstructuur](#projectstructuur)
- [Lokaal testen](#lokaal-testen)
- [Configuratie aanpassen](#configuratie-aanpassen)
- [Afbeeldingen beheren](#afbeeldingen-beheren)
- [Naar Cloudflare Pages publiceren](#naar-cloudflare-pages-publiceren)
- [SEO & Prestaties](#seo--prestaties)
- [Privacy & Beveiliging](#privacy--beveiliging)

## ✨ Functies

### Kernfunctionaliteiten
- ✅ **Volledig statisch** - Geen backend nodig
- ✅ **Responsive ontwerp** - Perfect op desktop, tablet en mobiel
- ✅ **Mobile-first** - Geoptimaliseerd voor smartphones
- ✅ **Luxe design** - Professionele, minimalistische uitstraling
- ✅ **Snelle laadtijd** - Geoptimaliseerd voor Core Web Vitals
- ✅ **Toegankelijk** - WCAG 2.2 AA standaarden

### Secties
- 🏠 **Homepage** - Hero-sectie met introductie
- 💅 **Behandelingen** - Kaarten met services, prijzen en duur
- 💰 **Prijslijst** - Dynamische prijstabel met optionele toeslagen
- 🖼️ **Galerij** - Responsieve fototentoonstelling met modale viewer
- ℹ️ **Over de salon** - Persoonlijke introductie
- 📞 **Contact** - Contactgegevens, openingstijden, maps, WhatsApp

### Integraties
- 🔗 **WhatsApp Business** - Zwevende WhatsApp-knop en afspraaklinks
- 📱 **Social Media** - Instagram, Facebook links
- 🗺️ **Google Maps** - Directe links naar locatie
- 🔍 **SEO** - Schema.org structured data, sitemap.xml, robots.txt
- 📊 **Open Graph** - Optimaal voor sociale media

## 📁 Projectstructuur

```
EmStudio/
├── index.html              # Hoofdpagina (startpunt)
├── css/
│   └── style.css          # Alle CSS-stijlen
├── js/
│   └── script.js          # JavaScript voor interactiviteit
├── data/                  # Configuratiebestanden
│   ├── settings.json      # Salon instellingen & contactgegevens
│   ├── services.json      # Behandelingen en prijzen
│   └── gallery.json       # Galerij foto's
├── images/                # Afbeeldingen
│   └── gallery/           # Galerij foto's
├── sitemap.xml            # SEO sitemap
├── robots.txt             # SEO robots instructies
├── _headers               # Cloudflare beveiligings-headers
├── .gitignore             # Git ignore regels
└── README.md              # Dit bestand
```

## 🚀 Lokaal testen

### ⚠️ BELANGRIJK: Geen installatie nodig!

**Deze website is 100% statisch.** Er hoeft NIETS op uw computer geïnstalleerd te worden. Dit zijn puur HTML, CSS en JavaScript bestanden. De optie hieronder is ALLEEN voor lokaal testen - niet nodig voor normaal gebruik!

### Lokaal testen (optioneel - voor development)

Voor testen terwijl u aanpassingen maakt, kunt u een eenvoudige HTTP-server gebruiken:

```bash
cd C:\MyDocs\DEVOPS\EmStudio
python -m http.server 8000
```

Open vervolgens in je browser: `http://localhost:8000`

### Methode 2: Node.js HTTP Server

```bash
cd C:\MyDocs\DEVOPS\EmStudio
npx http-server -p 8000
```

### Methode 3: VS Code Live Server

1. Installeer extensie: "Live Server"
2. Rechtsklik op `index.html`
3. Kies "Open with Live Server"

### Waarom niet `file://`?

JavaScript kan JSON-bestanden niet laden via `file://` URL vanwege browser-veiligheidsbeperkingen (CORS). Gebruik altijd een lokale HTTP-server.

## 🔧 Configuratie aanpassen

### Salon instellingen wijzigen

Bewerk `data/settings.json`:

```json
{
  "salon": {
    "name": "Emma NailStudio",
    "tagline": "Luxe nagelverzorging voor perfecte nagels",
    "description": "Uw beschrijving hier..."
  },
  "contact": {
    "phone": "+31 6 12345678",
    "email": "info@nailsalonemma.nl",
    "address": "Hoofdstraat 123, 1234 AB Amsterdam",
    "whatsapp": {
      "number": "+31612345678",
      "message": "Hallo Emma NailStudio, ik wil graag een afspraak maken."
    }
  },
  "hours": {
    "monday": "10:00 - 18:00",
    "tuesday": "10:00 - 18:00"
    // ... etc
  },
  "social": {
    "instagram": "https://instagram.com/emmanailstudio",
    "facebook": "https://facebook.com/emmanailstudio",
    "whatsappBusiness": "https://wa.me/31612345678"
  }
}
```

### Behandelingen en prijzen wijzigen

Bewerk `data/services.json`:

```json
{
  "services": [
    {
      "id": "biab",
      "name": "BIAB",
      "category": "Nagels",
      "description": "Builder In A Bottle",
      "price": 45,
      "duration": "60 minuten",
      "image": "./images/gallery/biab.jpg"
    }
    // ... meer behandelingen
  ],
  "extras": [
    {
      "id": "ombre",
      "name": "Ombre Effect",
      "price": 10,
      "description": "Mooi color-fade effect"
    }
  ]
}
```

**Opmerking:** Alle prijzen in het systeem worden uit deze JSON geladen. Wijzig hier, en alles wordt overal bijgewerkt.

### Galerij foto's toevoegen

Bewerk `data/gallery.json`:

```json
{
  "images": [
    {
      "id": "gallery-1",
      "title": "Klassieke Rode Nagels",
      "description": "Elegante rode gellak",
      "src": "./images/gallery/nails-1.jpg",
      "alt": "Rode gellak manicure - klassiek elegant design",
      "category": "gellak"
    }
  ]
}
```

## 📸 Afbeeldingen beheren

### Galerij foto's toevoegen

1. **Plaats je foto's** in: `images/gallery/`
2. **Update `data/gallery.json`** met het pad en beschrijving:

```json
{
  "src": "./images/gallery/jouw-foto.jpg",
  "alt": "Beschrijvende alt-tekst voor toegankelijkheid"
}
```

### Salon/Hero afbeeldingen

- **Hero afbeelding**: Update in `index.html` de `hero-image` sectie
- **About/Salon afbeelding**: Update in `index.html` de `about-image` sectie

### Placeholder afbeeldingen vervangen

Momenteel gebruiken we SVG-placeholders. Vervang deze door echte afbeeldingen:

```html
<!-- Van: -->
<img src="data:image/svg+xml,<svg>...</svg>">

<!-- Naar: -->
<img src="./images/jouw-foto.jpg" alt="Beschrijving">
```

### Afbeeldingsoptimalisatie tips

- **Formaat**: Gebruik JPG/WebP voor foto's, PNG voor graphics
- **Grootte**: Comprimeer afbeeldingen (max 2-3 MB per foto)
- **Resolutie**: Minimaal 600px breedte voor galerij
- **Alt-tekst**: Altijd beschrijvende alt-teksten voor toegankelijkheid

**Gereedschappen:**
- [TinyJPG](https://tinyjpg.com/) - Comprimeren
- [ImageOptim](https://imageoptim.com/) - Optimaliseren
- [Canva](https://www.canva.com/) - Eenvoudige ontwerpen

## 📤 Naar Cloudflare Pages publiceren

### ⚠️ GEEN installatie - Cloudflare hoost alles!

Dit is het mooie: Cloudflare Pages hoeft NIETS te installeren. De website wordt automatisch gehoost met:
- ✅ Automatische HTTPS
- ✅ Globale CDN (super snel)
- ✅ Gratis hosting
- ✅ Geen server/database nodig

U kunt ook Strato.nl of Google Domains gebruiken - het principe is hetzelfde!

1. Ga naar [GitHub.com](https://github.com/new)
2. Maak een **private** repository aan:
   - Naam: `emma-nailstudio`
   - Beschrijving: "Emma NailStudio website"
   - Privacy: Private
3. Klik "Create repository"

### Stap 2: Code naar GitHub pushen

```bash
cd C:\MyDocs\DEVOPS\EmStudio
git init
git add .
git commit -m "Initial commit: Emma NailStudio website"
git branch -M main
git remote add origin https://github.com/jouwusername/emma-nailstudio.git
git push -u origin main
```

### Stap 3: Cloudflare Pages verbinden

1. Ga naar [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Klik op "Pages" in de zijbalk
3. Klik "Create a project" → "Connect to Git"
4. Autoriseer GitHub en selecteer je repository
5. Build instellingen:
   - **Build command**: (leeg laten)
   - **Build output directory**: `/` (root)
6. Klik "Save and Deploy"

Cloudflare zal automatisch je website publiceren op: `https://emma-nailstudio.pages.dev`

### Stap 4: Eigen domein toevoegen (optioneel)

1. Klik op je project
2. Ga naar "Custom domains"
3. Voeg `nailsalonemma.nl` toe
4. Update je domeinregistrar's DNS naar Cloudflare nameservers

## 🔍 SEO & Prestaties

### Ingebouwde SEO-features

- ✅ **Semantic HTML5** - Juiste tags voor alle elementen
- ✅ **Meta tags** - Title, description, keywords
- ✅ **Open Graph** - Social media previews
- ✅ **Schema.org** - Structured data voor zoekmachines
- ✅ **Mobile optimized** - Responsive design
- ✅ **Fast loading** - Statische bestanden, minimale scripts
- ✅ **Sitemap.xml** - Voor Google/Bing indexering
- ✅ **Robots.txt** - Search engine instructions

### SEO checklist

- [ ] Update `<title>` in `index.html` met jouw salon naam
- [ ] Pas `meta description` aan
- [ ] Voeg je Google Business email toe in schema.org structured data
- [ ] Voeg echte foto's toe in plaats van placeholders
- [ ] Zorg voor unieke, beschrijvende alt-teksten
- [ ] Test met [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Voer SEO audit uit met [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Google Analytics (toekomstig)

Voor analytics kun je volgende toevoegen:

```html
<!-- Voeg voor </head> toe -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Vervang `GA_MEASUREMENT_ID` met je Google Analytics ID.

### Google Ads (toekomstig)

Voor conversie tracking met Google Ads:

```html
<!-- Event snippet voor conversie pagina/scherm in Google Ads - Conversie label: ... -->
gtag('event', 'conversion', {
  'value': 1.0,
  'currency': 'EUR'
});
```

## 🔐 Privacy & Beveiliging

### Huidige veiligheidsmaatregelen

- ✅ **Geen cookies** - Geen tracking cookies
- ✅ **Geen tracking** - Geen Google Analytics/Facebook Pixel
- ✅ **Geen formulieren** - Geen gegevensverzameling
- ✅ **HTTPS** - Cloudflare voegt automatisch HTTPS toe
- ✅ **Security headers** - Ingesteld in `_headers` bestand
- ✅ **XSS protection** - HTML escaping in JavaScript
- ✅ **CORS safe** - Geen externe API-aanroepen

### Privacy statement (optioneel)

Voeg een privacy pagina toe:

1. Maak `privacy.html` aan
2. Link in footer: `<a href="./privacy.html">Privacy</a>`
3. Beschrijf je privacy-beleid

### GDPR compliance

Omdat deze site geen gegevens verzamelt:
- Geen gegevensverwerkingsovereenkomst nodig
- Geen cookie-banner nodig
- Geen privacyverklaring verplicht (maar aanbevolen)

**Voor toekomstige toevoegingen:**
- Als je Google Analytics toevoegt → Cookie consent banner
- Als je contactformulier toevoegt → Privacy statement
- Als je newsletters start → Opt-in mailing list

## 🛠️ Onderhoud & Updates

### Regelmatig bijwerken

- **Maandelijks**: Controleer prijzen en openingstijden
- **Kwartaal**: Voeg nieuw galerij werk toe
- **Bij seizoen**: Update behandelingen/promoties
- **Jaarlijks**: Controleer alle contactgegevens

### Backup maken

```bash
# Maak regelmatig backup via Git
git push origin main

# Of lokale backup
xcopy C:\MyDocs\DEVOPS\EmStudio C:\Backups\EmStudio-backup /E /I /Y
```

### Problemen oplossen

**Q: Foto's laden niet?**
- Controleer bestandspaden in JSON
- Zorg dat je een HTTP-server gebruikt (niet `file://`)

**Q: Prijzen worden niet getoond?**
- Check console voor JSON-fouten (F12 → Console)
- Valideer `services.json` op [jsonlint.com](https://www.jsonlint.com/)

**Q: WhatsApp link werkt niet?**
- Zorg dat telefoonnummer correct is met landscode (bijv. +31)
- Verwijder hyphens/spaties uit nummer

## 📞 Ondersteuning

Voor vragen of problemen:
1. Check de [README tips](#onderhoud--updates)
2. Open browser console (F12) voor JavaScript-fouten
3. Valideer JSON-bestanden
4. Test met ander browser

## 📄 Licentie

Dit project is gemaakt voor Emma NailStudio. © 2024

---

**Klaar om te starten?**

1. ✅ Bewerk `data/settings.json` met jouw salon info
2. ✅ Bewerk `data/services.json` met jouw behandelingen
3. ✅ Voeg foto's toe in `images/gallery/`
4. ✅ Test lokaal: `python -m http.server 8000`
5. ✅ Push naar GitHub
6. ✅ Deploy naar Cloudflare Pages

Succes! 🎉
