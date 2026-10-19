# Quick Reference Guide - Emma NailStudio Website

## ⚠️ BELANGRIJK: GEEN INSTALLATIE NODIG!

Deze website is **100% statisch**. Er hoeft niets op uw computer geïnstalleerd te worden.

**Hoe wordt het gehoost?**
- Cloudflare Pages (gratis) - GEEN installatie
- Strato.nl - GEEN installatie
- Google - GEEN installatie
- Alle hosts hosten deze bestanden gewoon van de schijf!

---

## 🚀 Quick Start

### Lokaal Testen (OPTIONEEL - voor development)
```bash
cd C:\MyDocs\DEVOPS\EmStudio
python -m http.server 8000
# Open: http://localhost:8000
```

**MAAR:** Dit is ALLEEN voor testen terwijl u aanpassingen maakt.
Voor normaal hosten (Cloudflare/Strato/Google) is GEEN HTTP server nodig!

### Configuratie Wijzigen
- `data/settings.json` → Salon info, contact, WhatsApp, social media
- `data/services.json` → Behandelingen & prijzen  
- `data/gallery.json` → Galerij foto's

💡 **Alle wijzigingen verschijnen automatisch op de website!**

---

## 📝 Veelgestelde Wijzigingen

### 1. WhatsApp Nummer Updaten
**Bestand:** `data/settings.json`
```json
"whatsapp": {
  "number": "+31612345678",  // ← WIJZIG HIER
  "message": "Hallo Emma..."
}
```

### 2. Openingstijden Wijzigen
**Bestand:** `data/settings.json`
```json
"hours": {
  "monday": "10:00 - 18:00",  // ← WIJZIG HIER
  "tuesday": "10:00 - 18:00",
  // ... etc
}
```

### 3. Prijs Wijzigen
**Bestand:** `data/services.json`
```json
{
  "name": "Gellak",
  "price": 35,  // ← WIJZIG HIER (in EUR)
  "duration": "45 minuten"
}
```

### 4. Behandeling Toevoegen
**Bestand:** `data/services.json`
```json
{
  "id": "unique-id",
  "name": "Behandeling Naam",
  "category": "Nagels",
  "description": "Beschrijving",
  "price": 50,
  "duration": "60 minuten",
  "image": "./images/gallery/naam.jpg"
}
```

### 5. Foto's Toevoegen Galerij
**Bestand:** `data/gallery.json`
```json
{
  "id": "gallery-7",
  "title": "Foto Titel",
  "description": "Beschrijving",
  "src": "./images/gallery/jouw-foto.jpg",  // ← WIJZIG HIER
  "alt": "Beschrijvende alt-tekst",
  "category": "gellak"
}
```

---

## 📂 Bestanden Overzicht

| Bestand | Doel | Wijzig Wanneer |
|---------|------|---|
| `index.html` | Website pagina | Inhoud/layout wijzigen |
| `css/style.css` | Styling/kleuren | Design wijzigen |
| `js/script.js` | Functionaliteit | Gedrag wijzigen |
| `data/settings.json` | Salon info | Contact/info wijzigen |
| `data/services.json` | Behandelingen | Prijzen/services wijzigen |
| `data/gallery.json` | Galerij items | Foto's wijzigen |
| `images/gallery/` | Foto's | Afbeeldingen vervangen |

---

## 🎯 Deployment Stappen (LATER!)

### 1. GitHub Push (als u klaar bent)
```bash
cd C:\MyDocs\DEVOPS\EmStudio
git init
git add .
git commit -m "Emma NailStudio website"
git remote add origin https://github.com/username/emma-nailstudio
git push -u origin main
```

### 2. Cloudflare Pages (als u klaar bent)
1. Login op https://dash.cloudflare.com/
2. Pages → Create a project
3. Connect uw GitHub repository
4. Build command: (leeg)
5. Output directory: /
6. Deploy!

