# Accessibility & Mobile Features - Emma NailStudio

## Korte confetti bij openen

- Decoratieve confetti verschijnt eenmaal per laden of herladen, maximaal drie seconden.
- Geen herhaling bij scrollen, taalwissel of bedienen van de site.
- De laag blokkeert geen klikken en is verborgen voor schermlezers en bij afdrukken.
- Bij `prefers-reduced-motion: reduce` verschijnt niets; inschakelen van die voorkeur stopt een lopende animatie direct.

## Taalkeuze en vertaling

- De taalkeuze is direct zichtbaar in de header, ook op mobiel naast het logo, en is met het toetsenbord te bedienen.
- Beschikbaar: Nederlands, Engels, Frans, Spaans, Turks, Arabisch, Oekraïens, Pools en Vietnamees.
- De gekozen taal wordt onthouden (localStorage `language`); standaard is de site Nederlands.
- Arabisch schakelt de pagina naar rechts-naar-links (RTL); andere talen blijven links-naar-rechts.
- Ook knoppen, schermlezerlabels, fototeksten, behandelingen en het mandje worden vertaald.
- Het `lang`-attribuut op `<html>` verandert mee, zodat schermlezers de juiste uitspraak gebruiken.
- Omschakelen wordt aangekondigd en behoudt mandje, zoekopdracht en overige voorkeuren.
- WhatsApp- en SMS-berichten zijn alleen Nederlands bij **Nederlands**; bij een andere taal eerst de gekozen taal en daarna Nederlands.

---

## ♿ Donkere modus (kleuren omkeren)

### Wat is het?
Voor klanten die in een donkere omgeving willen lezen is er een **donkere-modus knop** in de header die alle kleuren omkeert.

### Hoe werkt het?
1. **Klik op de 🌓 knop** in de header (rechtsboven)
2. **Kleuren worden omgekeerd** - lichte achtergrond wordt donker, tekst licht
3. **Foto's behouden hun originele kleuren** - afbeeldingen worden niet omgekeerd
4. **Opnieuw klikken** - normale kleuren komen terug
5. **Voorkeur wordt onthouden** - volgende bezoek dezelfde instelling

### Voor wie?
- Klanten die 's avonds of in een donkere omgeving lezen
- Klanten die gevoelig zijn voor fel licht
- Klanten die een donkere weergave prefereren

### Technische details
- LocalStorage slaat voorkeur op
- Werkt op alle browsers
- WCAG 2.2 AA compliant
- Geen uitbreiding nodig

---

## 🔠 Lettergrootte

- De pagina voorkomt doortrekken voorbij de boven- en onderrand waar de browser dit ondersteunt.
  Een zachte achtergrondkleur voorkomt een fel wit vlak bij terugveren in oudere browsers.
- De header gebruikt zijn natuurlijke inhoudshoogte, zonder procentuele hoogte die Safari kan uitrekken.
  Het kleine logo heeft vaste vierkante afmetingen en wordt niet samengedrukt door de taalkeuze.
- Op telefoon en tablet (tot en met 1024 px) scrolt de header met de pagina mee, in beide
  schermstanden. Dit vermijdt de vastplakkende header tijdens het scrollen in Safari.
  Op desktop blijft de header bovenaan vaststaan.
- De verborgen SVG-sprite voor socialmedia-iconen is ook met CSS verborgen, zodat deze
  geen leeg vlak boven de header inneemt. De zichtbare iconen blijven beschikbaar.

In de header staan de knoppen **A– · A · A+ · A++** (ook op mobiel, rechtsboven naast de andere knoppen).
- Nieuwe bezoekers starten met **A–** (87,5%); een bestaande letterkeuze wordt niet overschreven.
- **A** = normale grootte (100%); A+ (112,5%) en A++ (125%) groter.
- Het mobiele menu-icoon staat links onder het logo en geeft de open/dicht-status aan met `aria-expanded`.
- Het uitklapmenu blijft scrollbaar bij weinig schermhoogte en sluit met een link, **Esc** of een tik buiten het menu.
- De hele pagina schaalt gelijkmatig mee (de basisgrootte op `<html>` verandert, alle `rem`-maten volgen)
- Op mobiel (≤ 768 px) zijn titels begrensd en blijven de bedieningsknoppen even groot, zodat er
  ook bij A++ niets buiten het scherm valt (getest op 390 px, iPhone-formaat)
