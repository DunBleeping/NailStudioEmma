# Setting up Emma NailStudio on a new computer

Handover guide to continue this project on a freshly installed Windows PC with VS Code and
GitHub Copilot. No GitKraken needed – everything works with standard Git (and optionally
GitHub Desktop).

---

## 1. Project at a glance

| Item | Value |
|---|---|
| What | Static website (HTML/CSS/JS + JSON data) for nail salon **Emma NailStudio** |
| GitHub repo | https://github.com/DunBleeping/NailStudioEmma (branch `main`) |
| Hosting | Cloudflare Pages – auto-deploys every push to `main` (≈ 1 minute) |
| Live site | https://emmanagelstudio.vip (also https://nailstudioemma.pages.dev) |
| Backend / build step | No build or npm dependencies. A Pages Function verifies Turnstile for contact access; Live Server cannot run it |
| Booking | WhatsApp/SMS via CONTACT_PHONE server secret after Turnstile; no e-mail or online agenda |
| Language of site & docs | Dutch |

Main features (status at commit `964311d`):
- Treatments and prices from `data/services.json` (27 treatments, 7 categories, €5 surcharge for removing old polish).
- Search bar plus category filter.
- Treatment cart that fills in a WhatsApp booking request.
- "Impressie" gallery with photo albums per style.
- Accessibility buttons: grayscale, font size A– A A+ A++, show/hide photos. Photos are hidden by default for new visitors.

More detail: [README.md](README.md), [QUICK-REFERENCE.md](QUICK-REFERENCE.md),
[MANIFEST.md](MANIFEST.md), [PRIJZEN-BEHEER.md](PRIJZEN-BEHEER.md),
[FOTO-UPLOADEN.md](FOTO-UPLOADEN.md), [ACCESSIBILITY.md](ACCESSIBILITY.md).

### Domein, hosting en accounts (bevestigd op 21 oktober 2026)

Accountnamen zijn hieronder bewust gemaskeerd. Bewaar volledige aanmeldgegevens en
herstelcodes alleen in de eigen wachtwoordmanager, niet in deze repository.

| Onderdeel | Website / route | Account en werkwijze |
|---|---|---|
| Domeinregistratie `emmanagelstudio.vip` | https://dash.cloudflare.com → Domains → Registrations | Volgens bevestiging van de eigenaar gekocht bij Cloudflare. Controleer hier de registratie, verlengdatum, automatische verlenging en betaalmethode. De registratie-accountkoppeling is nog niet afzonderlijk gecontroleerd. |
| Extra domein `emmanailsalon.nl` | https://www.strato.nl → Klantenlogin | Volgens de eigenaar geregistreerd bij STRATO. Beheeraccount en huidige DNS-/doorstuurinstellingen nog niet vastgelegd of gecontroleerd. |
| Live hosting | https://dash.cloudflare.com → **Compute → Workers & Pages → nailstudioemma** | Account **`ogdd....g@gm`**, aanmelden met identity provider **GitHub**. Alleen e-mail/wachtwoord of Google kiezen is niet dezelfde aanmeldroute. |
| Websitecode | https://github.com/DunBleeping/NailStudioEmma | GitHub-gebruiker **DunBleeping**, productietak `main`. Cloudflare publiceert na een push. |
| Actieve Turnstile-widget | Cloudflare, in hetzelfde account als de hosting → Turnstile | De nieuwe widget in **`ogdd....g@gm`** wordt door de website gebruikt. Modus Managed; productiehost `emmanagelstudio.vip`. |
| Eerdere Turnstile-widget | Cloudflare → Turnstile | In **`emm....8@gm`** is eerder een widget gemaakt. Dit is niet de widget van de huidige integratie; niet de bijbehorende sleutels overnemen. |

**Hostingproject openen:** https://dash.cloudflare.com/?to=/643ca8b53defdd1dcbed9d10415b2549/pages/view/nailstudioemma

