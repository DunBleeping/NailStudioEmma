# Overdracht, voorkeuren en lessons learned

Bijgewerkt: 29 oktober 2026.

Dit document bundelt de werkzaamheden en afspraken uit de gesprekken over de website,
Google Ads en toegang vanaf de iPhone. Het is een overdracht; de blijvende voorkeuren
en werkafspraken staan ook in de automatisch laadbare
[Copilot-projectinstructies](.github/copilot-instructions.md), voor lokaal en remote
werken in deze projectmap. Instellingen en resultaten hieronder zijn momentopnamen; controleer de
actuele bron voordat je ze later als uitgangspunt gebruikt.

## 1. Voorkeuren van de eigenaar

- Antwoord in het Nederlands, kort en begrijpelijk. Websitecopy spreekt vanuit Emma:
  **ik/mijn**, geen onpersoonlijk bureauverhaal.
- Voer duidelijke opdrachten zelfstandig uit, maar vraag vooraf toestemming voor
  belangrijke gedragskeuzes, nieuwe diensten/resources en accountwijzigingen.
- Werk gebruiksvriendelijk: duidelijke menu's, TEST/PRODUCTIE en concrete stappen;
  geen noodzaak om technische parameters zoals `-WhatIf:$false` te onthouden.
- Vraag alleen om noodzakelijke persoonlijke handelingen, zoals OAuth- of
  Windows-toestemming. Herhaal niet steeds dezelfde vraag of aanmeldprocedure.
- Houd voortgang kort. Vermijd onnodig lang wachten en meld eerlijk wat nog openstaat.
- Onderzoek de echte oorzaak. Noem iets niet opgelost op basis van alleen een
  codewijziging of een geslaagde test die het gemelde probleem niet nabootst.
- Houd wijzigingen gericht. Behoud ander lokaal werk en publiceer dit niet ongemerkt.
- Gewenste uitstraling: warme goud/crèmetinten, verzorgde kaders, subtiele glitter
  en roze bloesems. Respecteer de voorkeur voor minder beweging.
- Op telefoon en tablet moet de header **meescrollen**, niet vastplakken. Deze keuze
  is op 29 oktober expliciet bevestigd.
- Foto's zijn standaard verborgen voor nieuwe bezoekers; de voorkeur wordt onthouden.
  Behoud lettergroottekeuze, donkere modus en mobiele bediening.
- Geen zichtbaar Copilot-credit op de website. Dit staat los van de commitvermelding.
- Bescherm telefoonnummer en privé-adres. Geen volledige contactgegevens, tokens,
  OAuth-clientgeheimen of herstelcodes in repository, documentatie, chat of logs.

## 2. Project en publicatie

- Website: <https://emmanagelstudio.vip/>.
- Repository: <https://github.com/DunBleeping/NailStudioEmma>, branch `main`.
- Hosting: bestaand Cloudflare Pages-project `nailstudioemma`, automatische deployment
  na push naar `main`. Een geslaagde push is nog geen bevestigde live deployment.
- Statische HTML/CSS/JavaScript met JSON; geen npm-afhankelijkheden of buildstap.
- Contact loopt via WhatsApp/SMS en de bestaande Turnstile-beveiligde Pages Function.
  Geen online agenda, e-mailboekingen of nieuw boekingsformulier toevoegen.
- Publiceren: gericht testen, diff controleren, Nederlandse commit, push naar bestaande
  remote en live assets controleren. Geen nieuwe remotes of services zonder toestemming.
- Bij CSS- of JS-wijzigingen altijd **beide** assetversies in
  [index.html](index.html) verhogen. Bij deze overdracht staan beide op `?v=46`.
- Een documentatiewijziging vereist op zichzelf geen nieuwe assetversie.

### Publicatiemenu

Start [tools/sync-website.ps1](tools/sync-website.ps1) zonder parameters voor het menu.
TEST controleert zonder commit/push; PRODUCTIE vraagt bevestiging en publiceert.
`-WhatIf` blijft beschikbaar voor expliciete controle.