- iOS Safari vergroot tekst niet zelf (`-webkit-text-size-adjust: 100%`)
- De gekozen grootte wordt onthouden (localStorage `fontSize`) en direct bij het laden toegepast
- Handig voor klanten die slechter zien, zonder in te zoomen

---

## 🔍 Zoeken en 🛒 mandje

- Een zwevende ronde menuknop blijft linksboven bereikbaar, ook als de mobiele header wegscrolt.
  De achtergrond is transparant en de ronde rand heeft 25% dekking. De hamburger zelf
  is volledig zichtbaar: donkere streepjes met een witte omlijning voor lichte en donkere
  achtergronden. Het menu blijft volledig leesbaar. De klikruimte blijft 48 bij 48 px.
  Het uitklapmenu bevat Home, Prijzen, Behandelingen, Zoeken, Impressie en Contact.
  De knop geeft de open/dicht-status aan; een link, tik erbuiten of Esc sluit het menu.
  Bij Esc gaat de focus terug naar de knop. Het menu blijft scrollbaar in landschapstand.
- Onder de titel 'Behandelingen in beeld en uitgelegd' staat de foto van New Set Nagels.
  Die blijft zichtbaar bij inklappen en volgt wel de bestaande voorkeur Foto's tonen/verbergen.
  De foto gebruikt dezelfde bron uit `data/services.json` als de behandelkaart.

- Zoekveld onder "Categorieën" met label voor schermlezers; zoekt live, Enter sluit het toetsenbord
- **Zoeken** in het menu sluit het mobiele menu, scrolt naar de zoekbalk en geeft deze focus.
- Geen resultaten → melding "Geen behandelingen gevonden" (wordt voorgelezen, `role="status"`)
- Zoekveld heeft minimaal 16 px tekst, zodat iPhone niet inzoomt bij het typen
- Knop *+ dit wil ik* geeft met `aria-pressed` aan of de behandeling gekozen is
- Mandje opent als paneel; **Esc** of × sluit het, de focus gaat terug naar de mandjeknop

---

## 🖼️ Foto's tonen/verbergen

- Het grote bedrijfslogo blijft gecentreerd en behoudt zijn vierkante verhouding.
- De ruimte rond het logo volgt de afbeeldingshoogte, ook na draaien naar landschapstand.
- Op smalle schermen is het logo maximaal 300 px breed; het volgende blok snijdt het logo niet af.

De knop met afbeeldingspictogram en **Foto's tonen / Foto's verbergen** rechtsboven zet alle foto's
op de kaarten en onder Impressie aan of uit. De tekst, toegankelijke naam en tooltip volgen de
huidige toestand en taal; `aria-pressed` geeft aan of foto's zichtbaar zijn.
Navigatielinks hebben decoratieve achtergrondiconen; de linktekst blijft de toegankelijke naam.
Ook het grote logo in het welkomstblok schakelt mee; het kleine logo linksboven blijft altijd zichtbaar.
Een tip bovenaan en bij Impressie wijst op deze knop zolang foto's verborgen zijn.
De knop geeft met `aria-pressed` aan of foto's zichtbaar zijn.
- **Nieuwe bezoekers zien standaard géén foto's**: de pagina is rustiger en laadt sneller
- Bij verborgen foto's tonen de Impressie-tegels de titel en omschrijving van de stijl
- De keuze wordt onthouden (localStorage `imagesHidden`)
- Op mobiel zit de knop in de header naast het menu ☰

---

## 📱 Smartphone & Tablet Features

### Responsive Design
De website ziet er perfect uit op:
- **iPhone** (alle versies)
- **Android** (alle versies)
- **iPad** (portrait & landscape)
- **Android Tablets**
- **Desktop** (volle breedte optimized)

### Automatische Aanpassingen
- Menu wordt hamburger ☰ op mobiel
- Service kaarten stapelen zich
- Impressie past zich aan de schermgrootte aan
- Contact items worden responsive
- Buttons zijn touch-friendly (groot!)

### Smartphone-Optimalisaties

