# Uitvoeren met PowerShell 7: .\tools\gallery.test.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = Join-Path ([IO.Path]::GetTempPath()) ("emstudio-gallery-test-" + [guid]::NewGuid())
$git = (Get-Command git -ErrorAction SilentlyContinue)?.Source
if (-not $git) { $git = 'C:\Program Files\Git\bin\git.exe' }

function Assert([bool]$Condition, [string]$Message) {
    if (-not $Condition) { throw $Message }
}
function Write-Fixture([string]$Path, [string]$Text) {
    [IO.File]::WriteAllText((Join-Path $root $Path), $Text, [Text.UTF8Encoding]::new($false))
}
function Read-Gallery {
    Get-Content (Join-Path $root 'data\gallery.json') -Raw | ConvertFrom-Json -AsHashtable
}
function Test-Git([string[]]$Arguments) {
    & $git -C $root --no-pager @Arguments | Out-Null
    if ($LASTEXITCODE) { throw "Test-Git mislukt: $Arguments" }
}

try {
    foreach ($folder in @('data', 'tools', 'images\gallery\test', 'images\gallery\empty')) {
        [IO.Directory]::CreateDirectory((Join-Path $root $folder)) | Out-Null
    }
    Copy-Item (Join-Path $PSScriptRoot 'update-galerij.ps1') (Join-Path $root 'tools')
    Copy-Item (Join-Path $PSScriptRoot 'sync-website.ps1') (Join-Path $root 'tools')
    $updater = Join-Path $root 'tools\update-galerij.ps1'
    $sync = Join-Path $root 'tools\sync-website.ps1'
    Write-Fixture 'data\gallery.json' '{"images":[{"title":"Test","folder":"test","photos":[]},{"title":"Empty","folder":"empty","photos":[]}]}'
    Write-Fixture 'images\gallery\test\02.jpg' 'second'
    Write-Fixture 'images\gallery\test\01.jpg' 'first'
    Write-Fixture 'images\gallery\test\ignore.txt' 'Not an image'
    Write-Fixture 'images\gallery\test\descript.ion' '"01.jpg" Mooi resultaat'
    & $updater -ProjectRoot $root
    $data = Read-Gallery
    Assert ($data.images[0].photos.Count -eq 2) 'Beide afbeeldingen moeten in de lijst staan.'
    Assert ($data.images[0].src -match '/01\.jpg\?v=[0-9a-f]{8}$') 'De eerste foto moet cover zijn met hash.'
    Assert ($data.images[0].photos[0].caption -eq 'Mooi resultaat') 'Onderschrift ontbreekt.'
    Assert ($data.images[1].photos.Count -eq 0 -and $data.images[1].src -eq '') 'Leeg album krijgt geen cover.'
    $firstHash = (Get-FileHash (Join-Path $root 'data\gallery.json')).Hash
    & $updater -ProjectRoot $root
    Assert ((Get-FileHash (Join-Path $root 'data\gallery.json')).Hash -eq $firstHash) 'Generator moet stabiel zijn.'

    $oldSrc = $data.images[0].src
    $data.images[0].photos[0].alt = 'Eigen alt-tekst'
    Write-Fixture 'data\gallery.json' ($data | ConvertTo-Json -Depth 20)
    Remove-Item -LiteralPath (Join-Path $root 'images\gallery\test\descript.ion')
    Write-Fixture 'images\gallery\test\01.jpg' 'replaced'
    & $updater -ProjectRoot $root
    $photo = (Read-Gallery).images[0].photos[0]
    Assert ($photo.src -ne $oldSrc) 'Vervangen foto moet andere cacheversie hebben.'
    Assert ($photo.caption -eq 'Mooi resultaat' -and $photo.alt -eq 'Eigen alt-tekst') 'Metadata moet behouden blijven.'

    [IO.File]::WriteAllBytes((Join-Path $root 'images\gallery\test\descript.ion'),
        [Text.Encoding]::GetEncoding(1252).GetBytes('01.jpg Crème'))
    & $updater -ProjectRoot $root
    Assert ((Read-Gallery).images[0].photos[0].caption -eq 'Crème') 'Oude Windows-onderschriften moeten werken.'
    foreach ($bad in @('Bad.jpg', 'bad name.jpg', 'empty.jpg')) {
        Write-Fixture "images\gallery\test\$bad" $(if ($bad -eq 'empty.jpg') { '' } else { 'bad' })
        $before = (Get-FileHash (Join-Path $root 'data\gallery.json')).Hash
        $rejected = $false
        try { & $updater -ProjectRoot $root } catch { $rejected = $_.Exception.Message -like 'Ongeldige foto:*' }
        Assert $rejected "Ongeldige foto niet geweigerd: $bad"
        Assert ((Get-FileHash (Join-Path $root 'data\gallery.json')).Hash -eq $before) 'Fout mag manifest niet gedeeltelijk overschrijven.'
        Remove-Item -LiteralPath (Join-Path $root "images\gallery\test\$bad")
    }

    Test-Git @('init', '-b', 'main')
    Test-Git @('add', '.')
    Test-Git @('-c', 'user.name=Albumtest', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'Fixture')
    Write-Fixture 'data\settings.json' '{"unrelated":true}'
    Write-Fixture 'images\gallery\test\03.jpg' 'third'
    Write-Fixture 'images\gallery\test\descript.ion' '01.jpg Nieuw onderschrift'
    (Get-Item (Join-Path $root 'images\gallery\test\descript.ion')).Attributes = [IO.FileAttributes]::Hidden
    Remove-Item -LiteralPath (Join-Path $root 'images\gallery\test\02.jpg')
    $output = (& $sync -Bestanden 'images\gallery\test\03.jpg' -WhatIf 6>&1 | Out-String)
    Assert ($output -match 'Geselecteerd: .*data/gallery\.json') 'Manifest moet verplicht mee.'
    Assert ($output -match 'Geselecteerd: .*images/gallery/test/02\.jpg') 'Verwijdering moet mee.'
    Assert ($output -match 'Geselecteerd: .*images/gallery/test/descript\.ion') 'Verborgen onderschriften moeten mee.'
    Assert ($output -notmatch 'Geselecteerd: .*data/settings\.json') 'Andere instellingen mogen niet mee.'
    Assert (@(& $git -C $root diff --cached --name-only).Count -eq 0) 'Controle mag niets stagen.'

    $global:emstudioGalleryTestAnswers = [Collections.Generic.Queue[string]]::new()
    @('3', 'A') | ForEach-Object { $global:emstudioGalleryTestAnswers.Enqueue($_) }
    function Read-Host { param([string]$Prompt) $global:emstudioGalleryTestAnswers.Dequeue() }
    & $sync -WhatIf | Out-Null
    Assert ($global:emstudioGalleryTestAnswers.Count -eq 0) 'Fotomenu niet volledig doorlopen.'
    @('1', 'A') | ForEach-Object { $global:emstudioGalleryTestAnswers.Enqueue($_) }
    $output = (& $sync -WhatIf 6>&1 | Out-String)
    Assert ($output -match 'Geselecteerd: data/settings\.json\r?\n') 'Instellingenmenu moet alleen instellingen selecteren.'
    Assert ($global:emstudioGalleryTestAnswers.Count -eq 0) 'Instellingenmenu niet volledig doorlopen.'
    Remove-Item Function:\Read-Host
    foreach ($name in @('01.jpg', '03.jpg')) {
        Remove-Item -LiteralPath (Join-Path $root "images\gallery\test\$name")
    }
    & $updater -ProjectRoot $root
    Assert ((Read-Gallery).images[0].photos.Count -eq 0 -and (Read-Gallery).images[0].src -eq '') 'Laatste foto verwijderen moet album legen.'
    Write-Host 'Geslaagd: generator, vervanging, verwijdering, metadata, validatie en publicatiemenu.'
} finally {
    if (Get-Variable -Name emstudioGalleryTestAnswers -Scope Global -ErrorAction SilentlyContinue) {
        Remove-Variable -Name emstudioGalleryTestAnswers -Scope Global
    }
    # Alleen de unieke tijdelijke fixture opruimen, nooit de projectmap.
    if (Test-Path -LiteralPath $root) { Remove-Item -LiteralPath $root -Recurse -Force }
}
