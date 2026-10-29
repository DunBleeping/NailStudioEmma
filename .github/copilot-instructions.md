# Emma NailStudio – project guidelines

Static website for a Dutch nail salon, with one Pages Function for Turnstile contact verification. No build step or npm dependencies. Site text and docs are
Dutch; the owner usually writes in Dutch, so answer in Dutch unless they write in another language.

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
- **Changing CSS or JS: always bump `?v=N` on both lines in `index.html`.** It is currently `?v=41`.
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
