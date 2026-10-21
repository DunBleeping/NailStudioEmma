# Voorbeeld (uitvoeren vanuit de projectmap):
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
    [string[]]$Bestanden = @('data\settings.json'),
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
        [IO.Path]::GetRelativePath($root, $full).Replace('\', '/')
    }
    $selected = @($selected | Select-Object -Unique)

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
