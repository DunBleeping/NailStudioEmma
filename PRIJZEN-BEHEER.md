# Prijzenlijst Beheren - Emma NailStudio

## 📋 Hoe Prijzen Aanpassen?

**De website leest alles uit één bestand:** `data/services.json`

Alle wijzigingen daar verschijnen AUTOMATISCH op:
- ✅ Behandelingen kaarten (incl. categoriemenu)
- ✅ Prijslijst tabel
- ✅ Mandjeknoppen **+ dit wil ik** in de behandelkaarten en de prijslijst (gedeelde keuze)
- ✅ Blok "Toeslagen"

**Geen HTML/CSS aanpassingen nodig!**

**Engelse versie:** prijzen worden in beide talen uit hetzelfde bestand gebruikt. Wijzig je ook
een naam, omschrijving, duur, categorie, notitie of toeslagtekst, voeg dan de Engelse vertaling
van die exacte Nederlandse tekst toe onder `en` in `data/translations.json`.
Dit geldt ook bij nieuwe behandelingen; controleer daarna de Engelse kaarten en het tweetalige
WhatsApp-bericht. Behandel-ID's en prijzen niet vertalen.

> **Bronlijst:** `data/Prijzenlijst.csv` is de actuele prijzenlijst van de salon (naam, prijs, duur).
> De website gebruikt de CSV niet zelf: pas bij een wijziging zowel de CSV als `services.json` aan
> (of vraag Copilot om `services.json` opnieuw uit de CSV op te bouwen).
>
> **Custom designs:** de prijstabel heeft een aparte optie "Custom designs (op aanvraag)" zonder vast bedrag
> of winkelmandknop. De klant kan via Contact een prijs aanvragen; prijs en duur worden vooraf met Emma besproken.
> Dit is een vaste regel in `js/script.js`, niet een behandeling in `services.json` of de CSV.
>
> **Live zetten:** opslaan → commit → push naar GitHub (`main`). Cloudflare Pages publiceert binnen ±1 minuut.

---

## 🔧 Prijzen Wijzigen

### Stap 1: Open bestand
```
Bestand: C:\MyDocs\DEVOPS\EmStudio\data\services.json
Gebruik: Kladblok, VS Code, of elke teksteneditor
```

### Stap 2: Vind behandeling
Zoek naar de naam van de behandeling, bijvoorbeeld:

```json
{
  "id": "new-set-witte-poeder",
  "name": "New Set Witte Poeder",
  "category": "Nagels - Poeder",
  "description": "Nieuwe set kunstnagels...",
  "price": 48,  ← WIJZIG HIER!
  "duration": "60 minuten",
  "image": "./images/services/witte-poeder.jpg",
  "note": "Oude lak/gellak eerst verwijderen? +€5"
}
```

### Stap 3: Wijzig prijs
Verander het getal (48 → uw prijs)

### Stap 4: Opslaan
Ctrl+S of File → Save

### Stap 5: Testen en live zetten
- Lokaal: refresh browser (Ctrl+F5)
- Live: commit + push; na ±1 minuut is de prijs bijgewerkt op emmanagelstudio.vip ✅

---

## 📊 Huidige Prijzenlijst

| Behandeling | Prijs | Duur |
|------------|-----------|------|
| Wenkbrauw Epileren met Touw | €13 | 15 min |
| Wenkbrauw Verven en Epileren met Touw | €25 | 30 min |
| Boven- en Onderlip Epileren met Touw | €10 | 15 min |
| New Set Nagels | €40 | 60 min |
| New Set Witte Poeder | €48 | 60 min |
| Opvullen Witte Poeder | €40 | 45 min |
| Opvullen Naturel Nagel | €35 | 45 min |
| Naturel Roze Poeder (Nieuwe Set) | €45 | 60 min |
| Naturel Opvullen Roze Poeder | €35 | 45 min |
| Shellac | €25 | 40 min |
| Manicure | €15 | 30 min |
| Pedicure | €35 | 45 min |
| Teennagels Nieuwe Set met Gellak | €50 | 45 min |
| Pedicure met Gellak | €50 | 60 min |
| Opvullen met Gellak | €40 | 40 min |
| Nieuwe Set 2 Kleuren (met Glitter) | €60 | 75 min |
| Nieuwe Set met Gellak Inclusief | €50 | 60 min |
| Nieuwe Set Roze Poeder en Witte Randje | €60 | 60 min |
| Alleen Verwijderen | €15 | 20 min |
| Babyboom Nieuwe Set | €55 | 60 min |
| Opvullen Babyboom | €50 | 45 min |
| Nieuwe Set op Eigen Nagel | €35 | 50 min |
| Toeslag: verwijderen oude lak/gellak bij een nieuwe set | +€5 | – |
| Nails Design vanaf... | €60 | 60+ min |
| BIAB Nieuwe Set | €45 | 60 min |
| Opvullen BIAB | €40 | 45 min |
| BIAB Nieuwe Set met Gellak Kleuren | €55 | 75 min |
| Opvullen BIAB met Gellak Kleuren | €50 | 60 min |