Bij foto's wordt de albumlijst automatisch lokaal bijgewerkt, ook wanneer de eigenaar
[data/gallery.json](data/gallery.json) niet zelf bewerkt. De albumlijst, nieuwe foto's
en verwijderingen horen bij elkaar. `A` betekent alle getoonde bestanden, inclusief
getoonde verwijderingen, niet automatisch alle overige wijzigingen in het project.
Alleen controleren kan dus wel de lokale albumlijst vernieuwen.

## 3. Website: gerealiseerde functies en huidige keuzes

### Behandelingen en maatwerk

- Behandelingen zijn standaard ingeklapt met de duidelijke tekst
  **Klik hier voor mijn behandelingen**. Links naar behandelen/zoeken openen ze.
- De knop **Afspraak maken** bij Custom nail art verwijst naar de prijslijst.
- De prijslijst heeft een aparte regel **Custom designs (op aanvraag)**:
  duur **In overleg**, prijs **Op aanvraag**, link **Vraag prijs aan** naar Contact.
- Deze maatwerkregel heeft geen fictieve prijs en geen winkelmandknop. De bestaande
  dienst **Nails Design vanaf...** met startprijs EUR 60 is apart behouden.
- Lokale en seizoenscopy noemt Purmerend, Weidevenne, centrum, Nieuwstraat,
  Halloween en kerst/Xmas, zonder extra vestigingen te suggereren.
- SEO/canonical/sitemap zijn naar het echte hoofddomein bijgewerkt.

### Talen, vormgeving en contact

- Negen talen: Nederlands, Engels, Frans, Spaans, Turks, Arabisch, Oekraïens,
  Pools en Vietnamees. Nieuwe zichtbare tekst in alle catalogi bijwerken.
- JSON-teksten escapen voordat ze HTML worden. Bedragen en dienst-ID's niet vertalen.
- BIAB heeft een als illustratie gemarkeerd voorbeeld; echte albumfoto's krijgen voorrang.
- Confetti speelt kort, eenmaal per laden, en niet bij minder-bewegingvoorkeur.
- De vriendinnenactie heeft een glitterkader en ingeklapte voorwaarden,
  zonder eigen knop **Afspraak maken**.
- Donkere modus keert kleuren om maar behoudt fotokleuren. Er zijn socialmedia-iconen,
  een Impressie-knop en een mobiel menu dat ook bij een tik erbuiten sluit.
- Het exacte adres wordt niet openbaar gepubliceerd. Eerdere verklarende adrescopy
  is later weer verwijderd; herstel oudere teksten niet op basis van geschiedenis.
  Het adres volgt na afspraakbevestiging.

### Actievoorwaarden: geschiedenis is niet de actuele bron

De actie veranderde tijdens het werk meerdere keren: ongelijke percentages, 25%,
15% en later vaste bedragen. De huidige gecommitteerde copy vermeldt **beiden EUR 5**
korting op een nieuwe set, samen boeken en tegelijk komen, met minimaal één nieuwe
klant. Emma bevestigt korting; het mandje rekent deze niet automatisch af.

De huidige copy vermeldt ook EUR 3 extra korting bij een positieve Google-review
van minimaal vier sterren. **Open aandachtspunt:** laat deze beloonde reviewvoorwaarde
toetsen aan het actuele Google-beleid; neem niet aan dat zij is toegestaan.
Tijdens deze documentatietaak zijn de actievoorwaarden niet gewijzigd.
Controleer voor toekomstige wijzigingen de huidige HTML, vertalingen en tests samen.

## 4. iPhone-toegang: wat werkt en wat niet hetzelfde is

De officiële extensies `ms-vscode.remote-server` en de bijbehorende
`ms-vscode.remote-explorer` zijn geïnstalleerd.

- Naam van de tunnel: `emstudio-pc`.
- Open in Safari: <https://vscode.dev/tunnel/emstudio-pc>.
- Meld aan met hetzelfde GitHub-account als waarmee de tunnel is geautoriseerd.
- Open zo nodig de projectmap `C:\MyDocs\DevOps\EmStudio`.
- De tunnel is met toestemming als achtergrondservice geïnstalleerd.
  VS Code hoeft niet open te blijven; de pc moet wel aan, online en wakker zijn.
  Er zijn geen slaapinstellingen gewijzigd.
