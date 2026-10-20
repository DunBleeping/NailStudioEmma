# 📸 Foto's Uploaden - Emma NailStudio

## 📁 **Waar moeten de foto's heen?**

```
C:\MyDocs\DEVOPS\EmStudio\images\services\
```

**Alle 23 behandelingen hebben hun eigen foto-bestand nodig:**

## 📋 **Benodigde Foto's - Bestandsnamen Exact!**

Copy-paste deze bestandsnamen en voeg de foto's toe:

### 👁️ **Wenkbrauwen (3 foto's)**
```
wenkbrauw-epileren.jpg
wenkbrauw-verven.jpg
lip-epileren.jpg
```

### 💅 **Nagels - Poeder (7 foto's)**
```
new-set-nagels.jpg
witte-poeder.jpg
opvullen-witte-poeder.jpg          (kan zelfde zijn als witte-poeder.jpg)
naturel-roze-poeder-new.jpg
naturel-opvullen-roze-poeder.jpg   (kan zelfde zijn als naturel-roze-poeder-new.jpg)
new-set-roze-witte-randje.jpg
new-set-op-eigen-nagel.jpg
```

**Opmerking:** "Opvullen" foto's kunnen dezelfde zijn als "New Set" - het zijn dezelfde nagels!

### 💅 **Nagels - Gellak (3 foto's)**
```
shellac.jpg
opvullen-gellak.jpg                (kan zelfde zijn als shellac.jpg)
nails-design-vanaf.jpg             (design voorbeeld)
```

### 🖐️ **Hands & Feet (3 foto's)**
```
manicure.jpg
pedicure.jpg
teennagels.jpg
```

### ✨ **Nagels - Design (2 foto's)**
```
design-nagel-glitter.jpg           (design met glitter)
opvullen-2-kleuren-glitter.jpg     (kan zelfde zijn)
```

### 🗑️ **Nagels - Verwijdering (2 foto's)**
```
alleen-verwijderen.jpg             (kan zelfde foto zijn)
verwijderen-inclusief-verzorging.jpg
```

### 🎨 **Speciale Sets (3 foto's)**
```
babyboom-new-set.jpg
opvullen-babyboom.jpg              (kan zelfde zijn als babyboom-new-set.jpg)
```

---

## 🖼️ **Foto Specificaties**

**Formaat:** JPG (JPEG)
**Bestandsnaam:** EXACT zoals hierboven!
**Resolutie:** 
  - Minimaal: 300x300px
  - Aanbevolen: 600x400px of 800x600px
  - Niet groter dan 500KB per foto

**Tips voor mooie foto's:**
- Professionele foto's van je eigen nagelwerk
- Schone achtergrond (wit, crème, neutrale toon)
- Goed verlicht
- Scherpgesteld op de nagels/behandeling
- Dezelfde stijl/kleur tone voor alle foto's

---

## 📤 **Hoe foto's uploaden?**

### **Manier 1: Drag & Drop in File Explorer**
1. Open: `C:\MyDocs\DEVOPS\EmStudio\images\services\`
2. Sleep je JPG-bestanden daarin
3. Refresh browser (Ctrl+F5)

### **Manier 2: Windows Verkenner**
1. Open: `C:\MyDocs\DEVOPS\EmStudio\images\services\`
2. Rechtsklik → Plak (`Ctrl+V`)
3. Refresh browser (Ctrl+F5)

### **Manier 3: VS Code**
1. Open "Explorer" in VS Code
2. Navigeer naar `images/services/`
3. Sleep foto's naar deze folder
4. Refresh browser (Ctrl+F5)

---

## ✅ **Verificatie Checklist**

Na het uploaden van foto's:

- [ ] Alle 23 JPG-bestanden in `images/services/` folder
- [ ] Bestandsnamen EXACT gelijk aan de lijst hierboven
- [ ] Alle bestanden zijn .jpg (lowercase!)
- [ ] Geen spaties of rare karakters in bestandsnamen
- [ ] Browser geopend op `http://localhost:8000`
- [ ] Ctrl+F5 refresh gedaan
- [ ] Alle foto's zichtbaar op website ✓

---

## 🧪 **Testen**

**Browser:** http://localhost:8000

