# 📸 Foto's Uploaden - Emma NailStudio

De website heeft drie soorten foto's:

| Soort | Map | Waar op de site |
|---|---|---|
| **Behandelingsfoto's** | `images/services/` | Op de kaarten bij *Onze Behandelingen* |
| **Voorbeeldfoto's Impressie** | `images/gallery/nails-1.jpg` t/m `nails-6.jpg` | De 6 tegels onder *Impressie* |
| **Klantfoto's (albums)** | `images/gallery/<album>/` | Het album dat opent als je op een tegel klikt |
| Logo | `images/logo.jpg` | Header en hero |

> **Foto's standaard verborgen:** nieuwe bezoekers zien de site zonder foto's (rustiger, sneller).
> Met de knop 🖼️ *Foto's tonen/verbergen* rechtsboven zet een bezoeker ze aan; die keuze wordt onthouden.
> Onder Impressie zie je bij verborgen foto's de titels van de stijlen.

---

## 💅 Behandelingsfoto's (`images/services/`)

Er zijn **10 foto's**; meerdere behandelingen delen dezelfde foto:

| Bestand | Gebruikt bij |
|---|---|
| `wenkbrauw-epileren.jpg` | Wenkbrauw Epileren met Touw |
| `wenkbrauw-verven.jpg` | Wenkbrauw Verven en Epileren met Touw |
| `lip-epileren.jpg` | Boven- en Onderlip Epileren met Touw |
| `new-set-nagels.jpg` | New Set Nagels, Opvullen Naturel Nagel, Nieuwe Set op Eigen Nagel, BIAB Nieuwe Set, Opvullen BIAB, Alleen Verwijderen |
| `witte-poeder.jpg` | New Set Witte Poeder, Opvullen Witte Poeder |
| `roze-poeder.jpg` | Naturel Roze Poeder (Nieuwe Set), Naturel Opvullen Roze Poeder, Nieuwe Set Roze Poeder en Witte Randje, Babyboom Nieuwe Set, Opvullen Babyboom |
| `shellac.jpg` | Shellac, Opvullen met Gellak, Nieuwe Set met Gellak Inclusief, Nieuwe Set 2 Kleuren (met Glitter), Nails Design vanaf..., BIAB met Gellak Kleuren (nieuw + opvullen) |
| `manicure.jpg` | Manicure |
| `pedicure.jpg` | Pedicure, Pedicure met Gellak |
| `teennagels.jpg` | Teennagels Nieuwe Set met Gellak |

**Foto vervangen:** overschrijf het bestand met dezelfde naam. Omdat foto's 30 dagen in de cache
van bezoekers blijven, zet je in `data/services.json` achter het pad een versie, bijv.
`"image": "./images/services/shellac.jpg?v=2"` (bij de volgende vervanging `?v=3`, enz.).

**Eigen foto per behandeling:** zet een nieuw bestand in `images/services/` (kleine letters, geen spaties)
en pas bij die behandeling `"image"` aan in `data/services.json`. Verwijs nooit naar een bestand dat
(nog) niet bestaat – Cloudflare geeft dan de homepage terug en de bezoeker ziet een kapotte foto.

---

## 🖼️ **Foto specificaties**

- **Formaat:** JPG (ook PNG/WebP mogelijk)
- **Bestandsnaam:** kleine letters, geen spaties (Cloudflare is hoofdlettergevoelig: `Foto.JPG` ≠ `foto.jpg`)
- **Afmeting:** 800–1200 px breed is ruim voldoende
- **Grootte:** liefst < 300 KB, maximaal 500 KB per foto
- **Tips:** eigen werk, rustige lichte achtergrond, goed licht, scherp op de nagels

---

## 🖼️ **Impressie: albums met klantfoto's**

Elke tegel onder **Impressie** is een album:
- De tegel toont één **voorbeeldfoto** (`src` in `data/gallery.json`).
- Klikt een bezoeker op de tegel, dan opent het album met de **echte resultaten** van klanten (`photos`).
- Zolang een album nog leeg is (`"photos": []`), ziet de bezoeker alleen de voorbeeldfoto met de tekst
  *"Voorbeeldfoto - echte resultaten van onze klanten volgen binnenkort."*

### Klantfoto's toevoegen

Elk album heeft een eigen map met een `LEESMIJ.txt` met de voorgestelde bestandsnamen:

| Album | Map | Bestandsnamen |
|---|---|---|
| Klassieke Rode Nagels | `images/gallery/rode-nagels/` | `rode-nagels-01.jpg`, `rode-nagels-02.jpg`, ... |
| BIAB Nude | `images/gallery/biab-nude/` | `biab-nude-01.jpg`, ... |
| Floral Nail Art | `images/gallery/floral/` | `floral-01.jpg`, ... |
| Ombre Effect | `images/gallery/ombre/` | `ombre-01.jpg`, ... |
| Glitter Glamour | `images/gallery/glitter/` | `glitter-01.jpg`, ... |
| Minimalistisch Design | `images/gallery/minimalistisch/` | `minimalistisch-01.jpg`, ... |