---

## ✏️ Behandeling Toevoegen

1. Open `data/services.json`
2. Vind het laatste item in `services` array
3. Kopieer dit blok en plak het erna:

```json
{
  "id": "unique-id-hier",
  "name": "Behandeling Naam",
  "category": "Categorie",
  "description": "Omschrijving",
  "price": 25,
  "duration": "45 minuten",
  "image": "./images/services/foto.jpg"
}
```

### Veld uitleg:
- **id**: Unieke identifier (geen spaties, kebab-case: `mijn-behandeling`)
- **name**: Weergegeven naam op website
- **category**: Groepering (bijv: "Nagels - Poeder")
- **description**: Korte omschrijving
- **price**: Prijs in EUR (getal zonder €)
- **duration**: Behandelingstijd
- **image**: Foto op de kaart, uit `images/services/` (zie FOTO-UPLOADEN.md). Het bestand moet bestaan!
- **note** *(optioneel)*: Extra regel op de kaart, bijv. `"Oude lak/gellak eerst verwijderen? +€5"`.
  Alle nieuwe sets hebben deze notitie.

**Let op:** Zet komma na vorig item! ✓

---

## ➕ Toeslagen (`extras`)

Onderaan `services.json` staat de lijst `extras`. Die verschijnt onder de prijstabel als
**"Toeslagen"** met een `+` voor de prijs:

```json
"extras": [
  {
    "id": "verwijderen-oude-lak",
    "name": "Verwijderen oude lak/gellak",
    "description": "Bij een nieuwe set moet aanwezige oude lak/gellak eerst worden verwijderd (+€5). Dit is verplicht als er nog lak op de nagels zit. Deze optie is standaard aangevinkt; vink alleen uit als verwijderen niet nodig is.",
    "defaultSelected": true,
    "price": 5
  }
]
```

Een nieuwe toeslag toevoegen = een blok in `extras` erbij zetten (komma niet vergeten).
`defaultSelected: true` vinkt de toeslag standaard aan bij een nieuwe set. Verwijderen is verplicht
als er oude lak/gellak aanwezig is; de klant mag uitvinken als verwijderen niet nodig is.
Een bewuste keuze blijft onthouden zolang er een nieuwe set in het mandje staat. Na het verwijderen
van alle nieuwe sets of leegmaken van het mandje wordt de standaardkeuze opnieuw toegepast.

---

## ❌ Behandeling Verwijderen