#### 📞 Bellen
```
Klik op Toon telefoonnummer → klik op het nummer → de telefoonapp opent
```
**Hoe het werkt:**
- Alle telefoonnummers zijn klikbaar
- Het nummer en de bellink verschijnen pas na een geslaagde Turnstile-servercontrole.
- De contactdialoog heeft een titel, statusmeldingen en sluitknop; Escape sluit en herstelt de toetsenbordfocus.
- Verificatie mislukt? Er verschijnt een foutmelding en **Opnieuw proberen**; er wordt geen nummer onthuld.
- Klik = Phone app opent
- Direct bellen zonder typen

**Technisch:**
- Gebruikt `tel:` protocol
- Werkt op alle smartphones
- Geen app nodig

#### 💬 WhatsApp (afspraak maken)
```
Klik op een WhatsApp-knop → WhatsApp opent met voorbereid bericht
```
**Features:**
- Afspraakverzoeken gaan naar het server-side ingestelde nummer via WhatsApp of SMS; geen e-mail/agenda
- Zwevende WhatsApp knop (rechtsonder)
- Altijd zichtbaar op mobiel
- Pre-filled met standaardbericht, of met de gekozen behandelingen uit het mandje
- Eerste keer: contactcontrole, daarna **Open WhatsApp** (extra klik voorkomt pop-upblokkering)
- Maakt tegelijk het telefoonnummer zichtbaar bij **Bel mij**, zonder de pagina daarheen te verplaatsen

#### SMS vanuit het mandje
- Naast WhatsApp staat in het mandje **Afspraak aanvragen via SMS**.
- Beide opties gebruiken dezelfde behandelingen, toeslagen en totaalprijs en dezelfde taalregel.
- SMS opent een concept in de berichtenapp; verzenden doet de klant zelf.
- Een geschikte berichtenapp is nodig; op iPad is voor SMS doorgaans een gekoppelde iPhone nodig.
- Providerkosten zijn mogelijk, met meerdere SMS'jes bij lange berichten.

#### 👆 Impressie-albums
- Tik op een stijl → album met foto's van echte klantresultaten
- **Vegen** naar links/rechts = volgende/vorige foto

#### 📍 Bezoek mij
- **Hoe ontvang ik het adres?** is een uitklapbare uitleg, bedienbaar met toetsenbord en aanraking.
- De uitleg vermeldt dat het adres pas na bevestiging van de afspraak wordt gedeeld.
- Er staat geen exact adres of kaartlink op de website.

---

## 📱 Mobile Menu

### Hamburger Menu ☰
- Kleiner scherm? Menu wordt hamburger
- Klik ☰ om menu uit/in te klappen
- Sluit automatisch na selectie of bij tikken buiten het menu
- Volledige navigatie behouden

### Navigation Links op Mobiel
- Groot voor touch (48px minimum)
- Goede spacing
- Donkere achtergrond voor contrast

---

## ♿ Accessibility Features (Algemeen)

### Voor Screen Readers
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, etc.)
- ARIA labels op buttons
- Alt text op alle afbeeldingen
- Proper heading hierarchy (H1 → H6)

### Keyboard Navigation
- Tab door alle elementen (ook de Impressie-tegels)
- Enter/Space activeren buttons en openen een Impressie-album
- ESC sluit het album
- Pijltjestoetsen in een album (volgende/vorige foto)

### Color Contrast
- WCAG 2.2 AA compliant
- Leesbaar voor iedereen
- Donkere modus (omgekeerde kleuren) voor lezen in een donkere omgeving; foto's behouden hun kleur

### Motion Sensitivity
- Respecteert `prefers-reduced-motion`
- Animaties kunnen uit
- Gebruikers met vestibular stoornissen

---

## 🎯 Gebruikersscenario's

### Scenario 1: Klant op iPhone

```
1. Bezoekt website
2. Menu ziet automatisch mobiel ☰
3. Klikt op "Prijzen"
4. Pagina scroll automatisch
5. Ziet WhatsApp knop rechtonder
6. Klikt WhatsApp → eerste keer contactcontrole → Open WhatsApp
7. Klikt telefoonnummer → opent phone app
```

### Scenario 2: Klant met kleurblindheid

```
1. Bezoekt website
2. Vindt 👁️ knop in header
3. Klikt → website wordt grijs
4. Beter leesbaar nu!
5. Volgende bezoek: automatisch grijs
6. Via localStorage onthouden
```

