# Quick Reference - Emma NailStudio Website

**Live:** https://emmanagelstudio.vip · **GitHub:** DunBleeping/NailStudioEmma (`main`) · **Hosting:** Cloudflare Pages

Volledige uitleg: [README.md](README.md)

## Beheer en aanmelding

- **Cloudflare:** https://dash.cloudflare.com, account **`ogdd....g@gm`**, inloggen via **GitHub**.
- **Hosting en secrets:** **Compute → Workers & Pages → nailstudioemma → Settings → Variables and secrets**.
- **Domein:** `emmanagelstudio.vip` is volgens de eigenaar bij Cloudflare geregistreerd.
  Registratie/verlenging staat los van hosting: **Domains → Registrations**.
- **Extra domein:** `emmanailsalon.nl`, volgens de eigenaar geregistreerd bij **STRATO**.
  `.vip` blijft de voorkeur. Voorgesteld: een HTTPS-geschikte 301-doorverwijzing van .nl naar .vip;
  nog niet ingesteld. Geen tweede website of domeinverhuizing nodig als de registrar goed kan doorsturen.
- **Turnstile:** actieve widget in het hostingaccount; eerdere widget in **`emm....8@gm`** niet gebruiken.
  Secrets `TURNSTILE_SECRET_KEY` en `CONTACT_PHONE` uitsluitend bij Cloudflare.
- **Status 21 oktober 2026:** eigenaar bevestigt live publicatie en werkende Turnstile.
- Volledige accountuitleg en volgende stappen voor Google/social:
  [SETUP-NEW-COMPUTER.md](SETUP-NEW-COMPUTER.md#domein-hosting-en-accounts-bevestigd-op-21-oktober-2026).

---

## 🔁 Werkwijze bij elke wijziging

**PowerShell-hulpscript (PowerShell 7):**

```powershell
cd C:\MyDocs\DevOps\EmStudio
.\tools\sync-website.ps1 -WhatIf
.\tools\sync-website.ps1
```

Zonder `-Bestanden` verschijnt een menu: instellingen, prijzen/behandelingen, foto's,
websitetekst/opmaak of zelf kiezen. Kies daarna de gewenste gewijzigde bestanden en
**alleen controleren** of **publiceren**. Het script vraagt nog bevestiging voor commit/push.
Voor foto's: zet bestanden vooraf in de juiste map. Optie 3 werkt de albumlijst automatisch bij
en neemt gewijzigde albumbestanden samen mee; het menu kopieert geen foto's van buiten de projectmap.
Behandelverwijzingen in `services.json` werk je nog wel zelf bij.
Hoofdletters, spaties en lege afbeeldingen worden geweigerd; geselecteerde JSON wordt gecontroleerd.
Rechtstreeks alleen instellingen publiceren zonder menu:
`.\tools\sync-website.ps1 -Bestanden "data\settings.json" -Bericht "Werk openingstijden bij"`.
Andere bestanden expliciet selecteren met `-Bestanden "index.html","js\script.js","css\style.css"`.
Sla alles eerst op via **Bestand → Alles opslaan**. Het script stopt bij fouten of nieuwere
GitHub-commits en verandert geen werkbestanden via een automatische pull.
De bevestiging omvat ook eerdere lokale commits die nog niet gepusht zijn.
Volledige uitleg en voorbeelden staan als comments in [tools/sync-website.ps1](tools/sync-website.ps1).

1. Bestand aanpassen en opslaan
2. Lokaal testen (optioneel):
   ```bash
   cd C:\MyDocs\DEVOPS\EmStudio
   python -m http.server 8000      # open http://localhost:8000, Ctrl+F5
   ```
3. Commit + push (terminal of GitKraken):
   ```bash
   git add -A
   git commit -m "Wat er gewijzigd is"
   git push
   ```
4. Na ±1 minuut live op https://emmanagelstudio.vip

---

## 📝 Waar pas ik wat aan?

| Wat | Bestand | Let op |
|---|---|---|
| Prijs / behandeling / duur | `data/services.json` | ook `data/Prijzenlijst.csv` bijwerken – zie [PRIJZEN-BEHEER.md](PRIJZEN-BEHEER.md) |
| Toeslag (bijv. verwijderen oude lak +€5) | `data/services.json` → `extras` | |
| WhatsApp-/telefoonnummer | Cloudflare-secret `CONTACT_PHONE` | internationaal met +, geen spaties; nooit in openbare bestanden |
| Standaardbericht | `data/settings.json` → `contact.whatsapp.message` | nummer komt pas na Turnstile-servercontrole |
| Openingstijden | `data/settings.json` → `hours` | |
| Instagram / Facebook | `data/settings.json` → `social` | |
| Behandelingsfoto | `images/services/` + `"image"` in `services.json` | zie [FOTO-UPLOADEN.md](FOTO-UPLOADEN.md) |
| Impressie-tegel | eerste foto op naam in de albummap | automatisch bij optie 3 |
| Klantfoto's in album | `images/gallery/<album>/` | `.\tools\sync-website.ps1`, optie 3 |
| Teksten hero / over ons | `index.html` | |
| Kleuren / opmaak | `css/style.css` (`:root`) | daarna `?v=` verhogen in `index.html` |
| Functionaliteit | `js/script.js` | daarna `?v=` verhogen in `index.html` |

---

## 🖼️ Klantfoto's toevoegen (Impressie-albums)

| Album | Map |
|---|---|
| Cat Eye | `images/gallery/cateye/` |
| Chrome | `images/gallery/chrome/` |
| Custom Designs | `images/gallery/customdesigns/` |
| Gellak | `images/gallery/gellak/` |
| BIAB | `images/gallery/biab/` |
| Babyboom | `images/gallery/babyboom/` |

1. Foto's erin als `<map>-01.jpg`, `<map>-02.jpg`, ... (kleine letters, geen spaties, < 500 KB)
2. Optioneel onderschriften in `descript.ion` in die map: `cateye-01.jpg Cat Eye in groen`
3. `.\tools\sync-website.ps1`, optie **3** en **A** (alle getoonde bestanden)
4. Eerst controleren, daarna publiceren en bevestigen

Toevoegen, vervangen en verwijderen werkt zonder JSON te bewerken. Lege albums blijven verborgen.
Gewijzigde albumbestanden gaan altijd samen mee. De eerste foto op naam is de tegel.
Alleen lokaal de lijst verversen: `.\tools\update-galerij.ps1` (PowerShell 7, geen Python).

---

## 🎛️ Standaardgedrag van de site

- Nieuwe bezoekers: **foto's verborgen** (knop **Foto's tonen** zet ze aan, keuze wordt onthouden)
- Nieuwe bezoekers: lettergrootte **A–**; bestaande letterkeuze blijft behouden.
- Op mobiel: menu links onder logo; taal direct zichtbaar naast logo, lettergrootte in het uitklapmenu.
- Prijslijst staat boven Mijn Behandelingen; toeslagtekst gebruikt de volledige tabelbreedte.
- Taalkeuze **Nederlands / English** in de header; keuze wordt onthouden.
  Vertalingen bijhouden in `data/translations.json` (exacte Nederlandse tekst → Engelse vertaling).
