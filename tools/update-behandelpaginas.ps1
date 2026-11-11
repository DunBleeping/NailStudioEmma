# Vernieuwt alleen lokale HTML; publiceert niets. Geen npm-pakketten nodig.
[CmdletBinding()]
param([switch]$Check)

$ErrorActionPreference = 'Stop'
$node = Get-Command node -CommandType Application -ErrorAction SilentlyContinue
$code = Join-Path $env:LOCALAPPDATA 'Programs\Microsoft VS Code\Code.exe'
$previous = $env:ELECTRON_RUN_AS_NODE
try {
    $runtime = if ($node) { $node.Source } elseif (Test-Path -LiteralPath $code) {
        $env:ELECTRON_RUN_AS_NODE = '1'
        $code
    } else {
        throw 'Node.js of Visual Studio Code ontbreekt. Installeer een van beide om de behandelpagina''s bij te werken.'
    }
    $arguments = @((Join-Path $PSScriptRoot 'update-behandelpaginas.mjs'))
    if ($Check) { $arguments += '--check' }
    & $runtime @arguments
    if ($LASTEXITCODE -ne 0) { throw 'De controle van de behandelpagina''s is mislukt.' }
} finally {
    $env:ELECTRON_RUN_AS_NODE = $previous
}