### Scenario 3: iPad gebruiker (landscape)

```
1. Website adapteert aan schermgrootte
2. 2-column layout beschikbaar
3. Volledige navigatie
4. Impressie als grote grid
5. Alle functies werken
```

### Scenario 4: Toetsenbord navigatie

```
1. Tab door menu items
2. Enter op link → navigatie
3. ESC in gallery modal → sluit
4. Arrow keys in gallery → volgende/vorige
5. WCAG compliant full navigation
```

---

## 🔧 Voor Developers

### Donkere modus Toggle
```javascript
// Toggle inverted colors (op <html>, niet <body>: een filter op body breekt
// position:fixed, waardoor de zwevende WhatsApp-knop uit beeld verdwijnt)
document.documentElement.classList.toggle('inverted');

// Save preference
localStorage.setItem('emstudio-inverted', 'enabled');
```

### CSS
```css
/* Kleuren omkeren; foto's en de WhatsApp-knop krijgen een tweede invert
   zodat ze origineel blijven */
html.inverted {
  filter: invert(1);
}

html.inverted img,
html.inverted .whatsapp-button {
  filter: invert(1);
}
```

### Mobile Breakpoints
```css
/* Tablet: 769px - 1199px */
@media (max-width: 1199px) { ... }

/* Mobile: ≤768px */
@media (max-width: 768px) { ... }
```

### Touch-Friendly Buttons
```css
/* Minimum 48px x 48px */
button, a {
  padding: 0.75rem 1.5rem;  /* ~48px height */
  min-width: 48px;
}
```

---

## 📊 Testresultaten

### Mobile Devices Getest
- ✅ iPhone 12, 13, 14 (iOS)
- ✅ Samsung Galaxy (Android)
- ✅ Google Pixel (Android)
- ✅ iPad Air (iPadOS)

### Browsers Getest
- ✅ Chrome/Chromium (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)

### Accessibility Tested
- ✅ Screen readers (NVDA, JAWS)
- ✅ Keyboard navigation
- ✅ Color contrast (WCAG AA)
- ✅ Donkere modus (omgekeerde kleuren)
- ✅ Motion sensitivity

---

## 🚀 Best Practices

### Voor Mobiel
1. **Telefoon nummer duidelijk** - groot, klikbaar
2. **WhatsApp prominent** - gemakkelijk te vinden
3. **Geen hover** - touch-friendly alternatieven
4. **Groot schrift** - lesbaar op kleine schermen
5. **Weinig scrollen** - inhoud georganiseerd

### Voor Accessibility
1. **Alt teksten** - beschrijf alle afbeeldingen
2. **Headings** - juiste hiërarchie (H1-H6)
3. **Contrast** - minimaal 4.5:1 ratio
4. **Keyboard** - alles bereikbaar met Tab
5. **Labels** - duidelijk bij alle inputs

### Voor Snelheid
1. **Statische bestanden** - alleen contacttoegang heeft een Pages Function met Turnstile-servercontrole
2. **Geen JavaScript frameworks** - minimaal JS
3. **Compressed images** - SVG placeholders
4. **Cloudflare CDN** - global distribution
5. **Browser cache** - _headers geoptimaliseerd

---

## 📚 Meer Informatie

- **WCAG 2.2 AA** - Web Content Accessibility Guidelines
- **Responsive Design** - Mobile-first approach
- **Progressive Enhancement** - Works without JavaScript
- **Semantic HTML** - Proper element usage
- **Web Vitals** - Core performance metrics

---

## 💡 Tips voor Klanten

### Klik op Telefoonnummer
```
Wilt u direct bellen?
→ Klik op het telefoonnummer in de Contact sectie
→ Uw phone app opent automatisch
→ Tik groen knop = bellen!
```

### Donkere Modus
```
Lezen in een donkere omgeving?
→ Klik de 🌓 knop in de header
→ Kleuren worden omgekeerd, foto's blijven origineel
→ Volgende keer onthouden wij dit!
```

### WhatsApp op Mobiel
```
Via WhatsApp een afspraak maken?
→ Klik groene WhatsApp knop
→ WhatsApp opent op uw telefoon
→ Bericht is al ingevuld!
```

---

**Alle features getest en werkend! ✅**

Vragen? Raadpleeg README.md of QUICK-REFERENCE.md