- Statuscontrole tijdens deze overdracht: service geïnstalleerd, tunnel **Connected**.
- De eigenaar bevestigde op de iPhone dat bestanden openen en chat verzenden/antwoorden
  werken na herstel van de serververbinding.

**Belangrijk:** Remote Tunnels opent een remote werkomgeving; het spiegelt niet het
bestaande desktopvenster. Deze chat en de iPhone-chat zijn niet automatisch dezelfde
sessie. Berichten/context worden niet vanzelf samengevoegd. Dezelfde geopende
projectmap betekent wel dezelfde bestanden. Voor exact hetzelfde venster is een
andere oplossing, zoals externe bureaubladtoegang, nodig; die is niet ingericht.

### Tunnelproblemen die zijn onderzocht

- Aanvankelijk moest VS Code eerst serveronderdelen downloaden.
- Een oudere tunnelversie bleef draaien terwijl een nieuwere update klaarstond.
  De Microsoft-handtekening van de update is gecontroleerd en de service is bijgewerkt.
- Vastgelopen oude tunnelprocessen zijn gericht op PID gestopt, niet op procesnaam.
- De remote webserver verwees nog naar een niet meer bereikbare agentpoort
  (`ECONNREFUSED`). Alleen die remote server is herstart; desktop-VS Code bleef open.
- De testbrowser kreeg een Marketplace-blokkade. Dit was geen bewijs dat Safari
  dezelfde fout had: de daadwerkelijke iPhone-test was noodzakelijk.
- Na reconnect verscheen soms geen iPhone-toetsenbord. Buiten/binnen het invoervak
  tikken en een nieuw Safari-tabblad waren voorgestelde workarounds, geen bewezen
  permanente oplossing. De pc kan het iOS-toetsenbord niet afdwingen.

Diagnosecommando's, zonder geheimen uit te lezen:

```powershell
code tunnel status
code tunnel user show
```

Serverlogs staan onder `%USERPROFILE%\.vscode\cli` en
`%USERPROFILE%\.vscode-server`. Deel alleen relevante, gecontroleerde logregels:
logs en endpointregistraties kunnen gevoelige verbindingsinformatie bevatten.
Een blijvende tunnelservice is gewenst; een tijdelijke websitepreview niet.

## 5. Node.js: nog niet afgerond

De remote sessie kon `node` niet vinden. Via winget is de officiële Node.js
LTS-installer gestart en om Windows-toestemming gevraagd. Een succesvolle installatie
is **niet** bevestigd.

Bij de overdrachtscontrole was `node` niet via PATH beschikbaar en ontbrak
`C:\Program Files\nodejs\node.exe`. Dit blijft een open opdracht; niet als afgerond melden.

Na herstel controleren:

```powershell
node --version
npm.cmd --version
```

Een al draaiende remote sessie kan een oud PATH hebben. Controleer ook een nieuwe
remote terminal en bepaal pas daarna of een gerichte serviceherstart nodig is.
De website zelf heeft nog steeds geen npm-installatie of build nodig.

## 6. Google Ads en veilige toegang

Voor opeenvolgende analyses, klantmeldingen en volgende controles is
[GOOGLE-ADS-LOGBOEK.md](GOOGLE-ADS-LOGBOEK.md) de doorlopende bron.
Lees dit bij vervolgwerk en voeg nieuwe waarnemingen gedateerd toe.