1. Open `data/services.json`
2. Vind behandeling
3. Verwijder het hele blok (inclusief komma's)

**Voorbeeld:**
```json
// VERWIJDER DEZE BLOK:
{
  "id": "shellac",
  "name": "Shellac",
  ...
}
```

---

## 🏷️ Categorie Aanpassen

Huidige categorieën (het categoriemenu wordt automatisch opgebouwd):
- Hands & Feet
- Nagels - BIAB
- Nagels - Design
- Nagels - Gellak
- Nagels - Overig
- Nagels - Poeder
- Wenkbrauwen

**Zelf maken:**
Wijzig `"category"` naar uw kategorie:

```json
"category": "Uw Nieuwe Categorie"
```

---

## 📝 JSON Format Regels

**BELANGRIJK - anders werkt het niet:**

✅ **Correct:**
```json
"price": 25,
"price": 28.50,
```

❌ **Fout:**
```json
"price": 25€,      // Nee, alleen getal!
"price": €25,      // Nee!
"price": "25",     // Nee, geen quotes!
```

✅ **Correct - komma's:**
```json
{
  "id": "item1",
  "name": "Naam",
  "price": 25,     ← komma na elke regel
  "duration": "30 min"  ← GEEN komma na laatste!
}
```

❌ **Fout:**
```json
{
  "id": "item1",
  "name": "Naam",
  "price": 25      ← KOMMA VERGETEN!
  "duration": "30 min"
}
```

**Validatie:** Gebruik https://jsonlint.com/ om fouten te checken

---

## 🧪 Testen

### Lokaal testen:
```bash
cd C:\MyDocs\DEVOPS\EmStudio
python -m http.server 8000
# Open http://localhost:8000
```

### Controleer:
1. ✓ Behandelingskaarten tonen juiste prijzen
2. ✓ Prijstabel tabel toon juiste prijzen
3. ✓ Geen console errors (F12)

### Als iets fout gaat:
1. Controleer JSON op https://jsonlint.com/
2. Check komma's en spaties
3. Zorg geen speciale tekens (€, %, etc.)
4. Ctrl+F5 om cache te vernieuwen

---

## 💡 Praktische Voorbeelden

### Voorbeeld 1: Prijs verlagen

**Van:** €38 → **Naar:** €35
```json
// VOOR:
"name": "New Set Witte Poeder",
"price": 38,

// NA:
"name": "New Set Witte Poeder",
"price": 35,
```

### Voorbeeld 2: Duur wijzigen

**Van:** 60 minuten → **Naar:** 75 minuten
```json
// VOOR:
"duration": "60 minuten",

// NA:
"duration": "75 minuten",
```

### Voorbeeld 3: Omschrijving updaten

```json
// VOOR:
"description": "Oude beschrijving",

// NA:
"description": "Nieuwe, betere beschrijving hier",
```

### Voorbeeld 4: Nieuwe behandeling toevoegen

```json
{
  "id": "brows-lamination",
  "name": "Wenkbrauw Lamineren",
  "category": "Wenkbrauwen",
  "description": "Permanente wenkbrauw wave behandeling",
  "price": 45,
  "duration": "45 minuten",
  "image": "./images/services/wenkbrauw-epileren.jpg"
}
```

---

## 🎯 Workflow Voorbeeld

**Scenario:** Wilt u "Shellac" verhoging van €17 naar €20

**Stap-voor-stap:**

1. **Open bestand**
   - `C:\MyDocs\DEVOPS\EmStudio\data\services.json`
   - Met Kladblok of VS Code

2. **Zoek Shellac**
   - Ctrl+F → Typ "Shellac"
   - Vind deze regel: `"price": 17,`

3. **Wijzig prijs**
   ```json
   // VOOR:
   "price": 17,

   // NA:
   "price": 20,
   ```

4. **Opslaan**
   - Ctrl+S

5. **Vernieuw website**
   - Browser refresh (Ctrl+F5)
   - Shellac is nu €20! ✅

---

## 🔐 Best Practices

✅ **Doen:**
- Maak backup van services.json voordat je grote wijzigingen doet
- Valideer JSON op jsonlint.com
- Test na elke wijziging
- Gebruik consistent formaat

❌ **Niet doen:**
- Niet handmatig HTML aanpassen (alles komt uit JSON!)
- Niet speciale tekens in JSON gebruiken
- Niet vergeten komma's
- Niet quotes om getallen zetten

---

## ❓ Veelgestelde Vragen

**V: Hoe voeg ik korting toe?**
A: Voeg behandeling toe met negatieve prijs:
```json
{
  "id": "discount-10",
  "name": "Winter Korting 10%",
  "category": "Specials",
  "description": "€10 korting op boekingen",
  "price": -10,
  "duration": "N/A"
}
```

**V: Werken decimale prijzen?**
A: Ja! `"price": 35.50` werkt perfect.

**V: Kan ik emoji gebruiken in beschrijving?**
A: Ja, maar gebruik escape karakter: `\"` voor quotes
```json
"description": "Nagels met glitter ✨ effect"  // Ok
"description": "Nagels met \"extra\" glitter"  // Ok
```

**V: Waarom werkt mijn wijziging niet?**
A: Waarschijnlijke oorzaken:
- JSON is ongeldig (jsonlint.com)
- Komma vergeten
- Quotes om getallen gezet
- Browser cache (Ctrl+F5)
- Server niet gestart (python -m http.server 8000)
- Nog niet gecommit/gepusht (live site verandert pas na een push)

**V: Kan ik nieuwe categorieën maken?**
A: Ja! Zet gewoon een naam in `"category"`:
```json
"category": "Mijn Nieuwe Categorie"
```

---

## 📞 Support

**Problemen?**
1. Check JSON op https://jsonlint.com/
2. Vergelijk met voorbeelden hierboven
3. Maak backup en probeer opnieuw
4. Refresh browser (Ctrl+F5)

**Meer info:**
- README.md - Volledige handleiding
- QUICK-REFERENCE.md - Snelle tips
- ACCESSIBILITY.md - Accessibility features

---

**Vragen? Raadpleeg README.md!** 📖
