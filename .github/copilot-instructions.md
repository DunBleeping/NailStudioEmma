# Emma NailStudio – project guidelines

Static website for a Dutch nail salon, with one Pages Function for Turnstile contact verification. No build step or npm dependencies. Site text and docs are
Dutch; the owner usually writes in Dutch, so answer in Dutch unless they write in another language.

## Voorkeuren van de eigenaar
- Antwoord kort, duidelijk en praktisch in het Nederlands. Voer duidelijke opdrachten zelfstandig uit;
  vraag alleen om noodzakelijke persoonlijke handelingen of beslissingen met wezenlijke gevolgen.
- Geef korte updates bij belangrijke stappen. Herhaal geen vragen of OAuth-aanmeldingen zonder
  nieuwe aanwijzing; controleer eerst de status. Meld open punten en mislukkingen eerlijk.
- Maak beheer gebruiksvriendelijk met begrijpelijke menu's en expliciete TEST/PRODUCTIE-keuzes,
  niet met verplicht te onthouden technische parameters.
- Websitecopy spreekt vanuit Emma: ik/mijn. Behoud warme goud/crèmetinten, verzorgde kaders,
  subtiele glitter en roze bloesems; respecteer minder-bewegingvoorkeuren.
- De header scrolt op telefoon en tablet (tot en met 1024 px) mee, in beide schermstanden.
  Maak hem daar niet opnieuw sticky zonder toestemming. Desktop mag sticky blijven.
- Behoud foto's standaard verborgen, onthouden bezoekersvoorkeuren, lettergroottekeuze en
  donkere modus met originele fotokleuren. Voeg geen zichtbaar Copilot-credit toe.
- Publiceer geen volledig privé-adres of telefoonnummer. Houd de bestaande beveiligde contactroute.
- Lees bij vervolgwerk de relevante onderdelen van
  [de overdracht en lessons learned](../OVERDRACHT-EN-LESSONS-LEARNED.md).
  Gebruik de actuele code en expliciete nieuwe keuzes als bron; historische actievoorwaarden,
  campagnecijfers en installatiestatus zijn geen blijvende voorkeuren.

## Werkwijze en geleerde lessen
- Controleer vooraf de werkboom. Behoud werk uit andere sessies en publiceer geen ongerelateerde
  wijzigingen mee; scheid zo nodig hunks in gedeelde bestanden.
- Reproduceer en meet het echte probleem voor je een oorzaak claimt. Controleer bij lege vlakken
  ook elementen vóór de header: de verborgen socialmedia-SVG moet expliciet `display: none` houden.
- Test mobiele layout na op/neer scrollen en rotatie, met alle lettergroottes. Meet headerpositie,
  logoverhouding en overlap; alleen aanwezigheid van CSS of een assetversie is geen gedragsbewijs.
- Viewportemulatie is geen echte iPhone/Safari-test. Vermeld beperkingen en vraag zo nodig om
  een apparaatcontrole; meld een fix niet als definitief bewezen zonder die bevestiging.
- Onderscheid geslaagde push, Cloudflare-deployment en werkende live versie. Controleer de
  relevante live inhoud/assets. Sluit tijdelijke previewservers; behoud bewust ingerichte services.
- Remote Tunnels deelt projectbestanden, niet automatisch dit chatgesprek of desktopvenster.
  Beloof geen chatsynchronisatie. Deel nooit credentials of volledige gevoelige logs.
- Google Ads: standaard alleen lezen. Echte wijzigingen vereisen expliciete toestemming voor
  die opdracht; bredere OAuth-rechten of eerdere toestemming zijn geen algemene schrijfopdracht.
- Lees vóór iedere Google Ads-analyse het [Google Ads-logboek](../GOOGLE-ADS-LOGBOEK.md)
  en voeg na afloop een gedateerde notitie toe met bron, periode, resultaten, onzekerheden
  en volgende controle. Onderscheid klantmeldingen van API-conversies en advertenties van
  campagnes. Haal actuele cijfers opnieuw op; logboekcijfers zijn historische momentopnamen.
  Bewaar geen individuele klantgegevens in het logboek.

## Architecture
- `index.html` – single page. `js/script.js` renders everything from JSON in `data/`:
  - `settings.json` – contact, WhatsApp, opening hours.
  - `services.json` – 27 treatments plus `extras`, such as the €5 old-polish removal surcharge.
  - `gallery.json` – Impressie albums: `src`, `folder` and `photos[]`.
- `css/style.css` – one stylesheet with colour variables in `:root` and breakpoints at 1024 px and 768 px.
- `tools/update_galerij.py` – fills `photos` in `gallery.json` from `images/gallery/<album>/`.
- Hosting: Cloudflare Pages auto-deploys on every push to `main` of `DunBleeping/NailStudioEmma`.
  - Live site: https://emmanagelstudio.vip
  - Cache and security headers live in `_headers`.
- Booking uses WhatsApp/SMS via `buildBookingMessage()` after Turnstile verification at `/api/contact`.
  The number is only in the Cloudflare `CONTACT_PHONE` secret; never publish it in code, JSON, or docs.
  `TURNSTILE_SECRET_KEY` is server-only. Production validates exact hostname and action `contact`.
  When the treatment cart is filled, the message contains the cart contents.
  There is no e-mail or online agenda; don't add booking forms.
- See `README.md`, `MANIFEST.md`, `PRIJZEN-BEHEER.md`, `FOTO-UPLOADEN.md` and `ACCESSIBILITY.md` for details.
  See `SETUP-NEW-COMPUTER.md` for setup and Git workflow.

## Build and test
- Local test: `python -m http.server 8765`, then open http://127.0.0.1:8765. `file://` does not work because the page uses `fetch`.
- Check mobile at 390 px width (iPhone) and desktop at 1280 px. Make sure there is no horizontal overflow at every font size (A– to A++).
- Contact API regression tests: `node --test tools/contact.test.mjs`. Live Server cannot run Pages Functions.

## Conventions and pitfalls
- **Changing CSS or JS: always bump `?v=N` on both lines in `index.html`.** Read the current version from that file; keep both numbers equal.
- Cloudflare paths are case-sensitive; use lowercase file names without spaces.
- A missing file returns the homepage with status 200 and is cached for 30 days, so never commit empty or placeholder images.
- Escape all JSON content with `escapeHtml()` before inserting it into HTML.
- Font scaling uses classes on `<html>` (`font-size-small|medium|large|xlarge`), so size with `rem`.
  Headings are capped on mobile.
- Visitor preferences are stored in localStorage: `emstudio-inverted` (dark mode: inverted colors, photos keep original color), `fontSize`, `imagesHidden` (default: photos hidden), `cart` and `cartExtras`.
- Keep changes surgical. Update the related Dutch docs when behaviour changes.
- Commit to `main` with a clear Dutch message, then push.
  Don't connect new remotes or services without the owner's permission.
- Open items are listed in `SETUP-NEW-COMPUTER.md` §8. Examples: placeholder contact details in `settings.json`, and the old domain `nailsalonemma.nl` in SEO tags.
