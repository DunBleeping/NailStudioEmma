# Zonder parameters verschijnt een keuzemenu:
# .\tools\sync-website.ps1
#
# Rechtstreeks uitvoeren zonder menu (blijft mogelijk):
# .\tools\sync-website.ps1 -Bericht "Werk openingstijden bij"
#
# Meerdere bestanden bewust selecteren:
# .\tools\sync-website.ps1 -Bestanden "index.html","css\style.css" -Bericht "Pas opmaak aan"
#
# Alleen controleren, zonder commit of push:
# .\tools\sync-website.ps1 -WhatIf
#
# Sla eerst alle editorbestanden op. Dit script publiceert alleen opgeslagen bestanden.
# Het downloadt geen wijzigingen naar je werkbestanden en gebruikt nooit force push.
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'High')]
param(
    [string[]]$Bestanden,
    [string]$Bericht = 'Werk website-instellingen bij'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Git staat op deze computer mogelijk niet in PATH.
$gitCommand = Get-Command git -CommandType Application -ErrorAction SilentlyContinue
$git = if ($gitCommand) { $gitCommand.Source } else { 'C:\Program Files\Git\bin\git.exe' }
if (-not (Test-Path -LiteralPath $git -PathType Leaf)) {
    throw 'Git ontbreekt. Installeer Git for Windows en open PowerShell opnieuw.'
}
$env:Path = (Split-Path -Parent $git) + ';' + $env:Path

function Invoke-Git {
    param([string[]]$GitArguments)
    # --no-pager voorkomt de leesweergave met (END); afsluiten met q is niet nodig.
    & $git --no-pager @GitArguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git-opdracht mislukt: git $($GitArguments -join ' '). Er wordt niet verdergegaan."
    }
}