**Controleer:**
1. Homepage laadt
2. Behandelingen tonen JPG foto's (geen rode X-iconen)
3. Alle prijzen zichtbaar
4. Foto's hebben goede kwaliteit
5. Responsive op mobiel (F12)

---

## 🖼️ **Impressie: albums met klantfoto's**

Elke tegel onder **Impressie** is een album:
- De tegel toont één **voorbeeldfoto** (`src` in `data/gallery.json`).
- Klikt een bezoeker op de tegel, dan opent het album met de **echte resultaten** van klanten (`photos`).
- Zolang een album nog leeg is (`"photos": []`), ziet de bezoeker alleen de voorbeeldfoto met de tekst
  *"Voorbeeldfoto - echte resultaten van onze klanten volgen binnenkort."*

### Klantfoto's toevoegen (voorbeeld: Floral Nail Art)

1. Maak een map per album en zet de foto's erin, bijvoorbeeld:
   ```
   images/gallery/floral/floral-01.jpg
   images/gallery/floral/floral-02.jpg
   ```
   Gebruik kleine letters, geen spaties, `.jpg`, liefst max. 1200px breed en < 300 KB.
2. Zet de foto's in `data/gallery.json` bij het juiste album onder `photos`:
   ```json
   {
     "id": "gallery-3",
     "title": "Floral Nail Art",
     "src": "./images/gallery/nails-3.jpg?v=2",
     ...
     "photos": [
       { "src": "./images/gallery/floral/floral-01.jpg", "caption": "Bloemetjes op nude BIAB" },
       { "src": "./images/gallery/floral/floral-02.jpg", "caption": "Lentebloemen op gellak" }
     ]
   }
   ```
   `caption` (onderschrift) en `alt` (omschrijving voor schermlezers) zijn optioneel.
3. Commit en push; Cloudflare zet het binnen een minuut live.

**Tips:**
- Wil je een eigen foto als voorbeeld op de tegel? Vervang `nails-N.jpg` en verhoog `?v=2` naar `?v=3` in `gallery.json`.
- Vraag klanten toestemming voordat je een foto van hun handen/nagels online zet (AVG).
- Nieuwe stijl toevoegen? Kopieer een blok in `gallery.json`, geef een uniek `id` en eigen titel/foto's.

---

## 💡 **Vragen?**

**Q: Kan ik dezelfde foto voor meerdere behandelingen gebruiken?**
A: Ja! Bijvoorbeeld:
  - "Opvullen Witte Poeder" kan dezelfde foto zijn als "New Set Witte Poeder"
  - "Shellac" en "Opvullen Gellak" kunnen dezelfde foto zijn
  - Dit bespaart je foto's hoeven te nemen!

**Q: Hoe veel foto's MINIMAAL?**
A: Technisch 10 unieke foto's (per categorie 1-2), maar 23 unieke foto's ziet er professioneler uit.

**Q: Kan ik foto's later wijzigen?**
A: Ja! Gewoon nieuwe JPG overschrijven, browser refresh (Ctrl+F5), klaar.

**Q: Welk formaat is het beste?**
A: JPG is perfect. PNG ook oké maar wat groter.

---

## 📁 **Map structuur ná upload:**

```
C:\MyDocs\DEVOPS\EmStudio\
└── images/
    ├── services/                    ← HIER STAAN DE FOTO'S
    │   ├── wenkbrauw-epileren.jpg
    │   ├── wenkbrauw-verven.jpg
    │   ├── lip-epileren.jpg
    │   ├── new-set-nagels.jpg
    │   ├── witte-poeder.jpg
    │   ├── ... (alle andere)
    │   └── teennagels.jpg
    └── gallery/                     ← Gallery foto's (scheiden!)
        ├── biab.jpg
        ├── gellak.jpg
        └── ... (andere gallery foto's)
```

---

## 🚀 **Next Steps**

1. **Verzamel je mooiste nagel-foto's** 📸
2. **Rename ze exact naar de bestandsnamen bovenaan** ✏️
3. **Sleep ze naar `images/services/`** 🖱️
4. **Refresh browser (Ctrl+F5)** 🔄
5. **Geniet van je mooie website!** ✨

---

**Veel succes! 💅✨**