**Domeinkeuze en nuttig gebruik van de .nl-variant:**
- De eigenaar geeft de voorkeur aan **EmmaNagelStudio.vip**; dit blijft het hoofddomein.
  Hoofdletters in domeinnamen maken technisch geen verschil.
- **EmmaNailSalon.nl** is een extra domein bij STRATO. Voorgesteld, nog niet ingesteld:
  een permanente **301-doorverwijzing** naar `https://emmanagelstudio.vip`.
  Geen tweede kopie van de website maken en geen frame-/maskeringsdoorsturing gebruiken.
- Dit biedt een extra ingang voor bezoekers die een .nl-adres verwachten en beschermt de extra naam.
  Het bezit van een extra domein geeft op zichzelf geen hogere Google-positie.
  Gebruik in Google-profielen, sociale profielen en gewone advertenties bij voorkeur consequent het hoofddomein.
- Bij latere uitvoering eerst de mogelijkheden van STRATO controleren: HTTP en HTTPS,
  zowel met als zonder `www`, geldig certificaat op de .nl-variant, behoud van pad en queryparameters
  en geen redirectlus. Ook het oude domein heeft HTTPS nodig voordat een HTTPS-doorverwijzing werkt.
- Als STRATO dit niet passend ondersteunt, kan doorsturen via Cloudflare worden onderzocht.
  Daarvoor eerst toestemming en DNS-/mailinstellingen controleren; een domeinverhuizing is niet automatisch nodig.
- Voor deze extra ingang is geen Turnstile-widget op .nl nodig zolang alles eerst naar het hoofddomein
  wordt doorgestuurd. Eventuele zakelijke e-mail via .nl is een aparte toekomstige keuze,
  geen nieuw boekingskanaal; controleer dan mailhosting, SPF, DKIM en DMARC.
- Deze notitie wijzigt geen DNS, nameservers, hosting, mail of doorsturing.

**Status:** de eigenaar heeft op 21 oktober 2026 bevestigd dat de nieuwste website live is
en de echte Turnstile-controle werkt. In het hostingproject staan de secrets
`TURNSTILE_SECRET_KEY` en `CONTACT_PHONE`, beide van type **Secret** (Value encrypted).
De waarden horen nooit in code, screenshots of chat. De openbare site key staat in
`requestContactAccess()` in `js/script.js`.

**Secrets beheren, stap voor stap:**
1. Meld aan bij Cloudflare via **GitHub**, onder **`ogdd....g@gm`**.
2. Open **Compute → Workers & Pages → nailstudioemma → Settings → Variables and secrets**.
3. Controleer de omgeving als die op de pagina wordt getoond; er hoeft geen pop-up te verschijnen.
4. Wijzig de waarde van de bestaande secret, of kies **Add → Secret** als deze ontbreekt.
   `TURNSTILE_SECRET_KEY` hoort bij de actieve widget; `CONTACT_PHONE` is internationaal met +, zonder spaties.
5. Sla op en publiceer opnieuw. Test vervolgens op het echte domein, niet alleen via Live Server.

**Belangrijk onderscheid:** Turnstile, Pages-hosting en domeinregistratie hebben aparte
overzichten. Een lege lijst bij Domains → Registrations bewijst niet dat er geen Pages-project is.
Een zichtbare Turnstile-widget bewijst evenmin dat de hosting in dat account staat.
Bij "No projects found": controleer eerst loginmethode en account; maak niet zomaar een
nieuwe applicatie aan en verander geen nameservers of domeintransfers.

**Vertraging bij publiceren:** op 21 oktober 2026 vertraagde een GitHub-storing de
push-webhooks naar Cloudflare. De code stond al op GitHub, terwijl Pages nog de oude versie
serveerde. Controleer **Deployments**, de commit en https://www.githubstatus.com / https://www.cloudflarestatus.com
voordat je instellingen verandert of opnieuw probeert te publiceren.

---

## 2. Install the tools

Open **PowerShell** (normal user is fine, winget asks for admin when needed):