Push-Location (Split-Path -Parent $PSScriptRoot)
try {
    if (-not $PSBoundParameters.ContainsKey('Bestanden')) {
        Write-Host "`n=== Emma NailStudio: wijzigingen publiceren ==="
        Write-Host 'Dit script bewerkt geen instellingen en kopieert geen foto''s.'
        Write-Host 'Pas bestanden eerst aan en sla ze op in VS Code.'
        Write-Host '1. Instellingen en openingstijden'
        Write-Host '2. Prijzen en behandelingen (inclusief vertalingen)'
        Write-Host '3. Nieuwe of vervangen foto''s publiceren'
        Write-Host '4. Websitetekst en opmaak (HTML, CSS, JavaScript, vertalingen)'
        Write-Host '5. Zelf kiezen uit alle gewijzigde bestanden'
        Write-Host '0. Stoppen'
        do {
            $choice = Read-Host 'Kies 0 t/m 5'
        } until ($choice -match '^[0-5]$')
        if ($choice -eq '0') { return }

        # Toon alleen werkelijk gewijzigde of nieuwe bestanden; selecteer nooit blind een hele map.
        $changed = @(Invoke-Git @('-c', 'core.quotepath=false', 'ls-files', '--modified', '--others', '--exclude-standard') |
            Sort-Object -Unique)
        $candidates = @($changed | Where-Object {
            switch ($choice) {
                '1' { $_ -eq 'data/settings.json' }
                '2' { $_ -in @('data/services.json', 'data/Prijzenlijst.csv', 'data/translations.json') }
                '3' { $_ -match '^images/.+\.(jpg|jpeg|png|webp|svg|avif)$|^images/.+/descript\.ion$|^data/(gallery|services|translations)\.json$|^index\.html$' }
                '4' { $_ -match '^index\.html$|^(css|js)/|^data/translations\.json$' }
                '5' { $true }
            }
        })
        if ($candidates.Count -eq 0) {
            Write-Host 'Geen opgeslagen wijzigingen gevonden voor deze keuze. Er wordt niets gepubliceerd.'
            return
        }
        if ($choice -eq '3') {
            Write-Host "`nZet foto's vooraf in images\gallery\<album> of images\services."
            Write-Host 'Nieuwe albumfoto''s? Werk eerst de albumlijst bij met: python tools\update_galerij.py'
            Write-Host 'Python ontbreekt? Werk photos in data\gallery.json zorgvuldig zelf bij, of vraag hulp.'
            Write-Host 'Behandelingsfoto''s: controleer image in data\services.json.'
            Write-Host 'Foto vervangen? Verhoog de afbeeldingsversie (?v=) in JSON/HTML.'
            Write-Host 'Kies straks zowel de foto''s als de gewijzigde verwijzingen; alleen uploaden toont geen nieuw album.'
        }
        Write-Host "`nBeschikbare bestanden:"
        for ($i = 0; $i -lt $candidates.Count; $i++) {
            Write-Host ("{0}. {1}" -f ($i + 1), $candidates[$i])
        }
        do {
            $answer = Read-Host 'Kies bestandsnummers gescheiden door komma, A voor alle getoonde bestanden, of 0 om te stoppen'
            if ($answer -eq '0') { return }
            $valid = $false
            if ($answer -eq 'A') {
                $Bestanden = $candidates
                $valid = $true
            } elseif ($answer -match '^\s*\d+(\s*,\s*\d+)*\s*$') {
                $numbers = @($answer -split ',' | ForEach-Object { [int]$_.Trim() })
                if (@($numbers | Where-Object { $_ -lt 1 -or $_ -gt $candidates.Count }).Count -eq 0) {
                    $Bestanden = @($numbers | ForEach-Object { $candidates[$_ - 1] })
                    $valid = $true
                }
            }
            if (-not $valid) { Write-Host 'Ongeldige keuze. Gebruik de getoonde nummers.' }
        } until ($valid)

        if (-not $WhatIfPreference) {
            do {
                $action = Read-Host '1 = alleen controleren, 2 = commit en publiceren, 0 = stoppen'
            } until ($action -match '^[0-2]$')
            if ($action -eq '0') { return }
            if ($action -eq '1') { $WhatIfPreference = $true }
        }
        if (-not $PSBoundParameters.ContainsKey('Bericht') -and -not $WhatIfPreference) {
            $Bericht = Read-Host 'Korte omschrijving van je wijziging (bijvoorbeeld: Voeg klantfoto toe)'
        }
    }
    if ([string]::IsNullOrWhiteSpace($Bericht)) { throw 'Geef een duidelijke commitomschrijving op.' }
    if ($Bestanden.Count -eq 0) { throw 'Selecteer minstens een bestand.' }
    $branch = Invoke-Git @('branch', '--show-current')
    if ($branch -ne 'main') { throw 'Dit script werkt alleen op main. Wissel niet zonder controle van branch.' }

    # Bestaand klaargezet werk niet ongemerkt meenemen in onze commit.
    $staged = @(Invoke-Git @('diff', '--cached', '--name-only'))
    if ($staged.Count -gt 0) {
        throw 'Er staan al bestanden klaar voor een commit. Handel die eerst af via Broncodebeheer.'
    }

    # Alleen concrete bestandspaden binnen deze repository zijn toegestaan, geen mappen/wildcards.
    $root = (Get-Location).Path
    $selected = foreach ($file in $Bestanden) {
        $full = [IO.Path]::GetFullPath((Join-Path $root $file))
        if (-not $full.StartsWith($root + '\', [StringComparison]::OrdinalIgnoreCase) -or
            -not (Test-Path -LiteralPath $full -PathType Leaf)) {
            throw "Geen bestaand bestand binnen de projectmap: $file"
        }
        if ($full -match '\\images\\') {
            $image = Get-Item -LiteralPath $full
            if ($image.Name -cne $image.Name.ToLowerInvariant() -or $image.Name -match '\s' -or $image.Length -eq 0) {
                throw "Foto/onderschrift heeft hoofdletters, spaties of is leeg: $file. Pas dit eerst aan."
            }
        }
        [IO.Path]::GetRelativePath($root, $full).Replace('\', '/')
    }
    $selected = @($selected | Select-Object -Unique)
    foreach ($file in $selected | Where-Object { $_ -match '\.json$' }) {
        # Ongeldige JSON niet publiceren: daardoor kunnen prijzen of de hele site leeg blijven.
        Get-Content -LiteralPath $file -Raw | ConvertFrom-Json | Out-Null
    }

    Invoke-Git @('status', '--short')
    Invoke-Git (@('diff', '--') + $selected)
    Write-Host "`nGeselecteerd: $($selected -join ', ')"
    Write-Host 'Controleer nieuwe bestanden zelf: git diff toont nog niet gevolgde bestanden niet.'
    Write-Host 'Publiceer nooit geheime sleutels, telefoonnummers of prive-adressen.'
    Write-Host 'CSS/JS gewijzigd? Verhoog beide ?v= nummers in index.html en selecteer dat bestand ook.'
    Write-Host 'Test de website voordat je bevestigt.'

    if ($WhatIfPreference) {
        Write-Host 'Controle klaar: geen fetch, commit of push uitgevoerd.'
        return
    }

    # Fetch leest de nieuwste GitHub-status, maar verandert geen lokale werkbestanden.
    Invoke-Git @('fetch', 'origin', 'main')
    $behind = [int](Invoke-Git @('rev-list', '--count', 'HEAD..origin/main'))
    if ($behind -gt 0) {
        throw 'GitHub bevat nieuwere commits. Integreer die eerst zorgvuldig; dit script voert geen automatische pull uit.'
    }

    # De bevestiging geldt voor zowel de commit als de push: een push kan de live site veranderen.
    if (-not $PSCmdlet.ShouldProcess(
        "origin/main; bestanden: $($selected -join ', ')",
        "Commit '$Bericht' en publiceer via Cloudflare (ook eventuele eerdere lokale commits)"
    )) { return }

    Invoke-Git (@('add', '--') + $selected)
    $changes = @(Invoke-Git @('diff', '--cached', '--name-only'))
    if ($changes.Count -gt 0) {
        Invoke-Git @('diff', '--cached', '--check')
        Invoke-Git @(
            'commit', '-m', $Bericht,
            '-m', 'Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>'
        )
    } else {
        Write-Host 'Geen nieuwe wijzigingen in de geselecteerde bestanden.'
    }

    # Na een eerdere mislukte push kan dit alsnog de al gemaakte commit publiceren.
    $ahead = [int](Invoke-Git @('rev-list', '--count', 'origin/main..HEAD'))
    if ($ahead -gt 0) { Invoke-Git @('push', 'origin', 'main') }
    else { Write-Host 'Geen lokale commits om te pushen.' }

    Invoke-Git @('status', '--short', '--branch')
    Write-Host "`nGitHub is bijgewerkt. De Cloudflare-publicatie is daarmee nog niet gecontroleerd."
    Write-Host 'Controleer Compute > Workers & Pages > nailstudioemma > Deployments op Success.'
    Write-Host 'Open daarna https://emmanagelstudio.vip/ en vernieuw met Ctrl+F5.'
    Write-Host 'Bij vertraging: controleer de GitHub/Cloudflare-status; maak niet opnieuw een campagne of project aan.'
} finally {
    Pop-Location
}