- WhatsApp-knoppen → eerst Turnstile-servercontrole, daarna voorbereid bericht; geen afspraakknop in het hoofdmenu
- Knoppen rechtsboven: 👁️ grijswaarden · A– A A+ A++ lettergrootte · **Foto's tonen / Foto's verbergen**
- Zoekbalk onder "Categorieën"; *+ dit wil ik* onderaan elke behandelkaart → 🛒 Mandje → WhatsApp-bericht met
  behandelingen, toeslag en totaal. In het mandje kan dit ook via **SMS** naar hetzelfde nummer.
- Berichttaal voor beide kanalen: **Nederlands = alleen Nederlands; English = eerst Engels, daarna Nederlands**.
  SMS opent een concept in de berichtenapp; zelf verzenden, providerkosten mogelijk.
- Nieuwe set: verwijderen oude lak/gellak **+€5 standaard aangevinkt**, verplicht bij aanwezige lak.
  Alleen uitvinken als verwijderen niet nodig is; die keuze blijft binnen het huidige mandje onthouden.

---

## 🗄️ Cache & versienummers

| Gewijzigd | Actie |
|---|---|
| `data/*.json` (prijzen, teksten) | niets – direct zichtbaar |
| `css/style.css` of `js/script.js` | `?v=N` +1 op beide regels in `index.html` (nu `?v=23`) |
| Foto vervangen met dezelfde naam | `?v=N` +1 achter het pad in de JSON |
| Albumfoto's | gaat automatisch bij optie 3 van `tools/sync-website.ps1` |

Verwijs nooit naar een foto die nog niet bestaat (Cloudflare cachet dan 30 dagen een kapotte foto).

---

## ❓ Troubleshooting

| Probleem | Oplossing |
|---|---|
| Wijziging niet live | Controleer Pages → Deployments en commit; bij vertraging ook GitHub/Cloudflare-status. Niet direct instellingen wijzigen. |
| Foto laadt niet | Bestandsnaam exact gelijk (kleine letters!), bestand gecommit? |
| Oude foto blijft staan | Album: optie 3 opnieuw uitvoeren; behandeling: `?v=` verhogen in de JSON |
| Prijzen/behandelingen leeg | JSON-fout → https://jsonlint.com of F12 → Console |
| WhatsApp werkt niet | Live testen; controleer Turnstile-hostnaam en beide Pages-secrets. Live Server voert de contact-API niet uit. |
| Lokaal leeg scherm | HTTP-server gebruiken, niet dubbelklikken op `index.html` |
| Nieuwe-bezoekerweergave testen | F12 → Application → Local Storage → wissen |

---

## 🎨 Kleuren (`css/style.css`)

```css
:root {
  --primary: #d4a574;    /* goud */
  --secondary: #f5f0eb;  /* crème */
  --accent: #8b7355;     /* bruin */
  --text: #333333;
  --light-text: #666666;
}
```

---

## 📊 Inhoud in cijfers

- 27 behandelingen in 7 categorieën, prijzen €10 – €60
- 1 optionele toeslag (verwijderen oude lak/gellak +€5)
- 6 Impressie-albums; lege albums blijven verborgen
- 10 behandelingsfoto's