1. Zet de foto's in de juiste map. Kleine letters, geen spaties, `.jpg` (of `.jpeg/.png/.webp`),
   liefst max. 1200 px breed en kleiner dan 500 KB. De volgorde op de site is de volgorde van de namen.
2. *(Optioneel)* Onderschriften: maak in die map een `descript.ion` met per regel
   `bestandsnaam onderschrift`, bijvoorbeeld `rode-nagels-01.jpg Klassiek rood op BIAB`.
3. Voer in de projectmap uit:
   ```
   python tools/update_galerij.py
   ```
   Het script zet alle gevonden foto's in `data/gallery.json` (veld `photos`), met een versiecode
   zodat een vervangen foto meteen zichtbaar is.
4. Commit en push; Cloudflare zet het binnen een minuut live.

**Met keuzemenu publiceren:** start `.\tools\sync-website.ps1` in PowerShell 7 en kies
**3. Nieuwe of vervangen foto's publiceren**. Selecteer zowel de foto's als de gewijzigde
`data/gallery.json` (of `data/services.json` bij behandelkaarten).
Het menu publiceert reeds klaargezette bestanden: stap 3 hierboven wordt niet automatisch uitgevoerd.
Je kunt eerst alleen controleren en daarna opnieuw starten om te publiceren.

Bezoekers bladeren door een album met de pijltjes, de pijltjestoetsen of door te vegen op mobiel.

**Engelse versie:** voeg voor nieuwe of gewijzigde titels, omschrijvingen, alt-teksten en
foto-onderschriften de Engelse vertaling toe onder `en` in `data/translations.json`.
De sleutel is de exacte Nederlandse tekst uit `gallery.json` (ook voor automatisch gegenereerde
foto-onderschriften na `update_galerij.py`). Bestandsnamen en fotopaden blijven voor beide talen gelijk.

> **Let op:** zet nooit zelf bestandsnamen in `gallery.json` van foto's die nog niet bestaan.
> Cloudflare geeft voor een ontbrekend bestand de homepage terug (en bewaart dat 30 dagen),
> waardoor bezoekers een kapotte foto zien. Het script neemt alleen bestaande foto's op.

**Tips:**
- Wil je een eigen foto als voorbeeld op de tegel? Vervang `nails-N.jpg` en verhoog `?v=2` naar `?v=3` in `gallery.json`.
- Vraag klanten toestemming voordat je een foto van hun handen/nagels online zet (AVG).
- Nieuwe stijl toevoegen? Kopieer een blok in `gallery.json`, geef een uniek `id`, titel en `folder`, en draai het script.

---

## 💡 **Vragen?**

**V: Kan ik dezelfde foto voor meerdere behandelingen gebruiken?**
A: Ja, dat gebeurt nu al (zie tabel hierboven). Een eigen foto per behandeling kan altijd later.

**V: Ik heb een foto vervangen maar zie nog de oude.**
A: Foto's blijven 30 dagen in de browsercache. Verhoog de versie (`?v=2` → `?v=3`) in
`services.json` of `gallery.json`. Voor albumfoto's doet `tools/update_galerij.py` dit automatisch.

**V: Mag ik foto's van internet gebruiken?**
A: Alleen met een vrije licentie (zoals Pexels/Unsplash). De huidige voorbeeldfoto's `nails-1..6.jpg`
komen van Pexels; de bron staat in `images/gallery/descript.ion`. Vervang ze bij voorkeur door eigen werk.

**V: Welk formaat is het beste?**
A: JPG. PNG kan ook, maar is meestal veel groter.

---

## 📁 **Mappenstructuur**

```
images/
├── logo.jpg
├── services/                  ← behandelingsfoto's (10 stuks)
│   ├── wenkbrauw-epileren.jpg
│   ├── ...
│   └── teennagels.jpg
└── gallery/
    ├── nails-1.jpg … nails-6.jpg   ← voorbeeldfoto's op de Impressie-tegels
    ├── descript.ion               ← omschrijving/bron per foto (verborgen bestand)
    ├── rode-nagels/               ← album Klassieke Rode Nagels (+ LEESMIJ.txt)
    ├── biab-nude/
    ├── floral/
    ├── ombre/
    ├── glitter/
    └── minimalistisch/
```

`images/gallery/biab.jpg`, `gellak.jpg`, `manicure.jpg`, `nailart.jpg`, `nailhealth.jpg`, `pedicure.jpg`
en `removal.jpg` zijn oude placeholders en worden niet gebruikt.

---

## 🚀 **Live zetten**

1. Foto's in de juiste map zetten (en eventueel `python tools/update_galerij.py` voor albums)
2. Lokaal controleren: `python -m http.server 8000` → http://localhost:8000 (Ctrl+F5)
3. Commit + push naar GitHub (`main`)
4. Na ±1 minuut staat het live op https://emmanagelstudio.vip ✨

---

**Veel succes! 💅✨**
