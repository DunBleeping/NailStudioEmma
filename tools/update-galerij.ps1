# Werkt alleen de lokale albumlijst bij; publiceert niets. Vereist PowerShell 7.
# .\tools\update-galerij.ps1
[CmdletBinding()]
param([string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot))

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$manifest = Join-Path $ProjectRoot 'data\gallery.json'
$original = [IO.File]::ReadAllText($manifest)
$data = $original | ConvertFrom-Json -AsHashtable

foreach ($album in $data.images) {
    $folderName = $album.folder
    if ($folderName -cnotmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') {
        throw "Ongeldige albummap: $folderName"
    }
    $folder = Join-Path $ProjectRoot "images\gallery\$folderName"
    [IO.Directory]::CreateDirectory($folder) | Out-Null
    $captions = @{}
    $captionFile = Join-Path $folder 'descript.ion'
    if (Test-Path -LiteralPath $captionFile -PathType Leaf) {
        $bytes = [IO.File]::ReadAllBytes($captionFile)
        try {
            $text = [Text.UTF8Encoding]::new($false, $true).GetString($bytes).TrimStart([char]0xFEFF)
        } catch [Text.DecoderFallbackException] {
            $text = [Text.Encoding]::GetEncoding(1252).GetString($bytes)
        }
        foreach ($line in ($text -split '\r?\n')) {
            if ($line.Trim() -match '^(?:"([^"]+)"|(\S+))\s+(.+)$') {
                $name = if ($Matches[1]) { $Matches[1] } else { $Matches[2] }
                $captions[$name] = $Matches[3].Trim()
            }
        }
    }
    $existing = @{}
    foreach ($photo in $album.photos) {
        $existing[[Uri]::UnescapeDataString([IO.Path]::GetFileName(($photo.src -split '\?')[0]))] = $photo
    }
    $photos = @(foreach ($file in (Get-ChildItem -LiteralPath $folder -File | Sort-Object Name)) {
        if ($file.Extension.ToLowerInvariant() -notin @('.jpg', '.jpeg', '.png', '.webp')) { continue }
        if ($file.Name -cne $file.Name.ToLowerInvariant() -or $file.Name -match '\s' -or $file.Length -eq 0) {
            throw "Ongeldige foto: $folderName\$($file.Name). Gebruik kleine letters, geen spaties en geen leeg bestand."
        }
        if ($file.Length -gt 500KB) { Write-Warning "$folderName\$($file.Name): groter dan 500 KB." }
        $version = (Get-FileHash -LiteralPath $file.FullName -Algorithm MD5).Hash.Substring(0, 8).ToLowerInvariant()
        $photo = [ordered]@{ src = "./images/gallery/$folderName/$([Uri]::EscapeDataString($file.Name))?v=$version" }
        $previous = $existing[$file.Name]
        if ($captions.ContainsKey($file.Name)) {
            $photo.caption = $captions[$file.Name]
        } elseif ($previous -and $previous['caption']) {
            $photo.caption = $previous['caption']
        }
        if ($previous -and $previous['alt']) { $photo.alt = $previous['alt'] }
        $photo
    })
    $album.photos = $photos
    $album.src = if ($photos.Count) { $photos[0].src } else { '' }
    Write-Host "$($album.title): $($photos.Count) foto('s)"
}

$json = ($data | ConvertTo-Json -Depth 20).Replace("`r`n", "`n") + "`n"
if ($json -cne $original) {
    [IO.File]::WriteAllText($manifest, $json, [Text.UTF8Encoding]::new($false))
}