```powershell
# Git for Windows (includes Git Credential Manager for GitHub login)
winget install --id Git.Git -e --source winget

# Python (optional local test server; album updates use PowerShell 7)
winget install --id Python.Python.3.12 -e --source winget

# Optional: GitHub Desktop, a simple graphical alternative to GitKraken
winget install --id GitHub.GitHubDesktop -e --source winget
```

Close and reopen PowerShell / VS Code afterwards, then check:

```powershell
git --version      # 2.4x or newer
python --version   # 3.12.x
```

Recommended VS Code extensions: **GitHub Copilot**, **GitHub Copilot Chat**,
**GitHub Pull Requests** (optional), **Live Server** (optional).

---

## 3. Configure Git (once per computer)

```powershell
git config --global user.name  "Your Name"
git config --global user.email "your-email@example.com"   # same e-mail as your GitHub account
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global credential.helper manager
```

> On the old computer, commits were made as `Dung@OGD <dung.nguyen@ogd.nl>`. Use the same
> values if you want consistent history.

---

## 4. Get the code (clone)

```powershell
New-Item -ItemType Directory -Force C:\MyDocs\DEVOPS | Out-Null
cd C:\MyDocs\DEVOPS
git clone https://github.com/DunBleeping/NailStudioEmma.git EmStudio
cd EmStudio
code .
```

The first time Git talks to GitHub, a **browser window opens to sign in** (Git Credential
Manager). Sign in with the GitHub account that owns `DunBleeping/NailStudioEmma`. The login
is stored in Windows Credential Manager – you won't be asked again.

Alternative without the terminal: in VS Code press `Ctrl+Shift+P` → **Git: Clone** → paste the
repo URL, or in GitHub Desktop → *File → Clone repository*.

---

## 5. Daily workflow

```powershell
cd C:\MyDocs\DEVOPS\EmStudio
git pull                       # always first: get the latest version

# ... make changes ...

git status                     # what changed?
git add -A
git commit -m "Short description of the change"
git push                       # Cloudflare deploys automatically (~1 min)
```

In VS Code you can do the same in the **Source Control** panel (`Ctrl+Shift+G`):
write a message → **Commit** → **Sync Changes**.

> Working on both computers? Always `git pull` before you start and `git push` when you're
> done, so the two never drift apart.

---

## 6. Test locally before pushing

Zonder Python: installeer **Live Server** van Ritwick Dey in VS Code, open `index.html`
en kies **Go Live** of **Open with Live Server**. Gebruik het getoonde adres, meestal
http://127.0.0.1:5500. Laat VS Code en de server open; opslaan vernieuwt de pagina.
Dit test de statische website, niet de Pages Function of echte contactvrijgave.

```powershell
cd C:\MyDocs\DEVOPS\EmStudio
python -m http.server 8765
```

Open http://127.0.0.1:8765 in the browser (stop with `Ctrl+C`). Opening `index.html` directly
by double-clicking does **not** work, because the JSON files are loaded with `fetch`.
(`python start-server.py` also works, on port 8000.)

Tip: in the browser, F12 → *Application* → *Local Storage* → clear, to see the site as a new
visitor.

---

## 7. Important rules (things that broke before)

1. **Changed `css/style.css` or `js/script.js`?** Raise the version number `?v=N` on **both**
   lines in `index.html` (currently `?v=28` → next is `?v=29`). Otherwise visitors may keep the
   old version for hours.
2. **File names are case-sensitive on Cloudflare.** `Logo.JPG` ≠ `logo.jpg`. Use lowercase,
   no spaces.
3. **Never commit empty or placeholder image files.** Cloudflare serves the homepage
   (status 200) for a missing file and caches that for 30 days.
4. **Replaced a treatment photo with the same name?** Raise `?v=N` behind that photo in the JSON.
   Album photo versions are generated automatically.
5. **Prices/treatments** → edit `data/services.json` (see [PRIJZEN-BEHEER.md](PRIJZEN-BEHEER.md)).
   `data/Prijzenlijst.csv` is the salon's source list, not read by the site.
