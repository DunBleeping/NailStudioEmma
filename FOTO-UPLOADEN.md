# 📸 Foto's Uploaden - Emma NailStudio

De website gebruikt deze foto's:

| Soort | Map | Waar op de site |
|---|---|---|
| **Behandelingsfoto's** | `images/services/` | Op de kaarten bij *Onze Behandelingen* |
| **Impressie-albums** | `images/gallery/<album>/` | De eerste foto op naam is de tegel; klikken opent de hele serie |
| **Smalle foto bovenaan** | automatisch uit het eerste gevulde Impressie-album | Onder de welkomsttitel |
| Logo | `images/logo.jpg` | Header en hero |

> **Foto's standaard verborgen:** nieuwe bezoekers zien de site zonder foto's (rustiger, sneller).
> Met de knop **Foto's tonen** met afbeeldingspictogram rechtsboven zet een bezoeker ze aan;
> daarna heet de knop **Foto's verbergen**. Die keuze wordt onthouden.
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
- De tegel toont de eerste foto op bestandsnaam.
- Klikken opent alle foto's in de map; bezoekers bladeren met pijlen, pijltjestoetsen of vegen.
- Een lege map wordt niet getoond. BIAB verschijnt dus vanzelf zodra je daar foto's toevoegt en publiceert.
- De smalle foto onder de welkomsttitel komt automatisch uit het eerste gevulde album.
- De albumfoto's zijn eigen foto's van de eigenaar; de oude, onjuiste bronvermeldingen zijn verwijderd.

### Klantfoto's toevoegen

Elk album heeft een vaste map. Je hoeft geen JSON of websitecode te veranderen:

| Album | Map | Bestandsnamen |
|---|---|---|
| Cat Eye | `images/gallery/cateye/` | `cateye-01.jpg`, `cateye-02.jpg`, ... |
| Chrome | `images/gallery/chrome/` | `chrome-01.jpg`, `chrome-02.jpg`, ... |
| Custom Designs | `images/gallery/customdesigns/` | `design-01.jpg`, `design-02.jpg`, ... |
| Gellak | `images/gallery/gellak/` | `gellak-01.jpg`, ... |
| BIAB | `images/gallery/biab/` | `biab-01.jpg`, ... |
| Babyboom | `images/gallery/babyboom/` | `babyboom-01.jpg`, ... |

1. Zet de foto's in de juiste map. Kleine letters, geen spaties, `.jpg` (of `.jpeg/.png/.webp`),
   liefst max. 1200 px breed en kleiner dan 500 KB. Andere namen mogen ook; de volgorde is alfabetisch.
   Gebruik bij meer dan negen foto's bij voorkeur `01`, `02`, ... `10` voor de gewenste volgorde.
   Alleen foto's direct in de albummap worden opgenomen, niet in submappen.
2. *(Optioneel)* Onderschriften: maak in die map een `descript.ion` met per regel
   `bestandsnaam onderschrift`, bijvoorbeeld `cateye-01.jpg Cat Eye in groen`.
3. Open PowerShell 7 in `C:\MyDocs\DevOps\EmStudio` en start:
   ```powershell
   .\tools\sync-website.ps1
   ```
4. Kies **3. Nieuwe of vervangen foto's publiceren**, daarna **A** voor alle getoonde bestanden.
   De albumlijst en fotoversies worden automatisch bijgewerkt. Alle gewijzigde albumbestanden
   gaan samen mee, ook als je maar één albumfoto selecteert; zo ontbreken er geen foto's op GitHub.
5. Kies controleren of publiceren. Bij publiceren geef je een omschrijving en bevestig je.
   Controleer daarna de Cloudflare-deployment en de website.

**Vervangen of verwijderen:** overschrijf een foto met dezelfde naam, of verwijder hem uit de map.
Voer daarna dezelfde stappen uit. Het script past de lijst en de cacheversies automatisch aan.
Verwijder je de laatste foto, dan verdwijnt ook de tegel.

**Alleen lokaal bekijken:** voer `.\tools\update-galerij.ps1` uit en vernieuw Live Server.
Er is geen Python nodig. Ook bij alleen controleren in het publicatiemenu wordt de lokale lijst
vernieuwd; er volgt dan geen commit of push.
De statische website kan zelf geen mappen uitlezen: alleen lokaal neerzetten maakt foto's nog niet live.

**Engelse versie:** voeg voor nieuwe of gewijzigde titels, omschrijvingen, alt-teksten en
foto-onderschriften de Engelse vertaling toe onder `en` in `data/translations.json`.
De sleutel is de exacte Nederlandse tekst uit `gallery.json` (ook voor automatisch gegenereerde
foto-onderschriften na `update-galerij.ps1`). Bestandsnamen en fotopaden blijven voor beide talen gelijk.

> **Let op:** zet nooit zelf bestandsnamen in `gallery.json` van foto's die nog niet bestaan.
> Cloudflare geeft voor een ontbrekend bestand de homepage terug (en bewaart dat 30 dagen),
> waardoor bezoekers een kapotte foto zien. Het script neemt alleen bestaande foto's op.

**Tips:**
- Wil je een andere foto op de tegel? Geef die een naam die als eerste sorteert, bijvoorbeeld `00-cover.jpg`.
- Vraag klanten toestemming voordat je een foto van hun handen/nagels online zet (AVG).
- Nieuwe stijl toevoegen? Kopieer een blok in `gallery.json`, geef een uniek `id`, titel en `folder`, en draai het script.

---

## 💡 **Vragen?**

**V: Kan ik dezelfde foto voor meerdere behandelingen gebruiken?**
A: Ja, dat gebeurt nu al (zie tabel hierboven). Een eigen foto per behandeling kan altijd later.

**V: Ik heb een foto vervangen maar zie nog de oude.**
A: Foto's blijven 30 dagen in de browsercache. Verhoog de versie (`?v=2` → `?v=3`) in
`services.json`. Voor albumfoto's doet optie 3 van het publicatiemenu dit automatisch.

**V: Mag ik foto's van internet gebruiken?**
A: Alleen als je de benodigde gebruiksrechten hebt. Gebruik bij voorkeur foto's van je eigen werk.

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
    ├── cateye/
    ├── chrome/
    ├── customdesigns/
    ├── gellak/
    ├── biab/                     ← verborgen zolang er geen foto's in staan
    └── babyboom/                 ← verborgen zolang er geen foto's in staan
```

`images/gallery/biab.jpg`, `gellak.jpg`, `manicure.jpg`, `nailart.jpg`, `nailhealth.jpg`, `pedicure.jpg`
en `removal.jpg` zijn oude placeholders en worden niet gebruikt.
Ook de oude albummappen `rode-nagels`, `biab-nude`, `floral`, `ombre`, `glitter` en
`minimalistisch` worden niet meer ingelezen.

---

## 🚀 **Live zetten**

1. Foto's in de juiste map zetten
2. `.\tools\sync-website.ps1` starten in PowerShell 7, optie 3
3. Eerst controleren en lokaal bekijken via Live Server; daarna opnieuw optie 3 en publiceren
4. Na een geslaagde Cloudflare-deployment controleren op https://emmanagelstudio.vip ✨

---

**Veel succes! 💅✨**
