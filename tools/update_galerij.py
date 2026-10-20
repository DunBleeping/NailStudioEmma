"""Werkt de albums onder 'Impressie' bij op basis van de foto's in de albummappen.

Gebruik (vanuit de projectmap):  python tools/update_galerij.py

Voor elk album in data/gallery.json met een "folder" wordt images/gallery/<folder>/
gescand. Alle .jpg/.jpeg/.png/.webp-bestanden komen (op naam gesorteerd) in "photos".
Onderschriften kunnen in een descript.ion in die map staan: "bestandsnaam onderschrift".
Elke foto krijgt ?v=<hash>, zodat een vervangen foto direct zichtbaar is ondanks de cache.
"""

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GALLERY_JSON = ROOT / 'data' / 'gallery.json'
GALLERY_DIR = ROOT / 'images' / 'gallery'
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_SIZE_KB = 500


def read_captions(folder: Path) -> dict:
    path = folder / 'descript.ion'
    if not path.exists():
        return {}
    raw = path.read_bytes()
    try:
        text = raw.decode('utf-8-sig')
    except UnicodeDecodeError:
        text = raw.decode('cp1252')
    captions = {}
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith('"'):
            end = line.find('"', 1)
            if end == -1:
                continue
            name, caption = line[1:end], line[end + 1:].strip()
        else:
            name, _, caption = line.partition(' ')
        if caption:
            captions[name.lower()] = caption.strip()
    return captions


def main() -> int:
    data = json.loads(GALLERY_JSON.read_text(encoding='utf-8-sig'))
    warnings = []

    for album in data.get('images', []):
        folder_name = album.get('folder')
        if not folder_name:
            continue
        folder = GALLERY_DIR / folder_name
        folder.mkdir(parents=True, exist_ok=True)

        existing = {Path(p['src'].split('?')[0]).name.lower(): p for p in album.get('photos', []) if p.get('src')}
        captions = read_captions(folder)

        photos = []
        for file in sorted(folder.iterdir(), key=lambda f: f.name.lower()):
            if not file.is_file() or file.suffix.lower() not in EXTENSIONS:
                continue
            if ' ' in file.name:
                warnings.append(f'{folder_name}/{file.name}: spaties in bestandsnaam, overgeslagen')
                continue
            size_kb = file.stat().st_size // 1024
            if size_kb > MAX_SIZE_KB:
                warnings.append(f'{folder_name}/{file.name}: {size_kb} KB (aanbevolen < {MAX_SIZE_KB} KB)')

            version = hashlib.md5(file.read_bytes()).hexdigest()[:8]
            photo = {'src': f'./images/gallery/{folder_name}/{file.name}?v={version}'}
            previous = existing.get(file.name.lower(), {})
            caption = captions.get(file.name.lower()) or previous.get('caption')
            if caption:
                photo['caption'] = caption
            if previous.get('alt'):
                photo['alt'] = previous['alt']
            photos.append(photo)

        album['photos'] = photos
        print(f"{album.get('title', folder_name)}: {len(photos)} foto('s)")

    GALLERY_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')

    for warning in warnings:
        print(f'LET OP: {warning}')
    print(f'\n{GALLERY_JSON.relative_to(ROOT)} bijgewerkt.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