6. **Album photos** → put them in `images/gallery/<album>/`
   (`cateye`, `chrome`, `customdesigns`, `gellak`, `biab`, `babyboom`), then run
   `.\tools\sync-website.ps1` in PowerShell 7 and choose **3**.
   This updates the list, cover and cache versions automatically, including removals.
   Empty albums are hidden; changed album files are published together.
   For a local preview only, run `.\tools\update-galerij.ps1` and refresh Live Server
   (see [FOTO-UPLOADEN.md](FOTO-UPLOADEN.md)). Python is not needed for albums.
7. Line-ending warnings (`LF will be replaced by CRLF`) are harmless.

---

## 8. Open items (not done yet)

- `data/settings.json`: e-mail is still a placeholder. Phone is configured; address and Maps link
  are intentionally not published. The address is shared privately after appointment confirmation.
- SEO-domeinverwijzingen in `index.html`, `sitemap.xml`, `robots.txt` en `settings.json`
  zijn op 28 oktober 2026 bijgewerkt naar `emmanagelstudio.vip`; het werkgebied is Purmerend.
- Social media links are generic (instagram.com / facebook.com).
- BIAB and Babyboom albums remain hidden until photos are added and published.
- `TEST-RAPPORT.txt` is outdated.

### Volgende fase: vindbaarheid en sociale kanalen

Nog niet uitgevoerd; eerst profielen en inhoud controleren, daarna pas betaald adverteren.

1. **SEO voorbereiden (uitgevoerd):** canonical, Open Graph, Schema.org, sitemap en robots
   gebruiken het echte domein; privéadres en telefoonnummer blijven afgeschermd.
   De Google Search-knop is van de site verwijderd; zo'n knop is geen registratie bij Google en geen advertentie.
2. **Google Search Console:** https://search.google.com/search-console →
   website-eigendom verifiëren, de bijgewerkte sitemap indienen en indexering controleren.
   Noteer later alleen een gemaskeerde beheeraccountnaam.
3. **Google Business Profile:** https://business.google.com →
   controleren of al een profiel bestaat, dan claimen/inrichten volgens Google's voorwaarden.
   Het adres moet privé blijven; kies niet zomaar een servicegebiedprofiel als klanten uitsluitend
   naar de salon komen. Controleer eerst welke profielvorm hiervoor is toegestaan.
   Google kan verificatiegegevens vragen; adrespublicatie niet zonder expliciet besluit wijzigen.
4. **Instagram en Facebook:** officiële profiel-/pagina-URL's verzamelen, beheer en
   tweestapsverificatie controleren. Daarna `social.instagram` en `social.facebook`
   in `data/settings.json` bijwerken en hero/footer op mobiel en desktop testen.
   Instagram is nu uitgeschakeld zonder URL; Facebook verwijst voorlopig naar de eigen website.
5. **WhatsApp Business:** bedrijfsprofiel, openingstijden, begroeting en eventuele catalogus
   controleren. `social.whatsappBusiness` blijft een boolean; geen openbare `wa.me`-nummerlink
   toevoegen die de Turnstile-toegang op de website omzeilt.
   Een nummer dat op externe bedrijfsprofielen wordt gepubliceerd is daar wel openbaar.
6. **Google Ads:** https://ads.google.com → pas na bovenstaande controles een campagne
   voorbereiden. Voor activeren eerst expliciet budget, doelgroep/regio, looptijd,
   bestemmingspagina en eventuele metingen/privacytoestemming afspreken.
   Geen betaalde campagne automatisch starten.

---

## 9. Continuing with Copilot

The file [.github/copilot-instructions.md](.github/copilot-instructions.md) is loaded
automatically by GitHub Copilot Chat in VS Code, so Copilot already knows the project,
the workflow and the pitfalls above. Just open the folder and ask, for example:

> "Read SETUP-NEW-COMPUTER.md and README.md, then help me replace the placeholder contact
> details in settings.json."
