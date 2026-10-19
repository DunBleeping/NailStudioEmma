#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Emma NailStudio - Simple Local Web Server
Run this to start a local preview of the website
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Fix encoding on Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.absolute()
os.chdir(SCRIPT_DIR)

PORT = 8000
HANDLER = http.server.SimpleHTTPRequestHandler

print("\n" + "="*60)
print("✅ EMMA NAILSTUDIO - LOCAL SERVER")
print("="*60)
print(f"\n📁 Directory: {SCRIPT_DIR}")
print(f"🌐 URL: http://localhost:{PORT}")
print(f"\n✓ index.html: {(SCRIPT_DIR / 'index.html').exists()}")
print(f"✓ data/: {(SCRIPT_DIR / 'data').exists()}")
print(f"✓ css/: {(SCRIPT_DIR / 'css').exists()}")
print(f"✓ js/: {(SCRIPT_DIR / 'js').exists()}")

print("\n" + "="*60)
print("🚀 Server is running!")
print("="*60)
print(f"\n👉 OPEN IN BROWSER: http://localhost:{PORT}")
print("\n⏹️  STOP SERVER: Press Ctrl+C")
print("\n" + "="*60 + "\n")

try:
    with socketserver.TCPServer(("", PORT), HANDLER) as httpd:
        print(f"[Server] Listening on port {PORT}...")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n\n[Server] Shutdown requested")
    sys.exit(0)
except OSError as e:
    print(f"\n❌ Error: {e}")
    print(f"\nPort {PORT} is already in use!")
    print("Try killing other Python processes or use a different port")
    sys.exit(1)