**Website URL:** https://emma-nailstudio.pages.dev

### 3. Custom Domain (optioneel)
Update DNS nameservers naar Cloudflare
Add custom domain in Cloudflare: `nailsalonemma.nl`

---

## ❓ Troubleshooting

### "Foto's laden niet"
- Check pad in JSON (bijv: `./images/gallery/foto.jpg`)
- Zorg dat bestand bestaat in `images/gallery/`
- Controleer bestandsnaam (case-sensitive op Linux/Cloudflare!)

### "WhatsApp link werkt niet"
- Zorg nummer begint met `+` en landcode (bijv: +31)
- Verwijder spaties/hyphens: `+31612345678` ✓ / `+31 6 12345678` ✗
- Test link: `https://wa.me/31612345678?text=Hallo`

### "Server start niet"
```bash
# Controleer Python
python --version

# Als fout, probeer:
py -3 -m http.server 8000

# Of use Node:
npx http-server -p 8000
```

### "JSON validatiefouten"
- Controleer JSON op https://jsonlint.com/
- Zorg geen komma's missen/overtollig
- Quotes moeten zijn: `"string"` (niet `'string'`)

---

## 🔍 Testen Checklist

Voor elke wijziging:
- [ ] Wijziging in JSON/HTML gedaan
- [ ] Server draait (`python -m http.server 8000`)
- [ ] Browser vernieuwt (Ctrl+F5)
- [ ] Wijziging zichtbaar
- [ ] Geen console errors (F12)
- [ ] Werkt op mobiel (DevTools)

---

## 📊 Website Kenmerken

✅ **Sectie Overzicht:**
1. Header & Navigation
2. Hero (intro)
3. Services (7 behandelingen)
4. Pricing (prijstabel)
5. Gallery (6 foto's)
6. About (salon info)
7. Contact (uren, maps, WhatsApp)
8. Footer

✅ **Functies:**
- Mobile menu ☰
- Gallery modal viewer
- WhatsApp buttons
- Keyboard navigation
- Responsive design
- SEO optimized

---

## 💾 Backup Maken

```bash
# Maak backup van project
xcopy C:\MyDocs\DEVOPS\EmStudio C:\Backups\EmStudio-backup /E /I /Y

# Of via Git
git clone https://github.com/username/emma-nailstudio backup-folder
```

---

## 🎨 Kleurencodes (Kan wijzigen)

In `data/settings.json`:
```json
"colors": {
  "primary": "#d4a574",      // Goud
  "secondary": "#f5f0eb",    // Crème
  "accent": "#8b7355",       // Bruin
  "text": "#333333",         // Donkergrijs
  "lightText": "#666666"     // Grijs
}
```

In `css/style.css`:
```css
:root {
  --primary: #d4a574;        /* Pas hier aan */
  --secondary: #f5f0eb;
  /* ... etc */
}
```

---

## 📱 Mobile Testing

**In browser DevTools (F12):**
1. Klik Device Toolbar icon (📱)
2. Select "iPhone 12" or "Samsung Galaxy"
3. Controleer layout
4. Test buttons en menu

**Op echte telefoon:**
1. Zorg server draait
2. Vind je IP: `ipconfig`
3. Bezoek: `http://YOUR-IP:8000`

---

## 🔒 Security Checklist

- ✅ Geen wachtwoorden in code
- ✅ Geen API-keys zichtbaar
- ✅ Geen privé telefoonnummers (fictief of bedrijf)
- ✅ Geen Google Analytics zonder toestemming
- ✅ Geen cookies zonder banner

---

## 📞 Ondersteuning

**Problemen?**
1. Lees README.md (gedetailleerd!)
2. Check TEST-RAPPORT.txt
3. Valideer JSON op jsonlint.com
4. Check browser console (F12)
5. Probeer ander browser

---

**Vragen? Raadpleeg README.md voor volledige documentatie!**

Veel succes! 🎉