- Alleen de officiële [Google Ads MCP-server](https://github.com/googleads/google-ads-mcp)
  is ingericht in de persoonlijke VS Code-configuratie
  `%APPDATA%\Code\User\mcp.json`, met sleutel `servers`.
- Officiële MCP-tools: `customers_list_accessible_customers`,
  `metadata_get_resource_metadata` en `search_search`; deze zijn alleen-lezen.
- Authenticatie gebruikt persoonlijke ADC/OAuth-opslag buiten de repository.
  De OAuth-autorisatie kan breder zijn dan de beschikbare read-only MCP-tools.
  Dit onderscheid altijd expliciet maken.
- Productiequery's werkten. Geen nieuwe API-aanvraag of Cloud-project maken omdat
  een query leeg is of de authenticatie tijdelijk faalt.
- Tijdens eerdere inrichting moest een OAuth-client na ongewenste blootstelling
  worden vervangen. Neem de oude gegevens nooit over; dump geen credentialbestand,
  dialoog met geheimen of endpoint-token om een probleem te onderzoeken.
- Een eerdere schrijftest gebruikte `validate_only=true` en sloeg niets op.
- Pas na latere expliciete toestemming zijn via de officiële API echte wijzigingen
  gedaan aan **Campaign #1**: EUR 7,50 gemiddeld dagbudget, CPC-plafond EUR 1,50,
  60% doel bovenaan gehandhaafd, lokale/merkzoekwoorden en advertenties bijgewerkt.
  Dit is de laatst vastgelegde wijziging, geen nieuwe live accountcontrole van vandaag.
- Voor toekomstige campagneschrijfacties opnieuw expliciet toestemming en scope
  vastleggen. De read-only MCP-configuratie is geen algemene toestemming om te wijzigen.

Het oorspronkelijke rapport had weinig data: 45 vertoningen, 3 klikken, EUR 2,75 kosten
in de uitgevraagde periode 14 t/m 27 oktober. De campagne liep pas vanaf 21 oktober;
dit waren dus niet veertien volledige actieve dagen. Rangverlies woog toen zwaarder
dan budgetverlies. Deze historische cijfers niet als actuele prestaties presenteren.
Ontbrekende rapportageregels onderscheiden van ontbrekende rechten, API-toegang
of authenticatie; vertoningsaandeel niet verwarren met het percentage getoonde
advertenties dat bovenaan stond.

## 7. Mobiele logo- en witvlakproblemen: diagnose en lessen

### Groot logo werd afgesneden

Een logo kon ongeveer 612 px hoog worden in een blok met vaste hoogte 300 px.
De hero sneed de overloop af. Herstel: natuurlijke afbeeldingshoogte, gecentreerde
container en maximaal 300 px breed op smalle schermen. Bevestigd in browsermetingen
op meerdere schermformaten en alle vier lettergroottes.

### Wit vlak bij omhoog scrollen

De eerste verklaringen waren onvolledig:

1. Achtergrondkleur en `overscroll-behavior-y: none` pakten doortrekken aan,
   maar verwijderden het gemelde witte vlak niet.
2. Natuurlijke headerhoogte en vaste vierkante afmetingen voor het kleine logo
   verbeterden de layout, maar de eigenaar meldde dat het vlak bleef.
3. Daarna is de daadwerkelijke lege ruimte gemeten: `<svg hidden>` met de
   socialmedia-sprite kreeg toch `display: inline`, 300 bij 150 px, plus regelruimte.
   Daardoor begon de header in de testbrowser op ongeveer **158 px**, niet op 0.
4. Expliciet `svg[hidden] { display: none; }` verwijdert die ruimte.
   De header begon na herstel op **0 px**, de sprite had hoogte 0.
   De socialmedia-symbolen blijven bruikbaar via `<use>`.
5. Op verzoek scrolt de header nu tot en met 1024 px mee in beide schermstanden.
   Desktop behoudt `position: sticky`.

De laatste fix is gecommit als `60abf27`, live CSS/HTML-versie 46 is gecontroleerd.
Browsermetingen op 390, 844, 1024 en 1280 px en menu-openen/sluiten slaagden.
**Een nieuwe bevestiging van de eigenaar op een echte iPhone na deze laatste fix
staat nog open.** Claim daarom geen volledig bewezen Safari-oplossing.

### Algemene lessons learned

- Meet de gemelde lege ruimte en alle elementen ervoor, ook verborgen SVG's.
- Een screenshot helpt lokaliseren, maar bewijst niet welk element de oorzaak is.
- Controleer computed styles en bounding boxes; alleen HTML-attributen of regex-tests
  zijn onvoldoende bewijs van werkelijk verborgen of goed uitgelijnde elementen.
- Test niet alleen proxy's zoals assetversie of aanwezigheid van CSS. Controleer
  headerpositie, logoverhouding, overlap en inhoudshoogte na op/neer scrollen en rotatie.
- Desktop-viewportemulatie is geen echte Safari/iPhone-test. Benoem die beperking.
- Regel een echte gebruikerstoets na een apparaatgebonden fix en blijf niet zonder
  nieuwe aanwijzingen dezelfde hypothese aanpassen.
- Controleer meerdere lettergroottes, foto's aan/uit, menu en taalwissels.
- De huidige landscape-layout liet bij een eerdere controle ook horizontale overloop
  zien; die veranderde niet door de scrollfix. Dit is geen afgeronde volledige
  overflow-audit en verdient aparte reproductie.
- Sluit tijdelijke previewservers na gebruik. Een open browsertab betekent niet dat
  de previewserver nog draait. Een gewenste remote-tunnelservice juist laten draaien.
- Houd installatie, configuratie, verbinding, chatwerking en gedeelde sessie uit elkaar:
  succes van één stap bewijst niet het geheel.
- Houd tests actueel, maar verander verwachtingen alleen als het gedrag bewust verandert.
- Publiceer geen ander lokaal werk mee; stage zo nodig alleen de relevante testhunks.

## 8. Open werk en controlelijst

Op het moment van schrijven zijn deze lokale galerijwijzigingen bewust **niet**
meegenomen in de scrollfixes:

- Gewijzigd: [data/gallery.json](data/gallery.json).
- Verwijderd: `images/gallery/babyboom/babyboom-01.jpg`.
- Nieuw: `images/gallery/biab/biab-01.jpg`.
- De bijbehorende galerijtest in
  [tools/website-features.test.mjs](tools/website-features.test.mjs) is ook lokaal gewijzigd.

Niet terugdraaien of zonder afstemming publiceren. Galerij en fotoverwijzingen later
als samenhangende wijziging controleren en publiceren.

Verder open:

1. Laatste SVG-/scrollfix laten bevestigen op echte iPhone.
2. Node.js-installatie afronden en in de remote terminal verifiëren.
3. iPhone-toetsenbordprobleem na reconnect zo nodig apart reproduceren.
4. Landscape-overloop gericht onderzoeken, zonder te claimen dat die al is opgelost.
5. Huidige reviewbonus laten toetsen; geen nieuwe campagne- of accountwijzigingen
   uitvoeren op basis van deze notitie.

## 9. Validatie en verwijzingen

Gerichte tests, zodra Node.js beschikbaar is:

```powershell
node --test tools\website-features.test.mjs tools\translations.test.mjs tools\contact.test.mjs
git diff --check
```

Als `node` ontbreekt, werkte deze bestaande testmogelijkheid via VS Code:

```powershell
$exe = Join-Path (Split-Path (Split-Path (Get-Command code).Source)) 'Code.exe'
$env:ELECTRON_RUN_AS_NODE = '1'
& $exe --test tools\website-features.test.mjs tools\translations.test.mjs tools\contact.test.mjs
Remove-Item Env:\ELECTRON_RUN_AS_NODE
```

Gebruik dit in een aparte PowerShell-terminal. Deze tijdelijke omgevingsvariabele is
geen vervanging voor een normale Node-installatie.

De laatste gerichte website-run bevatte elf geslaagde tests in de lokale werkboom.
Die werkboom bevat ook de nog niet gepubliceerde galerijaanpassing; testuitslagen
zijn dus niet automatisch bewijs van een schone checkout van de publicatiecommit.

Meer details:
[README](README.md), [toegankelijkheid](ACCESSIBILITY.md),
[prijzen beheren](PRIJZEN-BEHEER.md), [foto's uploaden](FOTO-UPLOADEN.md),
[computer en hosting instellen](SETUP-NEW-COMPUTER.md).

Officiële achtergrond:
[Remote Tunnels](https://code.visualstudio.com/docs/remote/tunnels) en
[Google Ads MCP](https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server).
