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
| Backend / build step | None. No Node, no npm. Python is only used for a local test server and a helper script |
| Booking | Everything goes via WhatsApp +31 6 4571 5179 (no e-mail, no online agenda) |
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

---

## 2. Install the tools

Open **PowerShell** (normal user is fine, winget asks for admin when needed):

```powershell
# Git for Windows (includes Git Credential Manager for GitHub login)
winget install --id Git.Git -e --source winget

# Python (local test server + tools/update_galerij.py)
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
   lines in `index.html` (currently `?v=7` → next is `?v=8`). Otherwise visitors may keep the
   old version for hours.
2. **File names are case-sensitive on Cloudflare.** `Logo.JPG` ≠ `logo.jpg`. Use lowercase,
   no spaces.
3. **Never commit empty or placeholder image files.** Cloudflare serves the homepage
   (status 200) for a missing file and caches that for 30 days.
4. **Replaced a photo with the same name?** Raise `?v=N` behind that photo in the JSON.
5. **Prices/treatments** → edit `data/services.json` (see [PRIJZEN-BEHEER.md](PRIJZEN-BEHEER.md)).
   `data/Prijzenlijst.csv` is the salon's source list, not read by the site.
6. **Customer photos for albums** → put them in `images/gallery/<album>/` as
   `<album>-01.jpg`, `-02.jpg` … then run `python tools/update_galerij.py`
   (see [FOTO-UPLOADEN.md](FOTO-UPLOADEN.md)).
7. Line-ending warnings (`LF will be replaced by CRLF`) are harmless.

---

## 8. Open items (not done yet)

- `data/settings.json`: phone, e-mail, address and Google Maps link are still **placeholders**.
- `index.html` (Schema.org, `og:url`, `canonical`), `sitemap.xml` and `robots.txt` still point
  to `nailsalonemma.nl` instead of `emmanagelstudio.vip`.
- Social media links are generic (instagram.com / facebook.com).
- Impressie albums are still empty (tiles use free Pexels stock photos).
- `TEST-RAPPORT.txt` is outdated.

---

## 9. Continuing with Copilot

The file [.github/copilot-instructions.md](.github/copilot-instructions.md) is loaded
automatically by GitHub Copilot Chat in VS Code, so Copilot already knows the project,
the workflow and the pitfalls above. Just open the folder and ask, for example:

> "Read SETUP-NEW-COMPUTER.md and README.md, then help me replace the placeholder contact
> details in settings.json."
