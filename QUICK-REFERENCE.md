# Quick Reference - Emma NailStudio Website

**Live:** https://emmanagelstudio.vip · **GitHub:** DunBleeping/NailStudioEmma (`main`) · **Hosting:** Cloudflare Pages

Volledige uitleg: [README.md](README.md)

---

## 🔁 Werkwijze bij elke wijziging

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
| WhatsApp-nummer / bericht | `data/settings.json` → `contact.whatsapp` | `+31645715179`, geen spaties |
| Telefoon, adres, Maps | `data/settings.json` → `contact` | nu nog voorbeeldwaarden |
| Openingstijden | `data/settings.json` → `hours` | |
| Instagram / Facebook | `data/settings.json` → `social` | |
| Behandelingsfoto | `images/services/` + `"image"` in `services.json` | zie [FOTO-UPLOADEN.md](FOTO-UPLOADEN.md) |
| Impressie-tegel | `images/gallery/nails-N.jpg` | daarna `?v=` verhogen in `gallery.json` |
| Klantfoto's in album | `images/gallery/<album>/` | daarna `python tools/update_galerij.py` |
| Teksten hero / over ons | `index.html` | |
| Kleuren / opmaak | `css/style.css` (`:root`) | daarna `?v=` verhogen in `index.html` |
| Functionaliteit | `js/script.js` | daarna `?v=` verhogen in `index.html` |

---

## 🖼️ Klantfoto's toevoegen (Impressie-albums)

| Album | Map |
|---|---|
| Klassieke Rode Nagels | `images/gallery/rode-nagels/` |
| BIAB Nude | `images/gallery/biab-nude/` |
| Floral Nail Art | `images/gallery/floral/` |
| Ombre Effect | `images/gallery/ombre/` |
| Glitter Glamour | `images/gallery/glitter/` |
| Minimalistisch Design | `images/gallery/minimalistisch/` |

1. Foto's erin als `<map>-01.jpg`, `<map>-02.jpg`, ... (kleine letters, geen spaties, < 500 KB)
2. Optioneel onderschriften in `descript.ion` in die map: `rode-nagels-01.jpg Klassiek rood op BIAB`
3. `python tools/update_galerij.py`
4. Commit + push

---

## 🎛️ Standaardgedrag van de site

- Nieuwe bezoekers: **foto's verborgen** (knop 🖼️ zet ze aan, keuze wordt onthouden)
- Taalkeuze **Nederlands / English** in de header; keuze wordt onthouden.
  Vertalingen bijhouden in `data/translations.json` (exacte Nederlandse tekst → Engelse vertaling).
- **Afspraak maken** en alle WhatsApp-knoppen → WhatsApp +31 6 4571 5179 met voorbereid bericht
- Knoppen rechtsboven: 👁️ grijswaarden · A– A A+ A++ lettergrootte · 🖼️ foto's
- Zoekbalk onder "Categorieën"; *+ dit wil ik* onderaan elke behandelkaart → 🛒 Mandje → WhatsApp-bericht met
  behandelingen, toeslag en totaal, **altijd eerst Engels en daarna Nederlands**

---

## 🗄️ Cache & versienummers

| Gewijzigd | Actie |
|---|---|
| `data/*.json` (prijzen, teksten) | niets – direct zichtbaar |
| `css/style.css` of `js/script.js` | `?v=N` +1 op beide regels in `index.html` (nu `?v=8`) |
| Foto vervangen met dezelfde naam | `?v=N` +1 achter het pad in de JSON |
| Albumfoto's | gaat automatisch via `tools/update_galerij.py` |

Verwijs nooit naar een foto die nog niet bestaat (Cloudflare cachet dan 30 dagen een kapotte foto).

---

## ❓ Troubleshooting

| Probleem | Oplossing |
|---|---|
| Wijziging niet live | Gepusht? 1 min wachten, Ctrl+F5, `?v=` verhoogd bij CSS/JS? |
| Foto laadt niet | Bestandsnaam exact gelijk (kleine letters!), bestand gecommit? |
| Oude foto blijft staan | `?v=` verhogen in de JSON |
| Prijzen/behandelingen leeg | JSON-fout → https://jsonlint.com of F12 → Console |
| WhatsApp werkt niet | Nummer met `+31`, zonder spaties |
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
- 6 Impressie-stijlen met elk een album
- 10 behandelingsfoto's
