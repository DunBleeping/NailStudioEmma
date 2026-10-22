"""Compatibele ingang: de gedeelde albumgenerator draait in PowerShell 7."""

import shutil
import subprocess
import sys
from pathlib import Path


def main() -> int:
    pwsh = shutil.which("pwsh")
    if not pwsh:
        print("PowerShell 7 ontbreekt. Installeer PowerShell 7 en voer "
              r".\tools\update-galerij.ps1 uit.", file=sys.stderr)
        return 1
    return subprocess.run([
        pwsh, "-NoProfile", "-File",
        str(Path(__file__).with_name("update-galerij.ps1")),
    ], check=False).returncode


if __name__ == "__main__":
    sys.exit(main())
